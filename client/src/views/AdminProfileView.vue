<script setup>
import { onMounted, reactive } from 'vue';
import AdminShell from '../components/AdminShell.vue';
import BaseButton from '../components/BaseButton.vue';
import { api } from '../api/services';
import { useAuthStore } from '../stores/auth';
import { useFormValidation, validators } from '../composables/useFormValidation';

const auth = useAuthStore();
const form = reactive({ name: '' });
const { errors, validateForm, validateField, clearError } = useFormValidation(form, {
  name: [validators.maxLength('姓名', 50)]
});

onMounted(async () => {
  const result = await api.me();
  Object.assign(form, result.data);
});

const save = async () => {
  if (!validateForm()) return;

  await api.updateAdminProfile({ name: form.name });
  await auth.fetchMe();
  window.alert('保存成功');
};
</script>

<template>
  <AdminShell>
    <div class="admin-topbar">
      <div>
        <h1>个人信息</h1>
      </div>
    </div>

    <div class="detail-card">
      <div class="form-grid">
        <div class="field-group">
          <input v-model="form.name" class="field-input" :class="{ 'input-error': errors.name }" placeholder="姓名" @blur="validateField('name')" @input="clearError('name')" />
          <p v-if="errors.name" class="field-error">{{ errors.name }}</p>
        </div>
      </div>
      <BaseButton @click="save">保存资料</BaseButton>
    </div>
  </AdminShell>
</template>
