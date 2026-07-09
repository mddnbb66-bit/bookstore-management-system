<script setup>
import { onMounted, reactive, ref } from 'vue';
import AdminShell from '../components/AdminShell.vue';
import BaseButton from '../components/BaseButton.vue';
import { api } from '../api/services';
import { useFormValidation, validators } from '../composables/useFormValidation';

const books = ref([]);
const categories = ref([]);
const editingId = ref(null);

const query = reactive({
  keyword: '',
  category_id: '',
  status: ''
});

const form = reactive({
  category_id: '',
  title: '',
  author: '',
  publisher: '',
  summary: '',
  price: '',
  discount: 1,
  stock: 0,
  cover_url: 'https://placehold.co/320x440/111111/ffffff?text=Book',
  status: 1
});

const { errors, validateForm, validateField, clearError, resetErrors } = useFormValidation(form, {
  category_id: [validators.required('图书分类')],
  title: [validators.required('书名'), validators.maxLength('书名', 100)],
  author: [validators.maxLength('作者', 100)],
  publisher: [validators.maxLength('出版社', 100)],
  summary: [validators.maxLength('图书简介', 2000)],
  price: [validators.required('定价'), validators.number('定价'), validators.min('定价', 0.01)],
  discount: [validators.required('折扣'), validators.number('折扣'), validators.min('折扣', 0), validators.max('折扣', 1)],
  stock: [validators.required('库存'), validators.number('库存'), validators.integer('库存'), validators.min('库存', 0)],
  cover_url: [validators.url('封面地址')]
});

const loadData = async () => {
  const [bookRes, categoryRes] = await Promise.all([
    api.books({ pageSize: 50, ...query }),
    api.categories()
  ]);

  books.value = bookRes.data.list;
  categories.value = categoryRes.data;
};

const resetForm = () => {
  editingId.value = null;
  Object.assign(form, {
    category_id: '',
    title: '',
    author: '',
    publisher: '',
    summary: '',
    price: '',
    discount: 1,
    stock: 0,
    cover_url: 'https://placehold.co/320x440/111111/ffffff?text=Book',
    status: 1
  });
  resetErrors();
};

const submit = async () => {
  if (!validateForm()) return;

  if (editingId.value) {
    await api.updateBook(editingId.value, form);
  } else {
    await api.createBook(form);
  }

  resetForm();
  await loadData();
};

const toggleStatus = async (item) => {
  await api.updateBookStatus(item.book_id, { status: item.status === 1 ? 0 : 1 });
  await loadData();
};

const editBook = (item) => {
  editingId.value = item.book_id;
  Object.assign(form, {
    category_id: item.category_id,
    title: item.title,
    author: item.author || '',
    publisher: item.publisher || '',
    summary: item.summary || '',
    price: item.price,
    discount: item.discount,
    stock: item.stock,
    cover_url: item.cover_url || '',
    status: item.status
  });
  resetErrors();
};

const printPage = () => {
  window.print();
};

onMounted(loadData);
</script>

<template>
  <AdminShell>
    <div class="admin-topbar">
      <div>
        <h1>图书管理</h1>
      </div>
    </div>

    <div class="admin-panel-grid">
      <div class="detail-card">
        <h3>{{ editingId ? '编辑图书' : '新增图书' }}</h3>
        <div class="form-grid">
          <div class="field-group">
            <select v-model="form.category_id" class="field-input" :class="{ 'input-error': errors.category_id }" @blur="validateField('category_id')" @change="clearError('category_id')">
              <option value="">选择分类</option>
              <option v-for="item in categories" :key="item.category_id" :value="item.category_id">
                {{ item.category_name }}
              </option>
            </select>
            <p v-if="errors.category_id" class="field-error">{{ errors.category_id }}</p>
          </div>

          <div class="field-group">
            <input v-model="form.title" class="field-input" :class="{ 'input-error': errors.title }" placeholder="书名" @blur="validateField('title')" @input="clearError('title')" />
            <p v-if="errors.title" class="field-error">{{ errors.title }}</p>
          </div>

          <div class="field-group">
            <input v-model="form.author" class="field-input" :class="{ 'input-error': errors.author }" placeholder="作者" @blur="validateField('author')" @input="clearError('author')" />
            <p v-if="errors.author" class="field-error">{{ errors.author }}</p>
          </div>

          <div class="field-group">
            <input v-model="form.publisher" class="field-input" :class="{ 'input-error': errors.publisher }" placeholder="出版社" @blur="validateField('publisher')" @input="clearError('publisher')" />
            <p v-if="errors.publisher" class="field-error">{{ errors.publisher }}</p>
          </div>

          <div class="field-group">
            <input v-model="form.price" class="field-input" :class="{ 'input-error': errors.price }" placeholder="定价" @blur="validateField('price')" @input="clearError('price')" />
            <p v-if="errors.price" class="field-error">{{ errors.price }}</p>
          </div>

          <div class="field-group">
            <input v-model="form.discount" class="field-input" :class="{ 'input-error': errors.discount }" placeholder="折扣（1 表示不打折）" @blur="validateField('discount')" @input="clearError('discount')" />
            <p v-if="errors.discount" class="field-error">{{ errors.discount }}</p>
          </div>

          <div class="field-group">
            <input v-model="form.stock" class="field-input" :class="{ 'input-error': errors.stock }" placeholder="库存" @blur="validateField('stock')" @input="clearError('stock')" />
            <p v-if="errors.stock" class="field-error">{{ errors.stock }}</p>
          </div>

          <div class="field-group">
            <input v-model="form.cover_url" class="field-input" :class="{ 'input-error': errors.cover_url }" placeholder="封面地址" @blur="validateField('cover_url')" @input="clearError('cover_url')" />
            <p v-if="errors.cover_url" class="field-error">{{ errors.cover_url }}</p>
          </div>
        </div>

        <div class="field-group">
          <textarea v-model="form.summary" class="field-input" :class="{ 'input-error': errors.summary }" rows="4" placeholder="图书简介" @blur="validateField('summary')" @input="clearError('summary')"></textarea>
          <p v-if="errors.summary" class="field-error">{{ errors.summary }}</p>
        </div>

        <div class="nav-actions">
          <BaseButton @click="submit">{{ editingId ? '保存修改' : '新增图书' }}</BaseButton>
          <BaseButton variant="secondary" @click="resetForm">重置</BaseButton>
        </div>
      </div>

      <div class="table-card">
        <div class="section-head">
          <h3>图书列表</h3>
          <BaseButton variant="secondary" @click="printPage">打印列表</BaseButton>
        </div>

        <div class="filter-bar">
          <input v-model="query.keyword" placeholder="按书名、作者、出版社查询" />
          <select v-model="query.category_id">
            <option value="">全部分类</option>
            <option v-for="item in categories" :key="item.category_id" :value="item.category_id">
              {{ item.category_name }}
            </option>
          </select>
          <select v-model="query.status">
            <option value="">全部状态</option>
            <option :value="1">上架</option>
            <option :value="0">下架</option>
          </select>
          <BaseButton @click="loadData">筛选</BaseButton>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>书名</th>
              <th>分类</th>
              <th>价格</th>
              <th>库存</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in books" :key="item.book_id">
              <td>{{ item.title }}</td>
              <td>{{ item.category_name }}</td>
              <td>¥{{ Number(item.price).toFixed(2) }}</td>
              <td>{{ item.stock }}</td>
              <td>{{ item.status === 1 ? '上架' : '下架' }}</td>
              <td>
                <button class="link-btn" @click="editBook(item)">编辑</button>
                <button class="link-btn" @click="toggleStatus(item)">切换状态</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminShell>
</template>
