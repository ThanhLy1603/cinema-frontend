import { createRouter, createWebHistory } from 'vue-router'

// Import các component
import Home from '../components/home/Home.vue';
import Login from '../components/home/Login.vue';
import Register from '../components/home/Register.vue';
import AccountProfile from '../components/auth/account-profile.vue';

// Khai báo routes
const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/auth/:id",
    name: "Profile",
    component: AccountProfile,
    meta: { requiresAuth: true } // Yêu cầu đăng nhập để truy cập
  }
];

// ✅ Tạo router đúng vị trí
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
