<template>
   <div class="film-detail-wrapper">
      <!-- HEADER -->
      <Header/>

      <el-steps :active="step" finish-status="success" class="promo-steps w-">
         <el-step title="Chọn suất chiếu" />
         <el-step title="Chọn ghế ngồi" />
         <el-step title="Chọn đồ ăn và đồ uống" />
         <el-step title="Đặt vé" />
      </el-steps>

      <!-- NỘI DUNG CHI TIẾT -->
      <div class="film-detail-page container py-5">
         <!-- Loading -->
         <div v-if="!film.id" class="text-center py-5 text-muted">
            <div class="spinner-border text-success"></div>
            <p class="mt-3">Đang tải thông tin phim...</p>
         </div>

         <!-- Nội dung phim -->
         <div v-else class="card shadow-lg border-0 rounded-4 overflow-hidden p-4">
            <!-- Tiêu đề + nút quay lại -->
            <div class="d-flex justify-content-between align-items-center mb-4">
               <h2 class="fw-bold text-success m-0">{{ film.name }}</h2>
               <router-link to="/" class="btn-back">Quay lại danh sách</router-link>
            </div>

            <div class="row g-4 align-items-start">
               <!-- Poster -->
               <div class="col-md-4 text-center">
                  <img
                     :src="IMAGE_URL + film.poster"
                     alt="Poster"
                     class="img-fluid rounded shadow-sm mb-4"
                  />
               </div>

               <!-- Thông tin + Trailer -->
               <div class="col-md-8">
                  <div class="film-info">
                     <p><strong>Đạo diễn:</strong> {{ film.director }}</p>
                     <p><strong>Diễn viên:</strong> {{ film.actor }}</p>
                     <p><strong>Thể loại:</strong> {{ categoryNames }}</p>
                     <p><strong>Thời lượng:</strong> {{ film.duration }} phút</p>
                     <p><strong>Ngày khởi chiếu:</strong> {{ formatYYYYMMDD(film.releaseDate) }}</p>
                     <p><strong>Trạng thái:</strong> {{ film.status }}</p>
                  </div>

                  <div class="film-description mt-4">
                     <h5 class="fw-bold mb-2">Tóm tắt nội dung</h5>
                     <p class="text-secondary">{{ film.description }}</p>
                  </div>

                  <!-- Trailer -->
                  <div v-if="film.trailer" class="film-trailer mt-5">
                     <h5 class="fw-bold text-primary mb-3">Trailer chính thức</h5>
                     <video
                        :src="VIDEO_URL + film.trailer"
                        controls
                        class="w-100 rounded shadow-sm border"
                     ></video>
                  </div>
               </div>
            </div>

            <!-- LỊCH CHIẾU + LỊCH (CALENDAR) -->
            <div class="showtime-section bg-white rounded-4 shadow-sm p-4 mt-5">
               <h4 class="fw-bold text-success mb-4 text-center">LỊCH CHIẾU</h4>

               <div class="row g-4">
                  <!-- TRÁI: Lịch chiếu -->
                  <div class="col-lg-8">
                     <div class="showtime-grid">
                        <div
                           v-for="showtime in filteredShowtimes"
                           :key="showtime.id"
                           class="showtime-item"
                        >
                           <button
                              @click="selectShowtime(showtime)"
                              class="showtime-card"
                              :class="{ selected: selectedShowtime?.id === showtime.id }"
                           >
                              <span class="fs-4 fw-bold">{{ showtime.showTimes }}</span>
                           </button>
                        </div>
                     </div>

                     <!-- Không có suất -->
                     <div v-if="filteredShowtimes.length === 0" class="text-center py-4 text-muted">
                        <p>Không có suất chiếu trong ngày này</p>
                     </div>
                  </div>

                  <!-- PHẢI: LỊCH (CALENDAR) -->
                  <div class="col-lg-4">
                     <div class="calendar-sticky bg-white p-3 rounded-3 shadow-sm">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                           <button
                              @click="prevMonth"
                              class="btn btn-sm btn-outline-secondary rounded-pill px-3"
                           >
                              
                           </button>
                           <h6 class="m-0 fw-bold text-success">
                              {{ formatMonthYear(currentMonth) }}
                           </h6>
                           <button
                              @click="nextMonth"
                              class="btn btn-sm btn-outline-secondary rounded-pill px-3"
                           >
                              >
                           </button>
                        </div>

                        <!-- Lịch -->
                        <div class="calendar-grid">
                           <div
                              class="text-center text-muted small fw-bold"
                              v-for="day in ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']"
                              :key="day"
                           >
                              {{ day }}
                           </div>
                           <div
                              v-for="cell in calendarDays"
                              :key="cell.key"
                              class="calendar-day text-center"
                              :class="{
                                 empty: !cell.date,
                                 today: cell.date && isToday(cell.date),
                                 selected: cell.date && isSameDay(cell.date, selectedDate),
                                 'has-showtime': cell.hasShowtime,
                              }"
                              @click="cell.date && selectDate(cell.date)"
                           >
                              <span v-if="cell.date">{{ formatDay(cell.date) }}</span>
                           </div>
                        </div>

                        <!-- Ngày hiện tại -->
                        <div class="text-center mt-3">
                           <small class="text-success fw-bold">{{
                              formatDateWithDay(selectedDate)
                           }}</small>
                        </div>
                     </div>
                  </div>
               </div>

               <!-- Nút mua vé -->
               <div class="text-center mt-4" v-if="selectedShowtime">
                  <button
                     @click="buyTicket"
                     class="btn btn-success btn-lg rounded-pill px-5 py-3 fw-bold shadow-sm"
                  >
                     MUA VÉ NGAY
                  </button>
               </div>
            </div>
         </div>
      </div>

      <!-- FOOTER -->
      <footer class="bg-dark text-white text-center py-3 mt-5">
         <p class="mb-0">© 2025 VietCine | All Rights Reserved</p>
      </footer>
   </div>
</template>

<script setup>
   import { ref, onMounted, computed } from 'vue';
   import { useRoute, useRouter } from 'vue-router';
   import axios from 'axios';
   import Header from '../../components/header/Header.vue';

   // --- ENV ---
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
   const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
   const VIDEO_URL = import.meta.env.VITE_VIDEO_URL;

   // --- ROUTE & ROUTER ---
   const route = useRoute();
   const router = useRouter();

   // --- STATE ---
   const film = ref({});
   const categories = ref([]);
   const showtimes = ref([]); // Mảng
   const selectedDate = ref(new Date());
   const selectedShowtime = ref(null);

   // --- LỊCH (CALENDAR) ---
   const currentMonth = ref(new Date());

   // --- HÀM ĐỊNH DẠNG ---
   function formatYYYYMMDD(dateStr) {
      if (!dateStr) return 'N/A';
      const [y, m, d] = dateStr.split('-');
      return `${d}/${m}/${y}`;
   }

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

   // --- COMPUTED ---
   const categoryNames = computed(() =>
      categories.value.length ? categories.value.map((c) => c.name).join(', ') : 'Đang cập nhật...'
   );

   // Cache danh sách ngày có suất (yyyy-MM-dd)
   const showtimeDates = computed(() => {
      const dates = new Set();
      if (Array.isArray(showtimes.value)) {
         showtimes.value.forEach((s) => {
            if (s.scheduleDate) dates.add(s.scheduleDate); // yyyy-MM-dd
         });
      }
      return dates;
   });

   // Lọc suất chiếu theo ngày được chọn
   const filteredShowtimes = computed(() => {
      const selectedStr = selectedDate.value.toISOString().split('T')[0]; // yyyy-MM-dd

      return Array.isArray(showtimes.value)
         ? showtimes.value.filter((s) => s.scheduleDate === selectedStr)
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

   // --- CHỌN SUẤT & MUA VÉ ---
   function selectShowtime(showtime) {
      selectedShowtime.value = showtime;
   }

   function buyTicket() {
      if (selectedShowtime.value) {
         router.push({
            name: 'SeatSelection',
            params: { showtimeId: selectedShowtime.value.id },
         });
      }
   }

   // --- API ---
   async function getFilm() {
      try {
         const res = await axios.get(`${API_BASE_URL}/films/${route.params.id}`);
         film.value = res.data;
         await getCategories();
         await getShowtimes();
      } catch (err) {
         console.error('Lỗi khi lấy Film:', err.message);
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

   async function getShowtimes() {
      if (!film.value.id) return;
      try {
         const res = await axios.get(`${API_BASE_URL}/customer/schedules/${film.value.id}`);
         if (Array.isArray(res.data)) {
            showtimes.value = res.data.map((s) => ({
               id: s.id,
               showTimes: s.showTime?.startTime || s.startTime || '',
               scheduleDate: s.scheduleDate || '', // yyyy-MM-dd
            }));
         } else {
            showtimes.value = [];
         }
      } catch (err) {
         console.error('Lỗi khi lấy lịch chiếu:', err.message);
         showtimes.value = [];
      }
   }

   // --- MOUNT ---
   onMounted(() => {
      getFilm();
   });
</script>

<style scoped>
   /* === GIỮ NGUYÊN STYLE ĐẸP === */
   .film-detail-wrapper {
      background-color: #f9fafb;
      font-family: 'Montserrat', sans-serif;
   }

   .card {
      background-color: #fff;
      border-radius: 20px;
      transition: all 0.3s ease;
   }

   .card:hover {
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
   }

   img {
      border-radius: 12px;
      transition: transform 0.3s ease;
   }

   img:hover {
      transform: scale(1.03);
   }

   h2 {
      font-size: 2rem;
   }

   h5 {
      font-size: 1.2rem;
   }

   p {
      margin-bottom: 0.5rem;
      font-size: 1rem;
   }

   .film-trailer video {
      border-radius: 12px;
      background: #000;
   }

   .btn-back {
      background: #198754;
      color: #fff;
      font-weight: 600;
      text-decoration: none;
      padding: 0.5rem 1.2rem;
      border-radius: 8px;
      transition: all 0.3s ease;
   }

   .btn-back:hover {
      background: #157347;
      transform: translateY(-2px);
   }

   .showtime-section {
      background: linear-gradient(135deg, #f8f9fa, #e9ecef);
      border: 1px solid #dee2e6;
   }

   .showtime-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 14px;
   }

   .showtime-card {
      background: #fff;
      border: 2px solid #dee2e6;
      border-radius: 16px;
      padding: 18px 10px;
      font-weight: 600;
      color: #495057;
      transition: all 0.3s ease;
      text-align: center;
      min-height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
   }

   .showtime-card:hover {
      background: #f8f9fa;
      border-color: #adb5bd;
      transform: translateY(-4px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
   }

   .showtime-card.selected {
      background: #198754;
      color: white;
      border-color: #157347;
      box-shadow: 0 6px 20px rgba(25, 135, 84, 0.4);
   }

   .calendar-sticky {
      position: sticky;
      top: 20px;
   }

   .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 6px;
      font-size: 0.9rem;
   }

   .calendar-day {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
   }

   .calendar-day.empty {
      background: transparent;
   }

   .calendar-day.today {
      background: #d1fae5;
      color: #065f46;
      font-weight: 600;
   }

   .calendar-day.selected {
      background: #198754;
      color: white;
      font-weight: 700;
   }

   .calendar-day.has-showtime::after {
      content: '';
      position: absolute;
      bottom: 4px;
      width: 6px;
      height: 6px;
      background: #198754;
      border-radius: 50%;
   }

   .calendar-day:hover:not(.empty):not(.selected) {
      background: #e9ecef;
   }

   @media (max-width: 992px) {
      .calendar-sticky {
         position: static;
      }
   }

   @media (max-width: 576px) {
      .showtime-grid {
         grid-template-columns: repeat(3, 1fr);
      }

      .showtime-card {
         font-size: 1.1rem;
         padding: 14px 6px;
      }

      .calendar-grid {
         font-size: 0.8rem;
      }
   }

   @media (max-width: 768px) {
      .film-detail-page {
         padding: 20px;
      }

      .film-trailer video {
         height: auto;
      }

      .btn-back {
         font-size: 0.9rem;
         padding: 0.4rem 0.9rem;
      }
   }
</style>
