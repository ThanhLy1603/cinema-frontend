<template>
  <div class="film-detail-page">
    <!-- ==================== THÔNG TIN PHIM ==================== -->
    <section class="container py-5">
      <div v-if="!film.id" class="text-center text-muted py-5">
        <div class="spinner-border text-success" role="status"></div>
        <p class="mt-3">Đang tải thông tin phim...</p>
      </div>

      <div v-else class="row g-4 align-items-start bg-white rounded-4 shadow-lg p-4 detail-card">
        <!-- Poster -->
        <div class="col-md-4 text-center">
          <img :src="IMAGE_URL + film.poster" alt="Poster" class="img-fluid rounded-4 poster-img" />
        </div>

        <!-- Thông tin phim -->
        <div class="col-md-8 d-flex flex-column align-items-start text-start">
          <h3 class="fw-bold text-success">{{ film.name }}</h3>
          <p><strong>Đạo diễn:</strong> {{ film.director }}</p>
          <p><strong>Diễn viên:</strong> {{ film.actor }}</p>
          <p><strong>Thời lượng:</strong> {{ film.duration }} phút</p>
          <p><strong>Ngày khởi chiếu:</strong> {{ film.releaseDate }}</p>
          <p><strong>Trạng thái:</strong> {{ film.status }}</p>
          <p><strong>Thể loại:</strong> {{ categoryNames }}</p>
          <div class="mt-3 w-100">
            <h5 class="fw-bold">Tóm tắt nội dung</h5>
            <p class="text-secondary">{{ film.description }}</p>
          </div>
        </div>

      </div>
    </section>

    <!-- ==================== TRAILER ==================== -->
    <section v-if="film.trailer" class="container text-center py-5 trailer-section">
      <div class="trailer-wrapper rounded-4 shadow-lg p-4 bg-white">
        <h4 class="fw-bold mb-4 text-primary">🎥 Official Trailer</h4>
        <video class="rounded-3 border shadow-sm" controls width="80%" height="420"
          :src="VIDEO_URL + film.trailer"></video>
      </div>
    </section>

    <!-- ==================== COMPONENT CON ==================== -->
    <section class="container py-5">
      <div class="rounded-4 bg-white shadow-sm p-4 border-top border-success border-3">
        <ShowtimeComponent :film="film" />
      </div>
    </section>

    <!-- ==================== FOOTER ==================== -->
    <footer class="bg-dark text-white text-center py-3 mt-5 rounded-top-4 shadow-inner">
      <p class="mb-0 small">© 2025 VietCine | All Rights Reserved</p>
    </footer>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted, watch, computed } from "vue";
import ShowtimeComponent from "../../components/filmDetail/ShowtimeComponent.vue";

const props = defineProps({
  filmId: String,
});

const film = ref({});
const categories = ref([]);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
const VIDEO_URL = import.meta.env.VITE_VIDEO_URL;

const categoryNames = computed(() =>
  categories.value.length
    ? categories.value.map((c) => c.name).join(", ")
    : "Đang cập nhật..."
);

async function getFilm() {
  if (!props.filmId) return;
  try {
    const res = await axios.get(`${API_BASE_URL}/films/${props.filmId}`);
    film.value = res.data;
  } catch (err) {
    console.error("Lỗi khi lấy Film:", err.message);
  }
}

async function getCategories() {
  if (!film.value.id) return;
  const res = await axios.get(`${API_BASE_URL}/films/${film.value.id}/categories`);
  categories.value = res.data;
}

watch(
  () => props.filmId,
  async (newId) => {
    if (newId) {
      await getFilm();
      await getCategories();
    } else {
      film.value = {};
      categories.value = [];
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.film-detail-page {
  background: linear-gradient(180deg, #f0fdf4 0%, #f9fafb 100%);
  font-family: "Montserrat", sans-serif;
  min-height: 100vh;
  padding-bottom: 50px;
}

/* CARD chính */
.detail-card {
  border: 2px solid #e9f5ee;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.detail-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Ảnh poster */
.poster-img {
  border: 3px solid #d1e7dd;
  transition: transform 0.5s ease, box-shadow 0.4s ease;
}

.poster-img:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(25, 135, 84, 0.3);
}

/* Grid nội dung */
.info-section p {
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.info-section h2 {
  letter-spacing: 0.5px;
}

.description {
  border-top: 2px dashed #198754;
  padding-top: 12px;
}

/* Trailer section */
.trailer-section {
  background: linear-gradient(135deg, #f7fff9, #e9f8ef);
  border-radius: 20px;
}

.trailer-wrapper {
  border: 2px solid #d1e7dd;
  transition: all 0.3s ease;
}

.trailer-wrapper:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.15);
}

/* Video */
video {
  border-radius: 12px;
  object-fit: cover;
  border: 2px solid #19875433;
}

/* Footer */
footer {
  background: #0f1f0f;
  font-size: 0.9rem;
  letter-spacing: 0.4px;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.2);
}
</style>
