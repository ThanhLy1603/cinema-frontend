<template>
   <div class="forgot-container">
      <div class="card shadow-lg border-0 p-4 mx-auto animate__animated animate__fadeIn">
         <!-- Logo -->
         <div class="text-center mb-3">
            <img src="/src/assets/header/Logo.png" alt="Logo" class="logo" />
         </div>

         <!-- Tiêu đề -->
         <h4 class="text-center fw-bold mb-4 text-green">QUÊN MẬT KHẨU</h4>

         <!-- BƯỚC 1: GỬI OTP -->
         <div v-if="step === 1" class="step-content">
            <p class="text-center text-muted mb-4">
               Nhập địa chỉ email của bạn để nhận mã OTP xác thực.
            </p>
            <div class="mb-3">
               <label class="form-label fw-semibold">Địa chỉ email *</label>
               <input v-model="email" type="email" class="form-control" placeholder="example@gmail.com" />
            </div>
            <button class="btn btn-green w-100" :disabled="isLoading" @click="sendOtp">
               <span v-if="isLoading">Đang gửi...</span>
               <span v-else>GỬI MÃ OTP</span>
            </button>
         </div>

         <!-- BƯỚC 2: XÁC THỰC OTP -->
         <div v-else-if="step === 2" class="step-content">
            <p class="text-center text-muted mb-4">
               Mã OTP đã được gửi đến <b>{{ email }}</b>.<br />
               Vui lòng nhập mã OTP để tiếp tục.
            </p>
            <div class="mb-3">
               <label class="form-label fw-semibold">Mã OTP *</label>
               <input v-model="otp" type="text" maxlength="6" class="form-control text-center"
                  placeholder="Nhập mã OTP gồm 6 số" />
            </div>
            <button class="btn btn-green w-100" @click="verifyOtp">
               XÁC NHẬN OTP
            </button>
            <button class="btn btn-link w-100 mt-2" @click="backToEmail">
               ← Quay lại nhập email
            </button>
         </div>

         <!-- BƯỚC 3: ĐẶT LẠI MẬT KHẨU -->
         <div v-else-if="step === 3" class="step-content">
            <p class="text-center text-muted mb-4">
               Nhập mật khẩu mới cho tài khoản của bạn.
            </p>
            <div class="mb-3">
               <label class="form-label fw-semibold">Mật khẩu mới *</label>
               <input v-model="newPassword" type="password" class="form-control" placeholder="Nhập mật khẩu mới" />
            </div>
            <div class="mb-3">
               <label class="form-label fw-semibold">Xác nhận mật khẩu *</label>
               <input v-model="confirmPassword" type="password" class="form-control"
                  placeholder="Nhập lại mật khẩu mới" />
            </div>
            <button class="btn btn-green w-100" @click="resetPassword">
               ĐẶT LẠI MẬT KHẨU
            </button>
         </div>

         <!-- BƯỚC 4: HOÀN TẤT -->
         <div v-else-if="step === 4" class="step-content text-center">
            <h5 class="text-green fw-bold mb-3">✅ Thành công!</h5>
            <p class="text-muted mb-4">Bạn đã đặt lại mật khẩu thành công.</p>
            <button class="btn btn-green w-100" @click="backToLogin">
               Quay lại đăng nhập
            </button>
         </div>
      </div>
   </div>
</template>

<script setup>
   import { ref } from "vue";
   import axios from "axios";
   import Swal from "sweetalert2";

   const step = ref(1);
   const email = ref("");
   const otp = ref("");
   const newPassword = ref("");
   const confirmPassword = ref("");
   const isLoading = ref(false);

   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

   // ===== GỬI OTP =====
   async function sendOtp() {
      if (!email.value.trim()) {
         Swal.fire("Lỗi", "Vui lòng nhập email!", "warning");
         return;
      }
      isLoading.value = true;
      try {
         const res = await axios.post(
            `${API_BASE_URL}/auth/send-otp-forgot`,
            { email: email.value },
            { headers: { "Content-Type": "application/json" } }
         );
         Swal.fire(
            "Thành công",
            res.data.message || "Đã gửi OTP đến email!",
            "success"
         );
         step.value = 2;
      } catch (error) {
         Swal.fire(
            "Lỗi",
            error.response?.data?.message || "Không thể gửi OTP. Vui lòng thử lại!",
            "error"
         );
      } finally {
         isLoading.value = false;
      }
   }

   // ===== XÁC NHẬN OTP =====
   async function verifyOtp() {
      if (!otp.value.trim()) {
         Swal.fire("Lỗi", "Vui lòng nhập mã OTP!", "warning");
         return;
      }
      try {
         const res = await axios.post(
            `${API_BASE_URL}/auth/verify-otp-forgot`,
            { email: email.value, otp: otp.value },
            { headers: { "Content-Type": "application/json" } }
         );
         Swal.fire("Thành công", res.data.message || "OTP hợp lệ!", "success");
         step.value = 3;
      } catch (error) {
         Swal.fire(
            "Lỗi",
            error.response?.data?.message || "OTP không hợp lệ hoặc đã hết hạn!",
            "error"
         );
      }
   }

   // ===== ĐẶT LẠI MẬT KHẨU =====
   async function resetPassword() {
      if (!newPassword.value || !confirmPassword.value) {
         Swal.fire("Lỗi", "Vui lòng nhập đầy đủ mật khẩu!", "warning");
         return;
      }
      if (newPassword.value !== confirmPassword.value) {
         Swal.fire("Lỗi", "Mật khẩu xác nhận không khớp!", "error");
         return;
      }
      try {
         const res = await axios.post(
            `${API_BASE_URL}/auth/reset-password`,
            { email: email.value, newPassword: newPassword.value },
            { headers: { "Content-Type": "application/json" } }
         );
         Swal.fire(
            "Thành công",
            res.data.message || "Đặt lại mật khẩu thành công!",
            "success"
         );
         step.value = 4;
      } catch (error) {
         Swal.fire(
            "Lỗi",
            error.response?.data?.message || "Không thể đặt lại mật khẩu!",
            "error"
         );
      }
   }

   // ===== CHUYỂN BƯỚC =====
   function backToEmail() {
      step.value = 1;
   }

   function backToLogin() {
      window.location.href = "/login";
   }
</script>

<style scoped>
   .forgot-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(145deg, #f8fff1, #e8f8d4);
   }

   .card {
      width: 100%;
      max-width: 420px;
      border-radius: 16px;
      background-color: #fff;
      transition: all 0.3s ease;
   }

   .card:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
   }

   .logo {
      height: 85px;
      width: auto;
   }

   .text-green {
      color: #7ad000;
   }

   .btn-green {
      background-color: #94e900;
      color: #fff;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      padding: 10px;
      font-size: 15px;
      transition: all 0.25s ease;
   }

   .btn-green:hover {
      background-color: #7ad000;
   }

   .form-control {
      height: 44px;
      border-radius: 8px;
      border: 1px solid #ccc;
      font-size: 15px;
   }

   .form-label {
      font-weight: 600;
      font-size: 14px;
   }

   /* Responsive */
   @media (max-width: 576px) {
      .card {
         padding: 1.5rem !important;
         max-width: 90%;
      }

      h4 {
         font-size: 1.2rem;
      }
   }
</style>
