<template>
  <div class="home">
    <!-- Header -->
     <div>
       <HeaderGuest @change-component="setCurrentComponent" />
     </div>
    <!-- Nội dung -->
     <div class="content-wrapper">
    <transition name="fade" mode="out-in">
      <component :is="currentComponent" />
    </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import HeaderGuest from '../header/HeaderGuest.vue'

// import các component con
import Movies from '../load/Movies.vue'
import Products from '../load/Products.vue'
import Promotions from '../load/Promotions.vue'
import Services from '../load/Services.vue'
import About from '../load/About.vue'

const current = ref('Movies') // mặc định load trang phim

const componentsMap = {
  Movies,
  Products,
  Promotions,
  Services,
  About,
}

const currentComponent = computed(() => componentsMap[current.value])

function setCurrentComponent(name) {
  current.value = name
}
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
