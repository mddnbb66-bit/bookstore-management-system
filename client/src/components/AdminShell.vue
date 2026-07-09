<script setup>
import AppHeader from './AppHeader.vue';

const textMap = {
  title: '\u540e\u53f0\u7ba1\u7406',
  backStore: '\u8fd4\u56de\u524d\u53f0',
  dashboard: '\u7cfb\u7edf\u9996\u9875',
  categories: '\u5206\u7c7b\u7ba1\u7406',
  books: '\u56fe\u4e66\u7ba1\u7406',
  users: '\u4f1a\u5458\u7ba1\u7406',
  orders: '\u8ba2\u5355\u7ba1\u7406',
  stats: '\u7edf\u8ba1\u5206\u6790',
  profile: '\u4e2a\u4eba\u4fe1\u606f'
};
</script>

<template>
  <div class="admin-shell">
    <AppHeader />
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <h2>{{ textMap.title }}</h2>
        <router-link to="/store" class="admin-sidebar__back">{{ textMap.backStore }}</router-link>
        <router-link to="/admin">{{ textMap.dashboard }}</router-link>
        <router-link to="/admin/categories">{{ textMap.categories }}</router-link>
        <router-link to="/admin/books">{{ textMap.books }}</router-link>
        <router-link to="/admin/users">{{ textMap.users }}</router-link>
        <router-link to="/admin/orders">{{ textMap.orders }}</router-link>
        <router-link to="/admin/stats">{{ textMap.stats }}</router-link>
        <router-link to="/admin/profile">{{ textMap.profile }}</router-link>
      </aside>
      <main class="admin-main">
        <slot />
      </main>
    </div>
  </div>
</template>
