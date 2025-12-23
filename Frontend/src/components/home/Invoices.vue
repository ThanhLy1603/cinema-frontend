<template>
   <div class="min-vh-100 bg-light">
      <div style="padding-bottom: 250px">
         <Header />
      </div>

      <div class="container py-5" style="padding-top: 300px; max-width: 1000px">
         <!-- Tiêu đề -->
         <div class="text-center mb-5">
            <h1 class="display-5 fw-bold text-success mb-3">Xác nhận & Thanh toán</h1>
            <p class="text-muted fs-5">Vui lòng kiểm tra kỹ thông tin trước khi thanh toán</p>
         </div>

         <!-- Card chính -->
         <div class="bg-white rounded-4 shadow-lg overflow-hidden">
            <!-- Header phim + suất chiếu -->
            <div
               class="bg-gradient text-white p-4 p-md-5"
               style="background: linear-gradient(135deg, #28a745, #20c997)"
            >
               <div class="row align-items-center g-4">
                  <div class="col-md-3 text-center">
                     <img
                        :src="filmPoster"
                        alt="Poster phim"
                        class="img-fluid rounded shadow-sm"
                        style="max-height: 200px; object-fit: cover"
                     />
                  </div>
                  <div class="col-md-9">
                     <h2 class="fw-bold mb-2">{{ film.name || 'Tên phim' }}</h2>
                     <div class="d-flex flex-wrap gap-3 fs-5" style="font-size: xx-large">
                        <p>
                           <span
                              ><i class="bi bi-calendar3"></i>
                              {{ formatDate(schedule.scheduleDate) }}</span
                           >
                        </p>
                        <p>
                           <span style="padding-left: 10px"
                              ><i class="bi bi-clock"></i> {{ schedule.showTime?.startTime }}
                           </span>
                        </p>

                        <p>
                           <span><i class="bi bi-geo-alt"></i> {{ schedule.room?.name }} </span>
                        </p>
                     </div>
                     <p class="mb-0 mt-3 fs-4" style="font-size: xx-large">
                        Ghế đã chọn:
                        <strong class="text-warning">{{ selectedSeatsText }}</strong>
                     </p>
                  </div>
               </div>
            </div>

            <div class="p-4 p-md-5">
               <div class="row g-5">
                  <!-- Cột trái: Thông tin khách hàng -->
                  <div class="col-lg-6">
                     <h4 class="fw-bold text-success mb-4">
                        <i class="bi bi-person-circle"></i> Thông tin liên hệ
                     </h4>
                     <form @submit.prevent="confirmPayment">
                        <div class="mb-4">
                           <label class="form-label fw-bold"
                              >Họ và tên <span class="text-danger">*</span></label
                           >
                           <input
                              v-model="form.fullName"
                              type="text"
                              class="form-control form-control-lg rounded-pill"
                              placeholder="Nguyễn Văn A"
                              required
                           />
                        </div>

                        <div class="mb-4">
                           <label class="form-label fw-bold"
                              >Số điện thoại <span class="text-danger">*</span></label
                           >
                           <input
                              v-model="form.phone"
                              type="tel"
                              class="form-control form-control-lg rounded-pill"
                              placeholder="0901234567"
                              required
                           />
                        </div>

                        <div class="mb-4">
                           <label class="form-label fw-bold">Email (nhận vé điện tử)</label>
                           <input
                              v-model="form.email"
                              type="email"
                              class="form-control form-control-lg rounded-pill"
                              placeholder="example@gmail.com"
                           />
                        </div>
                     </form>
                  </div>

                  <!-- Cột phải: Chi tiết thanh toán -->
                  <div class="col-lg-6">
                     <h4 class="fw-bold text-success mb-4">
                        <i class="bi bi-receipt"></i> Chi tiết thanh toán
                     </h4>

                     <!-- Vé xem phim -->
                     <div class="bg-light rounded-3 p-3 mb-4">
                        <h6 class="fw-bold text-dark mb-3">
                           Vé xem phim ({{ bookingStore.seatCount }} ghế)
                        </h6>
                        <div
                           v-for="seat in bookingStore.bookingInfo.selectedSeats"
                           :key="seat.seatId"
                           class="d-flex justify-content-between py-2"
                        >
                           <span
                              >{{ seat.position }}
                              <small class="text-muted"
                                 >({{ seat.seatType || 'Thường' }})
                              </small></span
                           >
                           <strong style="padding-left: 5px"
                              >{{ formatPrice(seat.ticketPrice || seat.price) }}đ</strong
                           >
                        </div>
                     </div>

                     <!-- Combo bắp nước -->
                     <div
                        v-if="bookingStore.productsInCart.length > 0"
                        class="bg-light rounded-3 p-3 mb-4"
                     >
                        <h6 class="fw-bold text-dark mb-3">Combo bắp nước</h6>
                        <div
                           v-for="item in bookingStore.productsInCart"
                           :key="item.id"
                           class="d-flex justify-content-between py-2"
                        >
                           <span>{{ item.name }} × {{ item.quantity }}</span>
                           <strong>{{ formatPrice(item.price * item.quantity) }}đ</strong>
                        </div>
                     </div>

                     <!-- Tổng tiền -->
                     <div class="bg-success text-white rounded-4 p-4 text-center">
                        <p class="mb-2 fs-5">TỔNG CỘNG</p>
                        <h2 class="fw-bold mb-0">{{ formatPrice(bookingStore.totalAmount) }}đ</h2>
                     </div>
                  </div>
               </div>
            </div>

            <!-- Nút thanh toán -->
            <div class="text-center mt-5">
               <button
                  @click="confirmPayment"
                  class="btn btn-success btn-lg px-5 py-4 rounded-pill fw-bold shadow-lg"
                  style="font-size: 1.5rem"
               >
                  <i class="bi bi-credit-card"></i>
                  THANH TOÁN NGAY
               </button>
               <p class="text-muted small mt-3">
                  Vé sẽ được gửi qua email/SMS sau khi thanh toán thành công
               </p>
            </div>
         </div>

         <!-- Modal thành công -->
         <div
            v-if="showSuccess"
            class="position-fixed top-50 start-50 translate-middle text-center bg-white rounded-4 shadow-lg p-5"
            style="z-index: 9999; min-width: 400px"
         >
            <i class="bi bi-check-circle-fill text-success" style="font-size: 6rem"></i>
            <h2 class="mt-4 fw-bold text-success">Thanh toán thành công!</h2>
            <p class="fs-5">Mã vé của bạn:</p>
            <h3 class="text-primary fw-bold">#{{ bookingCode }}</h3>
            <button @click="goHome" class="btn btn-success rounded-pill px-5 mt-3">
               Về trang chủ
            </button>
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
   import { ref, computed, onMounted } from 'vue';
   import { useRouter } from 'vue-router';
   import { useBookingStore } from '../stores/BookingStore';
   import Header from '../header/Header.vue';
   import { inject } from 'vue';
   import { jwtDecode } from 'jwt-decode';
   import axios from 'axios';

   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
   const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

   const bookingStore = useBookingStore();
   const router = useRouter();

   // Dữ liệu từ API
   const film = ref({});
   const schedule = ref({});
   const discountAmount = ref(0);
   const invoiceForm = ref({
      invoice: null,
      products: [],
      tickets: [],
   });

   // Form khách hàng
   const form = ref({
      username: '',
      name: '',
      email: '',
      phone: '',
   });

   const token = localStorage.getItem('token');
   const userInfo = jwtDecode(token);

   // Xử lý hiện thị thông báo (Toast)
   const toast = ref({ message: '', type: '' });
   const $swal = inject('$swal');

   function showToast(msg, type = 'success') {
      toast.value = { message: msg, type };
      setTimeout(() => (toast.value.message = ''), 3000);
   }

   function showSuccessToast() {
      const toastConfig = $swal.mixin({
         toast: true,
         position: 'top-end',
         showConfirmButton: false,
         timerProgressBar: true,
         timer: 1500,
      });

      toastConfig.fire({
         icon: 'success',
         title: 'Đặt vé thành công',
      });
   }

   /* ================= API ================= */

   async function getFilm() {
      try {
         const filmId = bookingStore.bookingInfo.film;
         if (!filmId) return;
         const res = await axios.get(`${API_BASE_URL}/films/${filmId}`);
         film.value = res.data;
      } catch (err) {
         console.error('Lỗi lấy phim:', err);
      }
   }

   async function getSchedule() {
      try {
         const scheduleId = bookingStore.bookingInfo.schedule;
         if (!scheduleId) return;
         const res = await axios.get(`${API_BASE_URL}/schedules/${scheduleId}`);
         schedule.value = res.data;
      } catch (err) {
         console.error('Lỗi lấy suất chiếu:', err);
      }
   }

   async function getProfile() {
      if (!token) return;
      try {
         const res = await axios.get(`${API_BASE_URL}/auth/${userInfo.subject}`);
         form.value = { ...form.value, ...res.data };
         console.log('Profile user:', form.value);
      } catch (err) {
         console.error('Lỗi lấy profile:', err);
      }
   }

   /* ================= COMPUTED ================= */

   const isFormValid = computed(() => {
      return (
         form.value.name.trim() !== '' &&
         form.value.phone.trim() !== '' &&
         /^\d{10,11}$/.test(form.value.phone.replace(/\D/g, ''))
      );
   });

   const filmPoster = computed(() => {
      const poster = film.value.poster || bookingStore.bookingInfo.film?.poster;
      return poster ? `${IMAGE_URL}${poster}` : '';
   });

   const selectedSeatsText = computed(() => {
      return bookingStore.bookingInfo.selectedSeats
         .map((s) => s.position)
         .sort()
         .join(', ');
   });

   /* ================= FORMAT ================= */

   function formatDate(date) {
      if (!date) return 'Chưa chọn';
      return new Date(date).toLocaleDateString('vi-VN', {
         weekday: 'long',
         year: 'numeric',
         month: 'long',
         day: 'numeric',
      });
   }

   function formatPrice(price) {
      return new Intl.NumberFormat('vi-VN').format(price || 0);
   }

   /* ================= PAYMENT ================= */

   const showSuccess = ref(false);
   const bookingCode = ref('');

   async function confirmPayment() {
      try {
         bookingStore.bookingInfo.customerInfo = { ...form.value };

         invoiceForm.value.invoice = {
            userName: userInfo.subject.trim(),
            phone: form.value.phone.trim(),
            email: form.value.email?.trim() || null,
            totalAmount: bookingStore.totalAmount,
            discountAmount: discountAmount.value,
            finalAmount: bookingStore.totalAmount - discountAmount.value,
         };

         invoiceForm.value.tickets = bookingStore.bookingInfo.selectedSeats.map(function (seat) {
            return {
               scheduleId: bookingStore.bookingInfo.schedule,
               seatId: seat.seatId,
               ticketPriceId: seat.ticketPriceId,
               price: seat.price,
               promotionId: null,
            };
         });

         invoiceForm.value.products = bookingStore.productsInCart.map(function (product) {
            return {
               productId: product.id,
               quantity: product.quantity,
               price: product.price,
               promotionId: null,
            };
         });

         console.log('Payload gửi đi:', invoiceForm.value);

         const response = await axios.post(`${API_BASE_URL}/invoices`, invoiceForm.value, {
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${token}`,
            },
         });

         bookingCode.value = response.data.code || 'TIX' + Date.now().toString().slice(-8);

         showSuccess.value = true;

         showSuccessToast();

         setTimeout(function () {
            bookingStore.clearBooking();
            goHome();
         }, 1500);
      } catch (err) {
         console.error('Lỗi khi tạo hóa đơn:', err.response?.data || err.message);
         alert(err.response?.data?.message || 'Thanh toán thất bại, vui lòng thử lại!');
         return;
      }
   }

   function goHome() {
      router.push('/');
   }

   /* ================= LIFECYCLE ================= */

   onMounted(function () {
      getFilm();
      getSchedule();
      getProfile();

      if (bookingStore.seatCount === 0) {
         alert('Vui lòng chọn ghế trước!');
         router.push('/bookticket');
      }
   });
</script>

<style scoped>
   .bg-gradient {
      background: linear-gradient(135deg, #28a745, #20c997) !important;
   }

   .btn-success {
      background: linear-gradient(135deg, #28a745, #20c997);
      border: none;
      transition: all 0.3s;
   }

   .btn-success:hover:not(:disabled) {
      transform: translateY(-4px);
      box-shadow: 0 15px 30px rgba(40, 167, 69, 0.4);
   }

   .form-control-lg.rounded-pill {
      padding-left: 1.8rem;
      padding-right: 1.8rem;
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
