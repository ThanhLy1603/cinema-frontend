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
            <td v-for="seat in row.seats" :key="seat">
               <div class="seat-wapper">
                  <div
                     :class="[
                        'seat-item',
                        { standard: seat.seatType == 'Ghế Thường' },
                        { vip: seat.seatType == 'Ghế VIP' },
                        { couple: seat.seatType == 'Ghế Couple' },
                        { selected: seat.status == 'holding' },
                        { disabled: seat.status == 'booked' },
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
   import { ref, computed, onMounted } from 'vue';
   import axios from 'axios';

   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

   const seats = ref([]);

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

   async function getSeats() {
      try {
         const response = await axios.get(
            'http://localhost:8080/api/schedules/reserve-seat/fdd15327-0c6c-480b-a626-01648952fbce/seats'
         );

         seats.value = response.data;
         console.log('seats: ', seats.value);

         seats.value.sort((first, second) => {
            const numFirst = parseInt(first.position.slice(1));
            const numSecond = parseInt(second.position.slice(1));
            return numFirst - numSecond;
         });

         console.log('seats đã sắp xếp theo số ghế tăng dần:', seats.value);
      } catch (error) {
         console.error('Lỗi khi lấy dánh sách');
      }
   }

   async function toggleSeat(seat) {
      console.log('seat: ', seat);

      if (seat.status === 'available') {
         try {
            const response = await axios.put(
               `${API_BASE_URL}/schedules/reserve-seat/fdd15327-0c6c-480b-a626-01648952fbce/seats/${seat.seatId}/hold`,
               {
                  holdId: null,
                  holdMinutes: 10
               }
            );
            
            console.log(response.data.message);
            getSeats();
         } catch (error) {
            console.error('Lỗi khi chọn ghế: ', error.message);
         }
      } else if (seat.status === 'holding') {
         try {
            const response = await axios.put(
               `${API_BASE_URL}/schedules/reserve-seat/fdd15327-0c6c-480b-a626-01648952fbce/seats/${seat.seatId}/release`,
               {
                  holdId: null
               }
            );

            console.log(response.data.message);
            getSeats();
         } catch (error) {
            console.error('Lỗi khi bỏ chọn ghế: ', error.message);
         }
      }
   }

   onMounted(async () => {
      await getSeats();
      console.log('seatRows: ', seatRows.value);
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

   .row-label {
      font-weight: bold;
      font-size: 18px;
      color: #fff;
      background: #333;
      width: 30px;
      text-align: center;
      border-radius: 4px;
   }

   .seat-wrapper {
      display: flex;
      gap: 4px;
      justify-content: center;
   }

   .seat-item {
      display: block;
      width: 36px;
      height: 36px;
      background: center/contain no-repeat;
      cursor: pointer;
      border-radius: 6px;
      position: relative;
      transition: all 0.25s ease;
   }

   /* Ghế thường, VIP, Couple - trạng thái bình thường */
   .seat-item.standard {
      background-image: url('http://localhost:8080/uploads/images/Ghe_thuong.png');
   }

   .seat-item.vip {
      background-image: url('http://localhost:8080/uploads/images/Ghe_vip.png');
   }

   .seat-item.couple {
      background-image: url('http://localhost:8080/uploads/images/Ghe_doi.png');
   }

   /* Khi ghế được CHỌN → dùng ảnh đã chọn (quan trọng nhất!) */
   .seat-item.selected {
      background-image: url('http://localhost:8080/uploads/images/Ghe_da_chon.png') !important;
      transform: scale(1.08);
      box-shadow: 0 0 15px rgba(0, 255, 0, 0.7);
      z-index: 10;
   }

   /* Ghế đã bán / bị khóa */
   .seat-item.disabled {
      background-image: url('http://localhost:8080/uploads/images/Ghe_da_ban.png') !important;
      /* filter: grayscale(100%) brightness(0.7); */
      cursor: not-allowed;
      pointer-events: none; /* không click được */
      transform: none !important;
      box-shadow: none !important;
   }

   /* Đảm bảo ghế đã chọn vẫn hiện ảnh chọn dù là loại gì */
   .seat-item.standard.selected,
   .seat-item.vip.selected,
   .seat-item.couple.selected {
      background-image: url('http://localhost:8080/uploads/images/Ghe_da_chon.png') !important;
   }

   /* Lối đi trống */
   .empty-path {
      width: 40px;
      height: 40px;
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

   .screen {
      width: 80%;
      max-width: 700px;
      height: 80px;
      margin: 0 auto 50px;
      background: url('http://localhost:8080/uploads/images/Screen.png') center/contain no-repeat;
      background-size: 100% 100%;
      filter: drop-shadow(0 10px 30px rgba(0, 255, 255, 0.3));
   }
</style>
