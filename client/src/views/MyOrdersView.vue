<script setup>
// 文件说明：会员订单列表页，展示当前会员提交过的全部订单。
import { onMounted, ref } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import StatusBadge from '../components/StatusBadge.vue';
import { api } from '../api/services';

const orders = ref([]);

const toneMap = {
  待发货: 'warning',
  已发货: 'info',
  已完成: 'success',
  已取消: 'danger'
};

onMounted(async () => {
  const result = await api.myOrders();
  orders.value = result.data;
});
</script>

<template>
  <div class="page storefront-page">
    <AppHeader />
    <section class="section container">
      <div class="table-card">
        <h2>我的订单</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th>订单号</th>
              <th>金额</th>
              <th>状态</th>
              <th>时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in orders" :key="item.order_id">
              <td>{{ item.order_no }}</td>
              <td>¥{{ Number(item.total_amount).toFixed(2) }}</td>
              <td><StatusBadge :text="item.status" :tone="toneMap[item.status]" /></td>
              <td>{{ item.order_date }}</td>
              <td><router-link :to="`/orders/${item.order_id}`" class="text-link">查看详情</router-link></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
