<template>
   <div class="table-responsive">
      <table class="table table-hover align-middle shadow-sm">
         <thead class="bg-light text-center fw-bold border-bottom">
            <tr>
               <th>#</th>
               <th>Poster</th>
               <th>Tên chương trình</th>
               <th style="width: 240px">Mô tả</th>
               <th>Bắt đầu</th>
               <th>Kết thúc</th>
               <th>Hành động</th>
            </tr>
         </thead>

         <tbody>
            <tr v-for="(p, index) in paginatedPromotions" :key="p.id">
               <td class="text-center">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>

               <td class="text-center">
                  <img
                     v-if="p.poster"
                     :src="IMG_URL + p.poster"
                     class="rounded-3 border shadow-sm"
                     style="width: 55px; height: 55px; object-fit: cover;"
                  />
                  <span v-else class="text-muted small">Không có</span>
               </td>

               <td class="fw-semibold">{{ p.name }}</td>

               <!-- Mô tả -->
               <td>
                  <div
                     class="text-truncate small text-secondary"
                     style="max-width: 220px"
                     :title="p.description"
                  >
                     {{ p.description }}
                  </div>
               </td>

               <td>{{ p.startDate }}</td>
               <td>{{ p.endDate }}</td>

               <td class="text-center">
                  <button
                     class="btn btn-sm btn-outline-primary me-2 px-3"
                     @click="$emit('edit', p)"
                  >
                     Edit
                  </button>
                  <button
                     class="btn btn-sm btn-outline-danger px-3"
                     @click="$emit('delete', p.id)"
                  >
                     Delete
                  </button>
               </td>
            </tr>
         </tbody>
      </table>
   </div>

   <nav v-if="totalPages > 1" class="d-flex justify-content-center mt-2">
      <ul class="pagination pagination-sm shadow-sm">
         <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="prevPage">«</button>
         </li>

         <li
            v-for="page in totalPages"
            :key="page"
            class="page-item"
            :class="{ active: currentPage === page }"
         >
            <button class="page-link" @click="goToPage(page)">{{ page }}</button>
         </li>

         <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="nextPage">»</button>
         </li>
      </ul>
   </nav>
</template>



<script setup>
   import { ref, computed } from 'vue';

   const IMG_URL = import.meta.env.VITE_IMAGE_URL;

   const props = defineProps({
      promotions: { type: Array, default: () => [] },
   });

   const itemsPerPage = 5;
   const currentPage = ref(1);

   const totalPages = computed(() => {
      return Math.ceil(props.promotions.length / itemsPerPage);
   });

   const paginatedPromotions = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      return props.promotions.slice(start, start + itemsPerPage);
   });

   function goToPage(page) {
      currentPage.value = page;
   }

   function prevPage() {
      if (currentPage.value > 1) currentPage.value--;
   }

   function nextPage() {
      if (currentPage.value < totalPages.value) currentPage.value++;
   }
</script>
