<template>
   <div class="cinema-seating">
      <h2 class="screen">MÀN HÌNH</h2>

      <div class="seats-container">
         <!-- Hàng A -->
         <div class="row" data-row="A">
            <span class="row-label">A</span>
            <div class="seats">
               <Seat
                  v-for="n in 15"
                  :key="n"
                  :position="'A' + n"
                  :seat="getSeat('A' + n)"
                  @select="toggleSeat"
               />
            </div>
         </div>

         <!-- Hàng B -->
         <div class="row" data-row="B">
            <span class="row-label">B</span>
            <div class="seats">
               <div class="seat-gap"></div>
               <Seat
                  v-for="n in [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]"
                  :key="n"
                  :position="'B' + n"
                  :seat="getSeat('B' + n)"
                  @select="toggleSeat"
               />
            </div>
         </div>

         <!-- Hàng C -->
         <div class="row" data-row="C">
            <span class="row-label">C</span>
            <div class="seats">
               <Seat
                  v-for="n in 31"
                  :key="n + 30"
                  :position="'C' + (n + 30)"
                  :seat="getSeat('C' + (n + 30))"
                  @select="toggleSeat"
               />
            </div>
         </div>

         <!-- Hàng D (có VIP giữa) -->
         <div class="row" data-row="D">
            <span class="row-label">D</span>
            <div class="seats">
               <Seat
                  v-for="n in [46, 47, 48, 49]"
                  :key="n"
                  :position="'D' + n"
                  :seat="getSeat('D' + n)"
                  @select="toggleSeat"
               />
               <Seat
                  v-for="n in 50"
                  :key="'vip' + n"
                  :position="'D' + (n + 49)"
                  :seat="getSeat('D' + (n + 49))"
                  @select="toggleSeat"
                  class="vip"
               />
               <Seat
                  v-for="n in [58, 59, 60]"
                  :key="n"
                  :position="'D' + n"
                  :seat="getSeat('D' + n)"
                  @select="toggleSeat"
               />
            </div>
         </div>

         <!-- Hàng E, F, G (tương tự) -->
         <div class="row" v-for="row in ['E', 'F', 'G']" :key="row" :data-row="row">
            <span class="row-label">{{ row }}</span>
            <div class="seats">
               <template v-if="row === 'E'">
                  <Seat position="E61" :seat="getSeat('E61')" @select="toggleSeat" />
                  <Seat position="E62" :seat="getSeat('E62')" @select="toggleSeat" />
                  <Seat position="E63" :seat="getSeat('E63')" @select="toggleSeat" />
                  <Seat
                     v-for="n in 64"
                     :key="n"
                     :position="'E' + (n + 63)"
                     :seat="getSeat('E' + (n + 63))"
                     @select="toggleSeat"
                     class="vip"
                  />
                  <Seat position="E73" :seat="getSeat('E73')" @select="toggleSeat" />
                  <Seat position="E74" :seat="getSeat('E74')" @select="toggleSeat" />
                  <Seat position="E75" :seat="getSeat('E75')" @select="toggleSeat" />
               </template>

               <template v-if="row === 'F'">
                  <Seat
                     v-for="n in [76, 77, 78]"
                     :key="n"
                     :position="'F' + n"
                     :seat="getSeat('F' + n)"
                     @select="toggleSeat"
                  />
                  <Seat
                     v-for="n in [79, 82, 83, 84, 85, 86, 87]"
                     :key="n"
                     :position="'F' + n"
                     :seat="getSeat('F' + n)"
                     @select="toggleSeat"
                     class="vip"
                  />
                  <Seat
                     v-for="n in [88, 89, 90]"
                     :key="n"
                     :position="'F' + n"
                     :seat="getSeat('F' + n)"
                     @select="toggleSeat"
                  />
               </template>

               <template v-if="row === 'G'">
                  <Seat
                     v-for="n in [91, 92, 93]"
                     :key="n"
                     :position="'G' + n"
                     :seat="getSeat('G' + n)"
                     @select="toggleSeat"
                  />
                  <Seat
                     v-for="n in 94"
                     :key="'g' + n"
                     :position="'G' + (n + 93)"
                     :seat="getSeat('G' + (n + 93))"
                     @select="toggleSeat"
                     class="vip"
                  />
                  <Seat
                     v-for="n in [103, 104, 105]"
                     :key="n"
                     :position="'G' + n"
                     :seat="getSeat('G' + n)"
                     @select="toggleSeat"
                  />
               </template>
            </div>
         </div>

         <!-- Khu Couple H -->
         <div class="row couple-row">
            <span class="row-label">H</span>
            <div class="couple-seats">
               <CoupleSeat
                  v-for="pair in couplePairs"
                  :key="pair"
                  :position="pair"
                  :seats="[getSeat(pair.split('-')[0]), getSeat(pair.split('-')[1])]"
                  @select="toggleCouple"
               />
            </div>
         </div>

         <!-- Hàng I, J -->
         <div class="row" v-for="row in ['I', 'J']" :key="row">
            <span class="row-label">{{ row }}</span>
            <div class="seats">
               <Seat
                  v-for="n in row === 'I'
                     ? [121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135]
                     : [136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150]"
                  :key="n"
                  :position="row + n"
                  :seat="getSeat(row + n)"
                  @select="toggleSeat"
               />
            </div>
         </div>

         <!-- Hàng K (chỉ có couple) -->
         <div class="row couple-row">
            <span class="row-label">K</span>
            <div class="couple-seats k-row">
               <CoupleSeat
                  position="K151-152"
                  :seats="[getSeat('K151'), getSeat('K152')]"
                  @select="toggleCouple"
               />
               <CoupleSeat
                  position="K153-154"
                  :seats="[getSeat('K153'), getSeat('K154')]"
                  @select="toggleCouple"
               />
               <CoupleSeat
                  position="K155-156"
                  :seats="[getSeat('K155'), getSeat('K156')]"
                  @select="toggleCouple"
               />
            </div>
         </div>
      </div>

      <!-- Ghế đã chọn -->
      <div class="selected-seats">
         <h3>Ghế đã chọn ({{ selectedSeats.length }})</h3>
         <div class="tags">
            <span v-for="seat in selectedSeats" :key="seat.position" class="tag">
               {{ seat.position }}
               <small v-if="seat.type === 'VIP'">(VIP)</small>
               <small v-if="seat.type === 'Couple'">(Couple)</small>
            </span>
         </div>
         <button @click="confirmBooking" :disabled="selectedSeats.length === 0" class="btn-confirm">
            Xác nhận đặt ghế ({{ selectedSeats.length }} ghế)
         </button>
      </div>

      <!-- Chú thích -->
      <div class="legend">
         <span
            ><div class="legend-box normal"></div>
            Ghế thường</span
         >
         <span
            ><div class="legend-box vip"></div>
            Ghế VIP</span
         >
         <span
            ><div class="legend-box couple"></div>
            Ghế đôi</span
         >
         <span
            ><div class="legend-box selected"></div>
            Đang chọn</span
         >
         <span
            ><div class="legend-box sold"></div>
            Đã bán</span
         >
      </div>
   </div>
</template>

<script setup>
   import axios from 'axios';
   import { ref, computed, onMounted } from 'vue';

   // Dữ liệu ghế từ API (bạn đã cung cấp)
   const rawSeats = ref([
      /* Paste toàn bộ mảng JSON bạn gửi ở trên vào đây */
   ]);

   async function getRawSeats() {
      try {
         const response = await axios.get('http://localhost:8080/api/admin/seats/room/d9589a74-9d91-460c-89ed-256148a385c2');
         rawSeats.value = response.data;
      } catch (error) {

      }
   }

   // Tạo map để tra cứu nhanh
   const seatMap = computed(() => {
      const map = {};
      rawSeats.value.forEach((s) => {
         map[s.position] = {
            ...s,
            type: s.seatType.name.includes('VIP')
               ? 'VIP'
               : s.seatType.name.includes('Couple')
                 ? 'Couple'
                 : 'Normal',
         };
      });
      return map;
   });

   const getSeat = (position) => seatMap.value[position] || null;

   const selectedSeats = ref([]);

   const toggleSeat = (position) => {
      const seat = getSeat(position);
      if (!seat || !seat.active) return;

      const index = selectedSeats.value.findIndex((s) => s.position === position);
      if (index > -1) {
         selectedSeats.value.splice(index, 1);
      } else {
         selectedSeats.value.push({ position, type: seat.type });
      }
   };

   const couplePairs = [
      'H1-2',
      'H3-4',
      'H7-8',
      'H9-10',
      'H11-12',
      'H13-14',
      'H15-16',
      'H107-108',
      'H109-110',
      'H111-112',
      'H113-114',
      'H115-116',
      'H117-118',
      'H119-120',
   ];

   const toggleCouple = (pair) => {
      const [s1, s2] = pair.split('-').map((p) => (p.replace(/[^\d]/g, '') ? p : p));
      const seat1 = getSeat(s1);
      const seat2 = getSeat(s2);

      if (!seat1 || !seat2 || !seat1.active || !seat2.active) return;

      const hasOne = selectedSeats.value.some((s) => s.position === s1 || s.position === s2);
      if (hasOne) {
         selectedSeats.value = selectedSeats.value.filter(
            (s) => s.position !== s1 && s.position !== s2
         );
      } else {
         selectedSeats.value.push({ position: s1, type: 'Couple' });
         selectedSeats.value.push({ position: s2, type: 'Couple' });
      }
   };

   const confirmBooking = () => {
      alert(`Đã chọn: ${selectedSeats.value.map((s) => s.position).join(', ')}`);
      // Gọi API đặt ghế ở đây
   };

   onMounted(() => {
      getRawSeats();
   });
</script>

<style scoped>
   .cinema-seating {
      font-family: Arial, sans-serif;
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
      background: #1a1a2e;
      color: white;
      border-radius: 12px;
   }

   .screen {
      background: linear-gradient(90deg, #333, #fff, #333);
      height: 60px;
      line-height: 60px;
      text-align: center;
      font-weight: bold;
      border-radius: 30px;
      margin-bottom: 40px;
      font-size: 1.4rem;
   }

   .row {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
   }

   .row-label {
      width: 30px;
      font-weight: bold;
      font-size: 1.2rem;
   }

   .seats {
      display: flex;
      gap: 8px;
      flex: 1;
      justify-content: center;
   }

   .seat {
      width: 36px;
      height: 36px;
      background: #444;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
   }

   .seat.normal:not(.sold):hover {
      background: #0f0;
      transform: scale(1.1);
   }
   .seat.vip:not(.sold) {
      background: #0066ff;
   }
   .seat.vip:not(.sold):hover {
      background: #00ccff;
   }
   .seat.couple {
      background: #ff1493;
   }
   .seat.selected {
      background: #ffd700 !important;
      color: black;
   }
   .seat.sold {
      background: #222 !important;
      cursor: not-allowed;
      opacity: 0.5;
   }

   .couple-row .couple-seats {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      justify-content: center;
   }

   .couple-seat {
      display: flex;
      gap: 4px;
   }

   .selected-seats {
      margin-top: 30px;
      padding: 20px;
      background: #16213e;
      border-radius: 10px;
   }

   .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 10px 0;
   }

   .tag {
      background: #0f3460;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.9rem;
   }

   .btn-confirm {
      margin-top: 15px;
      padding: 12px 30px;
      background: #e94560;
      border: none;
      color: white;
      font-weight: bold;
      border-radius: 8px;
      cursor: pointer;
   }

   .btn-confirm:disabled {
      background: #555;
      cursor: not-allowed;
   }

   .legend {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 20px;
      font-size: 0.9rem;
      flex-wrap: wrap;
   }

   .legend-box {
      width: 20px;
      height: 20px;
      display: inline-block;
      margin-right: 6px;
      border-radius: 4px;
   }

   .legend-box.normal {
      background: #444;
   }
   .legend-box.vip {
      background: #0066ff;
   }
   .legend-box.couple {
      background: #ff1493;
   }
   .legend-box.selected {
      background: #ffd700;
   }
   .legend-box.sold {
      background: #222;
   }
</style>
