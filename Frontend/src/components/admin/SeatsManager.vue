<template>
   <div class="container-fluid">
      <div class="table-container">
      <table class="film-table table-bordered table-hover">
         <thead class="text-center">
            <tr>
               <th>STT</th>
               <th>Vị trí</th>
               <th>Phòng</th>
               <th>Loại ghê</th>
            </tr>
         </thead>
         <tbody class="text-center">
            <tr v-for="(seat, index) in seats" :key="index">
               <td>{{ index + 1 }}</td>
               <td>{{ seat.position }}</td>
               <td>{{seat.room.name }}</td>
               <td>{{seat.seatType.name}}</td>
               <td>
                  <button class="btn btn-sm btn-primary mx-1">Sửa</button>
                  <button class="btn btn-sm btn-danger mx-1">
                     Xóa
                  </button>
               </td>
            </tr>
         </tbody>
      </table>
      </div>
   </div>
</template>

<script setup>
   import { ref, onMounted } from 'vue';
   import axios from 'axios';

   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

   const seats = ref([]);
   const rooms = ref([]);
   const seatTypes = ref([]);

   async function getRooms() {
      try {
         const url = `${API_BASE_URL}/admin/seats/rooms`;

         const response = await axios.get(url);
         rooms.value = response.data;

         console.log("rooms: ", rooms.value);
      } catch (error) {
         console.error("Lỗi khi lấy dữ liệu từ rooms: ", error.message);
      }
   }

   async function getSeatTypes() {
      try {
         const url = `${API_BASE_URL}/admin/seats/seat-types`;
         const response = await axios.get(url);

         seatTypes.value = response.data;
         console.log("seat types: ", seatTypes.value);
      } catch (error) {
         console.error("Lỗi khi lấy dữ liệu từ seatTypes: ", error.message);
      }
   }

   async function getSeats() {
      try {
         const url = `${API_BASE_URL}/admin/seats`;
         const response = await axios.get(url);

         seats.value = response.data;

         console.log('seats: ', seats.value);
      } catch (error) {
         console.error('Lỗi khi lấy dữ liệu từ seats: ', error.message);
      }
   }

   onMounted(() => {
      getSeats();
      getRooms();
      getSeatTypes();
   });
</script>

<style scoped></style>
