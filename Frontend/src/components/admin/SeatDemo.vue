<script setup>
import { ref, computed, onMounted } from 'vue';

// --- DỮ LIỆU ---
const selectedSeats = ref([]);
const reservedSeats = ref([
  'A5', 'A6', 'G1', 'G2', 'O_couple3_left', 'O_couple3_right'
]);

const seatPrices = {
  normal: 100000,
  vip: 150000,
  couple: 250000
};

const seats = ref([]);

// --- TẠO DANH SÁCH GHẾ ---
const generateSeats = () => {
  const seatList = [];
  const rowLabels = 'ABCDEFGHIJKLMNOP'.split('');
  const numCols = 16;

  for (let row of rowLabels) {
    if (row === 'N' || row === 'O') {
      // Ghế couple
      for (let j = 1; j <= numCols / 2; j++) {
        const base = `${row}_couple${j}`;

        seatList.push({
          id: `${base}_left`,
          row,
          number: j,
          type: 'couple',
          isReserved: reservedSeats.value.includes(`${base}_left`),
          isLeft: true
        });

        seatList.push({
          id: `${base}_right`,
          row,
          number: j,
          type: 'couple',
          isReserved: reservedSeats.value.includes(`${base}_right`),
          isLeft: false
        });
      }
    } else {
      // Ghế thường/VIP
      for (let j = 1; j <= numCols; j++) {
        const id = `${row}${j}`;
        const type = row >= 'G' && row <= 'M' ? 'vip' : 'normal';

        seatList.push({
          id,
          row,
          number: j,
          type,
          isReserved: reservedSeats.value.includes(id)
        });
      }
    }
  }

  seats.value = seatList;
};

// --- HÀM CHECK ---
const isReserved = (seatId) => reservedSeats.value.includes(seatId);
const isSelected = (seatId) => selectedSeats.value.includes(seatId);

const getSeatType = (seatId) => {
  const found = seats.value.find(s => s.id === seatId);
  return found ? found.type : null;
};

// --- XỬ LÝ CLICK GHẾ ---
const toggleSeat = (seat) => {
  if (seat.isReserved) return;

  // --- GHẾ COUPLE ---
  if (seat.type === 'couple') {
    const partnerId = seat.isLeft
      ? seat.id.replace('_left', '_right')
      : seat.id.replace('_right', '_left');

    if (isReserved(partnerId)) {
      alert('Không thể chọn cặp ghế này vì một nửa đã được đặt trước!');
      return;
    }

    const base = seat.id.replace('_left', '').replace('_right', '');

    const isAlready =
      selectedSeats.value.includes(seat.id) ||
      selectedSeats.value.includes(partnerId);

    if (isAlready) {
      selectedSeats.value = selectedSeats.value.filter(s => !s.startsWith(base));
    } else {
      selectedSeats.value.push(seat.id, partnerId);
    }

    return;
  }

  // --- GHẾ THƯỜNG/VIP ---
  const index = selectedSeats.value.indexOf(seat.id);

  if (index > -1) {
    selectedSeats.value.splice(index, 1);
  } else {
    selectedSeats.value.push(seat.id);
  }
};

// --- TÍNH TỔNG TIỀN ---
const totalCalculation = computed(() => {
  let total = 0;
  const countedCouples = new Set();

  for (let seatId of selectedSeats.value) {
    const type = getSeatType(seatId);

    if (type === 'couple') {
      const base = seatId.split('_couple')[0] + '_couple' + seatId.split('_couple')[1].split('_')[0];
      if (!countedCouples.has(base)) {
        countedCouples.add(base);
        total += seatPrices.couple;
      }
    } else {
      total += seatPrices[type];
    }
  }

  return total;
});

// --- FORMAT HIỂN THỊ GHẾ ---
const formattedSelectedSeats = computed(() => {
  return selectedSeats.value
    .filter(s => !s.includes('_right'))
    .map(s => s.replace('_left', ''))
    .join(', ') || 'Chưa chọn ghế nào';
});

// --- KHỞI TẠO ---
onMounted(() => generateSeats());
</script>

<template>
  <div class="container my-5 cinema-layout">
    <div class="screen-area mb-5">
      <h2 class="text-center screen-text">Màn hình</h2>
    </div>

    <!-- SƠ ĐỒ GHẾ -->
    <div class="seat-map d-flex flex-column align-items-center">

      <div
        v-for="rowLabel in 'ABCDEFGHIJKLMNO'.split('')"
        :key="rowLabel"
        class="seat-row d-flex justify-content-center mb-1 align-items-center"
      >
        <span class="row-label me-2">{{ rowLabel }}</span>

        <!-- GHẾ COUPLE -->
        <template v-if="rowLabel === 'N' || rowLabel === 'O'">
          <div
            v-for="pair in 8"
            :key="rowLabel + pair"
            class="d-flex couple-pair-wrapper mx-1"
          >
            <template v-for="seat in seats.filter(s => s.row === rowLabel && s.number === pair && s.isLeft)">
              <button
                @click="toggleSeat(seat)"
                :class="[
                  'btn', 'btn-sm', 'seat-button', 'couple-seat',
                  {
                    'bg-couple-reserved': isReserved(seat.id) || isReserved(seat.id.replace('_left', '_right')),
                    'bg-couple-selected': isSelected(seat.id),
                    'bg-couple-available': !isSelected(seat.id)
                      && !isReserved(seat.id)
                      && !isReserved(seat.id.replace('_left', '_right'))
                  }
                ]"
                :disabled="isReserved(seat.id) || isReserved(seat.id.replace('_left', '_right'))"
              ></button>
            </template>
          </div>
        </template>

        <!-- GHẾ THƯỜNG / VIP -->
        <template v-else>
          <div
            v-for="seat in seats.filter(s => s.row === rowLabel)"
            :key="seat.id"
            class="seat-container mx-1"
          >
            <button
              @click="toggleSeat(seat)"
              :class="[
                'btn', 'btn-sm', 'seat-button',
                {
                  'bg-vip-reserved': seat.type === 'vip' && isReserved(seat.id),
                  'bg-vip-selected': seat.type === 'vip' && isSelected(seat.id),
                  'bg-vip-available': seat.type === 'vip' && !isSelected(seat.id) && !isReserved(seat.id),

                  'bg-normal-reserved': seat.type === 'normal' && isReserved(seat.id),
                  'bg-normal-selected': seat.type === 'normal' && isSelected(seat.id),
                  'bg-normal-available': seat.type === 'normal' && !isSelected(seat.id) && !isReserved(seat.id)
                }
              ]"
              :disabled="isReserved(seat.id)"
            >
              {{ seat.number }}
            </button>
          </div>
        </template>
      </div>

      <!-- SỐ CỘT -->
      <div class="seat-numbers d-flex justify-content-center mt-2">
        <span v-for="n in 16" :key="'col-'+n" class="col-number mx-2">{{ n }}</span>
      </div>
    </div>

    <hr class="my-4" />

    <!-- TÓM TẮT -->
    <div class="summary-section mt-4 p-3 border rounded">
      <h4>🎫 Chú thích</h4>

      <div class="legend d-flex flex-wrap mb-3">
        <div class="legend-item me-3 mb-2">
          <span class="legend-color bg-normal-available me-1"></span> Ghế Thường
        </div>
        <div class="legend-item me-3 mb-2">
          <span class="legend-color bg-vip-available me-1"></span> Ghế VIP
        </div>
        <div class="legend-item me-3 mb-2">
          <span class="legend-color bg-couple-available me-1"></span> Ghế Couple
        </div>
        <div class="legend-item me-3 mb-2">
          <span class="legend-color bg-couple-reserved me-1"></span> Đã Đặt
        </div>
      </div>

      <p><strong>Ghế đã chọn:</strong> {{ formattedSelectedSeats }}</p>
      <p><strong>Tổng cộng:</strong> {{ totalCalculation.toLocaleString('vi-VN') }} VNĐ</p>

      <button class="btn btn-primary mt-2" :disabled="selectedSeats.length === 0">
        Xác Nhận Đặt Ghế
      </button>
    </div>
  </div>
</template>

<style scoped>
.cinema-layout {
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.screen-area {
  background-color: #343a40;
  color: white;
  padding: 15px 0;
  border-radius: 5px;
  border-bottom: 5px solid #28a745;
  margin-bottom: 40px; /* Thêm khoảng cách với ghế */
}

.screen-text {
  margin: 0;
  font-size: 1.5rem;
  letter-spacing: 2px;
}

.seat-map {
  max-width: 900px;
  margin: auto;
  perspective: 1000px; /* Tạo hiệu ứng 3D cho toàn bộ ghế */
}

.seat-row {
  width: 100%;
  position: relative;
  margin-bottom: 6px; /* Giảm khoảng cách giữa các hàng */
}

.row-label {
  font-weight: bold;
  font-size: 0.8rem; /* Nhỏ hơn một chút */
  width: 25px; /* Tăng chiều rộng để căn chỉnh */
  text-align: right;
  line-height: 38px; /* Căn chỉnh với ghế */
  color: #555;
}

.seat-container {
    width: 38px;
    height: 38px;
    display: flex;
    justify-content: center;
    align-items: center;
    /* Loại bỏ mx-1 từ template nếu bạn muốn khoảng cách do margin-left/right của ghế tự tạo */
}

.seat-button {
  width: 30px; /* Chiều rộng ghế */
  height: 35px; /* Chiều cao ghế */
  padding: 0;
  font-size: 0.65rem; /* Kích thước số ghế nhỏ hơn */
  font-weight: bold;
  border-radius: 4px 4px 10px 10px; /* Bo tròn góc trên nhiều hơn góc dưới */
  border: none; /* Bỏ viền Bootstrap */
  cursor: pointer;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.2), inset 0 -3px 3px rgba(0,0,0,0.2); /* Tạo hiệu ứng đổ bóng 3D */
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3); /* Tạo bóng chữ */
  
  /* Tạo phần lưng ghế và tay vịn giả */
  &::before, &::after {
    content: '';
    position: absolute;
    background-color: inherit; /* Kế thừa màu ghế */
  }

  /* Lưng ghế */
  &::before {
    top: -8px;
    left: 2px;
    right: 2px;
    height: 10px;
    border-radius: 3px 3px 0 0;
    transform: translateZ(-5px); /* Đẩy ra phía sau một chút */
    opacity: 0.8;
  }

  /* Tay vịn (chỉ là ảo ảnh CSS) */
  &::after {
    bottom: -3px;
    left: -2px;
    right: -2px;
    height: 5px;
    border-radius: 0 0 3px 3px;
    background-color: rgba(0,0,0,0.1); /* Màu tối hơn một chút */
    transform: translateZ(-3px);
  }

  &:not(:disabled):hover {
    transform: translateY(-3px) rotateX(5deg); /* Nhấn vào sẽ nhấc lên */
    box-shadow: 0 6px 10px rgba(0,0,0,0.3), inset 0 -3px 3px rgba(0,0,0,0.2);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
    filter: grayscale(30%); /* Làm mờ ghế đã đặt */
    box-shadow: inset 0 2px 5px rgba(0,0,0,0.3); /* Đổ bóng lõm vào */
    transform: translateZ(-2px);
  }
}


/* Màu sắc cho các loại ghế (sử dụng màu như hình ảnh bạn cung cấp) */
.bg-normal-available { background-color: #4a90e2; } /* Xanh dương */
.bg-normal-selected { background-color: #2ecc71; } /* Xanh lá khi chọn */
.bg-normal-reserved { background-color: #7f8c8d; } /* Xám khi đã đặt */

.bg-vip-available { background-color: #e74c3c; } /* Đỏ */
.bg-vip-selected { background-color: #2ecc71; } /* Xanh lá khi chọn */
.bg-vip-reserved { background-color: #7f8c8d; } /* Xám khi đã đặt */

/* Ghế couple */
.couple-pair-wrapper {
  display: flex;
  margin: 0 4px; /* Khoảng cách giữa các cặp */
}

.couple-seat {
  width: 65px; /* Chiều rộng cho cả cặp ghế */
  height: 35px; /* Chiều cao */
  padding: 0;
  font-size: 0.65rem;
  font-weight: bold;
  border-radius: 4px 4px 10px 10px;
  border: none;
  cursor: pointer;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.2), inset 0 -3px 3px rgba(0,0,0,0.2);
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);

  &::before, &::after {
    content: '';
    position: absolute;
    background-color: inherit;
  }

  /* Lưng ghế couple */
  &::before {
    top: -8px;
    left: 2px;
    right: 2px;
    height: 10px;
    border-radius: 3px 3px 0 0;
    transform: translateZ(-5px);
    opacity: 0.8;
  }

  /* Tay vịn (giả) cho ghế couple */
  &::after {
    bottom: -3px;
    left: -2px;
    right: -2px;
    height: 5px;
    border-radius: 0 0 3px 3px;
    background-color: rgba(0,0,0,0.1);
    transform: translateZ(-3px);
  }

  &:not(:disabled):hover {
    transform: translateY(-3px) rotateX(5deg);
    box-shadow: 0 6px 10px rgba(0,0,0,0.3), inset 0 -3px 3px rgba(0,0,0,0.2);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
    filter: grayscale(30%);
    box-shadow: inset 0 2px 5px rgba(0,0,0,0.3);
    transform: translateZ(-2px);
  }
}

.bg-couple-available { background-color: #ff69b4; } /* Hồng */
.bg-couple-selected { background-color: #2ecc71; } /* Xanh lá khi chọn */
.bg-couple-reserved { background-color: #7f8c8d; } /* Xám khi đã đặt */


/* Số cột ở dưới */
.seat-numbers {
    padding-left: 25px; /* Căn chỉnh với nhãn hàng */
}
.col-number {
    font-size: 0.7rem; /* Nhỏ hơn một chút */
    font-weight: bold;
    width: 38px;
    text-align: center;
    color: #555;
}

/* Chú thích */
.legend-item {
    display: flex;
    align-items: center;
    font-size: 0.9rem;
}
.legend-color {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 4px 4px 10px 10px; /* Bo tròn góc để giống ghế */
    border: none;
    box-shadow: 0 2px 3px rgba(0,0,0,0.1);
    margin-right: 5px;
}

.legend-color.bg-normal-available { background-color: #4a90e2; }
.legend-color.bg-vip-available { background-color: #e74c3c; }
.legend-color.bg-couple-available { background-color: #ff69b4; }
.legend-color.bg-couple-reserved { background-color: #7f8c8d; }
</style>


