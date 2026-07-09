<script setup>
import { onMounted, reactive } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import BaseButton from '../components/BaseButton.vue';
import { api } from '../api/services';
import { useAuthStore } from '../stores/auth';
import { useFormValidation, validators } from '../composables/useFormValidation';

const auth = useAuthStore();
const form = reactive({ name: '', email: '', phone: '', address: '' });
const { errors, validateForm, validateField, clearError } = useFormValidation(form, {
  name: [validators.maxLength('姓名', 50)],
  email: [validators.email('邮箱')],
  phone: [validators.phone('电话')],
  address: [validators.maxLength('收货地址', 255)]
});

onMounted(async () => {
  const result = await api.userDetail(auth.user.id);
  Object.assign(form, result.data);
});

const save = async () => {
  if (!validateForm()) return;

  await api.updateUser(auth.user.id, form);
  await auth.fetchMe();
  window.alert('保存成功');
};
</script>

<template>
  <div class="page storefront-page">
    <AppHeader />
    <section class="section container">
      <div class="detail-card">
        <h2>个人信息</h2>
        <div class="form-grid">
          <div class="field-group">
            <input v-model="form.name" class="field-input" :class="{ 'input-error': errors.name }" placeholder="姓名" @blur="validateField('name')" @input="clearError('name')" />
            <p v-if="errors.name" class="field-error">{{ errors.name }}</p>
          </div>
          <div class="field-group">
            <input v-model="form.email" class="field-input" :class="{ 'input-error': errors.email }" placeholder="邮箱" @blur="validateField('email')" @input="clearError('email')" />
            <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
          </div>
          <div class="field-group">
            <input v-model="form.phone" class="field-input" :class="{ 'input-error': errors.phone }" placeholder="电话" @blur="validateField('phone')" @input="clearError('phone')" />
            <p v-if="errors.phone" class="field-error">{{ errors.phone }}</p>
          </div>
          <div class="field-group">
            <input v-model="form.address" class="field-input" :class="{ 'input-error': errors.address }" placeholder="收货地址" @blur="validateField('address')" @input="clearError('address')" />
            <p v-if="errors.address" class="field-error">{{ errors.address }}</p>
          </div>
        </div>
        <BaseButton @click="save">保存资料</BaseButton>
      </div>
    </section>
  </div>
</template>
