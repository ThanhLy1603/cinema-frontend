<template>
   <div class="container-fluid">
      <div class="home">
         <Header @change-component="setCurrentComponent" />

         <div class="content-wrapper">
            <transition name="fade-in" mode="out-in" appear>
               <component :is="currentComponent" :key="currentComponent" />
            </transition>
         </div>
      </div>
   </div>
</template>

<script setup>
   import { ref, computed, inject, onMounted} from 'vue';
   import { useRouter, useRoute } from 'vue-router';
   import { watch } from 'vue';

   const router = useRouter();
   const route = useRoute();

   // === Components ===
   import Header from '../header/Header.vue';

   // Components con (được tải động)
   import Films from '../load/Films.vue';
   import Products from '../load/Products.vue';
   import Promotions from '../load/Promotions.vue';
   import Services from '../load/Services.vue';
   import About from '../load/About.vue';
   import AccountProfile from '../auth/AccountProfile.vue';
   import FilmDetail from '../home/FilmDetail.vue';
   import ProductDetails from './ProductDetails.vue';

   // === Biến chính ===
   const current = ref('Films'); // mặc định trang phim
   const selectedFilmId = ref(null); // id phim đang xem chi tiết

   // Injection (ví dụ: SweetAlert)
   const $swal = inject('$swal');

   // === Map component ===
   const componentsMap = {
      Films,
      Products,
      Promotions,
      Services,
      About,
      AccountProfile,
      FilmDetail,
      ProductDetails,
   };

   // Component hiện tại được tính toán
   const currentComponent = computed(() => componentsMap[current.value]);

   function setCurrentComponent(name) {
      if (current.value !== name) {
         current.value = name;
         router.push({ query: { tab: name } }); // push để lưu history
      }
   }

   // Load tab từ URL khi reload trang
   onMounted(() => {
      if (route.query.tab) {
         current.value = route.query.tab;
      }
   });

   // Theo dõi URL để sync khi back/forward
   watch(
      () => route.query.tab,
      (val) => {
         if (val) current.value = val;
      }
   );
</script>

<style scoped>
   .home {
      text-align: center;
      /* Giữ nguyên padding */
      padding: 10px;
   }

   .content-wrapper {
      margin-top: 10px;
      padding: 20px;
      min-height: 400px;
      background-color: #f9f9f9;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
   }

   /* Quan trọng: Thêm position: relative cho wrapper chứa transition */
   .content-wrapper > * {
      position: relative;
   }

   /* =========================
   FADE (fade out + fade in)
   ========================= */
   .fade-enter-active,
   .fade-leave-active {
      transition: opacity 0.3s ease;
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
   }

   .fade-enter-from,
   .fade-leave-to {
      opacity: 0;
   }

   .fade-enter-to,
   .fade-leave-from {
      opacity: 1;
   }

   /* =========================
   FADE-IN ONLY (component hiện ra)
   ========================= */
   .fade-in-enter-active {
      transition: opacity 0.4s ease;
   }

   .fade-in-enter-from {
      opacity: 0;
   }

   .fade-in-enter-to {
      opacity: 1;
   }
</style>
