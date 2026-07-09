# 网上书店管理系统

一个基于 Vue 3 + Node.js + Express + MySQL 8.0 的前后端分离课设项目，面向大学数据库综合训练《网上书店管理系统》。

## 项目介绍

本系统包含会员前台与管理员后台两部分，支持图书浏览、会员注册登录、购物车、下单、订单查询、分类管理、图书管理、会员管理、订单发货以及统计分析等功能。

## 技术栈

- 前端：Vue 3 + Vite + Vue Router + Pinia + Axios + ECharts
- 后端：Node.js + Express.js
- 数据库：MySQL 8.0
- 数据库驱动：mysql2

## 项目结构

```text
bookstore-management-system/
├── DESIGN.md
├── README.md
├── database/
│   ├── schema.sql
│   └── seed.sql
├── server/
└── client/
```

## 数据库创建方法

1. 打开 MySQL 8.0。
2. 创建数据库：

```sql
CREATE DATABASE BookStoreDB CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

## 导入 schema.sql

```bash
mysql -u root -p BookStoreDB < database/schema.sql
```

## 导入 seed.sql

```bash
mysql -u root -p BookStoreDB < database/seed.sql
```

## 配置 server/.env

复制 `server/.env.example` 为 `server/.env`，然后按本机 MySQL 配置修改：

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=123456
DB_NAME=BookStoreDB
JWT_SECRET=bookstore-demo-secret
CLIENT_ORIGIN=http://localhost:5173
```

## 如何启动后端

```bash
cd server
npm install
npm run dev
```

## 如何启动前端

```bash
cd client
npm install
npm run dev
```

## 默认账号

- 管理员：`admin / 123456`
- 会员：`zhangsan / 123456`
- 会员：`lisi / 123456`

## 主要功能截图

项目运行后截图。
