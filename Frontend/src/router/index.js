import { createRouter, createWebHistory } from 'vue-router'

// Import các component
import Login from '../components/auth/login.vue';
import Register from '../components/auth/register.vue';
import AuthPage from '../components/auth/authPage.vue';

// Khai báo routes
const routes = [
  {
    path: "/AuthPage",
    name: "AuthPage",
    component: AuthPage,
  },
  {
    path: "/Login",
    name: "Login",
    component: Login,
  },
  {
    path: "/Register",
    name: "Register",
    component: Register,
  },
];

// ✅ Tạo router đúng vị trí
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ Navigation Guard (bảo vệ route có requiresAuth)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    next("/dang-nhap");
  } else {
    next();
  }
});

export default router;
