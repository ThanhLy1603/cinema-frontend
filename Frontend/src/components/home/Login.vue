<template>
   <div class="auth-container">
      <div class="auth-wrapper">
         <div class="auth-card">
            <div class="auth-logo text-center mb-3" @click="goHome" >
               <img src="/src/assets/header/Logo.png" alt="Logo" />
            </div>
            <h4 class="fw-bold mb-4 text-center">Đăng nhập tài khoản</h4>
            <form @submit.prevent="handleLogin()">
               <!-- Email -->
               <div class="mb-3">
                  <label class="form-label">Email *</label>
                  <input
                     v-model="form.username"
                     type="text"
                     class="form-control"
                     placeholder="Nhập tài khoản"
                     @input="removeSpaces('username')"
                     @keydown.space.prevent
                     required
                  />
               </div>

               <!-- Password -->
               <div class="mb-3">
                  <label class="form-label">Mật khẩu *</label>
                  <input
                     v-model="form.password"
                     type="password"
                     class="form-control"
                     placeholder="Nhập mật khẩu"
                     @input="removeSpaces('password')"
                     @keydown.space.prevent
                     required
                  />
               </div>

               <!-- Quên mật khẩu -->
               <div class="text-end mb-4">
                  <router-link to="/forgot-password" class="text-success small text-decoration-none">Quên mật khẩu?</router-link>
               </div>

               <!-- Submit -->
               <button type="submit" class="btn btn-success w-100 fw-bold py-2">
                  ĐĂNG NHẬP
               </button>

               <!-- Link tới Đăng ký -->
               <div class="text-center mt-4">
                  <span>Bạn chưa có tài khoản?</span>
                  <router-link to="/register" class="text-success fw-semibold text-decoration-none">
                     Đăng ký ngay
                  </router-link>
               </div>
            </form>
         </div>
      </div>
   </div>
</template>

<script setup>
   import { onMounted, ref } from "vue";
   import { useRouter } from "vue-router";
   import { inject } from "vue";
   import axios from "axios";

   const $swal = inject('$swal');
   const router = useRouter();

   const form = ref({
      username: "",
      password: ""
   });

   function showSuccessToast() {
      const toastConfig = $swal.mixin({
         toast: true,
         position: 'top-end',
         showConfirmButton: false,
         timerProgressBar: true,
         timer: 1500
      });

      toastConfig.fire({
         icon: 'success',
         title: "Đăng nhập thành công"
      });
   }

   function showErrorAlert(message) {
      $swal.fire({
         icon: 'error',
         title: "Đăng nhập thất bại",
         text: message || "Sai tên đăng nhập hoặc mật khẩu",
         confirmButtonText: 'OK',
         customeClass: {
         popup: 'text-alert'
         }
      });
   }
   function removeSpaces(field) {
      form.value[field] = form.value[field].replace(/\s+/g, "");
   }

   function goHome() {
      router.push('/')
   }

   function isCheckValation() {
         return true;
   }

   async function handleLogin() {
      if (isCheckValation()){
         try {
            const url = "http://localhost:8080/api/auth/login";
            const payload = {
               username: form.value.username,
               password: form.value.password
            }
            
            const response = await axios.post(url, payload);

            if(response.data.token) {
               const token = response.data.token;
               showSuccessToast();
               localStorage.setItem('token', JSON.stringify(token));
               router.push('/');
            } else {
               showErrorAlert("Vui lòng kiểm tra lại tên đăng nhập và mật khẩu");
            }

            console.log("data: ", form.value);
            console.log("repsonse: ", response.data.token || response.data.error);
         } catch (error) {
            console.error("Lỗi khi xử lý đăng nhập: ", error.message);
            showErrorAlert("Lỗi khi kết nối đến server");
         }
      }
   }
</script>

<style scoped>
   /* 🌈 Nền tổng thể */
   .auth-container {
         height: 100vh;
         display: flex;
         justify-content: center;
         align-items: center;
         background: linear-gradient(120deg, #a8edea, #fed6e3);
         font-family: "Poppins", sans-serif;
   }

   /* 🌿 Card chính */
   .auth-wrapper {
      width: 95%;
      max-width: 500px;
      background: rgba(255, 255, 255, 0.97);
      border-radius: 20px;
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
      padding: 35px 40px;
      animation: fadeInUp 0.5s ease;
   }

   .form-label {
      font-weight: 600;
      font-size: 14px;
   }

   .form-control {
      border-radius: 8px;
      border: 1px solid #ccc;
      padding: 8px 10px;
   }

   .btn-success {
      background-color: #94e900;
      border: none;
   }
   .btn-success:hover {
      background-color: #7ad000;
   }

   .text-success:hover {
      text-decoration: underline;
   }
   .auth-logo img {
      height: 75px;
      width: auto;
   }

   /* 💫 Animation mượt */
   @keyframes fadeInUp {
      from {
         opacity: 0;
         transform: translateY(30px);
      }
      to {
         opacity: 1;
         transform: translateY(0);
      }
   }

   @media (max-width: 480px) {
      .auth-wrapper {
         padding: 25px;
      }
   }
</style>
