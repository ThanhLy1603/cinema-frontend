<template src="../template/SellTicket.template.html"></template>

<script setup>
   import axios from 'axios';
   import { ref, computed, onMounted, onBeforeMount, watch } from 'vue';
   import { jwtDecode } from 'jwt-decode';
   import SockJS from 'sockjs-client';
   import { Client } from '@stomp/stompjs';
   import { useRoute, useRouter } from 'vue-router';
   import { reduce, values } from 'lodash';

   // --- ROUTE & ROUTER ---
   const route = useRoute();
   const router = useRouter();

   // ENV
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
   const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
   const WEBSOCKET_URL = import.meta.env.VITE_WS_URL;

   const currentUser = ref('');

   function getCurrentUser() {
      const token = localStorage.getItem('token') || null;
      const decoded = jwtDecode(token);
      currentUser.value = decoded.subject;
      console.log('currentUser: ', currentUser.value);
   }

   // Xử lý hiện thị thông báo (Toast)
   const toast = ref({ message: '', type: '' });

   function showToast(msg, type = 'success') {
      toast.value = { message: msg, type };
      setTimeout(() => (toast.value.message = ''), 3000);
   }
   
   // XỬ LÝ LẤY DANH SÁCH PHIM
   const today = new Date().toLocaleDateString('vi-VN');
   const selectedShowtime = ref(null);
   const selectedSeats = ref([]);
   const films = ref([]);
   const schedules = ref([]);
   const selectedFilm = ref(null);

   async function getFilms() {
      try {
         const response = await axios.get('http://localhost:8080/api/films');
         films.value = response.data.filter((film) => {
            return film.status === 'active';
         });
         console.log('films: ', films.value);
      } catch (error) {
         console.error('Lỗi khi lấy danh sách phim: ', error.message);
      }
   }

   async function selectFilm(film) {
      selectedFilm.value = { ...film };
      film.value = { ...film };
      selectedSchedule.value = null;
      await getSchedules(film.id);
      console.log('selected film: ', selectedFilm.value);
   }

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

   function posterSrc(poster) {
      return IMAGE_URL + poster;
   }

   // XỬ LÝ LẤY DANH SÁCH LỊCH CHIẾU
   async function getSchedules(filmId) {
      if (!filmId) return;

      try {
         const response = await axios.get(`${API_BASE_URL}/schedules/film/${filmId}`);
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

   // XỬ LÝ LỊCH VÀ CHỌN SUẤT CHIẾU
   const selectedDate = ref(new Date());
   const selectedSchedule = ref(null);
   const timeLeft = ref('10:00');
   const timeLeftSeconds = ref(600);
   let countdownInterval = null;
   const scheduleId = ref('');
   const currentMonth = ref(new Date());
   const countdownKey = `count_down_start_${scheduleId.value}`;
   const TOTAL_SECONDS = 10 * 60;

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

   async function selectSchedule(schedule) {
      selectedSchedule.value = { ...schedule };
      scheduleId.value = schedule.id;
      await getScheduleSeats(schedule.id);
      await getPriceTickets(
         selectedFilm.value.id,
         selectedSchedule.value.showTimeId,
         selectedSchedule.value.scheduleDate
      );
      getPriceBySelectedSeats();

      router.push({
         path: '/staff',
         query: {
            manage: 'SellTicket',
            filmId: selectedFilm.value.id,
            scheduleId: scheduleId.value,
         },
      });

      startCountdown();

      console.log('selectedSchedule: ', selectedSchedule.value);
   }

   function startCountdown() {
      const now = Date.now();
      localStorage.setItem(countdownKey, now);
      runCountdown();
   }

   function runCountdown() {
      if (countdownInterval) {
         clearInterval(countdownInterval);
      }

      tick();
      countdownInterval = setInterval(tick, 1000);
   }

   function tick() {
      const startTime = Number(localStorage.getItem(countdownKey));

      if (!startTime) return;

      const passed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = TOTAL_SECONDS - passed;

      if (remaining <= 0) {
         timeLeft.value = '00:00';
         timeLeftSeconds.value = 0;

         clearInterval(countdownInterval);

         router.push({
            path: '/staff',
            query: { manage: 'SellTicket' }
         });

         return;
      }

      timeLeftSeconds.value = remaining;

      const minutes = Math.floor(remaining / 60);
      const seconds = remaining % 60;

      timeLeft.value = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
   }

   // XỬ LÝ CHỌN GHẾ NGỒI
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

   async function toggleSeat(seat) {
      const rowLabel = seat.position[0];

      console.log('username: ', currentUser.value);
      console.log('rowLabel: ', rowLabel);

      if (seat.status === 'holding' && seat.holderId !== currentUser.value) {
         showToast('Ghế này đang giữ bởi người khác', 'error');
         return;
      }

      if (seat.status === 'booked') {
         showToast('Ghế này đã bán', 'error');
         return;
      }

      if (seat.status === 'available') {
         const holdMinutes = Math.floor(timeLeftSeconds.value / 60);
         
         try {
            await axios.put(
               `${API_BASE_URL}/schedules/reserve-seat/${scheduleId.value}/seats/${seat.seatId}/hold`,
               {
                  holderId: currentUser.value,
                  holdMinutes: holdMinutes,
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

            getPriceBySelectedSeats();
         } catch (error) {
            console.error('Lỗi khi giữ ghế:', error.message);
         }
      } else if (seat.status === 'holding' && seat.holderId === currentUser.value) {
         try {
            await axios.put(
               `${API_BASE_URL}/schedules/reserve-seat/${scheduleId.value}/seats/${seat.seatId}/release`,
               {
                  holderId: currentUser.value,
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

            getPriceBySelectedSeats();
         } catch (error) {
            console.error('Lỗi khi bỏ chọn ghế:', error);
         }
      }
   }

   // XỬ LÝ GIÁ VÉ VÀ GIỎ VÉ
   const priceTickets = ref([]);
   const priceBySelectedSeats = ref([]);
   const priceTicketInfos = ref(null);

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

   function getPriceBySeatType(seatTypeName) {
      const foundPrice = priceTickets.value.find((price) => price.seatTypeName === seatTypeName);
      return foundPrice ? foundPrice.price : 0;
   }

   function getPriceBySelectedSeats() {
      let result = [];

      const holdingSeats = seats.value.filter(
         (item) => item.status === 'holding' && item.holderId === currentUser.value
      );

      console.log('holding seats: ', holdingSeats);

      holdingSeats.forEach((item) => {
         const price = getPriceBySeatType(item.seatType);

         result.push({
            seatId: item.seatId || '',
            position: item.position || '',
            seatType: item.seatType || '',
            price: price || 0,
         });
      });

      priceBySelectedSeats.value = result;
      console.log('price selected seat: ', priceBySelectedSeats.value);
      getPriceTicketInfos();
   }

   function getPriceTicketInfos() {
      const normalSeats = priceBySelectedSeats.value.filter(
         (seat) => seat.seatType === 'Ghế Thường'
      );

      const vipSeats = priceBySelectedSeats.value.filter((seat) => seat.seatType === 'Ghế VIP');
      const coupleSeats = priceBySelectedSeats.value.filter(
         (seat) => seat.seatType === 'Ghế Couple'
      );

      const result = {};

      if (normalSeats.length > 0) {
         result.normal = {
            seatType: 'Ghế Thường',
            postions: normalSeats.map((seat) => seat.position).join(', '),
            quantity: normalSeats.length,
            subTotal: normalSeats.reduce((sum, seat) => sum + seat.price, 0),
         };
      }

      if (vipSeats.length > 0) {
         result.vip = {
            seatType: 'Ghế VIP',
            postions: vipSeats.map((seat) => seat.position).join(', '),
            quantity: vipSeats.length,
            subTotal: vipSeats.reduce((sum, seat) => sum + seat.price, 0),
         };
      }

      if (coupleSeats.length > 0) {
         result.couple = {
            seatType: 'Ghế Couple',
            postions: coupleSeats.map((seat) => seat.position).join(', '),
            quantity: coupleSeats.length,
            subTotal: coupleSeats.reduce((sum, seat) => sum + seat.price, 0),
         };
      }

      priceTicketInfos.value = result;

      console.log('price ticket info: ', priceTicketInfos.value);
   }

   function getTotalAmount() {
      return priceBySelectedSeats.value.reduce((sum, seat) => sum + seat.price, 0);
   }

   //  XỬ LÝ THANH TOÁN 
   const formCustomer = ref({
      name: '',
      phone: '',
      address: ''
   });

   async function sellTicket() {
      let invoiceInfo = {
         invoice: {},
         tickets: []
      };

      const normalSeats = priceBySelectedSeats.value.filter(
         (seat) => seat.seatType === 'Ghế Thường'
      );

      const vipSeats = priceBySelectedSeats.value.filter(
         (seat) => seat.seatType === 'Ghế VIP'
      );

      const coupleSeats = priceBySelectedSeats.value.filter(
         (seat) => seat.seatType === 'Ghế Couple'
      );

      const totalAmount = getTotalAmount();
      const discount = 0;

      console.log('normal seats: ', normalSeats);
      console.log('vip seats: ', vipSeats);
      console.log('couple seats', coupleSeats);

      invoiceInfo.invoice = {
         customerName: formCustomer.value.name,
         customerAddress: formCustomer.value.address,
         customerPhone: formCustomer.value.phone,
         username: currentUser.value,
         totalAmount: totalAmount,
         discount: discount,
         finalAmount: totalAmount - discount,
      };

      if (normalSeats.length > 0) {
         normalSeats.forEach(seat => {
            const priceTicket = priceTickets.value.find(p => p.seatTypeName === 'Ghế Thường'); 

            invoiceInfo.tickets.push({
               scheduleId: scheduleId.value,
               seatId: seat.seatId,
               ticketPriceId: priceTicket?.id || null,
               promotionId: null
            });
         });
      }

      if (vipSeats.length > 0) {
         vipSeats.forEach(seat => {
            const priceTicket = priceTickets.value.find(p => p.seatTypeName === 'Ghế VIP'); 

            invoiceInfo.tickets.push({
               scheduleId: scheduleId.value,
               seatId: seat.seatId,
               ticketPriceId: priceTicket?.id || null,
               promotionId: null
            });
         });
      }

      if (coupleSeats.length > 0) {
         coupleSeats.forEach(seat => {
            const priceTicket = priceTickets.value.find(p => p.seatTypeName === 'Ghế Couple'); 

            invoiceInfo.tickets.push({
               scheduleId: scheduleId.value,
               seatId: seat.seatId,
               ticketPriceId: priceTicket?.id || null,
               promotionId: null
            });
         });
      }

      try {
         const response = await axios.post(`${API_BASE_URL}/staff/sell-ticket`, invoiceInfo);
         if (response.data.status === 'success') {
            console.log('Thanh toán thành công');
         } else {
            console.log('Thanh toán thất bại');
         }
      } catch (error) {
         console.error('Lỗi khi tạo hoá đơn: ', error.message);
      }

      startCountdown();

      console.log('invoice Info: ', invoiceInfo);
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

   // XỬ LÝ LOAD LẠI TRANG
   async function restoreStateUrl() {
      const filmIdFromQuery = route.query.filmId;
      const scheduleIdFromQuery = route.query.scheduleId;

      if (filmIdFromQuery) {
         const result = films.value.find((item) => item.id === filmIdFromQuery);
         selectedFilm.value = { ...result };
         await getSchedules(filmIdFromQuery);
      }

      if (scheduleIdFromQuery) {
         scheduleId.value = scheduleIdFromQuery;

         const foundSchedule = schedules.value.find(
            (schedule) => schedule.id === scheduleIdFromQuery
         );

         if (foundSchedule) {
            selectedSchedule.value = { ...foundSchedule };
         }

         await getScheduleSeats(scheduleIdFromQuery);
         await getPriceTickets(
            selectedFilm.value.id,
            selectedSchedule.value?.showTimeId,
            selectedSchedule.value?.scheduleDate
         );

         const continueTime = localStorage.getItem(countdownKey);
         if (continueTime) runCountdown();
         else timeLeft.value = '10:00';
      }
   }

   onMounted(async () => {
      getCurrentUser();
      await getFilms();
      await restoreStateUrl();
   });

   onBeforeMount(() => {
      if (countdownInterval) clearInterval(countdownInterval);
      disconnectWebSocket();
   });

   watch(
      () => scheduleId.value,
      async (newVal) => {
         if (!newVal) return;

         console.log('WATCH scheduleId →', newVal);
         connectWebSocket();

         await getScheduleSeats(newVal);

         if (selectedSchedule.value) {
            await getPriceTickets(
               selectedFilm.value.id,
               selectedSchedule.value.showTimeId,
               selectedSchedule.value.scheduleDate
            );

            getPriceBySelectedSeats();
         }
      },
      { immediate: false }
   );

   defineExpose({
      startCountdown,
      timeLeft,
      selectedFilm,
      priceTicketInfos
   });
</script>

<style src="../style/SellTicket.style.css" scoped></style>
