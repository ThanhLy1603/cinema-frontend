<template>
  <div class="films-page">
    <div class="header">
      <button class="btn" @click="goBack">← Trở lại</button>
      <button class="btn primary" @click="createFilm">+ Tạo phim</button>
    </div>

    <form @submit.prevent="createFilm" class="form-card">
      <div class="grid">
        <div class="field">
          <label>Tên phim *</label>
          <input v-model="film.name" required />
        </div>

        <div class="field">
          <label>Ngày chiếu *</label>
          <input type="date" v-model="film.releaseDate" required />
        </div>

        <div class="field">
          <label>Trailer *</label>
          <input v-model="film.trailer" placeholder="https://youtube.com/..." required />
        </div>

        <div class="field">
          <label>Thời lượng (phút) *</label>
          <input type="number" v-model.number="film.duration" required />
        </div>

        <div class="field desc">
          <label>Mô tả *</label>
          <textarea v-model="film.description" required></textarea>
        </div>

        <div class="field">
          <label>Đạo diễn *</label>
          <input v-model="film.director" required />
        </div>

        <div class="field">
          <label>Trạng thái *</label>
          <select v-model="film.status" required>
            <option value="Đang chiếu">Đang chiếu</option>
            <option value="Sắp chiếu">Sắp chiếu</option>
            <option value="Ngừng chiếu">Ngừng chiếu</option>
          </select>
        </div>

        <div class="field">
          <label>Diễn viên *</label>
          <input v-model="film.actor" required />
        </div>

        <div class="field">
          <label>Quốc gia *</label>
          <input v-model="film.country" required />
        </div>

        <div class="field">
          <label>Poster (URL) *</label>
          <input v-model="film.poster" placeholder="https://..." required />
          <img v-if="film.poster" :src="film.poster" class="poster-preview" alt="Poster preview" />
        </div>
      </div>

      <div class="footer">
        <button type="submit" class="btn primary">Lưu phim</button>
      </div>
    </form>

    <div v-if="toast.message" :class="['toast', toast.type]">{{ toast.message }}</div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "Films",
  setup() {
    const API_URL = "http://localhost:8080/api/films";

    const film = ref({
      name: "",
      country: "",
      director: "",
      actor: "",
      description: "",
      duration: "",
      poster: "",
      trailer: "",
      releaseDate: "",
      status: "Sắp chiếu",
      isDeleted: false
    });

    const toast = ref({ message: "", type: "" });

    function showToast(msg, type) {
      if (type === undefined) type = "success";
      toast.value = { message: msg, type: type };
      setTimeout(function () {
        toast.value.message = "";
      }, 2500);
    }

    function goBack() {
      history.back();
    }

    async function createFilm() {
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(film.value)
        });

        if (!response.ok) {
          throw new Error("HTTP " + response.status);
        }

        showToast("Tạo phim thành công!");
        for (var key in film.value) {
          if (key !== "status" && key !== "isDeleted") {
            film.value[key] = "";
          }
          if (key === "isDeleted") film.value[key] = false;
        }
      } catch (error) {
        console.error(error);
        showToast("Tạo phim thất bại!", "error");
      }
    }

    return {
      film,
      toast,
      showToast,
      goBack,
      createFilm
    };
  }
};
</script>

<style scoped>
.films-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
}
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}
.btn {
  background: #e5e7eb;
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  cursor: pointer;
  font-weight: 600;
}
.btn.primary {
  background: #16a34a;
  color: #fff;
}
.form-card {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.field {
  display: flex;
  flex-direction: column;
}
.desc {
  grid-column: 1 / span 2;
}
.poster-preview {
  margin-top: 6px;
  max-height: 160px;
  border-radius: 8px;
  border: 1px solid #ccc;
  object-fit: cover;
}
.footer {
  margin-top: 16px;
  text-align: right;
}
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 16px;
  color: #fff;
  border-radius: 8px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
.toast.success {
  background: #10b981;
}
.toast.error {
  background: #ef4444;
}
</style>
