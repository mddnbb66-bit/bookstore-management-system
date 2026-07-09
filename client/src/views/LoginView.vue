<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import BaseButton from '../components/BaseButton.vue';
import { useAuthStore } from '../stores/auth';
import { useFormValidation, validators } from '../composables/useFormValidation';

const router = useRouter();
const auth = useAuthStore();
const form = reactive({ username: '', password: '' });
const { errors, validateForm, validateField, clearError } = useFormValidation(form, {
  username: [validators.required('会员账号'), validators.minLength('会员账号', 2), validators.maxLength('会员账号', 50)],
  password: [validators.required('密码'), validators.maxLength('密码', 255)]
});

const submit = async () => {
  if (!validateForm()) return;

  try {
    await auth.login({ ...form, role: 'user' });
    router.push('/');
  } catch (error) {
    window.alert(error.message);
  }
};
</script>

<template>
  <div class="page">
    <AppHeader />
    <div class="auth-wrap">
      <form class="auth-card" @submit.prevent="submit">
        <h1>会员登录</h1>
        <div class="text-link">
          <p>未登录用户：普通用户，可以浏览图书、按类别查询、查看图书详情。</p>
          <p>已注册并登录的用户：会员，还可以加入购物车、提交订单、查看订单、修改个人信息。</p>
        </div>

        <div class="field-group">
          <input
            v-model="form.username"
            class="field-input"
            :class="{ 'input-error': errors.username }"
            placeholder="请输入会员账号"
            @blur="validateField('username')"
            @input="clearError('username')"
          />
          <p v-if="errors.username" class="field-error">{{ errors.username }}</p>
        </div>

        <div class="field-group">
          <input
            v-model="form.password"
            class="field-input"
            :class="{ 'input-error': errors.password }"
            type="password"
            placeholder="请输入密码"
            @blur="validateField('password')"
            @input="clearError('password')"
          />
          <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
        </div>

        <BaseButton type="submit" block>登录</BaseButton>
        <router-link to="/register" class="text-link">没有账号？前往注册</router-link>
      </form>
    </div>
  </div>
</template>
