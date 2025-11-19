<template>
   <div class="container-fluid showtimes-page mt-3">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-3">
         <h3 class="fw-bold text-success">🎬 Quản lý Giờ Chiếu</h3>
         <!-- <button class="btn btn-success" @click="loadShowTimes">⟳ Tải lại</button> -->
      </div>

      <div class="row g-3">
         <!-- Form thêm giờ chiếu -->
         <div class="col-md-4">
            <div class="card shadow-sm border-0">
               <div class="card-body">
                  <h5 class="card-title text-success text-center mb-3">Thêm giờ chiếu mới</h5>

                  <form @submit.prevent="handleSubmit">
                     <div class="mb-3">
                        <label class="form-label fw-semibold">Giờ chiếu *</label>
                        <input
                           type="time"
                           v-model="showTime.startTime"
                           class="form-control"
                           required
                        />
                     </div>

                     <button type="submit" class="btn btn-success w-100">+ Thêm giờ chiếu</button>
                  </form>
               </div>
            </div>
         </div>

         <!-- Danh sách giờ chiếu -->
         <div class="col-md-8">
            <div class="card shadow-sm border-0">
               <div class="card-body">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                     <h5 class="card-title fw-bold mb-0">Danh sách giờ chiếu</h5>
                     <div class="input-group" style="width: 240px">
                        <span class="input-group-text bg-success text-white">Tìm kiếm</span>
                        <input
                           type="text"
                           class="form-control"
                           v-model="searchQuery"
                           placeholder="Tìm giờ chiếu..."
                        />
                     </div>
                  </div>

                  <table class="table table-hover align-middle text-center">
                     <thead class="table-success">
                        <tr>
                           <th>Giờ chiếu</th>
                           <th>Hành động</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-if="paginatedShowTimes.length === 0">
                           <td colspan="2" class="text-muted fst-italic">
                              Không tìm thấy giờ chiếu nào.
                           </td>
                        </tr>

                        <tr v-for="st in paginatedShowTimes" :key="st.id">
                           <td class="fw-semibold">{{ st.startTime }}</td>
                           <td>
                              <button class="btn btn-danger btn-sm" @click="deleteShowTime(st)">
                                 Xóa
                              </button>
                           </td>
                        </tr>
                     </tbody>
                  </table>

                  <!-- Phân trang -->
                  <nav v-if="filteredShowTimes.length > itemsPerPage">
                     <ul class="pagination justify-content-center">
                        <li
                           class="page-item"
                           :class="{ disabled: currentPage === 1 }"
                           @click="prevPage"
                        >
                           <span class="page-link">←</span>
                        </li>
                        <li
                           v-for="page in totalPages"
                           :key="page"
                           class="page-item"
                           :class="{ active: currentPage === page }"
                           @click="setPage(page)"
                        >
                           <span class="page-link">{{ page }}</span>
                        </li>
                        <li
                           class="page-item"
                           :class="{ disabled: currentPage === totalPages }"
                           @click="nextPage"
                        >
                           <span class="page-link">→</span>
                        </li>
                     </ul>
                  </nav>
               </div>
            </div>
         </div>
      </div>

      <!-- Toast -->
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
   import { ref, onMounted, computed, watch } from 'vue';
   import axios from 'axios';
   import Swal from 'sweetalert2';

   const API_URL = import.meta.env.VITE_API_BASE_URL;

   const showTimes = ref([]);
   const showTime = ref({ startTime: '' });
   const toast = ref({ message: '', type: '' });
   const searchQuery = ref('');
   const token = localStorage.getItem('token');

   const currentPage = ref(1);
   const itemsPerPage = 10;

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

   /* ===== Load dữ liệu ===== */
   async function loadShowTimes() {
      try {
         const url = `${API_URL}/admin/show-times`;
         const res = await axios.get(url, {
            headers: {
               Authorization: `Bearer ${token}`,
               'Content-Type': 'application/json',
            },
         });
         // ✅ Chỉ hiển thị giờ chưa bị ẩn
         showTimes.value = res.data.filter((st) => !st.isDeleted);
      } catch (error) {
         showToast('Không thể tải danh sách giờ chiếu', 'error');
      }
   }

   /* ===== Validate giờ chiếu ===== */
   function validateShowTime() {
      const inputTime = showTime.value.startTime;
      if (!inputTime) {
         showToast('Vui lòng chọn giờ chiếu!', 'error');
         return false;
      }

      const [hour, minute] = inputTime.split(':').map(Number);

      // Check khung giờ hợp lệ
      if (hour < 8 || (hour === 24 && minute > 0) || hour > 23) {
         showToast('Giờ chiếu phải nằm trong khoảng 08:00 - 24:00!', 'error');
         return false;
      }

      // Check trùng giờ (FE)
      const exists = showTimes.value.some(
         (st) => st.startTime && st.startTime.substring(0, 5) === inputTime.substring(0, 5)
      );

      if (exists) {
         showToast(`Giờ chiếu ${inputTime} đã tồn tại!`, 'error');
         return false;
      }

      return true;
   }

   /* ===== Thêm giờ chiếu ===== */
   async function handleSubmit() {
      if (!validateShowTime()) return;
      const url = `${API_URL}/admin/show-times/create`;
      console.log('show time: ', showTime.value, {
         headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
         },
      });
      try {
         await axios.post(url, showTime.value);
         showToast('Thêm giờ chiếu thành công!');
         showTime.value = { startTime: '' };
         await loadShowTimes();
      } catch (error) {
         const msg = error.response?.data?.message || 'Lỗi khi thêm giờ chiếu!';
         showToast(msg, 'error');
      }
   }

   /* ===== Xóa (ẩn) giờ chiếu ===== */
   async function deleteShowTime(st) {
      // if (!confirm(`Xác nhận ẩn giờ chiếu ${st.startTime}?`)) return;
      const confirmed = await showConfirm(`Xác nhận xoá giờ chiếu ${st.startTime}?`);

      if (!confirmed) {
         Swal.fire({
            icon: 'info',
            title: 'Đã huỷ xoá giờ chiếu',
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
         });
         return;
      }

      try {
         await axios.delete(`${API_URL}/admin/show-times/delete/${st.id}`, {
            headers: {
               Authorization: `Bearer ${token}`,
               'Content-Type': 'application/json',
            },
         });
         showToast('Xoá giờ chiếu thành công!');
         await loadShowTimes();
      } catch (error) {
         const msg = error.response?.data?.message || 'Không thể ẩn giờ chiếu này!';
         showToast(msg, 'error');
      }
   }

   /* ===== Tìm kiếm + Phân trang ===== */
   const filteredShowTimes = computed(() => {
      const query = searchQuery.value.trim().toLowerCase();
      if (!query) return showTimes.value;
      return showTimes.value.filter(
         (st) => st.startTime && st.startTime.toLowerCase().includes(query)
      );
   });

   const totalPages = computed(() => Math.ceil(filteredShowTimes.value.length / itemsPerPage));

   const paginatedShowTimes = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      return filteredShowTimes.value.slice(start, start + itemsPerPage);
   });

   function setPage(page) {
      if (page >= 1 && page <= totalPages.value) currentPage.value = page;
   }
   function nextPage() {
      if (currentPage.value < totalPages.value) currentPage.value++;
   }
   function prevPage() {
      if (currentPage.value > 1) currentPage.value--;
   }

   watch(searchQuery, () => (currentPage.value = 1));

   onMounted(() => {
      loadShowTimes();
      document.documentElement.lang = 'vi';
   });
</script>

<style scoped>
   .showtimes-page {
      font-family: 'Segoe UI', sans-serif;
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
   .fade-enter-active,
   .fade-leave-active {
      transition: opacity 0.3s;
   }
   .fade-enter-from,
   .fade-leave-to {
      opacity: 0;
   }
</style>
