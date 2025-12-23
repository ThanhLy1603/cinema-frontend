import { createRouter, createWebHistory } from 'vue-router';

// ===== Import các component =====
import Home from '../components/home/Home.vue';
import Login from '../components/home/Login.vue';
import Register from '../components/home/Register.vue';
import ForgotPassword from '../components/home/ForgotPassword.vue';
import FilmDetail from '../components/home/FilmDetail.vue';
import AdminDashboard from '../components/admin/AdminDashboard.vue';
import AccountProfile from '../components/auth/AccountProfile.vue';
import ProductDetails from '../components/home/ProductDetails.vue';
import BookTicket from '../components/home/BookTicket.vue';
import StaffDashboard from '../components/staff/StaffDashboard.vue';
import BookProducts from '../components/home/BookProducts.vue';
import Invoices from '../components/home/Invoices.vue';
import CustomerHistory from '../components/load/CustomerHistory.vue';

// ===== Khai báo routes =====
const routes = [
   // Public routes
   { path: '/', name: 'Home', component: Home },
   { path: '/register', name: 'Register', component: Register },
   { path: '/login', name: 'Login', component: Login },
   { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },
   { path: '/film/:id', name: 'FilmDetail', component: FilmDetail },
   { path: '/booking/:filmId', name: 'BookTicket', component: BookTicket },
   { path: '/bookproducts', name: 'BookProducts', component: BookProducts ,meta: { requiresAuth: true }},
   { path: '/payment', name: 'Invoices', component: Invoices ,meta: { requiresAuth: true }},
   { path: '/customer/history', name: 'CustomerHistory', component: CustomerHistory, meta: { requiresAuth: true }},


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
   {
      path: '/products/:id',
      name: 'ProductDetails',
      component: ProductDetails,
   },
   {
      path: '/staff',
      name: 'StaffDashboard',
      component: StaffDashboard
   },

   // Fallback
   { path: '/:pathMatch(.*)*', redirect: '/' },
];

// ===== Tạo router =====
const router = createRouter({
   history: createWebHistory(),
   routes,
   scrollBehavior(to, from, savedPosition) {
      // Nếu có vị trí cuộn trước đó (back/forward)
      if (savedPosition) {
         return savedPosition;
      }
      // Luôn scroll về top khi chuyển trang mới
      return { top: 0 };
   },
});


// router.beforeEach((to, from, next) => {
//    const token = localStorage.getItem('token');
//    const userRole = localStorage.getItem('role'); // e.g. ROLE_ADMIN, ROLE_USER
//    const normalizedRole = userRole ? userRole.replace('ROLE_', '').toLowerCase() : '';

   
//    if (token && (to.path === '/login' || to.path === '/register')) {
//       return next('/');
//    }

  
//    if (to.query.tab === 'AccountProfile' && !token) {
//       return next({ path: '/', query: { tab: 'Films' } });
//    }

   
//    if (to.meta.requiresAuth && !token) {
//       return next('/login');
//    }

   
//    if (to.meta.role && to.meta.role.toLowerCase() !== normalizedRole) {
//       return next('/');
//    }

//    next();
// });

export default router;
