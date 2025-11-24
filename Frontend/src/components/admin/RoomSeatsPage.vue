<template>
   <div class="cinema-map">
      <div class="screen w-75"></div>

      <div class="legend">
         <div><span class="seat-item standard"></span> Ghế thường</div>
         <div><span class="seat-item vip"></span> Ghế VIP</div>
         <div><span class="seat-item couple"></span> Ghế đôi</div>
         <div><span class="seat-item selected"></span> Đang chọn</div>
         <div><span class="seat-item disabled"></span> Đã bán</div>
      </div>

      <table>
         <tr v-for="row in seatRows" :key="row.label">
            <td v-for="seat in row.seats" :key="seat.seatId">
               <div class="seat-wrapper">
                  <div
                     :class="[
                        'seat-item',
                        { standard: seat.seatType === 'Ghế Thường' },
                        { vip: seat.seatType === 'Ghế VIP' },
                        { couple: seat.seatType === 'Ghế Couple' },
                        { selected: seat.status === 'holding' },
                        { disabled: seat.status === 'booked' },
                     ]"
                     @click="toggleSeat(seat)"
                  ></div>
               </div>
            </td>
         </tr>
      </table>
   </div>
</template>

<script setup>
   import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
   import axios from 'axios';
   import SockJS from 'sockjs-client';
   import { Client } from '@stomp/stompjs';

   // ======================
   // Config API
   // ======================
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
   const SCHEDULE_ID = 'fdd15327-0c6c-480b-a626-01648952fbce';

   // ======================
   // State
   // ======================
   const seats = ref([]);

   // ======================
   // Computed: sắp xếp theo hàng
   // ======================
   const seatRows = computed(() => {
      const groups = {};
      seats.value.forEach((seat) => {
         const row = seat.position[0];
         if (!groups[row]) groups[row] = [];
         groups[row].push(seat);
      });
      return Object.keys(groups)
         .sort()
         .map((label) => ({ label, seats: groups[label] }));
   });

   // ======================
   // Lấy danh sách ghế từ API
   // ======================
   async function getSeats() {
      try {
         const response = await axios.get(
            `http://localhost:8080/api/schedules/reserve-seat/fdd15327-0c6c-480b-a626-01648952fbce/seats`
         );
         seats.value = response.data;

         // sort theo số ghế
         seats.value.sort((a, b) => parseInt(a.position.slice(1)) - parseInt(b.position.slice(1)));
      } catch (error) {
         console.error('Lỗi khi lấy danh sách ghế:', error);
      }
   }

   // ======================
   // Toggle ghế: hold/release
   // ======================
   async function toggleSeat(seat) {
      if (seat.status === 'available') {
         try {
            await axios.put(
               `${API_BASE_URL}/schedules/reserve-seat/${SCHEDULE_ID}/seats/${seat.seatId}/hold`,
               {
                  holdId: null,
                  holdMinutes: 10,
               }
            );
         } catch (error) {
            console.error('Lỗi khi giữ ghế:', error);
         }
      } else if (seat.status === 'holding') {
         try {
            await axios.put(
               `${API_BASE_URL}/schedules/reserve-seat/${SCHEDULE_ID}/seats/${seat.seatId}/release`,
               {
                  holdId: null,
               }
            );
         } catch (error) {
            console.error('Lỗi khi bỏ chọn ghế:', error);
         }
      }
   }

   // ======================
   // WebSocket STOMP
   // ======================
   let stompClient = null;

   function connectWebSocket() {
      // Tạo SockJS client
      const socket = new SockJS('http://localhost:8080/ws');

      // Tạo STOMP client với SockJS
      stompClient = new Client({
         webSocketFactory: () => socket, // dùng SockJS thay vì brokerURL
         reconnectDelay: 2000,
         debug: (msg) => console.log('STOMP:', msg),
         onConnect: () => {
            console.log('WebSocket connected!');
            stompClient?.subscribe(`/topic/seats/${SCHEDULE_ID}`, (message) => {
               const updatedSeat = JSON.parse(message.body);
               updateSeatFromWebsocket(updatedSeat);
            });
         },
         onStompError: (frame) => {
            console.error('STOMP error: ', frame.headers['message'], frame.body);
         },
      });

      stompClient.activate();
   }

   function disconnectWebSocket() {
      if (stompClient) {
         stompClient.deactivate();
      }
   }

   function updateSeatFromWebsocket(updatedSeat) {
      const index = seats.value.findIndex((s) => s.seatId === updatedSeat.seatId);
      if (index !== -1) {
         seats.value[index] = updatedSeat;
      }
   }

   // ======================
   // Lifecycle
   // ======================
   onMounted(async () => {
      await getSeats();
      connectWebSocket();
   });

   onBeforeUnmount(() => {
      disconnectWebSocket();
   });
</script>

<style scoped>
   .cinema-map {
      user-select: none;
      font-family: Arial, sans-serif;
   }

   table {
      margin: 0 auto;
      border-collapse: separate;
      border-spacing: 6px;
   }

   .seat-wrapper {
      display: flex;
      justify-content: center;
      gap: 4px;
   }

   .seat-item {
      display: block;
      width: 36px;
      height: 36px;
      background: center/contain no-repeat;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.25s ease;
   }

   /* Ghế loại */
   .seat-item.standard {
      background-image: url('http://localhost:8080/uploads/images/Ghe_thuong.png');
   }

   .seat-item.vip {
      background-image: url('http://localhost:8080/uploads/images/Ghe_vip.png');
   }

   .seat-item.couple {
      background-image: url('http://localhost:8080/uploads/images/Ghe_doi.png');
   }

   /* Chọn */
   .seat-item.selected {
      background-image: url('http://localhost:8080/uploads/images/Ghe_da_chon.png') !important;
      transform: scale(1.08);
      box-shadow: 0 0 15px rgba(0, 255, 0, 0.7);
      z-index: 10;
   }

   /* Bán/Disabled */
   .seat-item.disabled {
      background-image: url('http://localhost:8080/uploads/images/Ghe_da_ban.png') !important;
      cursor: not-allowed;
      pointer-events: none;
      transform: none !important;
      box-shadow: none !important;
   }

   /* Ghế đã chọn override type */
   .seat-item.standard.selected,
   .seat-item.vip.selected,
   .seat-item.couple.selected {
      background-image: url('http://localhost:8080/uploads/images/Ghe_da_chon.png') !important;
   }

   .screen {
      width: 80%;
      max-width: 700px;
      height: 80px;
      margin: 0 auto 50px;
      background: url('http://localhost:8080/uploads/images/Screen.png') center/contain no-repeat;
      background-size: 100% 100%;
      filter: drop-shadow(0 10px 30px rgba(0, 255, 255, 0.3));
   }

   .legend {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin: 40px 0;
      flex-wrap: wrap;
      font-size: 15px;
   }

   .legend > div {
      display: flex;
      align-items: center;
      gap: 8px;
   }

   .legend .seat-item {
      width: 32px;
      height: 32px;
      transform: none !important;
      box-shadow: none !important;
   }
</style>
