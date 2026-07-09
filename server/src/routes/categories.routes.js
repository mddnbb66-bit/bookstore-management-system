// 文件说明：声明图书分类路由，前台可查，后台可维护。
import { Router } from 'express';
import { createCategory, deleteCategory, getCategories, updateCategory } from '../controllers/categories.controller.js';
import { requireAdmin, requireAuth } from '../middlewares/auth.js';

const router = Router();

router.get('/', getCategories);
router.post('/', requireAuth, requireAdmin, createCategory);
router.put('/:id', requireAuth, requireAdmin, updateCategory);
router.delete('/:id', requireAuth, requireAdmin, deleteCategory);

export default router;
