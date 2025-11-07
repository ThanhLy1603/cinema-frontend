<template>
   <div class="container-fluid">
      <div class="page-container">
         <!-- Navigation Buttons -->
         <div class="btn-box">
            <button class="switch-btn" :class="{ active: !showForm }" @click="showForm = false">
               Danh sách phòng chiếu
            </button>
            <button class="switch-btn" :class="{ active: showForm }" @click="onCreateClick">
               {{ showBtnUpdate ? 'Cập nhật phòng' : 'Tạo phòng mới' }}
            </button>
         </div>

         <!-- Room List -->
         <transition name="fade">
            <div v-if="!showForm" class="table-container">
               <table class="film-table table-bordered table-hover">
                  <thead class="text-center">
                     <tr>
                        <th>STT</th>
                        <th>Tên phòng</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                     </tr>
                  </thead>
                  <tbody class="text-center">
                     <tr v-for="(room, index) in rooms" :key="room.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ room.name }}</td>
                        <td>
                           <span :class="getStatusClass(room.status)">
                              {{ getStatusName(room.status) }}
                           </span>
                        </td>
                        <td>
                           <button class="btn btn-sm btn-primary mx-1" @click="handleEdit(room)">
                              Sửa
                           </button>
                           <button
                              class="btn btn-sm btn-danger mx-1"
                              @click="handleDelete(room.id)"
                           >
                              Xóa
                           </button>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </transition>

         <!-- Room Form -->
         <transition name="slide">
            <div v-if="showForm" class="form-container">
               <form @submit.prevent="handleCreateUpdate" class="film-form">
                  <div class="form-grid">
                     <div class="form-group">
                        <label class="fw-bold">Tên phòng</label>
                        <input
                           type="text"
                           v-model="form.name"
                           placeholder="VD: Phòng 1, Phòng VIP..."
                           required
                        />
                     </div>

                     <div class="form-group">
                        <label>Trạng thái</label>
                        <select v-model="form.status" required>
                           <option value="active">Đang hoạt động</option>
                           <option value="closed">Đóng cửa</option>
                           <option value="maintenance">Bảo trì</option>
                        </select>
                     </div>
                  </div>

                  <div class="btn-actions">
                     <button type="submit" class="btn save">
                        {{ showBtnUpdate ? 'Cập nhật' : 'Tạo mới' }}
                     </button>
                     <button type="reset" class="btn reset" @click="handleReset">Hủy</button>
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
   const showBtnUpdate = ref(false);
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
   const token = localStorage.getItem('token');
   const toast = ref({ message: '', type: '' });

   const rooms = ref([]);
   const form = ref({
      id: null,
      name: '',
      status: 'active',
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

      return result.isConfirmed; // Trả về true nếu người dùng bấm "Xác nhận"
   }

   // 📌 Lấy danh sách phòng
   async function getRooms() {
      try {
         const url = `${API_BASE_URL}/admin/rooms`;
         const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
         });
         rooms.value = response.data;
      } catch (error) {
         console.error('Lỗi khi lấy danh sách phòng:', error.message);
      }
   }

   // 📌 Tạo hoặc cập nhật phòng
   async function handleCreateUpdate() {
      // 🔍 Kiểm tra tên phòng có bị trùng không (chỉ khi tạo mới)
      const duplicate = rooms.value.find(
         (room) => room.name.trim().toLowerCase() === form.value.name.trim().toLowerCase() &&
               room.id !== form.value.id // tránh tự trùng khi đang update
      );

      if (duplicate) {
         showToast('Tên phòng đã tồn tại. Vui lòng nhập tên khác!', 'error');
         return;
      }

      const url = showBtnUpdate.value
         ? `${API_BASE_URL}/admin/rooms/${form.value.id}`
         : `${API_BASE_URL}/admin/rooms`;

      const method = showBtnUpdate.value ? 'put' : 'post';

      try {
         const response = await axios[method](url, form.value, {
            headers: {
               Authorization: `Bearer ${token}`,
               'Content-Type': 'application/json',
            },
         });

         console.log('response: ', response.data.message);

         showToast(response.data.message);
         await getRooms();
         handleReset();
         showForm.value = false;
      } catch (error) {
         showToast('Lỗi: ' + (error.response?.data?.message || error.message), 'error');
      }
   }

   // 📌 Sửa phòng
   function handleEdit(room) {
      form.value = { ...room };
      showBtnUpdate.value = true;
      showForm.value = true;
   }

   // 📌 Xóa phòng
   async function handleDelete(id) {
      // if (!confirm('Bạn có chắc muốn xóa phòng này?')) return;
      const confirmed = await showConfirm('Bạn có chắc muốn xoá phòng này?');
      
      if (!confirmed) {
         Swal.fire({
            icon: 'info',
            title: 'Đã huỷ xoá phòng',
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
         });
         return;
      }

      try {
         const response = await axios.delete(`${API_BASE_URL}/admin/rooms/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
         });
         showToast(response.data.message);
         await getRooms();
      } catch (error) {
         showToast('Lỗi xóa: ' + error.message, 'error');
      }
   }

   // 📌 Reset form
   function handleReset() {
      form.value = { id: null, name: '', status: 'active' };
      showBtnUpdate.value = false;
      showForm.value = false;
   }

   // 📌 Khi bấm nút "Tạo phòng mới"
   function onCreateClick() {
      handleReset();
      showForm.value = true;
   }

   // 📌 Hiển thị trạng thái phòng
   function getStatusName(status) {
      const map = {
         active: 'Đang hoạt động',
         closed: 'Đóng cửa',
         maintenance: 'Bảo trì',
      };
      return map[status] || status;
   }

   function getStatusClass(status) {
      return {
         'status-active': status === 'active',
         'status-closed': status === 'closed',
         'status-maintenance': status === 'maintenance',
      };
   }

   // 📌 Load dữ liệu ban đầu
   onMounted(() => {
      getRooms();
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

   /* Switch Buttons */
   .btn-box {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-bottom: 20px;
   }

   .switch-btn {
      background: #b8deb8;
      border: 2px solid #2b2b2b;
      padding: 8px 16px;
      font-size: 16px;
      border-radius: 15px;
      cursor: pointer;
      font-weight: bold;
      transition: 0.25s;
   }

   .switch-btn:hover {
      transform: translateY(-2px);
   }

   .switch-btn.active {
      background: #7ee07e;
      box-shadow: 0 0 10px rgba(0, 200, 0, 0.3);
   }

   /* Containers */
   .form-container,
   .table-container {
      background: white;
      padding: 22px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
   }

   /* Form */
   .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 16px;
   }

   .form-group {
      margin-bottom: 12px;
   }

   input,
   select {
      width: 100%;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid #c7c7c7;
      transition: 0.2s;
   }

   input:focus,
   select:focus {
      outline: none;
      box-shadow: 0 0 6px #7ee07e;
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
      padding: 12px;
   }

   .film-table td {
      padding: 10px;
      border-bottom: 1px solid #ececec;
   }

   .film-table tr:hover {
      background: #f7fff7;
   }

   /* Status Badge */
   .status-active {
      color: #27ae60;
      font-weight: bold;
   }

   .status-closed {
      color: #c0392b;
      font-weight: bold;
   }

   .status-maintenance {
      color: #f39c12;
      font-weight: bold;
   }

   /* Animations */
   .fade-enter-active,
   .fade-leave-active {
      transition: opacity 0.15s;
   }

   .fade-enter-from,
   .fade-leave-to {
      opacity: 0;
   }

   .slide-enter-active {
      animation: slideIn 0.15s ease;
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

      .btn-box {
         flex-direction: column;
      }

      .switch-btn {
         text-align: center;
      }

      .film-table {
         display: block;
         overflow-x: auto;
         white-space: nowrap;
      }
   }
</style>
