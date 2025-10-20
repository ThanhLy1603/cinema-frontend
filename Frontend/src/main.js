import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
// Import Bootstrap CSS và JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import SweetAlert2
import VueSweetalert2 from 'vue-sweetalert2'; 
import 'sweetalert2/dist/sweetalert2.min.css';
import router from './router';

// 1. Khởi tạo ứng dụng
const app = createApp(App);

// 2. Định nghĩa cấu hình mặc định cho SweetAlert2 (Tùy chọn)
const swalOptions = {
    confirmButtonColor: '#94e900', // Màu xanh của Vue
    cancelButtonColor: '#ff7674',
};

// 3. ĐĂNG KÝ CÁC PLUGIN BẰNG app.use()
// Đăng ký SweetAlert2. Điều này tạo ra biến toàn cục $swal
app.use(VueSweetalert2, swalOptions); 
// Đăng ký Vue Router
app.use(router);

// 4. Mount ứng dụng
app.mount('#app');