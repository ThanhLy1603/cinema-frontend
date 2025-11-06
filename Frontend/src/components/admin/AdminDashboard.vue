<template>
  <div class="admin-dashboard">
    <Header></Header>

    <main class="admin-main">
      <div class="breadcrumb">
        <span @click="goBack" class="link">Hạng mục quản lý</span>
        <template v-if="activeComponent">
          <span> / </span>
          <span>{{ activeTitle }}</span>
        </template>
      </div>

      <div class="content-area">
        <!-- Hiển thị component động -->
        <component
          :is="currentComponent"
          @open="handleOpen"
        />
      </div>
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
import RoomsManager from "../admin/RoomsManager.vue";

export default {
  name: "AdminDashboard",
  components: { Header, AdminIndex, FilmsManager,ShowTimes,RoomsManager},

  setup() {
    const activeComponent = ref(null);

    const components = {
      AdminIndex,
      FilmsManager,
      ShowTimes,
      RoomsManager,
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

    function goBack() {
      activeComponent.value = null;
    }

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
