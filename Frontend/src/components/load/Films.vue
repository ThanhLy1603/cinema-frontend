<template>
   <div class="container-fluid">
      <div class="films-page-wrapper">
         <div class="films-home">
            <section class="banner-section position-relative">
               <transition name="fade" mode="out-in">
                  <img
                     :key="banners[currentBanner]"
                     :src="banners[currentBanner]"
                     alt="Banner"
                     class="banner-img"
                  />
               </transition>
               <div class="banner-content">
                  <router-link class="btn btn-success" to="/booking">Mua vé ngay</router-link>
                  <router-link class="btn btn-outline-light" to="/">Trang chủ</router-link>
               </div>
            </section>

            <section id="now" class="container-fluid section-films py-5">
               <h2 class="section-title fw-bold mb-4 display-6 text-center">🎬 Phim đang chiếu</h2>

               <div v-if="loading" class="text-center py-5">
                  <div class="spinner-border text-success" role="status"></div>
               </div>

               <Swiper
                  v-else
                  :modules="modules"
                  :slides-per-view="4"
                  :space-between="24"
                  :loop="true"
                  :autoplay="{ delay: 4000, disableOnInteraction: false }"
                  :breakpoints="{
                     320: { slidesPerView: 1 },
                     576: { slidesPerView: 2 },
                     768: { slidesPerView: 3 },
                     1200: { slidesPerView: 4 },
                  }"
                  navigation
                  pagination
                  class="mySwiper"
               >
                  <SwiperSlide v-for="film in nowShowingFunc()" :key="film.id">
                     <div
                        class="card film-card h-100 border-0"
                        @mouseenter="hoverFilm = film.id"
                        @mouseleave="hoverFilm = null"
                     >
                        <div class="poster-wrapper position-relative">
                           <img
                              :src="posterSrc(film.poster)"
                              :alt="film.name"
                              class="card-img-top"
                           />
                           <div
                              class="film-overlay"
                              v-if="hoverFilm === film.id"
                              @click="openTrailer(film)"
                           >
                              <i class="bi bi-play-circle-fill"></i>
                           </div>
                        </div>

                        <div class="card-body">
                           <h5 class="card-title text-truncate">{{ film.name }}</h5>
                           <p class="card-text">{{ film.country }} • {{ film.duration }} phút</p>

                           <div class="film-buttons d-flex justify-content-center gap-2">
                              <router-link :to="`/booking/${film.id}`" class="btn-film flex-grow-1"
                                 >Mua vé</router-link
                              >
                              <router-link
                                 :to="`/film/${film.id}`"
                                 class="btn-film-outline flex-grow-1"
                              >
                                 Chi tiết
                              </router-link>
                           </div>
                        </div>
                     </div>
                  </SwiperSlide>
               </Swiper>
            </section>

            <section id="offers" class="offers-section py-5 text-center">
               <h2 class="section-title fw-bold mb-4">Ưu đãi & khuyến mãi</h2>

               <div class="container-fluid px-4">
                  <div class="row g-4 justify-content-center">
                     <div
                        v-for="promo in promotions"
                        :key="promo.id"
                        class="col-12 col-md-6 col-lg-4"
                     >
                        <div class="card promo-card border-0 shadow-sm h-100">
                           <img :src="promo.image" class="card-img-top" :alt="promo.title" />
                           <div class="card-body">
                              <h5 class="card-title fw-bold">{{ promo.title }}</h5>
                              <p class="card-text text-muted small">{{ promo.description }}</p>
                              <button class="btn btn-outline-success btn-sm mt-2">
                                 Xem chi tiết
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            <section id="coming" class="container-fluid section-films py-5">
               <h2 class="section-title fw-bold mb-4 text-center">🎞️ Phim sắp chiếu</h2>

               <div v-if="loading" class="text-center py-5">
                  <div class="spinner-border text-success" role="status"></div>
               </div>

               <Swiper
                  v-else
                  :modules="modules"
                  :slides-per-view="4"
                  :space-between="24"
                  :loop="true"
                  :autoplay="{ delay: 4000, disableOnInteraction: false }"
                  :breakpoints="{
                     320: { slidesPerView: 1 },
                     576: { slidesPerView: 2 },
                     768: { slidesPerView: 3 },
                     1200: { slidesPerView: 4 },
                  }"
                  navigation
                  pagination
                  class="mySwiper"
               >
                  <SwiperSlide v-for="film in comingSoonFunc()" :key="film.id">
                     <div
                        class="card film-card h-100 border-0"
                        @mouseenter="hoverFilm = film.id"
                        @mouseleave="hoverFilm = null"
                     >
                        <div class="poster-wrapper position-relative">
                           <img
                              :src="posterSrc(film.poster)"
                              :alt="film.name"
                              class="card-img-top"
                           />
                           <div
                              class="film-overlay"
                              v-if="hoverFilm === film.id"
                              @click="openTrailer(film)"
                           >
                              <i class="bi bi-play-circle-fill"></i>
                           </div>
                        </div>

                        <div class="card-body">
                           <h5 class="card-title text-truncate">{{ film.name }}</h5>
                           <p class="card-text">{{ film.country }} • {{ film.duration }} phút</p>

                           <div class="film-buttons d-flex justify-content-center gap-2">
                              <router-link 
                              :to="`/booking/${film.id}`" class="btn-film flex-grow-1"
                                 >Mua vé</router-link
                              >
                              <router-link
                                 :to="`/film/${film.id}`"
                                 class="btn-film-outline flex-grow-1"
                              >
                                 Chi tiết
                              </router-link>
                           </div>
                        </div>
                     </div>
                  </SwiperSlide>
               </Swiper>
            </section>

            <footer class="text-center py-4 bg-dark text-white">
               <p class="mb-0">© 2025 VietCine. All Rights Reserved.</p>
            </footer>
         </div>

         <div v-if="showTrailer" class="trailer-overlay" @click="closeTrailer">
            <div class="trailer-content" @click.stop>
               <video :src="VIDEO_URL + selectedFilm.trailer" controls autoplay></video>
               <button class="btn-close" @click="closeTrailer"></button>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
   import axios from 'axios';
   import { ref, onMounted, onBeforeUnmount } from 'vue';
   import { Swiper, SwiperSlide } from 'swiper/vue';
   import { Navigation, Pagination, Autoplay } from 'swiper/modules';
   import 'swiper/css';
   import 'swiper/css/navigation';
   import 'swiper/css/pagination';

   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
   const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

   const films = ref([]);
   const loading = ref(true);

   const modules = [Navigation, Pagination, Autoplay];

   const banners = [
      new URL('../../assets/banner/MuaDo.jpg', import.meta.url).href,
      new URL('../../assets/banner/Avatar3.jpg', import.meta.url).href,
      new URL('../../assets/banner/PlayWithMe.jpg', import.meta.url).href,
   ];

   const currentBanner = ref(0);
   let bannerTimer = null;

   const VIDEO_URL = import.meta.env.VITE_VIDEO_URL;
   const hoverFilm = ref(null);
   const showTrailer = ref(false);
   const selectedFilm = ref({});

   function openTrailer(film) {
      selectedFilm.value = film;
      showTrailer.value = true;
   }

   function closeTrailer() {
      showTrailer.value = false;
   }

   function nextBanner() {
      currentBanner.value = (currentBanner.value + 1) % banners.length;
   }

   onMounted(() => {
      // Đảm bảo logic banner vẫn hoạt động
      bannerTimer = setInterval(nextBanner, 5000);
   });

   onBeforeUnmount(() => {
      if (bannerTimer) clearInterval(bannerTimer);
   });

   const promotions = [
      {
         id: 1,
         title: 'Giảm 50% vé 2D ngày thứ 3',
         description: 'Áp dụng cho tất cả các suất chiếu trước 18h.',
         image: new URL('../../assets/banner/Promo1.jpg', import.meta.url).href,
      },
      {
         id: 2,
         title: 'Combo bắp nước chỉ 69k',
         description: 'Mua combo bắp + nước lớn với giá siêu tiết kiệm!',
         image: new URL('../../assets/banner/Promo2.jpg', import.meta.url).href,
      },
      {
         id: 3,
         title: 'Thành viên VietCine giảm 20%',
         description: 'Ưu đãi đặc biệt dành riêng cho khách hàng thân thiết.',
         image: new URL('../../assets/banner/Promo3.jpg', import.meta.url).href,
      },
   ];

   async function getFilms() {
      try {
         const response = await axios.get(`${API_BASE_URL}/films`);
         films.value = response.data;
      } catch (error) {
         console.error('Lỗi khi lấy danh sách phim:', error.message);
      } finally {
         loading.value = false;
      }
   }

   function filterFilms(statusList) {
      return films.value.filter((f) => statusList.includes(f.status?.toLowerCase()));
   }

   function nowShowingFunc() {
      return filterFilms(['active', 'now_showing']);
   }

   function comingSoonFunc() {
      return filterFilms(['upcoming', 'coming_soon']);
   }

   /* =================== HELPERS =================== */
   function posterSrc(poster) {
      if (poster && poster.startsWith('http')) return poster;
      return IMAGE_URL + poster;
   }

   function reloadPage() {
      window.location.reload();
   }

   onMounted(() => {
      getFilms();
   });
</script>

<style scoped>
   @import 'swiper/css';
   @import 'swiper/css/navigation';
   @import 'swiper/css/pagination';

   /* =================== TRAILER HOVER =================== */
   .poster-wrapper {
      position: relative;
      overflow: hidden;
   }

   .film-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      cursor: pointer;
   }

   .poster-wrapper:hover .film-overlay {
      opacity: 1;
   }

   .film-overlay i {
      font-size: 3rem;
      color: #fff;
      transition:
         transform 0.3s ease,
         color 0.3s ease;
   }

   .film-overlay:hover i {
      transform: scale(1.2);
      color: #00ff8c;
   }

   /* =================== TRAILER POPUP =================== */
   .trailer-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 3000;
   }

   .trailer-content {
      position: relative;
      width: 80%;
      max-width: 900px;
      background: #000;
      border-radius: 10px;
      overflow: hidden;
   }

   .trailer-content video {
      width: 100%;
      height: auto;
      display: block;
   }

   .trailer-content .btn-close {
      position: absolute;
      top: -40px;
      right: -10px;
      background: transparent;
      border: none;
      color: white;
      font-size: 2.2rem;
      cursor: pointer;
   }

   /* Hiệu ứng mở popup */
   .trailer-content {
      animation: fadeInScale 0.4s ease both;
   }

   @keyframes fadeInScale {
      from {
         opacity: 0;
         transform: scale(0.85);
      }

      to {
         opacity: 1;
         transform: scale(1);
      }
   }

   .mySwiper {
      padding-bottom: 40px;
   }

   .swiper-button-next,
   .swiper-button-prev {
      color: #198754;
      transition: all 0.3s ease;
   }

   .swiper-button-next:hover,
   .swiper-button-prev:hover {
      transform: scale(1.2);
   }

   .swiper-pagination-bullet-active {
      background-color: #198754;
   }

   /* =================== GLOBAL =================== */
   .films-home {
      background-color: #f9fafb;
      font-family: 'Montserrat', sans-serif;
   }

   /* Thêm CSS nếu cần cho wrapper mới */
   .films-page-wrapper {
      min-height: 100vh;
      position: relative;
      /* Nếu không cần CSS đặc biệt thì không cần thêm gì */
   }

   /* =================== BANNER =================== */
   .banner-section {
      position: relative;
      width: 100%;
      height: 90vh;
      overflow: hidden;
      background-color: #000;
   }

   .banner-img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: opacity 1s ease-in-out;
      filter: brightness(1);
   }

   /* Transition CSS, áp dụng cho <transition> */
   .fade-enter-active,
   .fade-leave-active {
      transition: opacity 1s ease;
      position: absolute;
      /* Quan trọng cho mode="out-in" trên ảnh */
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
   }

   .fade-enter-from,
   .fade-leave-to {
      opacity: 0;
   }

   .banner-content {
      position: absolute;
      bottom: 6%;
      left: 5%;
      z-index: 10;
      display: flex;
      gap: 12px;
   }

   .banner-content .btn {
      font-weight: 600;
      border-radius: 6px;
      padding: 0.6rem 1.4rem;
   }

   /* =================== ƯU ĐÃI =================== */
   .offers-section {
      background: linear-gradient(135deg, #f8fff8, #e9f9ec);
   }

   .promo-card {
      transition:
         transform 0.3s ease,
         box-shadow 0.3s ease;
   }

   .promo-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
   }

   .promo-card img {
      height: 220px;
      object-fit: cover;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
   }

   /* =================== PHIM =================== */
   .section-films {
      padding-left: 4%;
      padding-right: 4%;
   }

   .section-title {
      letter-spacing: 1px;
   }

   /* CARD PHIM */
   .film-card {
      border-radius: 12px;
      overflow: hidden;
      transition:
         transform 0.3s ease,
         box-shadow 0.3s ease;
      background-color: #fff;
   }

   .film-card:hover {
      transform: translateY(-6px) scale(1.03);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
   }

   /* HÌNH ẢNH PHIM */
   .film-card img {
      width: 100%;
      height: 360px;
      object-fit: cover;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      transition: transform 0.4s ease;
   }

   .film-card:hover img {
      transform: scale(1.08);
   }

   /* BODY NỘI DUNG */
   .film-card .card-body {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 1rem 1rem 1.2rem;
      text-align: center;
   }

   .film-card .card-title {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.4rem;
      color: #222;
      transition: color 0.3s ease;
   }

   .film-card:hover .card-title {
      color: #198754;
   }

   .film-card .card-text {
      font-size: 0.85rem;
      color: #6c757d;
      margin-bottom: 0.6rem;
   }

   .film-card .btn {
      border-radius: 6px;
      transition: all 0.3s ease;
   }

   .film-card .btn:hover {
      transform: translateY(-2px);
   }

   /* Hiệu ứng xuất hiện */
   .row.g-4 > div {
      animation: fadeInUp 0.6s ease both;
   }

   @keyframes fadeInUp {
      from {
         opacity: 0;
         transform: translateY(20px);
      }

      to {
         opacity: 1;
         transform: translateY(0);
      }
   }

   /* =================== BUTTON FILM =================== */
   .film-buttons {
      margin-top: 10px;
   }

   .btn-film,
   .btn-film-outline {
      font-weight: 600;
      border-radius: 8px;
      padding: 0.5rem 0.8rem;
      transition: all 0.3s ease;
      text-transform: uppercase;
      font-size: 0.85rem;
   }

   .btn-film {
      background: linear-gradient(135deg, #198754, #28a745);
      color: white;
      border: none;
      box-shadow: 0 3px 8px rgba(25, 135, 84, 0.3);
   }

   .btn-film:hover {
      background: linear-gradient(135deg, #157347, #1e7e34);
      transform: translateY(-2px);
   }

   .btn-film-outline {
      border: 2px solid #198754;
      color: #198754;
      background: transparent;
   }

   .btn-film-outline:hover {
      background: #198754;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 3px 8px rgba(25, 135, 84, 0.3);
   }

   /* =================== RESPONSIVE =================== */
   @media (max-width: 992px) {
      .banner-section {
         height: 70vh;
      }

      .film-card img {
         height: 300px;
      }
   }

   @media (max-width: 768px) {
      .banner-section {
         height: 60vh;
      }

      .film-card img {
         height: 260px;
      }
   }

   @media (max-width: 480px) {
      .banner-section {
         height: 55vh;
      }

      .film-card img {
         height: 220px;
      }
   }

   /* =================== FOOTER =================== */
   footer {
      background: #111;
      color: #ccc;
   }
</style>
