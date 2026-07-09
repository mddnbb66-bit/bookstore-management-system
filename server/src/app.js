// 文件说明：后端应用入口，负责加载环境变量、中间件、路由和启动数据库连接检测。
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import pool from './config/db.js';
import { responseMiddleware } from './middlewares/response.js';
import { optionalAuth } from './middlewares/auth.js';
import authRoutes from './routes/auth.routes.js';
import booksRoutes from './routes/books.routes.js';
import categoriesRoutes from './routes/categories.routes.js';
import cartRoutes from './routes/cart.routes.js';
import ordersRoutes from './routes/orders.routes.js';
import usersRoutes from './routes/users.routes.js';
import statsRoutes from './routes/stats.routes.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);


app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: false
  })
);
app.use(express.json());
app.use(morgan('dev'));
app.use(responseMiddleware);
app.use(optionalAuth);

app.get('/api/health', async (req, res) => {
  await pool.query('SELECT 1');
  res.success({ status: 'ok' }, '服务运行正常');
});

app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/stats', statsRoutes);

app.use((req, res) => res.fail('接口不存在', null, 404));

app.use((error, req, res, next) => {
  console.error(error);
  res.fail(`服务器错误：${error.message}`, null, 500);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
