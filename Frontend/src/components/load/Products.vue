<template>
   <div class="container py-5">
      <h1 class="text-center mb-5 fw-bold text-success">Products</h1>

      <div class="row g-4">
         <div
            v-for="product in products"
            :key="product.id"
            class="col-12 col-sm-6 col-md-4 col-lg-3 my-4"
         >
            <!-- Card sản phẩm -->
            <div class="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
               <!-- Hình ảnh -->
               <div class="ratio ratio-1x1">
                  <img
                     :src="posterSrc(product.poster)"
                     :alt="product.name"
                     class="card-img-top object-fit-cover"
                     @error="handleImageError"
                  />
               </div>

               <!-- Nội dung -->
               <div class="card-body d-flex flex-column p-3">
                  <h5 class="card-title fw-bold text-dark mb-2 text-truncate">
                     {{ product.name }}
                  </h5>
                  <p class="card-text text-muted small flex-grow-1 mb-3">
                     {{ product.description || 'Không có mô tả' }}
                  </p>

                  <div class="d-flex justify-content-between align-items-center mb-4">
                     <span class="product-price fw-bold text-primary fs-4">
                        Giá sản phẩm: {{ getProductPrice(product.id).toLocaleString('vi-VN') }} ₫
                     </span>
                  </div>

                  <!-- Nút "Chi Tiết" -->
                  <div class="mt-auto">
                     <button
                        @click="showDetail(product)"
                        class="btn btn-success w-100 fw-semibold rounded-pill py-3 shadow-sm"
                     >
                        Chi Tiết
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <!-- Không có sản phẩm -->
      <div v-if="products.length === 0" class="text-center py-5">
         <p class="text-muted">Không có sản phẩm nào.</p>
      </div>
   </div>
</template>

<script setup>
   import { ref, onMounted } from 'vue';
   import { useRouter } from 'vue-router'; // <-- Import router
   import axios from 'axios';

   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
   const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

   const products = ref([]);
   const prices = ref([]);
   const router = useRouter(); // <-- Khởi tạo router

   async function getProducts() {
      try {
         const url = `${API_BASE_URL}/products`;
         const response = await axios.get(url);
         products.value = response.data;

         console.log('Products loaded:', products.value);
      } catch (error) {
         console.error('Lỗi khi lấy dữ liệu từ products:', error.message);
      }
   }

   async function getPrices() {
      try {
         const response = await axios.get(`${API_BASE_URL}/product-prices`);
         prices.value = response.data;
      } catch (error) {
         console.error('Lỗi lấy giá:', error.message);
      }
   }

   function getProductPrice(id) {
      return prices.value.find((p) => p.productId === id)?.price || 0;
   }

   function posterSrc(poster) {
      return poster ? `${IMAGE_URL}${poster}` : 'https://via.placeholder.com/300?text=No+Image';
   }

   function handleImageError(e) {
      e.target.src = 'https://via.placeholder.com/300?text=Image+Not+Found';
   }

   function showDetail(product) {
      // Chuyển hướng đến trang chi tiết frontend
      router.push(`/products/${product.id}`);
   }

   onMounted(() => {
      getProducts();
      getPrices();
   });
</script>

<style scoped>
   .card {
      transition:
         transform 0.3s ease,
         box-shadow 0.3s ease;
   }
   .card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
   }

   .ratio img {
      transition: transform 0.4s ease;
   }
   .card:hover .ratio img {
      transform: scale(1.05);
   }

   .btn-success {
      background: linear-gradient(135deg, #28a745, #20c997);
      border: none;
   }
   .btn-success:hover {
      background: linear-gradient(135deg, #218838, #1daa80);
   }

   @media (max-width: 576px) {
      .card-title {
         font-size: 1rem;
      }
      .btn {
         font-size: 0.9rem;
         padding: 0.5rem;
      }
   }
</style>
