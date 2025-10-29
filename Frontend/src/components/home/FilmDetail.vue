<template>
  <div class="film-detail-wrapper">
    <!-- 🟢 HEADER -->
    <Header />

    <!-- 🟢 NỘI DUNG CHI TIẾT -->
    <div class="film-detail-page container py-5">
      <div v-if="!film.id" class="text-center py-5 text-muted">
        <div class="spinner-border text-success"></div>
        <p class="mt-3">Đang tải thông tin phim...</p>
      </div>

      <div v-else class="card shadow-lg border-0 rounded-4 overflow-hidden p-4">
        <!-- Nút quay lại -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="fw-bold text-success m-0">🎬 {{ film.name }}</h2>
          <router-link to="/" class="btn-back">
            ⬅ Quay lại danh sách
          </router-link>
        </div>

        <div class="row g-4 align-items-start">
          <!-- Poster -->
          <div class="col-md-4 text-center">
            <img
              :src="IMAGE_URL + film.poster"
              alt="Poster"
              class="img-fluid rounded shadow-sm mb-4"
            />
          </div>

          <!-- Thông tin + Trailer -->
          <div class="col-md-8">
            <div class="film-info">
              <p><strong>Đạo diễn:</strong> {{ film.director }}</p>
              <p><strong>Diễn viên:</strong> {{ film.actor }}</p>
              <p><strong>Thể loại:</strong> {{ categoryNames }}</p>
              <p><strong>Thời lượng:</strong> {{ film.duration }} phút</p>
              <p><strong>Ngày khởi chiếu:</strong> {{ film.releaseDate }}</p>
              <p><strong>Trạng thái:</strong> {{ film.status }}</p>
            </div>

            <div class="film-description mt-4">
              <h5 class="fw-bold mb-2">Tóm tắt nội dung</h5>
              <p class="text-secondary">{{ film.description }}</p>
            </div>

            <!-- Trailer ngay trong panel -->
            <div v-if="film.trailer" class="film-trailer mt-5">
              <h5 class="fw-bold text-primary mb-3">🎞️ Trailer chính thức</h5>
              <video
                :src="VIDEO_URL + film.trailer"
                controls
                class="w-100 rounded shadow-sm border"
              ></video>
            </div>
          </div>
        </div>
      </div>

      <!-- Lịch chiếu -->
      <section class="container py-5">
        <ShowtimeComponent :film="film" />
      </section>
    </div>

    <!-- 🟢 FOOTER -->
    <footer class="bg-dark text-white text-center py-3 mt-5">
      <p class="mb-0">© 2025 VietCine | All Rights Reserved</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import ShowtimeComponent from "../../components/filmDetail/ShowtimeComponent.vue";
import Header from "../../components/header/Header.vue";

const route = useRoute();
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
  try {
    const res = await axios.get(`${API_BASE_URL}/films/${route.params.id}`);
    film.value = res.data;
    await getCategories();
  } catch (err) {
    console.error("Lỗi khi lấy Film:", err.message);
  }
}

async function getCategories() {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/films/${film.value.id}/categories`
    );
    categories.value = res.data;
  } catch (err) {
    console.error("Lỗi khi lấy dữ liệu từ FilmCategory:", err.message);
  }
}

onMounted(() => {
  getFilm();
});
</script>

<style scoped>
.film-detail-wrapper {
  background-color: #f9fafb;
  font-family: "Montserrat", sans-serif;
}

/* Card */
.card {
  background-color: #fff;
  border-radius: 20px;
  transition: all 0.3s ease;
}
.card:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
}

/* Poster */
img {
  border-radius: 12px;
  transition: transform 0.3s ease;
}
img:hover {
  transform: scale(1.03);
}

/* Text layout */
h2 {
  font-size: 2rem;
}
h5 {
  font-size: 1.2rem;
}
p {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

/* Trailer video */
.film-trailer video {
  border-radius: 12px;
  background: #000;
}

/* Back button */
.btn-back {
  background: #198754;
  color: #fff;
  font-weight: 600;
  text-decoration: none;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}
.btn-back:hover {
  background: #157347;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .film-detail-page {
    padding: 20px;
  }
  .film-trailer video {
    height: auto;
  }
  .btn-back {
    font-size: 0.9rem;
    padding: 0.4rem 0.9rem;
  }
}
</style>
