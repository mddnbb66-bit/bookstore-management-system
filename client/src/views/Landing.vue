<script setup>
import BaseButton from '../components/BaseButton.vue';
</script>

<template>
  <div class="landing-page landing-page--minimal">
    <header class="landing-nav landing-nav--minimal">
      <div class="landing-nav__shell">
        <router-link to="/" class="landing-nav__brand">网上书店管理系统</router-link>

        <div class="landing-nav__actions landing-nav__actions--minimal">
          <router-link to="/store"><BaseButton variant="secondary">进入书店</BaseButton></router-link>
          <router-link to="/login"><BaseButton variant="secondary">登录</BaseButton></router-link>
          <router-link to="/admin/login"><BaseButton>后台登录</BaseButton></router-link>
        </div>
      </div>
    </header>

    <main class="landing-main">
      <section class="landing-center">
        <h1>网上书店管理系统</h1>
        <p>
          基于 Vue3、Express.js 与 MySQL 的图书浏览、会员购书、订单处理和后台管理系统。
        </p>

        <div class="landing-hero__actions landing-hero__actions--center">
          <router-link to="/store"><BaseButton>进入书店</BaseButton></router-link>
          <router-link to="/admin/login"><BaseButton variant="secondary">后台登录</BaseButton></router-link>
        </div>
      </section>
    </main>

    <footer class="landing-footer">
      <div class="landing-stack-chip">Vue3</div>
      <div class="landing-stack-chip">Express.js</div>
      <div class="landing-stack-chip">MySQL</div>
      <div class="landing-stack-chip">ECharts</div>
    </footer>
  </div>
</template>
<style>
.landing-nav__actions{
  display: flex;
  justify-content: flex-end;
}
</style>
