<template>
   <div class="container-fluid">
      <!-- Nút chuyển -->
      <div class="btn-box">
         <button class="switch-btn" :class="{ active: !showForm }" @click="switchToList">
            Danh sách giá vé
         </button>
         <button class="switch-btn" :class="{ active: showForm }" @click="switchToForm">
            Thêm giá vé
         </button>
      </div>

      <!-- ===================== DANH SÁCH GIÁ VÉ ===================== -->
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
                  :append-to-body="true"
                  class="border-primary"
               />
            </div>
            <div class="col-md-3">
               <label class="form-label fw-semibold">Loại ghế</label>
               <v-select
                  v-model="selectedSeatTypeId"
                  :options="[{ id: '', name: 'Tất cả loại ghế' }, ...seatTypes]"
                  label="name"
                  :reduce="(seatType) => seatType.id"
                  append-to-body
                  placeholder="Chọn loại ghế"
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
                  :append-to-body="true"
                  class="border-primary"
               />
            </div>
            <div class="col-md-3">
               <label class="form-label fw-semibold">Loại ngày</label>
               <v-select
                  v-model="selectedDayType"
                  :options="[{ value: '', label: 'Tất cả loại ngày' }, ...dayTypeOptions]"
                  label="label"
                  :reduce="(d) => d.value"
                  placeholder="Chọn loại ngày"
                  :append-to-body="true"
                  class="border-primary"
               />
            </div>
         </div>

         <!-- Bảng danh sách -->
         <div class="table-responsive" style="max-height: 550px; overflow-y: auto">
            <table class="table table-bordered table-hover w-100">
               <thead class="text-center table-success">
                  <tr>
                     <th>STT</th>
                     <th>Phim</th>
                     <th>Loại ghế</th>
                     <th>Giờ chiếu</th>
                     <th>Loại ngày</th>
                     <th>Giá vé</th>
                     <th>Ngày bắt đầu</th>
                     <th>Ngày kết thúc</th>
                     <th>Thao tác</th>
                  </tr>
               </thead>
               <tbody class="text-center align-middle">
                  <tr v-for="(pt, index) in paginatedPriceTickets" :key="pt.id">
                     <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                     <td>{{ pt.film?.name || '-' }}</td>
                     <td>{{ pt.seatType?.name || '-' }}</td>
                     <td>{{ pt.showTime?.startTime || '-' }}</td>
                     <td>{{ dayTypeLabel(pt.dayType) }}</td>
                     <td>{{ Number(pt.price).toLocaleString('vi-VN') }} ₫</td>
                     <td>{{ pt.startDate }}</td>
                     <td>{{ pt.endDate || 'Đang áp dụng' }}</td>
                     <td>
                        <button class="btn btn-primary btn-sm mx-1" @click="handleEdit(pt)">
                           <i class="bi bi-pencil-square me-1"></i> Sửa
                        </button>
                        <button class="btn btn-danger btn-sm mx-1" @click="handleDelete(pt.id)">
                           <i class="bi bi-trash3 me-1"></i> Xóa
                        </button>
                     </td>
                  </tr>
                  <tr v-if="filteredPriceTickets.length === 0">
                     <td colspan="9" class="text-center text-muted">Không có dữ liệu</td>
                  </tr>
               </tbody>
            </table>
         </div>

         <!-- Phân trang -->
         <div class="pagination-wrapper mt-4">
            <div class="pagination-info mb-2 text-center text-muted small">
               Hiển thị {{ (currentPage - 1) * pageSize + 1 }} -
               {{ Math.min(currentPage * pageSize, filteredPriceTickets.length) }}
               trong tổng số {{ filteredPriceTickets.length }} bản ghi
            </div>

            <nav class="d-flex justify-content-center">
               <ul class="pagination pagination-sm mb-0">
                  <!-- Nút First -->
                  <li class="page-item" :class="{ disabled: currentPage === 1 }">
                     <button
                        class="page-link"
                        @click="currentPage = 1"
                        :disabled="currentPage === 1"
                     >
                        <i class="bi bi-chevron-double-left"></i>
                     </button>
                  </li>

                  <!-- Nút Prev -->
                  <li class="page-item" :class="{ disabled: currentPage === 1 }">
                     <button
                        class="page-link"
                        @click="prevPage"
                        :disabled="currentPage === 1"
                     >
                        <i class="bi bi-chevron-left"></i>
                     </button>
                  </li>

                  <!-- Các trang (chỉ hiện tối đa 7 nút) -->
                  <template v-for="page in visiblePages" :key="page">
                     <li class="page-item" :class="{ active: currentPage === page }">
                        <button
                           class="page-link"
                           @click="goToPage(page)"
                           :class="{ 'bg-primary border-primary': currentPage === page }"
                        >
                           {{ page }}
                        </button>
                     </li>
                  </template>

                  <!-- Nút Next -->
                  <li
                     class="page-item"
                     :class="{ disabled: currentPage === totalPages }"
                  >
                     <button
                        class="page-link"
                        @click="nextPage"
                        :disabled="currentPage === totalPages"
                     >
                        <i class="bi bi-chevron-right"></i>
                     </button>
                  </li>

                  <!-- Nút Last -->
                  <li
                     class="page-item"
                     :class="{ disabled: currentPage === totalPages }"
                  >
                     <button
                        class="page-link"
                        @click="currentPage = totalPages"
                        :disabled="currentPage === totalPages"
                     >
                        <i class="bi bi-chevron-double-right"></i>
                     </button>
                  </li>
               </ul>
            </nav>
         </div>
      </div>

      <!-- ===================== FORM THÊM / SỬA GIÁ VÉ ===================== -->
      <div v-else class="col-md-10 mx-auto mt-3">
         <!-- Form sửa -->
         <div v-if="isEditing" class="col-md-8 mx-auto">
            <h4 class="text-center mb-3">Cập nhật giá vé</h4>
            <form @submit.prevent="handleUpdate">
               <div class="mb-3">
                  <label class="form-label fw-semibold">Loại ngày</label>
                  <v-select
                     v-model="form.dayType"
                     :options="dayTypeOptions"
                     label="label"
                     :reduce="(d) => d.value"
                     required
                  />
               </div>
               <div class="mb-3">
                  <label class="form-label fw-semibold">Giá vé (VNĐ)</label>
                  <input
                     type="number"
                     v-model.number="form.price"
                     class="form-control border-primary"
                     required
                     min="0"
                     step="1000"
                  />
               </div>
               <div class="mb-3">
                  <label class="form-label fw-semibold">Ngày bắt đầu áp dụng</label>
                  <input
                     type="date"
                     v-model="form.startDate"
                     class="form-control border-primary"
                     required
                  />
               </div>
               <div class="mb-3">
                  <label class="form-label fw-semibold">Ngày kết thúc (để trống = vĩnh viễn)</label>
                  <input type="date" v-model="form.endDate" class="form-control border-primary" />
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
            <h4 class="text-center mb-3">Thêm giá vé</h4>
            <div class="table-responsive">
               <table class="table table-bordered align-middle">
                  <thead class="table-warning text-center">
                     <tr>
                        <th style="width: 5%">STT</th>
                        <th>Phim</th>
                        <th>Loại ghế</th>
                        <th>Giờ chiếu</th>
                        <th>Loại ngày</th>
                        <th>Giá vé (VNĐ)</th>
                        <th>Ngày bắt đầu</th>
                        <th>Ngày kết thúc</th>
                        <th>Trạng thái</th>
                        <th>Xóa</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr
                        v-for="(row, idx) in priceTicketRows"
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
                              @update:modelValue="validateRow(idx)"
                              required
                           />
                        </td>
                        <td>
                           <v-select
                              v-model="row.seatTypeId"
                              :options="seatTypes"
                              label="name"
                              :reduce="(s) => s.id"
                              @update:modelValue="validateRow(idx)"
                              required
                           />
                        </td>
                        <td>
                           <v-select
                              v-model="row.showTimeId"
                              :options="showTimes"
                              label="startTime"
                              :reduce="(t) => t.id"
                              @update:modelValue="validateRow(idx)"
                              required
                           />
                        </td>
                        <td>
                           <v-select
                              v-model="row.dayType"
                              :options="dayTypeOptions"
                              label="label"
                              :reduce="(d) => d.value"
                              @update:modelValue="validateRow(idx)"
                              required
                           />
                        </td>
                        <td>
                           <input
                              type="number"
                              v-model.number="row.price"
                              class="form-control"
                              @change="validateRow(idx)"
                              required
                              min="0"
                              step="1000"
                           />
                        </td>
                        <td>
                           <input
                              type="date"
                              v-model="row.startDate"
                              class="form-control"
                              @change="validateRow(idx)"
                              required
                           />
                        </td>
                        <td>
                           <input
                              type="date"
                              v-model="row.endDate"
                              class="form-control"
                              @change="validateRow(idx)"
                           />
                        </td>
                        <td class="text-center note-cell py-3">
                           <div
                              v-if="row.note"
                              class="text-danger fw-500 cursor-pointer"
                              @click="showErrorAlert(row.note)"
                              title="Nhấn để xem chi tiết lỗi"
                           >
                              <i class="bi bi-exclamation-triangle-fill fs-5 mx-2"></i>
                              <span class="d-none d-md-inline">Lỗi</span>
                           </div>
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
   import { ref, computed, onMounted } from 'vue';
   import axios from 'axios';
   import vSelect from 'vue3-select';
   import 'vue3-select/dist/vue3-select.css';
   import Swal from 'sweetalert2';

   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
   const token = localStorage.getItem('token') || '';

   // Dữ liệu
   const priceTickets = ref([]);
   const films = ref([]);
   const seatTypes = ref([]);
   const showTimes = ref([]);

   // State chung
   const showForm = ref(false);
   const isEditing = ref(false);
   const toast = ref({ message: '', type: '' });

   // Form sửa
   const form = ref({
      id: null,
      filmId: '',
      seatTypeId: '',
      showTimeId: '',
      dayType: '',
      price: null,
      startDate: '',
      endDate: '',
   });

   // Bộ lọc danh sách
   const selectedFilmId = ref('');
   const selectedSeatTypeId = ref('');
   const selectedShowTimeId = ref('');
   const selectedDayType = ref('');

   // Phân trang
   const currentPage = ref(1);
   const pageSize = 50;
   const totalPages = computed(() => {
      const length = filteredPriceTickets.value.length;
      return length === 0 ? 1 : Math.ceil(length / pageSize);
   });
   const paginatedPriceTickets = computed(() => {
      const list = filteredPriceTickets.value;
      if (!list || list.length === 0) return [];
      const start = (currentPage.value - 1) * pageSize;
      return list.slice(start, start + pageSize);
   });

   const visiblePages = computed(() => {
      const total = totalPages.value;
      const current = currentPage.value;
      const delta = 2; // số trang hiển thị mỗi bên
      const range = [];

      const rangeWithDots = [];

      for (let i = 1; i <= total; i++) {
         if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
            range.push(i);
         }
      }

      let last = 0;
      for (const i of range) {
         if (last && i - last > 1) {
            rangeWithDots.push('...');
         }
         rangeWithDots.push(i);
         last = i;
      }

      return rangeWithDots.filter((p) => p !== '...')?.length > 7
         ? range.slice(0, 7).concat(['...'], [total])
         : rangeWithDots;
   });

   // Grid thêm nhiều
   const priceTicketRows = ref([
      {
         filmId: '',
         seatTypeId: '',
         showTimeId: '',
         dayType: '',
         price: null,
         startDate: '',
         endDate: '',
         note: '',
      },
   ]);

   const dayTypeOptions = [
      { value: 'WEEKDAY', label: 'Ngày thường' },
      { value: 'WEEKEND', label: 'Cuối tuần' },
      { value: 'HOLIDAY', label: 'Ngày lễ' },
      { value: 'SPECIAL', label: 'Đặc biệt' },
   ];

   const dayTypeLabel = (type) =>
      dayTypeOptions.find((d) => d.value === type)?.label || type || '-';

   // Bộ lọc
   const filteredPriceTickets = computed(() => {
      if (!Array.isArray(priceTickets.value)) return [];

      return priceTickets.value.filter((pt) => {
         if (selectedFilmId.value && pt.film?.id !== selectedFilmId.value) return false;
         if (selectedSeatTypeId.value && pt.seatType?.id !== selectedSeatTypeId.value) return false;
         if (selectedShowTimeId.value && pt.showTime?.id !== selectedShowTimeId.value) return false;
         if (selectedDayType.value && pt.dayType !== selectedDayType.value) return false;
         return true;
      });
   });

   // Phân trang
   function goToPage(p) {
      if (p >= 1 && p <= totalPages.value) currentPage.value = p;
   }
   function prevPage() {
      if (currentPage.value > 1) currentPage.value--;
   }
   function nextPage() {
      if (currentPage.value < totalPages.value) currentPage.value++;
   }

   // Load dữ liệu
   async function loadAllData() {
      try {
         const headers = { Authorization: `Bearer ${token}` };
         const [ptRes, fRes, stRes, tRes] = await Promise.all([
            axios.get(`${API_BASE_URL}/admin/price-tickets`, { headers }),
            axios.get(`${API_BASE_URL}/admin/films`, { headers }),
            axios.get(`${API_BASE_URL}/admin/seats/seat-types`, { headers }),
            axios.get(`${API_BASE_URL}/admin/show-times`, { headers }),
         ]);
         priceTickets.value = ptRes.data || [];
         films.value = fRes.data || [];
         seatTypes.value = stRes.data || [];
         showTimes.value = tRes.data || [];
      } catch (err) {
         showErrorAlert('Không thể tải dữ liệu');
      }
   }

   // Validate 1 dòng
   function validateRow(idx) {
      const row = priceTicketRows.value[idx];
      row.note = '';
      const notes = [];

      if (
         !row.filmId ||
         !row.seatTypeId ||
         !row.showTimeId ||
         !row.dayType ||
         !row.price ||
         !row.startDate
      )
         return;

      if (row.price <= 0) notes.push('Giá vé phải lớn hơn 0');
      if (row.endDate && row.startDate && row.endDate < row.startDate)
         notes.push('Ngày kết thúc phải ≥ ngày bắt đầu');

      const sameKey = (a, b) =>
         a.filmId === b.filmId &&
         a.seatTypeId === b.seatTypeId &&
         a.showTimeId === b.showTimeId &&
         a.dayType === b.dayType &&
         a.startDate === b.startDate;

      // Trùng với DB
      if (priceTickets.value.some((s) => sameKey(s, row))) {
         const filmName = films.value.find((f) => f.id === row.filmId)?.name || '???';
         const seatName = seatTypes.value.find((s) => s.id === row.seatTypeId)?.name || '???';
         notes.push(
            `Trùng cấu hình giá vé từ ngày ${row.startDate}: Phim "${filmName}", Loại ghế "${seatName}"`
         );
      }

      // Trùng trong bảng
      priceTicketRows.value.forEach((r, i) => {
         if (i !== idx && sameKey(r, row)) notes.push(`Trùng với dòng ${i + 1} trong bảng`);
      });

      if (notes.length > 0) row.note = notes.join('\n');
   }

   // Validate tất cả trước khi lưu
   function validateAllRows() {
      let hasError = false;
      const errorMessages = [];

      priceTicketRows.value.forEach((row, idx) => {
         validateRow(idx);
         const missing = [];
         if (!row.filmId) missing.push('Phim');
         if (!row.seatTypeId) missing.push('Loại ghế');
         if (!row.showTimeId) missing.push('Giờ chiếu');
         if (!row.dayType) missing.push('Loại ngày');
         if (!row.price || row.price <= 0) missing.push('Giá vé');
         if (!row.startDate) missing.push('Ngày bắt đầu');

         if (missing.length > 0 || row.note) {
            hasError = true;
            if (missing.length > 0)
               errorMessages.push(`Dòng ${idx + 1}: Thiếu: ${missing.join(', ')}`);
            if (row.note) errorMessages.push(`Dòng ${idx + 1}: ${row.note}`);
         }
      });

      if (hasError) {
         showErrorAlert(
            'Không thể lưu vì còn lỗi sau:\n\n' + errorMessages.map((m) => `• ${m}`).join('\n')
         );
         return false;
      }
      return true;
   }

   // CRUD
   async function handleCreate() {
      if (!validateAllRows()) return;
      try {
         const headers = { Authorization: `Bearer ${token}` };
         const payload = priceTicketRows.value.map((r) => ({
            filmId: r.filmId,
            seatTypeId: r.seatTypeId,
            showTimeId: r.showTimeId,
            dayType: r.dayType,
            price: r.price,
            startDate: r.startDate,
            endDate: r.endDate || null,
         }));

         await axios.post(`${API_BASE_URL}/admin/price-tickets/bulk`, payload, { headers });
         showToast('Thêm giá vé thành công');
         await loadAllData();
         clearAllRows();
         switchToList();
      } catch (err) {
         showErrorAlert(err.response?.data?.message || 'Lỗi khi thêm giá vé');
      }
   }

   async function handleUpdate() {
      try {
         const headers = { Authorization: `Bearer ${token}` };
         const payload = {
            filmId: form.value.filmId,
            seatTypeId: form.value.seatTypeId,
            showTimeId: form.value.showTimeId,
            dayType: form.value.dayType,
            price: form.value.price,
            startDate: form.value.startDate,
            endDate: form.value.endDate || null,
         };
         await axios.put(`${API_BASE_URL}/admin/price-tickets/update/${form.value.id}`, payload, {
            headers,
         });
         showToast('Cập nhật thành công');
         await loadAllData();
         switchToList();
      } catch (err) {
         showErrorAlert(err.response?.data?.message || 'Cập nhật thất bại');
      }
   }

   async function handleDelete(id) {
      const ok = await showConfirm('Bạn có chắc chắn xóa giá vé này?');
      if (!ok) return;
      try {
         await axios.delete(`${API_BASE_URL}/admin/price-tickets/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
         });
         showToast('Xóa thành công');
         await loadAllData();
      } catch (err) {
         showErrorAlert('Xóa thất bại');
      }
   }

   function handleEdit(pt) {
      showForm.value = true;
      isEditing.value = true;
      form.value = {
         id: pt.id,
         filmId: pt.film?.id || '',
         seatTypeId: pt.seatType?.id || '',
         showTimeId: pt.showTime?.id || '',
         dayType: pt.dayType,
         price: pt.price,
         startDate: pt.startDate,
         endDate: pt.endDate || '',
      };
   }

   // Grid helpers
   function addRow() {
      priceTicketRows.value.push({
         filmId: '',
         seatTypeId: '',
         showTimeId: '',
         dayType: '',
         price: null,
         startDate: '',
         endDate: '',
         note: '',
      });
   }

   function removeRow(idx) {
      if (priceTicketRows.value.length > 1) {
         priceTicketRows.value.splice(idx, 1);
      } else {
         priceTicketRows.value[0] = {
            filmId: '',
            seatTypeId: '',
            showTimeId: '',
            dayType: '',
            price: null,
            startDate: '',
            endDate: '',
            note: '',
         };
      }
   }

   function clearAllRows() {
      priceTicketRows.value = [
         {
            filmId: '',
            seatTypeId: '',
            showTimeId: '',
            dayType: '',
            price: null,
            startDate: '',
            endDate: '',
            note: '',
         },
      ];
   }

   // Switch
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
   function resetForm() {
      form.value = {
         id: null,
         filmId: '',
         seatTypeId: '',
         showTimeId: '',
         dayType: '',
         price: null,
         startDate: '',
         endDate: '',
      };
   }

   // Toast & Alert
   function showToast(message, type = 'success') {
      toast.value = { message, type };
      setTimeout(() => (toast.value = { message: '', type: '' }), 3000);
   }
   function showErrorAlert(message) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: message, confirmButtonText: 'OK' });
   }
   function showConfirm(message) {
      return Swal.fire({
         icon: 'warning',
         title: 'Xác nhận',
         text: message,
         showCancelButton: true,
         confirmButtonText: 'Có',
         cancelButtonText: 'Không',
      }).then((r) => r.isConfirmed);
   }

   onMounted(loadAllData);
</script>

<!-- Style giữ nguyên như cũ của bạn -->
<style scoped>
   /* (giữ nguyên toàn bộ style bạn đã có) */
   .container-fluid {
      padding: 10px 15px;
      position: relative;
      z-index: 1;
   }
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

   .table thead th {
      position: sticky;
      top: 0;
      background-color: #d1e7dd;
      z-index: 20 !important;
      box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
   }
</style>
