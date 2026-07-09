// 文件说明：创建 MySQL 连接池，供各个控制器统一访问 BookStoreDB 数据库。
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'BookStoreDB',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
