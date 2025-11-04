<template>
  <div class="concession-detail-page py-5">
    <div class="container">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/concession" class="text-success text-decoration-none">Concession</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">{{ product.name }}</li>
        </ol>
      </nav>

      <div class="row g-5">
        <!-- Cột trái: Hình ảnh -->
        <div class="col-lg-6">
          <div class="detail-img-wrapper rounded-3 overflow-hidden shadow-sm">
            <img
              :src="product.poster"
              :alt="product.name"
              class="detail-img img-fluid w-100 h-100 object-fit-cover"
            />
          </div>
        </div>

        <!-- Cột phải: Thông tin -->
        <div class="col-lg-6">
          <div class="detail-info">
            <h1 class="detail-name fw-bold text-dark mb-3">{{ product.name }}</h1>

            <!-- Giá -->
            <div class="detail-price mb-4">
              <span class="price-current text-success fs-2 fw-bold">{{ product.price }}</span>
            </div>

            <p class="detail-desc text-muted mb-4 lh-lg">
              {{ product.description }}
            </p>

            <!-- Ưu đãi -->
            <div class="detail-note bg-light p-3 rounded-3 mb-4 border border gainsboro">
              <p class="text-success fw-medium mb-0 d-flex align-items-center">
                <i class="bi bi-gift-fill me-2"></i>
                Nhận trong ngày xem phim
              </p>
            </div>

            <!-- Nút hành động -->
            <div class="d-flex flex-column gap-3">
              <button
                @click="buyNow"
                class="btn btn-success w-100 fw-semibold rounded-pill py-3 shadow-sm"
              >
                Mua Ngay
              </button>
              <button
                @click="addToCart"
                class="btn btn-details w-100 fw-semibold py-3"
              >
                Thêm vào giỏ hàng
              </button>
            </div>

            <!-- Thông tin chi tiết -->
            <div class="mt-5 pt-4 border-top border-gainsboro">
              <h6 class="fw-bold mb-3">Thông tin chi tiết</h6>
              <table class="table table-borderless text-muted small">
                <tbody>
                  <tr>
                    <td class="fw-medium">Kích thước bắp</td>
                    <td>44oz (lớn)</td>
                  </tr>
                  <tr>
                    <td class="fw-medium">Dung tích nước</td>
                    <td>22oz</td>
                  </tr>
                  <tr>
                    <td class="fw-medium">Vị bắp</td>
                    <td>Ngọt</td>
                  </tr>
                  <tr>
                    <td class="fw-medium">Loại nước</td>
                    <td>Pepsi</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Gợi ý combo khác -->
      <div class="mt-6">
        <h3 class="fw-bold mb-4 text-center">Combo khác bạn có thể thích</h3>
        <div class="row g-4">
          <div
            v-for="item in relatedCombos"
            :key="item.id"
            class="col-12 col-sm-6 col-lg-3"
          >
            <div
              @click="goToDetail(item.id)"
              class="combo-card h-100 shadow-sm border-0 rounded-3 overflow-hidden cursor-pointer"
            >
              <div class="combo-img-wrapper">
                <img
                  :src="item.poster"
                  :alt="item.name"
                  class="combo-img img-fluid w-100 h-100 object-fit-cover"
                />
              </div>
              <div class="p-3">
                <h6 class="combo-name fw-bold text-dark mb-1 text-truncate">{{ item.name }}</h6>
                <p class="text-success small fw-medium mb-0">{{ item.price }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Dữ liệu mock (giống hệt Concession.vue)
const mockProducts = [
  {
    id: 1,
    name: 'OL Combo Single Sweet 44oz - Pepsi',
    description: '01 bắp lớn vị ngọt + 01 ly nước 22oz',
    price: '89.000 VND',
    poster: 'https://via.placeholder.com/600x500/28a745/ffffff?text=Popcorn+%2B+Drink'
  },
  // ... thêm các combo khác
];

const relatedCombos = ref([
  {
    id: 2,
    name: 'OL Combo Single Sweet 44oz - Pepsi',
    price: '89.000 VND',
    poster: 'https://via.placeholder.com/300x250/28a745/ffffff?text=Combo+2'
  },
  {
    id: 3,
    name: 'OL Combo Single Sweet 44oz - Pepsi',
    price: '89.000 VND',
    poster: 'https://via.placeholder.com/300x250/28a745/ffffff?text=Combo+3'
  },
  {
    id: 4,
    name: 'OL Combo Single Sweet 44oz - Pepsi',
    price: '89.000 VND',
    poster: 'https://via.placeholder.com/300x250/28a745/ffffff?text=Combo+4'
  },
  {
    id: 5,
    name: 'OL Combo Single Sweet 44oz - Pepsi',
    price: '89.000 VND',
    poster: 'https://via.placeholder.com/300x250/28a745/ffffff?text=Combo+5'
  }
]);

const route = useRoute();
const router = useRouter();
const product = ref({});




onMounted(() => {
  const id = route.params.id;
  product.value = mockProducts.find(p => p.id === parseInt(id)) || mockProducts[0];
});

const buyNow = () => {
  alert(`Đã chọn mua ngay: ${product.value.name}`);
};

const addToCart = () => {
  alert(`Đã thêm "${product.value.name}" vào giỏ hàng!`);
};

const goToDetail = (id) => {
  router.push(`/concession/${id}`);
};
</script>

<style scoped>
.concession-detail-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* Breadcrumb */
.breadcrumb {
  background: none;
  padding: 0;
  margin: 0;
}
.breadcrumb-item + .breadcrumb-item::before {
  content: ">";
  color: #28a745;
}

/* Hình ảnh */
.detail-img-wrapper {
  height: 500px;
  background: #eee;
}
.detail-img {
  transition: transform 0.4s ease;
}
.detail-img:hover {
  transform: scale(1.03);
}

/* Thông tin */
.detail-name {
  font-size: 1.8rem;
  line-height: 1.3;
}
.price-current {
  color: #28a745;
}
.bg-light {
  background-color: #f8f9fa !important;
}

/* Nút */
.btn-success {
  background: linear-gradient(135deg, #28a745, #20c997);
  border: none;
}
.btn-success:hover {
  background: linear-gradient(135deg, #218838, #1daa80);
}

/* Nút Chi Tiết (giống trang danh sách) */
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
  padding: .375rem .75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 30rem;
  transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
}
.btn-details:hover {
  background-color: #d4d4d4;
  border-color: #d4d4d4;
}

/* Combo gợi ý */
.combo-card {
  background: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}
.combo-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
}
.combo-img-wrapper {
  height: 160px;
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
  font-size: 0.9rem;
  min-height: 45px;
}

/* Responsive */
@media (max-width: 768px) {
  .detail-img-wrapper {
    height: 350px;
  }
  .detail-name {
    font-size: 1.5rem;
  }
  .btn {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }
}
</style>