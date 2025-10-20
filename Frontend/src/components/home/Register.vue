<template>
  <div class="auth-container">
    <div class="auth-wrapper">
      <div class="auth-card">
        <div class="auth-logo text-center" @click="goHome">
          <img src="/src/assets/header/Logo.png" alt="Logo" />
        </div>
        <RegisterForm />
      </div>
    </div>
  </div>
</template>

<script setup>

import RegisterForm from "../auth/Register.vue";
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<style scoped>
/* 🌈 Nền toàn màn hình */
.auth-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(120deg, #a8edea, #fed6e3);
  font-family: "Poppins", sans-serif;
  padding: 30px 0;
  overflow-y: auto;
}

/* 🌿 Card chính */
.auth-wrapper {
  width: 95%;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.97);
  border-radius: 20px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
  padding: 30px 40px 40px 40px;
  animation: fadeInUp 0.5s ease;
  margin: auto;
}

.auth-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

/* 🖼 Logo */
.auth-logo {
  text-align: center;
  margin-bottom: -25px;
  margin-top: -5px;
}

.auth-logo img {
  height: 85px;
  width: auto;
}

.welcome-text {
  font-size: 14px;
  color: #388e3c;
  font-weight: 500;
  margin-top: 3px;
}

.form-control {
  border-radius: 8px;
  border: 1px solid #ccc;
  padding: 8px 10px;
}

.btn-success {
  background-color: #94e900;
  border: none;
  transition: background 0.3s;
}

.btn-success:hover {
  background-color: #7ad000;
}

.text-success:hover {
  text-decoration: underline;
}

/* 💫 Animation */
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

/* 📱 Responsive */
@media (max-width: 480px) {
  .auth-wrapper {
    padding: 25px;
  }

  .auth-logo img {
    height: 50px;
  }

  .welcome-text {
    font-size: 13px;
  }
}
</style>
