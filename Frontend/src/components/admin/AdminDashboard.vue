<template>
   <div class="admin-dashboard">
      <!-- Thanh breadcrumb cố định -->
      <div class="breadcrumb-bar">
         <div class="container-fluid">
            <nav aria-label="breadcrumb">
               <ol class="breadcrumb mb-0">
                  <li class="breadcrumb-item">
                     <a href="#" @click.prevent="goBack" class="breadcrumb-link">
                        <i class="bi bi-house-door me-2"></i> Trang Quản Trị
                     </a>
                  </li>
                  <li class="breadcrumb-item active" v-if="activeComponent" aria-current="page">
                     {{ activeTitle }}
                  </li>
               </ol>
            </nav>
         </div>
      </div>

      <!-- Nội dung chính -->
      <div class="main-content">
         <div class="container-fluid">
            <!-- Component động với hiệu ứng chuyển mượt -->
            <transition name="fade" mode="out-in">
               <component :is="currentComponent" @open="handleOpen" />
            </transition>
         </div>
      </div>
   </div>
</template>

<script setup>
   import { ref, computed, watch, onMounted } from 'vue';
   import { useRoute, useRouter } from 'vue-router';

   // Import các component quản trị
   import AdminIndex from '../admin/AdminIndex.vue';
   import FilmsManager from '../admin/FilmsManager.vue';
   import ShowTimes from '../admin/ShowTimes.vue';
   import RoomsManager from '../admin/RoomsManager.vue';
   import CategoryManager from '../admin/CategoryManager.vue';
   import ProductManager from './ProductsManager.vue';
   import SeatsManager from '../admin/SeatsManager.vue';
   import ScheduleManager from './ScheduleManager.vue';
   import PromotionManager from './PromotionManager.vue';
   import ProductPricePage from './ProductPricePage.vue';
   import PriceTicketManager from './PriceTicketManager.vue';
<<<<<<< HEAD
   import StaffManager from '../admin/StaffManager.vue';
=======
   import InvoiceHistory from './InvoiceHistory.vue';
   import Revenue from './Revenue.vue';
>>>>>>> 86080aef107570f6af750d9e617f7afc1b81a93d

   // Router
   const route = useRoute();
   const router = useRouter();

   // Component đang hoạt động (lấy từ query manage)
   const activeComponent = ref(null);

   const components = {
      AdminIndex,
      FilmsManager,
      ShowTimes,
      RoomsManager,
      CategoryManager,
      ProductManager,
      SeatsManager,
      ScheduleManager,
      PromotionManager,
      ProductPricePage,
      PriceTicketManager,
<<<<<<< HEAD
      StaffManager
=======
      InvoiceHistory,
      Revenue
>>>>>>> 86080aef107570f6af750d9e617f7afc1b81a93d
   };

   // Component hiện tại (mặc định là AdminIndex)
   const currentComponent = computed(() => {
      return activeComponent.value ? components[activeComponent.value] : AdminIndex;
   });

   // Tiêu đề hiển thị trên breadcrumb
   const activeTitle = computed(() => {
      const map = {
<<<<<<< HEAD
         FilmsManager: 'Phim',
         ShowTimes: 'Giờ chiếu',
         RoomsManager: 'Phòng chiếu',
         CategoryManager: 'Danh mục',
         ProductManager: 'Đồ ăn',
         SeatsManager: 'Ghế ngồi',
         ScheduleManager: 'Lịch chiếu',
         PromotionManager:'Khuyến mại',
         ProductPricePage: 'Giá sản phẩm',
         PriceTicketManager: 'Giá vé',
         StaffManager: 'Nhân viên'
=======
         FilmsManager: 'Quản Lý Phim',
         ShowTimes: 'Quản Lý Suất Chiếu',
         RoomsManager: 'Quản Lý Phòng Chiếu',
         CategoryManager: 'Quản Lý Thể Loại',
         ProductManager: 'Quản Lý Đồ Ăn & Đồ Uống',
         SeatsManager: 'Quản Lý Ghế Ngồi',
         ScheduleManager: 'Quản Lý Lịch Chiếu',
         PromotionManager: 'Quản Lý Khuyến Mãi',
         ProductPricePage: 'Quản Lý Giá Sản Phẩm',
         PriceTicketManager: 'Quản Lý Giá Vé',
         InvoiceHistory: 'Lịch Sử Hóa Đơn',
         Revenue: 'Thống kê doanh thu'
>>>>>>> 86080aef107570f6af750d9e617f7afc1b81a93d
      };
      return map[activeComponent.value] || '';
   });

   // Mở component con từ AdminIndex
   function handleOpen(componentName) {
      if (components[componentName]) {
         activeComponent.value = componentName;
      }
   }

   // Quay lại trang chủ admin
   function goBack() {
      activeComponent.value = null;
   }

   // Đồng bộ URL với query ?manage=
   onMounted(() => {
      const manage = route.query.manage;
      if (manage && components[manage]) {
         activeComponent.value = manage;
      }
   });

   watch(activeComponent, (newVal) => {
      router.replace({
         query: {
            ...route.query,
            manage: newVal || undefined,
         },
      });
   });
</script>

<style scoped>
   .admin-dashboard {
      min-height: 100vh;
      background-color: #f8fafc;
      display: flex;
      flex-direction: column;
      font-family: 'Segoe UI', sans-serif;
   }

   /* Thanh breadcrumb cố định phía trên */
   .breadcrumb-bar {
      background-color: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      padding: 18px 0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      position: sticky;
      top: 0;
      z-index: 1000;
   }

   .breadcrumb {
      background: transparent;
      padding: 0;
      margin: 0;
      font-size: 1.15rem;
   }

   .breadcrumb-link {
      color: #334155;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s ease;
   }

   .breadcrumb-link:hover {
      color: #1a6d36;
   }

   .breadcrumb-item.active {
      color: #1a6d36;
      font-weight: 700;
   }

   /* Nội dung chính */
   .main-content {
      flex: 1;
      padding: 40px 0;
      background-color: #f8fafc;
   }

   /* Hiệu ứng chuyển component mượt mà */
   .fade-enter-active,
   .fade-leave-active {
      transition: opacity 0.35s ease;
   }

   .fade-enter-from,
   .fade-leave-to {
      opacity: 0;
   }
</style>
