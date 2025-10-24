<template>
   <h1> Chi tiết phim </h1>
   <h2> id phim: {{film.id}}</h2>
   <h2> Tên phim : {{film.name}}</h2>
   <img :src="`${IMAGE_URL + film.poster}`" alt="" width="500px" height="300px">
   <video :src="`${VIDEO_URL + film.trailer}`" controls width="500px" height="300px"></video>
   <p>Đạo diễn: {{film.director}}</p>
   <p>Diễn viên: {{film.actor}}</p>
   <p>Nội dung chính: {{film.description}}</p>
   <p>Ngày chiếu: {{film.releaseDate}}</p>
   <p>Thời lượng: {{film.duration}} phút</p>
   <p>Thể loại: {{categoryNames}}</p>
</template>

<script setup>
   import { useRoute } from 'vue-router';
   import axios from 'axios';
   import { computed, onMounted, ref } from 'vue';

   const route = useRoute();
   const film = ref({});
   const categories = ref([]);
   const filmId = route.params.id;

   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
   const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
   const VIDEO_URL = import.meta.env.VITE_VIDEO_URL;

   const categoryNames = computed(() => {
      return categories.value.map(category => category.name).join(', ') + '.'
   });

   async function getFilm() {
      try {
         const url = `${API_BASE_URL}/films/${filmId}`;
         const response = await axios.get(url);

         film.value = {...response.data};

         console.log("Film: ", film.value);
      } catch (error) {
         console.error("Lỗi khi lấy Film: ", error.message);
      }
   }

   async function getCategories() {
      console.log(("film id: ", film.value.id));

      try {
         const url = `${API_BASE_URL}/films/${film.value.id}/categories`;
         const response = await axios.get(url);

         categories.value = response.data;

         console.log("Categories: ", categories.value);
      } catch (error) {
         console.error("Lỗi khi lấy dữ liệu từ FilmCategory");
      }
   }

   onMounted(async () => {
      await getFilm();
      await getCategories();
   });
</script>

<style scoped>

</style>