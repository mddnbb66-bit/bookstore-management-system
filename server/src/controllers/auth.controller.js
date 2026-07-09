// 文件说明：处理注册、登录、获取当前身份和管理员个人信息维护等认证相关业务。
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET || 'bookstore-demo-secret', { expiresIn: '7d' });

export const register = async (req, res) => {
  const { username, password, name, email, phone, address } = req.body;
  if (!username || !password) return res.fail('用户名和密码不能为空');

  const [exists] = await pool.query('SELECT user_id FROM users WHERE username = ?', [username]);
  if (exists.length) return res.fail('该会员账号已存在');

  const [result] = await pool.query(
    `INSERT INTO users (username, password, name, email, phone, address)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [username, password, name || null, email || null, phone || null, address || null]
  );

  const [rows] = await pool.query(
    'SELECT user_id, username, name, email, phone, address, created_at FROM users WHERE user_id = ?',
    [result.insertId]
  );

  return res.success(rows[0], '注册成功');
};

export const login = async (req, res) => {
  const { username, password, role = 'user' } = req.body;
  if (!username || !password) return res.fail('用户名和密码不能为空');

  if (role === 'admin') {
    const [rows] = await pool.query(
      'SELECT admin_id, username, password, name, role, created_at FROM admins WHERE username = ?',
      [username]
    );
    if (!rows.length || rows[0].password !== password) return res.fail('管理员账号或密码错误', null, 401);

    const admin = rows[0];
    const token = signToken({
      id: admin.admin_id,
      username: admin.username,
      name: admin.name,
      role: 'admin'
    });

    return res.success(
      {
        token,
        user: {
          id: admin.admin_id,
          username: admin.username,
          name: admin.name,
          role: 'admin'
        }
      },
      '登录成功'
    );
  }

  const [rows] = await pool.query(
    'SELECT user_id, username, password, name, email, phone, address, created_at FROM users WHERE username = ?',
    [username]
  );
  if (!rows.length || rows[0].password !== password) return res.fail('会员账号或密码错误', null, 401);

  const user = rows[0];
  const token = signToken({
    id: user.user_id,
    username: user.username,
    name: user.name,
    role: 'user'
  });

  return res.success(
    {
      token,
      user: {
        id: user.user_id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: 'user'
      }
    },
    '登录成功'
  );
};

export const me = async (req, res) => {
  if (!req.user) return res.fail('未登录', null, 401);

  if (req.user.role === 'admin') {
    const [rows] = await pool.query(
      'SELECT admin_id, username, name, role, created_at FROM admins WHERE admin_id = ?',
      [req.user.id]
    );
    if (!rows.length) return res.fail('管理员不存在', null, 404);
    return res.success({
      id: rows[0].admin_id,
      username: rows[0].username,
      name: rows[0].name,
      role: rows[0].role,
      created_at: rows[0].created_at
    });
  }

  const [rows] = await pool.query(
    'SELECT user_id, username, name, email, phone, address, created_at FROM users WHERE user_id = ?',
    [req.user.id]
  );
  if (!rows.length) return res.fail('会员不存在', null, 404);

  return res.success({
    id: rows[0].user_id,
    username: rows[0].username,
    name: rows[0].name,
    email: rows[0].email,
    phone: rows[0].phone,
    address: rows[0].address,
    role: 'user',
    created_at: rows[0].created_at
  });
};

export const updateAdminProfile = async (req, res) => {
  if (!req.user || req.user.role !== 'admin') return res.fail('只有管理员可以修改该信息', null, 403);

  const { name } = req.body;
  const [result] = await pool.query('UPDATE admins SET name = ? WHERE admin_id = ?', [name || null, req.user.id]);
  if (!result.affectedRows) return res.fail('管理员不存在', null, 404);

  const [rows] = await pool.query(
    'SELECT admin_id, username, name, role, created_at FROM admins WHERE admin_id = ?',
    [req.user.id]
  );

  return res.success(
    {
      id: rows[0].admin_id,
      username: rows[0].username,
      name: rows[0].name,
      role: rows[0].role,
      created_at: rows[0].created_at
    },
    '管理员信息更新成功'
  );
};

export const logout = async (req, res) => res.success(null, '退出登录成功');
