<template>
   <div class="container-fluid">
      <div class="btn-box">
         <button class="switch-btn" :class="{ active: !showForm }" @click="showForm = false">
            Danh sách lịch chiếu
         </button>
         <button class="switch-btn" :class="{ active: showForm }" @click="showForm = true">
            Thêm lịch chiếu
         </button>
      </div>
      <div v-if="!showForm" class="container-fluid mt-3">
         <!-- Bộ lọc -->
         <div class="row d-flex g-3 mb-3 align-items-end">
            <div class="col-md-3">
               <label class="form-label fw-semibold">Phim</label> <br />
               <select v-model="selectedFilmId" class="form-control border-primary">
                  <option value="">Tất cả phim</option>
                  <option v-for="film in films" :key="film.id" :value="film.id">
                     {{ film.name }}
                  </option>
               </select>
            </div>

            <div class="col-md-3">
               <label class="form-label fw-semibold">Phòng</label> <br />
               <select v-model="selectedRoomId" class="form-control border-primary">
                  <option value="">Tất cả phòng</option>
                  <option v-for="room in rooms" :key="room.id" :value="room.id">
                     {{ room.name }}
                  </option>
               </select>
            </div>

            <div class="col-md-3">
               <label class="form-label fw-semibold">Giờ chiếu</label> <br />
               <select v-model="selectedShowTimeId" class="form-control border-primary">
                  <option value="">Tất cả giờ chiếu</option>
                  <option v-for="time in showTimes" :key="time.id" :value="time.id">
                     {{ time.startTime }}
                  </option>
               </select>
            </div>

            <div class="col-md-3">
               <label class="form-label fw-semibold">Ngày chiếu</label>
               <input type="date" v-model="selectedDate" class="form-control border-primary" />
            </div>
         </div>

         <!-- Bảng lịch chiếu -->
         <div class="table-responsive" style="max-height: 500px; overflow-y: auto">
            <table class="table table-bordered table-hover w-100">
               <thead class="text-center table-success">
                  <tr>
                     <th>STT</th>
                     <th>Phim</th>
                     <th>Phòng</th>
                     <th>Giờ chiếu</th>
                     <th>Ngày chiếu</th>
                     <th>Thao tác</th>
                  </tr>
               </thead>
               <tbody class="text-center align-middle">
                  <tr v-for="(schedule, index) in paginatedSchedules" :key="schedule.id">
                     <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                     <td>{{ schedule.film.name }}</td>
                     <td>{{ schedule.room.name }}</td>
                     <td>{{ schedule.showTime.startTime }}</td>
                     <td>{{ schedule.scheduleDate }}</td>
                     <td>
                        <button class="btn btn-primary mx-1" @click="handleEdit(schedule)">
                           Sửa
                        </button>
                        <button class="btn btn-danger mx-1" @click="handleDelete(schedule.id)">
                           Xóa
                        </button>
                     </td>
                  </tr>
                  <tr v-if="filteredSchedules.length === 0">
                     <td colspan="5" class="text-center text-muted">Không có dữ liệu</td>
                  </tr>
               </tbody>
            </table>
         </div>

         <!-- Phân trang -->
         <nav class="d-flex justify-content-center mt-3">
            <ul class="pagination">
               <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button class="page-link" @click="prevPage">Trước</button>
               </li>

               <li
                  class="page-item"
                  v-for="page in totalPages"
                  :key="page"
                  :class="{ active: currentPage === page }"
               >
                  <button class="page-link" @click="goToPage(page)">{{ page }}</button>
               </li>

               <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <button class="page-link" @click="nextPage">Sau</button>
               </li>
            </ul>
         </nav>
      </div>
   </div>
</template>

<script setup>
   import { ref, computed, onMounted } from 'vue';
   import axios from 'axios';

   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
   const token = localStorage.getItem('token'); // Hoặc lấy từ Vuex/Pinia nếu dùng

   // Dữ liệu gốc
   const schedules = ref([]);
   const films = ref([]);
   const rooms = ref([]);
   const showTimes = ref([]);

   // Bộ lọc
   const selectedFilmId = ref('');
   const selectedRoomId = ref('');
   const selectedShowTimeId = ref('');
   const selectedDate = ref('');

   // Phân trang
   const currentPage = ref(1);
   const pageSize = 50;

   const showForm = ref(false);

   // 🔹 Computed filter giống filteredSeats
   const filteredSchedules = computed(() => {
      return schedules.value.filter((schedule) => {
         const matchFilm = selectedFilmId.value ? schedule.film.id === selectedFilmId.value : true;
         const matchRoom = selectedRoomId.value ? schedule.room.id === selectedRoomId.value : true;
         const matchShowTime = selectedShowTimeId.value
            ? schedule.showTime.id === selectedShowTimeId.value
            : true;
         const matchDate = selectedDate.value ? schedule.scheduleDate === selectedDate.value : true;
         return matchFilm && matchRoom && matchShowTime && matchDate;
      });
   });

   // 🔹 Phân trang
   const totalPages = computed(() => Math.ceil(filteredSchedules.value.length / pageSize));
   const paginatedSchedules = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      return filteredSchedules.value.slice(start, start + pageSize);
   });

   function goToPage(page) {
      if (page >= 1 && page <= totalPages.value) currentPage.value = page;
   }
   function prevPage() {
      if (currentPage.value > 1) currentPage.value--;
   }
   function nextPage() {
      if (currentPage.value < totalPages.value) currentPage.value++;
   }

   // 🔹 Lấy dữ liệu từ API
   async function getSchedules() {
      try {
         const res = await axios.get(`${API_BASE_URL}/admin/schedules`, {
            headers: { Authorization: `Bearer ${token}` },
         });
         schedules.value = res.data;
      } catch (error) {
         console.error('Lỗi khi lấy schedules:', error.message);
      }
   }

   async function getFilms() {
      try {
         const res = await axios.get(`${API_BASE_URL}/admin/films`, {
            headers: { Authorization: `Bearer ${token}` },
         });
         films.value = res.data;
      } catch (error) {
         console.error('Lỗi khi lấy films:', error.message);
      }
   }

   async function getRooms() {
      try {
         const res = await axios.get(`${API_BASE_URL}/admin/rooms`, {
            headers: { Authorization: `Bearer ${token}` },
         });
         rooms.value = res.data;
      } catch (error) {
         console.error('Lỗi khi lấy rooms:', error.message);
      }
   }

   async function getShowTimes() {
      try {
         const res = await axios.get(`${API_BASE_URL}/admin/show-times`, {
            headers: { Authorization: `Bearer ${token}` },
         });
         showTimes.value = res.data;
      } catch (error) {
         console.error('Lỗi khi lấy showTimes:', error.message);
      }
   }

   // 🔹 Áp dụng filter (reset trang 1)
   function applyFilter() {
      currentPage.value = 1;
   }

   onMounted(async () => {
      await getSchedules();
      await getFilms();
      await getRooms();
      await getShowTimes();
   });
</script>

<style scoped>
   .pagination .page-item.active .page-link {
      background-color: #0d6efd;
      border-color: #0d6efd;
   }

   .pagination .page-link {
      cursor: pointer;
   }

   .table-responsive {
      max-height: 500px;
      overflow-y: auto;
   }

   .table thead th {
      position: sticky;
      top: 0;
      background-color: #d1e7dd;
      z-index: 10;
   }
   /* Switch Buttons */
   .btn-box {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-bottom: 20px;
   }

   .switch-btn {
      background: #b8deb8;
      border: 2px solid #2b2b2b;
      padding: 8px 16px;
      font-size: 16px;
      border-radius: 15px;
      cursor: pointer;
      font-weight: bold;
      transition: 0.25s;
   }

   .switch-btn:hover {
      transform: translateY(-2px);
   }

   .switch-btn.active {
      background: #7ee07e;
      box-shadow: 0 0 10px rgba(0, 200, 0, 0.3);
   }
</style>
