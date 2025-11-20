<template>
   <div class="container-fluid">
      <!-- Nút chuyển -->
      <div class="btn-box">
         <button class="switch-btn" :class="{ active: !showForm }" @click="switchToList">
            Danh sách lịch chiếu
         </button>
         <button class="switch-btn" :class="{ active: showForm }" @click="switchToForm">
            Thêm lịch chiếu
         </button>
      </div>

      <!-- ===================== DANH SÁCH LỊCH CHIẾU ===================== -->
      <div v-if="!showForm" class="container-fluid mt-3">
         <!-- Bộ lọc -->
         <div class="row d-flex g-3 mb-3 align-items-end">
            <div class="col-md-3">
               <label class="form-label fw-semibold">Phim</label>
               <v-select
                  v-model="selectedFilmId"
                  :options="[{ id: '', name: 'Tất cả phim' }, ...films]"
                  label="name"
                  :reduce="(film) => film.id"
                  placeholder="Chọn phim"
                  class="border-primary"
               />
            </div>
            <div class="col-md-3">
               <label class="form-label fw-semibold">Phòng</label>
               <v-select
                  v-model="selectedRoomId"
                  :options="[{ id: '', name: 'Tất cả phòng' }, ...rooms]"
                  label="name"
                  :reduce="(room) => room.id"
                  placeholder="Chọn phòng"
                  class="border-primary"
               />
            </div>
            <div class="col-md-3">
               <label class="form-label fw-semibold">Giờ chiếu</label>
               <v-select
                  v-model="selectedShowTimeId"
                  :options="[{ id: '', startTime: 'Tất cả giờ chiếu' }, ...showTimes]"
                  label="startTime"
                  :reduce="(time) => time.id"
                  placeholder="Chọn giờ chiếu"
                  class="border-primary"
               />
            </div>
            <div class="col-md-3">
               <label class="form-label fw-semibold">Ngày chiếu</label>
               <input type="date" v-model="selectedDate" class="form-control border-primary" />
            </div>
         </div>

         <!-- Bảng danh sách -->
         <div class="table-responsive" style="max-height: 500px; overflow-y: auto">
            <table class="table table-bordered table-hover w-100">
               <thead class="text-center table-success">
                  <tr>
                     <th>STT</th>
                     <th>Phim</th>
                     <th>Phòng</th>
                     <th>Giờ chiếu</th>
                     <th>Ngày chiếu</th>
                     <th>Thao tác</th>
                  </tr>
               </thead>
               <tbody class="text-center align-middle">
                  <tr v-for="(schedule, index) in paginatedSchedules" :key="schedule.id">
                     <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                     <td>{{ schedule.film?.name || '-' }}</td>
                     <td>{{ schedule.room?.name || '-' }}</td>
                     <td>{{ schedule.showTime?.startTime || '-' }}</td>
                     <td>{{ schedule.scheduleDate }}</td>
                     <td>
                        <button class="btn btn-primary btn-sm mx-1" @click="handleEdit(schedule)">
                           <i class="bi bi-pencil-square me-1"></i> Sửa
                        </button>
                        <button
                           class="btn btn-danger btn-sm mx-1"
                           @click="handleDelete(schedule.id)"
                        >
                           <i class="bi bi-trash3 me-1"></i> Xóa
                        </button>
                     </td>
                  </tr>
                  <tr v-if="filteredSchedules.length === 0">
                     <td colspan="6" class="text-center text-muted">Không có dữ liệu</td>
                  </tr>
               </tbody>
            </table>
         </div>

         <!-- Phân trang -->
         <nav class="d-flex justify-content-center mt-3">
            <ul class="pagination">
               <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button class="page-link" @click="prevPage">Trước</button>
               </li>
               <li
                  v-for="page in totalPages"
                  :key="page"
                  :class="{ active: currentPage === page }"
                  class="page-item"
               >
                  <button class="page-link" @click="goToPage(page)">{{ page }}</button>
               </li>
               <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <button class="page-link" @click="nextPage">Sau</button>
               </li>
            </ul>
         </nav>
      </div>

      <!-- ===================== FORM THÊM / SỬA ===================== -->
      <div v-else class="col-md-10 mx-auto mt-3">
         <!-- Form sửa đơn -->
         <div v-if="isEditing" class="col-md-8 mx-auto">
            <h4 class="text-center mb-3">Cập nhật lịch chiếu</h4>
            <form @submit.prevent="handleUpdate">
               <div class="mb-3">
                  <label class="form-label fw-semibold">Phim</label>
                  <v-select
                     v-model="form.filmId"
                     :options="films"
                     label="name"
                     :reduce="(film) => film.id"
                     placeholder="-- Chọn phim --"
                     class="border-primary"
                     required
                  />
               </div>
               <div class="mb-3">
                  <label class="form-label fw-semibold">Phòng</label>
                  <v-select
                     v-model="form.roomId"
                     :options="rooms"
                     label="name"
                     :reduce="(room) => room.id"
                     placeholder="-- Chọn phòng --"
                     class="border-primary"
                     required
                  />
               </div>
               <div class="mb-3">
                  <label class="form-label fw-semibold">Giờ chiếu</label>
                  <v-select
                     v-model="form.showTimeId"
                     :options="showTimes"
                     label="startTime"
                     :reduce="(time) => time.id"
                     placeholder="-- Chọn giờ chiếu --"
                     class="border-primary"
                     required
                  />
               </div>
               <div class="mb-3">
                  <label class="form-label fw-semibold">Ngày chiếu</label>
                  <input
                     type="date"
                     v-model="form.scheduleDate"
                     class="form-control border-primary"
                     required
                  />
               </div>
               <div class="d-flex justify-content-center gap-3">
                  <button type="submit" class="btn btn-success mx-2">
                     <i class="bi bi-check-circle me-1"></i> Cập nhật
                  </button>
                  <button type="button" class="btn btn-secondary mx-2" @click="resetForm">
                     <i class="bi bi-arrow-clockwise me-1"></i> Làm mới
                  </button>
                  <button type="button" class="btn btn-outline-dark mx-2" @click="switchToList">
                     <i class="bi bi-arrow-left-circle me-1"></i> Quay lại
                  </button>
               </div>
            </form>
         </div>

         <!-- Form thêm nhiều (grid) -->
         <div v-else class="col-12">
            <h4 class="text-center mb-3">Thêm lịch chiếu</h4>
            <div class="table-responsive">
               <table class="table table-bordered align-middle">
                  <thead class="table-warning text-center">
                     <tr>
                        <th style="width: 5%">STT</th>
                        <th style="width: 24%">Phim</th>
                        <th style="width: 16%">Phòng</th>
                        <th style="width: 16%">Giờ chiếu</th>
                        <th style="width: 16%">Ngày chiếu</th>
                        <th style="width: 10%">Trạng thái</th>
                        <th style="width: 10%">Xóa</th>
                     </tr>
                  </thead>
                  <tbody class="text-center align-middle">
                     <tr
                        v-for="(row, idx) in scheduleRows"
                        :key="idx"
                        :class="{ 'row-error': row.note }"
                     >
                        <td>{{ idx + 1 }}</td>
                        <td>
                           <v-select
                              v-model="row.filmId"
                              :options="films"
                              label="name"
                              :reduce="(f) => f.id"
                              placeholder="Chọn phim"
                              append-to-body
                              :popper-options="{ strategy: 'fixed' }"
                              class="small-select"
                              @update:modelValue="() => validateRow(idx)"
                              required
                           />
                        </td>
                        <td>
                           <v-select
                              v-model="row.roomId"
                              :options="rooms"
                              label="name"
                              :reduce="(r) => r.id"
                              placeholder="Chọn phòng"
                              class="small-select"
                              append-to-body
                              :popper-options="{ strategy: 'fixed' }"
                              @update:modelValue="() => validateRow(idx)"
                              required
                           />
                        </td>
                        <td>
                           <v-select
                              v-model="row.showTimeId"
                              :options="showTimes"
                              label="startTime"
                              :reduce="(t) => t.id"
                              placeholder="Chọn giờ"
                              class="small-select"
                              append-to-body
                              :popper-options="{ strategy: 'fixed' }"
                              @update:modelValue="() => validateRow(idx)"
                              required
                           />
                        </td>
                        <td>
                           <input
                              type="date"
                              v-model="row.scheduleDate"
                              class="form-control"
                              @change="() => validateRow(idx)"
                              required
                           />
                        </td>
                        <td class="text-center note-cell py-3">
                           <!-- Có lỗi → hiển thị icon cảnh báo + tooltip chi tiết -->
                           <div
                              style="cursor: pointer"
                              v-if="row.note"
                              class="text-danger fw-500 cursor-pointer d-inline-flex align-items-center gap-1"
                              @click="showErrorAlert(row.note)"
                              title="Nhấn để xem chi tiết lỗi"
                           >
                              <i class="bi bi-exclamation-triangle-fill fs-5 mx-2"></i>
                              <span class="d-none d-md-inline">Trùng lịch</span>
                           </div>

                           <!-- Thành công → icon tích xanh đẹp -->
                           <div
                              v-else
                              class="text-success fw-500 d-inline-flex align-items-center gap-1"
                              title="Thành công"
                           ></div>
                        </td>
                        <td class="text-center">
                           <button
                              type="button"
                              class="btn btn-outline-danger btn-sm"
                              @click="removeRow(idx)"
                           >
                              <i class="bi bi-trash3"></i>
                           </button>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>

            <div class="d-flex justify-content-between align-items-center mt-2">
               <div>
                  <button class="btn btn-primary mx-2" @click="addRow">
                     <i class="bi bi-plus-circle me-1"></i> Thêm dòng
                  </button>
                  <button class="btn btn-secondary ms-2" @click="clearAllRows">
                     <i class="bi bi-arrow-clockwise me-1"></i> Làm mới bảng
                  </button>
               </div>

               <div>
                  <button class="btn btn-success mx-2" @click="handleCreate">
                     <i class="bi bi-check2-all me-1"></i> Lưu tất cả
                  </button>
                  <button class="btn btn-outline-dark ms-2" @click="switchToList">
                     <i class="bi bi-arrow-left-circle me-1"></i> Quay lại
                  </button>
               </div>
            </div>
         </div>
      </div>

      <!-- TOAST -->
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
   import { ref, computed, onMounted, watch } from 'vue';
   import axios from 'axios';
   import vSelect from 'vue3-select';
   import 'vue3-select/dist/vue3-select.css';
   import Swal from 'sweetalert2';

   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
   const token = localStorage.getItem('token') || '';
   const CLEAN_TIME = 15;

   // ------------------- State -------------------
   const schedules = ref([]);
   const films = ref([]);
   const rooms = ref([]);
   const showTimes = ref([]);

   const showForm = ref(false);
   const isEditing = ref(false);
   const form = ref({ id: null, filmId: '', roomId: '', showTimeId: '', scheduleDate: '' });
   const toast = ref({ message: '', type: '' });

   // Filters
   const selectedFilmId = ref('');
   const selectedRoomId = ref('');
   const selectedShowTimeId = ref('');
   const selectedDate = ref('');

   // Pagination
   const currentPage = ref(1);
   const pageSize = 50;

   // Multi-add grid rows
   const scheduleRows = ref([
      { filmId: '', roomId: '', showTimeId: '', scheduleDate: '', note: '' },
   ]);

   // ------------------- Helpers -------------------
   function showToast(msg, type = 'success') {
      toast.value = { message: msg, type };
      setTimeout(() => (toast.value.message = ''), 3000);
   }

   function showErrorAlert(message) {
      Swal.fire({
         icon: 'error',
         title: "<span style='font-size:20px'>Lỗi</span>",
         html: `<div style="white-space:pre-line">${message || 'Đã xảy ra lỗi'}</div>`,
         confirmButtonText: 'OK',
      });
   }

   async function showConfirm(message) {
      const result = await Swal.fire({
         title: message,
         icon: 'warning',
         showCancelButton: true,
         confirmButtonText: 'Xác nhận',
         cancelButtonText: 'Huỷ',
         reverseButtons: true,
      });
      return result.isConfirmed;
   }

   // ------------------- Computed -------------------
   const filteredSchedules = computed(() =>
      schedules.value.filter((s) => {
         if (selectedFilmId.value && s.film?.id !== selectedFilmId.value) return false;
         if (selectedRoomId.value && s.room?.id !== selectedRoomId.value) return false;
         if (selectedShowTimeId.value && s.showTime?.id !== selectedShowTimeId.value) return false;
         if (selectedDate.value && s.scheduleDate !== selectedDate.value) return false;
         return true;
      })
   );

   const totalPages = computed(() =>
      Math.max(1, Math.ceil(filteredSchedules.value.length / pageSize))
   );

   const paginatedSchedules = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      return filteredSchedules.value.slice(start, start + pageSize);
   });

   // Reset page when filter changes
   watch(
      [selectedFilmId, selectedRoomId, selectedShowTimeId, selectedDate],
      () => (currentPage.value = 1)
   );

   // ------------------- Pagination -------------------
   function goToPage(p) {
      if (p >= 1 && p <= totalPages.value) currentPage.value = p;
   }
   function prevPage() {
      if (currentPage.value > 1) currentPage.value--;
   }
   function nextPage() {
      if (currentPage.value < totalPages.value) currentPage.value++;
   }

   // ------------------- API -------------------
   async function loadAllData() {
      try {
         const headers = { Authorization: `Bearer ${token}` };
         const [sc, f, r, t] = await Promise.all([
            axios.get(`${API_BASE_URL}/admin/schedules`, { headers }),
            axios.get(`${API_BASE_URL}/admin/films`, { headers }),
            axios.get(`${API_BASE_URL}/admin/rooms`, { headers }),
            axios.get(`${API_BASE_URL}/admin/show-times`, { headers }),
         ]);

         schedules.value = sc.data || [];
         films.value = f.data || [];
         rooms.value = r.data || [];
         showTimes.value = t.data || [];
      } catch (err) {
         console.error('Lỗi loadAllData:', err);
         showErrorAlert('Không thể load dữ liệu. Vui lòng thử lại.');
      }
   }

   // ------------------- CRUD -------------------
   function handleEdit(schedule) {
      showForm.value = true;
      isEditing.value = true;
      form.value = {
         id: schedule.id,
         filmId: schedule.film?.id || '',
         roomId: schedule.room?.id || '',
         showTimeId: schedule.showTime?.id || '',
         scheduleDate: schedule.scheduleDate || '',
      };
      window.scrollTo({ top: 0, behavior: 'smooth' });
   }

   async function handleDelete(id) {
      const ok = await showConfirm('Bạn có muốn xoá lịch chiếu này không?');
      if (!ok) {
         showToast('Đã huỷ xoá lịch chiếu', 'error');
         return;
      }
      try {
         const headers = { Authorization: `Bearer ${token}` };
         const res = await axios.delete(`${API_BASE_URL}/admin/schedules/delete/${id}`, {
            headers,
         });
         await loadAllData();
         showToast(res.data?.message || 'Xóa thành công', 'success');
      } catch (err) {
         console.error('Lỗi delete:', err);
         showErrorAlert('Xóa không thành công.');
      }
   }

   async function handleUpdate() {
      try {
         const headers = { Authorization: `Bearer ${token}` };
         const payload = {
            filmId: form.value.filmId,
            roomId: form.value.roomId,
            showTimeId: form.value.showTimeId,
            scheduleDate: form.value.scheduleDate,
         };
         const res = await axios.put(
            `${API_BASE_URL}/admin/schedules/update/${form.value.id}`,
            payload,
            { headers }
         );
         if (res.data?.status === 'success') {
            showToast(res.data.message || 'Cập nhật thành công', 'success');
            await loadAllData();
            switchToList();
         } else {
            showErrorAlert(res.data?.message || 'Cập nhật thất bại');
         }
      } catch (err) {
         console.error('Lỗi cập nhật:', err);
         showErrorAlert(err.response?.data?.message || 'Có lỗi khi cập nhật');
      }
   }

   // ------------------- Multi-add (Grid) -------------------
   function addRow() {
      scheduleRows.value.push({
         filmId: '',
         roomId: '',
         showTimeId: '',
         scheduleDate: '',
         note: '',
      });
   }

   function removeRow(index) {
      if (scheduleRows.value.length > 1) scheduleRows.value.splice(index, 1);
      else
         scheduleRows.value[0] = {
            filmId: '',
            roomId: '',
            showTimeId: '',
            scheduleDate: '',
            note: '',
         };
   }

   function clearAllRows() {
      scheduleRows.value = [{ filmId: '', roomId: '', showTimeId: '', scheduleDate: '', note: '' }];
   }

   function toMinutes(timeStr) {
      if (!timeStr) return 0;
      const [hour, minute] = timeStr.split(':').map(Number);
      return hour * 60 + minute;
   }

   function calculateEndTimeStr(startTimeStr, filmDurationMinutes = 0) {
      if (!startTimeStr) return '??:??';
      const [h, m] = startTimeStr.split(':').map(Number);

      // tổng phút: giờ bắt đầu + duration phim + CLEAN_TIME
      const total = h * 60 + m + (filmDurationMinutes || 0) + CLEAN_TIME;

      const hh = String(Math.floor(total / 60) % 24).padStart(2, '0'); // nếu qua ngày thì mod 24
      const mm = String(total % 60).padStart(2, '0');

      return `${hh}:${mm}`;
   }

   function validateRow(idx) {
      const row = scheduleRows.value[idx];
      row.note = '';

      // Nếu chưa điền đủ thông tin, bỏ qua
      if (!row.roomId || !row.showTimeId || !row.scheduleDate) return;

      const notes = [];

      // Lấy thời gian bắt đầu và kết thúc của row mới
      const showTimeNew = showTimes.value.find((t) => t.id === row.showTimeId);
      if (!showTimeNew) return;
      const startNew = toMinutes(showTimeNew.startTime);
      const filmNew = films.value.find((f) => f.id === row.filmId);
      const durationNew = filmNew ? filmNew.duration : 0;
      const endNew = startNew + durationNew + CLEAN_TIME;

      // 1️⃣ Kiểm tra xung đột với existing schedules
      schedules.value.forEach((s) => {
         if (s.room?.id === row.roomId && s.scheduleDate === row.scheduleDate) {
            const startExist = toMinutes(s.showTime.startTime);
            const endExist = startExist + (s.film?.duration || 0) + CLEAN_TIME;

            if (startNew < endExist && endNew > startExist) {
               const endExistStr = calculateEndTimeStr(
                  s.showTime?.startTime,
                  s.film?.duration || 0
               );
               notes.push(
                  `Xung đột với lịch có sẵn: Phim "${s.film?.name}", 
                  Phòng "${s.room?.name}", 
                  Giờ ${s.showTime?.startTime} - ${endExistStr}, 
                  Ngày ${s.scheduleDate}`
               );
            }
         }
      });

      // 2️⃣ Kiểm tra xung đột trong chính scheduleRows (ngoại trừ row này)
      scheduleRows.value.forEach((r, i) => {
         if (i === idx) return;
         if (r.roomId === row.roomId && r.scheduleDate === row.scheduleDate && r.showTimeId) {
            const showTimeOther = showTimes.value.find((t) => t.id === r.showTimeId);
            const startOther = showTimeOther ? toMinutes(showTimeOther.startTime) : 0;
            const filmOther = films.value.find((f) => f.id === r.filmId);
            const durationOther = filmOther ? filmOther.duration : 0;
            const endOther = startOther + durationOther + CLEAN_TIME;

            if (startNew < endOther && endNew > startOther) {
               const filmName = filmOther?.name || '???';
               const roomName = rooms.value.find((rm) => rm.id === r.roomId)?.name || '???';
               const startTime = showTimeOther?.startTime || '??:??';
               const date = r.scheduleDate || '??';
               const endTimeStr = calculateEndTimeStr(showTimeOther?.startTime, durationOther);
               notes.push(
                  `Xung đột với dòng ${i + 1} trong bảng: Phim "${filmName}", Phòng "${roomName}", Giờ ${startTime} - ${endTimeStr}, Ngày ${date}`
               );
            }
         }
      });

      if (notes.length > 0) row.note = notes.join('\n');
   }

   function validateAllRows() {
      let hasError = false;
      const errorMessages = [];

      scheduleRows.value.forEach((row, idx) => {
         validateRow(idx);

         const missingFields = [];

         if (!row.filmId) missingFields.push('Phim');
         if (!row.roomId) missingFields.push('Phòng chiếu');
         if (!row.showTimeId) missingFields.push('Suất chiếu');
         if (!row.scheduleDate) missingFields.push('Ngày chiếu');

         if (row.note || missingFields.length > 0) {
            hasError = true;

            const lineMsg = `Dòng ${idx + 1}: `;

            if (row.note) {
               errorMessages.push(`${lineMsg}. Lỗi: ${row.note}`);
            }

            if (missingFields.length > 0) {
               errorMessages.push(`${lineMsg}Thiếu: ${missingFields.join(', ')}`);
            }
         }
      });

      if (hasError) {
         const fullMessage = 
            "Không thể lưu vì còn lỗi sau:\n\n" +
            errorMessages.map(msg => `• ${msg}`).join('\n') +
            "\n\nVui lòng sửa hết các dòng trên trước khi lưu!";

         showErrorAlert(fullMessage);
         return false;
      }

      return true;
   }

   async function handleCreate() {
      if (!validateAllRows()) return;

      try {
         const headers = { Authorization: `Bearer ${token}` };
         const payload = scheduleRows.value.map((r) => ({
            filmId: r.filmId,
            roomId: r.roomId,
            showTimeId: r.showTimeId,
            scheduleDate: r.scheduleDate,
         }));

         console.log('payload: ', payload);

         const res = await axios.post(`${API_BASE_URL}/admin/schedules/bulk`, payload, {
            headers,
         });
         if (res.data?.status === 'success') {
            showToast(res.data.message || 'Thêm thành công', 'success');
            await loadAllData();
            clearAllRows();
            switchToList();
         } else {
            showErrorAlert(res.data?.message || 'Thêm thất bại');
         }
      } catch (err) {
         console.error('Lỗi submitGrid:', err);
         showErrorAlert(err.response?.data?.message || 'Có lỗi khi thêm nhiều lịch chiếu');
      }
   }

   // ------------------- Switch Form/List -------------------
   function switchToForm() {
      showForm.value = true;
      isEditing.value = false;
      clearAllRows();
   }
   function switchToList() {
      showForm.value = false;
      isEditing.value = false;
      resetForm();
   }

   // Reset form
   function resetForm() {
      form.value = { id: null, filmId: '', roomId: '', showTimeId: '', scheduleDate: '' };
   }

   // ------------------- Mounted -------------------
   onMounted(() => {
      loadAllData();
   });
</script>

<style scoped>
   .container-fluid {
      padding: 10px 15px;
      position: relative;
      z-index: 1;
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
   .small-select {
      min-width: 100px;
   }
   .row-error {
      background-color: #ffe5e5;
   }
   .note-cell {
      min-width: 150px;
   }
   .toast-custom {
      position: fixed;
      top: 20px;
      right: 20px;
      color: #fff;
      padding: 8px 15px;
      border-radius: 5px;
      z-index: 9999;
   }
   .fade-enter-active,
   .fade-leave-active {
      transition: opacity 0.3s;
   }
   .fade-enter-from,
   .fade-leave-to {
      opacity: 0;
   }

   .vs__dropdown-menu {
      z-index: 1050 !important;
   }

   .vs__dropdown-option,
   .vs__dropdown-toggle,
   .vs__search {
      z-index: inherit;
   }

   .table-responsive {
      max-height: 500px;
      overflow-y: auto;
      transform: translateZ(0);
      -webkit-overflow-scrolling: touch;
   }

   .table thead th {
      position: sticky;
      top: 0;
      background-color: #d1e7dd;
      z-index: 20 !important;
      box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
   }

   body.modal-open .vs__dropdown-menu,
   body .vs__dropdown-menu {
      z-index: 1050 !important;
   }

   .vs__dropdown-toggle {
      white-space: nowrap;
   }

   .v-select.drop-up .vs__dropdown-menu {
      bottom: 100%;
      top: auto !important;
   }
</style>
