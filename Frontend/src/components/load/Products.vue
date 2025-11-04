<template>
   <div class="container-fluid">
      <h1>Products</h1>

      <div v-for="product in products" :key="product">
         <p>Name: {{product.name}}</p>
         <img :src="posterSrc(product.poster)" :alt="`${product.poster}`">
         <p>Description: {{ product.description }}</p>
      </div>
   </div>
</template>
<script setup>
   import { ref, onMounted } from 'vue';
   import axios from 'axios';

   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
   const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

   const products = ref([]);

   async function getproducts() {
      try {
         const url = `${API_BASE_URL}/products`;

         const response = await axios.get(url);
         products.value = response.data;

         console.log("products: ", products.value);
      } catch (error) {
         console.error("Lỗi khi lấy dữ liệu từ products: ", error.message);
      }
   }

   function posterSrc(poster) {
      return IMAGE_URL + poster;
   }

   onMounted(() => {
      getproducts();
   });
</script>
<style scoped></style>