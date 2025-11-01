<template>
  <div class="admin-dashboard">
    <aside class="sidebar">
      <h2 class="logo">Admin</h2>
      <nav>
        <ul>
          <li :class="{ active: isActive('/admin/films') }">
            <router-link to="/admin/films">🎬 Quản lý phim</router-link>
          </li>

          <li :class="{ active: isActive('/admin/CategoryManager') }">
            <router-link to="/admin/CategoryManager">♥ Quản lý danh mục</router-link>
          </li>

          <li>
            <button class="logout-btn" @click="logout">Đăng xuất</button>
          </li>
        </ul>
      </nav>
    </aside>

    <main class="main-content">
      <header class="topbar">
        <h1>{{ pageTitle }}</h1>
      </header>
      <section class="content-area">
     
        <router-view />
      </section>
    </main>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "CategoryManager ",
  setup() {
    const route = useRoute();
    const router = useRouter();

    const pageTitle = ref("Bảng điều khiển");

    function updateTitle() {
      if (route.path.includes("films")) {
        pageTitle.value = "Quản lý phim";
      } else {
        pageTitle.value = "Bảng điều khiển";
      }
    }

    function isActive(path) {
      return route.path === path;
    }

    function logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      router.push("/login");
    }

    watch(route, function () {
      updateTitle();
    });


    updateTitle();

    return {
      pageTitle,
      isActive,
      logout
    };
  }
};
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  height: 100vh;
  background: #f9fafb;
  color: #111827;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 240px;
  background: #1f2937;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 20px;
}
.logo {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 24px;
}
.sidebar nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sidebar nav li {
  margin-bottom: 12px;
}
.sidebar nav a {
  text-decoration: none;
  color: #e5e7eb;
  display: block;
  padding: 10px 12px;
  border-radius: 6px;
  transition: background 0.2s;
}
.sidebar nav a:hover {
  background: #374151;
}
.sidebar nav li.active a {
  background: #2563eb;
  color: #fff;
}
.logout-btn {
  margin-top: 20px;
  width: 100%;
  background: #dc2626;
  border: none;
  color: white;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}
.logout-btn:hover {
  background: #b91c1c;
}

/* Main content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
}
.topbar {
  background: #f3f4f6;
  padding: 14px 20px;
  border-bottom: 1px solid #e5e7eb;
}
.topbar h1 {
  margin: 0;
  font-size: 20px;
}
.content-area {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>
