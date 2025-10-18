<template>
  <div class="container py-5">
    <div class="card shadow-sm border-0 mx-auto" style="max-width: 700px;">
      <div class="card-body p-4">
        <h4 class="fw-bold mb-4 text-center">Đăng ký tài khoản</h4>

        <form @submit.prevent="submitForm">
          <!-- Họ Tên -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Họ *</label>
              <input v-model="form.ho" type="text" class="form-control" placeholder="Nhập họ" required />
            </div>
            <div class="col-md-6">
              <label class="form-label">Tên đệm và tên *</label>
              <input v-model="form.ten" type="text" class="form-control" placeholder="Nhập tên đệm và tên" required />
            </div>
          </div>

          <!-- Giới tính + Email -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Giới tính *</label>
              <div>
                <div class="form-check form-check-inline" v-for="g in ['Nam', 'Nữ', 'Khác']" :key="g">
                  <input v-model="form.gioitinh" class="form-check-input" type="radio" :value="g" :id="g" />
                  <label class="form-check-label" :for="g">{{ g }}</label>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <label class="form-label">Địa chỉ email *</label>
              <input v-model="form.email" type="email" class="form-control" placeholder="example@gmail.com" required />
            </div>
          </div>

          <!-- Mật khẩu -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Mật khẩu *</label>
              <input v-model="form.password" type="password" class="form-control" placeholder="Nhập mật khẩu" required />
            </div>
            <div class="col-md-6">
              <label class="form-label">Nhập lại mật khẩu *</label>
              <input v-model="form.repassword" type="password" class="form-control" placeholder="Xác nhận mật khẩu" required />
            </div>
          </div>

          <!-- Số điện thoại -->
          <div class="mb-3">
            <label class="form-label">Số điện thoại *</label>
            <input v-model="form.phone" type="text" class="form-control" placeholder="Nhập số điện thoại" required />
          </div>

          <!-- Ngày sinh -->
          <div class="mb-3">
            <label class="form-label">Ngày sinh *</label>
            <div class="d-flex gap-2">
              <select v-model="form.ngay" class="form-select flex-fill" required>
                <option value="">Chọn ngày</option>
                <option v-for="n in 31" :key="n">{{ n }}</option>
              </select>
              <select v-model="form.thang" class="form-select flex-fill" required>
                <option value="">Chọn tháng</option>
                <option v-for="n in 12" :key="n">{{ n }}</option>
              </select>
              <select v-model="form.nam" class="form-select flex-fill" required>
                <option value="">Chọn năm</option>
                <option v-for="n in years" :key="n">{{ n }}</option>
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
            </select>
          </div>

          <!-- Điều khoản -->
          <div class="form-check mb-2">
            <input v-model="form.agree" class="form-check-input" type="checkbox" id="agree" required />
            <label class="form-check-label" for="agree">
              Tôi đã đọc, hiểu và đồng ý với các
              <a href="#" class="text-success text-decoration-none">điều khoản</a>
            </label>
          </div>
          <div class="form-check mb-4">
            <input v-model="form.promo" class="form-check-input" type="checkbox" id="promo" />
            <label class="form-check-label" for="promo">
              Nhận thông tin từ các chương trình khuyến mãi
            </label>
          </div>

          <!-- Nút submit -->
          <button type="submit" class="btn btn-success w-100 fw-bold py-2">
            ĐĂNG KÝ
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRegister } from "../../scripts/auth/useRegister";
const { form, years, submitForm } = useRegister();
</script>

<style src="../../assets/style/register.css"></style>
