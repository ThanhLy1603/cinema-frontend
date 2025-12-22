<template>
   <div class="container-fluid">
      <div class="page-container">
         <!-- Navigation Buttons -->
         <div class="d-flex justify-content-center align-items-center my-3">
            <button class="switch-btn mx-2" :class="{ active: !showForm }" @click="showForm = false">
               Danh sách nhân viên
            </button>

            <button class="switch-btn mx-2" :class="{ active: showForm }" @click="showForm = true">
               Tạo nhân viên mới
            </button>
         </div>

         <!-- Staff List -->
         <transition name="fade">
            <div v-if="!showForm" class="table-container">
               <table class="staff-table table-bordered table-hover">
                  <thead class="align-center text-center">
                     <tr>
                        <th>STT</th>
                        <th>Avatar</th>
                        <th>Username</th>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Giới tính</th>
                        <th>Ngày sinh</th>
                        <th>Thao tác</th>
                     </tr>
                  </thead>

                  <tbody class="text-center align-center">
                     <tr v-for="(staff, index) in staffList" :key="index">
                        <td>{{index + 1}}</td>
                        <td><img :src="avatarSrc(staff.avatarUrl)" alt="Avatar" style="width: 60px; height: 60px; border-radius: 50%;" /></td>
                        <td>{{ staff.username }}</td>
                        <td>{{ staff.fullName }}</td>
                        <td>{{ staff.email }}</td>
                        <td>{{ staff.phone }}</td>
                        <td>{{ getGenderName(staff.gender) }}</td>
                        <td>{{ staff.birthday }}</td>
                        <td>
                           <button class="btn btn-sm btn-primary mx-2" @click="handleEdit(staff)">
                              Sửa
                           </button>
                           <button class="btn btn-sm btn-danger mx-2" @click="handleDelete(staff.username)">Xóa</button>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </transition>

         <!-- Staff Form -->
         <transition name="slide">
            <div v-if="showForm" class="form-container">
               <form @submit.prevent="handleCreateUpdate" class="staff-form">
                  <div class="form-grid">
                     <div class="form-group">
                        <label class="fw-bold">Username</label>
                        <input
                           type="text"
                           v-model="form.username"
                           placeholder="Nhập username..."
                           :disabled="showBtnUpdate"
                           required
                        />
                     </div>

                     <div v-if="!showBtnUpdate" class="form-group">
                        <label>Mật khẩu</label>
                        <input
                           type="password"
                           v-model="form.password"
                           placeholder="Nhập mật khẩu..."
                           required
                        />
                     </div>

                     <div class="form-group">
                        <label>Email</label>
                        <input
                           type="email"
                           v-model="form.email"
                           placeholder="Nhập email..."
                           required
                        />
                     </div>

                     <div class="form-group">
                        <label>Họ tên</label>
                        <input
                           type="text"
                           v-model="form.fullName"
                           placeholder="Nhập họ tên..."
                           required
                        />
                     </div>

                     <div class="form-group">
                        <label>Giới tính</label>
                        <select v-model="form.gender" required>
                           <option :value="true">Nam</option>
                           <option :value="false">Nữ</option>
                        </select>
                     </div>

                     <div class="form-group">
                        <label>Số điện thoại</label>
                        <input
                           type="text"
                           v-model="form.phone"
                           placeholder="Nhập số điện thoại..."
                           required
                        />
                     </div>

                     <div class="form-group">
                        <label>Địa chỉ</label>
                        <input
                           type="text"
                           v-model="form.address"
                           placeholder="Nhập địa chỉ..."
                           required
                        />
                     </div>

                     <div class="form-group">
                        <label>Ngày sinh</label>
                        <input type="date" v-model="form.birthday" required />
                     </div>
                  </div>

                  <div class="form-group">
                     <label>Avatar</label>

                     <!-- Preview avatar cũ nếu edit -->
                     <div v-if="form.avatarUrl && typeof form.avatarUrl === 'string'">
                        <img
                           :src="avatarSrc(form.avatarUrl)"
                           alt="Avatar"
                           style="width: 120px; border-radius: 50%; margin-bottom: 8px"
                        />
                     </div>

                     <input type="file" @change="handleAvatar" accept="image/*"/>
                  </div>

                  <div class="btn-actions">
                     <button type="submit" class="btn save">
                        {{ showBtnUpdate ? 'Sửa' : 'Lưu' }}
                     </button>
                     <button type="reset" class="btn reset" @click="handleReset()">Làm mới</button>
                  </div>
               </form>
            </div>
         </transition>
      </div>

      <transition name="fade">
         <div
            v-if="toast.message"
            class="toast-custom"
            :class="toast.type === 'error' ? 'bg-danger' : 'bg-success'"
         >
            {{ toast.message }}
         </div>
      </transition>
   </div>
</template>

<script setup>
   import axios from 'axios';
   import { ref, onMounted } from 'vue';
   import Swal from 'sweetalert2';

   const showForm = ref(false);
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
   const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
   const staffList = ref([]);
   const showBtnUpdate = ref(false);
   const token = localStorage.getItem("token");
   const toast = ref({ message: '', type: '' });

   const staffUsername = ref('');

   const form = ref({
      username: '',
      password: '',
      email: '',
      fullName: '',
      gender: true,
      phone: '',
      address: '',
      birthday: '',
      avatar: null,
      avatarUrl: ''
   });

   function showToast(msg, type = 'success') {
      toast.value = { message: msg, type };
      setTimeout(() => (toast.value.message = ''), 2500);
   }

   async function showConfirm(message) {
      const result = await Swal.fire({
         title: message,
         icon: 'warning',
         showCancelButton: true,
         confirmButtonText: 'Xác nhận',
         cancelButtonText: 'Huỷ',
         confirmButtonColor: '#d33',
         cancelButtonColor: '#6c757d',
         reverseButtons: true
      });

      return result.isConfirmed;
   }

   async function getStaffList() {
      try {
         const url = `${API_BASE_URL}/api/admin/staff`;
         const response = await axios.get(url);
         staffList.value = response.data;
         console.log('Staff: ', staffList.value);
      } catch (error) {
         showToast('Lỗi khi tải danh sách nhân viên', 'error');
      }
   }

   function getGenderName(gender) {
      return gender ? 'Nam' : 'Nữ';
   }

   async function handleCreateUpdate() {
      const formData = new FormData();
      formData.append('username', form.value.username);
      if (!showBtnUpdate.value) {
         formData.append('password', form.value.password);
      }
      formData.append('email', form.value.email);
      formData.append('fullName', form.value.fullName);
      formData.append('gender', form.value.gender);
      formData.append('phone', form.value.phone);
      formData.append('address', form.value.address);
      formData.append('birthday', form.value.birthday);

      if (form.value.avatar instanceof File) {
         formData.append('avatar', form.value.avatar);
      }

      if (!showBtnUpdate.value) {
         if (!form.value.avatar) {
            showToast('Bạn chưa tải avatar', 'error');
            return;
         }

         try {
            const url = `${API_BASE_URL}/api/admin/staff/create`;
            const response = await axios.post(url, formData, {
               headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'multipart/form-data',
               },
            });
            getStaffList();
            showToast(response.data.message, 'success');
         } catch (error) {
            showToast('Lỗi khi thêm nhân viên mới', 'error');
         }
      } else {
         try {
            const url = `${API_BASE_URL}/api/admin/staff/update/${staffUsername.value}`;
            const response = await axios.put(url, formData, {
               headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'multipart/form-data',
               },
            });
            getStaffList();
            showToast(response.data.message, 'success');
         } catch (error) {
            showToast('Lỗi khi sửa thông tin nhân viên', 'error');
         }
      }
   }

   async function handleDelete(username) {
      const confirmed = await showConfirm('Bạn có chắc muốn xoá nhân viên này?');
      
      if (!confirmed) {
         Swal.fire({
            icon: 'info',
            title: 'Đã huỷ xoá nhân viên',
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
         });
         return;
      }

      try {
         const url = `${API_BASE_URL}/api/admin/staff/delete/${username}`;
         const response = await axios.delete(url, {
            headers: { Authorization: `Bearer ${token}` },
         });
         getStaffList();
         showToast(response.data.message || 'Xoá nhân viên thành công');
      } catch (error) {
         Swal.fire({
            icon: 'error',
            title: 'Xoá nhân viên thất bại!',
            text: error.message,
         });
      }
   }

   function handleEdit(staff) {
      showBtnUpdate.value = true;
      showForm.value = true;
      form.value = { ...staff };
      staffUsername.value = staff.username;
   }

   function handleReset() {
      form.value = {
         username: '',
         password: '',
         email: '',
         fullName: '',
         gender: true,
         phone: '',
         address: '',
         birthday: '',
         avatar: null,
         avatarUrl: ''
      };
      staffUsername.value = '';
      showBtnUpdate.value = false;
   }

   function handleAvatar(event) {
      const file = event.target.files[0];
      if (file) {
         form.value.avatar = file;
      }
   }

   function avatarSrc(avatar) {
      return IMAGE_URL + avatar;
   }

   onMounted(() => {
      getStaffList();
   });
</script>

<style scoped>
   .toast-custom {
      position: fixed;
      top: 20px;
      right: 20px;
      color: #fff;
      font-weight: 600;
      border-radius: 8px;
      padding: 10px 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      transition: 0.3s ease;
      z-index: 1055;
   }

   .page-container {
      padding: 20px;
      background: #f5f6fa;
      min-height: 100vh;
   }

   .switch-btn {
      background: #7ee07e;
      border: 2px solid #2b2b2b;
      padding: 14px 20px;
      font-size: 18px;
      border-radius: 15px;
      cursor: pointer;
      font-weight: bold;
   }

   .switch-btn:hover {
      background: #8cf78c;
   }

   .form-container,
   .table-container {
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
   }

   .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
   }

   .form-group {
      margin-bottom: 12px;
   }
   input,
   textarea,
   select {
      width: 100%;
      padding: 10px;
      border-radius: 6px;
      border: 1px solid #ccc;
   }

   .btn-actions {
      display: flex;
      gap: 10px;
   }
   .btn {
      padding: 10px 16px;
      border-radius: 8px;
      color: #fff;
      font-weight: bold;
      border: none;
      cursor: pointer;
   }
   .save {
      background: #2ecc71;
   }
   .reset {
      background: #e74c3c;
   }

   .staff-table {
      width: 100%;
      border-collapse: collapse;
   }
   .staff-table th,
   .staff-table td {
      padding: 10px;
      border-bottom: 1px solid #e0e0e0;
   }
   .staff-table img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
   }

   /* Animations */
   .fade-enter-active,
   .fade-leave-active {
      transition: opacity 0.25s;
   }
   .fade-enter-from,
   .fade-leave-to {
      opacity: 0;
   }

   .slide-enter-active {
      animation: slideIn 0.2s ease;
   }

   @keyframes slideIn {
      from {
         transform: translateY(20px);
         opacity: 0;
      }
      to {
         transform: translateY(0);
         opacity: 1;
      }
   }

   /* Responsive */
   @media (max-width: 768px) {
      .form-grid {
         grid-template-columns: 1fr;
      }
   }
</style>