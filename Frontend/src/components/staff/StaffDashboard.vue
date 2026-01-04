<template>
   <div class="staff-dashboard">
      <!-- Breadcrumb điều hướng -->
      <div class="breadcrumb-bar">
         <div class="container-fluid">
            <nav aria-label="breadcrumb">
               <ol class="breadcrumb mb-0">
                  <li class="breadcrumb-item">
                     <router-link to="/staff" href="#" @click.prevent="goBack" class="breadcrumb-link">
                        <i class="bi bi-house-door me-2"></i> Trang nhân viên
                     </router-link>
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
            <!-- Component động -->
            <transition name="fade" mode="out-in">
               <component :is="currentComponent" v-bind="listeners" />
            </transition>
         </div>
      </div>
   </div>
</template>

<script setup>
   import { ref, computed, watch, onMounted } from 'vue';
   import { useRoute, useRouter } from 'vue-router';

   // Import các component chức năng
   import StaffIndex from '../staff/StaffIndex.vue';
   import SellTicket from '../staff/SellTicket.vue';
   import SellProduct from './SellProduct.vue';
   import CheckTicket from '../staff/CheckTicket.vue';
   import SellHistory from './SellHistory.vue';

   // Router
   const route = useRoute();
   const router = useRouter();

   // Component đang hoạt động (từ query manage)
   const activeComponent = ref(null);

   const components = {
      StaffIndex,
      SellTicket,
      SellProduct,
      CheckTicket,
      SellHistory,
   };

   // Truyền listener cho StaffIndex (nếu cần mở chức năng con)
   const listeners = computed(() => {
      return currentComponent.value === StaffIndex ? { onOpen: handleOpen } : {};
   });

   // Component hiện tại (mặc định là StaffIndex nếu không có query)
   const currentComponent = computed(() => {
      return activeComponent.value ? components[activeComponent.value] : StaffIndex;
   });

   // Tiêu đề breadcrumb
   const activeTitle = computed(() => {
      const map = {
         SellTicket: 'Bán vé xem phim',
         SellProduct: 'Bán đồ ăn & đồ uống',
         CheckTicket: 'Soát vé',
         SellHistory: 'Lịch sử bán hàng',
      };
      return map[activeComponent.value] || '';
   });

   // Xử lý mở component con từ StaffIndex
   function handleOpen(componentName) {
      if (components[componentName]) {
         activeComponent.value = componentName;
      }
   }

   // Quay lại trang chủ nhân viên
   function goBack() {
      activeComponent.value = null;
   }

   // Đồng bộ query manage với URL
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
   .staff-dashboard {
      min-height: 100vh;
      background-color: #f5f7fa;
      display: flex;
      flex-direction: column;
   }

   /* Thanh breadcrumb cố định nhẹ, chuyên nghiệp */
   .breadcrumb-bar {
      background-color: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      padding: 16px 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      position: sticky;
      top: 0;
      z-index: 100;
   }

   .breadcrumb {
      background: transparent;
      padding: 0;
      margin: 0;
      font-size: 1.1rem;
   }

   .breadcrumb-link {
      color: #2d3748;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
   }

   .breadcrumb-link:hover {
      color: #1a6d36;
   }

   .breadcrumb-item.active {
      color: #1a6d36;
      font-weight: 600;
   }

   /* Nội dung chính */
   .main-content {
      flex: 1;
      padding: 30px 0;
      background-color: #f5f7fa;
   }

   /* Hiệu ứng chuyển component mượt mà */
   .fade-enter-active,
   .fade-leave-active {
      transition: opacity 0.3s ease;
   }

   .fade-enter-from,
   .fade-leave-to {
      opacity: 0;
   }
</style>
