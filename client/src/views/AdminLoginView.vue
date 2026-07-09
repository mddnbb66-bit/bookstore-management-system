<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import BaseButton from '../components/BaseButton.vue';
import { useAuthStore } from '../stores/auth';
import { useFormValidation, validators } from '../composables/useFormValidation';

const auth = useAuthStore();
const router = useRouter();
const form = reactive({ username: 'admin', password: '123456' });
const { errors, validateForm, validateField, clearError } = useFormValidation(form, {
  username: [validators.required('管理员账号'), validators.minLength('管理员账号', 2), validators.maxLength('管理员账号', 50)],
  password: [validators.required('密码'), validators.maxLength('密码', 255)]
});

const submit = async () => {
  if (!validateForm()) return;

  try {
    await auth.login({ ...form, role: 'admin' });
    router.push('/admin/dashboard');
  } catch (error) {
    window.alert(error.message);
  }
};
</script>

<template>
  <div class="page admin-login-page auth-scene auth-scene-admin">
    <div class="auth-scene-decor auth-decor-left"></div>
    <div class="auth-scene-decor auth-decor-right"></div>

    <div class="auth-wrap auth-wrap-luxe">
      <div class="auth-copy auth-copy-luxe">
        <span class="eyebrow">管理员入口</span>
        <h1>后台管理入口</h1>
        <p>用于图书管理、分类维护、订单发货、会员管理和统计分析展示。</p>
      </div>

      <form class="auth-card auth-card-luxe" @submit.prevent="submit">
        <div class="auth-card-topline"></div>
        <span class="eyebrow">管理员</span>
        <h1>后台登录</h1>

        <div class="field-group">
          <input v-model="form.username" class="field-input" :class="{ 'input-error': errors.username }" placeholder="管理员账号" @blur="validateField('username')" @input="clearError('username')" />
          <p v-if="errors.username" class="field-error">{{ errors.username }}</p>
        </div>

        <div class="field-group">
          <input v-model="form.password" class="field-input" :class="{ 'input-error': errors.password }" type="password" placeholder="密码" @blur="validateField('password')" @input="clearError('password')" />
          <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
        </div>

        <BaseButton type="submit" block>登录后台</BaseButton>
        <router-link to="/">
          <BaseButton variant="secondary" block>返回前台</BaseButton>
        </router-link>
      </form>
    </div>
  </div>
</template>
