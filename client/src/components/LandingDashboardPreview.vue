<template>
  <section class="landing-dashboard">
    <div class="landing-dashboard__sidebar">
      <span class="landing-dashboard__logo">BSMS</span>
      <a>图书管理</a>
      <a>会员管理</a>
      <a>订单处理</a>
      <a>统计分析</a>
    </div>

    <div class="landing-dashboard__main">
      <div class="landing-dashboard__top">
        <div class="landing-dashboard__metric">
          <span>图书总量</span>
          <strong>50+</strong>
        </div>
        <div class="landing-dashboard__metric">
          <span>会员数据</span>
          <strong>30+</strong>
        </div>
        <div class="landing-dashboard__metric">
          <span>订单处理</span>
          <strong>24h</strong>
        </div>
        <div class="landing-dashboard__metric">
          <span>低库存预警</span>
          <strong>4 本</strong>
        </div>
      </div>

      <div class="landing-dashboard__charts">
        <div class="landing-dashboard__panel">
          <span>销量趋势</span>
          <div class="mini-line">
            <i></i><i></i><i></i><i></i><i></i><i></i>
          </div>
        </div>
        <div class="landing-dashboard__panel">
          <span>分类占比</span>
          <div class="mini-donut"></div>
        </div>
      </div>

      <div class="landing-dashboard__table">
        <div class="landing-dashboard__row">
          <span>待发货订单</span>
          <b>12</b>
        </div>
        <div class="landing-dashboard__row">
          <span>今日销售额</span>
          <b>¥ 3,280</b>
        </div>
        <div class="landing-dashboard__row">
          <span>低库存图书</span>
          <b>4</b>
        </div>
      </div>
    </div>
  </section>
</template>
