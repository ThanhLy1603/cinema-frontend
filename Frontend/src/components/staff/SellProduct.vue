<template>
   <div class="pos-container">
      <div class="container-fluid py-4">
         <h1 class="text-center mb-5 fw-bold text-dark">ĐỒ UỐNG & ĐỒ ĂN VẶT</h1>

         <div class="row g-4">
            <!-- Danh sách sản phẩm -->
            <div class="col-lg-8">
               <div class="row g-4">
                  <div
                     v-for="item in displayProducts"
                     :key="item.product.id"
                     class="col-xl-4 col-lg-6 col-md-6 col-sm-6 my-4"
                  >
                     <div
                        class="product-card shadow-sm"
                        :class="{ selected: isInCart(item.product.id) }"
                        @click="addToCart(item.product.id)"
                     >
                        <img
                           :src="posterSrc(item.product.poster)"
                           :alt="item.product.name"
                           class="product-image"
                           @error="handleImageError"
                        />
                        <div class="product-body p-4">
                           <h5 class="product-name fw-bold">{{ item.product.name }}</h5>
                           <p class="product-description text-muted mb-3">
                              {{ item.product.description }}
                           </p>
                           <div class="d-flex justify-content-between align-items-center">
                              <span class="product-price fw-bold text-primary fs-4">
                                 {{ formatPrice(item.price) }} ₫
                              </span>
                              <span v-if="isInCart(item.product.id)" class="badge bg-primary fs-6">
                                 Đã thêm
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <!-- Giỏ hàng -->
            <div class="col-lg-4">
               <div class="cart-panel shadow-sm">
                  <h3 class="cart-title fw-bold text-center mb-4">Giỏ hàng</h3>

                  <div class="cart-items">
                     <div v-if="cart.length === 0" class="text-center text-muted py-5">
                        Chưa có sản phẩm nào
                     </div>

                     <div
                        v-else
                        v-for="item in cart"
                        :key="item.id"
                        class="cart-item mb-3 pb-3 border-bottom"
                     >
                        <div class="d-flex justify-content-between align-items-start">
                           <div class="flex-grow-1 pe-3">
                              <h6 class="mb-1 fw-bold">{{ item.name }}</h6>
                              <small class="text-muted">{{ formatPrice(item.price) }} ₫</small>
                           </div>
                           <button
                              class="btn btn-sm btn-outline-danger"
                              @click.stop="removeFromCart(item.id)"
                           >
                              ×
                           </button>
                        </div>

                        <div class="d-flex justify-content-center align-items-center mt-3 gap-3">
                           <button class="btn qty-btn" @click.stop="decreaseQuantity(item.id)">
                              –
                           </button>
                           <span class="qty-number fw-bold fs-5">{{ item.quantity }}</span>
                           <button class="btn qty-btn" @click.stop="increaseQuantity(item.id)">
                              +
                           </button>
                        </div>

                        <div class="text-end mt-2 fw-bold text-primary">
                           {{ formatPrice(item.price * item.quantity) }} ₫
                        </div>
                     </div>
                  </div>

                  <div class="cart-total mt-4 pt-4 border-top">
                     <div class="d-flex justify-content-between align-items-center mb-4">
                        <h4 class="mb-0 fw-bold">Tổng cộng</h4>
                        <h3 class="mb-0 text-primary fw-bold">{{ formatPrice(totalAmount) }} ₫</h3>
                     </div>
                     <button
                        class="btn btn-success btn-lg w-100 fw-bold"
                        :disabled="cart.length === 0"
                        @click="sellProduct()"
                     >
                        THANH TOÁN
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <transition name="fade">
         <div
            v-if="toast?.message"
            class="toast-custom"
            :class="toast.type === 'error' ? 'bg-danger' : 'bg-success'"
         >
            {{ toast?.message }}
         </div>
      </transition>
   </div>
</template>

<script setup>
   import axios from 'axios';
   import { ref, onMounted, computed } from 'vue';
   import { jwtDecode } from 'jwt-decode';

   const currentUser = ref();

   const products = ref([]);
   const prices = ref([]);
   const cart = ref([]);

   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
   const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

   // Xử lý hiện thị thông báo (Toast)
   const toast = ref({ message: '', type: '' });

   function showToast(msg, type = 'success') {
      toast.value = { message: msg, type };
      setTimeout(() => (toast.value.message = ''), 3000);
   }

   function getCurrentUser() {
      const token = localStorage.getItem('token') || null;
      const decoded = jwtDecode(token);
      currentUser.value = decoded.subject;
      console.log('currentUser: ', currentUser.value);
   }

   async function getProducts() {
      try {
         const response = await axios.get(`${API_BASE_URL}/products`);
         products.value = response.data;
      } catch (error) {
         console.error('Lỗi lấy sản phẩm:', error.message);
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

   function posterSrc(poster) {
      return IMAGE_URL + poster;
   }
   
   const displayProducts = computed(() => {
      return products.value
         .map((product) => {
            const currentPrice = prices.value.find(
               (p) => p.productId === product.id && p.endDate === null
            );
            return {
               product,
               price: currentPrice ? currentPrice.price : 0,
            };
         })
         .filter((item) => item.price > 0);
   });

   function addToCart(productId) {
      const info = displayProducts.value.find((p) => p.product.id === productId);
      if (!info) return;

      const existing = cart.value.find((i) => i.id === productId);
      if (existing) {
         existing.quantity += 1;
      } else {
         cart.value.push({
            id: productId,
            name: info.product.name,
            price: info.price,
            quantity: 1,
         });
      }
   }

   function increaseQuantity(id) {
      const item = cart.value.find((i) => i.id === id);
      if (item) item.quantity += 1;
   }

   function decreaseQuantity(id) {
      const item = cart.value.find((i) => i.id === id);
      if (item) {
         if (item.quantity > 1) {
            item.quantity -= 1;
         } else {
            removeFromCart(id);
         }
      }
   }

   function removeFromCart(id) {
      cart.value = cart.value.filter((i) => i.id !== id);
   }

   function isInCart(id) {
      return cart.value.some((i) => i.id === id);
   }

   const totalAmount = computed(() => {
      return cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
   });

   function formatPrice(price) {
      return new Intl.NumberFormat('vi-VN').format(price);
   }

   function handleImageError(e) {
      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
   }

   async function sellProduct() {
      let invoiceInfo = {
         invoice: {},
         products: [],
      };

      if (cart.value.length === 0) {
         return;
      }

      const total = totalAmount.value;
      const discount = 0;

      invoiceInfo.invoice = {
         customerName: '',
         customerAddress: '',
         customerPhone: '',
         username: currentUser.value,
         totalAmount: total,
         discount: discount,
         finalAmount: total - discount,
      };

      console.log('cart: ', cart.value);

      cart.value.forEach((item) => {
         invoiceInfo.products.push({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            promotionId: null,
         });
      });

      console.log('Invoice Info: ', invoiceInfo);

      try {
         const response = await axios.post(`${API_BASE_URL}/staff/sell-product`, invoiceInfo);
         if (response.data.status === 'success') {
            showToast('Thanh toán thành công', 'success');

            cart.value = [];
         } else {
            showToast('Thanh toán thất bại', 'error');
         }
         
      } catch (error) {
         console.error('Lỗi khi tạo hoá đơn: ', error.message);
      }
   }

   onMounted(async () => {
      getCurrentUser();
      await getProducts();
      await getPrices();
   });
</script>

<style scoped>
   .pos-container {
      background-color: #fff;
      min-height: 100vh;
      font-family: 'Segoe UI', sans-serif;
   }

   .product-card {
      background: #fff;
      border-radius: 16px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      height: 100%;
      display: flex;
      flex-direction: column;
   }

   .product-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
   }

   .product-card.selected {
      border-color: #007bff;
      box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.2);
   }

   .product-image {
      width: 100%;
      height: 260px;
      object-fit: cover;
   }

   .product-body {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
   }

   .product-name {
      font-size: 1.25rem;
      color: #212529;
   }

   .product-description {
      font-size: 0.95rem;
      line-height: 1.5;
      flex-grow: 1;
   }

   .cart-panel {
      background: #fff;
      border-radius: 16px;
      padding: 24px;
      height: calc(100vh - 100px);
      display: flex;
      flex-direction: column;
      position: sticky;
      top: 20px;
   }

   .cart-title {
      color: #212529;
      font-size: 1.8rem;
   }

   .cart-items {
      flex: 1;
      overflow-y: auto;
      padding-right: 8px;
   }

   .cart-item {
      background: #f8f9fa;
      padding: 16px;
      border-radius: 12px;
   }

   .qty-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #e9ecef;
      color: #495057;
      font-size: 1.5rem;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
   }

   .qty-btn:hover {
      background: #007bff;
      color: white;
   }

   .qty-number {
      min-width: 60px;
      text-align: center;
   }

   .cart-total {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 12px;
   }

   .btn-success {
      padding: 16px;
      font-size: 1.4rem;
   }

   /* STYLE CỦA TOAST */
   .toast-custom {
      position: fixed;
      top: 20px;
      right: 20px;
      color: #fff;
      padding: 8px 15px;
      border-radius: 5px;
      z-index: 9999;
   }
</style>
