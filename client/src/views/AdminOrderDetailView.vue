<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import AdminShell from '../components/AdminShell.vue';
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

const formatDateTime = (value) => {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const pad = (number) => String(number).padStart(2, '0');
  return [
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  ].join(' ');
};

onMounted(async () => {
  const result = await api.adminOrderDetail(route.params.id);
  order.value = result.data;
});
</script>

<template>
  <AdminShell>
    <div v-if="order" class="detail-card">
      <div class="section-head">
        <div>
          <h2>订单详情</h2>
          <p>{{ order.order_no }}</p>
        </div>
        <StatusBadge :text="order.status" :tone="toneMap[order.status]" />
      </div>

      <p>会员：{{ order.user_name || '-' }}</p>
      <p>下单时间：{{ formatDateTime(order.order_date) }}</p>
      <p>发货时间：{{ formatDateTime(order.ship_date) }}</p>
      <p>收货人：{{ order.receiver_name }} / {{ order.receiver_phone }}</p>
      <p>收货地址：{{ order.receiver_address }}</p>
      <p>处理管理员：{{ order.admin_name || '-' }}</p>
      <p>订单总额：¥{{ Number(order.total_amount).toFixed(2) }}</p>

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
  </AdminShell>
</template>
