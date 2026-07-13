<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseButton from './BaseButton.vue';
import { useAuthStore } from '../stores/auth';
import { api } from '../api/services';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const cartCount = ref(0);

const textMap = {
  brand: '\u7f51\u4e0a\u4e66\u5e97\u7ba1\u7406\u7cfb\u7edf',
  home: '\u9996\u9875',
  enterStore: '\u4e66\u5e97\u9996\u9875',
  books: '\u56fe\u4e66\u5217\u8868',
  cart: '\u8d2d\u7269\u8f66',
  orders: '\u6211\u7684\u8ba2\u5355',
  profile: '\u4e2a\u4eba\u4fe1\u606f',
  welcome: '\u6b22\u8fce\u56de\u6765\uff0c',
  member: '\u4f1a\u5458',
  logout: '\u9000\u51fa\u767b\u5f55',
  login: '\u767b\u5f55',
  register: '\u6ce8\u518c',
  admin: '\u540e\u53f0\u767b\u5f55',
  enterAdmin: '\u8fdb\u5165\u540e\u53f0'
};

const isAdmin = computed(() => route.path.startsWith('/admin'));
const welcomeText = computed(() => auth.user?.name || auth.user?.username || textMap.member);

const navItems = computed(() => [
  { id: 'home', label: textMap.home, to: '/', active: route.path === '/' },
  { id: 'enter-store', label: textMap.enterStore, to: '/store', active: route.path === '/store' },
  { id: 'books', label: textMap.books, to: '/books', active: route.path.startsWith('/books') },
  { id: 'cart', label: textMap.cart, to: '/cart', active: route.path.startsWith('/cart') },
  { id: 'orders', label: textMap.orders, to: '/orders', active: route.path.startsWith('/orders') },
  { id: 'profile', label: textMap.profile, to: '/profile', active: route.path.startsWith('/profile') }
]);

const loadCartCount = async () => {
  if (!auth.isUser) {
    cartCount.value = 0;
    return;
  }

  try {
    const result = await api.cart();
    cartCount.value = (result.data.list || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  } catch (error) {
    cartCount.value = 0;
  }
};

const logout = async () => {
  await auth.logout();
  router.push(isAdmin.value ? '/admin/login' : '/store');
};

onMounted(loadCartCount);

watch(
  () => [auth.isUser, route.fullPath],
  () => {
    loadCartCount();
  }
);
</script>

<template>
  <header class="site-header" :class="{ 'site-header-admin': isAdmin }">
    <div class="container nav-shell">
      <router-link to="/store" class="brand-mark">{{ textMap.brand }}</router-link>

      <nav v-if="!isAdmin" class="nav-links">
        <router-link
          v-for="item in navItems"
          :key="item.id"
          :to="item.to"
          class="nav-link"
          :class="{ 'is-current': item.active }"
        >
          <span>{{ item.label }}</span>
          <i v-if="item.id === 'cart' && cartCount > 0" class="nav-badge">{{ cartCount }}</i>
        </router-link>
      </nav>

      <div class="nav-actions">
        <template v-if="!isAdmin && auth.isLoggedIn">
          <router-link v-if="auth.isAdmin" to="/admin"><BaseButton>{{ textMap.enterAdmin }}</BaseButton></router-link>
          <span class="welcome-text">{{ textMap.welcome }}{{ welcomeText }}</span>
          <BaseButton variant="secondary" @click="logout">{{ textMap.logout }}</BaseButton>
        </template>

        <template v-else-if="!isAdmin">
          <router-link to="/login"><BaseButton variant="secondary">{{ textMap.login }}</BaseButton></router-link>
          <router-link to="/register"><BaseButton>{{ textMap.register }}</BaseButton></router-link>
          <router-link to="/admin/login" class="admin-entry-link">{{ textMap.admin }}</router-link>
        </template>

        <template v-else>
          <BaseButton variant="secondary" @click="logout">{{ textMap.logout }}</BaseButton>
        </template>
      </div>
    </div>
  </header>
</template>
