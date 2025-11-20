// src/main.js (hoặc main.ts)
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Vue3-Select (nếu dùng)
import 'vue3-select/dist/vue3-select.css'

// SweetAlert2
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

// Element Plus (bắt buộc phải có)
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'                     // Style toàn bộ
import 'element-plus/theme-chalk/dark/css-vars.css'      // Tùy chọn: hỗ trợ dark mode

// Icons Element Plus (để dùng <el-icon><Search /></el-icon>)
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// Vue Router
import router from './router'

// ------------------------------------------------------------------
// 1. Tạo app
const app = createApp(App)

// 2. Cấu hình SweetAlert2 (tùy chọn)
const swalOptions = {
  confirmButtonColor: '#94e900',
  cancelButtonColor: '#ff7674',
}

// 3. Đăng ký toàn bộ plugin
app.use(router)
app.use(VueSweetalert2, swalOptions)
app.use(ElementPlus)   // QUAN TRỌNG NHẤT – không có dòng này là lỗi import

// 4. Đăng ký toàn bộ icon của Element Plus làm global component (rất tiện)
for (const [name, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(name, component)
}

// 5. Mount
app.mount('#app')