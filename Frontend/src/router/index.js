// import { createRouter, createWebHistory } from 'vue-router';

<<<<<<< HEAD
// // Import các component
// import Home from '../components/home/Home.vue';
// import Login from '../components/home/Login.vue';
// import Register from '../components/home/Register.vue';
// import ForgotPassword from '../components/home/ForgotPassword.vue';
// import FilmDetail from '../components/home/FilmDetail.vue';
// import FilmsManager from '../components/admin/FilmsManager.vue';

// // Khai báo routes
// const routes = [
//    {
//       path: '/',
//       name: 'home',
//       component: Home,
//    },
//    {
//       path: '/register',
//       name: 'Register',
//       component: Register,
//    },
//    {
//       path: '/login',
//       name: 'Login',
//       component: Login,
//    },
//    {
//       path: '/forgot-password',
//       name: 'ForgotPassword',
//       component: ForgotPassword,
//    },
//     {
//       path: '/film/:id',
//       name: 'FilmDetail',
//       component: FilmDetail
//    },
//    {
//       path: '/FilmsManager',
//       name: 'FilmsManager',
//       component: FilmsManager
//    },
// ];
=======
// Import các component
import Home from '../components/home/Home.vue';
import Login from '../components/home/Login.vue';
import Register from '../components/home/Register.vue';
import ForgotPassword from '../components/home/ForgotPassword.vue';
import AccountProfile from '../components/auth/account-profile.vue';
>>>>>>> origin/Quan

// // ✅ Tạo router đúng vị trí
// const router = createRouter({
//    history: createWebHistory(),
//    routes,
// });
// export default router;

import { createRouter, createWebHistory } from 'vue-router';
import publicRoutes from '../router/public.js';   // ✅ đúng đường dẫn
import adminRoutes from '../router/main.js';     // ✅ sửa main.js → admin.js
// Gộp tất cả routes
const routes = [
<<<<<<< HEAD
   ...publicRoutes,
   ...adminRoutes
=======
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
   path: "/forgot-password",
   name: "ForgotPassword",
   component: ForgotPassword
  },
  {
    path: "/auth/:id",
    name: "Profile",
    component: AccountProfile,
    meta: { requiresAuth: true } // Yêu cầu đăng nhập để truy cập
  }
>>>>>>> origin/Quan
];

const router = createRouter({
   history: createWebHistory(),
   routes
});

router.beforeEach(function (to, from, next) {
   const isAuthenticated = localStorage.getItem('token');
   const userRole = localStorage.getItem('role'); // có thể là 'ROLE_ADMIN'

   if (to.meta.requiresAuth) {
      if (!isAuthenticated) {
         return next('/login');
      }

      // 🔧 Chuẩn hóa role về lowercase, bỏ prefix ROLE_
      const normalizedRole = userRole ? userRole.replace('ROLE_', '').toLowerCase() : '';

      if (to.meta.role && to.meta.role.toLowerCase() !== normalizedRole) {
         return next('/');
      }
   }

   next();
});

export default router;

