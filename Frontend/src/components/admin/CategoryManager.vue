<template>
  <div class="categories-page">
    <div class="header">
      <button class="btn" @click="goBack">← Trở lại</button>
    </div>

    <!-- Form tạo danh mục -->
    <form @submit.prevent="createCategory" class="form-card">
      <div class="grid">
        <div class="field">
          <label>Tên danh mục *</label>
          <input v-model="category.name" placeholder="Nhập tên danh mục..." required />
        </div>
      </div>

      <div class="footer">
        <button type="submit" class="btn primary">+ Tạo danh mục</button>
      </div>
    </form>

    <!-- Danh sách danh mục -->
    <div class="list-card" v-if="categories.length">
      <h3>Danh sách danh mục</h3>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên danh mục</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in categories" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>
              <span :class="item.isDeleted ? 'status deleted' : 'status active'">
                {{ item.isDeleted ? 'Đã xóa' : 'Hoạt động' }}
              </span>
            </td>
            <td>
              <button class="btn danger" @click="deleteCategory(item.id)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="empty">Chưa có danh mục nào.</div>

    <div v-if="toast.message" :class="['toast', toast.type]">{{ toast.message }}</div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  name: "Categories",
  setup() {
    const API_URL = "http://localhost:8080/api/categories";
    const category = ref({ name: "" });
    const categories = ref([]);
    const toast = ref({ message: "", type: "" });

    function showToast(msg, type = "success") {
      toast.value = { message: msg, type };
      setTimeout(() => (toast.value.message = ""), 2500);
    }

    function goBack() {
      history.back();
    }

    async function fetchCategories() {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("HTTP " + res.status);
        categories.value = await res.json();
      } catch (err) {
        console.error(err);
        showToast("Không thể tải danh mục!", "error");
      }
    }

    async function createCategory() {
      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: category.value.name,
            isDeleted: false,
          }),
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
        showToast("Tạo danh mục thành công!");
        category.value.name = "";
        fetchCategories();
      } catch (err) {
        console.error(err);
        showToast("Tạo danh mục thất bại!", "error");
      }
    }

    async function deleteCategory(id) {
      if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;
      try {
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("HTTP " + res.status);
        showToast("Xóa thành công!");
        fetchCategories();
      } catch (err) {
        console.error(err);
        showToast("Xóa thất bại!", "error");
      }
    }

    onMounted(fetchCategories);

    return {
      category,
      categories,
      toast,
      goBack,
      createCategory,
      deleteCategory,
    };
  },
};
</script>

<style scoped>
.categories-page {
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
  transition: 0.2s;
}

.btn:hover {
  opacity: 0.85;
}

.btn.primary {
  background: #16a34a;
  color: #fff;
}

.btn.danger {
  background: #dc2626;
  color: #fff;
}

.form-card,
.list-card {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
}

.footer {
  margin-top: 16px;
  text-align: right;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
}

.table th,
.table td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

.table th {
  background: #f3f4f6;
}

.empty {
  text-align: center;
  color: #6b7280;
}

.status {
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
}

.status.active {
  background: #dcfce7;
  color: #15803d;
}

.status.deleted {
  background: #fee2e2;
  color: #b91c1c;
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
