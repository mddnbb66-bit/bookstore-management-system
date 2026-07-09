// 文件说明：声明会员信息路由，支持后台查看会员和前后台修改资料。
import { Router } from 'express';
import { getUserById, getUsers, updateUser } from '../controllers/users.controller.js';
import { requireAdmin, requireAuth } from '../middlewares/auth.js';

const router = Router();

router.get('/', requireAuth, requireAdmin, getUsers);
router.get('/:id', requireAuth, getUserById);
router.put('/:id', requireAuth, updateUser);

export default router;
