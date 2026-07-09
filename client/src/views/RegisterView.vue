<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import BaseButton from '../components/BaseButton.vue';
import { api } from '../api/services';
import { useFormValidation, validators } from '../composables/useFormValidation';

const router = useRouter();
const form = reactive({
  username: '',
  password: '',
  name: '',
  email: '',
  phone: '',
  address: ''
});

const { errors, validateForm, validateField, clearError } = useFormValidation(form, {
  username: [validators.required('会员账号'), validators.minLength('会员账号', 2), validators.maxLength('会员账号', 50)],
  password: [validators.required('密码'), validators.minLength('密码', 6), validators.maxLength('密码', 255)],
  name: [validators.maxLength('姓名', 50)],
  email: [validators.email('邮箱')],
  phone: [validators.phone('电话')],
  address: [validators.maxLength('地址', 255)]
});

const submit = async () => {
  if (!validateForm()) return;

  try {
    await api.register(form);
    window.alert('注册成功，请登录');
    router.push('/login');
  } catch (error) {
    window.alert(error.message);
  }
};
</script>

<template>
  <div class="page auth-scene auth-scene-register">
    <AppHeader />

    <div class="auth-scene-decor auth-decor-left"></div>
    <div class="auth-scene-decor auth-decor-right"></div>

    <div class="auth-wrap auth-wrap-luxe">
      <div class="auth-copy auth-copy-luxe">
        <span class="eyebrow">会员入口</span>
        <h1>创建书店会员账号</h1>
        <p>注册后可以加入购物车、提交订单、查看订单，并修改个人信息。</p>
      </div>

      <form class="auth-card wide auth-card-luxe" @submit.prevent="submit">
        <div class="auth-card-topline"></div>
        <h1>会员注册</h1>
        <div class="form-grid">
          <div class="field-group">
            <input v-model="form.username" class="field-input" :class="{ 'input-error': errors.username }" placeholder="会员账号" @blur="validateField('username')" @input="clearError('username')" />
            <p v-if="errors.username" class="field-error">{{ errors.username }}</p>
          </div>
          <div class="field-group">
            <input v-model="form.password" class="field-input" :class="{ 'input-error': errors.password }" type="password" placeholder="密码" @blur="validateField('password')" @input="clearError('password')" />
            <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
          </div>
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
            <input v-model="form.address" class="field-input" :class="{ 'input-error': errors.address }" placeholder="地址" @blur="validateField('address')" @input="clearError('address')" />
            <p v-if="errors.address" class="field-error">{{ errors.address }}</p>
          </div>
        </div>
        <BaseButton type="submit" block>提交注册</BaseButton>
      </form>
    </div>
  </div>
</template>
