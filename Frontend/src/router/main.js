import AdminDashboard from '../components/admin/AdminDashboard.vue';
import FilmsManager from '../components/admin/FilmsManager.vue';
import CategoryManager from "../components/admin/CategoryManager.vue";

const adminRoutes = [
  {
    path: '/admin',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: 'films',
        name: 'FilmsManager',
        component: FilmsManager
      },

       { path: "CategoryManager", 
        component: 
        CategoryManager },
    ]
  }
];

export default adminRoutes;
