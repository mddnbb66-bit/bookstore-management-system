<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import BaseButton from '../components/BaseButton.vue';
import BookCard from '../components/BookCard.vue';
import BookCover from '../components/BookCover.vue';
import { api } from '../api/services';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
const router = useRouter();

const textMap = {
  allCategories: '\u5168\u90e8\u5206\u7c7b',
  searchPlaceholder: '\u641c\u7d22\u4e66\u540d\u3001\u4f5c\u8005\u3001\u51fa\u7248\u793e\u3001ISBN',
  search: '\u641c\u7d22',
  cart: '\u8d2d\u7269\u8f66',
  heroTitle: '\u7f51\u4e0a\u4e66\u5e97',
  heroDesc: '\u6d4f\u89c8\u56fe\u4e66\u3001\u5206\u7c7b\u7b5b\u9009\u3001\u52a0\u5165\u8d2d\u7269\u8f66\u5e76\u5b8c\u6210\u4f1a\u5458\u8d2d\u4e66\u6d41\u7a0b\u3002',
  browseBooks: '\u6d4f\u89c8\u56fe\u4e66',
  myCart: '\u6211\u7684\u8d2d\u7269\u8f66',
  todayPick: '\u4eca\u65e5\u63a8\u8350',
  allBooksArrow: '\u67e5\u770b\u5168\u90e8\u56fe\u4e66 \u2192',
  hotBooks: '\u70ed\u95e8\u597d\u4e66',
  inStock: '\u5e93\u5b58\u5145\u8db3',
  memberOnly: '\u4f1a\u5458\u4e13\u4eab',
  viewAllBooks: '\u67e5\u770b\u5168\u90e8\u56fe\u4e66',
  categories: '\u56fe\u4e66\u5206\u7c7b',
  allCategoriesArrow: '\u67e5\u770b\u5168\u90e8\u5206\u7c7b \u2192',
  recommended: '\u63a8\u8350\u56fe\u4e66',
  moreArrow: '\u67e5\u770b\u66f4\u591a \u2192',
  addCartDone: '\u5df2\u52a0\u5165\u8d2d\u7269\u8f66'
};

const categoryNames = {
  tech: '\u8ba1\u7b97\u673a',
  fiction: '\u6587\u5b66\u5c0f\u8bf4',
  business: '\u7ecf\u6d4e\u7ba1\u7406',
  education: '\u6559\u80b2\u8003\u8bd5',
  science: '\u79d1\u5b66\u6280\u672f'
};

const categories = ref([]);
const books = ref([]);
const cartCount = ref(0);
const search = reactive({
  keyword: '',
  category_id: ''
});

const categoryMeta = {
  [categoryNames.tech]: {
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.5v5"/><path d="M7.5 7.5 12 12"/><path d="M16.5 7.5 12 12"/><circle cx="12" cy="15.5" r="2.2"/><circle cx="6" cy="7" r="1.8"/><circle cx="18" cy="7" r="1.8"/><circle cx="8" cy="19" r="1.8"/><circle cx="16" cy="19" r="1.8"/><path d="M10.2 16.9 8.9 18"/><path d="M13.8 16.9 15.1 18"/></svg>',
    count: `50+ \u672c`,
    accent: 'accent-tech'
  },
  [categoryNames.fiction]: {
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4.5h7l3 3v12H7z"/><path d="M14 4.5v3h3"/><path d="M10 12h4"/><path d="M10 15.5h4"/></svg>',
    count: `80+ \u672c`,
    accent: 'accent-fiction'
  },
  [categoryNames.business]: {
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 18.5h14"/><path d="M7 18.5v-6"/><path d="M12 18.5v-10"/><path d="M17 18.5v-8"/><path d="M7 9.5h0"/><path d="M12 6h0"/><path d="M17 8.5h0"/></svg>',
    count: `60+ \u672c`,
    accent: 'accent-business'
  },
  [categoryNames.education]: {
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5 4.5 9 12 13 19.5 9 12 5Z"/><path d="M7.5 11.5V15c0 1.4 2 2.5 4.5 2.5s4.5-1.1 4.5-2.5v-3.5"/><path d="M19.5 9v5"/></svg>',
    count: `40+ \u672c`,
    accent: 'accent-education'
  },
  [categoryNames.science]: {
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M8 16.5v-5.2L12 9l4 2.3v5.2"/><path d="M6 18.5h12"/><path d="M8.2 8.8 12 6l3.8 2.8"/><circle cx="9" cy="13.5" r="1.1"/><circle cx="15" cy="13.5" r="1.1"/></svg>',
    count: `30+ \u672c`,
    accent: 'accent-science'
  }
};

const featuredBooks = computed(() => books.value.slice(0, 8));
const todayPicks = computed(() => books.value.slice(0, 3));
const topCategories = computed(() => categories.value.slice(0, 5));

const loadData = async () => {
  const [categoryRes, bookRes] = await Promise.all([
    api.categories(),
    api.books({ pageSize: 8, status: 1 })
  ]);

  categories.value = categoryRes.data;
  books.value = bookRes.data.list;
};

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

const goSearch = () => {
  router.push({
    path: '/books',
    query: {
      ...(search.keyword ? { keyword: search.keyword } : {}),
      ...(search.category_id ? { category_id: search.category_id } : {})
    }
  });
};

const goCategory = (categoryId) => {
  router.push({
    path: '/books',
    query: { category_id: categoryId }
  });
};

const addCart = async (book) => {
  if (!auth.isUser) {
    return router.push('/login');
  }

  await api.addCart({ book_id: book.book_id, quantity: 1 });
  await loadCartCount();
  window.alert(textMap.addCartDone);
};

onMounted(async () => {
  await loadData();
  await loadCartCount();
});
</script>

<template>
  <div class="page storefront-page store-home-page">
    <AppHeader />

    <section class="store-search-section">
      <div class="container">
        <div class="store-searchbar">
          <select v-model="search.category_id" class="store-searchbar__select">
            <option value="">{{ textMap.allCategories }}</option>
            <option v-for="item in categories" :key="item.category_id" :value="item.category_id">
              {{ item.category_name }}
            </option>
          </select>

          <input
            v-model="search.keyword"
            class="store-searchbar__input"
            :placeholder="textMap.searchPlaceholder"
            @keyup.enter="goSearch"
          />

          <button class="store-searchbar__button" @click="goSearch">{{ textMap.search }}</button>

          <router-link to="/cart" class="store-searchbar__cart">
            <span>{{ textMap.cart }}</span>
            <i v-if="cartCount > 0">{{ cartCount }}</i>
          </router-link>
        </div>
      </div>
    </section>

    <section class="store-hero-section">
      <div class="container">
        <div class="store-hero-card">
          <div class="store-hero-copy">
            <h1>{{ textMap.heroTitle }}</h1>
            <p>{{ textMap.heroDesc }}</p>
            <div class="store-hero-actions">
              <router-link to="/books"><BaseButton>{{ textMap.browseBooks }}</BaseButton></router-link>
              <router-link to="/cart"><BaseButton variant="secondary">{{ textMap.myCart }}</BaseButton></router-link>
            </div>
          </div>

          <div class="store-hero-recommend">
            <div class="store-hero-recommend__head">
              <h3>{{ textMap.todayPick }}</h3>
              <router-link to="/books">{{ textMap.allBooksArrow }}</router-link>
            </div>

            <div class="store-hero-recommend__covers">
              <div
                v-for="(book, index) in todayPicks"
                :key="book.book_id"
                class="store-pick-cover"
                :style="{ '--pick-rotate': `${index === 1 ? '0deg' : index === 0 ? '-5deg' : '5deg'}` }"
              >
                <router-link :to="`/books/${book.book_id}`" class="store-pick-cover__link">
                  <BookCover
                    :title="book.title"
                    :author="book.author"
                    :category-name="book.category_name"
                    :cover-url="book.cover_url"
                    :book-id="book.book_id"
                  />
                </router-link>
              </div>
            </div>

            <div class="store-hero-recommend__tags">
              <span>{{ textMap.hotBooks }}</span>
              <span>{{ textMap.inStock }}</span>
              <span>{{ textMap.memberOnly }}</span>
            </div>

            <div class="store-hero-recommend__footer">
              <router-link to="/books"><BaseButton>{{ textMap.viewAllBooks }}</BaseButton></router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="store-section">
      <div class="container">
        <div class="store-section__head">
          <h2>{{ textMap.categories }}</h2>
          <router-link to="/books">{{ textMap.allCategoriesArrow }}</router-link>
        </div>

        <div class="store-category-grid">
          <button
            v-for="item in topCategories"
            :key="item.category_id"
            class="store-category-card"
            type="button"
            @click="goCategory(item.category_id)"
          >
            <span
              class="store-category-card__icon"
              :class="categoryMeta[item.category_name]?.accent"
              v-html="categoryMeta[item.category_name]?.icon || ''"
            >
            </span>
            <div class="store-category-card__meta">
              <strong>{{ item.category_name }}</strong>
              <span>{{ categoryMeta[item.category_name]?.count || `${item.book_count || 0}+ \u672c` }}</span>
            </div>
          </button>
        </div>
      </div>
    </section>

    <section class="store-section store-section-books">
      <div class="container">
        <div class="store-section__head">
          <h2>{{ textMap.recommended }}</h2>
          <router-link to="/books">{{ textMap.moreArrow }}</router-link>
        </div>

        <div class="store-book-grid">
          <BookCard v-for="book in featuredBooks" :key="book.book_id" :book="book" @add="addCart" />
        </div>
      </div>
    </section>
  </div>
</template>
