<template>
   <div class="container-fluid">
      <div class="admin-dashboard">
         <!-- Header -->
         <Header />

         <main class="admin-main">
            <!-- Breadcrumb -->
            <div class="breadcrumb">
               <span @click="goBack" class="link">Hạng mục quản lý</span>
               <template v-if="activeComponent">
                  <span> / </span>
                  <span>{{ activeTitle }}</span>
               </template>
            </div>

            <!-- Component động -->
            <div class="content-area">
               <component :is="currentComponent" @open="handleOpen" />
            </div>
         </main>

         <footer class="footer">footer</footer>
      </div>
   </div>
</template>

<script setup>
   import { ref, computed, watch, onMounted } from 'vue';
   import { useRoute, useRouter } from 'vue-router';

   // Import component
   import Header from '../header/Header.vue';
   import AdminIndex from '../admin/AdminIndex.vue';
   import FilmsManager from '../admin/FilmsManager.vue';
   import ShowTimes from '../admin/ShowTimes.vue';
   import RoomsManager from '../admin/RoomsManager.vue';
   import CategoryManager from '../admin/CategoryManager.vue';
   import ProductManager from './ProductsManager.vue';
   import SeatsManager from '../admin/SeatsManager.vue';
   import ScheduleManager from './ScheduleManager.vue';
   import ProductPricePage from './ProductPricePage.vue';

   // Router
   const route = useRoute();
   const router = useRouter();

   // Component đang hoạt động
   const activeComponent = ref(null);

   // Danh sách component có thể gọi
   const components = {
      AdminIndex,
      FilmsManager,
      ShowTimes,
      RoomsManager,
      CategoryManager,
      ProductManager,
      SeatsManager,
      ScheduleManager,
      ProductPricePage,
   };

   // Component hiện tại hiển thị
   const currentComponent = computed(() => {
      return activeComponent.value ? components[activeComponent.value] : AdminIndex;
   });

   // Map component sang tiêu đề breadcrumb
   const activeTitle = computed(() => {
      const map = {
         FilmsManager: 'Phim',
         ShowTimes: 'Giờ chiếu',
         RoomsManager: 'Phòng chiếu',
         CategoryManager: 'Danh mục',
         ProductManager: 'Đồ ăn',
         SeatsManager: 'Ghế ngồi',
         ScheduleManager: 'Lịch chiếu',
         ProductPricePage: 'Giá sản phẩm',
      };
      return map[activeComponent.value] || '';
   });

   // Khi load trang, lấy component từ query `manage`
   onMounted(() => {
      const manage = route.query.manage;
      if (manage && components[manage]) {
         activeComponent.value = manage;
      } else {
         activeComponent.value = null; // Mặc định trang AdminIndex
      }
   });

   // Khi activeComponent thay đổi → cập nhật query `manage` trên URL
   watch(activeComponent, (newVal) => {
      router.replace({ query: { manage: newVal || undefined } });
   });

   // Mở component con
   function handleOpen(componentName) {
      if (components[componentName]) {
         activeComponent.value = componentName;
      }
   }

   // Quay lại trang chính
   function goBack() {
      activeComponent.value = null;
   }
</script>

<style scoped>
   .admin-dashboard {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
   }

   .admin-main {
      flex: 1;
      background: #fff;
      padding: 20px;
   }

   .breadcrumb {
      font-size: 18px;
      font-weight: bold;
      color: #1a6d36;
      border-left: 5px solid #1a6d36;
      padding-left: 10px;
      margin-bottom: 25px;
   }

   .breadcrumb .link {
      cursor: pointer;
      color: #1a6d36;
   }

   .footer {
      background: #cbd5e1;
      text-align: center;
      padding: 20px;
      font-size: 32px;
      font-weight: bold;
   }

   .content-area {
      min-height: 400px;
   }
</style>
