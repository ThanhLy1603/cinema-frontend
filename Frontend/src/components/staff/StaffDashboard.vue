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
            <component :is="currentComponent" v-bind="listeners" />
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
   import StaffIndex from '../staff/StaffIndex.vue';
   import SellTicket from '../staff/SellTicket.vue';
   import CheckTicket from '../staff/CheckTicket.vue';
import ShowQRCode from './ShowQRCode.vue';


   // Router
   const route = useRoute();
   const router = useRouter();

   // Component đang hoạt động
   const activeComponent = ref(null);

   // Danh sách component có thể gọi
   const components = {
      StaffIndex,
      SellTicket,
      CheckTicket,
      ShowQRCode
   };

   const listeners = computed(() => {
      return currentComponent.value === StaffIndex
         ? { onOpen: handleOpen }
         : {};
   });   

   // Component hiện tại hiển thị
   const currentComponent = computed(() => {
      return activeComponent.value ? components[activeComponent.value] : StaffIndex;
   });

   // Map component sang tiêu đề breadcrumb
   const activeTitle = computed(() => {
      const map = {
         SellTicket: 'Bán vé',
         CheckTicket: 'Soát vé',
         ShowQRCode: 'Show QR code'
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
      router.replace({
         query: {
            ...route.query,       // giữ các query hiện tại
            manage: newVal || undefined
         }
      });
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
      margin-top: 20%;
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
