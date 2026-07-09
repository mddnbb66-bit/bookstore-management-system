<script setup>
defineProps({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true }
});
</script>

<template>
  <article class="landing-feature-card">
    <span class="landing-feature-card__icon">{{ icon }}</span>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
  </article>
</template>
