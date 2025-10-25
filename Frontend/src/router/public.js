import Home from '../components/home/Home.vue';
import Login from '../components/home/Login.vue';
import Register from '../components/home/Register.vue';
import ForgotPassword from '../components/home/ForgotPassword.vue';
import FilmDetail from '../components/home/FilmDetail.vue';

export const publicRoutes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },
    { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },
    { path: '/film/:id', name: 'FilmDetail', component: FilmDetail },
];
export default publicRoutes;