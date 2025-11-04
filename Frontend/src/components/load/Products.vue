<template>
  <div class="concession-page py-5">
    <div class="container">
      <!-- Tiêu đề Concession -->
      <div class="text-center mb-5">
        <h2 class="concession-title d-inline-block px-4 py-2 rounded-pill text-white fw-bold">
          Concession
        </h2>
      </div>

      <!-- Danh sách combo -->
      <div class="row g-4">
        <div
          v-for="combo in combos"
          :key="combo.id"
          class="col-12 col-sm-6 col-lg-3"
        >
          <div class="combo-card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
            <!-- Hình ảnh -->
            <div class="combo-img-wrapper">
              <img
                :src="combo.poster"
                :alt="combo.name"
                class="combo-img img-fluid w-100 h-100 object-fit-cover"
              />
            </div>

            <!-- Nội dung -->
            <div class="p-3">
              <h5 class="combo-name fw-bold text-dark mb-2">{{ combo.name }}</h5>
              <p class="combo-desc text-muted small mb-2">{{ combo.description }}</p>
              <p class="combo-note text-success small fw-medium mb-3">
                {{ combo.price }}
              </p>
              <button
                @click="buyNow(combo)"
                class="btn btn-success w-100 fw-semibold rounded-pill py-2"
              >
                Mua Ngay
              </button>
              <button
                @click="viewDetails(combo.id)"
                class="btn btn-details w-100 fw-semibold py-2"
              >
                Chi Tiết
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';

// Dữ liệu combo (có thể fetch từ API sau)
const combos = ref([
  {
    id: 1,
    name: 'OL Combo Single Sweet 44oz - Pepsi',
    description: '01 bắp lớn vị ngọt + 01 ly nước 22oz',
    price: '89.000 VND',
    poster: 'https://via.placeholder.com/300x250/28a745/ffffff?text=Popcorn+%2B+Drink'
  },
  {
    id: 2,
    name: 'OL Combo Single Sweet 44oz - Pepsi',
    description: '01 bắp lớn vị ngọt + 01 ly nước 22oz',
    price: '89.000 VND',
    poster: 'https://via.placeholder.com/300x250/28a745/ffffff?text=Popcorn+%2B+Drink'
  },
  {
    id: 3,
    name: 'OL Combo Single Sweet 44oz - Pepsi',
    description: '01 bắp lớn vị ngọt + 01 ly nước 22oz',
    price: '89.000 VND',
    poster: 'https://via.placeholder.com/300x250/28a745/ffffff?text=Popcorn+%2B+Drink'
  },
  {
    id: 4,
    name: 'OL Combo Single Sweet 44oz - Pepsi',
    description: '01 bắp lớn vị ngọt + 01 ly nước 22oz',
    price: '89.000 VND',
    poster: 'https://via.placeholder.com/300x250/28a745/ffffff?text=Popcorn+%2B+Drink'
  },
  {
    id: 5,
    name: 'OL Combo Single Sweet 44oz - Pepsi',
    description: '01 bắp lớn vị ngọt + 01 ly nước 22oz',
    price: '89.000 VND',
    poster: 'https://via.placeholder.com/300x250/28a745/ffffff?text=Popcorn+%2B+Drink'
  },
  {
    id: 6,
    name: 'OL Combo Single Sweet 44oz - Pepsi',
    description: '01 bắp lớn vị ngọt + 01 ly nước 22oz',
    price: '89.000 VND',
    poster: 'https://via.placeholder.com/300x250/28a745/ffffff?text=Popcorn+%2B+Drink'
  },
  {
    id: 7,
    name: 'OL Combo Single Sweet 44oz - Pepsi',
    description: '01 bắp lớn vị ngọt + 01 ly nước 22oz',
    price: '89.000 VND',
    poster: 'https://via.placeholder.com/300x250/28a745/ffffff?text=Popcorn+%2B+Drink'
  },
  {
    id: 8,
    name: 'OL Combo Single Sweet 44oz - Pepsi',
    description: '01 bắp lớn vị ngọt + 01 ly nước 22oz',
    price: '89.000 VND',
    poster: 'https://via.placeholder.com/300x250/28a745/ffffff?text=Popcorn+%2B+Drink'
  }
]);
  const router = useRouter();
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
   const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || '';

// Hàm xử lý khi nhấn "Chi Tiết"
const viewDetails = (combo) => {
  alert(`Chi tiết về: ${combo.name}`);
};

// Hàm xử lý khi nhấn "Mua Ngay"
const buyNow = (combo) => {
  alert(`Đã chọn: ${combo.name}`);
  // TODO: Thêm vào giỏ hàng, chuyển hướng, gọi API...
};
</script>
<style scoped>
.concession-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.concession-title {
  background: linear-gradient(135deg, #28a745, #20c997);
  font-size: 1.75rem;
  letter-spacing: 1px;
}

.combo-card {
  background: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.combo-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
}

.combo-img-wrapper {
  height: 180px;
  overflow: hidden;
  background: #eee;
}

.combo-img {
  transition: transform 0.4s ease;
}

.combo-card:hover .combo-img {
  transform: scale(1.05);
}

.combo-name {
  font-size: 0.95rem;
  line-height: 1.4;
  min-height: 50px;
}

.combo-desc {
  font-size: 0.85rem;
  line-height: 1.5;
}

.combo-note {
  color: #28a745 !important;
  font-size: 0.8rem;
}
.btn-details {
  display: inline-block;
    font-weight: 400;
    color: #212529;
    text-align: center;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-color: gainsboro;
    border: 1px solid transparent;
    margin-top: 10px;
    padding: .375rem .75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: 30rem;
    transition: color .15s 
ease-in-out, background-color .15s 
ease-in-out, border-color .15s 
ease-in-out, box-shadow .15s 
ease-in-out;    
}

/* Responsive */
@media (max-width: 576px) {
  .concession-title {
    font-size: 1.5rem;
  }
  .combo-img-wrapper {
    height: 140px;
  }
}
</style>