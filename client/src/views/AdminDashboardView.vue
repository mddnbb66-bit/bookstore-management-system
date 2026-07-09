<script setup>
// 文件说明：后台首页仪表盘，展示图书数、会员数、订单数和销售额概览。
import { onMounted, ref } from 'vue';
import AdminShell from '../components/AdminShell.vue';
import { api } from '../api/services';

const overview = ref({ bookCount: 0, userCount: 0, orderCount: 0, salesAmount: 0 });
const orders = ref([]);
const lowStock = ref([]);

onMounted(async () => {
  const [overviewRes, ordersRes, lowStockRes] = await Promise.all([api.statsOverview(), api.adminOrders(), api.statsLowStock()]);
  overview.value = overviewRes.data;
  orders.value = ordersRes.data.slice(0, 5);
  lowStock.value = lowStockRes.data.slice(0, 5);
});
</script>

<template>
  <AdminShell>
    <div class="admin-topbar">
      <div>
        <h1>系统首页</h1>
        <p>查看图书、会员、订单和销售数据概况</p>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card"><span>图书数量</span><strong>{{ overview.bookCount }}</strong></div>
      <div class="stat-card"><span>会员数量</span><strong>{{ overview.userCount }}</strong></div>
      <div class="stat-card"><span>订单数量</span><strong>{{ overview.orderCount }}</strong></div>
      <div class="stat-card"><span>销售总额</span><strong>¥{{ Number(overview.salesAmount).toFixed(2) }}</strong></div>
    </div>

    <div class="admin-panel-grid">
      <div class="table-card">
        <h3>最近订单</h3>
        <table class="data-table">
          <thead><tr><th>订单号</th><th>会员</th><th>状态</th><th>金额</th></tr></thead>
          <tbody>
            <tr v-for="item in orders" :key="item.order_id">
              <td>{{ item.order_no }}</td>
              <td>{{ item.user_name }}</td>
              <td>{{ item.status }}</td>
              <td>¥{{ Number(item.total_amount).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-card">
        <h3>低库存预警</h3>
        <table class="data-table">
          <thead><tr><th>图书</th><th>分类</th><th>库存</th></tr></thead>
          <tbody>
            <tr v-for="item in lowStock" :key="item.book_id">
              <td>{{ item.title }}</td>
              <td>{{ item.category_name }}</td>
              <td>{{ item.stock }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminShell>
</template>
