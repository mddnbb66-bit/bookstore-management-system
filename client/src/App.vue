<script setup>
// File role: app root that hosts route transitions.
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="route.meta.transition || 'page-float'" mode="out-in">
      <component :is="Component" :key="route.fullPath" />
    </transition>
  </router-view>
</template>
