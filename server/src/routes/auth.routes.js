// 文件说明：声明认证模块路由，映射注册、登录、身份获取和退出接口。
import { Router } from 'express';
import { login, logout, me, register, updateAdminProfile } from '../controllers/auth.controller.js';
import { optionalAuth, requireAuth } from '../middlewares/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', optionalAuth, me);
router.put('/admin-profile', requireAuth, updateAdminProfile);
router.post('/logout', requireAuth, logout);

export default router;
