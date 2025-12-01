<template src="../template/BookTicket.template.html"></template>

<script setup>
   import { ref, onMounted, computed, onBeforeMount } from 'vue';
   import { useRoute, useRouter } from 'vue-router';
   import axios from 'axios';
   import { jwtDecode } from 'jwt-decode';
   import SockJS from 'sockjs-client';
   import { Client } from '@stomp/stompjs';

   import Header from '../../components/header/Header.vue';

   // --- ENV ---
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
   const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
   const VIDEO_URL = import.meta.env.VITE_VIDEO_URL;
   const WEBSOCKET_URL = import.meta.env.VITE_WS_URL;

   const token = localStorage.getItem('token') || null;
   const decoded = jwtDecode(token);
   const currentUser = decoded.subject;

   // --- ROUTE & ROUTER ---
   const route = useRoute();
   const router = useRouter();

   const film = ref({});
   const categories = ref([]);
   const step = ref(1);

   // Các hàm để xử lý thông tin phim
   function formatYYYYMMDD(dateInput) {
      if (!dateInput) return 'N/A';

      let year, month, day;

      // Nếu là string dạng 'YYYY-MM-DD'
      if (typeof dateInput === 'string') {
         const parts = dateInput.split('-');
         if (parts.length === 3) {
            [year, month, day] = parts;
         } else {
            return dateInput; // nếu string khác định dạng, giữ nguyên
         }
      }
      // Nếu là Date object
      else if (dateInput instanceof Date) {
         year = dateInput.getFullYear();
         month = String(dateInput.getMonth() + 1).padStart(2, '0');
         day = String(dateInput.getDate()).padStart(2, '0');
      } else {
         return String(dateInput); // fallback cho các kiểu khác
      }

      return `${day}/${month}/${year}`;
   }

   const categoryNames = computed(() =>
      categories.value.length ? categories.value.map((c) => c.name).join(', ') : 'Đang cập nhật...'
   );

   async function getFilm() {
      try {
         const response = await axios.get(`${API_BASE_URL}/films/${route.params.filmId}`);
         film.value = response.data;
         await getCategories();
         await getSchedules();

         console.log('film: ', film.value);
      } catch (error) {
         console.error('Lỗi khi lấy Film:', error.message);
      }
   }

   async function getCategories() {
      if (!film.value.id) return;
      try {
         const res = await axios.get(`${API_BASE_URL}/films/${film.value.id}/categories`);
         categories.value = res.data;
      } catch (err) {
         console.error('Lỗi khi lấy thể loại:', err.message);
      }
   }

   function posterSrc(poster) {
      return IMAGE_URL + poster;
   }

   // XỬ LÝ THÔNG TIN PHIM
   const selectedDate = ref(new Date());
   const selectedSchedule = ref({
      id: '',
      showTimeId: '',
      roomName: '',
      showTime: '',
      scheduleDate: '',
   });
   const schedules = ref([]);
   const scheduleId = ref('');

   const currentMonth = ref(new Date());

   function formatDateWithDay(date) {
      const d = date instanceof Date ? date : new Date(date);
      if (isNaN(d.getTime())) return 'Không xác định';
      const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const dayName = days[d.getDay()];
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${dayName}, ${day}/${month}/${year}`;
   }

   function formatMonthYear(date) {
      return date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
   }

   function formatDay(date) {
      return date.getDate();
   }

   const showtimeDates = computed(() => {
      const dates = new Set();
      if (Array.isArray(schedules.value)) {
         schedules.value.forEach((s) => {
            if (s.scheduleDate) dates.add(s.scheduleDate); // yyyy-MM-dd
         });
      }
      return dates;
   });

   // LỌC SUẤT CHIẾU THEO NGÀY ĐƯỢC CHỌN
   const filteredSchedules = computed(() => {
      const selectedStr = selectedDate.value.toISOString().split('T')[0];

      return Array.isArray(schedules.value)
         ? schedules.value.filter((schedule) => schedule.scheduleDate === selectedStr)
         : [];
   });

   // --- LỊCH (CALENDAR) ---
   function getDaysInMonth(date) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

      const days = [];
      let keyCounter = 0;

      for (let i = 0; i < startingDayOfWeek; i++) {
         days.push({ key: `empty-${keyCounter++}`, date: null });
      }
      for (let day = 1; day <= daysInMonth; day++) {
         const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
         const d = new Date(dateStr);
         days.push({
            key: `day-${keyCounter++}`,
            date: d,
            hasShowtime: showtimeDates.value.has(dateStr),
         });
      }
      return days;
   }

   const calendarDays = computed(() => getDaysInMonth(currentMonth.value));

   function prevMonth() {
      const prev = new Date(currentMonth.value);
      prev.setMonth(prev.getMonth() - 1);
      currentMonth.value = prev;
   }

   function nextMonth() {
      const next = new Date(currentMonth.value);
      next.setMonth(next.getMonth() + 1);
      currentMonth.value = next;
   }

   function selectDate(date) {
      selectedDate.value = date;
   }

   function isToday(date) {
      if (!date) return false;
      const today = new Date();
      return date.toDateString() === today.toDateString();
   }

   function isSameDay(d1, d2) {
      return d1 && d2 && d1.toDateString() === d2.toDateString();
   }

   // --- CHỌN SUẤT ---
   async function selectSchedule(schedule) {
      step.value = 2;
      selectedSchedule.value = schedule;
      scheduleId.value = schedule.id;
      console.log('scheduleId: ', scheduleId.value);
      console.log('selectedSchedule: ', selectedSchedule.value);
      router.push({
         name: 'BookTicket',
         params: { filmId: film.id },
         query: { scheduleId: schedule.id },
      });

      await getScheduleSeats(selectedSchedule.value.id);
      await getPriceTickets(
         film.value.id,
         selectedSchedule.value.showTimeId,
         selectedSchedule.value.scheduleDate
      );
   }

   async function getSchedules() {
      if (!film.value.id) return;

      try {
         const response = await axios.get(`${API_BASE_URL}/schedules/film/${film.value.id}`);
         if (Array.isArray(response.data)) {
            schedules.value = response.data.map((schedule) => ({
               id: schedule.id,
               showTimeId: schedule.showTime.id,
               roomName: schedule.room.name,
               showTime: schedule.showTime.startTime || '',
               scheduleDate: schedule.scheduleDate || '',
            }));

            console.log('schedules: ', schedules.value);
         } else {
            schedules.value = [];
         }
      } catch (error) {
         console.error('Lỗi khi lấy lịch chiếu:', error.message);
         schedules.value = [];
      }
   }

   // XỬ LÝ PHẦN GHẾ NGỒI
   const seats = ref([]);
   const antiGapError = ref('');
   const errorMessage = ref('');

   async function getScheduleSeats(scheduleId) {
      try {
         const response = axios.get(`${API_BASE_URL}/schedules/reserve-seat/${scheduleId}/seats`);

         seats.value = (await response).data;
         seats.value.sort(
            (first, second) =>
               parseInt(first.position.slice(1)) - parseInt(second.position.slice(1))
         );
         console.log('danh sách ghế ngồi: ', seats.value);
      } catch (error) {
         console.error('Lỗi khi lấy danh sách ghế ngồi: ', error.message);
      }
   }

   const seatRows = computed(() => {
      const groups = {};
      seats.value.forEach((seat) => {
         const row = seat.position[0];
         if (!groups[row]) groups[row] = [];
         groups[row].push(seat);
      });
      return Object.keys(groups)
         .sort()
         .map((label) => ({ label, seats: groups[label] }));
   });

   function getSeatsScheduleInRouter() {
      scheduleId.value = route.query.scheduleId;
      if (scheduleId.value) {
         getScheduleSeats(scheduleId.value);
      } else {
         console.warn('Không có scheduleId trên URL');
      }
   }

   async function toggleSeat(seat) {
      const rowLabel = seat.position[0];

      console.log('username: ', currentUser);
      console.log('rowLabel: ', rowLabel);

      if (seat.status === 'available') {
         try {
            await axios.put(
               `${API_BASE_URL}/schedules/reserve-seat/${scheduleId.value}/seats/${seat.seatId}/hold`,
               {
                  holderId: currentUser,
                  holdMinutes: 10,
               }
            );

            if (checkAntiGap(rowLabel)) {
               errorMessage.value = `Bạn không được để 1 ghế trống ngoài cùng bên trái hoặc phải và ở giữa
                                    trên cùng hàng ghế mà bạn chọn.`;
               showAntiGapError();
            } else {
               errorMessage.value = '';
               antiGapError.value = '';
            }
         } catch (error) {
            console.error('Lỗi khi giữ ghế:', error.message);
         }
      } else if (seat.status === 'holding' && seat.holderId === currentUser) {
         try {
            await axios.put(
               `${API_BASE_URL}/schedules/reserve-seat/${scheduleId.value}/seats/${seat.seatId}/release`,
               {
                  holderId: currentUser,
               }
            );

            if (checkAntiGap(rowLabel)) {
               errorMessage.value = `Bạn không được để 1 ghế trống ngoài cùng bên trái hoặc phải và ở giữa
                                    trên cùng hàng ghế mà bạn chọn.`;
               showAntiGapError();
            } else {
               errorMessage.value = '';
               antiGapError.value = '';
            }
         } catch (error) {
            console.error('Lỗi khi bỏ chọn ghế:', error);
         }
      }
   }

   function checkAntiGap(rowLabel) {
      const row = seatRows.value.find((row) => row.label === rowLabel);
      console.log('row: ', row);
      if (!row) return false;

      const orderedSeats = [...row.seats].sort((first, second) =>
         parseInt(first.position.slice(1) - parseInt(second.position.slice(1)))
      );

      console.log('orderedSeats: ', orderedSeats);

      const holdingIndexes = orderedSeats
         .map((seat, index) => (seat.status === 'holding' ? index : -1))
         .filter((index) => index !== -1);

      console.log('holdingIndexes: ', holdingIndexes);

      if (holdingIndexes.length < 2) return false;

      for (let i = 0; i < holdingIndexes.length - 1; i++) {
         const left = holdingIndexes[i];
         const right = holdingIndexes[i + 1];

         const middleSeats = orderedSeats.slice(left + 1, right);

         console.log('left: ', left);
         console.log('right: ', right);
         console.log('miidleSeats: ', middleSeats);

         if (middleSeats.some((seat) => seat.status === 'available')) {
            return true;
         }

         return false;
      }
   }

   function showAntiGapError() {
      antiGapError.value = 'Bạn không được để trống ghé ở giữa khi chọn cùng hàng';
      console.log('Anti Gap: ', antiGapError.value);
   }

   // XỬ LÝ GIÁ VÉ
   const priceTickets = ref([]);

   async function getPriceTickets(filmId, showTimeId, date) {
      try {
         const response = await axios.get(
            `${API_BASE_URL}/price-tickets?filmId=${filmId}&showTimeId=${showTimeId}&date=${date}`
         );
         priceTickets.value = response.data;

         console.log('priceTickets: ', priceTickets.value);
      } catch (error) {
         console.error('Lỗi khi lấy giá vé: ', error.message);
         priceTickets.value = [];
      }
   }

   // XỬ LÝ WEBSOCKET STOMP
   let stompClient = null;

   function connectWebSocket() {
      const socket = new SockJS(WEBSOCKET_URL);

      stompClient = new Client({
         webSocketFactory: () => socket,
         reconnectDelay: 2000,
         debug: (message) => console.log('Stomp JS:', message),
         onConnect: () => {
            console.log('WebSocket connected');
            stompClient?.subscribe(`/topic/seats/${scheduleId.value}`, (message) => {
               const updatedSeat = JSON.parse(message.body);
               updateSeatFromWebSocket(updatedSeat);
            });
         },
         onStompError: (frame) => {
            console.error('STOMP error: ', frame.headers['message'], frame.body);
         },
      });

      stompClient.activate();
   }

   function disconnectWebSocket() {
      if (stompClient) {
         stompClient.deactivate();
      }
   }

   function updateSeatFromWebSocket(updatedSeat) {
      const index = seats.value.findIndex((seat) => seat.seatId === updatedSeat.seatId);
      if (index != -1) {
         seats.value[index] = { ...updatedSeat };
      }
   }

   onMounted(async () => {
      await getFilm();
      getSeatsScheduleInRouter();
      connectWebSocket();
   });

   onBeforeMount(() => {
      disconnectWebSocket();
   });
</script>

<style src="../style/BookTicket.style.css" scoped></style>
