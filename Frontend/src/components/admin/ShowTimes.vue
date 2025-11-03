<template>
   <div class="container-fluid showtimes-page mt-3">
      <!-- Tiêu đề -->
      <div class="d-flex justify-content-between align-items-center mb-3">
         <h3 class="fw-bold text-success">🎬 Quản lý Giờ Chiếu</h3>
         <button class="btn btn-success" @click="loadShowTimes">⟳ Tải lại</button>
      </div>

      <div class="row g-3">
         <!-- Form nhập -->
         <div class="col-md-4">
            <div class="card shadow-sm border-0">
               <div class="card-body">
                  <h5 class="card-title text-success text-center mb-3">
                     {{ isEditing ? 'Cập nhật giờ chiếu' : 'Thêm giờ chiếu mới' }}
                  </h5>

                  <form @submit.prevent="handleSubmit">
                     <div class="mb-3">
                        <label class="form-label fw-semibold">Giờ chiếu *</label>
                        <input
                           type="time"
                           v-model="showTime.startTime"
                           step="60"
                           class="form-control"
                           required
                        />
                     </div>

                     <div class="d-flex justify-content-between">
                        <button type="submit" class="btn btn-success w-50 me-1">
                           {{ isEditing ? '💾 Lưu' : '+ Thêm' }}
                        </button>
                        <button
                           v-if="isEditing"
                           type="button"
                           class="btn btn-secondary w-50 ms-1"
                           @click="cancelEdit"
                        >
                           ❌ Hủy
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         </div>

         <!-- Bảng danh sách -->
         <div class="col-md-8">
            <div class="card shadow-sm border-0">
               <div class="card-body">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                     <h5 class="card-title fw-bold mb-0">Danh sách giờ chiếu</h5>

                     <!-- Ô tìm kiếm -->
                     <div class="input-group" style="width: 240px">
                        <span class="input-group-text bg-success text-white"> Tìm kiếm </span>
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
                           <th>Trạng thái</th>
                           <th>Hành động</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-if="paginatedShowTimes.length === 0">
                           <td colspan="3" class="text-muted fst-italic">
                              Không tìm thấy giờ chiếu nào.
                           </td>
                        </tr>
                        <tr v-for="st in paginatedShowTimes" :key="st.id">
                           <td class="fw-semibold">{{ st.startTime }}</td>
                           <td>
                              <span
                                 class="badge px-3 py-2"
                                 :class="st.isDeleted ? 'bg-danger' : 'bg-success'"
                              >
                                 {{ st.isDeleted ? 'Đã xóa' : 'Hoạt động' }}
                              </span>
                           </td>
                           <td>
                              <button class="btn btn-primary btn-sm me-1" @click="editShowTime(st)">
                                 Sửa
                              </button>
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
   import { ref, onMounted, computed } from 'vue';
   import axios from 'axios';

   const API_URL = 'http://localhost:8080/api/showtimes';

   const showTimes = ref([]);
   const showTime = ref({ startTime: '', isDeleted: false });
   const editingId = ref(null);
   const toast = ref({ message: '', type: '' });
   const searchQuery = ref('');

   // phân trang
   const currentPage = ref(1);
   const itemsPerPage = 10;

   const isEditing = computed(() => !!editingId.value);

   function showToast(msg, type = 'success') {
      toast.value = { message: msg, type };
      setTimeout(() => (toast.value.message = ''), 2500);
   }

   async function loadShowTimes() {
      try {
         const res = await axios.get(API_URL);
         showTimes.value = res.data;
      } catch {
         showToast('Không thể tải danh sách giờ chiếu', 'error');
      }
   }

   async function handleSubmit() {
      try {
         if (isEditing.value) {
            await axios.put(`${API_URL}/${editingId.value}`, showTime.value);
            showToast('Cập nhật giờ chiếu thành công!');
         } else {
            await axios.post(API_URL, showTime.value);
            showToast('Thêm giờ chiếu thành công!');
         }
         resetForm();
         await loadShowTimes();
      } catch (error) {
         const msg = error.response?.data?.message || 'Lỗi khi lưu giờ chiếu!';
         showToast(msg, 'error');
      }
   }

   function editShowTime(st) {
      showTime.value = { ...st };
      editingId.value = st.id;
   }

   function cancelEdit() {
      resetForm();
      showToast('Đã hủy chỉnh sửa', 'error');
   }

   async function deleteShowTime(st) {
      if (!confirm(`Xác nhận xóa giờ chiếu ${st.startTime}?`)) return;
      try {
         await axios.delete(`${API_URL}/${st.id}`);
         showToast('Xóa giờ chiếu thành công!');
         await loadShowTimes();
      } catch {
         showToast('Lỗi khi xóa giờ chiếu!', 'error');
      }
   }

   function resetForm() {
      showTime.value = { startTime: '', isDeleted: false };
      editingId.value = null;
   }

   /* ======= TÌM KIẾM + PHÂN TRANG ======= */
   const filteredShowTimes = computed(() => {
      if (!searchQuery.value.trim()) return showTimes.value;
      return showTimes.value.filter((st) =>
         st.startTime.toLowerCase().includes(searchQuery.value.toLowerCase())
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

   onMounted(() => {
      loadShowTimes();
      document.documentElement.lang = 'vi';
   });
</script>

<style scoped>
   .showtimes-page {
      font-family: 'Segoe UI', sans-serif;
   }

   /* badge trắng chữ */
   .badge.bg-success {
      background-color: #16a34a !important;
      color: #fff !important;
   }

   .badge.bg-danger {
      background-color: #dc2626 !important;
      color: #fff !important;
   }

   /* toast */
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

   /* animation fade */
   .fade-enter-active,
   .fade-leave-active {
      transition: opacity 0.3s;
   }
   .fade-enter-from,
   .fade-leave-to {
      opacity: 0;
   }
</style>
