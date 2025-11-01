<template>
  <div class="films-page">
    <div class="header">
      <button class="btn" @click="goBack">← Trở lại</button>
    </div>
    
    <h2>{{ isEditing ? 'Cập nhật phim: ' + film.name : 'Thêm phim mới' }}</h2>

    <form @submit.prevent="handleFormSubmit" class="form-card">
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
          <label>Trailer (URL) *</label>
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
        <button type="submit" class="btn primary">
          {{ isEditing ? 'Lưu thay đổi' : 'Tạo phim' }}
        </button>
      </div>
    </form>

    <div v-if="toast.message" :class="['toast', toast.type]">{{ toast.message }}</div>
  </div>
</template>

<script>
import { ref, watch, computed, onMounted } from "vue";
import axios from 'axios'; // ⭐ Đã import Axios

// Sử dụng API Admin đã thống nhất: /api/admin/films
const API_URL = "http://localhost:8080/api/admin/films";

export default {
  name: "FilmsManager",
  // Nhận prop filmToEdit để xác định chế độ SỬA
  props: {
    filmToEdit: {
      type: Object,
      default: null 
    }
  },
  // Đổi emits sang go-back và save-success
  emits: ["go-back", "save-success"], 
  setup(props, { emit }) {
    
    // Khai báo state ban đầu
    const initialFilmState = {
        name: "", country: "", director: "", actor: "", 
        description: "", duration: null, poster: "", 
        trailer: "", releaseDate: "", status: "Sắp chiếu", 
        isDeleted: false
    };

    const film = ref({...initialFilmState});
    const toast = ref({ message: "", type: "" });
    
    // Computed: Kiểm tra xem đang ở chế độ chỉnh sửa hay không
    const isEditing = computed(() => !!props.filmToEdit && !!props.filmToEdit.id);

    // ⭐ WATCHER: Theo dõi prop filmToEdit để load dữ liệu vào form
    watch(() => props.filmToEdit, (newFilm) => {
        if (newFilm) {
            // Sao chép dữ liệu phim cần sửa vào film.value
            film.value = { ...newFilm }; 
        } else {
            // Reset form khi chuyển sang chế độ tạo mới
            film.value = {...initialFilmState}; 
        }
    }, { immediate: true }); 

    function showToast(msg, type = "success") {
      toast.value = { message: msg, type: type };
      setTimeout(() => {
        toast.value.message = "";
      }, 2500);
    }

    // Gửi sự kiện go-back lên component cha
    function goBack() {
      emit("go-back"); 
    }
    
    // ⭐ Hàm xử lý chung cho submit form (POST hoặc PUT)
    async function handleFormSubmit() {
        if (isEditing.value) {
            await updateFilm();
        } else {
            await createFilm();
        }
    }

    // ⭐ API POST: Tạo phim mới với Axios (JSON)
    async function createFilm() {
      const dataToSend = { ...film.value, isDeleted: false };
      
      try {
        // Gửi POST request bằng Axios
        const response = await axios.post(API_URL, dataToSend); 

        if (response.status === 201 || response.status === 200) { 
          showToast("Tạo phim thành công!");
          
          // Reset form
          film.value = {...initialFilmState}; 

          // Thông báo cho component cha tải lại danh sách
          emit('save-success');
        } 
      } catch (error) {
        console.error("Lỗi tạo phim:", error);
        showToast("Tạo phim thất bại! " + (error.response?.data?.message || error.message), "error");
      }
    }
    
    // ⭐ API PUT: Cập nhật phim với Axios (JSON)
    async function updateFilm() {
        const dataToSend = { ...film.value };
        
        try {
            // Gửi PUT request bằng Axios
            const response = await axios.put(`${API_URL}/${dataToSend.id}`, dataToSend); 
            
            if (response.status === 200) { 
                showToast("Cập nhật phim thành công!");
                // Thông báo cho component cha tải lại danh sách
                emit('save-success');
            } 
        } catch (error) {
            console.error("Lỗi cập nhật phim:", error);
            showToast("Cập nhật phim thất bại! " + (error.response?.data?.message || error.message), "error");
        }
    }

    return {
      film,
      toast,
      isEditing,
      showToast,
      goBack,
      handleFormSubmit, // Đã thay thế createFilm trong @submit
      createFilm,
      updateFilm
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
