<template>
   <div class="container py-5">
      <div class="card shadow-sm border-0 mx-auto" style="max-width: 700px">
         <div class="card-body p-4">
            <h4 class="fw-bold mb-4 text-center">Đăng ký tài khoản</h4>

            <form @submit.prevent="submitForm">
               <!-- Tên đăng nhập -->
               <div class="mb-3">
                  <label class="form-label">Tên đăng nhập *</label>
                  <input v-model="form.username" type="text" class="form-control" placeholder="Nhập tên đăng nhập"
                     @blur="checkUsername" required />
                  <small 
                     v-if="usernameStatus" 
                     :class="usernameStatus.includes('tồn tại')
                           ? 'text-danger'
                           : 'text-success'
                        "
                  >
                     {{ usernameStatus }}
                  </small>
               </div>

               <!-- Họ và tên -->
               <div class="mb-3">
                  <label class="form-label">Họ và tên *</label>
                  <input v-model="form.fullName" type="text" class="form-control" placeholder="Nhập họ và tên đầy đủ"
                     required />
               </div>

               <!-- Giới tính + Email -->
               <div class="row mb-3">
                  <div class="col-md-6">
                     <label class="form-label">Giới tính *</label>
                     <div>
                        <div class="form-check form-check-inline" v-for="gender in ['Nam', 'Nữ']" :key="gender">
                           <input v-model="form.gender" class="form-check-input" type="radio" :value="gender" :id="gender" />
                           <label class="form-check-label" :for="gender">{{ gender }}</label>
                        </div>
                     </div>
                  </div>

                  <div class="col-md-6">
                     <label class="form-label">Địa chỉ email *</label>
                     <div class="email-otp-group">
                        <input v-model="form.email" type="email" class="form-control" placeholder="example@gmail.com"
                           required :readonly="otpStep !== 0" @blur="checkEmail" />
                        <button type="button" class="btn btn-otp" @click="sendOtp"
                           :disabled="otpSending || otpStep > 0">
                           {{ otpSending ? "Đang gửi..." : "Gửi OTP" }}
                        </button>
                     </div>
                     <small 
                     v-if="emailStatus" 
                        :class="emailStatus.includes('đã được sử dụng') || emailStatus.includes('không hợp lệ')
                              ? 'text-danger'
                              : 'text-success'
                           "
                     >
                        {{ emailStatus }}
                     </small>
                  </div>
               </div>
               <!-- Ô nhập mã OTP -->
               <div v-if="otpStep >= 1" class="mb-3">
                  <label class="form-label">Nhập mã OTP *</label>
                  <div class="email-otp-group">
                     <input v-model="form.otp" type="text" class="form-control" placeholder="Nhập mã OTP 6 số" />
                     <button type="button" class="btn btn-verify" @click="verifyOtp"
                        :disabled="otpVerifying || otpValid">
                        {{
                           otpValid
                              ? "✅ Đã xác minh"
                              : otpVerifying
                                 ? "Đang kiểm tra..."
                                 : "Xác minh OTP"
                        }}
                     </button>
                  </div>
                  <small v-if="otpStatus" :class="otpValid ? 'text-success' : 'text-danger'">
                     {{ otpStatus }}
                  </small>
               </div>

               <!-- Mật khẩu -->
               <div class="row mb-3">
                  <div class="col-md-6">
                     <label class="form-label">Mật khẩu *</label>
                     <input v-model="form.password" type="password" class="form-control" placeholder="Nhập mật khẩu"
                        required />
                  </div>
                  <div class="col-md-6">
                     <label class="form-label">Nhập lại mật khẩu *</label>
                     <input v-model="form.repassword" type="password" class="form-control"
                        placeholder="Xác nhận mật khẩu" required />
                  </div>
               </div>

               <!-- Số điện thoại -->
               <div class="mb-3">
                  <label class="form-label">Số điện thoại *</label>
                  <input 
                     v-model="form.phone" 
                     type="tel" 
                     class="form-control" 
                     placeholder="Nhập số điện thoại"
                     pattern="[0-9]{10}"
                     title="Vui lòng nhập đúng 10 chữ số."
                     required 
                  />
               </div>

               <!-- Ngày sinh -->
               <div class="mb-3">
                  <label class="form-label">Ngày sinh *</label>
                  <div class="d-flex gap-2">
                     <select v-model="form.day" class="form-select flex-fill" required>
                        <option value="">Ngày</option>
                        <option v-for="day in 31" :key="day">{{ day }}</option>
                     </select>
                     <select v-model="form.month" class="form-select flex-fill" required>
                        <option value="">Tháng</option>
                        <option v-for="month in 12" :key="month">{{ month }}</option>
                     </select>
                     <select v-model="form.year" class="form-select flex-fill" required>
                        <option value="">Năm</option>
                        <option v-for="year in years" :key="year">{{ year }}</option>
                     </select>
                  </div>
               </div>

               <!-- Thành phố -->
               <div class="mb-3">
                  <label class="form-label">Tỉnh/Thành phố *</label>
                  <select v-model="form.city" class="form-select" required>
                     <option value="">Chọn Tỉnh/Thành phố</option>
                     <option>Hà Nội</option>
                     <option>TP. Hồ Chí Minh</option>
                     <option>Đà Nẵng</option>
                     <option>Cần Thơ</option>
                  </select>
               </div>

               <!-- Điều khoản -->
               <div class="form-check mb-2">
                  <input v-model="form.agree" class="form-check-input" type="checkbox" id="agree" required />
                  <label class="form-check-label" for="agree">
                     Tôi đã đọc và đồng ý với
                     <a href="#" class="text-success text-decoration-none">điều khoản</a>.
                  </label>
               </div>

               <!-- Submit -->
               <button type="submit" class="btn btn-success w-100 fw-bold py-2" :disabled="!otpValid">
                  ĐĂNG KÝ
               </button>

               <div class="text-center mt-3">
                  <button type="button" class="btn-back" @click="goBack">
                     ← Quay lại đăng nhập
                  </button>
               </div>
            </form>
         </div>
      </div>
   </div>
</template>

<script setup>
   import { reactive, computed, ref } from "vue";
   import { useRouter } from "vue-router";
   import axios from "axios";
   import { inject } from "vue";

   const $swal = inject('$swal');

   const router = useRouter();

   // ===== FORM CHÍNH =====
   const form = reactive({
      username: "",
      fullName: "",
      gender: "",
      email: "",
      otp: "",
      password: "",
      repassword: "",
      phone: "",
      day: "",
      month: "",
      year: "",
      city: "",
      agree: false,
   });

   // ===== TRẠNG THÁI OTP =====
   const otpStep = ref(0); // 0: chưa gửi, 1: đã gửi, 2: đã xác minh
   const otpSending = ref(false);
   const otpVerifying = ref(false);
   const otpValid = ref(false);
   const otpStatus = ref("");
   const usernameStatus = ref("");
   const emailStatus = ref("");

   // ===== NĂM SINH =====
   const years = computed(function () {
      const current = new Date().getFullYear();
      return Array.from({ length: 100 }, function (_, i) {
         return current - i;
      });
   });

   function showSuccessToast(message) {
      const toastConfig = $swal.mixin({
         toast: true,
         position: 'top-end',
         showConfirmButton: false,
         timerProgressBar: true,
         timer: 1500
      });

      toastConfig.fire({
         icon: 'success',
         title: message || "Đăng ký thành công"
      });
   }

   function showAlertToast(messsage) {
      $swal.fire({
         text: messsage || "Mật khẩu và xác nhận mật khẩu không khớp. Vui lòng kiểm tra lại.",
         icon: "error",
         confirmButtonText: "Đồng ý",
         allowOutsideClick: true,
         allowEscapeKey: false
      });
   }

   // ===== QUAY LẠI ĐĂNG NHẬP =====
   function goBack() {
      router.push("/login");
   }

   // ===== GỬI OTP =====
   async function sendOtp() {
      if (!form.email) {
         showAlertToast("⚠️ Vui lòng nhập email trước khi gửi OTP!");
         return;
      }

      if (emailStatus.value && (emailStatus.value.includes('đã được sử dụng')) || emailStatus.value.includes('không hợp lệ')) {
         showAlertToast("⚠️ " + emailStatus.value + ". Vui lòng nhập email khác.");
         return; 
      }

      otpSending.value = true;
      otpStatus.value = "";
      try {
         const res = await axios.post("http://localhost:8080/api/auth/send-otp", {
            email: form.email,
         });
         otpStep.value = 1;
         otpStatus.value = res.data.message || "✅ Đã gửi OTP đến email!";
      } catch (err) {
         console.error(err);
         otpStatus.value =
            "❌ Lỗi khi gửi OTP: " +
            (err.response?.data?.message || "Không xác định");
      } finally {
         otpSending.value = false;
      }
   }

   // ===== XÁC MINH OTP =====
   async function verifyOtp() {
      if (!form.otp) {
         showAlertToast("⚠️ Vui lòng nhập mã OTP!");
         return;
      }

      otpVerifying.value = true;
      otpStatus.value = "";
      try {
         const res = await axios.post("http://localhost:8080/api/auth/verify-otp", {
            email: form.email,
            otp: form.otp,
         });

         otpValid.value = true;
         otpStep.value = 2;
         otpStatus.value = res.data.message || "✅ OTP hợp lệ!";
      } catch (err) {
         otpValid.value = false;
         otpStatus.value = "❌ OTP không hợp lệ hoặc đã hết hạn!";
      } finally {
         otpVerifying.value = false;
      }
   }

   // ===== XỬ LÝ ĐĂNG KÝ =====
   async function submitForm() {
      if (!otpValid.value) {
         showAlertToast("⚠️ Bạn cần xác minh OTP trước khi đăng ký!");
         return;
      }

      if (form.password !== form.repassword) {
         showAlertToast("❌ Mật khẩu nhập lại không khớp!");
         return;
      }

      const payload = {
         username: form.username,
         password: form.password,
         email: form.email,
         fullName: form.fullName,
         gender: form.gender === "Nam",
         phone: form.phone,
         address: form.city,
         day: parseInt(form.day),
         month: parseInt(form.month),
         year: parseInt(form.year),
      };

      try {
         const res = await axios.post(
            "http://localhost:8080/api/auth/register",
            payload
         );
         showSuccessToast(res.data.message || "🎉 Đăng ký thành công!");
         router.push("/login");
      } catch (err) {
         console.error(err);
         showAlertToast(
            "❌ Lỗi khi đăng ký: " +
            (err.response?.data?.message || "Không xác định.")
         );
      }
   }

   async function checkUsername() {
      if (!form.username.trim()) {
         usernameStatus.value = "";
         return;
      }

      try {
         const res = await axios.post(
            "http://localhost:8080/api/auth/check-username",
            { username: form.username }
         );
         usernameStatus.value = res.data.message;
      } catch (err) {
         usernameStatus.value = "⚠️ Lỗi khi kiểm tra username.";
      }
   }

   async function checkEmail() {
      if (!form.email.trim()) {
         emailStatus.value = "";
         return;
      }

      try {
         const res = await axios.post("http://localhost:8080/api/auth/check-email", {
            email: form.email,
         });
         emailStatus.value = res.data.message;
      } catch (err) {
         emailStatus.value = "⚠️ Lỗi khi kiểm tra email.";
      }
   }
</script>

<style scoped>
   .card {
      border-radius: 10px;
   }

   .form-label {
      font-weight: 600;
   }

   .btn-success {
      background-color: #94e900;
      border: none;
   }

   .btn-success:hover {
      background-color: #7ad000;
   }

   a.text-success:hover {
      text-decoration: underline;
   }

   .form-control,
   .form-select {
      border-radius: 8px;
      border: 1px solid #ccc;
   }

   .d-flex.gap-2 select.form-select {
      min-width: 0;
   }

   @media (max-width: 576px) {
      .d-flex.gap-2 {
         flex-direction: column;
      }
   }

   .btn-back {
      position: absolute;
      bottom: 15px;
      left: 17px;
      background: none;
      border: none;
      color: #666;
      font-size: 15px;
      cursor: pointer;
      transition: all 0.25s ease;
      font-weight: 500;
      opacity: 0.8;
   }

   .btn-back:hover {
      color: #000;
      opacity: 1;
      transform: translateX(-2px);
      text-decoration: underline;
   }

   /* Nhóm email + otp button */
   .email-otp-group {
      display: flex;
      gap: 6px;
      align-items: center;
   }

   .email-otp-group input {
      flex: 1;
      height: 42px;
      font-size: 15px;
   }

   .btn-otp,
   .btn-verify {
      white-space: nowrap;
      padding: 0 14px;
      height: 42px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.25s ease;
   }

   .btn-otp {
      background-color: #94e900;
   }

   .btn-otp:hover {
      background-color: #7ad000;
   }

   .btn-verify {
      background-color: #007bff;
      color: white;
   }

   .btn-verify:hover {
      background-color: #006ae0;
   }

   @media (max-width: 576px) {
      .email-otp-group {
         flex-direction: column;
         align-items: stretch;
      }

      .btn-otp,
      .btn-verify {
         width: 100%;
         margin-top: 6px;
      }
   }
</style>
