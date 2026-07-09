// 文件说明：处理会员信息列表、详情和资料修改，主要服务后台会员管理与个人中心。
import pool from '../config/db.js';

export const getUsers = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT u.*, COUNT(o.order_id) AS order_count
     FROM users u
     LEFT JOIN orders o ON u.user_id = o.user_id
     GROUP BY u.user_id
     ORDER BY u.user_id DESC`
  );
  return res.success(rows);
};

export const getUserById = async (req, res) => {
  const userId = Number(req.params.id);
  if (req.user.role !== 'admin' && req.user.id !== userId) return res.fail('无权查看该会员信息', null, 403);

  const [rows] = await pool.query(
    'SELECT user_id, username, name, email, phone, address, created_at FROM users WHERE user_id = ?',
    [userId]
  );
  if (!rows.length) return res.fail('会员不存在', null, 404);
  return res.success(rows[0]);
};

export const updateUser = async (req, res) => {
  const userId = Number(req.params.id);
  if (req.user.role !== 'admin' && req.user.id !== userId) return res.fail('无权修改该会员信息', null, 403);

  const { name, email, phone, address } = req.body;
  const [result] = await pool.query(
    'UPDATE users SET name = ?, email = ?, phone = ?, address = ? WHERE user_id = ?',
    [name || null, email || null, phone || null, address || null, userId]
  );
  if (!result.affectedRows) return res.fail('会员不存在', null, 404);
  return res.success(null, '更新会员信息成功');
};
