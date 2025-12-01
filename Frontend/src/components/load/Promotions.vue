<template>
   <div class="promotion-section">
      <h2 class="title">Ưu đãi đặc biệt</h2>

      <div class="carousel-wrapper">
         <button class="nav-btn left" @click="prevSlide">‹</button>

         <div class="carousel">
            <div
               class="slide"
               v-for="(slide, sIndex) in slides"
               :key="sIndex"
               :class="{ active: currentSlide === sIndex }"
            >
               <div
                  class="promo-card"
                  v-for="promo in slide"
                  :key="promo.id"
                  @click="openDetail(promo)"
               >
                  <img class="poster" :src="IMG_URL + promo.poster" v-if="promo.poster" />

                  <div class="promo-info">
                     <h3 class="promo-title">{{ promo.name }}</h3>
                     <p class="promo-desc">{{ promo.description }}</p>
                  </div>
               </div>
            </div>
         </div>

         <button class="nav-btn right" @click="nextSlide">›</button>
      </div>

      <div class="dots">
         <span
            class="dot"
            v-for="i in slides.length"
            :key="i"
            :class="{ active: currentSlide === i - 1 }"
            @click="goSlide(i - 1)"
         ></span>
      </div>

      <!-- ===== MODAL DETAIL (đã fix lỗi) ===== -->
      <PromotionDetailModal
         v-if="showModal"
         :promotion="selectedPromotion"
         :products="products"
         @close="closeDetail"
      />
   </div>
</template>

<script setup>
   import { ref, computed, onMounted } from 'vue';
   import PromotionDetailModal from './PromotionDetailModal.vue';

   var IMG_URL = import.meta.env.VITE_IMAGE_URL;

   /* STATE */
   var promotions = ref([]);
   var products = ref([]);
   var selectedPromotion = ref(null);
   var showModal = ref(false);

   /* LOAD API */
   function loadPromotions() {
      fetch('http://localhost:8080/api/admin/promotions')
         .then((res) => res.json())
         .then((data) => (promotions.value = data))
         .catch((err) => console.log('Load promotion error:', err));
   }

   function loadProducts() {
      fetch('http://localhost:8080/api/products')
         .then((res) => res.json())
         .then((data) => (products.value = data))
         .catch((err) => console.log('Load product error:', err));
   }

   onMounted(() => {
      loadPromotions();
      loadProducts();
   });

   /* CAROUSEL */
   var currentSlide = ref(0);
   var itemsPerSlide = 3;

   var slides = computed(() => {
      var result = [];
      for (let i = 0; i < promotions.value.length; i += itemsPerSlide) {
         result.push(promotions.value.slice(i, i + itemsPerSlide));
      }
      return result;
   });

   function nextSlide() {
      currentSlide.value = (currentSlide.value + 1) % slides.value.length;
   }

   function prevSlide() {
      currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length;
   }

   function goSlide(index) {
      currentSlide.value = index;
   }

   /* MODAL */
   function openDetail(promo) {
      if (products.value.length === 0) return;

      fetch('http://localhost:8080/api/admin/promotions/' + promo.id)
         .then((res) => res.json())
         .then((data) => {
            selectedPromotion.value = data;
            showModal.value = true;
         })
         .catch((err) => console.log('Load detail error:', err));
   }

   function closeDetail() {
      showModal.value = false;
      selectedPromotion.value = null;
   }
</script>

<style scoped>
   .promotion-section {
      width: 100%;
      text-align: center;
      margin-top: 20px;
   }

   /* Title */
   .title {
      display: inline-block;
      padding: 8px 28px;
      border: 2px solid #111;
      border-radius: 8px;
      font-weight: 700;
      font-size: 20px;
      margin-bottom: 30px;
   }

   /* Carousel */
   .carousel-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 400px; /* FIX: đảm bảo nút canh giữa */
   }

   .carousel {
      width: 100%;
      max-width: 1050px;
      overflow: hidden;
      padding: 10px 0;
   }

   .slide {
      display: none;
      gap: 24px;
      justify-content: center;
   }

   .slide.active {
      display: flex;
   }

   .promo-card {
      width: 300px;
      background: #fff;
      border-radius: 10px;
      overflow: hidden;
      cursor: pointer;
      border: 1px solid #ddd;
      transition: 0.2s ease;
   }

   .promo-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
   }

   .poster {
      width: 100%;
      height: 280px;
      object-fit: cover;
   }

   .promo-info {
      padding: 14px;
      text-align: left;
   }

   .promo-title {
      font-size: 17px;
      font-weight: bold;
   }

   .promo-desc {
      font-size: 14px;
      color: #666;
      height: 40px;
      overflow: hidden;
   }

   /* Navigation */
   .nav-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: 40px;
      background: none !important; /* bỏ nền */
      border: none;
      width: auto; /* không cần hình tròn */
      height: auto;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: none !important; /* bỏ bóng */
      padding: 0; /* không padding */
   }

   .nav-btn.left {
      left: 10px;
   }

   .nav-btn.right {
      right: 10px;
   }

   .nav-btn:hover {
      color: #4caf50;
   }
   /* Dots */
   .dots {
      margin-top: 15px;
   }

   .dot {
      width: 11px;
      height: 11px;
      background: #c4c4c4;
      border-radius: 50%;
      display: inline-block;
      margin: 0 5px;
      cursor: pointer;
   }

   .dot.active {
      background: #111;
      transform: scale(1.2);
   }
</style>
