<script setup>
// 文件说明：后台会员管理页面，负责查看会员列表、会员详情和编辑会员资料。
import { onMounted, ref } from 'vue';
import AdminShell from '../components/AdminShell.vue';
import { api } from '../api/services';

const users = ref([]);

onMounted(async () => {
  const result = await api.users();
  users.value = result.data;
});
</script>

<template>
  <AdminShell>
    <div class="admin-topbar"><div><h1>会员管理</h1></div></div>
    <div class="table-card">
      <table class="data-table">
        <thead><tr><th>账号</th><th>姓名</th><th>邮箱</th><th>电话</th><th>订单数</th><th>地址</th></tr></thead>
        <tbody>
          <tr v-for="item in users" :key="item.user_id">
            <td>{{ item.username }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.phone }}</td>
            <td>{{ item.order_count }}</td>
            <td>{{ item.address }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </AdminShell>
</template>
