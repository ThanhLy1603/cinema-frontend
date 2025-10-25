<template>
   <h1>Phim (Demo)</h1>

   <div v-for="(film, index) in films" :key="index">
      <div>
         <router-link :to="`/film/${film.id}`"> {{index + 1}}. {{film.name}}</router-link>
         <div class="row">
            <div class="col-sm-6">
               <img :src="`${IMAGE_URL + film.poster}`" alt="" width="500px" height="300px">
            </div>

            <div class="col-sm-6">
               <video controls :src="`${VIDEO_URL + film.trailer}`" width="500px" height="300px">
               </video>
            </div>
         </div>
      </div>
   </div>

</template>
<script setup>
   import axios from 'axios';
   import { onMounted, ref } from 'vue';

   const films = ref([]);

   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
   const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
   const VIDEO_URL = import.meta.env.VITE_VIDEO_URL;

   async function getFilms() {
      try {
         const url = `${API_BASE_URL}/films`;
         const response = await axios.get(url);

         films.value = response.data;

         console.log("films: ", films.value);
      } catch (error) {
         console.error(("Lỗi khi lấy dữ liệu từ Films: ", error.message));
      }
   }

   onMounted(() => {
      getFilms();
   });
</script>
<style scoped></style>
