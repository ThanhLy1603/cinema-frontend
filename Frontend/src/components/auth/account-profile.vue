<template>
  <div class="container account-page my-5">
    <h4 class="text-center mb-4 fw-bold">Tài khoản</h4>
    <div class="row g-4">
      <!-- LEFT COLUMN -->
      <div class="col-lg-8">
        <div class="card p-4 shadow-sm">
          <div class="d-flex align-items-center mb-3">
            <img
              :src="form.avatarUrl || 'https://via.placeholder.com/100x100.png?text=Avatar'"
              alt="Avatar"
              class="rounded-circle me-3 border"
              style="width: 100px; height: 100px; object-fit: cover;"
            />
            <div>
              <h5 class="fw-semibold mb-1">{{ form.firstName + ' ' + form.lastName }}</h5>
            </div>
          </div>

          <div v-if="error" class="alert alert-danger">{{ error }}</div>
          <div v-if="success" class="alert alert-success">{{ success }}</div>

          <form @submit.prevent="updateInfo">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Họ *</label>
                <input
                  v-model="form.firstName"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.firstName }"
                  :disabled="!isEditing"
                />
                <div class="invalid-feedback">{{ errors.firstName }}</div>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Tên đệm và tên *</label>
                <input
                  v-model="form.lastName"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.lastName }"
                  :disabled="!isEditing"
                />
                <div class="invalid-feedback">{{ errors.lastName }}</div>
              </div>
              <div class="col-12 mb-3">
                <label class="form-label">Email *</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': errors.email }"
                  readonly
                />
                <div class="invalid-feedback">{{ errors.email }}</div>
              </div>

              <div class="col-md-3 mb-3 d-flex align-items-end">
                <button
                  type="button"
                  class="btn btn-outline-success w-100"
                  @click="showChangePassword = !showChangePassword"
                >
                  ĐỔI MẬT KHẨU
                </button>
              </div>

              <div class="col-12 mb-3">
                <label class="form-label">Số điện thoại *</label>
                <input
                  v-model="form.phone"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.phone }"
                  :disabled="!isEditing"
                />
                <div class="invalid-feedback">{{ errors.phone }}</div>
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Giới tính *</label>
                <select
                  v-model="form.gender"
                  class="form-select"
                  :class="{ 'is-invalid': errors.gender }"
                  :disabled="!isEditing"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="true">Nam</option>
                  <option value="false">Nữ</option>
                </select>
                <div class="invalid-feedback">{{ errors.gender }}</div>
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Ngày sinh *</label>
                <div class="d-flex gap-2">
                  <select
                    v-model.number="form.day"
                    class="form-select"
                    :class="{ 'is-invalid': errors.dob }"
                    :disabled="!isEditing"
                  >
                    <option value="">Ngày</option>
                    <option v-for="d in 31" :key="d" :value="d">{{ d.toString().padStart(2, '0') }}</option>
                  </select>
                  <select
                    v-model.number="form.month"
                    class="form-select"
                    :class="{ 'is-invalid': errors.dob }"
                    :disabled="!isEditing"
                  >
                    <option value="">Tháng</option>
                    <option v-for="m in 12" :key="m" :value="m">{{ m.toString().padStart(2, '0') }}</option>
                  </select>
                  <select
                    v-model.number="form.year"
                    class="form-select"
                    :class="{ 'is-invalid': errors.dob }"
                    :disabled="!isEditing"
                  >
                    <option value="">Năm</option>
                    <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
                  </select>
                </div>
                <div class="invalid-feedback">{{ errors.dob }}</div>
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Tỉnh/Thành phố *</label>
                <select
                  v-model="form.city"
                  class="form-select"
                  :class="{ 'is-invalid': errors.city }"
                  :disabled="!isEditing"
                >
                  <option value="">Chọn tỉnh/thành</option>
                  <option>Hà Nội</option>
                  <option>Hồ Chí Minh</option>
                  <option>Đà Nẵng</option>
                </select>
                <div class="invalid-feedback">{{ errors.city }}</div>
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Địa chỉ *</label>
                <input
                  v-model="form.address"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.address }"
                  :disabled="!isEditing"
                />
                <div class="invalid-feedback">{{ errors.address }}</div>
              </div>
            </div>

            <div class="text-center mt-3">
              <button
                v-if="!isEditing"
                type="button"
                class="btn btn-primary px-4 fw-semibold"
                @click="isEditing = true"
              >
                CHỈNH SỬA
              </button>
              <button
                v-if="isEditing"
                type="submit"
                class="btn btn-success px-4 fw-semibold"
              >
                CẬP NHẬT
              </button>
              <button
                v-if="isEditing"
                type="button"
                class="btn btn-outline-secondary ms-2"
                @click="isEditing = false"
              >
                HỦY
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- RIGHT COLUMN -->
      <div class="col-lg-4">
        <div class="card p-4 shadow-sm text-center">
          <div class="text-start small mb-3">
            <p class="mb-1">
              <strong>Tên đăng nhập:</strong> {{ form.email }}
            </p>
            <p class="mb-0"><strong>Ngày đăng ký:</strong> 20/09/2025</p>
          </div>
          <button
            class="btn btn-success w-100 fw-semibold mb-2"
            @click="logout"
          >
            ĐĂNG XUẤT
          </button>

          <!-- Form đổi mật khẩu -->
          <div v-if="showChangePassword" class="mt-4">
            <h5 class="fw-semibold mb-3">Đổi mật khẩu</h5>
            <form @submit.prevent="changePassword">
              <div class="mb-3">
                <label class="form-label">Mật khẩu cũ *</label>
                <input
                  v-model="passwordForm.oldPassword"
                  type="password"
                  class="form-control form-control-sm"
                  :class="{ 'is-invalid': errors.oldPassword }"
                />
                <div class="invalid-feedback">{{ errors.oldPassword }}</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Mật khẩu mới *</label>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  class="form-control form-control-sm"
                  :class="{ 'is-invalid': errors.newPassword }"
                />
                <div class="invalid-feedback">{{ errors.newPassword }}</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Xác nhận mật khẩu *</label>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  class="form-control form-control-sm"
                  :class="{ 'is-invalid': errors.confirmPassword }"
                />
                <div class="invalid-feedback">{{ errors.confirmPassword }}</div>
              </div>
              <div class="text-center">
                <button
                  type="submit"
                  class="btn btn-success btn-sm px-4 fw-semibold"
                >
                  LƯU MẬT KHẨU
                </button>
                <button
                  type="button"
                  class="btn btn-outline-secondary btn-sm ms-2"
                  @click="showChangePassword = false"
                >
                  HỦY
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { onMounted } from 'vue';
import { jwtDecode } from 'jwt-decode';
import { inject } from 'vue';

const router = useRouter();
const route = useRoute();

const form = ref({
  lastName: '',
  firstName: '',
  email: '',
  phone: '',
  gender: '',
  day: '',
  month: '',
  year: '',
  city: '',
  address: '',
  avatarUrl: ''
});

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
});

const confirmPassword = ref('');



const errors = ref({});
const error = ref('');
const success = ref('');
const isEditing = ref(false); // Trạng thái chỉnh sửa
const token = localStorage.getItem('token') || null;
const showChangePassword = ref(false);
const $swal = inject("$swal");

  function showToast(message) {
    const toastConfig = $swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 1500
    });

    toastConfig.fire({
      icon: 'success',
      title: message || "Vui lòng nhập thông báo"
    });

  }

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


// Update Profile
const updateInfo = async () => {
  const { valid } = checkValidate();
  if (!valid) return;

  try {
    const userInfo = jwtDecode(token);
    const payload = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      phone: form.value.phone,
      email: form.value.email,
      gender: form.value.gender,
      day: form.value.day,
      month: form.value.month,
      year: form.value.year,
      address: `${form.value.address}, ${form.value.city}`
    };

    const response = await axios.put(`http://localhost:8080/api/auth/${userInfo.subject}/updateprofile`, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    success.value = response.data.message;
    error.value = '';
    showToast("Cập nhật thông tin thành công");
    isEditing.value = false;
  } catch (err) {
    error.value = err.response?.data?.message || 'Lỗi khi cập nhật thông tin';
    success.value = '';
  }
};

const years = computed(() => {
  const arr = [];
  for (let y = 1950; y <= 2025; y++) arr.push(y);
  return arr.reverse();
});

// Lấy thông tin profile khi component được tạo
const fetchProfile = async () => {
  try {

    const userInfo = jwtDecode(token);
    console.log(' Đang lấy profile cho user:', userInfo);
    const response = await axios.get(`http://localhost:8080/api/auth/${userInfo.subject}`);
    const data = response.data;
    console.log(" Dữ liệu hồ sơ nhận được:", data);

    form.value = {
      lastName: data.fullName ? data.fullName.split(' ').slice(0, -1).join(' ') : '',
      firstName: data.fullName ? data.fullName.split(' ').slice(-1)[0] : '',
      email: data.email || '',
      phone: data.phone || '',
      gender: data.gender !== null ? data.gender.toString() : '',
      day: data.birthday ? parseInt(data.birthday.split('-')[2]) : '',
      month: data.birthday ? parseInt(data.birthday.split('-')[1]) : '',
      year: data.birthday ? parseInt(data.birthday.split('-')[0]) : '',
      city: data.address ? data.address.split(', ').slice(-1)[0] : '',
      address: data.address ? data.address.split(', ').slice(0, -1).join(', ') : '',
      avatarUrl: data.avatarUrl || ''
    };
    error.value = '';
  } catch (err) {
    console.error('Lỗi khi lấy profile:', err);
    error.value = err.response?.data?.message || 'Lỗi khi lấy thông tin hồ sơ';
    success.value = '';
  }
};


// validate đổi mật khẩu
const validatePasswordForm = () => {
  errors.value = {};
  let valid = true; // Khai báo biến valid

  if (!passwordForm.value.oldPassword) {
    errors.value.oldPassword = 'Mật khẩu cũ là bắt buộc';
    valid = false;
  }

  if (!passwordForm.value.newPassword || passwordForm.value.newPassword.length < 6) {
    errors.value.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';
    valid = false;
  }

  if (!passwordForm.value.confirmPassword || passwordForm.value.confirmPassword !== passwordForm.value.newPassword) {
    errors.value.confirmPassword = 'Xác nhận mật khẩu không khớp';
    valid = false;
  }

  return valid;
};
// Đổi mật khẩu
const changePassword = async () => {
  if (!validatePasswordForm()) return;

  try {
    const userInfo = jwtDecode(token);
    const response = await axios.put(`http://localhost:8080/api/auth/${userInfo.subject}/changepassword`, passwordForm.value, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    success.value = response.data.message;
    error.value = '';
    passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' };
    showChangePassword.value = false;
  } catch (err) {
    error.value = err.response?.data?.message || 'Lỗi khi đổi mật khẩu';
  }
};

function logout() {
    localStorage.removeItem('token');

    router.push('/');
    showToast("Đăng xuất thành công");

    setTimeout(() => {
      window.location.reload(); // reload để đồng bộ header
    }, 500);

  }

onMounted(() => {
  console.log('Component mounted, fetching profile...');
  fetchProfile(); // ✅ GỌI TỰ ĐỘNG
})


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
