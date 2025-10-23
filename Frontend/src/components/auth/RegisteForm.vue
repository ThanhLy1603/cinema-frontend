<template>
  <div class="container py-5">
    <div class="card shadow-sm border-0 mx-auto" style="max-width: 700px">
      <div class="card-body p-4">
        <h4 class="fw-bold mb-4 text-center">Đăng ký tài khoản</h4>

        <!-- ===== Form đăng ký chính ===== -->
        <form @submit.prevent="submitForm" v-if="step === 1">
          <!-- Tên đăng nhập -->
          <div class="mb-3">
            <label class="form-label">Tên đăng nhập *</label>
            <input
              v-model="form.username"
              type="text"
              class="form-control"
              placeholder="Nhập tên đăng nhập"
              @blur="checkUsername"
              @input="removeSpaces('username')"
              @keydown.space.prevent
              required
            />
            <small
              v-if="usernameStatus"
              :class="usernameStatus.includes('tồn tại') ? 'text-danger' : 'text-success'"
            >
              {{ usernameStatus }}
            </small>
          </div>

          <!-- Họ và tên -->
          <div class="mb-3">
            <label class="form-label">Họ và tên *</label>
            <input
              v-model="form.fullName"
              type="text"
              class="form-control"
              placeholder="Nhập họ và tên đầy đủ"
              required
            />
          </div>

          <!-- Giới tính + Email -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Giới tính *</label>
              <div>
                <div
                  class="form-check form-check-inline"
                  v-for="gender in ['Nam', 'Nữ']"
                  :key="gender"
                >
                  <input
                    v-model="form.gender"
                    class="form-check-input"
                    type="radio"
                    :value="gender"
                    :id="gender"
                  />
                  <label class="form-check-label" :for="gender">{{ gender }}</label>
                </div>
              </div>
            </div>

            <div class="col-md-6 mt-2">
              <label class="form-label">Địa chỉ email *</label>
              <div class="email-otp-group">
                <input
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  placeholder="example@gmail.com"
                  @input="removeSpaces('email')"
                  @keydown.space.prevent
                  required
                  @blur="checkEmail"
                />
              </div>
              <small
                v-if="emailStatus"
                :class="
                  emailStatus.includes('đã được sử dụng') ||
                  emailStatus.includes('không hợp lệ')
                    ? 'text-danger'
                    : 'text-success'
                "
              >
                {{ emailStatus }}
              </small>
            </div>
          </div>

          <!-- Mật khẩu -->
          <div class="row mb-3">
            <div class="col-md-6">
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
            <div class="col-md-6">
              <label class="form-label">Nhập lại mật khẩu *</label>
              <input
                v-model="form.repassword"
                type="password"
                class="form-control"
                placeholder="Xác nhận mật khẩu"
                @input="removeSpaces('repassword')"
                @keydown.space.prevent
                required
              />
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
              @input="removeSpaces('phone')"
              @keydown.space.prevent
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
              <option>Khác</option>
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
          <button type="submit" class="btn btn-success w-100 fw-bold py-2">ĐĂNG KÝ</button>

          <div class="text-center mt-3">
            <button type="button" class="btn-back" @click="goBack">← Quay lại đăng nhập</button>
          </div>
        </form>

        <!-- ===== Nhập OTP ===== -->
        <div class="mb-3" v-else>
          <label class="form-label">Nhập mã OTP *</label>
          <label class="text-danger mx-2">{{ formattedTime }} (có hiệu lực 5 phút)</label>
          <div class="email-otp-group">
            <input
              v-model="form.otp"
              type="text"
              class="form-control"
              placeholder="Nhập mã OTP 6 số"
              required
            />
            <button
              type="button"
              class="btn btn-verify"
              @click="register"
            >
               Xác minh OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, onUnmounted, inject } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const $swal = inject("$swal");

const step = ref(1);
const usernameStatus = ref("");
const emailStatus = ref("");

const form = reactive({
  username: "",
  fullName: "",
  gender: "Nam",
  email: "",
  otp: "",
  password: "",
  repassword: "",
  phone: "",
  day: "",
  month: "",
  year: "",
  city: "",
  agree: false
});

const years = computed(() => {
  const current = new Date().getFullYear();
  return Array.from({ length: 100 }, (_, i) => current - i);
});

const time = ref(5 *60);
let timer = null;

const formattedTime = computed(() => {
  const minutes = Math.floor(time.value / 60);
  const seconds = time.value % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
});

function showSuccessToast(message, duration = 2500) {
  const toast = $swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: duration,
    timerProgressBar: true,
  });
  toast.fire({ icon: "success", title: message });
}

function showAlertToast(message) {
  $swal.fire({
    text: message,
    icon: "error",
    confirmButtonText: "Đồng ý",
  });
}

function removeSpaces(field) {
  form[field] = form[field].replace(/\s+/g, "");
}

function goBack() {
  router.push("/login");
}

async function sendOtp() {
  if (!form.email) return showAlertToast("⚠️ Vui lòng nhập email trước khi gửi OTP!");
  if (emailStatus.value.includes("đã được sử dụng") || emailStatus.value.includes("không hợp lệ"))
    return showAlertToast("⚠️ " + emailStatus.value + ". Vui lòng nhập email khác.");

  try {
    await axios.post("http://localhost:8080/api/auth/send-otp", { email: form.email });
    showSuccessToast("OTP đã được gửi đến email của bạn", 3000);
    countdown();
  } catch {
    showAlertToast("Lỗi khi gửi OTP đến server");
  }
}

function countdown() {
  clearInterval(timer);
  timer = setInterval(() => {
    if (time.value > 0) time.value--;
    else {
      clearInterval(timer);
      showAlertToast("Đã hết thời gian nhập OTP");
      window.location.reload();
    }
  }, 1000);
}

async function verifyOtp() {
  if (!form.otp) {
    showAlertToast("⚠️ Vui lòng nhập mã OTP!");
    return false;
  }

  try {
   console.log("form: ", form);

   const payload = {
      email: form.email,
      otp: form.otp
   };

   const response = await axios.post("http://localhost:8080/api/auth/verify-otp", 
      {
         email: form.email,
         otp: form.otp
      },
      {
         headers: { "Content-Type": "application/json" }
      }
   );

    console.log("payload verify: ", payload);
    console.log("success", response.data);

    if (response.data.status) {
      console.log("Thanh cong"); 
      return true;
    } else {
      console.log("Xac thuc That bai");
      return false;
    }
  } catch {
      showAlertToast("Lỗi khi xác minh OTP");
      return false;
  } 
}

async function register() {
  const isValid = await verifyOtp();

  console.log("valid", isValid);
  if (!isValid) return;

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

  console.log("payload", payload);

  try {
    const res = await axios.post("http://localhost:8080/api/auth/register", payload);
    showSuccessToast(res.data.message || "🎉 Đăng ký thành công!");
    router.push("/login");
  } catch {
    showAlertToast("Lỗi khi kết nối đến server");
  }
}

async function submitForm() {
  if (!form.email) return showAlertToast("⚠️ Vui lòng nhập email!");
  if (emailStatus.value.includes("đã được sử dụng") || emailStatus.value.includes("không hợp lệ"))
    return showAlertToast("⚠️ " + emailStatus.value + ". Vui lòng nhập email khác.");
  if (form.password.length < 7)
    return showAlertToast("❌ Mật khẩu phải tối thiểu 7 ký tự");
  if (form.password !== form.repassword)
    return showAlertToast("❌ Mật khẩu nhập lại không khớp!");

  step.value = 2;
  sendOtp();
}

async function checkUsername() {
  if (!form.username.trim()) return (usernameStatus.value = "");
  try {
    const res = await axios.post("http://localhost:8080/api/auth/check-username", {
      username: form.username,
    });
    usernameStatus.value = res.data.message;
  } catch {
    usernameStatus.value = "⚠️ Lỗi khi kiểm tra username.";
  }
}

async function checkEmail() {
  if (!form.email.trim()) return (emailStatus.value = "");
  try {
    const res = await axios.post("http://localhost:8080/api/auth/check-email", {
      email: form.email,
    });
    emailStatus.value = res.data.message;
  } catch {
    emailStatus.value = "⚠️ Lỗi khi kiểm tra email.";
  }
}

onUnmounted(() => clearInterval(timer));
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

.btn-verify {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 14px;
  height: 42px;
  font-weight: 600;
  transition: 0.25s ease;
}

.btn-verify:hover {
  background-color: #006ae0;
}

@media (max-width: 576px) {
  .email-otp-group {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-verify {
    width: 100%;
    margin-top: 6px;
  }
}
</style>
