<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue';
import * as echarts from 'echarts';
import AdminShell from '../components/AdminShell.vue';
import BaseButton from '../components/BaseButton.vue';
import { api } from '../api/services';
import { useFormValidation } from '../composables/useFormValidation';

const trendRef = ref(null);
const rankRef = ref(null);
const pieRef = ref(null);
const lowStock = ref([]);
const categories = ref([]);
const query = reactive({
  date_from: '',
  date_to: '',
  category_id: ''
});

const dateRangeValidator = () => {
  if (query.date_from && query.date_to && query.date_from > query.date_to) {
    return '开始日期不能晚于结束日期';
  }
  return '';
};

const { errors, validateForm, validateField, clearError } = useFormValidation(query, {
  date_from: [dateRangeValidator],
  date_to: [dateRangeValidator]
});

let trendChart = null;
let rankChart = null;
let pieChart = null;

const renderCharts = async () => {
  if (!validateForm()) return;

  const [trendRes, rankRes, pieRes, lowStockRes] = await Promise.all([
    api.statsTrend(query),
    api.statsTopBooks(query),
    api.statsCategoryShare(query),
    api.statsLowStock()
  ]);

  lowStock.value = lowStockRes.data;
  await nextTick();

  trendChart?.dispose();
  rankChart?.dispose();
  pieChart?.dispose();

  trendChart = echarts.init(trendRef.value);
  rankChart = echarts.init(rankRef.value);
  pieChart = echarts.init(pieRef.value);

  trendChart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: trendRes.data.map((item) => item.order_day) },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'line',
        smooth: true,
        data: trendRes.data.map((item) => item.sales_amount),
        areaStyle: { color: '#c1fbd4' },
        lineStyle: { color: '#111111' }
      }
    ]
  });

  rankChart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: rankRes.data.map((item) => item.title),
      axisLabel: { rotate: 25 }
    },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'bar',
        data: rankRes.data.map((item) => item.sales_volume),
        itemStyle: { color: '#111111', borderRadius: [8, 8, 0, 0] }
      }
    ]
  });

  pieChart.setOption({
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['45%', '72%'],
        data: pieRes.data.map((item, index) => ({
          name: item.category_name,
          value: item.sales_amount,
          itemStyle: {
            color: ['#111111', '#94a3b8', '#c1fbd4', '#86efac', '#d4f9e0'][index % 5]
          }
        }))
      }
    ]
  });
};

const exportCsv = async () => {
  if (!validateForm()) return;

  const blob = await api.statsExport(query);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'stats-export.csv';
  link.click();
  window.URL.revokeObjectURL(url);
};

onMounted(async () => {
  const categoryRes = await api.categories();
  categories.value = categoryRes.data;
  await renderCharts();
});
</script>

<template>
  <AdminShell>
    <div class="admin-topbar">
      <div>
        <h1>统计分析</h1>
      </div>
    </div>

    <div class="table-card">
      <div class="filter-bar filter-bar-wide">
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

        <select v-model="query.category_id">
          <option value="">全部分类</option>
          <option v-for="item in categories" :key="item.category_id" :value="item.category_id">{{ item.category_name }}</option>
        </select>

        <BaseButton @click="renderCharts">查询统计</BaseButton>
        <BaseButton variant="secondary" @click="exportCsv">导出 CSV</BaseButton>
      </div>
    </div>

    <div class="charts-grid">
      <div class="chart-card">
        <h3>销售额趋势</h3>
        <div ref="trendRef" class="chart-box"></div>
      </div>
      <div class="chart-card">
        <h3>图书销量排行</h3>
        <div ref="rankRef" class="chart-box"></div>
      </div>
      <div class="chart-card chart-card-wide">
        <h3>分类销售占比</h3>
        <div ref="pieRef" class="chart-box"></div>
      </div>
      <div class="table-card chart-card-wide">
        <h3>低库存预警</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>图书</th>
              <th>分类</th>
              <th>库存</th>
            </tr>
          </thead>
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
