<template>
  <div class="admin-index">
    <div class="management-grid">
      <button
        v-for="item in managementItems"
        :key="item.name"
        class="management-button"
        @click="openComponent(item.component)"
      >
        {{ item.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
   import { defineEmits } from 'vue';

   const emit = defineEmits(['open']);

   const managementItems = [
   { name: "Phim", component: "FilmsManager" },
   { name: "Nhân viên", component: "StaffManager" },
   { name: "Lịch chiếu", component: "ScheduleManager" },
   { name: "Vé", component: "TicketManager" },
   { name: "Giờ chiếu", component: "ShowTimes" },
   { name: "Phòng chiếu", component: "RoomsManager" },
   { name: "Ghế ngồi", component: "SeatsManager" },
   { name: "Danh mục", component: "CategoryManager" },
   { name: "Đồ ăn", component: "ProductManager" },
   ];


   function openComponent(componentName) {
   emit('open', componentName);
   }
</script>

<style scoped>
.management-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
}

.management-button {
  text-align: center;
  padding: 12px 10px;
  background-color: #5cb85c;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.management-button:hover {
  background-color: #4cae4c;
}
</style>
