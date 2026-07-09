<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: { type: String, default: '' },
  author: { type: String, default: '' },
  categoryName: { type: String, default: '' },
  coverUrl: { type: String, default: '' },
  bookId: { type: [String, Number], default: '' },
  compact: { type: Boolean, default: false }
});

const categoryNames = {
  tech: '\u8ba1\u7b97\u673a',
  fiction: '\u6587\u5b66\u5c0f\u8bf4',
  business: '\u7ecf\u6d4e\u7ba1\u7406',
  education: '\u6559\u80b2\u8003\u8bd5',
  science: '\u79d1\u5b66\u6280\u672f'
};

const generatedTone = computed(() => {
  const map = {
    [categoryNames.tech]: 'cover-tone-tech',
    [categoryNames.fiction]: 'cover-tone-fiction',
    [categoryNames.business]: 'cover-tone-business',
    [categoryNames.education]: 'cover-tone-education',
    [categoryNames.science]: 'cover-tone-science'
  };
  return map[props.categoryName] || 'cover-tone-default';
});

const useImage = computed(() => {
  if (!props.coverUrl) return false;
  return !/placehold\.co|via\.placeholder/i.test(props.coverUrl);
});

const coverCode = computed(() => String(props.bookId || '').padStart(2, '0').slice(-2));
const safeCategory = computed(() => props.categoryName || '\u56fe\u4e66');
const safeTitle = computed(() => props.title || '\u672a\u547d\u540d\u56fe\u4e66');
const safeAuthor = computed(() => props.author || '\u4f5a\u540d');
</script>

<template>
  <div class="book-cover-art" :class="[generatedTone, { 'book-cover-art-compact': compact }]">
    <img v-if="useImage" :src="coverUrl" :alt="title" class="book-cover-art__image" />
    <template v-else>
      <div class="book-cover-art__overlay"></div>
      <div class="book-cover-art__topline"></div>
      <div class="book-cover-art__dot"></div>
      <div class="book-cover-art__serial">{{ coverCode }}</div>
      <div class="book-cover-art__content">
        <span class="book-cover-art__category">{{ safeCategory }}</span>
        <h3>{{ safeTitle }}</h3>
        <p>{{ safeAuthor }}</p>
      </div>
    </template>
  </div>
</template>
