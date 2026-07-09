<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import BaseButton from '../components/BaseButton.vue';
import BookCard from '../components/BookCard.vue';
import { api } from '../api/services';
import { useAuthStore } from '../stores/auth';
import { useFormValidation, validators } from '../composables/useFormValidation';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const books = ref([]);
const categories = ref([]);
const pagination = ref({ page: 1, pageSize: 8, total: 0 });

const query = reactive({
  keyword: '',
  category_id: '',
  status: 1,
  page: 1,
  pageSize: 8
});

const { errors, validateForm, validateField, clearError } = useFormValidation(query, {
  keyword: [validators.maxLength('搜索关键词', 100)]
});

const syncQueryFromRoute = () => {
  query.keyword = route.query.keyword || '';
  query.category_id = route.query.category_id || '';
  query.page = Number(route.query.page || 1);
};

const loadData = async () => {
  const [bookRes, categoryRes] = await Promise.all([api.books(query), api.categories()]);
  books.value = bookRes.data.list;
  categories.value = categoryRes.data;
  pagination.value = bookRes.data.pagination;
};

const search = () => {
  if (!validateForm()) return;

  query.page = 1;
  router.push({
    path: '/books',
    query: {
      ...(query.keyword ? { keyword: query.keyword } : {}),
      ...(query.category_id ? { category_id: query.category_id } : {})
    }
  });
};

const addCart = async (book) => {
  if (!auth.isUser) {
    return router.push('/login');
  }

  await api.addCart({ book_id: book.book_id, quantity: 1 });
  window.alert('已加入购物车');
};

watch(
  () => route.query,
  async () => {
    syncQueryFromRoute();
    await loadData();
  },
  { deep: true }
);

onMounted(async () => {
  syncQueryFromRoute();
  await loadData();
});
</script>

<template>
  <div class="page storefront-page">
    <AppHeader />

    <section class="section container">
      <div class="filter-bar">
        <div class="field-group">
          <input
            v-model="query.keyword"
            class="field-input"
            :class="{ 'input-error': errors.keyword }"
            placeholder="搜索书名、作者、出版社"
            @blur="validateField('keyword')"
            @input="clearError('keyword')"
          />
          <p v-if="errors.keyword" class="field-error">{{ errors.keyword }}</p>
        </div>
        <select v-model="query.category_id">
          <option value="">全部分类</option>
          <option v-for="item in categories" :key="item.category_id" :value="item.category_id">
            {{ item.category_name }}
          </option>
        </select>
        <BaseButton @click="search">筛选</BaseButton>
      </div>

      <div class="chip-row chip-row-filter">
        <router-link to="/books" class="chip chip-link">全部</router-link>
        <router-link
          v-for="item in categories"
          :key="item.category_id"
          :to="{ path: '/books', query: { category_id: item.category_id } }"
          class="chip chip-link"
        >
          {{ item.category_name }}
        </router-link>
      </div>

      <div class="book-grid">
        <BookCard v-for="book in books" :key="book.book_id" :book="book" @add="addCart" />
      </div>

      <div class="list-foot">共 {{ pagination.total }} 本图书</div>
    </section>
  </div>
</template>
