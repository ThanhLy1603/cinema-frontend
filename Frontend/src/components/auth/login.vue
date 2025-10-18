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
import { useLogin } from "../../scripts/auth/useLogin";
const { form, login } = useLogin();
</script>

<style src="../../assets/style/login.css"></style>
