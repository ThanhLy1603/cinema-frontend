// adminRoutes.js
import AdminDashboard from '../components/admin/AdminDashboard.vue';
import FilmsManager from '../components/admin/FilmsManager.vue';

const adminRoutes = [
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: 'films',
        name: 'FilmsManager',
        component: FilmsManager
      }
    ]
  }
];

export default adminRoutes;
