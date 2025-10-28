import { createRouter, createWebHistory } from 'vue-router';

// ===== Import các component =====
import Home from '../components/home/Home.vue';
import Login from '../components/home/Login.vue';
import Register from '../components/home/Register.vue';
import ForgotPassword from '../components/home/ForgotPassword.vue';
import FilmDetail from '../components/home/FilmDetail.vue';
import AdminDashboard from '../components/admin/AdminDashboard.vue';
import AccountProfile from '../components/auth/AccountProfile.vue';

// Nếu bạn có cấu trúc routes riêng (module-based), có thể import:
// import publicRoutes from '../router/public.js';
// import adminRoutes from '../router/admin.js';

// ===== Khai báo routes =====
const routes = [
   // Public routes
   {
      path: '/',
      name: 'home',
      component: Home,
   },
   {
      path: '/register',
      name: 'Register',
      component: Register,
   },
   {
      path: '/login',
      name: 'Login',
      component: Login,
   },
   {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: ForgotPassword,
   },
   {
      path: '/film/:id',
      name: 'FilmDetail',
      component: FilmDetail,
   },

   // Authenticated user routes
   {
      path: '/auth/:id',
      name: 'Profile',
      component: AccountProfile,
      meta: { requiresAuth: true },
   },

   // Admin routes
   {
      path: '/admin',
      name: 'AdminDashboard',
      component: AdminDashboard,
      meta: { requiresAuth: true, role: 'admin' },
   },

   // Fallback
   {
      path: '/:pathMatch(.*)*',
      redirect: '/',
   },
];

// ===== Tạo router =====
const router = createRouter({
   history: createWebHistory(),
   routes,
});

// ===== Navigation Guard =====
router.beforeEach((to, from, next) => {
   const token = localStorage.getItem('token');
   const userRole = localStorage.getItem('role'); // e.g. ROLE_ADMIN, ROLE_USER

   if (to.meta.requiresAuth) {
      if (!token) {
         return next('/login');
      }

      // Chuẩn hóa role (ROLE_ADMIN → admin)
      const normalizedRole = userRole ? userRole.replace('ROLE_', '').toLowerCase() : '';

      // Nếu route yêu cầu role cụ thể
      if (to.meta.role && to.meta.role.toLowerCase() !== normalizedRole) {
         return next('/');
      }
   }

   next();
});

export default router;
