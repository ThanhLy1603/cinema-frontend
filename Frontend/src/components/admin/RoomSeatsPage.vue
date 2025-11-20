<template>
   <div class="page-wrap">
      <h2>Seat map — Phòng</h2>

      <div class="meta">
         <label>Room ID:</label>
         <input v-model="roomId" placeholder="Nhập roomId" />
         <button @click="fetchSeats">Tải ghế</button>
      </div>

      <div v-if="loading" class="info">Đang tải...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else>
         <SeatMap
            :seats="seats"
            :columns="columns"
            :cellSizePx="cellSize"
            @select="onSelect"
            @deselect="onDeselect"
            @confirm="onConfirm"
            @click-seat="onClickSeat"
         />
      </div>

      <div class="bottom">
         <h4>Thông tin</h4>
         <div>Room name: {{ roomName || '—' }}</div>
         <div>Ghế tổng: {{ seats.length }}</div>
         <div>Đã chọn: {{ confirmedPositions }}</div>
      </div>
   </div>
</template>

<script setup>
   import { ref } from 'vue';
   import axios from 'axios';
   import SeatMap from './SeatMap.vue';

   const roomId = ref('d9589a74-9d91-460c-89ed-256148a385c2');
   const seats = ref([]);
   const roomName = ref('');
   const loading = ref(false);
   const error = ref('');
   const columns = 15;
   const cellSize = 56;
   const confirmedPositions = ref('—');

   async function fetchSeats() {
      if (!roomId.value) {
         error.value = 'Vui lòng nhập roomId';
         return;
      }
      loading.value = true;
      error.value = '';
      try {
         const res = await axios.get(`http://localhost:8080/api/admin/seats/room/${roomId.value}`);
         const data = Array.isArray(res.data) ? res.data : res.data.data || res.data.items || [];
         seats.value = data;
         roomName.value = data?.[0]?.room?.name || '';
      } catch (err) {
         console.error(err);
         error.value =
            err.response?.data?.message || err.message || 'Lỗi khi gọi API. Kiểm tra server/CORS.';
      } finally {
         loading.value = false;
      }
   }

   function onSelect(seat) {
      console.log('SELECT', seat);
   }
   function onDeselect(seat) {
      console.log('DESELECT', seat);
   }
   function onClickSeat(seat) {
      console.log('CLICK', seat);
   }

   function onConfirm(selected) {
      confirmedPositions.value = selected.map((s) => s.position).join(', ') || '—';
      console.log('CONFIRMED:', selected);
      // Ex: gọi API để reserve: axios.post('/reserve', { seatIds: selected.map(s=>s.id) })
   }

   fetchSeats();
</script>

<style scoped>
   .page-wrap {
      padding: 18px;
      font-family: Arial, Helvetica, sans-serif;
   }
   .meta {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 12px;
   }
   .meta input {
      padding: 6px;
      border-radius: 4px;
      border: 1px solid #ccc;
   }
   .info {
      color: #0c4a6e;
   }
   .error {
      color: #b91c1c;
   }
   .bottom {
      margin-top: 16px;
      padding-top: 8px;
      border-top: 1px dashed #ddd;
   }
</style>
