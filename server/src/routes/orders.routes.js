// 文件说明：声明订单路由，区分会员下单查询接口和管理员发货管理接口。
import { Router } from 'express';
import {
  createOrder,
  getMyOrderDetail,
  getMyOrders,
  getOrderDetail,
  getOrders,
  shipOrder
} from '../controllers/orders.controller.js';
import { requireAdmin, requireAuth, requireUser } from '../middlewares/auth.js';

const router = Router();

router.post('/', requireAuth, requireUser, createOrder);
router.get('/my', requireAuth, requireUser, getMyOrders);
router.get('/my/:id', requireAuth, requireUser, getMyOrderDetail);
router.get('/', requireAuth, requireAdmin, getOrders);
router.get('/:id', requireAuth, requireAdmin, getOrderDetail);
router.patch('/:id/ship', requireAuth, requireAdmin, shipOrder);

export default router;
