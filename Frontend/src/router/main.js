// adminRoutes.js
import AdminDashboard from '../components/admin/AdminDashboard.vue';

const adminRoutes = [
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'admin' },
  }
];

export default adminRoutes;
