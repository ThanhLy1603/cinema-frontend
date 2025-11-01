<template>
  <div class="home">
    <!-- HEADER -->
    <Header @change-component="setCurrentComponent" />

    <!-- NỘI DUNG -->
    <div class="content-wrapper">
      <transition name="fade" mode="out-in">
        <component
          :is="currentComponent"
          @open-film-detail="openFilmDetail"
          :film-id="selectedFilmId"
        />
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, onBeforeUnmount } from "vue";
import Header from "../header/Header.vue";

// === Component con ===
import Films from "../load/Films.vue";
import Products from "../load/Products.vue";
import Promotions from "../load/Promotions.vue";
import Services from "../load/Services.vue";
import About from "../load/About.vue";
import AccountProfile from "../auth/AccountProfile.vue";
import FilmDetail from "../home/FilmDetail.vue";

// === Biến chính ===
const current = ref("Films"); // mặc định trang phim
const selectedFilmId = ref(null); // id phim đang xem chi tiết
const $swal = inject("$swal");

// === Map component ===
const componentsMap = {
  Films,
  Products,
  Promotions,
  Services,
  About,
  AccountProfile,
  FilmDetail,
};

const currentComponent = computed(() => componentsMap[current.value]);

// === Hàm đổi component (từ Header) ===
function setCurrentComponent(name) {
  current.value = name;
}

// === Khi mở chi tiết phim ===
function openFilmDetail(filmId) {
  selectedFilmId.value = filmId;
  current.value = "FilmDetail";

  // ✅ Thêm trạng thái vào lịch sử trình duyệt (để Back hoạt động)
  history.pushState({ view: "FilmDetail" }, "", "#film-detail");
}

// === Xử lý khi người dùng bấm Back trên trình duyệt ===
function handlePopState() {
  if (current.value === "FilmDetail") {
    current.value = "Films";
    selectedFilmId.value = null;
  }
}

// === Gắn / gỡ event khi mount / unmount ===
onMounted(() => {
  window.addEventListener("popstate", handlePopState);
});
onBeforeUnmount(() => {
  window.removeEventListener("popstate", handlePopState);
});
</script>

<style scoped>
.home {
  text-align: center;
  padding: 10px;
}

.content-wrapper {
  margin-top: 10px;
  padding: 20px;
  min-height: 400px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
