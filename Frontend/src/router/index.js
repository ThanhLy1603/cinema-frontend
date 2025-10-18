import { createRouter, createWebHistory } from 'vue-router'

// Import các component
import Home from '../components/home/Home_All.vue';
import Auth from '../components/home/Auth.vue';
import Auth_Register from '../components/home/Auth_Register.vue';

// Khai báo routes
const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/auth_register",
    name: "Auth_Register",
    component: Auth_Register,
  },
  {
    path: "/auth",
    name: "Auth",
    component: Auth,
  }
];

// ✅ Tạo router đúng vị trí
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
