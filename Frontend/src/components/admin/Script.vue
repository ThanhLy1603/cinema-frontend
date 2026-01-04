<template>
   <div class="container-fluid">
      <h1 class="my-4">Lịch sử giao dịch</h1>

      <div class="table-responsive">
         <table class="table table-bordered table-hover align-middle">
            <thead class="table-warning text-center">
               <tr>
                  <th>STT</th>
                  <th>Người tạo</th>
                  <th>Tên khách hàng</th>
                  <th>Số điện thoại</th>
                  <th>Tổng tiền</th>
                  <th>Ngày tạo</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
               </tr>
            </thead>
            <tbody class="text-center">
               <tr v-for="(invoice, index) in invoices" :key="invoice.invoiceId">
                  <td>{{ index + 1 }}</td>
                  <td>{{ invoice.createdBy }}</td>
                  <td>{{ invoice.customerName || '-' }}</td>
                  <td>{{ invoice.customerPhone || '-' }}</td>
                  <td>{{ invoice.finalAmount.toLocaleString('vi-VN') }} ₫</td>
                  <td>{{ formatDate(invoice.createdAt) }}</td>
                  <td>
                     <span class="badge" :class="getStatusClass(invoice.status)">
                        {{ getStatusText(invoice.status) }}
                     </span>
                  </td>
                  <td>
                     <!-- Button kích hoạt modal bằng data-bs attributes -->
                     <button
                        type="button"
                        class="btn btn-primary btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#detailModal"
                        @click="loadInvoiceDetail(invoice.invoiceId)"
                     >
                        Xem chi tiết
                     </button>
                  </td>
               </tr>
            </tbody>
         </table>
      </div>

      <!-- Modal chi tiết hóa đơn -->
      <div
         class="modal fade"
         id="detailModal"
         tabindex="-1"
         aria-labelledby="detailModalLabel"
         aria-hidden="true"
      >
         <div class="modal-dialog modal-xl modal-dialog-scrollable">
            <div class="modal-content">
               <div class="modal-header">
                  <h5 class="modal-title" id="detailModalLabel">
                     Chi tiết hóa đơn
                     <span v-if="selectedInvoice?.invoiceId">
                        #{{ selectedInvoice.invoiceId.substring(0, 8) }}...
                     </span>
                  </h5>
                  <button
                     type="button"
                     class="btn-close"
                     data-bs-dismiss="modal"
                     aria-label="Close"
                  ></button>
               </div>

               <div class="modal-body" v-if="selectedInvoice">
                  <!-- Thông tin chung -->
                  <div class="row mb-3">
                     <div class="col-sm-4 fw-bold">Trạng thái:</div>
                     <div class="col-sm-8">
                        <span class="badge" :class="getStatusClass(selectedInvoice.status)">
                           {{ getStatusText(selectedInvoice.status) }}
                        </span>
                     </div>
                  </div>
                  <div class="row mb-3">
                     <div class="col-sm-4 fw-bold">Người tạo:</div>
                     <div class="col-sm-8">{{ selectedInvoice.createdBy }}</div>
                  </div>
                  <div class="row mb-3">
                     <div class="col-sm-4 fw-bold">Ngày tạo:</div>
                     <div class="col-sm-8">{{ formatDate(selectedInvoice.createdAt) }}</div>
                  </div>
                  <div class="row mb-3">
                     <div class="col-sm-4 fw-bold">Tổng tiền gốc:</div>
                     <div class="col-sm-8">
                        {{ selectedInvoice.totalAmount.toLocaleString('vi-VN') }} ₫
                     </div>
                  </div>
                  <div class="row mb-3">
                     <div class="col-sm-4 fw-bold">Giảm giá:</div>
                     <div class="col-sm-8">
                        {{ selectedInvoice.discountAmount.toLocaleString('vi-VN') }} ₫
                     </div>
                  </div>
                  <div class="row mb-4 border-top pt-3">
                     <div class="col-sm-4 fw-bold text-danger">Thành tiền:</div>
                     <div class="col-sm-8 text-danger fw-bold">
                        {{ selectedInvoice.finalAmount.toLocaleString('vi-VN') }} ₫
                     </div>
                  </div>

                  <!-- Danh sách vé -->
                  <h5 class="mt-4">Danh sách vé ({{ selectedInvoice.tickets.length }})</h5>
                  <div class="table-responsive">
                     <table class="table table-sm table-bordered">
                        <thead class="table-light text-center">
                           <tr>
                              <th>Phim</th>
                              <th>Giờ chiếu</th>
                              <th>Phòng</th>
                              <th>Ghế</th>
                              <th>Giá vé</th>
                              <th>Đã sử dụng</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr v-for="ticket in selectedInvoice.tickets" :key="ticket.seatPosition">
                              <td>{{ ticket.movieName }}</td>
                              <td class="text-center">{{ ticket.showTime }}</td>
                              <td class="text-center">{{ ticket.roomName }}</td>
                              <td class="text-center fw-bold">{{ ticket.seatPosition }}</td>
                              <td class="text-end">{{ ticket.price.toLocaleString('vi-VN') }} ₫</td>
                              <td class="text-center">
                                 <span
                                    class="badge"
                                    :class="ticket.isUsed ? 'bg-success' : 'bg-secondary'"
                                 >
                                    {{ ticket.isUsed ? 'Có' : 'Chưa' }}
                                 </span>
                              </td>
                           </tr>
                        </tbody>
                     </table>
                  </div>

                  <!-- Mã QR Codes -->
                  <h5
                     class="mt-5"
                     v-if="selectedInvoice.qrCodes && selectedInvoice.qrCodes.length > 0"
                  >
                     Mã QR vé ({{ selectedInvoice.qrCodes.length }} mã)
                  </h5>
                  <div
                     class="row g-4 justify-content-start"
                     v-if="selectedInvoice.qrCodes && selectedInvoice.qrCodes.length > 0"
                  >
                     <div
                        class="col-md-4 col-lg-3 text-center"
                        v-for="(qrData, index) in selectedInvoice.qrCodes"
                        :key="index"
                     >
                        <p class="mb-2">
                           <strong>QR #{{ index + 1 }}</strong>
                        </p>
                        <qrcode-canvas
                           :value="qrData"
                           :size="200"
                           level="H"
                           class="border p-3 bg-white shadow-sm d-inline-block rounded"
                        />
                        <p class="mt-2 small text-muted text-truncate" style="max-width: 200px">
                           {{ qrData }}
                        </p>
                     </div>
                  </div>

                  <div v-else class="alert alert-info mt-4">Không có mã QR cho hóa đơn này.</div>
               </div>

               <div class="modal-body text-center text-muted" v-else>
                  <div class="spinner-border" role="status">
                     <span class="visually-hidden">Đang tải...</span>
                  </div>
                  <p class="mt-3">Đang tải chi tiết hóa đơn...</p>
               </div>

               <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                     Đóng
                  </button>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
   import axios from 'axios';
   import { ref, onMounted } from 'vue';
   import { QrcodeCanvas } from 'qrcode.vue'; // Thư viện QR code

   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

   const invoices = ref([]);
   const selectedInvoice = ref(null);

   async function getInvoices() {
      try {
         const response = await axios.get(`${API_BASE_URL}/admin/invoices`);
         invoices.value = response.data;
      } catch (error) {
         console.error('Lỗi khi lấy danh sách hóa đơn:', error);
         alert('Không thể tải danh sách hóa đơn');
      }
   }

   // Hàm này được gọi khi click nút "Xem chi tiết" → load dữ liệu trước khi modal hiện
   async function loadInvoiceDetail(invoiceId) {
      selectedInvoice.value = null; // Hiển thị loading
      try {
         const response = await axios.get(`${API_BASE_URL}/admin/invoices/${invoiceId}`);
         selectedInvoice.value = response.data;
      } catch (error) {
         console.error('Lỗi khi lấy chi tiết hóa đơn:', error);
         alert('Không thể tải chi tiết hóa đơn');
         selectedInvoice.value = null;
      }
   }

   // Helper functions
   function formatDate(isoString) {
      if (!isoString) return '-';
      return new Date(isoString).toLocaleString('vi-VN', {
         day: '2-digit',
         month: '2-digit',
         year: 'numeric',
         hour: '2-digit',
         minute: '2-digit',
         second: '2-digit',
      });
   }

   function getStatusText(status) {
      const map = {
         PENDING: 'Chờ thanh toán',
         PAID: 'Đã thanh toán',
         CANCELLED: 'Đã hủy',
      };
      return map[status] || status;
   }

   function getStatusClass(status) {
      const classes = {
         PENDING: 'bg-warning text-dark',
         PAID: 'bg-success',
         CANCELLED: 'bg-danger',
      };
      return classes[status] || 'bg-secondary';
   }

   onMounted(async () => {
      await getInvoices();
   });
</script>

<style scoped>
   .badge {
      font-size: 0.9em;
   }
</style>
