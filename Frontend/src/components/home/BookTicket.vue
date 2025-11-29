<template>
   <div class="container-fluid">
      <Header></Header>

      <main>
         <!-- THÔNG TIN PHIM -->
         <div class="container-fluid w-75">
            <div class="movie-card">
               <div class="movie-poster">
                  <img
                     :src="posterSrc(film.poster)"
                     alt="J-HOPE TOUR: HOPE ON THE STAGE THE MOVIE"
                  />
               </div>

               <div class="movie-info">
                  <h3 class="movie-title">
                     <a href="">{{ film.name }}</a>
                  </h3>

                  <p class="movie-desc">
                     {{ film.description }}
                  </p>

                  <div class="movie-meta">
                     <div class="meta-item">
                        <strong>Đạo diễn:</strong>
                        <a class="mx-2" href="">{{ film.director }}</a>
                     </div>
                     <div class="meta-item">
                        <strong>Diễn viên:</strong>
                        <a class="mx-2" href="">{{ film.actor }}</a>
                     </div>
                     <div class="meta-item">
                        <strong>Thể loại:</strong>
                        <a class="mx-2" href="">{{ categoryNames }}</a>
                     </div>
                     <div class="meta-item">
                        <strong>Khởi chiếu: </strong>{{ formatYYYYMMDD(film.releaseDate) }}
                     </div>
                     <div class="meta-item">
                        <strong>Thời lượng: </strong>{{ film.duration }} phút
                     </div>
                  </div>

                  <div class="movie-actions">
                     <a href="http://localhost:5173/?tab=Films" class="btn-back">
                        ← Chọn phim khác
                     </a>
                  </div>
               </div>
            </div>
         </div>

         <!-- CÁC BƯỚC ĐỂ ĐẶT VÉ -->
         <div class="order-steps fixed-top" :style="`--current-step:${step}`">
            <div class="step" :class="{ active: step === 1, passed: step > 1 }" data-step="1">
               <label>01</label>
               <span class="step-label">Chọn suất chiếu</span>
            </div>

            <div class="step" :class="{ active: step === 2, passed: step > 2 }" data-step="2">
               <label>02</label>
               <span class="step-label">Chọn ghế ngồi</span>
            </div>

            <div class="step" :class="{ active: step === 3, passed: step > 3 }" data-step="3">
               <label>03</label>
               <span class="step-label">Chọn đồ uống</span>
            </div>

            <div class="step" :class="{ active: step === 4, passed: step > 4 }" data-step="4">
               <label>04</label>
               <span class="step-label">Thanh toán</span>
            </div>
         </div>

         <!-- LỊCH CHIẾU -->
         <div class="container-fluid w-75">
            <section class="showtime-section">
               <div class="container">
                  <!-- Tiêu đề -->
                  <h3 class="section-title"><i class="bi bi-calendar3 mx-2"></i> LỊCH CHIẾU</h3>

                  <div class="row g-5">
                     <!-- Bên trái: Danh sách suất chiếu -->
                     <div class="col-lg-8">
                        <div
                           v-if="filteredSchedules.length === 0"
                           class="no-showtime text-center py-5"
                        >
                           <i class="bi bi-emoji-frown display-4 text-muted d-block mb-3"></i>
                           <p class="text-muted fs-5">Không có suất chiếu trong ngày này</p>
                        </div>

                        <div v-else class="showtime-grid">
                           <button
                              v-for="schedule in filteredSchedules"
                              :key="schedule.id"
                              @click="selectSchedule(schedule)"
                              class="showtime-card"
                              :class="{ selected: selectedSchedule?.id === schedule.id }"
                           >
                              <div class="time">{{ schedule.showTime }}</div>
                              <small class="room" v-if="schedule.room"
                                 >Phòng {{ schedule.room }}</small
                              >
                           </button>
                        </div>
                     </div>

                     <!-- Bên phải: Lịch chọn ngày -->
                     <div class="col-lg-4">
                        <div class="calendar-card">
                           <div class="calendar-header">
                              <button @click="prevMonth" class="nav-btn">
                                 <i class="bi bi-chevron-left"></i>
                              </button>
                              <h5 class="month-year">{{ formatMonthYear(currentMonth) }}</h5>
                              <button @click="nextMonth" class="nav-btn">
                                 <i class="bi bi-chevron-right"></i>
                              </button>
                           </div>

                           <div class="calendar-weekdays">
                              <span
                                 v-for="day in ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']"
                                 :key="day"
                              >
                                 {{ day }}
                              </span>
                           </div>

                           <div class="calendar-days">
                              <div
                                 v-for="cell in calendarDays"
                                 :key="cell.key"
                                 class="day-cell"
                                 :class="{
                                    empty: !cell.date,
                                    today: cell.date && isToday(cell.date),
                                    selected: cell.date && isSameDay(cell.date, selectedDate),
                                    'has-showtime': cell.hasShowtime,
                                    clickable: cell.date,
                                 }"
                                 @click="cell.date && selectDate(cell.date)"
                              >
                                 <span v-if="cell.date">{{ formatDay(cell.date) }}</span>
                                 <div v-if="cell.hasShowtime" class="dot"></div>
                              </div>
                           </div>

                           <div class="selected-info">
                              <i class="bi bi-calendar-check"></i>
                              <span>{{ formatDateWithDay(selectedDate) }}</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <!-- Nút mua vé -->
                  <!-- <div class="text-center mt-5" v-if="selectedSchedule">
                     <button @click="buyTicket" class="btn-buy-ticket">
                        <i class="bi bi-ticket-perforated me-2"></i>
                        MUA VÉ NGAY
                     </button>
                  </div> -->
               </div>
            </section>
         </div>

         <!-- GHẾ NGỒI -->
         <div class="container-fluid w-75 my-5">
            <div class="row">
               <div class="col-lg-8">
                  <div class="cinema-map">
                     <div class="screen"></div>

                     <div class="legend">
                        <div class="legend-column">
                           <div><span class="seat-item standard"></span> Ghế thường</div>
                           <div><span class="seat-item vip"></span> Ghế VIP</div>
                        </div>
                        <div class="legend-column">
                           <div><span class="seat-item couple"></span> Ghế đôi</div>
                           <div><span class="seat-item selected"></span> Đang chọn</div>
                        </div>
                        <div class="legend-column">
                           <div>
                              <span class="seat-item seat-holding-other"></span> Đang chọn bởi người
                              khác
                           </div>
                           <div><span class="seat-item disabled"></span> Đã bán</div>
                        </div>
                     </div>

                     <table>
                        <tr v-for="row in seatRows" :key="row.label">
                           <td
                              v-for="seat in row.seats"
                              :key="seat.seatId"
                              :colspan="seat.seatType === 'Ghế Couple' ? 2 : 1"
                              class="seat-td"
                           >
                              <div
                                 class="seat-wrapper"
                                 :class="{ 'couple-wrapper': seat.seatType === 'Ghế Couple' }"
                              >
                                 <div
                                    vdebit
                                    v-if="seat.seatType !== 'Ghế Couple'"
                                    :class="[
                                       'seat-item',
                                       { standard: seat.seatType === 'Ghế Thường' },
                                       { vip: seat.seatType === 'Ghế VIP' },
                                       {
                                          selected:
                                             seat.status === 'holding' &&
                                             seat.holderId === currentUser,
                                       },
                                       { disabled: seat.status === 'booked' },
                                       {
                                          'holding-other':
                                             seat.status === 'holding' &&
                                             seat.holderId !== currentUser,
                                       },
                                    ]"
                                    @click="toggleSeat(seat)"
                                 ></div>

                                 <div v-else class="couple-seat-pair">
                                    <div
                                       v-for="n in 2"
                                       :key="n"
                                       :class="[
                                          'seat-item',
                                          'couple-single',
                                          {
                                             selected:
                                                seat.status === 'holding' &&
                                                seat.holderId === currentUser,
                                          },
                                          { disabled: seat.status === 'booked' },
                                          {
                                             'holding-other':
                                                seat.status === 'holding' &&
                                                seat.holderId !== currentUser &&
                                                seat.holderId != null,
                                          },
                                       ]"
                                       @click="toggleSeat(seat)"
                                    ></div>
                                 </div>
                              </div>
                           </td>
                        </tr>
                     </table>
                  </div>
               </div>

               <!-- Giỏ vé -->
               <div class="col-lg-4">
                  <div class="ticket-cart">
                     <!-- Card chính -->
                     <div class="cart-card">
                        <!-- Thông tin rạp & suất chiếu -->
                        <div class="cinema-header">
                           <h3 class="cinema-name">{{ selectedSchedule.roomName }}</h3>
                           <p class="session-details">
                              <span class="hall"></span> •
                              {{ formatYYYYMMDD(selectedSchedule.scheduleDate) }} • Suất chiếu:
                              {{ selectedSchedule.showTime }}
                           </p>
                        </div>

                        <hr class="divider" />

                        <!-- Tên phim -->
                        <h2 class="movie-title">{{film.name?.toUpperCase()}}</h2>

                        <!-- Tag thông tin -->
                        <div class="movie-tags">
                           <span class="age-rating T16">{{film.country}}</span>
                           <span class="tag">{{film.director}}</span>
                           <span class="tag">{{film.duration}} phút</span>
                        </div>

                        <!-- Danh sách vé -->
                        <div class="ticket-items">
                           <div class="ticket-row">
                              <div class="ticket-info">
                                 <strong>2 x Adult-Stand-2D</strong>
                                 <p class="seats">Ghế: A1, A2</p>
                              </div>
                              <div class="ticket-price">206.000 VND</div>
                           </div>
                        </div>

                        <hr class="divider" />

                        <!-- Tổng tiền -->
                        <div class="total-section">
                           <div class="total-label">Tổng tiền</div>
                           <div class="total-amount">206.000 VND</div>
                        </div>

                        <!-- Nút hành động -->
                        <div class="action-buttons">
                           <button class="btn-food">
                              Chọn đồ ăn <span class="step-counter">(2/4)</span>
                           </button>

                           <a href="#/" class="btn-back"> ← Trở lại chọn ghế </a>

                           <!-- Đếm ngược -->
                           <div class="countdown-timer">
                              Còn lại <span class="timer">6 phút, 34 giây</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </main>

      <footer class="text-center py-4 bg-dark text-white">
         <p class="mb-0">© 2025 VietCine. All Rights Reserved.</p>
      </footer>
   </div>
</template>

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
         const response = await axios.get(`${API_BASE_URL}/customer/schedules/${film.value.id}`);
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
               showAntiGapError();
            } else {
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
               showAntiGapError();
            } else {
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

<style scoped>
   main {
      margin-top: 22%;
   }

   /* STYLE CỦA CÁC BƯỚC ĐẶT VÉ*/
   .order-steps {
      --primary-color: #257f1f;
      --inactive-color: #d9d9d9;

      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 900px;
      margin: 40px auto;
      position: relative;
      z-index: inherit;

      --total-steps: 4;
   }

   .order-steps::before {
      content: '';
      position: absolute;
      top: 21px;
      left: calc(50px / 2);
      right: calc(50px / 2);
      height: 3px;
      background: var(--inactive-color);
      z-index: 0;
   }

   .order-steps::after {
      content: '';
      position: absolute;
      top: 21px;
      left: calc(50px / 2);
      height: 3px;
      background: var(--primary-color);
      z-index: 1;
      width: calc((var(--current-step) - 1) / (var(--total-steps) - 1) * 90%);
      transition: 0.3s ease;
   }

   .order-steps .step {
      text-align: center;
      position: relative;
      z-index: 2;
   }

   .order-steps .step label {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #fff;
      border: 3px solid var(--inactive-color);
      font-weight: 700;
      font-size: 18px;
      color: #999;
      transition: 0.3s ease;
   }

   .order-steps .step .step-label {
      font-size: 20px;
      font-weight: bold;
      color: #777;
      margin-top: 6px;
   }

   /* Bước hiện tại */
   .order-steps .step.active label {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: #fff;
      box-shadow: 0 0 18px rgba(148, 233, 0, 0.4);
   }

   .order-steps .step.active .step-label {
      color: #333;
      font-weight: 600;
   }

   /* Bước đã qua */
   .order-steps .step.passed label {
      border-color: var(--primary-color);
      color: var(--primary-color);
   }

   /* STYLE CỦA THÔNG TIN PHIM */
   .movie-card {
      --primary-color: #72be43; /* màu chủ đạo của bạn */
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 30px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;
   }

   .movie-card:hover {
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
      transform: translateY(-4px);
   }

   .movie-poster {
      flex: 0 0 280px;
      max-width: 280px;
   }

   .movie-poster img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 12px;
      display: block;
   }

   .movie-info {
      flex: 1;
      padding: 20px 24px 24px;
      min-width: 300px;
      display: flex;
      flex-direction: column;
   }

   .movie-title {
      margin: 0 0 12px;
      font-size: 24px;
      font-weight: 700;
      line-height: 1.3;
   }

   .movie-title a {
      color: var(--primary-color);
      text-decoration: none;
      transition: opacity 0.2s;
   }

   .movie-title a:hover {
      opacity: 0.8;
   }

   .movie-desc {
      color: #555;
      line-height: 1.6;
      margin-bottom: 20px;
      font-size: 20px;
   }

   .movie-meta {
      margin-bottom: 24px;
      font-size: 20px;
      color: #444;
      line-height: 1.7;
   }

   .movie-meta strong {
      color: #222;
   }

   .movie-meta a {
      color: var(--primary-color);
      text-decoration: none;
      border-bottom: 1px dotted var(--primary-color);
   }

   .movie-meta a:hover {
      border-bottom-style: solid;
   }

   .movie-actions {
      margin-top: auto;
   }

   .btn-back {
      display: inline-block;
      padding: 10px 20px;
      background: transparent;
      color: var(--primary-color);
      border: 2px solid var(--primary-color);
      border-radius: 50px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
   }

   .btn-back:hover {
      background: var(--primary-color);
      color: white;
   }

   /* Responsive */
   @media (max-width: 992px) {
      .movie-poster {
         flex: 0 0 240px;
         max-width: 240px;
      }
   }

   @media (max-width: 768px) {
      .movie-card {
         flex-direction: column;
      }
      .movie-poster {
         flex: none;
         max-width: 100%;
      }
      .movie-poster img {
         border-radius: 12px 12px 0 0;
      }
      .movie-info {
         padding: 20px;
      }
      .movie-title {
         font-size: 22px;
      }
   }

   /* STYLE CỦA LỊCH CHIẾU */
   .showtime-section {
      background: linear-gradient(135deg, #f8f9ff 0%, #f0f6ff 100%);
      padding: 60px 0;
      border-radius: 24px;
      margin-top: 40px;
      overflow: hidden;
      position: relative;
   }

   .showtime-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><circle cx="100" cy="100" r="80" fill="%2372be4333"/><circle cx="900" cy="200" r="60" fill="%2372be4399"/><circle cx="100" cy="800" r="100" fill="%2372be4322"/></svg>');
      pointer-events: none;
      opacity: 0.4;
   }

   .section-title {
      text-align: center;
      font-size: 24px;
      font-weight: 800;
      color: #198754;
      margin-bottom: 40px;
      text-shadow: 0 2px 10px rgba(25, 135, 84, 0.15);
   }

   /* Suất chiếu */
   .showtime-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 18px;
   }

   .showtime-card {
      background: white;
      border: none;
      border-radius: 20px;
      padding: 20px 12px;
      cursor: pointer;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
      position: relative;
      overflow: hidden;
   }

   .showtime-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #72be43, #198754);
      opacity: 0;
      transition: opacity 0.3s;
      border-radius: 20px;
   }

   .showtime-card .time {
      font-size: 15px;
      font-weight: 800;
      color: #333;
      position: relative;
      z-index: 2;
   }

   .showtime-card .room {
      color: #666;
      font-weight: 500;
      position: relative;
      z-index: 2;
   }

   .showtime-card:hover {
      transform: translateY(-8px) scale(1.03);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
   }

   .showtime-card.selected {
      color: white !important;
      transform: translateY(-6px) scale(1.05);
      box-shadow: 0 20px 45px rgba(25, 135, 84, 0.4);
   }

   .showtime-card.selected::before {
      opacity: 1;
   }

   .showtime-card.selected .time,
   .showtime-card.selected .room {
      color: white;
   }

   /* Lịch */
   .calendar-card {
      background: white;
      border-radius: 24px;
      padding: 24px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 20px;
      border: 1px solid rgba(114, 190, 67, 0.15);
   }

   .calendar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
   }

   .nav-btn {
      width: 40px;
      height: 40px;
      border: 2px solid #72be43;
      background: transparent;
      border-radius: 50%;
      color: #72be43;
      font-size: 1.1rem;
      transition: all 0.3s;
   }

   .nav-btn:hover {
      background: #72be43;
      color: white;
      transform: scale(1.1);
   }

   .month-year {
      font-weight: 800;
      color: #198754;
      margin: 0;
   }

   .calendar-weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      text-align: center;
      font-weight: 600;
      color: #72be43;
      font-size: 0.85rem;
      margin-bottom: 10px;
   }

   .calendar-days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 8px;
   }

   .day-cell {
      height: 48px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 16px;
      font-weight: 600;
      position: relative;
      transition: all 0.3s ease;
   }

   .day-cell.empty {
      background: transparent;
   }

   .day-cell.clickable {
      cursor: pointer;
   }

   .day-cell:hover:not(.empty) {
      background: #f0f8ff;
      transform: scale(1.1);
   }

   .day-cell.today {
      background: #d1fae5;
      color: #065f46;
      border: 2px solid #10b981;
   }

   .day-cell.selected {
      background: linear-gradient(135deg, #198754, #72be43);
      color: white;
      transform: scale(1.15);
      box-shadow: 0 8px 25px rgba(25, 135, 84, 0.4);
      z-index: 10;
   }

   .day-cell.has-showtime .dot {
      width: 8px;
      height: 8px;
      background: #72be43;
      border-radius: 50%;
      margin-top: 4px;
   }

   .selected-info {
      text-align: center;
      margin-top: 20px;
      padding: 12px;
      background: #f8fff8;
      border-radius: 12px;
      color: #198754;
      font-weight: 600;
      font-size: 0.95rem;
   }

   /* Nút mua vé */
   .btn-buy-ticket {
      background: linear-gradient(135deg, #198754, #72be43);
      color: white;
      border: none;
      padding: 16px 50px;
      font-size: 1.3rem;
      font-weight: 800;
      border-radius: 50px;
      box-shadow: 0 10px 30px rgba(25, 135, 84, 0.4);
      transition: all 0.4s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
   }

   .btn-buy-ticket:hover {
      transform: translateY(-5px) scale(1.05);
      box-shadow: 0 20px 50px rgba(25, 135, 84, 0.5);
   }

   /* Responsive */
   @media (max-width: 992px) {
      .calendar-card {
         position: static;
      }
      .showtime-grid {
         grid-template-columns: repeat(4, 1fr);
      }
   }

   @media (max-width: 576px) {
      .showtime-grid {
         grid-template-columns: repeat(3, 1fr);
      }
      .section-title {
         font-size: 1.8rem;
      }
      .btn-buy-ticket {
         padding: 14px 40px;
         font-size: 1.1rem;
      }
   }

   /* STYLE CỦA GHẾ NGỒI */
   .cinema-map {
      user-select: none;
      font-family: Arial, sans-serif;
   }

   table {
      margin: 0 auto;
      border-collapse: separate;
      border-spacing: 6px;
   }

   .seat-wrapper {
      display: flex;
      justify-content: center;
      gap: 4px;
   }

   .seat-item {
      display: block;
      width: 36px;
      height: 36px;
      background: center/contain no-repeat;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.25s ease;
   }

   /* Ghế loại */
   .seat-item.standard {
      background-image: url('http://localhost:8080/uploads/images/Ghe_thuong.png');
   }

   .seat-item.vip {
      background-image: url('http://localhost:8080/uploads/images/Ghe_vip.png');
   }

   .seat-item.couple {
      background-image: url('http://localhost:8080/uploads/images/Ghe_doi.png');
   }

   /* Chọn */
   .seat-item.selected {
      background-image: url('http://localhost:8080/uploads/images/Ghe_da_chon.png') !important;
      transform: scale(1.08);
      box-shadow: 0 0 15px rgba(0, 255, 0, 0.7);
      z-index: 10;
   }

   /* Bán/Disabled */
   .seat-item.disabled {
      background-image: url('http://localhost:8080/uploads/images/Ghe_da_ban.png') !important;
      cursor: not-allowed;
      pointer-events: none;
      transform: none !important;
      box-shadow: none !important;
   }

   .seat-item.seat-holding-other {
      background-image: url('http://localhost:8080/uploads/images/Ghe_thuong.png') !important;
      transform: scale(1.08);
      cursor: not-allowed;
      box-shadow: 0 0 15px rgba(250, 1, 1, 0.7);
      z-index: 10;
   }

   .seat-item.holding-other {
      transform: scale(1.08);
      cursor: not-allowed;
      box-shadow: 0 0 15px rgba(250, 1, 1, 0.7);
      z-index: 10;
   }

   /* Ghế đã chọn override type */
   .seat-item.standard.selected,
   .seat-item.vip.selected,
   .seat-item.couple.selected {
      background-image: url('http://localhost:8080/uploads/images/Ghe_da_chon.png') !important;
   }

   .seat-td {
      text-align: center;
      vertical-align: middle;
      padding: 4px 0;
   }

   /* Wrapper cho ghế couple: căn giữa 2 ghế nhỏ */
   .couple-wrapper {
      justify-content: center;
   }

   /* Nhóm 2 ghế couple */
   .couple-seat-pair {
      display: flex;
      gap: 6px; /* khoảng cách giữa 2 ghế nhỏ */
      align-items: center;
   }

   /* Ghế nhỏ dành riêng cho couple */
   .seat-item.couple-single {
      width: 30px !important; /* nhỏ hơn ghế thường */
      height: 30px !important;
      background-image: url('http://localhost:8080/uploads/images/Ghe_doi.png') !important;
      background-size: 100% 100%; /* hoặc contain tùy bạn muốn */
      flex-shrink: 0;
   }

   /* Khi ghế couple được chọn → cả 2 ghế đều chuyển thành ghế đã chọn */
   .couple-single.selected {
      background-image: url('http://localhost:8080/uploads/images/Ghe_da_chon.png') !important;
      transform: scale(1.08);
      animation: pulseGreen 1.6s infinite ease-in-out !important;
      box-shadow: 0 0 15px rgba(0, 255, 0, 0.7);
   }

   /* Khi ghế couple đã bán */
   .couple-single.disabled {
      background-image: url('http://localhost:8080/uploads/images/Ghe_da_ban.png') !important;
      cursor: not-allowed;
      pointer-events: none;
      transform: none !important;
      box-shadow: none !important;
   }

   .couple-single.holding-other {
      /* background-image: url('http://localhost:8080/uploads/images/Ghe_thuong.png') !important; */
      transform: scale(1.1) !important;
      box-shadow: 0 0 20px rgba(255, 0, 0, 0.9) !important;
      animation: pulseRed 1.4s infinite ease-in-out !important;
      cursor: not-allowed;
      position: relative;
      z-index: 10;
   }

   /* (Tùy chọn) Nếu bạn muốn ghế couple nhỏ hơn một chút nữa */
   .couple-single {
      border-radius: 5px;
   }

   .screen {
      width: 100%;
      max-width: 720px;
      height: 80px;
      margin: 0 auto 50px;
      background: url('http://localhost:8080/uploads/images/Screen.png') center/contain no-repeat;
      background-size: 100% 100%;
      filter: drop-shadow(0 10px 30px rgba(0, 255, 255, 0.3));
   }

   .legend {
      display: flex;
      justify-content: center;
      gap: 40px;
      margin: 50px 0;
      flex-wrap: wrap;
      font-size: 15px;
      font-weight: 500;
      color: #333;
   }

   /* Mỗi cột chứa 2 mục */
   .legend-column {
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: flex-start;
      min-width: 180px;
   }

   .legend-column > div {
      display: flex;
      align-items: center;
      gap: 12px;
      white-space: nowrap;
   }

   .legend .seat-item {
      width: 34px;
      height: 34px;
      flex-shrink: 0;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
   }

   .legend .seat-holding-other {
      background-image: url('http://localhost:8080/uploads/images/Ghe_thuong.png') !important;
      background-size: cover;
      box-shadow: 0 0 15px rgba(255, 0, 0, 0.8) !important;
      animation: pulseRed 1.6s infinite ease-in-out !important;
   }

   /* STYLE CỦA GIỎ VÉ */
   .ticket-cart {
      --primary: #72be43;
      --primary-dark: #5aa136;
      --text: #222;
      --text-light: #666;
      --border: #e0e0e0;
      --bg: #ffffff;
      padding: 20px 0;
      font-family: 'Be Vietnam Pro', sans-serif;
   }

   .cart-card {
      max-width: 420px;
      margin: 0 auto;
      background: var(--bg);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
      border: 1px solid var(--border);
      transition: all 0.3s ease;
   }

   .cart-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);
   }

   /* Header rạp */
   .cinema-header {
      padding: 20px 24px 16px;
      background: linear-gradient(135deg, #f8fff8, #f0fdf4);
      border-bottom: 1px dashed #ddd;
   }

   .cinema-name {
      margin: 0 0 6px;
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--primary-dark);
   }

   .session-details {
      margin: 0;
      font-size: 0.95rem;
      color: var(--text-light);
   }

   .hall {
      font-weight: 600;
      color: var(--primary);
   }

   /* Tên phim */
   .movie-title {
      margin: 20px 24px 12px;
      font-size: 1.55rem;
      font-weight: 800;
      color: var(--text);
      line-height: 1.3;
   }

   /* Tag */
   .movie-tags {
      display: flex;
      gap: 10px;
      margin: 0 24px 20px;
      flex-wrap: wrap;
   }

   .age-rating {
      background: #dc3545;
      color: white;
      padding: 4px 10px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 0.8rem;
   }

   .tag {
      background: #f1f1f1;
      color: #444;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 500;
   }

   /* Vé đã chọn */
   .ticket-items {
      padding: 0 24px;
   }

   .ticket-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 0;
      border-bottom: 1px dashed #eee;
   }

   .ticket-info strong {
      font-size: 1.05rem;
      color: var(--text);
   }

   .seats {
      margin: 4px 0 0;
      color: var(--primary);
      font-weight: 600;
      font-size: -circle;
   }

   .ticket-price {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--primary-dark);
   }

   /* Tổng tiền */
   .total-section {
      display: flex;
      justify-content: space-between;
      padding: 20px 24px;
      background: #f8fff8;
      font-size: 1.3rem;
      font-weight: 800;
      color: var(--text);
   }

   .total-amount {
      color: var(--primary-dark);
   }

   /* Nút hành động */
   .action-buttons {
      padding: 24px;
      text-align: center;
      background: #fafafa;
   }

   .btn-food {
      display: block;
      width: 100%;
      padding: 14px 20px;
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      color: white;
      border: none;
      border-radius: 50px;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-bottom: 12px;
      box-shadow: 0 6px 20px rgba(114, 190, 67, 0.4);
   }

   .btn-food:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 30px rgba(114, 190, 67, 0.5);
   }

   .step-counter {
      font-size: 0.9rem;
      opacity: 0.9;
   }

   .btn-back {
      color: var(--text-light);
      text-decoration: none;
      font-size: 0.95rem;
      transition: color 0.2s;
   }

   .btn-back:hover {
      color: var(--primary);
   }

   .countdown-timer {
      margin-top: 16px;
      font-size: 1rem;
      color: #e74c3c;
      font-weight: 600;
   }

   .timer {
      font-weight: 800;
      color: #c0392b;
   }

   /* Divider */
   .divider {
      border: none;
      height: 1px;
      background: linear-gradient(to right, transparent, #ddd, transparent);
      margin: 0;
   }

   /* Responsive */
   @media (max-width: 480px) {
      .cart-card {
         margin: 0 10px;
         border-radius: 16px;
      }
      .cinema-name {
         font-size: 1.3rem;
      }
      .movie-title {
         font-size: 1.4rem;
      }
      .action-buttons {
         padding: 20px;
      }
   }

   @keyframes shake {
      0% {
         transform: translateX(0) scale(1.1);
      }
      100% {
         transform: translateX(3px) scale(1.1);
      }
   }

   @keyframes pulseRed {
      0%,
      100% {
         box-shadow: 0 0 15px rgba(255, 0, 0, 0.7);
      }
      50% {
         box-shadow: 0 0 30px rgba(255, 0, 0, 1);
      }
   }
</style>
