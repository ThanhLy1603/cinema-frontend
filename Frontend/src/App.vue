<template>
   <div class="container-fluid">
      <router-view />
   </div>
</template>

<script setup>
   import { watch } from 'vue';
   import { useRoute } from 'vue-router';
   import Revenue from './components/admin/Revenue.vue';

   const route = useRoute();

   watch(
      () => route.fullPath,
      () => {
         window.scrollTo(0, 0); // scroll về top
      }
   );
</script>

<style scoped>
   body {
      padding-top: 180px !important;
      transition: padding-top 0.4s ease;
   }

   body.header-scrolled {
      padding-top: 90px !important;
   }
</style>
