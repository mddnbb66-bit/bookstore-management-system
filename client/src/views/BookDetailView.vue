<script setup>
// 文件说明：前台图书详情页，展示单本图书信息并支持加入购物车。
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import BaseButton from '../components/BaseButton.vue';
import { api } from '../api/services';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const book = ref(null);

const fallbackCover = computed(() => {
  if (!book.value) return 'https://placehold.co/420x560/1f2937/ffffff?text=Book';
  return `https://placehold.co/420x560/1f2937/ffffff?text=${encodeURIComponent(book.value.title || 'Book')}`;
});

const loadDetail = async () => {
  const result = await api.bookDetail(route.params.id);
  book.value = result.data;
};

const addCart = async () => {
  if (!auth.isUser) return router.push('/login');
  await api.addCart({ book_id: book.value.book_id, quantity: 1 });
  window.alert('已加入购物车');
};

const handleCoverError = (event) => {
  event.target.src = fallbackCover.value;
};

onMounted(loadDetail);
</script>

<template>
  <div class="page storefront-page">
    <AppHeader />
    <section class="section container" v-if="book">
      <div class="detail-grid">
        <img :src="book.cover_url || fallbackCover" :alt="book.title" class="detail-cover" @error="handleCoverError" />
        <div class="detail-panel">
          <span class="chip">{{ book.category_name }}</span>
          <h1>{{ book.title }}</h1>
          <p>{{ book.author }} / {{ book.publisher }}</p>
          <p class="detail-summary">{{ book.summary }}</p>
          <div class="detail-price">¥{{ Number(book.sale_price).toFixed(2) }}</div>
          <div class="detail-sub">原价 ¥{{ Number(book.price).toFixed(2) }} · 折扣 {{ book.discount }}</div>
          <div class="detail-sub">库存 {{ book.stock }} · 状态 {{ book.status === 1 ? '上架中' : '已下架' }}</div>
          <BaseButton @click="addCart" :disabled="book.status !== 1">加入购物车</BaseButton>
        </div>
      </div>
    </section>
  </div>
</template>
