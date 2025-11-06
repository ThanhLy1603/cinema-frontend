<template>
  <div class="admin-dashboard">
    <aside class="sidebar">
      <h2 class="logo">Admin</h2>
      <nav>
        <ul>
          <li :class="{ active: isActive('/admin/films') }">
            <router-link to="/admin/films">🎬 Quản lý phim</router-link>
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
        <!-- Đây là nơi hiển thị các component con (FilmsManager, v.v.) -->
        <router-view />
      </section>
    </main>

    <footer class="footer">footer</footer>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import Header from "../header/Header.vue";
import AdminIndex from "../admin/AdminIndex.vue";
import FilmsManager from "../admin/FilmsManager.vue";
import ShowTimes from "../admin/ShowTimes.vue";

export default {
  name: "AdminDashboard",
<<<<<<< HEAD
=======
  components: { Header, AdminIndex, FilmsManager,ShowTimes},

>>>>>>> 17f5846663e8448bd9ef7f0b9be236db971ceb27
  setup() {
    const activeComponent = ref(null);

    const components = {
      AdminIndex,
      FilmsManager,
      ShowTimes,
    };

    const currentComponent = computed(function () {
      return activeComponent.value ? components[activeComponent.value] : AdminIndex;
    });

    const activeTitle = computed(function () {
      var map = {
        FilmsManager: " Phim",
        ShowTimes:" Giờ chiếu",
      };
      return map[activeComponent.value] || "";
    });

    function handleOpen(componentName) {
      activeComponent.value = componentName;
    }

    watch(route, function () {
      updateTitle();
    });

    // Gọi lần đầu
    updateTitle();

    return {
      activeComponent,
      currentComponent,
      activeTitle,
      handleOpen,
      goBack
    };
  }
};
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.admin-main {
  flex: 1;
  background: #fff;
  padding: 20px;
}
.breadcrumb {
  font-size: 18px;
  font-weight: bold;
  color: #1a6d36;
  border-left: 5px solid #1a6d36;
  padding-left: 10px;
  margin-bottom: 25px;
}
.breadcrumb .link {
  cursor: pointer;
  color: #1a6d36;
}
.footer {
  background: #cbd5e1;
  text-align: center;
  padding: 20px;
  font-size: 32px;
  font-weight: bold;
}
</style>
