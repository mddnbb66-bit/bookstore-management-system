<script setup>
// 文件说明：状态标签组件，用于后台订单状态、图书状态等简洁展示。
defineProps({
  text: { type: String, required: true },
  tone: { type: String, default: 'neutral' }
});
</script>

<template>
  <span class="status-badge" :class="`status-${tone}`">{{ text }}</span>
</template>
