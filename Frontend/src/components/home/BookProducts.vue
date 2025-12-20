<template>
  <div class="min-vh-100 bg-light">
    <div style="padding-bottom: 250px;"><Header /></div>

    <div class="container py-5" style="padding-top: 250px;">
      <div class="row g-5">
        <!-- CỘT TRÁI: Danh sách combo -->
        <div class="col-lg-8">
          <div class="text-center mb-5">
            <h1 class="display-5 fw-bold text-success mb-3">Chọn Combo Bắp Nước</h1>
            <p class="text-muted fs-5">Thêm combo để trọn vẹn trải nghiệm xem phim!</p>
          </div>

          <div class="row g-4">
            <div v-for="product in products" :key="product.id" class="col-12 col-md-6 col-lg-6">
              <div class="combo-card h-100 bg-white rounded-4 overflow-hidden shadow-sm">
                <div class="ratio ratio-4x3 bg-light">
                  <img :src="posterSrc(product.poster)" :alt="product.name" class="object-fit-cover" @error="handleImageError" />
                </div>

                <div class="p-4 d-flex flex-column justify-content-between" style="min-height: 280px;">
                  <div>
                    <h5 class="fw-bold mb-2 line-clamp-2">{{ product.name }}</h5>
                    <p class="text-muted small line-clamp-3">{{ product.description || 'Combo đặc biệt' }}</p>
                  </div>

                  <div>
                    <div class="d-flex align-items-baseline mb-3">
                      <span class="text-success fw-bold fs-3">{{ formatPrice(getProductPrice(product.id)) }}</span>
                      <span class="text-muted ms-1 fs-5">đ</span>
                    </div>
                    <button @click="addToCart(product)" class="btn btn-success w-100 rounded-pill fw-bold py-3">
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CỘT PHẢI: Giỏ hàng -->
        <div class="col-lg-4">
          <div class="sticky-top" style="top: 100px;">
            <div class="bg-white rounded-4 shadow-lg p-4">
              <h4 class="fw-bold d-flex align-items-center mb-4">
                Giỏ hàng
                <span class="badge bg-success ms-2">{{ bookingStore.cartItemCount }}</span>
              </h4>

              <!-- Giỏ rỗng -->
              <div v-if="bookingStore.cartItemCount === 0" class="text-center py-5 text-muted">
                Chưa chọn món nào
              </div>

              <!-- Có món -->
              <div v-else>
                <!-- Hiển thị ghế đã chọn -->
                <div v-for="seat in bookingStore.bookingInfo.selectedSeats" :key="seat.seatId" class="d-flex justify-content-between py-2 border-bottom">
                  <span>Ghế {{ seat.position }} <small class="text-muted">({{ seat.seatType }})</small></span>
                  <strong class="text-success">{{ formatPrice(seat.ticketPrice || seat.price) }}đ</strong>
                </div>

                <!-- Hiển thị combo -->
                <div v-for="item in bookingStore.productsInCart" :key="item.id" class="d-flex align-items-center mb-3 pb-3 border-bottom">
                  <img :src="posterSrc(item.poster)" class="rounded me-3" style="width:60px;height:60px;object-fit:cover;" />
                  <div class="flex-grow-1">
                    <h6 class="mb-1 line-clamp-2">{{ item.name }}</h6>
                    <div class="d-flex align-items-center justify-content-between">
                      <span class="text-success fw-bold">{{ formatPrice(item.price) }}đ</span>
                      <div class="btn-group btn-group-sm">
                        <button @click="bookingStore.decreaseQuantity(item.id)" class="btn btn-outline-secondary">-</button>
                        <span class="btn btn-outline-secondary px-3">{{ item.quantity }}</span>
                        <button @click="bookingStore.increaseQuantity(item.id)" class="btn btn-outline-secondary">+</button>
                      </div>
                      <button @click="bookingStore.removeProduct(item.id)" class="btn btn-sm text-danger ms-2">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Tổng tiền + nút thanh toán -->
                <div class="mt-4 pt-3 border-top">
                  <div class="d-flex justify-content-between mb-3">
                    <span class="fw-bold fs-5">Tổng cộng</span>
                    <span class="text-success fw-bold fs-4">{{ formatPrice(bookingStore.totalAmount) }}đ</span>
                  </div>
                  <button @click="goToPayment" class="btn btn-success btn-lg w-100 rounded-pill fw-bold py-3 shadow">
                    Tiếp tục thanh toán
                  </button>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useBookingStore } from '../stores/BookingStore'  // ĐÚNG ĐƯỜNG DẪN
import Header from '../header/Header.vue'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL

const products = ref([])
const prices = ref([])
const bookingStore = useBookingStore()
const router = useRouter()

const getProducts = async () => {
  const res = await axios.get(`${API_BASE_URL}/products`)
  products.value = res.data || []
}

const getPriceProducts = async () => {
  const res = await axios.get(`${API_BASE_URL}/bookings/productprices`)
  prices.value = res.data || []
}

const getProductPrice = (id) => prices.value.find(p => p.productId === id)?.price || 0
const posterSrc = (poster) => poster ? `${IMAGE_URL}${poster}` : 'https://via.placeholder.com/400x300?text=Combo'
const handleImageError = (e) => { e.target.src = 'https://via.placeholder.com/400x300/f0f0f0/999?text=No+Image' }
const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price || 0)

const addToCart = (product) => {
  const price = getProductPrice(product.id)
  bookingStore.addProduct({
    id: product.id,
    name: product.name,
    price: price,
    poster: product.poster
  })
}

const goToPayment = () => {
  router.push('/payment')
}

onMounted(() => {
  getProducts()
  getPriceProducts()
  console.log('film id: ', bookingStore.bookingInfo.film)
  console.log('schedule id: ', bookingStore.bookingInfo.schedule)
})
</script>