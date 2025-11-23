<template>
   <div class="cinema-map">
      <table>
         <tr v-for="(row, rowIndex) in seatMap" :key="row.label">
            <td class="row-label">{{ row.label }}</td>

            <!-- Duyệt từng ô trong hàng -->
            <td
               v-for="(seat, seatIndex) in row.seats"
               :key="seat ? seat.code : `empty-${rowIndex}-${seatIndex}`"
            >
               <!-- Nếu là null → lối đi trống -->
               <div v-if="!seat" class="empty-path"></div>

               <!-- Nếu là ghế thật -->
               <div v-else class="seat-wrapper">
                  <a
                     :title="seat.code"
                     :class="[
                        'seat-item',
                        seat.type,
                        { selected: seat.isSelected, disabled: seat.isSold },
                     ]"
                     @click.prevent="toggleSeat(seat)"
                  ></a>

                  <!-- Ghế đôi: hiển thị thêm ghế bên cạnh -->
                  <a
                     v-if="seat.isCouplePair"
                     :title="seat.pairCode"
                     :class="[
                        'seat-item',
                        'couple',
                        { selected: seat.isSelected, disabled: seat.isSold },
                     ]"
                     @click.prevent="toggleSeat(seat)"
                  ></a>
               </div>
            </td>

            <td class="row-label">{{ row.label }}</td>
         </tr>
      </table>
   </div>

   <div class="cinema-map">
      <div v-for="row in seatRows" :key="row.label">
         <div>{{ row.label }}</div>

         <div v-for="seat in row.seats" :key="seat.seatId">
            <div>
               {{ seat.position }}
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
   import axios from 'axios';
   import { computed, onMounted, ref } from 'vue';

   // Dữ liệu ghế – hoàn chỉnh, chuẩn như rạp Việt Nam
   const seatMap = ref([
      {
         label: 'A',
         seats: Array(13)
            .fill(null)
            .map((_, i) => ({
               code: `A${i + 1}`,
               type: 'standard',
               isSelected: false,
               isSold: false,
            })),
      },
      {
         label: 'B',
         seats: Array(13)
            .fill(null)
            .map((_, i) => ({
               code: `B${i + 1}`,
               type: 'standard',
               isSelected: false,
               isSold: false,
            })),
      },
      {
         label: 'C',
         seats: Array(13)
            .fill(null)
            .map((_, i) => ({
               code: `C${i + 1}`,
               type: 'standard',
               isSelected: false,
               isSold: false,
            })),
      },
      {
         label: 'D',
         seats: [
            { code: 'D1', type: 'standard' },
            { code: 'D2', type: 'standard' },
            { code: 'D3', type: 'vip' },
            { code: 'D4', type: 'vip' },
            { code: 'D5', type: 'vip' },
            { code: 'D6', type: 'vip' },
            { code: 'D7', type: 'vip' },
            { code: 'D8', type: 'vip' },
            { code: 'D9', type: 'vip' },
            { code: 'D10', type: 'vip' },
            { code: 'D11', type: 'vip' },
            { code: 'D12', type: 'standard' },
            { code: 'D13', type: 'standard' },
         ].map((s) => ({ ...s, isSelected: false, isSold: false })),
      },
      {
         label: 'E',
         seats: [
            { code: 'E1', type: 'standard' },
            { code: 'E2', type: 'standard' },
            { code: 'E3', type: 'vip' },
            { code: 'E4', type: 'vip' },
            { code: 'E5', type: 'vip' },
            { code: 'E6', type: 'vip' },
            { code: 'E7', type: 'vip' },
            { code: 'E8', type: 'vip' },
            { code: 'E9', type: 'vip' },
            { code: 'E10', type: 'vip' },
            { code: 'E11', type: 'vip' },
            { code: 'E12', type: 'standard' },
            { code: 'E13', type: 'standard' },
         ].map((s) => ({ ...s, isSelected: false, isSold: false })),
      },
      {
         label: 'F',
         seats: [
            null,
            null,
            { code: 'F1', type: 'standard' },
            { code: 'F2', type: 'vip' },
            { code: 'F3', type: 'vip' },
            { code: 'F4', type: 'vip' },
            { code: 'F5', type: 'vip' },
            { code: 'F6', type: 'vip' },
            { code: 'F7', type: 'vip' },
            { code: 'F8', type: 'vip' },
            { code: 'F9', type: 'vip' },
            { code: 'F10', type: 'vip' },
            { code: 'F11', type: 'standard' },
            null,
         ].map((s) => (s ? { ...s, isSelected: false, isSold: false } : null)),
      },
      {
         label: 'G',
         seats: [
            null,
            null,
            { code: 'G1', type: 'standard' },
            { code: 'G2', type: 'vip' },
            { code: 'G3', type: 'vip' },
            { code: 'G4', type: 'vip' },
            { code: 'G5', type: 'vip' },
            { code: 'G6', type: 'vip' },
            { code: 'G7', type: 'vip' },
            { code: 'G8', type: 'vip' },
            { code: 'G9', type: 'vip' },
            { code: 'G10', type: 'vip' },
            { code: 'G11', type: 'standard' },
            null,
         ].map((s) => (s ? { ...s, isSelected: false, isSold: false } : null)),
      },
      {
         label: 'H',
         seats: [
            { code: 'H1', type: 'couple', isCouplePair: true, pairCode: 'H2' },
            { code: 'H2', type: 'couple', isCouplePair: true, pairCode: 'H1' },
            { code: 'H3', type: 'couple', isCouplePair: true, pairCode: 'H4' },
            { code: 'H4', type: 'couple', isCouplePair: true, pairCode: 'H3' },
            { code: 'H5', type: 'couple', isCouplePair: true, pairCode: 'H6' },
            { code: 'H6', type: 'couple', isCouplePair: true, pairCode: 'H5' },
            { code: 'H7', type: 'couple', isCouplePair: true, pairCode: 'H8' },
            { code: 'H8', type: 'couple', isCouplePair: true, pairCode: 'H7' },
            { code: 'H9', type: 'couple', isCouplePair: true, pairCode: 'H10' },
            { code: 'H10', type: 'couple', isCouplePair: true, pairCode: 'H9' },
            { code: 'H11', type: 'couple', isCouplePair: true, pairCode: 'H12' },
            { code: 'H12', type: 'couple', isCouplePair: true, pairCode: 'H11' },
            { code: 'H13', type: 'couple', isCouplePair: true, pairCode: 'H14' },
            { code: 'H14', type: 'couple', isCouplePair: true, pairCode: 'H13' },
         ].map((s) => ({ ...s, isSelected: false, isSold: false })),
      },
   ]);

   // Hàm chọn ghế (chuẩn, không lỗi)
   const toggleSeat = (seat) => {
      if (!seat || seat.isSold) return;

      if (seat.type === 'couple') {
         const pairCode = seat.pairCode;
         const row = seatMap.value.find((r) =>
            r.seats.some((s) => s && (s.code === seat.code || s.code === pairCode))
         );
         const pairSeat = row.seats.find((s) => s && s.code === pairCode);

         const shouldSelect = !seat.isSelected;
         seat.isSelected = shouldSelect;
         if (pairSeat) pairSeat.isSelected = shouldSelect;
      } else {
         seat.isSelected = !seat.isSelected;
      }
   };

   // Lấy danh sách ghế đã chọn
   const getSelectedSeats = () => {
      const list = [];
      seatMap.value.forEach((row) => {
         row.seats.forEach((seat) => {
            if (seat && seat.isSelected) list.push(seat.code);
         });
      });
      return list;
   };

   const seats = ref([]);
   const selectedSeats = ref([]);

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
      filter: grayscale(100%) brightness(0.7);
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
</style>
