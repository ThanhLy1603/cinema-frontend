<template>
  <div class="container-fluid product-price-page mt-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="fw-bold text-success">💲 Quản lý Giá Sản Phẩm</h3>
    </div>

    <div class="row g-3">
      <div class="col-md-4">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <h5 class="card-title text-success text-center mb-3">
              {{ isEditing ? '✏️ Chỉnh sửa giá sản phẩm' : '+ Thêm giá sản phẩm' }}
            </h5>
            <form @submit.prevent="submitPrice">
              <div class="mb-3">
                <label class="form-label fw-semibold">Sản phẩm *</label>
                <select 
                  v-model="price.productId" 
                  class="form-select" 
                  required
                  :disabled="isEditing" 
                >
                  <option value="">Chọn sản phẩm...</option>
                  <option v-for="p in products" :key="p.id" :value="p.id">
                    {{ p.name }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Giá *</label>
                <input type="number" v-model="price.price" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Ngày bắt đầu *</label>
                <input type="date" v-model="price.startDate" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Ngày kết thúc</label>
                <input type="date" v-model="price.endDate" class="form-control" />
              </div>
              
              <button 
                type="submit" 
                :class="['btn w-100', isEditing ? 'btn-warning text-white' : 'btn-success']"
              >
                {{ isEditing ? 'Cập nhật giá' : '+ Thêm giá' }}
              </button>

              <button 
                v-if="isEditing" 
                type="button" 
                class="btn btn-secondary w-100 mt-2" 
                @click="cancelEdit"
              >
                Hủy
              </button>
            </form>
          </div>
        </div>
      </div>

      <div class="col-md-8">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="card-title fw-bold mb-0">Danh sách giá sản phẩm</h5>
              <div class="input-group" style="width: 240px">
                <span class="input-group-text bg-success text-white">Tìm kiếm</span>
                <input
                  type="text"
                  class="form-control"
                  v-model="searchQuery"
                  placeholder="Tìm sản phẩm..."
                />
              </div>
            </div>

            <table class="table table-hover align-middle text-center">
              <thead class="table-success">
                <tr>
                  <th>Sản phẩm</th>
                  <th>Giá</th>
                  <th>Ngày bắt đầu</th>
                  <th>Ngày kết thúc</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="paginatedPrices.length === 0">
                  <td colspan="5" class="text-muted fst-italic">
                    Không tìm thấy giá sản phẩm nào.
                  </td>
                </tr>

                <tr v-for="item in paginatedPrices" :key="item.id">
                  <td>{{ getProductName(item.productId) }}</td>
                  <td>{{ formatPrice(item.price) }}</td>
                  <td>{{ formatDate(item.startDate) }}</td>
                  <td>{{ item.endDate ? formatDate(item.endDate) : '-' }}</td>
                  <td>
                    <button class="btn btn-sm btn-info text-white me-2" @click="startEdit(item)">
                      Sửa
                    </button>
                    <button class="btn btn-sm btn-danger" @click="deletePrice(item)">
                      Xóa
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <nav v-if="filteredPrices.length > itemsPerPage">
              <ul class="pagination justify-content-center">
                <li
                  class="page-item"
                  :class="{ disabled: currentPage === 1 }"
                  @click="prevPage"
                >
                  <span class="page-link">←</span>
                </li>
                <li
                  v-for="page in totalPages"
                  :key="page"
                  class="page-item"
                  :class="{ active: currentPage === page }"
                  @click="setPage(page)"
                >
                  <span class="page-link">{{ page }}</span>
                </li>
                <li
                  class="page-item"
                  :class="{ disabled: currentPage === totalPages }"
                  @click="nextPage"
                >
                  <span class="page-link">→</span>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="toast.message"
        class="toast-custom"
        :class="toast.type === 'error' ? 'bg-danger' : 'bg-success'"
      >
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

// Cấu hình API và Token
const API_URL = import.meta.env.VITE_API_BASE_URL + '/admin/product-prices';
const PRODUCT_API = import.meta.env.VITE_API_BASE_URL + '/admin/products'; 
const token = localStorage.getItem('token');

// Biến trạng thái
const products = ref([]);
const prices = ref([]);
const price = ref({ productId: '', price: null, startDate: '', endDate: '' });
const toast = ref({ message: '', type: '' });
const searchQuery = ref('');

// Biến phân trang
const currentPage = ref(1);
const itemsPerPage = 10;

// Biến chỉnh sửa
const isEditing = ref(false); 
const editingId = ref(null); 

// =======================
// ===== HELPERS & UI =====
// =======================

function showToast(msg, type = 'success') {
  toast.value = { message: msg, type };
  setTimeout(() => (toast.value.message = ''), 2500);
}

async function showConfirm(message) {
  const result = await Swal.fire({
    title: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Huỷ',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    reverseButtons: true
  });
  return result.isConfirmed;
}

function getProductName(id) {
  const p = products.value.find(p => p.id === id);
  return p ? p.name : 'Unknown';
}

function formatPrice(value) {
  if (value === null || value === undefined) return '-';
  // Định dạng số tiền
  return value.toLocaleString('vi-VN') + ' VNĐ';
}

function formatDate(dateString) {
    if (!dateString) return '-';
    // Chuyển đổi sang định dạng dd/mm/yyyy
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toLocaleDateString('vi-VN');
}

// =======================
// ===== CRUD LOGIC =====
// =======================

async function fetchProducts() {
  try {
    // Đảm bảo lấy hết tất cả sản phẩm (ví dụ size=5000) cho dropdown
    const res = await axios.get(`${PRODUCT_API}?size=5000`, { 
      headers: { Authorization: `Bearer ${token}` }
    });
    // Lấy dữ liệu sản phẩm, kiểm tra nếu API trả về object có content hay trả về mảng trực tiếp
    products.value = res.data.content || res.data; 
  } catch (err) {
    showToast('Không thể tải danh sách sản phẩm!', 'error');
  }
}

async function fetchPrices() {
  try {
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
    prices.value = res.data;
  } catch (err) {
    showToast('Không thể tải giá sản phẩm!', 'error');
  }
}

// Khởi tạo chế độ chỉnh sửa (gán dữ liệu vào form)
function startEdit(item) {
  isEditing.value = true;
  editingId.value = item.id;
  price.value = {
    productId: item.productId,
    price: item.price,
    // Đảm bảo startDate và endDate là string YYYY-MM-DD để input type="date" hoạt động
    startDate: item.startDate, 
    endDate: item.endDate
  };
}

// Hủy chế độ chỉnh sửa và reset form
function cancelEdit() {
  isEditing.value = false;
  editingId.value = null;
  price.value = { productId: '', price: null, startDate: '', endDate: '' };
}


// Hàm Xử lý Form chung (Thêm mới hoặc Cập nhật)
async function submitPrice() {
  if (!price.value.productId || price.value.price === null || price.value.price === '' || !price.value.startDate) {
    showToast('Vui lòng điền đầy đủ thông tin bắt buộc!', 'error');
    return;
  }
  
  if (price.value.endDate && price.value.startDate > price.value.endDate) {
    showToast('Ngày kết thúc phải sau hoặc bằng Ngày bắt đầu!', 'error');
    return;
  }

  const payload = {
    product: { id: price.value.productId },
    price: price.value.price,
    startDate: price.value.startDate,
    endDate: price.value.endDate || null // Gửi null nếu ngày kết thúc trống
  };

  try {
    if (isEditing.value) {
      // Cập nhật (PUT)
      await axios.put(`${API_URL}/${editingId.value}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Cập nhật giá sản phẩm thành công!');
    } else {
      // Thêm mới (POST)
      await axios.post(API_URL, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Thêm giá sản phẩm thành công!');
    }

    cancelEdit(); // Reset form sau khi thành công
    fetchPrices(); // Tải lại danh sách
  } catch (err) {
    showToast(err.response?.data?.message || `Lỗi ${isEditing.value ? 'cập nhật' : 'thêm'} giá!`, 'error');
  }
}


async function deletePrice(item) {
  const confirmed = await showConfirm(`Xác nhận xóa giá ${formatPrice(item.price)} của "${getProductName(item.productId)}"?`);
  if (!confirmed) return;
  try {
    await axios.delete(`${API_URL}/${item.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    showToast('Xóa thành công!');
    fetchPrices();
  } catch (err) {
    showToast(err.response?.data?.message || 'Lỗi xóa!', 'error');
  }
}

// =======================
// ===== PAGINATION & SEARCH =====
// =======================

const filteredPrices = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return prices.value;
  // Lọc theo tên sản phẩm
  return prices.value.filter(p => getProductName(p.productId).toLowerCase().includes(query));
});

const totalPages = computed(() => Math.ceil(filteredPrices.value.length / itemsPerPage));

const paginatedPrices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredPrices.value.slice(start, start + itemsPerPage);
});

function setPage(page) {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page;
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

// Reset trang về 1 khi tìm kiếm thay đổi
watch(searchQuery, () => (currentPage.value = 1));

// =======================
// ===== LIFECYCLE HOOKS =====
// =======================
onMounted(() => {
  fetchProducts();
  fetchPrices();
});
</script>

<style scoped>
.toast-custom {
  position: fixed;
  top: 20px;
  right: 20px;
  color: #fff;
  font-weight: 600;
  border-radius: 8px;
  padding: 10px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: 0.3s ease;
  z-index: 1055;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>