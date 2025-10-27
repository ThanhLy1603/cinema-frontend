<template>
  <div class="films-home">
    <!-- =================== BANNER =================== -->
    <section class="banner-section position-relative">
      <transition-group name="fade" tag="div" class="banner-wrapper">
        <img
          v-for="(banner, index) in banners"
          :key="banner"
          v-show="currentBanner === index"
          :src="banner"
          alt="Banner"
          class="banner-img"
        />
      </transition-group>

      <!-- NỘI DUNG TRONG BANNER -->
      <div class="banner-content">
        <router-link class="btn btn-success" to="/booking">Mua vé ngay</router-link>
        <router-link class="btn btn-outline-light" to="/info">Thông tin chi tiết</router-link>
      </div>
    </section>

    <!-- =================== PHIM ĐANG CHIẾU =================== -->
    <section id="now" class="container-fluid section-films py-5">
      <h2 class="section-title fw-bold mb-4">Phim đang chiếu</h2>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-success" role="status"></div>
      </div>

      <div v-else class="row g-4">
        <template v-if="nowShowing.length">
          <div
            v-for="film in nowShowing"
            :key="film.id"
            class="col-6 col-md-4 col-lg-3"
          >
            <div class="card film-card h-100 border-0 shadow-sm">
              <img :src="posterSrc(film.poster)" :alt="film.name" class="card-img-top" />
              <div class="card-body d-flex flex-column">
                <h5 class="card-title text-truncate">{{ film.name }}</h5>
                <p class="card-text text-muted small mb-2">
                  {{ film.country }} • {{ film.duration }} phút
                </p>
                <div class="mt-auto d-flex gap-2">
                  <router-link
                    :to="`/film/${film.id}`"
                    class="btn btn-sm btn-success flex-grow-1"
                  >Chi tiết</router-link>
                  <button
                    class="btn btn-sm btn-outline-secondary"
                    @click="openTrailer(film)"
                  >Trailer</button>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div v-else class="text-center text-muted py-5">Chưa có phim đang chiếu.</div>
      </div>

      <div v-if="nowShowingFunc().length > 4" class="text-center mt-4">
        <button class="btn btn-outline-success px-4" @click="showAllNow = !showAllNow">
          {{ showAllNow ? "Thu gọn" : "Xem thêm" }}
        </button>
      </div>
    </section>

    <!-- =================== ƯU ĐÃI / KHUYẾN MÃI =================== -->
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
                <button class="btn btn-outline-success btn-sm mt-2">Xem chi tiết</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- =================== PHIM SẮP CHIẾU =================== -->
    <section id="coming" class="container-fluid section-films py-5">
      <h2 class="section-title fw-bold mb-4">Phim sắp chiếu</h2>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-success" role="status"></div>
      </div>

      <div v-else class="row g-4">
        <template v-if="comingSoon.length">
          <div
            v-for="film in comingSoon"
            :key="film.id"
            class="col-6 col-md-4 col-lg-3"
          >
            <div class="card film-card h-100 border-0 shadow-sm">
              <img :src="posterSrc(film.poster)" :alt="film.name" class="card-img-top" />
              <div class="card-body d-flex flex-column">
                <h5 class="card-title text-truncate">{{ film.name }}</h5>
                <p class="card-text text-muted small mb-2">
                  {{ film.country }} • {{ film.duration }} phút
                </p>
                <div class="mt-auto d-flex gap-2">
                  <router-link
                    :to="`/film/${film.id}`"
                    class="btn btn-sm btn-outline-success flex-grow-1"
                  >Chi tiết</router-link>
                  <button
                    class="btn btn-sm btn-outline-secondary"
                    @click="openTrailer(film)"
                  >Trailer</button>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div v-else class="text-center text-muted py-5">Chưa có phim sắp chiếu.</div>
      </div>

      <div v-if="comingSoonFunc().length > 4" class="text-center mt-4">
        <button class="btn btn-outline-success px-4" @click="showAllComing = !showAllComing">
          {{ showAllComing ? "Thu gọn" : "Xem thêm" }}
        </button>
      </div>
    </section>

    <!-- =================== FOOTER =================== -->
    <footer class="text-center py-4 bg-dark text-white">
      <p class="mb-0">© 2025 VietCine. All Rights Reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted, onBeforeUnmount, computed } from "vue";

/* =================== CONFIG =================== */
var API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
var IMAGE_URL = import.meta.env.VITE_IMAGE_URL || "";
var VIDEO_URL = import.meta.env.VITE_VIDEO_URL || "";

/* =================== STATE =================== */
var films = ref([]);
var loading = ref(true);
var currentFilm = ref(null);
var trailerSrc = ref("");
var trailerModalRef = ref(null);
var bsModal = null;

var showAllNow = ref(false);
var showAllComing = ref(false);

/* =================== BANNERS =================== */
var banners = [
  new URL("../../assets/banner/MuaDo.jpg", import.meta.url).href,
  new URL("../../assets/banner/Avatar3.jpg", import.meta.url).href,
  new URL("../../assets/banner/PlayWithMe.jpg", import.meta.url).href,
];
var currentBanner = ref(0);
var bannerTimer = null;

function nextBanner() {
  currentBanner.value = (currentBanner.value + 1) % banners.length;
}

onMounted(function () {
  bannerTimer = setInterval(nextBanner, 5000);
});

onBeforeUnmount(function () {
  if (bannerTimer) {
    clearInterval(bannerTimer);
  }
});

/* =================== ƯU ĐÃI =================== */
var promotions = [
  {
    id: 1,
    title: "Giảm 50% vé 2D ngày thứ 3",
    description: "Áp dụng cho tất cả các suất chiếu trước 18h.",
    image: new URL("../../assets/banner/Promo1.jpg", import.meta.url).href,
  },
  {
    id: 2,
    title: "Combo bắp nước chỉ 69k",
    description: "Mua combo bắp + nước lớn với giá siêu tiết kiệm!",
    image: new URL("../../assets/banner/Promo2.jpg", import.meta.url).href,
  },
  {
    id: 3,
    title: "Thành viên VietCine giảm 20%",
    description: "Ưu đãi đặc biệt dành riêng cho khách hàng thân thiết.",
    image: new URL("../../assets/banner/Promo3.jpg", import.meta.url).href,
  },
];

/* =================== PHIM =================== */
async function getFilms() {
  try {
    var res = await axios.get(API_BASE_URL + "/films");
    if (Array.isArray(res.data)) {
      films.value = res.data;
    } else {
      films.value = [];
    }
  } catch (err) {
    console.error("Lỗi khi lấy danh sách phim:", err.message);
  } finally {
    loading.value = false;
  }
}

onMounted(function () {
  getFilms();
  if (window.bootstrap && trailerModalRef.value) {
    bsModal = new window.bootstrap.Modal(trailerModalRef.value);
  }
});

function filterFilms(statusList) {
  return films.value.filter(function (f) {
    return statusList.includes(f.status?.toLowerCase());
  });
}

function nowShowingFunc() {
  return filterFilms(["active", "now_showing"]);
}

function comingSoonFunc() {
  return filterFilms(["upcoming", "coming_soon"]);
}

var nowShowing = computed(function () {
  var list = nowShowingFunc();
  return showAllNow.value ? list : list.slice(0, 4);
});

var comingSoon = computed(function () {
  var list = comingSoonFunc();
  return showAllComing.value ? list : list.slice(0, 4);
});

/* =================== HELPERS =================== */
function posterSrc(poster) {
  if (poster && poster.startsWith("http")) return poster;
  return IMAGE_URL + poster;
}

function videoSrc(trailer) {
  if (!trailer) return "";
  if (trailer.startsWith("http")) return trailer;
  return VIDEO_URL + trailer;
}

function openTrailer(film) {
  currentFilm.value = film;
  trailerSrc.value = videoSrc(film.trailer);
  if (bsModal) bsModal.show();
}
</script>

<style scoped>
/* =================== GLOBAL =================== */
.films-home {
  background-color: #f9fafb;
  font-family: "Montserrat", sans-serif;
}

/* =================== BANNER =================== */
.banner-section {
  position: relative;
  width: 100%;
  height: 90vh;
  overflow: hidden;
  background-color: #000;
}
.banner-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
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
  margin-right: 10px;
}

/* =================== ƯU ĐÃI =================== */
.offers-section {
  background: linear-gradient(135deg, #f8fff8, #e9f9ec);
}
.promo-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
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
.film-card img {
  transition: transform 0.3s ease;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.film-card:hover img {
  transform: scale(1.05);
}

/* =================== RESPONSIVE =================== */
@media (max-width: 1024px) {
  .banner-section {
    height: 70vh;
  }
  .banner-content {
    left: 4%;
  }
}
@media (max-width: 768px) {
  .banner-section {
    height: 60vh;
  }
  .banner-content {
    left: 3%;
    top: 55%;
  }
}
@media (max-width: 480px) {
  .banner-section {
    height: 55vh;
  }
  .banner-content {
    left: 2%;
  }
}

/* =================== FOOTER =================== */
footer {
  background: #111;
  color: #ccc;
}
</style>
