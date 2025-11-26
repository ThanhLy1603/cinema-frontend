<template>
   <div class="container-fluid">
      <HeaderBook
         :step="step"
         :steps="steps"
      >
      </HeaderBook>
   </div>
   <div class="bhd-booking">
      <!-- HEADER -->

      <!-- THANH TIẾN TRÌNH BHD STAR -->
      <!-- <div class="bhd-steps-wrapper">
         <div class="container">
            <div class="bhd-steps">
               <div
                  v-for="(s, idx) in steps"
                  :key="idx"
                  class="bhd-step"
                  :class="{ active: step === idx, completed: step > idx }"
               >
                  <div class="step-number">
                     <span v-if="step > idx" class="check">✓</span>
                     <span v-else>{{ idx + 1 }}</span>
                  </div>
                  <div class="step-text">
                     <div class="title">{{ s.title }}</div>
                     <div class="subtitle" v-if="s.subtitle">{{ s.subtitle }}</div>
                  </div>
               </div>
            </div>
         </div>
      </div> -->

      <!-- NỘI DUNG -->
      <div class="container py-5">
         <div class="bhd-content">
            <!-- BƯỚC 1: CHỌN SUẤT -->
            <transition name="slide">
               <div v-if="step === 0" class="step-panel">
                  <h2 class="bhd-title">01. Chọn suất chiếu</h2>
                  <div class="showtime-list">
                     <div
                        v-for="st in showtimes"
                        :key="st.id"
                        class="showtime-item"
                        :class="{ active: selectedShowtime?.id === st.id }"
                        @click="selectShowtime(st)"
                     >
                        <div class="time">{{ st.showTimes }}</div>
                        <div class="info">
                           <span class="format">{{ st.format }}</span>
                           <span class="room">Phòng {{ st.room }}</span>
                        </div>
                     </div>
                  </div>

                  <div class="text-end mt-4">
                     <el-button
                        type="primary"
                        size="large"
                        class="bhd-next-btn"
                        :disabled="!selectedShowtime"
                        @click="nextStep"
                     >
                        TIẾP TỤC
                     </el-button>
                  </div>
               </div>
            </transition>

            <!-- BƯỚC 2: CHỌN GHẾ -->
            <transition name="slide">
               <div v-if="step === 1" class="step-panel">
                  <h2 class="bhd-title">02. Chọn ghế ngồi</h2>

                  <div class="seat-legend mb-4">
                     <div><span class="legend-box available"></span> Còn trống</div>
                     <div><span class="legend-box selected"></span> Đang chọn</div>
                     <div><span class="legend-box taken"></span> Đã đặt</div>
                     <div><span class="legend-box vip"></span> Ghế VIP</div>
                  </div>

                  <div class="bhd-screen">MÀN HÌNH</div>

                  <div class="bhd-seat-map">
                     <div v-for="row in seatRows" :key="row" class="seat-row">
                        <span class="row-name">{{ row }}</span>
                        <div class="seats">
                           <button
                              v-for="n in 12"
                              :key="n"
                              class="seat"
                              :class="getSeatClass(row, n)"
                              @click="toggleSeat(`${row}${n}`)"
                           >
                              {{ n }}
                           </button>
                        </div>
                        <span class="row-name">{{ row }}</span>
                     </div>
                  </div>

                  <div class="selected-seats mt-4" v-if="selectedSeats.length">
                     <el-tag type="success" size="large">
                        Ghế đã chọn: {{ selectedSeats.join(', ') }}
                     </el-tag>
                  </div>

                  <div class="bhd-actions">
                     <el-button @click="prevStep" plain>QUAY LẠI</el-button>
                     <el-button
                        type="primary"
                        size="large"
                        class="bhd-next-btn"
                        :disabled="!selectedSeats.length"
                        @click="nextStep"
                     >
                        TIẾP TỤC
                     </el-button>
                  </div>
               </div>
            </transition>

            <!-- BƯỚC 3: CHỌN COMBO -->
            <transition name="slide">
               <div v-if="step === 2" class="step-panel">
                  <h2 class="bhd-title">03. Chọn đồ ăn & nước uống</h2>
                  <div class="combo-grid">
                     <div
                        v-for="item in foods"
                        :key="item.id"
                        class="combo-card"
                        :class="{ active: selectedFoods.includes(item.id) }"
                        @click="toggleFood(item.id)"
                     >
                        <img :src="item.image" :alt="item.name" class="combo-img" />
                        <div class="combo-body">
                           <h5>{{ item.name }}</h5>
                           <p class="price">{{ item.price.toLocaleString() }}₫</p>
                           <p class="desc">{{ item.desc }}</p>
                        </div>
                        <div class="combo-check" v-if="selectedFoods.includes(item.id)">✓</div>
                     </div>
                  </div>

                  <div class="bhd-actions">
                     <el-button @click="prevStep" plain>QUAY LẠI</el-button>
                     <el-button type="primary" size="large" class="bhd-next-btn" @click="nextStep">
                        TIẾP TỤC
                     </el-button>
                  </div>
               </div>
            </transition>

            <!-- BƯỚC 4: XÁC NHẬN -->
            <transition name="slide">
               <div v-if="step === 3" class="step-panel">
                  <h2 class="bhd-title">04. Xác nhận & Thanh toán</h2>
                  <el-card class="summary-card">
                     <el-descriptions :column="2" border>
                        <el-descriptions-item label="Phim" label-class-name="bhd-label">
                           <strong>{{ filmName }}</strong>
                        </el-descriptions-item>
                        <el-descriptions-item label="Suất chiếu">
                           <el-tag type="success">{{ selectedShowtime.showTimes }}</el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item label="Ghế ngồi" :span="2">
                           <strong>{{ selectedSeats.join(', ') }}</strong>
                        </el-descriptions-item>
                        <el-descriptions-item label="Combo F&B" :span="2">
                           {{
                              selectedFoods.length
                                 ? selectedFoods.map(getFoodName).join(' • ')
                                 : 'Không chọn'
                           }}
                        </el-descriptions-item>
                        <el-descriptions-item label="Tổng tiền" :span="2" class="total-price">
                           <h2 class="text-success">{{ totalPrice.toLocaleString() }}₫</h2>
                        </el-descriptions-item>
                     </el-descriptions>
                  </el-card>

                  <div class="bhd-actions mt-5">
                     <el-button @click="prevStep" plain>QUAY LẠI</el-button>
                     <el-button
                        type="primary"
                        size="large"
                        class="bhd-pay-btn"
                        @click="confirmBooking"
                     >
                        THANH TOÁN
                     </el-button>
                  </div>
               </div>
            </transition>
         </div>
      </div>
   </div>
</template>

<script setup>
   import { ref, computed } from 'vue';
   import HeaderBook from '../header/HeaderBook.vue';

   const step = ref(0);
   const steps = [
      { title: 'Chọn suất chiếu', subtitle: 'Ngày & giờ chiếu phim' },
      { title: 'Chọn ghế ngồi', subtitle: 'Chọn vị trí ghế yêu thích' },
      { title: 'Combo F&B', subtitle: 'Bắp nước & đồ ăn kèm' },
      { title: 'Thanh toán', subtitle: 'Hoàn tất đặt vé' },
   ];

   // Bước 1
   const showtimes = ref([
      { id: 1, showTimes: '09:30', format: '2D', room: '01' },
      { id: 2, showTimes: '12:00', format: '2D', room: '03' },
      { id: 3, showTimes: '14:30', format: '3D', room: '02' },
      { id: 4, showTimes: '17:00', format: 'IMAX', room: '05' },
      { id: 5, showTimes: '19:30', format: '2D', room: '01' },
      { id: 6, showTimes: '22:00', format: '4DX', room: '04' },
   ]);
   const selectedShowtime = ref(null);
   const selectShowtime = (s) => (selectedShowtime.value = s);

   // Bước 2
   const selectedSeats = ref([]);
   const seatRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
   const takenSeats = ['A5', 'B3', 'C8', 'D2', 'E9', 'F4', 'G6'];
   const vipSeats = ['D5', 'D6', 'D7', 'D8', 'E5', 'E6', 'E7', 'E8'];

   const getSeatClass = (row, num) => {
      const id = `${row}${num}`;
      if (takenSeats.includes(id)) return 'taken';
      if (vipSeats.includes(id)) return 'vip';
      if (selectedSeats.value.includes(id)) return 'selected';
      return 'available';
   };
   const toggleSeat = (id) => {
      if (takenSeats.includes(id)) return;
      const i = selectedSeats.value.indexOf(id);
      i > -1 ? selectedSeats.value.splice(i, 1) : selectedSeats.value.push(id);
   };

   // Bước 3
   const foods = ref([
      {
         id: 1,
         name: 'Combo 1 Người',
         price: 89000,
         desc: '1 Bắp + 1 Nước',
         image: 'https://i.imgur.com/7z2f1bN.png',
      },
      {
         id: 2,
         name: 'Combo Couple',
         price: 139000,
         desc: '1 Bắp lớn + 2 Nước',
         image: 'https://i.imgur.com/3k5j8pL.png',
      },
      {
         id: 3,
         name: 'Combo Gia Đình',
         price: 219000,
         desc: '2 Bắp lớn + 3 Nước',
         image: 'https://i.imgur.com/9m2x1vY.png',
      },
      {
         id: 4,
         name: 'Combo VIP',
         price: 299000,
         desc: 'Bắp phô mai + Nước ngọt lớn',
         image: 'https://i.imgur.com/5p9q3rT.png',
      },
   ]);
   const selectedFoods = ref([]);
   const toggleFood = (id) => {
      const i = selectedFoods.value.indexOf(id);
      i > -1 ? selectedFoods.value.splice(i, 1) : selectedFoods.value.push(id);
   };
   const getFoodName = (id) => foods.value.find((f) => f.id === id)?.name || '';

   // Tổng tiền
   const totalPrice = computed(() => {
      const seat = selectedSeats.value.length * 95000;
      const food = selectedFoods.value.reduce(
         (s, id) => s + (foods.value.find((f) => f.id === id)?.price || 0),
         0
      );
      return seat + food;
   });

   // Điều hướng
   const nextStep = () => step.value < 3 && step.value++;
   const prevStep = () => step.value > 0 && step.value--;

   const filmName = 'DEADPOOL & WOLVERINE';

   const confirmBooking = () => {
      ElMessageBox.alert(
         `<div style="text-align:center">
      <h3>Đặt vé thành công!</h3>
      <p><strong>Phim:</strong> ${filmName}</p>
      <p><strong>Suất:</strong> ${selectedShowtime.value.showTimes}</p>
      <p><strong>Ghế:</strong> ${selectedSeats.value.join(', ')}</p>
      <p><strong>Tổng tiền:</strong> <span style="color:#198754;font-size:1.5em;font-weight:bold">${totalPrice.value.toLocaleString()}₫</span></p>
    </div>`,
         'BHD Star Cineplex',
         { dangerouslyUseHTMLString: true, type: 'success' }
      ).then(() => {
         step.value = 0;
         selectedShowtime.value = null;
         selectedSeats.value = [];
         selectedFoods.value = [];
      });
   };
</script>

<style scoped>
   .bhd-booking {
      background: #f5f5f5;
      min-height: 100vh;
      font-family: 'Roboto', 'Helvetica Neue', sans-serif;
      color: #333;
   }

   /* Thanh tiến trình BHD */
   .bhd-steps-wrapper {
      background: linear-gradient(90deg, #e6f4ea, #d4edda);
      padding: 30px 0;
      border-bottom: 1px solid #c3e6cb;
   }

   .bhd-steps {
      display: flex;
      justify-content: space-between;
      max-width: 1000px;
      margin: 0 auto;
   }

   .bhd-step {
      display: flex;
      align-items: center;
      flex: 1;
      position: relative;
   }

   .bhd-step:not(:last-child)::after {
      content: '';
      position: absolute;
      top: 28px;
      left: 70px;
      right: -50%;
      height: 3px;
      background: #a8d5b3;
      z-index: 1;
   }

   .bhd-step.completed::after,
   .bhd-step.active::after {
      background: #198754;
   }

   .step-number {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #fff;
      border: 3px solid #a8d5b3;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: bold;
      color: #198754;
      z-index: 2;
   }

   .bhd-step.active .step-number,
   .bhd-step.completed .step-number {
      background: #198754;
      color: white;
      border-color: #198754;
   }

   .bhd-step.completed .check {
      font-size: 28px;
   }

   .step-text {
      margin-left: 16px;
   }

   .step-text .title {
      font-weight: 700;
      font-size: 16px;
      color: #198754;
   }

   .step-text .subtitle {
      font-size: 13px;
      color: #666;
      margin-top: 4px;
   }

   /* Nội dung */
   .bhd-content {
      max-width: 1100px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
   }

   .bhd-title {
      font-size: 28px;
      font-weight: 700;
      color: #198754;
      margin-bottom: 30px;
      text-align: center;
   }

   /* Bước 1 */
   .showtime-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 20px;
      margin: 30px 0;
   }

   .showtime-item {
      border: 2px solid #e9ecef;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
   }

   .showtime-item:hover {
      border-color: #198754;
      transform: translateY(-5px);
   }

   .showtime-item.active {
      background: #d4edda;
      border-color: #198754;
   }

   .showtime-item .time {
      font-size: 28px;
      font-weight: 900;
      color: #198754;
   }

   .showtime-item .info {
      margin-top: 10px;
      font-size: 14px;
   }

   .format {
      background: #198754;
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
   }

   /* Bước 2 */
   .bhd-screen {
      background: #198754;
      color: white;
      text-align: center;
      padding: 16px;
      font-weight: bold;
      border-radius: 8px;
      margin: 30px 0;
      letter-spacing: 2px;
   }

   .bhd-seat-map {
      background: #f8f9fa;
      padding: 30px;
      border-radius: 12px;
      border: 1px solid #dee2e6;
   }

   .seat-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin: 12px 0;
   }

   .row-name {
      width: 30px;
      font-weight: bold;
      color: #198754;
   }

   .seats {
      display: flex;
      gap: 8px;
   }

   .seat {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      border: none;
      font-size: 12px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s;
   }

   .seat.available {
      background: #e9ecef;
   }
   .seat.available:hover {
      background: #d4edda;
      transform: scale(1.1);
   }
   .seat.selected {
      background: #198754;
      color: white;
   }
   .seat.taken {
      background: #adb5bd;
      color: #6c757d;
      cursor: not-allowed;
   }
   .seat.vip {
      background: #ffc107;
      color: #212529;
   }

   /* Bước 3 */
   .combo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 24px;
      margin: 30px 0;
   }

   .combo-card {
      border: 2px solid #e9ecef;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s;
      position: relative;
   }

   .combo-card:hover {
      border-color: #198754;
      transform: translateY(-8px);
   }
   .combo-card.active {
      border-color: #198754;
      box-shadow: 0 8px 25px rgba(25, 135, 84, 0.2);
   }

   .combo-img {
      width: 100%;
      height: 180px;
      object-fit: cover;
   }

   .combo-body {
      padding: 16px;
      text-align: center;
   }

   .combo-body h5 {
      margin: 0 0 8px;
      font-size: 18px;
   }
   .price {
      color: #198754;
      font-size: 22px;
      font-weight: 900;
      margin: 8px 0;
   }
   .desc {
      color: #666;
      font-size: 14px;
   }

   .combo-check {
      position: absolute;
      top: 12px;
      right: 12px;
      background: #198754;
      color: white;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: bold;
   }

   /* Nút BHD */
   .bhd-next-btn,
   .bhd-pay-btn {
      background: #198754 !important;
      border-color: #198754 !important;
      font-weight: 700;
      padding: 12px 40px !important;
      border-radius: 8px !important;
   }

   .bhd-pay-btn {
      font-size: 20px !important;
      padding: 16px 60px !important;
   }

   .bhd-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
   }

   /* Legend */
   .seat-legend {
      display: flex;
      justify-content: center;
      gap: 30px;
      flex-wrap: wrap;
      font-size: 14px;
   }

   .legend-box {
      display: inline-block;
      width: 20px;
      height: 20px;
      border-radius: 4px;
      margin-right: 8px;
      vertical-align: middle;
   }

   .legend-box.available {
      background: #e9ecef;
   }
   .legend-box.selected {
      background: #198754;
   }
   .legend-box.taken {
      background: #adb5bd;
   }
   .legend-box.vip {
      background: #ffc107;
   }

   /* Transition */
   .slide-enter-active,
   .slide-leave-active {
      transition: all 0.5s ease;
   }
   .slide-enter-from {
      opacity: 0;
      transform: translateX(50px);
   }
   .slide-leave-to {
      opacity: 0;
      transform: translateX(-50px);
   }
</style>
