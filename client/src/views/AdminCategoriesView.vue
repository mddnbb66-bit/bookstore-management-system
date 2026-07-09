<script setup>
import { onMounted, reactive, ref } from 'vue';
import AdminShell from '../components/AdminShell.vue';
import BaseButton from '../components/BaseButton.vue';
import { api } from '../api/services';
import { useFormValidation, validators } from '../composables/useFormValidation';

const categories = ref([]);
const editingId = ref(null);
const form = reactive({
  category_name: '',
  description: ''
});

const { errors, validateForm, validateField, clearError, resetErrors } = useFormValidation(form, {
  category_name: [validators.required('分类名称'), validators.maxLength('分类名称', 50)],
  description: [validators.maxLength('分类说明', 255)]
});

const loadData = async () => {
  const result = await api.categories();
  categories.value = result.data;
};

const submit = async () => {
  if (!validateForm()) return;

  if (editingId.value) {
    await api.updateCategory(editingId.value, form);
  } else {
    await api.createCategory(form);
  }

  resetForm();
  await loadData();
};

const editItem = (item) => {
  editingId.value = item.category_id;
  form.category_name = item.category_name;
  form.description = item.description || '';
  resetErrors();
};

const resetForm = () => {
  editingId.value = null;
  form.category_name = '';
  form.description = '';
  resetErrors();
};

const removeItem = async (id) => {
  await api.deleteCategory(id);
  await loadData();
};

onMounted(loadData);
</script>

<template>
  <AdminShell>
    <div class="admin-topbar">
      <div>
        <h1>分类管理</h1>
      </div>
    </div>

    <div class="admin-panel-grid">
      <div class="detail-card">
        <h3>{{ editingId ? '编辑分类' : '新增分类' }}</h3>

        <div class="field-group">
          <input v-model="form.category_name" class="field-input" :class="{ 'input-error': errors.category_name }" placeholder="分类名称" @blur="validateField('category_name')" @input="clearError('category_name')" />
          <p v-if="errors.category_name" class="field-error">{{ errors.category_name }}</p>
        </div>

        <div class="field-group">
          <input v-model="form.description" class="field-input" :class="{ 'input-error': errors.description }" placeholder="分类说明" @blur="validateField('description')" @input="clearError('description')" />
          <p v-if="errors.description" class="field-error">{{ errors.description }}</p>
        </div>

        <div class="nav-actions">
          <BaseButton @click="submit">{{ editingId ? '保存修改' : '添加分类' }}</BaseButton>
          <BaseButton variant="secondary" @click="resetForm">重置</BaseButton>
        </div>
      </div>

      <div class="table-card">
        <h3>分类列表</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>分类</th>
              <th>说明</th>
              <th>图书数</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in categories" :key="item.category_id">
              <td>{{ item.category_name }}</td>
              <td>{{ item.description }}</td>
              <td>{{ item.book_count }}</td>
              <td>
                <button class="link-btn" @click="editItem(item)">编辑</button>
                <button class="link-btn" @click="removeItem(item.category_id)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminShell>
</template>
