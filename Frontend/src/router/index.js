import { createRouter, createWebHistory } from 'vue-router';

// Import các component
import Home from '../components/home/Home.vue';
import Login from '../components/home/Login.vue';
import Register from '../components/home/Register.vue';
import ForgotPassword from '../components/home/ForgotPassword.vue';
import FilmDetail from '../components/home/FilmDetail.vue';

// Khai báo routes
const routes = [
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
      component: FilmDetail
   },
];

// ✅ Tạo router đúng vị trí
const router = createRouter({
   history: createWebHistory(),
   routes,
});
export default router;
