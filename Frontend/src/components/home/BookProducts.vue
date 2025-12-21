<template>
   <div class="min-vh-100 bg-gradient bg-light">
      <!-- Header cố định -->
      <Header class="position-fixed top-0 start-0 end-0 bg-white shadow-sm z-3" />

      <!-- Main content -->
      <div class="container py-5 pt-header">
         <div class="text-center mb-5 pt-5">
            <h1 class="display-5 fw-bold text-success mb-3">Chọn Combo Bắp Nước Ngon</h1>
            <p class="lead text-muted">Hoàn thiện trải nghiệm xem phim với những combo hấp dẫn!</p>
         </div>

         <div class="row g-5">
            <!-- Danh sách combo -->
            <div class="col-lg-8">
               <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                  <div v-for="product in products" :key="product.id" class="col my-5">
                     <div
                        class="card combo-card h-100 border-0 shadow-sm rounded-4 overflow-hidden transition-all hover-shadow-lg hover-scale"
                        @click="addToCart(product)"
                     >
                        <div class="ratio ratio-1x1">
                           <img
                              :src="posterSrc(product.poster)"
                              :alt="product.name"
                              class="card-img-top object-fit-cover"
                              @error="handleImageError"
                           />
                        </div>

                        <div class="card-body d-flex flex-column p-4">
                           <h5 class="card-title fw-bold mb-2 line-clamp-2">{{ product.name }}</h5>
                           <p class="card-text text-muted small flex-grow-1 line-clamp-3">
                              {{ product.description || 'Combo đặc biệt dành cho bạn' }}
                           </p>

                           <div class="mt-4">
                              <div class="d-flex align-items-baseline mb-3">
                                 <span class="text-success fw-bold fs-3">
                                    {{ formatPrice(getProductPrice(product.id)) }}
                                 </span>
                                 <span class="text-muted ms-1 fs-5">₫</span>
                              </div>
                              <button
                                 class="btn btn-success w-100 rounded-pill fw-semibold py-3 shadow-sm"
                                 @click.stop="addToCart(product)"
                              >
                                 <i class="bi bi-cart-plus me-2"></i>Thêm vào giỏ
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <!-- Giỏ hàng bên phải -->
            <div class="col-lg-4">
               <div class="sticky-top" style="top: 90px">
                  <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
                     <div class="card-header bg-success text-white py-3">
                        <h4 class="mb-0 fw-bold d-flex align-items-center justify-content-between">
                           Giỏ hàng
                           <span class="badge bg-white text-success fs-6">{{
                              bookingStore.cartItemCount
                           }}</span>
                        </h4>
                     </div>

                     <div class="card-body p-4">
                        <!-- Giỏ trống -->
                        <div v-if="bookingStore.cartItemCount === 0" class="text-center py-5">
                           <i class="bi bi-cart3 display-4 text-muted mb-3"></i>
                           <p class="text-muted">Chưa có món nào trong giỏ</p>
                        </div>

                        <!-- Có sản phẩm -->
                        <div v-else>
                           <!-- Ghế đã chọn -->
                           <div
                              v-if="bookingStore.bookingInfo.selectedSeats.length > 0"
                              class="mb-4"
                           >
                              <h6 class="fw-semibold text-muted mb-3">Vé đã chọn</h6>
                              <div
                                 v-for="seat in bookingStore.bookingInfo.selectedSeats"
                                 :key="seat.seatId"
                                 class="d-flex justify-content-between py-2 small"
                              >
                                 <span>
                                    Ghế <strong>{{ seat.position }}</strong>
                                    <small class="text-muted">({{ seat.seatType }})</small>
                                 </span>
                                 <span class="text-success fw-semibold">
                                    {{ formatPrice(seat.ticketPrice || seat.price) }}₫
                                 </span>
                              </div>
                              <hr class="my-3" />
                           </div>

                           <!-- Combo trong giỏ -->
                           <div class="mb-4">
                              <h6 class="fw-semibold text-muted mb-3">Combo bắp nước</h6>
                              <div
                                 v-for="item in bookingStore.productsInCart"
                                 :key="item.id"
                                 class="d-flex align-items-center mb-3 pb-3 border-bottom last-border-none"
                              >
                                 <img
                                    :src="posterSrc(item.poster)"
                                    class="rounded-3 me-3 flex-shrink-0"
                                    style="width: 64px; height: 64px; object-fit: cover"
                                 />
                                 <div class="flex-grow-1">
                                    <h6 class="mb-1 fw-semibold line-clamp-1">{{ item.name }}</h6>
                                    <div
                                       class="d-flex align-items-center justify-content-between mt-2"
                                    >
                                       <span class="text-success fw-bold"
                                          >{{ formatPrice(item.price) }}₫</span
                                       >
                                       <div class="d-flex align-items-center gap-2">
                                          <button
                                             @click.stop="bookingStore.decreaseQuantity(item.id)"
                                             class="btn btn-sm btn-outline-secondary rounded-circle"
                                             :disabled="item.quantity <= 1"
                                          >
                                             −
                                          </button>
                                          <span class="fw-bold px-2">{{ item.quantity }}</span>
                                          <button
                                             @click.stop="bookingStore.increaseQuantity(item.id)"
                                             class="btn btn-sm btn-outline-secondary rounded-circle"
                                          >
                                             +
                                          </button>
                                          <button
                                             @click.stop="bookingStore.removeProduct(item.id)"
                                             class="btn btn-sm text-danger ms-2"
                                          >
                                             <i class="bi bi-trash"></i>
                                          </button>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <!-- Tổng tiền -->
                           <div class="border-top pt-4">
                              <div class="d-flex justify-content-between mb-2 text-muted small">
                                 <span>Tiền vé</span>
                                 <span>{{ formatPrice(bookingStore.ticketTotal) }}₫</span>
                              </div>
                              <div class="d-flex justify-content-between mb-3 text-muted small">
                                 <span>Tiền combo</span>
                                 <span>{{ formatPrice(bookingStore.productTotal) }}₫</span>
                              </div>
                              <div class="d-flex justify-content-between align-items-baseline">
                                 <span class="fw-bold fs-5">Tổng cộng</span>
                                 <span class="text-success fw-bold fs-3">
                                    {{ formatPrice(bookingStore.totalAmount) }}₫
                                 </span>
                              </div>

                              <button
                                 @click="goToPayment"
                                 class="btn btn-success btn-lg w-100 rounded-pill mt-4 fw-bold shadow"
                              >
                                 Tiếp tục thanh toán
                                 <i class="bi bi-arrow-right ms-2"></i>
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
   import { ref, onMounted } from 'vue';
   import { useRouter } from 'vue-router';
   import axios from 'axios';
   import { useBookingStore } from '../stores/BookingStore';
   import Header from '../header/Header.vue';

   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
   const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

   const products = ref([]);
   const prices = ref([]);
   const bookingStore = useBookingStore();
   const router = useRouter();

   async function getProducts() {
      try {
         const response = await axios.get(`${API_BASE_URL}/products`);
         products.value = response.data;
      } catch (error) {
         products.value = [];
         console.error('Lỗi khi lấy danh sách sản phẩm:', error.message);
      }
   }

   async function getPriceProducts() {
      try {
         const response = await axios.get(`${API_BASE_URL}/product-prices`);
         prices.value = response.data;
      } catch (error) {
         console.error('Lỗi khi lấy giá sản phẩm:', error.message);
      }
   }

   function getProductPrice(id) {
      return prices.value.find((p) => p.productId === id)?.price || 0;
   }

   function posterSrc(poster) {
      return poster ? `${IMAGE_URL}${poster}` : 'https://via.placeholder.com/400x400?text=Combo';
   }

   function handleImageError(e) {
      e.target.src = 'https://via.placeholder.com/400x400/f8f9fa/6c757d?text=No+Image';
   }

   function formatPrice(price) {
      return new Intl.NumberFormat('vi-VN').format(price || 0);
   }

   function addToCart(product) {
      const price = getProductPrice(product.id);
      if (price > 0) {
         bookingStore.addProduct({
            id: product.id,
            name: product.name,
            price: price,
            poster: product.poster,
         });
      }
   }

   function goToPayment() {
      router.push('/payment');
   }

   onMounted(async () => {
      await Promise.all([getProducts(), getPriceProducts()]);
   });
</script>

<style scoped>
   .pt-header {
      padding-top: 120px; /* Khoảng cách cho header cố định */
   }

   .combo-card {
      cursor: pointer;
      transition: all 0.3s ease;
   }

   .combo-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
   }

   .hover-scale {
      transform: scale(1);
   }

   .hover-scale:hover {
      transform: scale(1.03);
   }

   .line-clamp-1 {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
   }
   .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
   }
   .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
   }

   .last-border-none:last-child {
      border-bottom: none !important;
      padding-bottom: 0 !important;
      margin-bottom: 0 !important;
   }

   .z-3 {
      z-index: 1030;
   }
</style>
