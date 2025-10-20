<template>
  <div class="container account-page my-5">
    <h4 class="text-center mb-4 fw-bold">Tài khoản</h4>
    <div class="row g-4">
      <!-- LEFT COLUMN -->
      <div class="col-lg-8">
        <div class="card p-4 shadow-sm">
          <div class="d-flex align-items-center mb-3">
            <img
              src="https://via.placeholder.com/100x100.png?text=Avatar"
              alt="Avatar"
              class="rounded-circle me-3 border"
              style="width: 100px; height: 100px; object-fit: cover;"
            />
            <div>
              <h5 class="fw-semibold mb-1" >{{ form.lastName + form.firstName }}</h5>
            </div>
          </div>

          <form @submit.prevent="updateInfo">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Họ *</label>
                <input v-model="form.lastName" type="text" class="form-control" />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Tên đệm và tên *</label>
                <input v-model="form.firstName" type="text" class="form-control" />
              </div>
              <div class="col-12 mb-3">
                <label class="form-label">Email *</label>
                <input v-model="form.email" type="email" class="form-control" />
              </div>

              <div class="col-md-9 mb-3">
                <label class="form-label">Mật khẩu</label>
                <input v-model="form.password" type="password" class="form-control" />
              </div>
              <div class="col-md-3 mb-3 d-flex align-items-end">
                <button type="button" class="btn btn-outline-success w-100">
                  ĐỔI MẬT KHẨU
                </button>
              </div>

              <div class="col-12 mb-3">
                <label class="form-label">Số điện thoại *</label>
                <input v-model="form.phone" type="text" class="form-control" />
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Giới tính *</label>
                <select v-model="form.gender" class="form-select">
                  <option>Nam</option>
                  <option>Nữ</option>
                </select>
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Ngày sinh *</label>
                <div class="d-flex gap-2">
                  <select v-model="form.day" class="form-select">
                    <option v-for="d in 31" :key="d">{{ d.toString().padStart(2, '0') }}</option>
                  </select>
                  <select v-model="form.month" class="form-select">
                    <option v-for="m in 12" :key="m">{{ m.toString().padStart(2, '0') }}</option>
                  </select>
                  <select v-model="form.year" class="form-select">
                    <option v-for="y in years" :key="y">{{ y }}</option>
                  </select>
                </div>
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Tỉnh/Thành phố *</label>
                <select v-model="form.city" class="form-select">
                  <option>Hà Nội</option>
                  <option>Hồ Chí Minh</option>
                  <option>Đà Nẵng</option>
                </select>
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Địa chỉ *</label>
                <input v-model="form.address" type="text" class="form-control" />
              </div>
            </div>

            <div class="text-center mt-3">
              <button type="submit" class="btn btn-success px-4 fw-semibold" onclick=updateInfo()>CẬP NHẬT</button>
            </div>
          </form>
        </div>
      </div>

      <!-- RIGHT COLUMN -->
      <div class="col-lg-4">
        <div class="card p-4 shadow-sm text-center">
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?data=ONL2311348&size=120x120"
            alt="QR Code"
            class="mx-auto mb-3"
          />
          <div class="text-start small mb-3">
            <p class="mb-1">
              <strong>Tên đăng nhập:</strong> {{ form.email }}
            </p>
            <p class="mb-0"><strong>Ngày đăng ký:</strong> 20/09/2025</p>
          </div>
          <button class="btn btn-success w-100 fw-semibold mb-2">ĐĂNG XUẤT</button>
          <a href="#" class="text-danger small">Xóa thông tin</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
// import { getUserNameFromToken } from "../utils/jwt";

// const username = getUserNameFromToken();
// console.log(username);

const form = ref({
  lastName: "Thắng",
  firstName: "Trương",
  email: "thangtruong2611@gmail.com",
  password: "",
  phone: "",
  gender: "",
  day: "",
  month: "",
  year: "",
  city: "",
  address: "",
});

const errors = ref({});

function checkValidate() {
    errors.value = {};
    const v = form.value;
    let valid = true;

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRe = /^\d{9,11}$/;

    if (!v.lastName || !v.lastName.trim()) {
        errors.value.lastName = "Họ là bắt buộc";
        valid = false;
    }

    if (!v.firstName || !v.firstName.trim()) {
        errors.value.firstName = "Tên là bắt buộc";
        valid = false;
    }

    if (!v.email || !emailRe.test(v.email)) {
        errors.value.email = "Email không hợp lệ";
        valid = false;
    }

    if (v.password && v.password.length > 0 && v.password.length < 6) {
        errors.value.password = "Mật khẩu phải có ít nhất 6 ký tự";
        valid = false;
    }

    if (!v.phone || !phoneRe.test(v.phone)) {
        errors.value.phone = "Số điện thoại không hợp lệ (9-11 chữ số)";
        valid = false;
    }

    if (!v.gender) {
        errors.value.gender = "Chọn giới tính";
        valid = false;
    }

    if (!v.day || !v.month || !v.year) {
        errors.value.dob = "Chọn ngày sinh";
        valid = false;
    }

    if (!v.city) {
        errors.value.city = "Chọn tỉnh/thành";
        valid = false;
    }

    if (!v.address || !v.address.trim()) {
        errors.value.address = "Địa chỉ là bắt buộc";
        valid = false;
    }

    return { valid, errors: errors.value };
}


const years = computed(() => {
  const arr = [];
  for (let y = 1950; y <= 2025; y++) arr.push(y);
  return arr.reverse();
});

const updateInfo = () => {
    if(!checkValidate){
        return;
    }else{
        alert("Cập nhật thông tin thành công!");
    }
  
};




</script>

<style scoped>
.account-page .card {
  border-radius: 15px;
}
.account-page label {
  font-weight: 500;
}
.account-page .btn-success {
  background-color: #66bb6a;
  border: none;
}
.account-page .btn-success:hover {
  background-color: #57a85d;
}
.account-page .form-control,
.account-page .form-select {
  border-radius: 10px;
}
.account-page img[alt="QR Code"] {
  border: 1px solid #ccc;
  padding: 4px;
  border-radius: 10px;
}
</style>
