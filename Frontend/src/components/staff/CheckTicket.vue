<template>
   <div class="container-fluid">
      <!-- Phần quét QR -->
      <div class="flex-grow-1 d-flex flex-column align-items-center justify-content-center p-4">
         <div
            id="qr-reader"
            class="border rounded shadow bg-white"
            style="width: 100%; max-width: 500px"
         ></div>
         <p class="mt-4 text-muted">Hướng camera vào mã QR trên vé khách hàng</p>
         <button class="btn btn-outline-secondary mt-3" @click="resetScanner">Quét lại</button>
      </div>

      <!-- Modal hiển thị thông tin hóa đơn -->
      <div ref="detailModalElement" class="modal fade" tabindex="-1">
         <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
               <div class="modal-header justify-content-center position-relative">
                  <h5 class="modal-title">
                     Thông tin hoá đơn
                     <span v-if="detailInvoice?.id"> #{{ detailInvoice.id }} </span>
                  </h5>
                  <button type="button" class="btn-close" @click="closeModal"></button>
               </div>

               <div class="modal-body" v-if="detailInvoice">
                  <!-- THÔNG TIN CHUNG -->
                  <div class="row mb-3">
                     <div class="col-sm-4 fw-bold">Trạng thái:</div>
                     <div class="col-sm-8">
                        <span class="badge" :class="getStatusClass(detailInvoice.status)">
                           {{ getStatusText(detailInvoice.status) }}
                        </span>
                     </div>
                  </div>
                  <div class="row mb-3">
                     <div class="col-sm-4 fw-bold">Người tạo:</div>
                     <div class="col-sm-8">{{ detailInvoice.createdBy }}</div>
                  </div>
                  <div class="row mb-3">
                     <div class="col-sm-4 fw-bold">Khách hàng:</div>
                     <div class="col-sm-8">{{ detailInvoice.customerName }}</div>
                  </div>
                  <div class="row mb-3">
                     <div class="col-sm-4 fw-bold">Số điện thoại:</div>
                     <div class="col-sm-8">{{ detailInvoice.customerPhone }}</div>
                  </div>
                  <div class="row mb-3">
                     <div class="col-sm-4 fw-bold">Ngày tạo:</div>
                     <div class="col-sm-8">{{ formatDateTime(detailInvoice.createdAt) }}</div>
                  </div>
                  <div class="row mb-3">
                     <div class="col-sm-4 fw-bold">Tổng tiền gốc:</div>
                     <div class="col-sm-8">{{ detailInvoice.totalAmount }} ₫</div>
                  </div>
                  <div class="row mb-3">
                     <div class="col-sm-4 fw-bold">Giảm giá:</div>
                     <div class="col-sm-8">{{ detailInvoice.discountAmount }} ₫</div>
                  </div>
                  <div class="row mb-4 border-top pt-3">
                     <div class="col-sm-4 fw-bold text-danger">Thành tiền:</div>
                     <div class="col-sm-8 text-danger fw-bold">
                        {{ detailInvoice.finalAmount }} ₫
                     </div>
                  </div>

                  <!-- DANH SÁCH ĐỒ ĂN VÀ ĐỒ UỐNG -->
                  <div v-if="detailInvoice.products && detailInvoice.products?.length > 0">
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
                              <tr v-for="(product, index) in detailInvoice.products" :key="index">
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

                  <!-- DANH SÁCH VÉ -->
                  <div v-if="detailInvoice.tickets && detailInvoice.tickets.length > 0">
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
                           <tbody class="text-center">
                              <tr
                                 v-for="ticket in detailInvoice.tickets"
                                 :key="ticket.seatPosition"
                              >
                                 <td class="text-center">{{ ticket.movieName }}</td>
                                 <td class="text-center">{{ ticket.showTime }}</td>
                                 <td class="text-center">{{ ticket }}</td>
                                 <td class="text-center">{{ ticket.roomName }}</td>
                                 <td class="fw-bold">{{ ticket.seatPosition }}</td>
                                 <td class="text-center">{{ ticket.price.toLocaleString('vi-VN') }} ₫</td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  </div>

                  <div class="container d-flex justify-content-center mt-4">
                     <img v-if="qrImage" :src="qrImage" width="220" alt="QR Code" />
                  </div>
               </div>

               <div class="modal-footer">
                  <div class="container-fluid">
                     <div class="row">
                        <div class="col text-end">
                           <button
                              v-if="detailInvoice?.status !== 'CHECKED_IN'"
                              type="button"
                              class="btn btn-success"
                              @click="confirmQRCode"
                           >
                              Xác nhận
                           </button>
                        </div>

                        <div class="col text-start">
                           <button type="button" class="btn btn-secondary" @click="closeModal">
                              Đóng
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
   import axios from 'axios';
   import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
   import { Html5Qrcode } from 'html5-qrcode';
   import QRCode from 'qrcode';
   import { Modal } from 'bootstrap';

   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

   const scannedResult = ref(null);
   const detailInvoice = ref(null);
   const qrImage = ref(null);
   let html5QrCode = null;
   let isScannerRunning = false;
   let modalInstance = null;
   const detailModalElement = ref(null);

   async function onScanSuccess(decodedText) {
      if (!isScannerRunning) return;

      isScannerRunning = false;
      scannedResult.value = decodedText; // Ẩn phần quét QR

      // Dừng scanner ngay lập tức
      if (html5QrCode) {
         await html5QrCode.stop();
      }

      try {
         const response = await axios.post(`${API_BASE_URL}/staff/qr/scan`, {
            qrCode: decodedText,
         });

         // Giả sử API trả về object hóa đơn đầy đủ
         scannedResult.value = response.data;
         detailInvoice.value = scannedResult.value.invoice;

         const qrString = detailInvoice.value?.qrCodes?.[0]?.qrCode;

         if (!qrString) {
            qrImage.value = null;
            console.warn('Hóa đơn chưa có QR code');
         } else {
            qrImage.value = await QRCode.toDataURL(qrString, {
               width: 300,
               margin: 2,
            });
         }

         // Mở modal sau khi có dữ liệu
         await nextTick(); // Đảm bảo DOM đã render modal
         if (!modalInstance) {
            modalInstance = new Modal(detailModalElement.value);
         }
         modalInstance.show();

         console.log('detail invoice: ', detailInvoice.value);
      } catch (error) {
         console.error('Lỗi khi quét QR:', error);
         resetScanner();
      }
   }

   async function confirmQRCode() {
      try {
         const qrCode = detailInvoice.value.qrCodes?.[0]?.qrCode;

         const response = await axios.post(`${API_BASE_URL}/staff/qr/confirm`, {
            qrCode: qrCode,
         });

         closeModal();
         console.log('message: ', response.data.message);
      } catch (error) {
         console.error('Lỗi khi soát vé: ', error.message);
      }
   }

   async function startScanner() {
      if (html5QrCode && isScannerRunning) return;

      html5QrCode = new Html5Qrcode('qr-reader');

      try {
         await html5QrCode.start(
            { facingMode: 'environment' },
            {
               fps: 10,
               qrbox: { width: 300, height: 300 },
            },
            onScanSuccess
         );
         isScannerRunning = true;
      } catch (err) {
         console.error('Không thể mở camera:', err.message);
      }
   }

   async function resetScanner() {
      scannedResult.value = null;
      detailInvoice.value = null;

      if (modalInstance) modalInstance.hide();

      if (html5QrCode && isScannerRunning) {
         try {
            await html5QrCode.stop();
         } catch (_) {}
         isScannerRunning = false;
      }

      await startScanner();
   }

   function closeModal() {
      if (modalInstance) {
         modalInstance.hide();
      }

      resetScanner();
   }

   function getStatusText(status) {
      const statusTexts = {
         PENDING: 'Chờ soát vé',
         PAID: 'Đã thanh toán',
         CHECKED_IN: 'Đã sử dụng',
      };

      return statusTexts[status] || status;
   }

   function getStatusClass(status) {
      const classes = {
         PENDING: 'bg-warning',
         PAID: 'bg-success',
         CHECKED_IN: 'bg-danger',
      };

      return classes[status] || 'bg-secondary';
   }

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

   onMounted(() => {
      startScanner();
   });

   onBeforeUnmount(async () => {
      if (html5QrCode && isScannerRunning) {
         try {
            await html5QrCode.stop();
         } catch (_) {}
      }

      if (modalInstance) {
         modalInstance.dispose();
      }
   });
</script>

<style scoped>
   #qr-reader {
      width: 100%;
      aspect-ratio: 1/1;
   }
</style>
