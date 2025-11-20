<template>
   <div class="seat-map-wrap">
      <div class="screen">Màn hình</div>

      <div class="map-and-legend">
         <div class="seat-grid" :style="`grid-template-columns: repeat(${columns}, ${cellSize}px)`">
            <!-- background grid cells to keep spacing -->
            <div v-for="n in totalGridCells" :key="'bg-' + n" class="grid-bg"></div>

            <!-- seats -->
            <div
               v-for="seat in positionedSeats"
               :key="seat.id"
               class="seat"
               :class="[
                  seatClass(seat),
                  { occupied: !seat.active, selected: selectedIds.has(seat.id) },
               ]"
               :style="{ gridColumnStart: seat.gridCol, gridRowStart: seat.gridRow }"
               @click="toggleSelect(seat)"
               :title="`${seat.position} — ${seat.seatType_name} — ${seat.room_name}`"
            >
               <div class="seat-label">{{ seat.position }}</div>
            </div>
         </div>

         <div class="legend">
            <div class="legend-item">
               <div class="box regular"></div>
               <div>Thường</div>
            </div>
            <div class="legend-item">
               <div class="box vip"></div>
               <div>VIP</div>
            </div>
            <div class="legend-item">
               <div class="box couple"></div>
               <div>Couple</div>
            </div>
         </div>
      </div>

      <div class="controls">
         <div>Chọn: {{ selectedLabel }}</div>
         <div class="control-buttons">
            <button @click="clearSelection">Bỏ chọn</button>
            <button @click="confirmSelection" :disabled="!selectedIds.size">Xác nhận</button>
         </div>
      </div>
   </div>
</template>

<script setup>
   import { ref, computed, watch } from 'vue';

   const props = defineProps({
      seats: { type: Array, default: () => [] },
      columns: { type: Number, default: 15 },
      cellSizePx: { type: Number, default: 56 },
   });
   const emit = defineEmits(['select', 'deselect', 'confirm', 'click-seat']);

   const selectedIds = ref(new Set());
   const columns = props.columns;
   const cellSize = props.cellSizePx;
   const sourceSeats = computed(() => props.seats || []);

   const positionedSeats = computed(() => {
      const letters = new Set();
      const parsed = sourceSeats.value
         .map((s) => {
            const pos = String(s.position || '')
               .trim()
               .toUpperCase();
            const m = pos.match(/^([A-Z]+)(\d+)$/);
            if (!m) return null;
            const rowLetters = m[1];
            const num = parseInt(m[2], 10);
            letters.add(rowLetters);
            return {
               id: s.id,
               position: pos,
               rowLetters,
               number: num,
               active: !!s.active,
               room_id: s.room?.id,
               room_name: s.room?.name,
               seatType_id: s.seatType?.id,
               seatType_name: s.seatType?.name,
            };
         })
         .filter(Boolean);

      const letterList = Array.from(letters).sort((a, b) => (a < b ? -1 : 1));
      const letterIndex = {};
      letterList.forEach((l, idx) => (letterIndex[l] = idx + 1));

      parsed.forEach((p) => {
         p.gridCol = ((p.number - 1) % columns) + 1;
         p.gridRow = letterIndex[p.rowLetters] || 1;
      });

      return parsed;
   });

   const rowsCount = computed(() =>
      Math.max(
         1,
         positionedSeats.value.reduce((acc, s) => Math.max(acc, s.gridRow || 1), 0)
      )
   );
   const totalGridCells = computed(() => rowsCount.value * columns);

   function seatClass(seat) {
      const t = (seat.seatType_name || '').toLowerCase();
      if (t.includes('vip')) return 'vip';
      if (t.includes('couple')) return 'couple';
      return 'regular';
   }

   function toggleSelect(seat) {
      if (!seat.active) return;
      if (selectedIds.value.has(seat.id)) {
         selectedIds.value.delete(seat.id);
         emit('deselect', seat);
      } else {
         selectedIds.value.add(seat.id);
         emit('select', seat);
      }
      emit('click-seat', seat);
   }

   function clearSelection() {
      selectedIds.value.clear();
   }

   function confirmSelection() {
      const ids = Array.from(selectedIds.value);
      const selected = positionedSeats.value.filter((s) => ids.includes(s.id));
      emit('confirm', selected);
   }

   const selectedLabel = computed(() => {
      if (!selectedIds.value.size) return '—';
      const ids = Array.from(selectedIds.value);
      const list = positionedSeats.value.filter((s) => ids.includes(s.id)).map((s) => s.position);
      return list.join(', ');
   });

   watch(sourceSeats, () => {
      const idsNow = new Set(sourceSeats.value.map((s) => s.id));
      for (const id of Array.from(selectedIds.value))
         if (!idsNow.has(id)) selectedIds.value.delete(id);
   });
</script>

<style scoped>
   .seat-map-wrap {
      font-family: Arial, Helvetica, sans-serif;
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: center;
      padding: 12px;
      max-width: 1100px;
      margin: 0 auto;
   }
   .screen {
      background: #f3f4f6;
      padding: 6px 18px;
      border-radius: 6px;
      font-weight: 700;
      box-shadow: inset 0 0 0 1px #ddd;
   }
   .map-and-legend {
      display: flex;
      gap: 24px;
      align-items: flex-start;
   }
   .seat-grid {
      display: grid;
      gap: 6px;
      padding: 10px;
      border-radius: 6px;
   }
   .grid-bg {
      border-radius: 4px;
      background: transparent;
      min-height: 48px;
      min-width: 48px;
   }
   .seat {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      min-width: 48px;
      min-height: 48px;
      box-sizing: border-box;
      border: 2px solid #1f2937;
      cursor: pointer;
      user-select: none;
      font-weight: 700;
   }
   .seat.regular {
      background: #fff;
      color: #111827;
   }
   .seat.vip {
      background: #fff245;
      color: #111827;
   }
   .seat.couple {
      background: #28b6ff;
      color: #03203c;
   }
   .seat.occupied {
      opacity: 0.45;
      cursor: not-allowed;
   }
   .seat.selected {
      outline: 3px solid #2563eb;
      box-shadow: 0 2px 6px rgba(37, 99, 235, 0.25);
   }
   .seat-label {
      font-size: 12px;
      padding: 2px 4px;
   }
   .legend {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 120px;
   }
   .legend-item {
      display: flex;
      gap: 10px;
      align-items: center;
   }
   .legend .box {
      width: 36px;
      height: 36px;
      border-radius: 4px;
      border: 1px solid #111827;
   }
   .legend .box.regular {
      background: #fff;
   }
   .legend .box.vip {
      background: #fff245;
   }
   .legend .box.couple {
      background: #28b6ff;
   }
   .controls {
      display: flex;
      justify-content: space-between;
      width: 100%;
      align-items: center;
      margin-top: 8px;
   }
   .control-buttons {
      display: flex;
      gap: 8px;
   }
   button {
      padding: 6px 10px;
      border-radius: 4px;
      border: 1px solid #ccc;
      background: #fff;
      cursor: pointer;
   }
   button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
   }
</style>
