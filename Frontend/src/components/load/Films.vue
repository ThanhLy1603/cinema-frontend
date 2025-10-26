<template>
  <div class="films-home">
    <!-- Banner -->
    <section class="banner-section position-relative">
      <img :src="bannerSrc" alt="Banner" class="banner-img" />
      <div class="banner-overlay">
        <h1 class="display-4 fw-bold text-danger text-uppercase">Mùa Đỏ</h1>
        <p class="fs-5 mb-3">Suất chiếu đặc biệt lúc 18:00 ngày 21.08.2025</p>
        <div class="d-flex gap-3 justify-content-center">
          <router-link class="btn btn-success" to="/booking">Mua vé ngay</router-link>
          <router-link class="btn btn-outline-light" to="/info">Thông tin chi tiết</router-link>
        </div>
      </div>
    </section>

    <!-- PHIM ĐANG CHIẾU -->
    <section id="now" class="container py-5">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h2 class="section-title fw-bold m-0">Phim đang chiếu</h2>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-success" role="status"></div>
      </div>

      <div v-else class="row g-4">
        <div class="col-6 col-md-4 col-lg-3" v-for="film in nowShowing" :key="film.id">
          <div class="card film-card h-100 border-0 shadow-sm">
            <img :src="posterSrc(film.poster)" :alt="film.name" class="card-img-top" />
            <div class="card-body d-flex flex-column">
              <h5 class="card-title text-truncate">{{ film.name }}</h5>
              <p class="card-text text-muted small mb-2">
                {{ film.country }} • {{ film.duration }} phút
              </p>
              <div class="mt-auto d-flex gap-2">
                <router-link :to="`/film/${film.id}`" class="btn btn-sm btn-success flex-grow-1">Chi tiết</router-link>
                <button class="btn btn-sm btn-outline-secondary" @click="openTrailer(film)">Trailer</button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!nowShowing.length" class="text-center text-muted py-5">
          Chưa có phim đang chiếu.
        </div>
      </div>
    </section>

    <!-- ƯU ĐÃI -->
    <section id="offers" class="py-5">
      <Promotions />
    </section>

    <!-- PHIM SẮP CHIẾU -->
    <section id="coming" class="container py-5">
      <h2 class="section-title fw-bold mb-4">Phim sắp chiếu</h2>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-success" role="status"></div>
      </div>

      <div v-else class="row g-4">
        <div class="col-6 col-md-4 col-lg-3" v-for="film in comingSoon" :key="film.id">
          <div class="card film-card h-100 border-0 shadow-sm">
            <img :src="posterSrc(film.poster)" :alt="film.name" class="card-img-top" />
            <div class="card-body d-flex flex-column">
              <h5 class="card-title text-truncate">{{ film.name }}</h5>
              <p class="card-text text-muted small mb-2">
                {{ film.country }} • {{ film.duration }} phút
              </p>
              <div class="mt-auto d-flex gap-2">
                <router-link :to="`/film/${film.id}`" class="btn btn-sm btn-outline-success flex-grow-1">Chi tiết</router-link>
                <button class="btn btn-sm btn-outline-secondary" @click="openTrailer(film)">Trailer</button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!comingSoon.length" class="text-center text-muted py-5">
          Chưa có phim sắp chiếu.
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="text-center py-4 bg-dark text-white">
      <p class="mb-0">© 2025 VietCine. All Rights Reserved.</p>
    </footer>

    <!-- MODAL TRAILER -->
    <div class="modal fade" id="trailerModal" tabindex="-1" ref="trailerModalRef">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0">
          <div class="modal-header">
            <h5 class="modal-title">{{ currentFilm?.name || 'Trailer' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-0">
            <div class="ratio ratio-16x9">
              <video v-if="trailerSrc" :src="trailerSrc" controls autoplay></video>
              <div v-else class="d-flex align-items-center justify-content-center text-muted py-5">
                Chưa có trailer.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted, computed } from "vue";
import Promotions from "../load/Promotions.vue";

var API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
var IMAGE_URL = import.meta.env.VITE_IMAGE_URL || "";
var VIDEO_URL = import.meta.env.VITE_VIDEO_URL || "";

var films = ref([]);
var loading = ref(true);
var bannerSrc = "/banner.jpg";

var currentFilm = ref(null);
var trailerSrc = ref("");
var trailerModalRef = ref(null);
var bsModal = null;

// === Lấy dữ liệu phim ===
async function getFilms() {
  try {
    var res = await axios.get(API_BASE_URL + "/films");
    films.value = Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("Lỗi khi lấy danh sách phim:", err.message);
  } finally {
    loading.value = false;
  }
}

onMounted(async function () {
  await getFilms();
  if (window.bootstrap && trailerModalRef.value) {
    bsModal = new window.bootstrap.Modal(trailerModalRef.value);
  }
});

// === Xử lý dữ liệu ===
function nowShowingFunc() {
  return films.value.filter(function (f) {
    return f.status === "NOW_SHOWING";
  });
}

function comingSoonFunc() {
  return films.value.filter(function (f) {
    return f.status === "COMING_SOON";
  });
}

var nowShowing = computed(function () {
  return nowShowingFunc();
});
var comingSoon = computed(function () {
  return comingSoonFunc();
});

// === Helpers ===
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
.films-home {
  background-color: #f9fafb;
  font-family: "Montserrat", sans-serif;
}

/* Banner */
.banner-section {
  height: 480px;
  overflow: hidden;
}
.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.6);
}
.banner-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  text-align: center;
}

/* Titles */
.section-title {
  letter-spacing: 1px;
}

/* Film card */
.film-card img {
  transition: transform 0.3s ease;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.film-card:hover img {
  transform: scale(1.05);
}

/* Offers */
.offers-section {
  background: linear-gradient(135deg, #f0fdf4, #d1fae5);
}

/* Footer */
footer {
  background: #111;
  color: #ccc;
}
</style>
