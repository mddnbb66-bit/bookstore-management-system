// 文件说明：声明购物车模块路由，只允许登录会员访问自己的购物车数据。
import { Router } from 'express';
import { addCartItem, clearCart, deleteCartItem, getCart, updateCartItem } from '../controllers/cart.controller.js';
import { requireAuth, requireUser } from '../middlewares/auth.js';

const router = Router();

router.use(requireAuth, requireUser);
router.get('/', getCart);
router.post('/', addCartItem);
router.put('/:id', updateCartItem);
router.delete('/:id', deleteCartItem);
router.delete('/', clearCart);

export default router;
