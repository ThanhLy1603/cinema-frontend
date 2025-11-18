<template>
   <table class="table table-hover">
      <thead class="table-success">
         <tr>
            <th>#</th>
            <th>Poster</th>
            <th>Tên chương trình</th>
            <th>Mô tả</th>
            <th>Bắt đầu</th>
            <th>Kết thúc</th>
            <th>Loại</th>
            <th>Active</th>
            <th>Hành động</th>
         </tr>
      </thead>
      <tbody>
         <tr v-for="(p, index) in paginatedPromotions" :key="p.id">
            <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td>
               <img
                  v-if="p.poster"
                  :src="IMG_URL + p.poster"
                  alt="Poster"
                  class="rounded"
                  style="width: 60px; height: 60px; object-fit: cover"
               />
               <span v-else>Chưa có</span>
            </td>
            <td>{{ p.name }}</td>
            <td>{{ p.description }}</td>
            <td>{{ p.startDate }}</td>
            <td>{{ p.endDate }}</td>
            <td>{{ p.type }}</td>
            <td>{{ p.active ? 'Có' : 'Không' }}</td>
            <td>
               <button class="btn btn-sm btn-primary me-1" @click="$emit('edit', p)">Edit</button>
               <button class="btn btn-sm btn-danger" @click="$emit('delete', p.id)">Xóa</button>
            </td>
         </tr>
      </tbody>
   </table>

   <!-- Pagination controls -->
   <nav v-if="totalPages > 1" class="mt-2">
      <ul class="pagination">
         <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="prevPage">«</button>
         </li>
         <li
            class="page-item"
            v-for="page in totalPages"
            :key="page"
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

   const totalPages = computed(function () {
      return Math.ceil(props.promotions.length / itemsPerPage);
   });

   const paginatedPromotions = computed(function () {
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
