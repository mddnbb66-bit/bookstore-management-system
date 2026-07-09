// File role: route mapping and auth guards for landing page, storefront, and admin pages.
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  { path: '/', component: () => import('../views/Landing.vue'), meta: { transition: 'page-luxe' } },
  { path: '/store', component: () => import('../views/StoreHome.vue') },
  { path: '/login', component: () => import('../views/LoginView.vue'), meta: { transition: 'page-float' } },
  { path: '/register', component: () => import('../views/RegisterView.vue'), meta: { transition: 'page-luxe' } },
  { path: '/books', component: () => import('../views/BooksView.vue') },
  { path: '/books/:id', component: () => import('../views/BookDetailView.vue') },
  { path: '/cart', component: () => import('../views/CartView.vue'), meta: { requiresUser: true } },
  { path: '/orders', component: () => import('../views/MyOrdersView.vue'), meta: { requiresUser: true } },
  { path: '/orders/:id', component: () => import('../views/OrderDetailView.vue'), meta: { requiresUser: true } },
  { path: '/profile', component: () => import('../views/ProfileView.vue'), meta: { requiresAuth: true } },
  { path: '/admin/login', component: () => import('../views/AdminLoginView.vue'), meta: { transition: 'page-luxe' } },
  { path: '/admin', component: () => import('../views/AdminDashboardView.vue'), meta: { requiresAdmin: true } },
  { path: '/admin/dashboard', redirect: '/admin' },
  { path: '/admin/categories', component: () => import('../views/AdminCategoriesView.vue'), meta: { requiresAdmin: true } },
  { path: '/admin/books', component: () => import('../views/AdminBooksView.vue'), meta: { requiresAdmin: true } },
  { path: '/admin/users', component: () => import('../views/AdminUsersView.vue'), meta: { requiresAdmin: true } },
  { path: '/admin/orders', component: () => import('../views/AdminOrdersView.vue'), meta: { requiresAdmin: true } },
  { path: '/admin/stats', component: () => import('../views/AdminStatsView.vue'), meta: { requiresAdmin: true } },
  { path: '/admin/profile', component: () => import('../views/AdminProfileView.vue'), meta: { requiresAdmin: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  if (auth.token && !auth.user) {
    try {
      await auth.fetchMe();
    } catch (error) {
      auth.clear();
    }
  }

  if (to.meta.requiresAdmin && !auth.isAdmin) return '/admin/login';
  if (to.meta.requiresUser && !auth.isUser) return '/login';
  if (to.meta.requiresAuth && !auth.isLoggedIn) return '/login';
  return true;
});

export default router;
