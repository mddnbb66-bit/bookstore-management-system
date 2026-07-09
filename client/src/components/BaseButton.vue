<script setup>
// 文件说明：项目通用按钮组件，统一主要按钮和次级按钮样式。
defineProps({
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'primary' },
  block: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
});
</script>

<template>
  <button :type="type" class="btn" :class="[`btn-${variant}`, { 'btn-block': block }]" :disabled="disabled">
    <slot />
  </button>
</template>
