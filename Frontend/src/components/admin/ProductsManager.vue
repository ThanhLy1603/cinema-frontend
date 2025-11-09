<template>
   <div class="container-fluid products-page mt-3">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-3">
         <h3 class="fw-bold text-success">Quản lý Sản phẩm</h3>
         <button class="btn btn-success" @click="fetchProducts">⟳ Tải lại</button>
      </div>

      <div class="row g-3">
         <!-- Form thêm sản phẩm -->
         <div class="col-md-4">
            <div class="card shadow-sm border-0">
               <div class="card-body">
                  <h5 class="card-title text-success text-center mb-3">Thêm sản phẩm mới</h5>

                  <form @submit.prevent="createProduct">
                     <div class="mb-3">
                        <label class="form-label fw-semibold">Tên sản phẩm *</label>
                        <input
                           v-model="product.name"
                           type="text"
                           class="form-control"
                           placeholder="Nhập tên sản phẩm..."
                           required
                        />
                     </div>

                     <div class="mb-3">
                        <label class="form-label fw-semibold">Mô tả *</label>
                        <textarea
                           v-model="product.description"
                           class="form-control"
                           rows="3"
                           placeholder="Nhập mô tả sản phẩm..."
                           required
                        ></textarea>
                     </div>

                     <div class="mb-3">
                        <label class="form-label fw-semibold">Ảnh sản phẩm</label>
                        <input
                           type="file"
                           class="form-control"
                           accept="image/*"
                           @change="handlePoster"
                        />
                        <div v-if="product.preview" class="mt-2">
                           <img
                              :src="product.preview"
                              alt="Preview"
                              class="rounded"
                              style="width: 100px; height: 100px; object-fit: cover"
                           />
                        </div>
                     </div>

                     <button type="submit" class="btn btn-success w-100">Thêm sản phẩm</button>
                  </form>
               </div>
            </div>
         </div>

         <!-- Danh sách sản phẩm -->
         <div class="col-md-8">
            <div class="card shadow-sm border-0">
               <div class="card-body">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                     <h5 class="card-title fw-bold mb-0">Danh sách sản phẩm</h5>
                     <div class="input-group" style="width: 240px">
                        <span class="input-group-text bg-success text-white">Tìm kiếm</span>
                        <input
                           type="text"
                           class="form-control"
                           v-model="searchQuery"
                           placeholder="Tìm sản phẩm..."
                        />
                     </div>
                  </div>

                  <table class="table table-hover align-middle text-center">
                     <thead class="table-success">
                        <tr>
                           <th>Ảnh</th>
                           <th>Tên sản phẩm</th>
                           <th>Mô tả</th>
                           <th>Hành động</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-if="paginatedProducts.length === 0">
                           <td colspan="4" class="text-muted fst-italic">
                              Không tìm thấy sản phẩm nào.
                           </td>
                        </tr>

                        <tr v-for="item in paginatedProducts" :key="item.id">
                           <td>
                              <img
                                 v-if="item.poster"
                                 :src="posterSrc(item.poster)"
                                 alt="poster"
                                 class="rounded"
                                 style="width: 60px; height: 60px; object-fit: cover"
                              />
                              <span v-else class="text-muted fst-italic">Không có ảnh</span>
                           </td>
                           <td class="fw-semibold align-middle">{{ item.name }}</td>
                           <td
                              class="text-wrap text-center align-middle"
                              style="max-width: 350px; white-space: normal"
                           >
                              {{ item.description }}
                           </td>
                           <td class="align-middle">
                              <button class="btn btn-sm btn-danger" @click="deleteProduct(item)">
                                 Xóa
                              </button>
                           </td>
                        </tr>
                     </tbody>
                  </table>

                  <!-- Phân trang -->
                  <nav v-if="filteredProducts.length > itemsPerPage">
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

   const API_URL = import.meta.env.VITE_API_BASE_URL + '/admin/products';
   const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

   const products = ref([]);
   const product = ref({ name: '', description: '', poster: '', preview: '' });
   const toast = ref({ message: '', type: '' });
   const searchQuery = ref('');
   const currentPage = ref(1);
   const itemsPerPage = 10;
   const token = localStorage.getItem('token');
   

   /* ===== Toast ===== */
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

   /* ===== Lấy danh sách sản phẩm ===== */
   async function fetchProducts() {
      try {
         const res = await axios.get(API_URL);
         products.value = res.data.filter((f) => !f.isDeleted);
      } catch (err) {
         showToast('Không thể tải danh sách sản phẩm!', 'error');
      }
   }

   /* ===== Tạo sản phẩm ===== */
   async function createProduct() {
      if (!product.value.name.trim() || !product.value.description.trim()) {
         showToast('Vui lòng nhập đầy đủ thông tin sản phẩm!', 'error');
         return;
      }

      const formData = new FormData();
      formData.append('name', product.value.name);
      formData.append('description', product.value.description);
      formData.append('poster', product.value.poster);

      console.log('Form Data Create: ', formData);
      try {
         await axios.post(API_URL, formData, {
            headers: {
               Authorization: `Bearer ${token}`,
               'Content-Type': 'multipart/form-data',
            }
         });
         showToast('Thêm sản phẩm thành công!');
         product.value = { name: '', description: '', poster: null, preview: null };
         await fetchProducts();
      } catch (err) {
         const msg = err.response?.data?.message || 'Lỗi khi thêm sản phẩm!';
         showToast(msg, 'error');
      }
   }

   /* ===== Xóa sản phẩm ===== */
   async function deleteProduct(item) {
      // if (!confirm(`Xác nhận xóa sản phẩm "${item.name}"?`)) return;
      const confirmed = await showConfirm(`Xác nhận xóa sản phẩm "${item.name}"?`);

      if (!confirmed) {
         Swal.fire({
            icon: 'info',
            title: 'Đã huỷ xoá sản phẩm',
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
         });
         return;
      }

      try {
         await axios.delete(`${API_URL}/${item.id}`,
            {
               headers: {
                  Authorization: `Bearer ${token}`
               }
            }
         );
         showToast('Sản phẩm đã được xóa!');
         await fetchProducts();
      } catch (err) {
         const msg = err.response?.data?.message || 'Không thể xóa sản phẩm này!';
         showToast(msg, 'error');
      }
   }

   /* ===== Tìm kiếm + Phân trang ===== */
   const filteredProducts = computed(() => {
      const query = searchQuery.value.trim().toLowerCase();
      if (!query) return products.value;
      return products.value.filter((f) => f.name.toLowerCase().includes(query));
   });

   const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage));

   const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      return filteredProducts.value.slice(start, start + itemsPerPage);
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

   function posterSrc(poster) {
      return IMAGE_URL + poster;
   }

   function handlePoster(event) {
      const file = event.target.files[0];

      if (file) {
         product.value.poster = file;

         const reader = new FileReader();
         reader.onload = (e) => {
            product.value.preview = e.target.result;
         };
         reader.readAsDataURL(file);
      }
   }

   watch(searchQuery, () => (currentPage.value = 1));

   onMounted(fetchProducts);
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
   .fade-enter-active,
   .fade-leave-active {
      transition: opacity 0.3s;
   }
   .fade-enter-from,
   .fade-leave-to {
      opacity: 0;
   }
   .text-wrap {
      white-space: normal !important;
      word-wrap: break-word;
   }
   .table td,
   .table th {
      vertical-align: middle;
      text-align: center;
   }
</style>
