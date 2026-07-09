<script setup>
// 文件说明：会员订单详情页，展示单笔订单的收货信息、金额和明细。
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import StatusBadge from '../components/StatusBadge.vue';
import { api } from '../api/services';

const route = useRoute();
const order = ref(null);
const toneMap = {
  待发货: 'warning',
  已发货: 'info',
  已完成: 'success',
  已取消: 'danger'
};

onMounted(async () => {
  const result = await api.myOrderDetail(route.params.id);
  order.value = result.data;
});
</script>

<template>
  <div class="page storefront-page">
    <AppHeader />
    <section class="section container" v-if="order">
      <div class="detail-card">
        <div class="section-head">
          <div>
            <h2>订单详情</h2>
            <p>{{ order.order_no }}</p>
          </div>
          <StatusBadge :text="order.status" :tone="toneMap[order.status]" />
        </div>
        <p>收货人：{{ order.receiver_name }} / {{ order.receiver_phone }}</p>
        <p>收货地址：{{ order.receiver_address }}</p>
        <table class="data-table">
          <thead>
            <tr>
              <th>图书</th>
              <th>单价</th>
              <th>折扣</th>
              <th>数量</th>
              <th>小计</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in order.items" :key="item.order_item_id">
              <td>{{ item.title }}</td>
              <td>¥{{ Number(item.unit_price).toFixed(2) }}</td>
              <td>{{ item.discount }}</td>
              <td>{{ item.quantity }}</td>
              <td>¥{{ Number(item.subtotal).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
