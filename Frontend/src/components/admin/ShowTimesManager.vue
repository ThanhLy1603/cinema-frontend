<template>
   <div class="container-fluid">
      <div class="page-container">
         <!-- Navigation Buttons -->
         <div class="btn-box">
            <button class="switch-btn" :class="{ active: !showForm }" @click="showForm = false">
               Danh sách giờ chiếu
            </button>

            <button class="switch-btn" :class="{ active: showForm }" @click="showForm = true">
               Tạo giờ chiếu mới
            </button>
         </div>

         <!-- Show Time List -->
         <transition name="fade">
            <div v-if="!showForm" class="table-container">
               <table class="film-table table-bordered table-hover">
                  <thead class="align-center text-center">
                     <tr>
                        <th>Giờ bắt đầu</th>
                        <th>Thao tác</th>
                     </tr>
                  </thead>

                  <tbody class="text-center align-center">
                     <tr v-for="showTime in showTimes" :key="showTime.id">
                        <td>{{ showTime.startTime }}</td>
                        <td>
                           <button
                              class="btn btn-sm btn-primary mx-2"
                              @click="handleEdit(showTime)"
                           >
                              Sửa
                           </button>
                           <button
                              class="btn btn-sm btn-danger mx-2"
                              @click="handleDelete(showTime.id)"
                           >
                              Xóa
                           </button>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </transition>

         <!-- Show Time Form -->
         <transition name="slide">
            <div v-if="showForm" class="form-container">
               <form @submit.prevent="" class="film-form">
                  <div class="form-grid">
                     <div class="form-group">
                        <label class="fw-bold">Giờ bắt đầu</label>
                        <input type="time" v-model="form.startTime" required />
                     </div>
                  </div>

                  <div class="btn-actions">
                     <button type="submit" class="btn save" @click="handleCreateUpdate">
                        {{ showBtnUpdate ? 'Sửa' : 'Lưu' }}
                     </button>
                     <button type="reset" class="btn reset" @click="handleReset()">Làm mới</button>
                  </div>
               </form>
            </div>
         </transition>
      </div>
   </div>
</template>

<script setup>
   import axios from 'axios';
   import { ref, onMounted } from 'vue';

   const showForm = ref(false);

   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
   const token = localStorage.getItem('token');

   const showTimes = ref([]);
   const showBtnUpdate = ref(false);

   const form = ref({
      id: null,
      startTime: '',
   });

   async function getShowTimes() {
      try {
         const url = `${API_BASE_URL}/api/admin/show-times`;
         const response = await axios.get(url);
         showTimes.value = response.data;
         console.log('Show Times: ', showTimes.value);
      } catch (error) {
         console.error('Lỗi khi lấy dữ liệu giờ chiếu: ', error.message);
      }
   }

   async function handleCreateUpdate() {
      const payload = {
         startTime: form.value.startTime,
      };

      if (!showBtnUpdate.value) {
         // Tạo mới
         try {
            const url = `${API_BASE_URL}/api/admin/show-times/create`;
            const response = await axios.post(url, payload, {
               headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
               },
            });
            console.log(response.data.message);
            getShowTimes(); // Refresh list
            handleReset();
         } catch (error) {
            console.log('Lỗi khi thêm giờ chiếu ', error.message);
         }
      } else {
         // Cập nhật (giả sử backend có API update, nhưng hiện tại backend chưa implement, cần thêm sau)
         try {
            const url = `${API_BASE_URL}/api/admin/show-times/update/${form.value.id}`;
            const response = await axios.put(url, payload, {
               headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
               },
            });
            console.log(response.data.message);
            getShowTimes(); // Refresh list
            handleReset();
         } catch (error) {
            console.log('Lỗi khi cập nhật giờ chiếu ', error.message);
         }
      }
   }

   async function handleDelete(id) {
      if (confirm('Bạn có chắc chắn muốn xóa giờ chiếu này?')) {
         try {
            const url = `${API_BASE_URL}/api/admin/show-times/delete/${id}`;
            const response = await axios.delete(url, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            });
            console.log(response.data.message);
            getShowTimes(); // Refresh list
         } catch (error) {
            console.log('Lỗi khi xóa giờ chiếu ', error.message);
         }
      }
   }

   function handleEdit(showTime) {
      console.log('showTime edit: ', showTime);
      showBtnUpdate.value = true;
      showForm.value = true;
      form.value = { ...showTime };
   }

   function handleReset() {
      form.value = {
         id: null,
         startTime: '',
      };
      showBtnUpdate.value = false;
   }

   onMounted(() => {
      getShowTimes();
   });
</script>

<style scoped>
   .page-container {
      padding: 20px;
      background: #f5f6fa;
      min-height: 100vh;
   }

   /* switch btn box */
   .btn-box {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 230px;
      margin-bottom: 20px;
   }

   /* button style like image */
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

   /* Form & Table wrappers */
   .form-container,
   .table-container {
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
   }

   /* Form */
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
   textarea {
      height: 70px;
   }

   /* Checkbox */
   .checkbox-group {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
   }

   /* Buttons */
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

   /* Table */
   .film-table {
      width: 100%;
      border-collapse: collapse;
   }
   .film-table th,
   .film-table td {
      padding: 10px;
      border-bottom: 1px solid #e0e0e0;
   }
   .film-table img {
      width: 60px;
      height: 90px;
      border-radius: 4px;
   }

   /* Responsive */
   @media (max-width: 768px) {
      .form-grid {
         grid-template-columns: 1fr;
      }
      .btn-box {
         width: 100%;
         flex-direction: row;
      }
      .switch-btn {
         flex: 1;
         text-align: center;
      }
   }

   .page-container {
      padding: 20px;
      background: #eef1f5;
      min-height: 100vh;
      transition: 0.3s;
   }

   /* Switch buttons */
   .btn-box {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-bottom: 20px;
   }

   .switch-btn {
      background: #b8deb8;
      border: 2px solid #2b2b2b;
      padding: 5px 10px;
      font-size: 18px;
      border-radius: 15px;
      cursor: pointer;
      font-weight: bold;
   }

   .switch-btn:hover {
      transform: translateY(-2px);
   }

   /* Active Tab */
   .switch-btn.active {
      background: #7ee07e;
      box-shadow: 0 0 10px rgba(0, 200, 0, 0.3);
   }

   /* Card container */
   .form-container,
   .table-container {
      background: white;
      padding: 22px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      animation: fadeIn 0.35s ease;
   }

   .title {
      font-size: 22px;
      font-weight: bold;
      margin-bottom: 15px;
   }

   /* Input Elements */
   input,
   textarea,
   select {
      width: 100%;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid #c7c7c7;
      transition: box-shadow 0.2s ease;
   }

   input:focus,
   textarea:focus,
   select:focus {
      outline: none;
      box-shadow: 0 0 6px #7ee07e;
   }

   /* Form grid */
   .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
   }
   .form-group {
      margin-bottom: 12px;
   }

   /* Buttons */
   .btn-actions {
      display: flex;
      gap: 10px;
      margin-top: 10px;
   }
   .btn {
      padding: 12px;
      border-radius: 8px;
      color: white;
      font-weight: bold;
      border: none;
      cursor: pointer;
      transition: 0.25s;
   }
   .save {
      background: #2ecc71;
   }
   .reset {
      background: #e74c3c;
   }

   .btn:hover {
      transform: scale(1.05);
   }

   /* Table */
   .film-table {
      width: 100%;
      border-collapse: collapse;
   }
   .film-table th {
      background: #dfffe0;
      padding: 10px;
   }
   .film-table td {
      padding: 10px;
      border-bottom: 1px solid #ececec;
   }
   .film-table tr:hover {
      background: #f7fff7;
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

   /* 📌 Tablet (<= 1024px) */
   @media (max-width: 1024px) {
      .page-container {
         padding: 15px;
      }

      .form-grid {
         grid-template-columns: 1fr; /* form xuống 1 cột */
         gap: 10px;
      }

      .btn-box {
         gap: 8px;
      }

      .switch-btn {
         font-size: 15px;
         padding: 10px;
      }
   }

   /* 📌 Mobile (<= 768px) */
   @media (max-width: 768px) {
      .btn-box {
         width: 100%;
         display: flex;
         flex-wrap: wrap;
         gap: 8px;
      }

      .switch-btn {
         flex: 1;
         font-size: 14px;
         padding: 10px 8px;
         border-radius: 10px;
      }

      .title {
         font-size: 18px;
         text-align: center;
      }

      .form-container,
      .table-container {
         padding: 16px;
      }

      input,
      textarea,
      select {
         padding: 10px;
         font-size: 14px;
      }

      /* 📌 Table scroll khi nhỏ */
      .film-table {
         display: block;
         overflow-x: auto;
         white-space: nowrap;
      }

      .film-table th,
      .film-table td {
         font-size: 13px;
         padding: 8px;
      }

      .film-table img {
         width: 50px;
         height: 70px;
      }

      /* Button nhỏ hơn */
      .btn {
         padding: 8px 12px;
         font-size: 13px;
      }
   }

   /* 📌 Very small screens (<= 480px) */
   @media (max-width: 480px) {
      .switch-btn {
         font-size: 13px;
         padding: 8px;
      }

      .title {
         font-size: 16px;
      }

      .btn-actions {
         flex-direction: column;
      }

      .btn {
         width: 100%;
         text-align: center;
      }
   }
</style>
