<script setup>
import { computed } from 'vue';
import BaseButton from './BaseButton.vue';
import BookCover from './BookCover.vue';

const props = defineProps({
  book: { type: Object, required: true }
});

const emit = defineEmits(['add']);

const currentPrice = computed(() => {
  const price = Number(props.book.price || 0);
  const salePrice = Number(props.book.sale_price || price || 0);
  return Math.min(price, salePrice);
});

const originalPrice = computed(() => {
  const price = Number(props.book.price || 0);
  const salePrice = Number(props.book.sale_price || price || 0);
  return Math.max(price, salePrice);
});

const stockLabel = computed(() => (Number(props.book.stock) > 5 ? '\u5e93\u5b58\uff1a\u5145\u8db3' : '\u5e93\u5b58\uff1a\u4e0d\u8db3'));
const fallbackAuthor = '\u4f5a\u540d';
const detailText = '\u8be6\u60c5';
const addText = '\u52a0\u5165\u8d2d\u7269\u8f66';
const currency = '\u00a5';
</script>

<template>
  <article class="store-book-card">
    <router-link :to="`/books/${book.book_id}`" class="store-book-card__cover-link">
      <BookCover
        :title="book.title"
        :author="book.author"
        :category-name="book.category_name"
        :cover-url="book.cover_url"
        :book-id="book.book_id"
        compact
      />
    </router-link>

    <div class="store-book-card__body">
      <span class="store-book-card__category">{{ book.category_name }}</span>
      <router-link :to="`/books/${book.book_id}`" class="store-book-card__title">{{ book.title }}</router-link>
      <p class="store-book-card__author">{{ book.author || fallbackAuthor }}</p>

      <div class="store-book-card__price">
        <strong>{{ currency }}{{ currentPrice.toFixed(2) }}</strong>
        <span v-if="originalPrice > currentPrice">{{ currency }}{{ originalPrice.toFixed(2) }}</span>
      </div>

      <p class="store-book-card__stock" :class="{ 'is-low': Number(book.stock) <= 5 }">
        {{ stockLabel }}
      </p>

      <div class="store-book-card__actions">
        <BaseButton variant="secondary" @click="$router.push(`/books/${book.book_id}`)">{{ detailText }}</BaseButton>
        <BaseButton :disabled="book.status !== 1" @click="emit('add', book)">{{ addText }}</BaseButton>
      </div>
    </div>
  </article>
</template>
