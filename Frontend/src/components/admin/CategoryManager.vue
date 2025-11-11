<template>
  <div class="container-fluid categories-page mt-3">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="fw-bold text-success">📂 Quản lý Danh Mục</h3>
    </div>

    <div class="row g-3">
      <!-- Form tạo danh mục -->
      <div class="col-md-4">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <h5 class="card-title text-success text-center mb-3">+ Thêm danh mục mới</h5>

            <form @submit.prevent="createCategory">
              <div class="mb-3">
                <label class="form-label fw-semibold">Tên danh mục *</label>
                <input
                  v-model="category.name"
                  type="text"
                  class="form-control"
                  placeholder="Nhập tên danh mục..."
                  required
                />
              </div>
              <button type="submit" class="btn btn-success w-100">
                + Thêm danh mục
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Danh sách danh mục -->
      <div class="col-md-8">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="card-title fw-bold mb-0">Danh sách danh mục</h5>
              <div class="input-group" style="width: 240px">
                <span class="input-group-text bg-success text-white">Tìm kiếm</span>
                <input
                  type="text"
                  class="form-control"
                  v-model="searchQuery"
                  placeholder="Tìm danh mục..."
                />
              </div>
            </div>

            <table class="table table-hover align-middle text-center">
              <thead class="table-success">
                <tr>
                  <th>Tên danh mục</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="paginatedCategories.length === 0">
                  <td colspan="3" class="text-muted fst-italic">
                    Không tìm thấy danh mục nào.
                  </td>
                </tr>

                <tr v-for="item in paginatedCategories" :key="item.id">
                  <td class="fw-semibold">{{ item.name }}</td>
                  <td>
                    <span
                      :class="item.isDeleted ? 'badge bg-danger' : 'badge bg-success'"
                    >
                      {{ item.isDeleted ? 'Đã xóa' : 'Hoạt động' }}
                    </span>
                  </td>
                  <td>
                    <button
                      class="btn btn-sm btn-danger"
                      @click="deleteCategory(item)"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Phân trang -->
            <nav v-if="filteredCategories.length > itemsPerPage">
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

    <!-- Toast -->
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

const API_URL = import.meta.env.VITE_API_BASE_URL + '/admin/categories';

const categories = ref([]);
const category = ref({ name: '' });
const toast = ref({ message: '', type: '' });
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

/* ===== Toast ===== */
function showToast(msg, type = 'success') {
  toast.value = { message: msg, type };
  setTimeout(() => (toast.value.message = ''), 2500);
}

/* ===== Lấy danh sách danh mục ===== */
async function fetchCategories() {
  try {
    const res = await axios.get(API_URL);
    categories.value = res.data.filter((c) => !c.isDeleted);
  } catch (err) {
    showToast('Không thể tải danh mục!', 'error');
  }
}

/* ===== Tạo danh mục ===== */
async function createCategory() {
  if (!category.value.name.trim()) {
    showToast('Vui lòng nhập tên danh mục!', 'error');
    return;
  }
  try {
    await axios.post(API_URL, category.value);
    showToast('Thêm danh mục thành công!');
    category.value = { name: '' };
    await fetchCategories();
  } catch (err) {
    const msg = err.response?.data?.message || 'Lỗi khi thêm danh mục!';
    showToast(msg, 'error');
  }
}

/* ===== Xóa danh mục ===== */
async function deleteCategory(item) {
  if (!confirm(`Xác nhận xóa danh mục "${item.name}"?`)) return;
  try {
    await axios.delete(`${API_URL}/${item.id}`);
    showToast('Danh mục đã được xóa!');
    await fetchCategories();
  } catch (err) {
    const msg = err.response?.data?.message || 'Không thể xóa danh mục này!';
    showToast(msg, 'error');
  }
}

/* ===== Tìm kiếm + Phân trang ===== */
const filteredCategories = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return categories.value;
  return categories.value.filter((c) => c.name.toLowerCase().includes(query));
});

const totalPages = computed(() =>
  Math.ceil(filteredCategories.value.length / itemsPerPage)
);

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredCategories.value.slice(start, start + itemsPerPage);
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

watch(searchQuery, () => (currentPage.value = 1));

onMounted(fetchCategories);
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
