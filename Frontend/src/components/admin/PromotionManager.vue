<template>
   <div class="container mt-3">
      <h3 class="fw-bold text-success mb-3">Quản lý Khuyến mại</h3>

      <!-- Danh sách hoặc Form -->
      <div v-if="!showForm">
         <button class="btn btn-success mb-3" @click="openForm(null)">Tạo mới</button>
         <PromotionList :promotions="promotions" @edit="openForm" @delete="deletePromotion" />
      </div>

      <div v-else>
         <PromotionForm
            v-if="showForm"
            :promotionData="selectedPromotion"
            @close="showForm = false"
            @saved="showForm = false"
            @reload="fetchPromotions"
         />
      </div>
   </div>
</template>

<script setup>
   import { ref, onMounted } from 'vue';
   import Swal from 'sweetalert2';
   import axios from 'axios';
   import PromotionList from './PromotionList.vue';
   import PromotionForm from './PromotionForm.vue';

   const API_PROMO = import.meta.env.VITE_API_BASE_URL + '/admin/promotions';

   const promotions = ref([]);
   const showForm = ref(false);
   const selectedPromotion = ref(null);

   // Lấy danh sách khuyến mại
   const fetchPromotions = async () => {
      try {
         const res = await axios.get(API_PROMO);
         promotions.value = res.data;
      } catch (err) {
         Swal.fire('Lỗi', 'Không tải được danh sách khuyến mại', 'error');
      }
   };

   // Mở form tạo mới hoặc edit
   const openForm = (promo) => {
      selectedPromotion.value = promo ? { ...promo } : null;
      showForm.value = true;
   };

   // Đóng form và quay lại danh sách
   const closeForm = () => {
      showForm.value = false;
      selectedPromotion.value = null;
   };

   // Sau khi lưu thành công
   const onSaved = () => {
      closeForm();
      fetchPromotions(); // tự động reload danh sách
   };

   // Xóa promotion
   const deletePromotion = async (id) => {
      const confirm = await Swal.fire({
         title: 'Xác nhận',
         text: 'Bạn có chắc muốn xóa khuyến mại này?',
         icon: 'warning',
         showCancelButton: true,
         confirmButtonText: 'Xóa',
         cancelButtonText: 'Hủy',
      });
      if (confirm.isConfirmed) {
         try {
            await axios.delete(`${API_PROMO}/${id}`);
            Swal.fire('Đã xóa!', '', 'success');
            fetchPromotions();
         } catch (err) {
            Swal.fire('Lỗi', 'Xóa không thành công', 'error');
         }
      }
   };

   onMounted(fetchPromotions);
</script>
