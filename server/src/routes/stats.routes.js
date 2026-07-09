// 文件说明：声明统计分析路由，供后台仪表盘和 ECharts 图表页面调用。
import { Router } from 'express';
import {
  exportStats,
  getCategoryShare,
  getLowStock,
  getOverview,
  getSalesTrend,
  getTopBooks
} from '../controllers/stats.controller.js';
import { requireAdmin, requireAuth } from '../middlewares/auth.js';

const router = Router();

router.use(requireAuth, requireAdmin);
router.get('/overview', getOverview);
router.get('/sales-trend', getSalesTrend);
router.get('/top-books', getTopBooks);
router.get('/category-share', getCategoryShare);
router.get('/low-stock', getLowStock);
router.get('/export', exportStats);

export default router;
