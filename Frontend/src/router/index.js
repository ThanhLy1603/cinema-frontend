import { createRouter, createWebHistory } from 'vue-router';

// Khai báo routes
const routes = [
{
  path: "/tai-khoan",
  name: "AuthPage",
  component: () => import("../components/auth/AuthPage.vue"),
},
{
  path: "/dang-nhap",
  name: "DangNhap",
  component: () => import("../components/auth/DangNhap.vue"),
},
{
  path: "/quen-mat-khau",
  name: "QuenMatKhau",
  component: () => import("../components/auth/DangKy.vue"),
},
];

// Tạo router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router