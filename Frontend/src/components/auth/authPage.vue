<template>
  <div class="auth-container container py-5">
    <div class="row justify-content-center">
      <!-- Đăng nhập -->
      <div class="col-lg-5 col-md-6 col-12 mb-4 mb-lg-0">
        <Login />
      </div>

      <!-- Đăng ký -->
      <div class="col-lg-7 col-md-6 col-12">
        <Register />
      </div>
    </div>
  </div>
</template>

<script setup>
import Login from "./LoginForm.vue";
import Register from "./RegisteForm.vue";
</script>

<style scoped>
.auth-container {
  margin-top: 30px;
}

/* Responsive nhỏ hơn */
@media (max-width: 768px) {
  .auth-container .row {
    flex-direction: column;
  }
}
</style>
