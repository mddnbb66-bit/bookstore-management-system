<script setup>
import { onMounted, reactive, ref } from 'vue';
import AdminShell from '../components/AdminShell.vue';
import BaseButton from '../components/BaseButton.vue';
import StatusBadge from '../components/StatusBadge.vue';
import { api } from '../api/services';
import { useFormValidation, validators } from '../composables/useFormValidation';

const orders = ref([]);
const query = reactive({
  keyword: '',
  status: '',
  date_from: '',
  date_to: ''
});

const toneMap = {
  待发货: 'warning',
  已发货: 'info',
  已完成: 'success',
  已取消: 'danger'
};

const dateRangeValidator = () => {
  if (query.date_from && query.date_to && query.date_from > query.date_to) {
    return '开始日期不能晚于结束日期';
  }
  return '';
};

const { errors, validateForm, validateField, clearError } = useFormValidation(query, {
  keyword: [validators.maxLength('搜索关键词', 100)],
  date_from: [dateRangeValidator],
  date_to: [dateRangeValidator]
});

const loadData = async () => {
  if (!validateForm()) return;
  const result = await api.adminOrders(query);
  orders.value = result.data;
};

const ship = async (id) => {
  await api.shipOrder(id);
  await loadData();
};

const printPage = () => {
  window.print();
};

onMounted(loadData);
</script>

<template>
  <AdminShell>
    <div class="admin-topbar">
      <div>
        <h1>订单管理</h1>
      </div>
    </div>

    <div class="table-card">
      <div class="section-head">
        <h3>订单列表</h3>
        <BaseButton variant="secondary" @click="printPage">打印结果</BaseButton>
      </div>
      <div class="filter-bar filter-bar-wide">
        <div class="field-group">
          <input
            v-model="query.keyword"
            class="field-input"
            :class="{ 'input-error': errors.keyword }"
            placeholder="订单号、会员账号或姓名"
            @blur="validateField('keyword')"
            @input="clearError('keyword')"
          />
          <p v-if="errors.keyword" class="field-error">{{ errors.keyword }}</p>
        </div>

        <select v-model="query.status">
          <option value="">全部状态</option>
          <option value="待发货">待发货</option>
          <option value="已发货">已发货</option>
          <option value="已完成">已完成</option>
          <option value="已取消">已取消</option>
        </select>

        <div class="field-group">
          <input
            v-model="query.date_from"
            class="field-input"
            :class="{ 'input-error': errors.date_from }"
            type="date"
            @blur="validateField('date_from')"
            @input="clearError('date_from')"
          />
          <p v-if="errors.date_from" class="field-error">{{ errors.date_from }}</p>
        </div>

        <div class="field-group">
          <input
            v-model="query.date_to"
            class="field-input"
            :class="{ 'input-error': errors.date_to }"
            type="date"
            @blur="validateField('date_to')"
            @input="clearError('date_to')"
          />
          <p v-if="errors.date_to" class="field-error">{{ errors.date_to }}</p>
        </div>

        <BaseButton @click="loadData">筛选</BaseButton>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>订单号</th>
            <th>会员</th>
            <th>金额</th>
            <th>状态</th>
            <th>下单时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in orders" :key="item.order_id">
            <td>{{ item.order_no }}</td>
            <td>{{ item.user_name }}</td>
            <td>¥{{ Number(item.total_amount).toFixed(2) }}</td>
            <td><StatusBadge :text="item.status" :tone="toneMap[item.status]" /></td>
            <td>{{ item.order_date }}</td>
            <td>
              <BaseButton
                v-if="item.status === '待发货'"
                variant="secondary"
                @click="ship(item.order_id)"
              >
                订单发货
              </BaseButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </AdminShell>
</template>
