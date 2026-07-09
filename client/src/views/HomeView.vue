<script setup>
// File role: storefront home page with hero, category links, featured books, splash intro, and scroll reveal.
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import BaseButton from '../components/BaseButton.vue';
import BookCard from '../components/BookCard.vue';
import { api } from '../api/services';
import { useAuthStore } from '../stores/auth';

const SPLASH_COUNT_KEY = 'bookstore_splash_count';
const MAX_SPLASH_COUNT = 3;

const categories = ref([]);
const books = ref([]);
const showSplash = ref(false);
const auth = useAuthStore();
const router = useRouter();
let revealObserver = null;

const loadData = async () => {
  const [categoryRes, bookRes] = await Promise.all([
    api.categories(),
    api.books({ pageSize: 6, status: 1 })
  ]);
  categories.value = categoryRes.data;
  books.value = bookRes.data.list;
};

const setupReveal = () => {
  if (revealObserver) {
    revealObserver.disconnect();
  }

  const nodes = document.querySelectorAll('.scroll-reveal');
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -64px 0px'
    }
  );

  nodes.forEach((node) => revealObserver.observe(node));
};

const maybePlaySplash = () => {
  const currentCount = Number(window.sessionStorage.getItem(SPLASH_COUNT_KEY) || '0');

  if (currentCount >= MAX_SPLASH_COUNT) {
    showSplash.value = false;
    return;
  }

  showSplash.value = true;
  window.sessionStorage.setItem(SPLASH_COUNT_KEY, String(currentCount + 1));

  window.setTimeout(() => {
    showSplash.value = false;
  }, 1900);
};

const addCart = async (book) => {
  if (!auth.isUser) {
    return router.push('/login');
  }

  await api.addCart({ book_id: book.book_id, quantity: 1 });
  window.alert('已加入购物车');
};

onMounted(async () => {
  await loadData();
  await nextTick();
  setupReveal();
  maybePlaySplash();
});

onUnmounted(() => {
  if (revealObserver) {
    revealObserver.disconnect();
  }
});
</script>

<template>
  <div class="page storefront-page">
    <transition name="splash-fade">
      <div v-if="showSplash" class="splash-screen">
        <div class="splash-orb splash-orb-left"></div>
        <div class="splash-orb splash-orb-right"></div>
        <div class="splash-content">
          <span class="splash-kicker">BookStore Management System</span>
          <h1>网上书店管理系统</h1>
          <p>图书浏览、购物车、订单处理、后台管理、统计分析</p>
          <div class="splash-line"></div>
        </div>
      </div>
    </transition>

    <AppHeader />

    <section class="hero">
      <div class="container hero-grid">
        <div>
          <span class="eyebrow">数据库综合训练课设</span>
          <h1>网上书店管理系统</h1>
          <p>
            系统支持图书浏览、会员注册登录、购物车、订单处理、后台管理和统计分析，
            适合课程演示、截图展示和功能答辩。
          </p>
          <div class="hero-actions">
            <router-link to="/books"><BaseButton>进入书店</BaseButton></router-link>
            <router-link to="/admin/login"><BaseButton variant="secondary">后台登录</BaseButton></router-link>
          </div>
        </div>

        <div class="hero-panel">
          <div class="hero-stat">
            <strong>20+</strong>
            <span>图书基础数据</span>
          </div>
          <div class="hero-stat">
            <strong>5+</strong>
            <span>订单示例数据</span>
          </div>
          <div class="hero-stat">
            <strong>ECharts</strong>
            <span>销售统计图表</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section container scroll-reveal reveal-section">
      <div class="section-head">
        <h2>图书分类</h2>
        <router-link to="/books" class="text-link">查看全部</router-link>
      </div>
      <div class="chip-row">
        <router-link
          v-for="(item, index) in categories"
          :key="item.category_id"
          :to="{ path: '/books', query: { category_id: item.category_id } }"
          class="chip chip-link reveal-item"
          :style="{ '--reveal-delay': `${index * 110}ms` }"
        >
          {{ item.category_name }}
        </router-link>
      </div>
    </section>

    <section class="section container scroll-reveal reveal-section">
      <div class="section-head">
        <h2>推荐图书</h2>
      </div>
      <div class="book-grid">
        <div
          v-for="(book, index) in books"
          :key="book.book_id"
          class="reveal-item reveal-card"
          :style="{ '--reveal-delay': `${index * 150}ms` }"
        >
          <BookCard :book="book" @add="addCart" />
        </div>
      </div>
    </section>
  </div>
</template>
