// 文件说明：声明图书模块路由，连接图书控制器与权限中间件。
import { Router } from 'express';
import { createBook, getBookById, getBooks, updateBook, updateBookStatus } from '../controllers/books.controller.js';
import { requireAdmin, requireAuth } from '../middlewares/auth.js';

const router = Router();

router.get('/', getBooks);
router.get('/:id', getBookById);
router.post('/', requireAuth, requireAdmin, createBook);
router.put('/:id', requireAuth, requireAdmin, updateBook);
router.patch('/:id/status', requireAuth, requireAdmin, updateBookStatus);

export default router;
