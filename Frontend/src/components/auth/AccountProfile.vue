<template>
   <div class="container-fluid">
      <div class="container account-page my-5">
         <h4 class="text-center mb-4 fw-bold">Thông tin cá nhân</h4>
         <div class="row g-4">
            <!-- LEFT COLUMN -->
            <div class="col-lg-8">
               <div class="card p-4 shadow-sm">
                  <div class="d-flex align-items-center mb-3">
                     <!-- <img
                        :src="`${IMAGE_URL + form.avatarUrl || 'https://via.placeholder.com/100x100.png?text=Avatar'}`"
                        alt="Avatar"
                        class="rounded-circle me-3 border"
                        style="width: 100px; height: 100px; object-fit: cover"
                     /> -->

                     <div class="position-relative d-inline-block mb-3">
                        <!-- Avatar hiển thị -->
                        <img
                           :src="
                              form.avatarPreview ||
                              (form.avatarUrl
                                 ? IMAGE_URL + form.avatarUrl
                                 : 'https://via.placeholder.com/100x100.png?text=Avatar')
                           "
                           alt="Avatar"
                           class="rounded-circle border"
                           style="width: 120px; height: 120px; object-fit: cover"
                        />

                        <!-- Icon tải ảnh -->
                        <label
                           v-if="isEditing"
                           for="avatar-upload"
                           class="camera-btn position-absolute bottom-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow"
                           style="width: 32px; height: 32px; cursor: pointer; border: 2px solid white"
                        >
                           <i class="bi bi-camera-fill" style="font-size: 16px"></i>
                        </label>

                        <!-- Input file ẩn -->
                        <input
                           v-if="isEditing"
                           type="file"
                           id="avatar-upload"
                           accept="image/*"
                           @change="previewAvatar"
                           style="display: none"
                        />
                     </div>

                     <div>
                        <h5 class="fw-semibold mb-1">{{ form.firstName + ' ' + form.lastName }}</h5>
                     </div>
                  </div>

                  <!-- <div v-if="error" class="alert alert-danger">{{ error }}</div>
                  <div v-if="success" class="alert alert-success">{{ success }}</div> -->

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
                              required
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
                                 required
                              >
                                 <option value="">Ngày</option>
                                 <option v-for="d in 31" :key="d" :value="d">
                                    {{ d.toString().padStart(2, '0') }}
                                 </option>
                              </select>
                              <select
                                 v-model.number="form.month"
                                 class="form-select"
                                 :class="{ 'is-invalid': errors.dob }"
                                 :disabled="!isEditing"
                                 required
                              >
                                 <option value="">Tháng</option>
                                 <option v-for="month in 12" :key="month" :value="month">
                                    {{ month.toString().padStart(2, '0') }}
                                 </option>
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
                           class="btn btn-success px-4 fw-semibold mx-2"
                        >
                           CẬP NHẬT
                        </button>
                        <button
                           v-if="isEditing"
                           type="button"
                           class="btn btn-outline-secondary ms-2 mx-2"
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
                     <p class="mb-1"><strong>Tên đăng nhập:</strong> {{ form.email }}</p>
                     <p class="mb-0"><strong>Ngày đăng ký:</strong> 20/09/2025</p>
                  </div>
                  <button class="btn btn-success w-100 fw-semibold mb-2" @click="logout">
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
                           <button type="submit" class="btn btn-success btn-sm px-4 fw-semibold mx-2">
                              LƯU MẬT KHẨU
                           </button>
                           <button
                              type="button"
                              class="btn btn-outline-secondary btn-sm ms-2 mx-2"
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
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
   const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || '';

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
      avatarUrl: '',
      avatarPreview: '',
   });

   const passwordForm = ref({
      oldPassword: '',
      newPassword: '',
   });

   const errors = ref({});
   const error = ref('');
   const success = ref('');
   const isEditing = ref(false); // Trạng thái chỉnh sửa
   const token = localStorage.getItem('token') || null;
   const showChangePassword = ref(false);
   const $swal = inject('$swal');

   const selectedAvatarFile = ref();

   function previewAvatar(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Kiểm tra file hợp lệ
      if (!file.type.startsWith('image/')) {
         alert('Vui lòng chọn file hình ảnh hợp lệ!');
         return;
      }

      // Tạo URL preview tạm thời
      form.value.avatarPreview = URL.createObjectURL(file);
      selectedAvatarFile.value = file;
   }

   function showToast(message) {
      const toastConfig = $swal.mixin({
         toast: true,
         position: 'top-end',
         showConfirmButton: false,
         timerProgressBar: true,
         timer: 1500,
      });

      toastConfig.fire({
         icon: 'success',
         title: message || 'Vui lòng nhập thông báo',
      });
   }

   function checkValidate() {
      errors.value = {};
      const v = form.value;
      let valid = true;

      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRe = /^\d{9,11}$/;

      if (!v.lastName || !v.lastName.trim()) {
         errors.value.lastName = 'Họ là bắt buộc';
         valid = false;
      }

      if (!v.firstName || !v.firstName.trim()) {
         errors.value.firstName = 'Tên là bắt buộc';
         valid = false;
      }

      if (!v.email || !emailRe.test(v.email)) {
         errors.value.email = 'Email không hợp lệ';
         valid = false;
      }

      if (v.password && v.password.length > 0 && v.password.length < 6) {
         errors.value.password = 'Mật khẩu phải có ít nhất 6 ký tự';
         valid = false;
      }

      if (!v.phone || !phoneRe.test(v.phone)) {
         errors.value.phone = 'Số điện thoại không hợp lệ (9-11 chữ số)';
         valid = false;
      }

      if (!v.gender) {
         errors.value.gender = 'Chọn giới tính';
         valid = false;
      }

      if (!v.day || !v.month || !v.year) {
         errors.value.dob = 'Chọn ngày sinh';
         valid = false;
      }

      if (!v.city) {
         errors.value.city = 'Chọn tỉnh/thành';
         valid = false;
      }

      if (!v.address || !v.address.trim()) {
         errors.value.address = 'Địa chỉ là bắt buộc';
         valid = false;
      }

      return { valid, errors: errors.value };
   }

   // Update Profile
   async function updateInfo() {
      const { valid } = checkValidate();
      if (!valid) return;

      try {
         const userInfo = jwtDecode(token);

         // Tạo formData thay vì JSON thông thường
         const formData = new FormData();
         formData.append('firstName', form.value.firstName);
         formData.append('lastName', form.value.lastName);
         formData.append('phone', form.value.phone);
         formData.append('email', form.value.email);
         formData.append('gender', form.value.gender);
         formData.append('day', form.value.day);
         formData.append('month', form.value.month);
         formData.append('year', form.value.year);
         formData.append('address', `${form.value.address}, ${form.value.city}`);

         // Nếu có ảnh mới thì thêm vào formData
         if (selectedAvatarFile.value) {
            formData.append('avatarUrl', selectedAvatarFile.value);
         }

         console.log('select avatar: ', selectedAvatarFile.value);

         console.log('Form data: ', formData);

         const response = await axios.put(
            `${API_BASE_URL}/auth/${userInfo.subject}/update-profile`,
            formData,
            {
               headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'multipart/form-data',
               },
            }
         );

         success.value = response.data.message;
         error.value = '';
         showToast('Cập nhật thông tin thành công');
         isEditing.value = false;
      } catch (err) {
         error.value = err.response?.data?.message || 'Lỗi khi cập nhật thông tin';
         success.value = '';
      }
   }

   const years = computed(() => {
      const arr = [];
      for (let y = 1950; y <= 2025; y++) arr.push(y);
      return arr.reverse();
   });

   // Lấy thông tin profile khi component được tạo
   async function getProfile() {
      try {
         const userInfo = jwtDecode(token);
         console.log(' Đang lấy profile cho user:', userInfo);
         const response = await axios.get(`${API_BASE_URL}/auth/${userInfo.subject}`);
         const data = response.data;
         console.log(' Dữ liệu hồ sơ nhận được:', data);

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
            avatarUrl: data.avatarUrl || '',
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

      if (
         !passwordForm.value.confirmPassword ||
         passwordForm.value.confirmPassword !== passwordForm.value.newPassword
      ) {
         errors.value.confirmPassword = 'Xác nhận mật khẩu không khớp';
         valid = false;
      }

      return valid;
   };
   // Đổi mật khẩu
   async function changePassword() {
      if (!validatePasswordForm()) return;

      try {
         const userInfo = jwtDecode(token);
         const payload = {
            oldPassword: passwordForm.value.oldPassword,
            newPassword: passwordForm.value.newPassword,
         };
         console.log('JWT Token:', token);

         console.log('payload change password: ', payload);
         console.log('user: ', userInfo.subject);
         const response = await axios.put(
            `${API_BASE_URL}/auth/${userInfo.subject}/change-password`,
            payload,
            {
               headers: { Authorization: `Bearer ${token}` },
            }
         );
         success.value = response.data.message;
         error.value = '';
         passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' };
         showChangePassword.value = false;
      } catch (err) {
         error.value = err.response?.data?.message || 'Lỗi khi đổi mật khẩu';
      }
   }

   function logout() {
      localStorage.removeItem('token');

      router.push('/');
      showToast('Đăng xuất thành công');

      setTimeout(() => {
         window.location.reload(); // reload để đồng bộ header
      }, 500);
   }

   onMounted(() => {
      console.log('Component mounted, fetching profile...');
      getProfile(); // ✅ GỌI TỰ ĐỘNG
   });
</script>

<style scoped>
   .account-page .card {
      border-radius: 15px;
      transition: box-shadow 0.2s ease-in-out;
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

   .account-page img[alt='QR Code'] {
      border: 1px solid #ccc;
      padding: 4px;
      border-radius: 10px;
   }

   .camera-btn {
      bottom: 4px;
      right: 4px;
      width: 34px;
      height: 34px;
      border: 2px solid white;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.2s ease-in-out;
   }

   .camera-btn:hover {
      background-color: #0a58ca;
      transform: scale(1.05);
   }

   /* -------------------------- */
   /* 🎯 RESPONSIVE STYLING */
   /* -------------------------- */

   /* Mobile (≤576px) */
   @media (max-width: 576px) {
      .account-page {
         padding: 10px;
      }

      .account-page .card {
         padding: 1rem !important;
      }

      .account-page h4 {
         font-size: 1.2rem;
      }

      .account-page img.rounded-circle {
         width: 90px !important;
         height: 90px !important;
      }

      .camera-btn {
         width: 28px;
         height: 28px;
         font-size: 14px;
         bottom: 2px;
         right: 2px;
      }

      .account-page .row {
         flex-direction: column;
      }

      .account-page .col-lg-8,
      .account-page .col-lg-4 {
         width: 100%;
      }

      .account-page .btn {
         font-size: 0.9rem;
      }

      .account-page .form-select,
      .account-page .form-control {
         font-size: 0.9rem;
      }
   }

   /* Tablet (577px - 991px) */
   @media (min-width: 577px) and (max-width: 991px) {
      .account-page {
         padding: 20px;
      }

      .account-page img.rounded-circle {
         width: 110px !important;
         height: 110px !important;
      }

      .account-page .card {
         padding: 1.5rem !important;
      }

      .account-page h4 {
         font-size: 1.4rem;
      }

      .account-page .form-label {
         font-size: 0.95rem;
      }
   }

   /* Desktop (≥992px) */
   @media (min-width: 992px) {
      .account-page {
         padding: 40px;
      }

      .account-page h4 {
         font-size: 1.6rem;
      }
   }
</style>
