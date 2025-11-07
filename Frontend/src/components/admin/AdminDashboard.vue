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

<<<<<<< HEAD
<script>
import { ref, computed } from "vue";
import Header from "../header/Header.vue";
import AdminIndex from "../admin/AdminIndex.vue";
import FilmsManager from "../admin/FilmsManager.vue";
import ShowTimes from "../admin/ShowTimes.vue";
import CategoryManager from "../admin/CategoryManager.vue";

export default {
  name: "AdminDashboard",
  components: { Header, AdminIndex, FilmsManager,ShowTimes,CategoryManager},
=======
<script setup>
   import { ref, computed } from 'vue';

   import Header from '../header/Header.vue';
   import AdminIndex from '../admin/AdminIndex.vue';
   import FilmsManager from '../admin/FilmsManager.vue';
   import ShowTimes from '../admin/ShowTimes.vue';
   import RoomsManager from '../admin/RoomsManager.vue';
>>>>>>> 5e71edd4b95186b55435fb8319d8fb7c6ffd487d

   const activeComponent = ref(null);

   const components = {
      AdminIndex,
      FilmsManager,
      ShowTimes,
<<<<<<< HEAD
      CategoryManager
    };
=======
      RoomsManager,
   };
>>>>>>> 5e71edd4b95186b55435fb8319d8fb7c6ffd487d

   // Tự động chọn component hiển thị
   const currentComponent = computed(() => {
      return activeComponent.value ? components[activeComponent.value] : AdminIndex;
   });

   // Map tên sang tiêu đề
   const activeTitle = computed(() => {
      const map = {
         FilmsManager: 'Phim',
         ShowTimes: 'Giờ chiếu',
         RoomsManager: 'Phòng chiếu',
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
<<<<<<< HEAD
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
=======
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
>>>>>>> 5e71edd4b95186b55435fb8319d8fb7c6ffd487d
