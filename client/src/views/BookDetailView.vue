<script setup>
// 文件说明：前台图书详情页，展示单本图书信息并支持加入购物车。
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import BaseButton from '../components/BaseButton.vue';
import BookCover from '../components/BookCover.vue';
import { api } from '../api/services';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const book = ref(null);

const loadDetail = async () => {
  const result = await api.bookDetail(route.params.id);
  book.value = result.data;
};

const addCart = async () => {
  if (!auth.isUser) return router.push('/login');
  await api.addCart({ book_id: book.value.book_id, quantity: 1 });
  window.alert('已加入购物车');
};

onMounted(loadDetail);
</script>

<template>
  <div class="page storefront-page">
    <AppHeader />
    <section class="section container" v-if="book">
      <div class="detail-grid">
        <BookCover
          class="detail-cover"
          :title="book.title"
          :author="book.author"
          :category-name="book.category_name"
          :cover-url="book.cover_url"
          :book-id="book.book_id"
        />
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
