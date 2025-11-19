import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

// Bootstrap CSS & JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Vue3 Select
import 'vue3-select/dist/vue3-select.css';

// SweetAlert2
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// Element Plus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

// Router
import router from './router';

// Tạo app
const app = createApp(App);

// Cấu hình SweetAlert2
const swalOptions = {
  confirmButtonColor: '#94e900',
  cancelButtonColor: '#ff7674',
};

// Đăng ký plugin
app.use(router);
app.use(VueSweetalert2, swalOptions);
app.use(ElementPlus);

// Đăng ký toàn bộ icon Element Plus
for (const [name, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(name, component);
}

// Mount
app.mount('#app');
