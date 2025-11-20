<template>
   <div class="container-fluid mt-3">
      <!-- ==================== BẢNG GHẾ ==================== -->
      <div v-if="!showForm">
         <!-- Bộ lọc -->
         <div class="card shadow-sm p-3 mb-4">
            <div class="row g-3 align-items-end">
               <!-- Tìm kiếm vị trí -->
               <div class="col-md-3">
                  <label class="form-label fw-semibold text-secondary mx-2">
                     <i class="bi bi-search me-1"></i> Vị trí ghế
                  </label>
                  <input
                     v-model="searchPosition"
                     type="text"
                     class="form-control border-primary mx-2"
                     placeholder="Nhập vị trí ghế"
                  />
               </div>

               <!-- Bộ lọc Phòng -->
               <div class="col-md-3">
                  <label class="form-label fw-semibold text-secondary mx-2">
                     <i class="bi bi-door-open me-1"></i> Phòng
                  </label><br>
                  <select v-model="selectedRoomId" class="form-control border-primary mx-2">
                     <option value="">Tất cả phòng</option>
                     <option v-for="room in rooms" :key="room.id" :value="room.id">
                        {{ room.name }}
                     </option>
                  </select>
               </div>

               <!-- Bộ lọc Loại ghế -->
               <div class="col-md-3">
                  <label class="form-label fw-semibold text-secondary mx-2">
                     <i class="bi bi-chair me-1"></i> Loại ghế
                  </label><br>
                  <select v-model="selectedSeatTypeId" class="form-control border-primary mx-2">
                     <option value="">Tất cả loại ghế</option>
                     <option v-for="type in seatTypes" :key="type.id" :value="type.id">
                        {{ type.name }}
                     </option>
                  </select>
               </div>

               <!-- Nút làm mới -->
               <div class="col-md-3">
                  <button class="btn btn-outline-primary px-4" @click="resetFilters">
                     <i class="bi bi-arrow-clockwise me-1"></i> Làm mới
                  </button>
               </div>
            </div>
         </div>

         <!-- Bảng -->
         <div class="table-responsive">
            <table class="table table-bordered table-hover w-100">
               <thead class="text-center table-success">
                  <tr>
                     <th>STT</th>
                     <th>Vị trí</th>
                     <th>Phòng</th>
                     <th>Loại ghế</th>
                     <th>Trạng thái</th>
                     <th>Hành động</th>
                  </tr>
               </thead>
               <tbody class="text-center align-middle">
                  <tr v-for="(seat, index) in paginatedSeats" :key="seat.id">
                     <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                     <td>{{ seat.position }}</td>
                     <td>{{ seat.room.name }}</td>
                     <td>{{ seat.seatType.name }}</td>
                     <td :class="seat.active ? 'text-success' : 'text-danger'">
                        {{ seat.active ? 'Đang hoạt động' : 'Bảo trì' }}
                     </td>
                     <td>
                        <button class="btn btn-primary mx-2" @click="editSeat(seat)">Sửa</button>
                     </td>
                  </tr>
                  <tr v-if="filteredSeats.length === 0">
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

      <!-- ==================== FORM CHỈNH SỬA GHẾ ==================== -->
      <div v-else class="card p-4 mx-auto mt-4" style="max-width: 600px">
         <form @submit.prevent="updateSeat">
            <div class="mb-3">
               <label class="form-label fw-semibold">Vị trí ghế</label>
               <input
                  v-model="editForm.position"
                  type="text"
                  class="form-control form-control-lg border-primary"
                  readonly
               />
            </div>

            <div class="mb-3">
               <label class="form-label fw-semibold">Phòng chiếu</label>
               <select
                  v-model="editForm.roomId"
                  class="form-select form-select-lg border-primary"
                  disabled
                  required
               >
                  <option value="" disabled>Chọn phòng</option>
                  <option v-for="room in rooms" :key="room.id" :value="room.id">
                     {{ room.name }}
                  </option>
               </select>
            </div>

            <div class="mb-3">
               <label class="form-label fw-semibold">Loại ghế</label>
               <select
                  v-model="editForm.seatTypeId"
                  class="form-select form-select-lg border-primary"
                  required
               >
                  <option value="" disabled>Chọn loại ghế</option>
                  <option v-for="type in seatTypes" :key="type.id" :value="type.id">
                     {{ type.name }}
                  </option>
               </select>
            </div>

            <div class="mb-3">
               <label class="form-label fw-semibold">Trạng thái</label>
               <select
                  v-model="editForm.active"
                  class="form-select form-select-lg border-primary"
                  required
               >
                  <option :value="true">Đang hoạt động</option>
                  <option :value="false">Bảo trì</option>
               </select>
            </div>

            <div class="text-center mt-4">
               <button type="submit" class="btn btn-primary px-4 mx-2">Lưu thay đổi</button>
               <button type="button" class="btn btn-outline-secondary px-4" @click="cancelEdit">
                  Hủy
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

   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

   const seats = ref([]);
   const rooms = ref([]);
   const seatTypes = ref([]);

   const selectedRoomId = ref('');
   const selectedSeatTypeId = ref('');
   const searchPosition = ref('');

   const showForm = ref(false);
   const toast = ref({ message: '', type: '' });
   const token = localStorage.getItem('token');

   const editForm = ref({
      id: '',
      position: '',
      active: true,
      roomId: '',
      seatTypeId: '',
   });

   const currentPage = ref(1);
   const pageSize = 50;

   // 🔹 Danh sách ghế lọc theo phòng, loại ghế, vị trí
   const filteredSeats = computed(() => {
      return seats.value.filter((seat) => {
         const matchRoom = selectedRoomId.value ? seat.room.id === selectedRoomId.value : true;
         const matchType = selectedSeatTypeId.value
            ? seat.seatType.id === selectedSeatTypeId.value
            : true;
         const matchPosition = searchPosition.value
            ? seat.position.toLowerCase().includes(searchPosition.value.toLowerCase())
            : true;
         return matchRoom && matchType && matchPosition;
      });
   });

   const paginatedSeats = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      return filteredSeats.value.slice(start, start + pageSize);
   });

   const totalPages = computed(() => Math.ceil(filteredSeats.value.length / pageSize));

   // 🔹 Hàm toast
   function showToast(msg, type = 'success') {
      toast.value = { message: msg, type };
      setTimeout(() => (toast.value.message = ''), 2500);
   }

   // 🔹 Phân trang
   function goToPage(page) {
      if (page >= 1 && page <= totalPages.value) currentPage.value = page;
   }
   function prevPage() {
      if (currentPage.value > 1) currentPage.value--;
   }
   function nextPage() {
      if (currentPage.value < totalPages.value) currentPage.value++;
   }

   // 🔹 API
   async function getSeats() {
      try {
         const response = await axios.get(`${API_BASE_URL}/admin/seats`);
         seats.value = response.data;
      } catch (error) {
         console.error(error);
      }
   }
   async function getRooms() {
      try {
         const response = await axios.get(`${API_BASE_URL}/admin/seats/rooms`);
         rooms.value = response.data;
      } catch (error) {
         console.error(error);
      }
   }
   async function getSeatTypes() {
      try {
         const response = await axios.get(`${API_BASE_URL}/admin/seats/seat-types`);
         seatTypes.value = response.data;
      } catch (error) {
         console.error(error);
      }
   }

   function resetFilters() {
      selectedRoomId.value = '';
      selectedSeatTypeId.value = '';
      searchPosition.value = '';
   }

   // 🔹 Edit ghế
   function editSeat(seat) {
      editForm.value = {
         id: seat.id,
         position: seat.position,
         active: seat.active,
         roomId: seat.room.id,
         seatTypeId: seat.seatType.id,
      };
      showForm.value = true;
   }

   function cancelEdit() {
      showForm.value = false;
   }

   // 🔹 Cập nhật ghế
   async function updateSeat() {
      try {
         const response = await axios.put(`${API_BASE_URL}/admin/seats/update/${editForm.value.id}`, 
            {
               active: editForm.value.active,
               seatTypeId: editForm.value.seatTypeId,
            },
            {
               headers: { Authorization: `Bearer ${token}` }
            }
         );
         showToast(response.data.message);
         showForm.value = false;
         getSeats();
      } catch (error) {
         console.error(error);
         showToast('Cập nhật thất bại!', 'error');
      }
   }

   onMounted(() => {
      getSeats();
      getRooms();
      getSeatTypes();
   });
</script>

<style scoped>
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
   .card {
      border-radius: 12px;
   }
   .form-label {
      color: #495057;
   }
   .form-control,
   .form-select {
      border-radius: 10px;
      transition: all 0.2s ease;
   }
   .form-control:focus,
   .form-select:focus {
      box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
      border-color: #0d6efd;
   }
   .table-responsive {
      max-height: 500px; /* Chiều cao khung scroll, tùy chỉnh */
      overflow-y: auto;
   }

   .table thead th {
      position: sticky;
      top: 0;
      background-color: #d1e7dd; /* Giữ màu nền header */
      z-index: 10; /* Đảm bảo header nằm trên các row */
   }
</style>
