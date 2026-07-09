<script setup>
const mockBooks = [
  { title: '数据库系统设计', author: '课程项目集', tone: 'tone-blue', rotate: '-10deg', offset: '0px' },
  { title: '会员购书流程', author: '业务模型', tone: 'tone-green', rotate: '8deg', offset: '34px' },
  { title: '订单事务处理', author: 'MySQL 事务', tone: 'tone-sand', rotate: '-6deg', offset: '72px' },
  { title: '后台统计分析', author: 'ECharts 预览', tone: 'tone-ink', rotate: '12deg', offset: '112px' },
  { title: '库存维护策略', author: '系统演示', tone: 'tone-mint', rotate: '-4deg', offset: '152px' }
];
</script>

<template>
  <section class="landing-visual">
    <div class="landing-books">
      <article
        v-for="(book, index) in mockBooks"
        :key="book.title"
        class="landing-book-mock"
        :class="book.tone"
        :style="{ transform: `translateY(${book.offset}) rotate(${book.rotate})`, zIndex: mockBooks.length - index }"
      >
        <div class="landing-book-mock__line"></div>
        <span class="landing-book-mock__meta">BOOK {{ String(index + 1).padStart(2, '0') }}</span>
        <h3>{{ book.title }}</h3>
        <p>{{ book.author }}</p>
      </article>
    </div>

    <div class="landing-float-card landing-float-card--stats">
      <span>销售统计预览</span>
      <strong>图书总量 50+</strong>
      <div class="landing-chart-bars">
        <i style="height: 28%"></i>
        <i style="height: 46%"></i>
        <i style="height: 72%"></i>
        <i style="height: 60%"></i>
        <i style="height: 88%"></i>
      </div>
    </div>

    <div class="landing-float-card landing-float-card--orders">
      <span>订单状态</span>
      <ul>
        <li><em class="dot dot-warn"></em> 待发货</li>
        <li><em class="dot dot-info"></em> 已发货</li>
        <li><em class="dot dot-success"></em> 已完成</li>
      </ul>
    </div>

    <div class="landing-float-card landing-float-card--txn">
      <span>事务流程</span>
      <p>查询库存 → 写入订单 → 扣减库存 → 清空购物车 → 提交事务</p>
    </div>
  </section>
</template>
