<template>
  <div class="container py-5">
    <div class="card shadow-sm border-0 mx-auto" style="max-width: 400px;">
      <div class="card-body p-4">
        <h4 class="fw-bold mb-4 text-center">Đăng nhập tài khoản</h4>

        <form @submit.prevent="login">
          <!-- Email -->
          <div class="mb-3">
            <label class="form-label">Email *</label>
            <input
              v-model="form.email"
              type="email"
              class="form-control"
              placeholder="Tài khoản hoặc địa chỉ email"
              required
            />
          </div>

          <!-- Password -->
          <div class="mb-2">
            <label class="form-label">Mật khẩu *</label>
            <input
              v-model="form.password"
              type="password"
              class="form-control"
              placeholder="Mật khẩu"
              required
            />
          </div>

          <!-- Forgot password -->
          <div class="text-end mb-4">
            <router-link
              to="/quen-mat-khau"
              class="text-success small text-decoration-none"
            >
              Quên mật khẩu?
            </router-link>
          </div>

          <!-- Submit -->
          <button type="submit" class="btn btn-success w-100 fw-bold py-2">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const form = reactive({
  email: "",
  password: "",
});

const login = () => {
  if (!form.email || !form.password) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  console.log("Thông tin đăng nhập:", form);

  // Giả lập xử lý đăng nhập thành công
  router.push("/home");
};
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

.form-control {
  border-radius: 8px;
  border: 1px solid #ccc;
}
</style>
