<template>
   <div class="container-fluid">
      <h1 class="text-center my-5">Lịch sử giao dịch</h1>

      <!-- BẢNG DANH SÁCH HOÁ ĐƠN -->
      <div class="container-fluid">
         <table class="table table-bordered table-hover">
            <thead class="align-center text-center">
               <tr class="table-warning">
                  <th>STT</th>
                  <th>Người tạo</th>
                  <th>Tên khách hàng</th>
                  <th>Số điện thoại</th>
                  <th>Tổng tiền</th>
                  <th>Ngày tạo</th>
                  <th>Trạng thái</th>
                  <th></th>
               </tr>
            </thead>

            <tbody class="text-center align-cebt">
               <tr v-for="(invoice, index) in invoices" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ invoice.createdBy }}</td>
                  <td>{{ invoice.customerName || '-' }}</td>
                  <td>{{ invoice.customerPhone || '-' }}</td>
                  <td>{{ invoice.finalAmount.toLocaleString('en-EN') }}</td>
                  <td>{{ formatDateTime(invoice.createAt) }}</td>
                  <td>
                     <span class="badge" :class="getStatusClass(invoice.status)">
                        {{ getStatusText(invoice.status) }}
                     </span>
                  </td>
                  <td>
                     <button class="btn btn-primary btn-sm" @click="openDetailModal(invoice.id)">
                        Xem chi tiết
                     </button>
                  </td>
               </tr>
            </tbody>
         </table>
      </div>

      <!-- MODAL CHI TIẾT HOÁ ĐƠN -->
      <div ref="detailModalElement" class="modal fade" tabindex="-1">
         <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable w-50">
            <div class="modal-content">
               <div class="modal-header position-relative">
                  <h5 class="modal-title w-100 text-center">
                     Thông tin hoá đơn
                     <span v-if="selectedInvoice?.invoiceId">
                        #{{ selectedInvoice.invoiceId }}
                     </span>
                  </h5>
                  <button class="btn-close" @click="modal.hide()"></button>
               </div>

               <div class="modal-body" v-if="selectedInvoice">
                  <!-- THÔNG TIN CHUNG -->
                  <div class="row mb-3">
                     <div class="col-sm-4 fw-fold">Trạng thái:</div>
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
                     <div class="col-sm-4 fw-bold">Khách hàng:</div>
                     <div class="col-sm-8">{{ selectedInvoice.customerName }}</div>
                  </div>
                  <div class="row mb-3">
                     <div class="col-sm-4 fw-bold">Số điện thoại:</div>
                     <div class="col-sm-8">{{ selectedInvoice.customerPhone }}</div>
                  </div>
                  <div class="row mb-3">
                     <div class="col-sm-4 fw-bold">Ngày tạo:</div>
                     <div class="col-sm-8">{{ formatDateTime(selectedInvoice.createdAt) }}</div>
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

                  <!-- DANH SÁCH ĐỒ ĂN VÀ ĐỒ UỐNG -->
                  <div v-if="selectedInvoice.products?.length > 0">
                     <h5 class="mt-4">Danh sách đồ ăn và đồ uống</h5>
                     <div class="table-responsive">
                        <table class="table table-sm table-bordered">
                           <thead class="table-light text-center">
                              <tr>
                                 <th>#</th>
                                 <th>Tên sản phẩm</th>
                                 <th>Số lượng</th>
                                 <th>Giá</th>
                                 <th>Thành tiền</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr
                                 v-for="(product, index) in selectedInvoice.products"
                                 :key="index"
                              >
                                 <td class="text-center">{{ index + 1 }}</td>
                                 <td>{{ product.productName }}</td>
                                 <td class="text-center">{{ product.quantity }}</td>
                                 <td class="text-end">{{ product.price.toLocaleString() }} đ</td>
                                 <td class="text-end">
                                    {{ (product.price * product.quantity).toLocaleString() }} đ
                                 </td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  </div>

                  <!-- THÔNG TIN GIÁ VÉ -->
                  <div v-if="selectedInvoice.tickets?.length > 0">
                     <h5 class="mt-4">Danh sách vé</h5>
                     <div class="table-responsive">
                        <table class="table table-sm table-bordered">
                           <thead class="table-light text-center">
                              <tr>
                                 <th>Phim</th>
                                 <th>Giờ chiếu</th>
                                 <th>Ngày chiếu</th>
                                 <th>Phòng</th>
                                 <th>Ghế</th>
                                 <th>Giá vé</th>
                              </tr>
                           </thead>
                           <tbody class="text-center align-center">
                              <tr v-for="ticket in selectedInvoice.tickets" :key="ticket.seatPosition">
                                 <td>{{ ticket.movieName }}</td>
                                 <td class="text-center">{{ ticket.showTime }}</td>
                                 <td class="text-center">{{ ticket.scheduleDate }}</td>
                                 <td class="text-center">{{ ticket.roomName }}</td>
                                 <td class="text-center fw-bold">{{ ticket.seatPosition }}</td>
                                 <td class="text-center">
                                    {{ ticket.price.toLocaleString('vi-VN') }} ₫
                                 </td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  </div>

                  <div class="container d-flex justify-content-center">
                     <img v-if="qrImage" :src="qrImage" width="220" alt="" />
                  </div>
               </div>

               <div class="modal-footer">
                  <button 
                     type="button" 
                     class="btn btn-secondary" 
                     data-bs-dismiss="modal"
                     @click="modal.hide()"
                  >
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
   import { ref, onMounted, nextTick } from 'vue';
   import QRCode from 'qrcode';
   import { Modal } from 'bootstrap';

   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

   const invoices = ref([]);
   const selectedInvoice = ref(null);
   const qrImage = ref(null);
   const detailModalElement = ref(null);
   let modal = null;

   function formatDateTime(dateString) {
      if (!dateString) return '';

      const date = new Date(dateString);

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();

      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
   }

   async function getInvoices() {
      try {
         const response = await axios.get(`${API_BASE_URL}/staff/sell-history`);
         invoices.value = response.data;

         console.log('invoices: ', invoices.value);
      } catch (error) {
         console.error('Lỗi khi lấy dữ liệu từ invoices: ', error.message);
      }
   }

   async function openDetailModal(invoiceId) {
      try {
         const response = await axios.get(`${API_BASE_URL}/staff/sell-history/${invoiceId}`);
         selectedInvoice.value = response.data;

         const qrString = selectedInvoice.value.qrCodes?.[0]?.qrCode;

         if (!qrString) {
            qrImage.value = null;
            console.warn('Hóa đơn chưa có QR code');
         } else {
            qrImage.value = await QRCode.toDataURL(qrString, {
               width: 300,
               margin: 2,
            });
         }

         await nextTick();

         if (!modal) {
            modal = new Modal(detailModalElement.value, {
               backdrop: 'static',
               keyboard: false,
            });
         }

         modal.show();

         console.log('selected invoice: ', selectedInvoice.value);
      } catch (error) {
         console.error('Lỗi khi lấy chi tiết hoá đơn: ', error.message);
         alert('Không thể tải chi tiết hoá đơn');
      }
   }

   function getStatusText(status) {
      const statusTexts = {
         PENDING: 'Chờ soát vé',
         PAID: 'Đã thanh toán',
         CHECKED_IN: 'Đã sử dụng'
      };

      return statusTexts[status] || status;
   }

   function getStatusClass(status) {
      const classes = {
         PENDING: 'bg-warning',
         PAID: 'bg-success',
         CHECKED_IN: 'bg-danger'
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
