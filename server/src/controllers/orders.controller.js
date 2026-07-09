// 文件说明：处理会员下单、订单查询、订单详情和管理员发货，含真实 MySQL 事务。
import pool from '../config/db.js';

const PENDING_STATUS = '待发货';
const SHIPPED_STATUS = '已发货';

const formatOrder = (rows) => {
  if (!rows.length) return null;

  const base = rows[0];
  return {
    order_id: base.order_id,
    order_no: base.order_no,
    total_amount: base.total_amount,
    status: base.status,
    order_date: base.order_date,
    ship_date: base.ship_date,
    receiver_name: base.receiver_name,
    receiver_phone: base.receiver_phone,
    receiver_address: base.receiver_address,
    user_name: base.user_name,
    admin_name: base.admin_name,
    items: rows
      .filter((item) => item.order_item_id)
      .map((item) => ({
        order_item_id: item.order_item_id,
        book_id: item.book_id,
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount: item.discount,
        subtotal: item.subtotal
      }))
  };
};

const buildOrderNo = () => {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  const time = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ORD${time}${random}`;
};

export const createOrder = async (req, res) => {
  const { receiver_name, receiver_phone, receiver_address } = req.body;
  const userId = req.user.id;
  const connection = await pool.getConnection();

  try {
    const [cartItems] = await connection.query(
      `SELECT ci.book_id, ci.quantity, b.title, b.price, b.discount, b.stock
       FROM cart_items ci
       JOIN books b ON ci.book_id = b.book_id
       WHERE ci.user_id = ?`,
      [userId]
    );

    if (!cartItems.length) {
      return res.fail('购物车为空，无法提交订单');
    }

    const insufficient = cartItems.find((item) => Number(item.stock) < Number(item.quantity));
    if (insufficient) {
      return res.fail(`图书《${insufficient.title}》库存不足`);
    }

    const [userRows] = await connection.query(
      'SELECT name, phone, address FROM users WHERE user_id = ?',
      [userId]
    );
    const profile = userRows[0] || {};

    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + Number(item.price) * Number(item.discount) * Number(item.quantity);
    }, 0);
    const orderNo = buildOrderNo();

    // 这里是真实的 MySQL 事务：主表、明细、扣库存、清购物车必须同成同败。
    await connection.beginTransaction();

    const [orderResult] = await connection.query(
      `INSERT INTO orders (
         order_no,
         user_id,
         total_amount,
         status,
         receiver_name,
         receiver_phone,
         receiver_address
       ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        orderNo,
        userId,
        Number(totalAmount.toFixed(2)),
        PENDING_STATUS,
        receiver_name || profile.name || req.user.name || '未填写',
        receiver_phone || profile.phone || '未填写',
        receiver_address || profile.address || '未填写'
      ]
    );

    for (const item of cartItems) {
      const subtotal = Number(
        (Number(item.price) * Number(item.discount) * Number(item.quantity)).toFixed(2)
      );

      await connection.query(
        `INSERT INTO order_items (order_id, book_id, quantity, unit_price, discount, subtotal)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderResult.insertId, item.book_id, item.quantity, item.price, item.discount, subtotal]
      );

      await connection.query(
        'UPDATE books SET stock = stock - ? WHERE book_id = ?',
        [item.quantity, item.book_id]
      );
    }

    await connection.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

    await connection.commit();
    return res.success(
      { order_id: orderResult.insertId, order_no: orderNo },
      '提交订单成功'
    );
  } catch (error) {
    await connection.rollback();
    return res.fail(`订单提交失败：${error.message}`, null, 500);
  } finally {
    connection.release();
  }
};

export const getMyOrders = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT o.*, COUNT(oi.order_item_id) AS item_count
     FROM orders o
     LEFT JOIN order_items oi ON o.order_id = oi.order_id
     WHERE o.user_id = ?
     GROUP BY o.order_id
     ORDER BY o.order_id DESC`,
    [req.user.id]
  );

  return res.success(rows);
};

export const getMyOrderDetail = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT o.*, u.name AS user_name, a.name AS admin_name,
            oi.order_item_id, oi.book_id, oi.quantity, oi.unit_price, oi.discount, oi.subtotal,
            b.title
     FROM orders o
     JOIN users u ON o.user_id = u.user_id
     LEFT JOIN admins a ON o.admin_id = a.admin_id
     LEFT JOIN order_items oi ON o.order_id = oi.order_id
     LEFT JOIN books b ON oi.book_id = b.book_id
     WHERE o.order_id = ? AND o.user_id = ?`,
    [req.params.id, req.user.id]
  );

  if (!rows.length) {
    return res.fail('订单不存在', null, 404);
  }

  return res.success(formatOrder(rows));
};

export const getOrders = async (req, res) => {
  const { keyword = '', status = '', date_from = '', date_to = '' } = req.query;
  const filters = [];
  const params = [];

  if (keyword) {
    filters.push('(o.order_no LIKE ? OR u.username LIKE ? OR u.name LIKE ?)');
    params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
  }
  if (status) {
    filters.push('o.status = ?');
    params.push(status);
  }
  if (date_from) {
    filters.push('DATE(o.order_date) >= ?');
    params.push(date_from);
  }
  if (date_to) {
    filters.push('DATE(o.order_date) <= ?');
    params.push(date_to);
  }

  const whereSql = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const [rows] = await pool.query(
    `SELECT o.order_id, o.order_no, o.total_amount, o.status, o.order_date, o.ship_date,
            u.name AS user_name, a.name AS admin_name
     FROM orders o
     JOIN users u ON o.user_id = u.user_id
     LEFT JOIN admins a ON o.admin_id = a.admin_id
     ${whereSql}
     ORDER BY o.order_id DESC`,
    params
  );

  return res.success(rows);
};

export const getOrderDetail = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT o.*, u.name AS user_name, a.name AS admin_name,
            oi.order_item_id, oi.book_id, oi.quantity, oi.unit_price, oi.discount, oi.subtotal,
            b.title
     FROM orders o
     JOIN users u ON o.user_id = u.user_id
     LEFT JOIN admins a ON o.admin_id = a.admin_id
     LEFT JOIN order_items oi ON o.order_id = oi.order_id
     LEFT JOIN books b ON oi.book_id = b.book_id
     WHERE o.order_id = ?`,
    [req.params.id]
  );

  if (!rows.length) {
    return res.fail('订单不存在', null, 404);
  }

  return res.success(formatOrder(rows));
};

export const shipOrder = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const [orders] = await connection.query(
      'SELECT order_id, status FROM orders WHERE order_id = ?',
      [req.params.id]
    );

    if (!orders.length) {
      return res.fail('订单不存在', null, 404);
    }
    if (orders[0].status !== PENDING_STATUS) {
      return res.fail('只有待发货订单才能执行发货');
    }

    await connection.beginTransaction();

    await connection.query(
      `UPDATE orders
       SET status = ?, ship_date = NOW(), admin_id = ?
       WHERE order_id = ?`,
      [SHIPPED_STATUS, req.user.id, req.params.id]
    );

    await connection.query(
      `INSERT INTO admin_logs (admin_id, action, target_type, target_id)
       VALUES (?, ?, ?, ?)`,
      [req.user.id, '订单发货', 'orders', String(req.params.id)]
    );

    await connection.commit();
    return res.success(null, '订单发货成功');
  } catch (error) {
    await connection.rollback();
    return res.fail(`订单发货失败：${error.message}`, null, 500);
  } finally {
    connection.release();
  }
};
