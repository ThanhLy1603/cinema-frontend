<template>
   <div class="container-fluid">
      <div class="admin-dashboard">
         <Header></Header>

         <main class="admin-main">
            <div class="breadcrumb">
               <span @click="goBack" class="link">Hạng mục quản lý</span>
               <template v-if="activeComponent">
                  <span> / </span>
                  <span>{{ activeTitle }}</span>
               </template>
            </div>

            <div class="content-area">
               <!-- Hiển thị component động -->
               <component :is="currentComponent" @open="handleOpen" />
            </div>
         </main>

         <footer class="footer">footer</footer>
      </div>
   </div>
</template>

<script setup>
   import { ref, computed } from 'vue';
   import Header from '../header/Header.vue';
   import AdminIndex from '../admin/AdminIndex.vue';
   import FilmsManager from '../admin/FilmsManager.vue';
   import ShowTimes from '../admin/ShowTimes.vue';
   import RoomsManager from '../admin/RoomsManager.vue';
   import CategoryManager from '../admin/CategoryManager.vue';
   import ProductManager from './ProductsManager.vue';
   import SeatsManager from '../admin/SeatsManager.vue';
   import ScheduleManager from './ScheduleManager.vue';

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
      ScheduleManager
   };

   // Component hiện tại hiển thị (nếu null → AdminIndex)
   const currentComponent = computed(() => {
      return activeComponent.value ? components[activeComponent.value] : AdminIndex;
   });

   // Map component sang tiêu đề hiển thị
   const activeTitle = computed(() => {
      const map = {
         FilmsManager: 'Phim',
         ShowTimes: 'Giờ chiếu',
         RoomsManager: 'Phòng chiếu',
         CategoryManager: 'Danh mục',
         ProductManager: 'Đồ ăn',
         SeatsManager: 'Ghế ngồi',
         ScheduleManager: 'Lịch chiếu'
      };
      return map[activeComponent.value] || '';
   });

   // Mở component con
   function handleOpen(componentName) {
      activeComponent.value = componentName;
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
</style>
