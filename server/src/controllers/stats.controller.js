// 文件说明：处理后台统计分析数据，包括概览、趋势、排行、占比、低库存和导出。
import pool from '../config/db.js';

const DEFAULT_STATUSES = ['待发货', '已发货', '已完成'];

// 统计接口共用一套筛选条件，避免每个图表重复拼接 SQL。
const buildFilters = (query = {}) => {
  const { date_from, date_to, category_id, status } = query;
  const orderFilters = [];
  const orderParams = [];
  const categoryFilters = [];
  const categoryParams = [];

  if (date_from) {
    orderFilters.push('DATE(o.order_date) >= ?');
    orderParams.push(date_from);
  }
  if (date_to) {
    orderFilters.push('DATE(o.order_date) <= ?');
    orderParams.push(date_to);
  }
  if (status) {
    orderFilters.push('o.status = ?');
    orderParams.push(status);
  } else {
    orderFilters.push(`o.status IN (${DEFAULT_STATUSES.map(() => '?').join(', ')})`);
    orderParams.push(...DEFAULT_STATUSES);
  }
  if (category_id) {
    categoryFilters.push('b.category_id = ?');
    categoryParams.push(category_id);
  }

  const joinedFilters = [...orderFilters, ...categoryFilters];

  return {
    orderWhere: orderFilters.length ? `WHERE ${orderFilters.join(' AND ')}` : '',
    orderParams,
    joinedWhere: joinedFilters.length ? `WHERE ${joinedFilters.join(' AND ')}` : '',
    joinedParams: [...orderParams, ...categoryParams]
  };
};

export const getOverview = async (req, res) => {
  const [[bookCount]] = await pool.query('SELECT COUNT(*) AS total FROM books');
  const [[userCount]] = await pool.query('SELECT COUNT(*) AS total FROM users');
  const [[orderCount]] = await pool.query('SELECT COUNT(*) AS total FROM orders');
  const [[salesAmount]] = await pool.query(
    `SELECT IFNULL(SUM(total_amount), 0) AS total
     FROM orders
     WHERE status IN (?, ?, ?)`,
    DEFAULT_STATUSES
  );

  return res.success({
    bookCount: bookCount.total,
    userCount: userCount.total,
    orderCount: orderCount.total,
    salesAmount: Number(salesAmount.total)
  });
};

export const getSalesTrend = async (req, res) => {
  const { orderWhere, orderParams } = buildFilters(req.query);
  const [rows] = await pool.query(
    `SELECT DATE_FORMAT(o.order_date, '%Y-%m-%d') AS order_day,
            ROUND(SUM(o.total_amount), 2) AS sales_amount
     FROM orders o
     ${orderWhere}
     GROUP BY DATE_FORMAT(o.order_date, '%Y-%m-%d')
     ORDER BY order_day ASC`,
    orderParams
  );

  return res.success(rows);
};

export const getTopBooks = async (req, res) => {
  const { joinedWhere, joinedParams } = buildFilters(req.query);
  const [rows] = await pool.query(
    `SELECT b.title, SUM(oi.quantity) AS sales_volume
     FROM order_items oi
     JOIN books b ON oi.book_id = b.book_id
     JOIN orders o ON oi.order_id = o.order_id
     ${joinedWhere}
     GROUP BY oi.book_id, b.title
     ORDER BY sales_volume DESC, b.book_id ASC
     LIMIT 10`,
    joinedParams
  );

  return res.success(rows);
};

export const getCategoryShare = async (req, res) => {
  const { joinedWhere, joinedParams } = buildFilters(req.query);
  const [rows] = await pool.query(
    `SELECT c.category_name, ROUND(SUM(oi.subtotal), 2) AS sales_amount
     FROM order_items oi
     JOIN books b ON oi.book_id = b.book_id
     JOIN book_categories c ON b.category_id = c.category_id
     JOIN orders o ON oi.order_id = o.order_id
     ${joinedWhere}
     GROUP BY c.category_id, c.category_name
     ORDER BY sales_amount DESC`,
    joinedParams
  );

  return res.success(rows);
};

export const getLowStock = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT b.book_id, b.title, b.stock, c.category_name
     FROM books b
     JOIN book_categories c ON b.category_id = c.category_id
     WHERE b.stock < 5
     ORDER BY b.stock ASC, b.book_id ASC`
  );

  return res.success(rows);
};

export const exportStats = async (req, res) => {
  const { orderWhere, orderParams, joinedWhere, joinedParams } = buildFilters(req.query);
  const [[overview]] = await pool.query(
    `SELECT COUNT(*) AS order_count, ROUND(IFNULL(SUM(o.total_amount), 0), 2) AS sales_amount
     FROM orders o
     ${orderWhere}`,
    orderParams
  );
  const [topBooks] = await pool.query(
    `SELECT b.title, SUM(oi.quantity) AS sales_volume
     FROM order_items oi
     JOIN books b ON oi.book_id = b.book_id
     JOIN orders o ON oi.order_id = o.order_id
     ${joinedWhere}
     GROUP BY oi.book_id, b.title
     ORDER BY sales_volume DESC
     LIMIT 10`,
    joinedParams
  );

  const csvRows = [
    ['统计项', '值'],
    ['订单数量', overview.order_count],
    ['销售总额', overview.sales_amount],
    ['导出时间', new Date().toLocaleString('zh-CN')],
    [],
    ['图书名称', '销量']
  ];

  topBooks.forEach((item) => {
    csvRows.push([item.title, item.sales_volume]);
  });

  const csv = `\uFEFF${csvRows
    .map((row) => row.map((cell = '') => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')}`;

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="stats-export-${Date.now()}.csv"`);
  return res.send(csv);
};
