<template>
   <div class="container-fluid">
      <div class="page-container">
         <!-- Navigation Buttons -->
         <div class="d-flex justify-content-center align-items-center my-3">
            <button class="switch-btn mx-2" :class="{ active: !showForm }" @click="showForm = false">
               Danh sách phim
            </button>

            <button class="switch-btn mx-2" :class="{ active: showForm }" @click="showForm = true">
               Tạo phim mới
            </button>
         </div>

         <!-- Film List -->
         <transition name="fade">
            <div v-if="!showForm" class="table-container">
               <table class="film-table table-bordered table-hover">
                  <thead class="align-center text-center">
                     <tr>
                        <th>STT</th>
                        <th>Poster</th>
                        <th>Trailer</th>
                        <th>Tên phim</th>
                        <th>Thể loại</th>
                        <th>Quốc gia</th>
                        <th>Ngày phát hành</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                     </tr>
                  </thead>

                  <tbody class="text-center align-cebt">
                     <tr v-for="(film, index) in films" :key="index">
                        <td>{{index + 1}}</td>
                        <td><img :src="posterSrc(film.poster)" /></td>
                        <td>
                           <a
                              :href="trailerSrc(film.trailer)"
                              target="_blank"
                              style="display: block; margin-bottom: 8px; color: blue"
                           >
                              Nhấn để xem trailer
                           </a>
                        </td>
                        <td>{{ film.name }}</td>
                        <td>{{ getCategoryNames(film) }}</td>
                        <td>{{ film.country }}</td>
                        <td>{{ film.releaseDate }}</td>
                        <td>{{ getStatusName(film.status) }}</td>
                        <td>
                           <button class="btn btn-sm btn-primary mx-2" @click="handleEdit(film)">
                              Sửa
                           </button>
                           <button class="btn btn-sm btn-danger mx-2" @click="handleDelete(film.id)">Xóa</button>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </transition>

         <!-- Film Form -->
         <transition name="slide">
            <div v-if="showForm" class="form-container">
               <form @submit.prevent="handleCreateUpdate" class="film-form">
                  <div class="form-grid">
                     <div class="form-group">
                        <label class="fw-bold">Tên phim</label>
                        <input
                           type="text"
                           v-model="form.name"
                           placeholder="Nhập tên phim..."
                           required
                        />
                     </div>

                     <div class="form-group">
                        <label>Quốc gia</label>
                        <input
                           type="text"
                           v-model="form.country"
                           placeholder="Nhập quốc gia..."
                           required
                        />
                     </div>

                     <div class="form-group">
                        <label>Đạo diễn</label>
                        <input
                           type="text"
                           v-model="form.director"
                           placeholder="Nhập tên đạo diễn..."
                           required
                        />
                     </div>

                     <div class="form-group">
                        <label>Ngày phát hành</label>
                        <input type="date" v-model="form.releaseDate" required />
                     </div>
                  </div>

                  <div class="form-group">
                     <label>Diễn viên</label>
                     <textarea
                        v-model="form.actor"
                        placeholder="Danh sách diễn viên..."
                        required
                     ></textarea>
                  </div>

                  <div class="form-group">
                     <label>Mô tả</label>
                     <textarea
                        v-model="form.description"
                        placeholder="Mô tả nội dung phim..."
                        required
                     ></textarea>
                  </div>

                  <div class="form-group">
                     <label>Thời lượng (phút)</label>
                     <input
                        type="number"
                        v-model="form.duration"
                        min="1"
                        placeholder="VD: 120"
                        required
                     />
                  </div>

                  <div class="form-group">
                     <label>Thể loại phim</label>
                     <div class="checkbox-group">
                        <label v-for="category in categories" :key="category">
                           <input type="checkbox" :value="category" v-model="form.categories"/>
                           {{ category.name }}
                        </label>
                     </div>
                  </div>

                  <div class="form-group">
                     <label>Poster</label>

                     <!-- Nếu đang edit và chưa chọn file mới thì preview ảnh cũ -->
                     <div v-if="form.poster && typeof form.poster === 'string'">
                        <img
                           :src="posterSrc(form.poster)"
                           alt="Poster"
                           style="width: 120px; border-radius: 8px; margin-bottom: 8px"
                        />
                     </div>

                     <input type="file" @change="handlePoster" accept="image/*"/>
                  </div>

                  <div class="form-group">
                     <label>Trailer</label>

                     <!-- Link xem trailer nếu có -->
                     <div v-if="form.trailer && typeof form.trailer === 'string'">
                        <a
                           :href="trailerSrc(form.trailer)"
                           target="_blank"
                           style="display: block; margin-bottom: 8px; color: blue"
                        >
                           Xem trailer hiện tại
                        </a>
                     </div>

                     <input type="file" @change="handleTrailer" accept="video/*"/>
                  </div>

                  <div class="form-group">
                     <label>Trạng thái</label>
                     <select v-model="form.status" required>
                        <option value="upcoming">Sắp chiếu</option>
                        <option value="active">Đang chiếu</option>
                        <option value="inactive">Đã kết thúc</option>
                     </select>
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
   const VIDEO_URL = import.meta.env.VITE_VIDEO_URL;

   const films = ref([]);
   const categories = ref([]);
   const showBtnUpdate = ref(false);
   const token = localStorage.getItem("token");
   const toast = ref({ message: '', type: '' });

   const filmId = ref();

   const form = ref({
      name: '',
      country: '',
      director: '',
      releaseDate: '',
      actor: '',
      description: '',
      duration: '',
      status: '',
      poster: null,
      trailer: null,
      categories: [],
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


   async function getFilms() {
      try {
         const url = `${API_BASE_URL}/admin/films`;
         const response = await axios.get(url);

         films.value = response.data;

         console.log('Films: ', films.value);
      } catch (error) {
         showToast('Lỗi khi tải danh sách phim', 'error');
      }
   }

   async function getCategories() {
      try {
         const url = `${API_BASE_URL}/admin/films/categories`;

         const response = await axios.get(url);

         categories.value = await response.data;

         console.log('Categories: ', categories.value);
      } catch (error) {
         showToast('Lỗi khi tải danh sách thể loại phim', 'error');
      }
   }

   function getCategoryNames(film) {
      return film.categories?.length
         ? film.categories.map((category) => category.name).join(', ')
         : 'Đang cập nhật...';
   }

   function getStatusName(status) {
      const statusMap = {
         active: 'Đang chiếu',
         upcoming: 'Sắp chiếu',
         inactive: 'Đã ngừng chiếu',
      };

      return statusMap[status] || 'Không xác định';
   }

   async function handleCreateUpdate() {
      const duplicate = films.value.find(
         (film) => film.name.trim().toLowerCase() === form.value.name.trim().toLowerCase() &&
               film.id !== filmId.value // tránh báo trùng khi đang sửa
      );

      if (duplicate) {
         showToast('Tên phim đã tồn tại. Vui lòng nhập tên khác!', 'error');
         return;
      }

      const formData = new FormData();
      formData.append('name', form.value.name);
      formData.append('country', form.value.country);
      formData.append('director', form.value.director);
      formData.append('releaseDate', form.value.releaseDate);
      formData.append('actor', form.value.actor);
      formData.append('description', form.value.description);
      formData.append('duration', form.value.duration);
      formData.append('status', form.value.status);

      const categoriesId = form.value.categories.map(category => category.id);
      formData.append("categoriesIdJSON", JSON.stringify(categoriesId));

      if (form.value.poster instanceof File) {
         formData.append('poster', form.value.poster);
      }

      if (form.value.trailer instanceof File) {
         formData.append('trailer', form.value.trailer);
      }

      if (!showBtnUpdate.value) {
         if (!form.value.poster) {
            showToast('Bạn chưa tải poster phim', 'error');
            return;
         }

         if (!form.value.trailer) {
            showToast('Bạn chưa tải trailer phim', 'error');
            return;
         }

         try {
            const url = `${API_BASE_URL}/admin/films/create`;
            const response = await axios.post(
               url, 
               formData,
            {
               headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'multipart/form-data',
               },
            });

            getFilms();

            showToast(response.data.messagem, 'success');
         } catch (error) {
            showToast('Lỗi khi thêm phim mới', 'error');
         }
      } else {
         try {
            const url = `${API_BASE_URL}/admin/films/update/${filmId.value}`;

            const response = await axios.put(url, formData, 
               {
                  headers: {
                     Authorization: `Bearer ${token}`,
                     'Content-Type': 'multipart/form-data',             
                  }
               }
            );
            getFilms();
            showToast(response.data.message, 'success');
         } catch (error) {
            showToast("Lỗi khi sửa thông tin phim: ", 'error');
         }
      }
   }

   async function handleDelete(id) {
      const confirmed = await showConfirm('Bạn có chắc muốn xoá phim này?');
      
      if (!confirmed) {
         Swal.fire({
            icon: 'info',
            title: 'Đã huỷ xoá phim',
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
         });
         return;
      }

      try {
         const url = `${API_BASE_URL}/admin/films/delete/${id}`;
         const response = await axios.delete(url, {
            headers: { Authorization: `Bearer ${token}` },
         });

         await getFilms();

         showToast(response.data.message || 'Xoá phim thành công');
      } catch (error) {
         Swal.fire({
            icon: 'error',
            title: 'Xoá phim thất bại!',
            text: error.message,
         });
      }
   }


   function handleEdit(film) {
      showBtnUpdate.value = true;
      showForm.value = true;
      form.value = { ...film };
      filmId.value = film.id;
   }

   function handleReset() {
      form.value = {
         name: '',
         country: '',
         director: '',
         releaseDate: '',
         actor: '',
         description: '',
         duration: '',
         status: '',
         categories: [],
         poster: null,
         trailer: null,
         categories: [],
      };

      filmId.value = '';
      showBtnUpdate.value = false;
   }

   function handlePoster(event) {
      const file = event.target.files[0];
      if (file) {
         form.value.poster = file;
      }
   }

   function handleTrailer(event) {
      const file = event.target.files[0];
      if (file) {
         form.value.trailer = file;
      }
   }

   function posterSrc(poster) {
      return IMAGE_URL + poster;
   }

   function trailerSrc(trailer) {
      return VIDEO_URL + trailer;
   }

   onMounted(() => {
      getFilms();
      getCategories();
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
