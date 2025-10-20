<template>
  <div class="auth-container">
    <div class="auth-wrapper">
      <div class="auth-card">
        <div class="auth-logo text-center mb-3" @click="goHome">
          <img src="/src/assets/header/Logo.png" alt="Logo" />
        </div>
        <h4 class="fw-bold mb-4 text-center">Đăng nhập tài khoản</h4>
        <form @submit.prevent="login">
          <!-- Email -->
          <div class="mb-3">
            <label class="form-label">Email *</label>
            <input v-model="form.email" type="email" class="form-control" placeholder="Nhập email" required />
          </div>

          <!-- Password -->
          <div class="mb-3">
            <label class="form-label">Mật khẩu *</label>
            <input v-model="form.password" type="password" class="form-control" placeholder="Nhập mật khẩu" required />
          </div>

          <!-- Quên mật khẩu -->
          <div class="text-end mb-4">
            <a href="#" class="text-success small text-decoration-none">Quên mật khẩu?</a>
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
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

function goHome() {
  router.push('/')
}
const form = reactive({
  email: "demo@vietcine.vn",
  password: "123456",
});

const login = () => {
  console.log("Thông tin đăng nhập:", form);

  // 🧩 Giả lập đăng nhập thành công
  if (form.email === "demo@vietcine.vn" && form.password === "123456") {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", form.email);

    // 👉 Chuyển về trang chủ
    router.push("/");
  } else {
    alert("Sai thông tin đăng nhập!");
  }
};
onMounted(() => {
  console.log("Form demo:", form);
});
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
