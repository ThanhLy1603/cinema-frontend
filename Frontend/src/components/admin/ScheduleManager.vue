<template>
   <div class="container-fluid">
      <!-- Nút chuyển -->
      <div class="btn-box">
         <button class="switch-btn" :class="{ active: !showForm }" @click="switchToList">
            Danh sách lịch chiếu
         </button>
         <button class="switch-btn" :class="{ active: showForm }" @click="switchToForm">
            Thêm lịch chiếu
         </button>
      </div>

      <!-- =============== DANH SÁCH LỊCH CHIẾU =============== -->
      <div v-if="!showForm" class="container-fluid mt-3">
         <!-- Bộ lọc -->
         <div class="row d-flex g-3 mb-3 align-items-end">
            <div class="col-md-3">
               <label class="form-label fw-semibold">Phim</label>
               <v-select
                  v-model="selectedFilmId"
                  :options="[{ id: '', name: 'Tất cả phim' }, ...films]"
                  label="name"
                  :reduce="(film) => film.id"
                  placeholder="Chọn phim"
                  class="border-primary"
               />
            </div>

            <div class="col-md-3">
               <label class="form-label fw-semibold">Phòng</label>
               <v-select
                  v-model="selectedRoomId"
                  :options="[{ id: '', name: 'Tất cả phòng' }, ...rooms]"
                  label="name"
                  :reduce="(room) => room.id"
                  placeholder="Chọn phòng"
                  class="border-primary"
               />
            </div>

            <div class="col-md-3">
               <label class="form-label fw-semibold">Giờ chiếu</label>
               <v-select
                  v-model="selectedShowTimeId"
                  :options="[{ id: '', startTime: 'Tất cả giờ chiếu' }, ...showTimes]"
                  label="startTime"
                  :reduce="(time) => time.id"
                  placeholder="Chọn giờ chiếu"
                  class="border-primary"
               />
            </div>

            <div class="col-md-3">
               <label class="form-label fw-semibold">Ngày chiếu</label>
               <input type="date" v-model="selectedDate" class="form-control border-primary" />
            </div>
         </div>

         <!-- Bảng -->
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
                        <button class="btn btn-primary btn-sm mx-1" @click="handleEdit(schedule)">
                           Sửa
                        </button>
                        <button
                           class="btn btn-danger btn-sm mx-1"
                           @click="handleDelete(schedule.id)"
                        >
                           Xóa
                        </button>
                     </td>
                  </tr>
                  <tr v-if="filteredSchedules.length === 0">
                     <td colspan="6" class="text-center text-muted">Không có dữ liệu</td>
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
                  v-for="page in totalPages"
                  :key="page"
                  :class="{ active: currentPage === page }"
                  class="page-item"
               >
                  <button class="page-link" @click="goToPage(page)">{{ page }}</button>
               </li>
               <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <button class="page-link" @click="nextPage">Sau</button>
               </li>
            </ul>
         </nav>
      </div>

      <!-- =============== FORM THÊM / SỬA =============== -->
      <div v-else class="col-md-6 mx-auto mt-3">
         <h4 class="text-center mb-3">
            {{ isEditing ? 'Cập nhật lịch chiếu' : 'Thêm lịch chiếu mới' }}
         </h4>

         <form @submit.prevent="handleSubmit">
            <div class="mb-3">
               <label class="form-label fw-semibold">Phim</label>
               <v-select
                  v-model="form.filmId"
                  :options="films"
                  label="name"
                  :reduce="(film) => film.id"
                  placeholder="-- Chọn phim --"
                  class="border-primary"
                  required
               />
            </div>

            <div class="mb-3">
               <label class="form-label fw-semibold">Phòng</label>
               <v-select
                  v-model="form.roomId"
                  :options="rooms"
                  label="name"
                  :reduce="(room) => room.id"
                  placeholder="-- Chọn phòng --"
                  class="border-primary"
                  required
               />
            </div>

            <div class="mb-3">
               <label class="form-label fw-semibold">Giờ chiếu</label>
               <v-select
                  v-model="form.showTimeId"
                  :options="showTimes"
                  label="startTime"
                  :reduce="(time) => time.id"
                  placeholder="-- Chọn giờ chiếu --"
                  class="border-primary"
                  required
               />
            </div>

            <div class="mb-3">
               <label class="form-label fw-semibold">Ngày chiếu</label>
               <input
                  type="date"
                  v-model="form.scheduleDate"
                  class="form-control border-primary"
                  required
               />
            </div>

            <div class="d-flex justify-content-center gap-3">
               <button type="submit" class="btn btn-success mx-2">
                  {{ isEditing ? 'Cập nhật' : 'Thêm mới' }}
               </button>
               <button type="button" class="btn btn-secondary mx-2" @click="resetForm">Làm mới</button>
               <button type="button" class="btn btn-outline-dark mx-2" @click="switchToList">
                  Quay lại
               </button>
            </div>
         </form>
      </div>

            <transition name="fade">
         <div
            v-if="toast.message"
            class="toast-custom"
            :class="toast.type === 'error' ? 'bg-danger' : 'bg-success'"
         >
            {{ toast.message }}
         </div>
      </transition>
   </div>
</template>

<script setup>
   import { ref, computed, onMounted } from 'vue';
   import axios from 'axios';
   import vSelect from 'vue3-select';
   import 'vue3-select/dist/vue3-select.css';
   import { inject } from 'vue';
   import Swal from 'sweetalert2';
   

   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
   const token = localStorage.getItem('token');
   const $swal = inject('$swal');

   // Dữ liệu
   const schedules = ref([]);
   const films = ref([]);
   const rooms = ref([]);
   const showTimes = ref([]);

   // Trạng thái
   const showForm = ref(false);
   const isEditing = ref(false);
   const form = ref({ id: null, filmId: '', roomId: '', showTimeId: '', scheduleDate: '' });
   const toast = ref({ message: '', type: '' });

   // Bộ lọc
   const selectedFilmId = ref('');
   const selectedRoomId = ref('');
   const selectedShowTimeId = ref('');
   const selectedDate = ref('');

   // Phân trang
   const currentPage = ref(1);
   const pageSize = 50;

   // --- Computed filter ---
   const filteredSchedules = computed(() => {
      return schedules.value.filter((s) => {
         const matchFilm = selectedFilmId.value ? s.film.id === selectedFilmId.value : true;
         const matchRoom = selectedRoomId.value ? s.room.id === selectedRoomId.value : true;
         const matchShowTime = selectedShowTimeId.value
            ? s.showTime.id === selectedShowTimeId.value
            : true;
         const matchDate = selectedDate.value ? s.scheduleDate === selectedDate.value : true;
         return matchFilm && matchRoom && matchShowTime && matchDate;
      });
   });
   const totalPages = computed(() => Math.ceil(filteredSchedules.value.length / pageSize));
   const paginatedSchedules = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      return filteredSchedules.value.slice(start, start + pageSize);
   });

   function showErrorAlert(message) {
      const formattedMessage = message
         ? message.replace(/\n/g, "<br>")  // chuyển \n thành <br> để xuống dòng
         : "Xung đột lịch chiếu";

      $swal.fire({
         icon: 'error',
         title: '<span style="font-size: 22px;">Xung đột lịch chiếu</span>',
         html: `<div style="font-size: 18px; white-space: pre-line;">${formattedMessage}</div>`,
         confirmButtonText: 'OK',
         customClass: { popup: 'text-alert' },
         width: '500px',  // tùy chỉnh chiều rộng popup
      });
   }

   function showToast(msg, type = 'success') {
      toast.value = { message: msg, type };
      setTimeout(() => (toast.value.message = ''), 2500);
   }

   async function showConfirm(message) {
      const result = await Swal.fire({
         title: message,
         icon: 'warning',
         showCancelButton: true,
         confirmButtonText: 'Xác nhận',
         cancelButtonText: 'Huỷ',
         confirmButtonColor: '#d33',
         cancelButtonColor: '#6c757d',
         reverseButtons: true
      });

      return result.isConfirmed; // Trả về true nếu người dùng bấm "Xác nhận"
   }

   // --- Phân trang ---
   function goToPage(p) {
      if (p >= 1 && p <= totalPages.value) currentPage.value = p;
   }
   function prevPage() {
      if (currentPage.value > 1) currentPage.value--;
   }
   function nextPage() {
      if (currentPage.value < totalPages.value) currentPage.value++;
   }

   // --- API ---
   async function getSchedules() {
      const res = await axios.get(`${API_BASE_URL}/admin/schedules`, {
         headers: { Authorization: `Bearer ${token}` },
      });
      schedules.value = res.data;
   }
   async function getFilms() {
      const res = await axios.get(`${API_BASE_URL}/admin/films`, {
         headers: { Authorization: `Bearer ${token}` },
      });
      films.value = res.data;
   }
   async function getRooms() {
      const res = await axios.get(`${API_BASE_URL}/admin/rooms`, {
         headers: { Authorization: `Bearer ${token}` },
      });
      rooms.value = res.data;
   }
   async function getShowTimes() {
      const res = await axios.get(`${API_BASE_URL}/admin/show-times`, {
         headers: { Authorization: `Bearer ${token}` },
      });
      showTimes.value = res.data;
   }

   // --- CRUD ---
   async function handleSubmit() {
      try {
         const payload = {
            filmId: form.value.filmId,
            roomId: form.value.roomId,
            showTimeId: form.value.showTimeId,
            scheduleDate: form.value.scheduleDate,
         };

         if (isEditing.value) {
            const response = await axios.put(`${API_BASE_URL}/admin/schedules/update/${form.value.id}`, payload, {
               headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.status == 'success') showToast(response.data.message, 'success');
            else showErrorAlert(response.data.message);
         } else {
            const response = await axios.post(`${API_BASE_URL}/admin/schedules/create`, payload, {
               headers: { Authorization: `Bearer ${token}` },
            });
            
            if (response.data.status == 'success') showToast(response.data.message, 'success');
            else showErrorAlert(response.data.message);
         }
         await getSchedules();
      } catch (err) {
         console.error('Lỗi khi lưu lịch chiếu:', err);
         alert('Có lỗi xảy ra khi lưu lịch chiếu.');
      }
   }

   function handleEdit(schedule) {
      showForm.value = true;
      isEditing.value = true;
      form.value = {
         id: schedule.id,
         filmId: schedule.film.id,
         roomId: schedule.room.id,
         showTimeId: schedule.showTime.id,
         scheduleDate: schedule.scheduleDate,
      };
   }

   async function handleDelete(id) {
      const confirmed = await showConfirm('Bạn có muốn xoá lịch chiếu này không?');

      if (!confirmed) {
         Swal.fire({
            icon: 'info',
            title: 'Đã huỷ xoá phòng',
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
         });
         return;
      }

      try {
         const response = await axios.delete(`${API_BASE_URL}/admin/schedules/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
         });
         await getSchedules();
         showToast(response.data.message, 'success');
      } catch (error) {
         showToast('Lỗi xóa: ' + error.message, 'error');
      }
   }

   function resetForm() {
      form.value = { id: null, filmId: '', roomId: '', showTimeId: '', scheduleDate: '' };
      isEditing.value = false;
   }

   function switchToForm() {
      showForm.value = true;
      resetForm();
   }
   function switchToList() {
      showForm.value = false;
      resetForm();
   }

   onMounted(async () => {
      await getSchedules();
      await getFilms();
      await getRooms();
      await getShowTimes();
   });
</script>

<style scoped>
   .v-select {
      --vs-border-color: #0d6efd;
      border-radius: 0.375rem;
   }
   .vs__dropdown-toggle {
      border: 1px solid #0d6efd !important;
   }
   .vs__selected {
      color: #0d6efd;
      font-weight: 500;
   }

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

      .toast-custom {
      position: fixed;
      top: 20px;
      right: 20px;
      color: #fff;
      font-weight: 600;
      border-radius: 8px;
      padding: 10px 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      transition: 0.3s ease;
      z-index: 1055;
   }
</style>
