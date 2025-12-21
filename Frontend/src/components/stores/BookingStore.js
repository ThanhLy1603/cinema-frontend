// src/stores/booking.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useBookingStore = defineStore('booking', () => {
   const bookingInfo = ref({
      film: null,
      schedule: null,
      selectedSeats: [], // { seatId, position, price, ticketPriceId, seatType }
      selectedProducts: [], // { id, name, price, quantity, poster }
      customerInfo: { name: '', email: '', phone: '' },
   });

   // Tiền vé
   const ticketTotal = computed(() => {
      return bookingInfo.value.selectedSeats.reduce((sum, seat) => {
         return sum + (seat.ticketPrice || seat.price | 0);
      }, 0);
   });

   // Tiền combo
   const productTotal = computed(() => {
      return bookingInfo.value.selectedProducts.reduce((sum, item) => {
         return sum + (item.price || 0) * (item.quantity || 1);
      }, 0);
   });

   // Tổng tiền
   const totalAmount = computed(() => {
      const seatTotal = bookingInfo.value.selectedSeats.reduce((sum, seat) => {
         return sum + (seat.ticketPrice || seat.price || 0);
      }, 0);

      const productTotal = bookingInfo.value.selectedProducts.reduce((sum, item) => {
         return sum + (item.price || 0) * (item.quantity || 1);
      }, 0);

      return seatTotal + productTotal;
   });

   // Tổng số món (ghế + combo) – dùng cho badge giỏ hàng
   const cartItemCount = computed(() => {
      const seats = bookingInfo.value.selectedSeats.length;
      const products = bookingInfo.value.selectedProducts.reduce(
         (sum, item) => sum + (item.quantity || 0),
         0
      );
      return seats + products;
   });

   // Số ghế đã chọn
   const seatCount = computed(() => bookingInfo.value.selectedSeats.length);

   // Danh sách combo trong giỏ (tránh dùng hàm)
   const productsInCart = computed(() => bookingInfo.value.selectedProducts);

   // Lưu phim + suất chiếu
   const setFilmAndSchedule = (film, schedule) => {
      bookingInfo.value.film = film;
      bookingInfo.value.schedule = schedule;
   };

   const addSeat = (seat) => {
      if (!bookingInfo.value.selectedSeats.some((s) => s.seatId === seat.seatId)) {
         bookingInfo.value.selectedSeats.push({
            seatId: seat.seatId,
            position: seat.position,
            price: seat.price,
            ticketPriceId: seat.ticketPriceId,
            seatType: seat.seatType || 'Thường',
         });
      }
   };

   const removeSeat = (seatId) => {
      bookingInfo.value.selectedSeats = bookingInfo.value.selectedSeats.filter(
         (s) => s.seatId !== seatId
      );
   };

   const addProduct = (product) => {
      const id = product.id || product.productId;
      const existing = bookingInfo.value.selectedProducts.find((p) => p.id === id);

      if (existing) {
         existing.quantity += 1;
      } else {
         bookingInfo.value.selectedProducts.push({
            id: product.id,
            name: product.name,
            price: product.price || 0,
            poster: product.poster || null,
            quantity: 1,
         });
      }
   };

   const increaseQuantity = (id) => {
      const item = bookingInfo.value.selectedProducts.find((p) => p.id === id);
      if (item) item.quantity += 1;
   };

   const decreaseQuantity = (id) => {
      const item = bookingInfo.value.selectedProducts.find((p) => p.id === id);
      if (item && item.quantity > 1) {
         item.quantity -= 1;
      } else if (item) {
         removeProduct(id);
      }
   };

   const removeProduct = (id) => {
      bookingInfo.value.selectedProducts = bookingInfo.value.selectedProducts.filter(
         (p) => p.id !== id
      );
   };

   const clearBooking = () => {
      bookingInfo.value = {
         film: null,
         schedule: '',
         selectedSeats: [],
         selectedProducts: [],
         customerInfo: { name: '', email: '', phone: '' },
      };
   };

   return {
      bookingInfo,
      ticketTotal,
      productTotal,
      totalAmount,
      cartItemCount,
      seatCount,
      productsInCart, // Dùng cái này thay cho selectedProducts()
      setFilmAndSchedule,

      addSeat,
      removeSeat,
      addProduct,
      increaseQuantity,
      decreaseQuantity,
      removeProduct,
      clearBooking,
   };
});
