<template>
   <!-- HEADER -->
   <Header />

   <div class="container py-5">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-4">
         <ol class="breadcrumb">
            <li class="breadcrumb-item">
               <router-link to="/products" class="text-success text-decoration-none"
                  >Products</router-link
               >
            </li>
            <li class="breadcrumb-item active" aria-current="page">
               {{ product.name || 'Đang tải...' }}
            </li>
         </ol>
      </nav>

      <!-- Nội dung chi tiết -->
      <div class="row g-5" v-if="product.id">
         <!-- Hình ảnh -->
         <div class="col-lg-6">
            <div class="detail-img-wrapper rounded-3 overflow-hidden shadow-sm ratio ratio-1x1">
               <img
                  :src="posterSrc(product.poster)"
                  :alt="product.name"
                  class="detail-img img-fluid w-100 h-100 object-fit-cover"
                  @error="handleImageError"
               />
            </div>
         </div>

         <!-- Thông tin -->
         <div class="col-lg-6">
            <div class="detail-info">
               <h1 class="detail-name fw-bold text-dark mb-3">{{ product.name }}</h1>

               <div class="detail-price mb-4">
                  <span class="price-current text-success fs-2 fw-bold">{{ product.price }}</span>
               </div>
               <div>
                  <h5 class="fw-semibold mb-2">Mô tả sản phẩm:</h5>
               </div>
               <p class="detail-desc mb-4 lh-lg">
                  {{ product.description || 'Không có mô tả' }}
               </p>

               <div
                  class="detail-note bg-light p-3 rounded-3 mb-4 border"
                  style="border-color: gainsboro"
               >
                  <p class="text-success fw-medium mb-0 d-flex align-items-center">
                     Gift: Nhận trong ngày xem phim
                  </p>
               </div>

               <div class="d-flex flex-column gap-3">
                  <button
                     @click="buyNow"
                     class="btn btn-success w-100 fw-semibold rounded-pill py-3 shadow-sm"
                  >
                     Mua Ngay
                  </button>
               </div>
            </div>
         </div>
      </div>

      <!-- Loading / Không tìm thấy -->
      <div v-else class="text-center py-5">
         <p class="text-muted">{{ loading ? 'Đang tải...' : 'Không tìm thấy sản phẩm' }}</p>
      </div>

      <!-- Gợi ý sản phẩm -->
      <div class="mt-6" v-if="relatedProducts.length > 0">
         <h3 class="fw-bold mb-4 text-center">Sản phẩm khác bạn có thể thích</h3>
         <div class="row g-4">
            <div
               v-for="item in relatedProducts"
               :key="item.id"
               class="col-12 col-sm-6 col-md-4 col-lg-3"
            >
               <a
                  @click="goToDetail(item.id)"
                  class="card h-100 shadow-sm border-0 rounded-3 overflow-hidden cursor-pointer"
               >
                  <div class="ratio ratio-1x1">
                     <img
                        :src="posterSrc(item.poster)"
                        :alt="item.name"
                        class="card-img-top object-fit-cover"
                        @error="handleImageError"
                     />
                  </div>
                  <div class="card-body p-3 text-center">
                     <h6 class="fw-bold text-dark mb-1 text-truncate">{{ item.name }}</h6>
                     <p class="text-success small fw-medium mb-0">{{ item.price }}</p>
                  </div>
               </a>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
   import { ref, onMounted, watch } from 'vue';
   import { useRoute, useRouter } from 'vue-router';
   import axios from 'axios';
   import Header from '../header/Header.vue';

   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
   const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

   const route = useRoute();
   const router = useRouter();

   const product = ref({});
   const relatedProducts = ref([]);
   const loading = ref(true); // ĐÃ THÊM

   // SỬA: Thêm } đóng hàm + loading
   async function getProduct(id = route.params.id) {
      if (!id || id === 'undefined') {
         loading.value = false;
         return;
      }

      try {
         loading.value = true;
         const [prodRes, allRes] = await Promise.all([
            axios.get(`${API_BASE_URL}/products/${id}`),
            axios.get(`${API_BASE_URL}/products`),
         ]);

         product.value = prodRes.data;
         relatedProducts.value = allRes.data.filter((p) => p.id !== id).slice(0, 4);
      } catch (error) {
         console.error('Lỗi khi lấy sản phẩm:', error);
         product.value = {};
      } finally {
         loading.value = false;
      }
   }

   function posterSrc(poster) {
      return poster ? `${IMAGE_URL}${poster}` : 'https://via.placeholder.com/600?text=No+Image';
   }

   function handleImageError(e) {
      e.target.src = 'https://via.placeholder.com/600?text=Image+Not+Found';
   }

   function buyNow() {
      alert(`Đã chọn mua ngay: ${product.value.name}`);
   }

   function goToDetail(id) {
      if (id && id !== 'undefined') {
         router.push(`/products/${id}`);
      }
   }

   // THEO DÕI THAY ĐỔI ID TRONG URL
   watch(
      () => route.params.id,
      (newId) => {
         if (newId) {
            getProduct(newId);
         }
      }
   );

   onMounted(() => {
      getProduct();
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

   .detail-img-wrapper {
      background: #eee;
   }

   .btn-success {
      background: linear-gradient(135deg, #28a745, #20c997);
      border: none;
   }

   .detail-desc {
      font-size: 2.5rem;
      color: #218838;
   }

   .btn-success:hover {
      background: linear-gradient(135deg, #218838, #1daa80);
   }

   .cursor-pointer {
      cursor: pointer;
   }

   .breadcrumb-item + .breadcrumb-item::before {
      content: '>';
      color: #28a745;
   }

   @media (max-width: 768px) {
      .detail-name {
         font-size: 1.5rem;
      }

      .btn {
         font-size: 0.9rem;
         padding: 0.5rem 1rem;
      }
   }
</style>
