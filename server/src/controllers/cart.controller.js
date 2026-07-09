// 文件说明：处理会员购物车的查看、加入、修改数量、删除和清空操作。
import pool from '../config/db.js';

export const getCart = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT ci.cart_item_id, ci.quantity, ci.created_at, b.book_id, b.title, b.author, b.price, b.discount, b.stock, b.cover_url,
            ROUND(b.price * b.discount, 2) AS sale_price
     FROM cart_items ci
     JOIN books b ON ci.book_id = b.book_id
     WHERE ci.user_id = ?
     ORDER BY ci.cart_item_id DESC`,
    [req.user.id]
  );

  const totalAmount = rows.reduce((sum, item) => sum + Number(item.sale_price) * Number(item.quantity), 0);
  return res.success({ list: rows, totalAmount: Number(totalAmount.toFixed(2)) });
};

export const addCartItem = async (req, res) => {
  const { book_id, quantity = 1 } = req.body;
  if (!book_id) return res.fail('请选择图书');

  const [books] = await pool.query('SELECT book_id, stock, status FROM books WHERE book_id = ?', [book_id]);
  if (!books.length) return res.fail('图书不存在', null, 404);
  if (books[0].status !== 1) return res.fail('该图书已下架');

  await pool.query(
    `INSERT INTO cart_items (user_id, book_id, quantity)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
    [req.user.id, book_id, quantity]
  );

  return res.success(null, '加入购物车成功');
};

export const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const [result] = await pool.query(
    'UPDATE cart_items SET quantity = ? WHERE cart_item_id = ? AND user_id = ?',
    [quantity, req.params.id, req.user.id]
  );
  if (!result.affectedRows) return res.fail('购物车项不存在', null, 404);
  return res.success(null, '更新购物车成功');
};

export const deleteCartItem = async (req, res) => {
  const [result] = await pool.query('DELETE FROM cart_items WHERE cart_item_id = ? AND user_id = ?', [req.params.id, req.user.id]);
  if (!result.affectedRows) return res.fail('购物车项不存在', null, 404);
  return res.success(null, '删除购物车项成功');
};

export const clearCart = async (req, res) => {
  await pool.query('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);
  return res.success(null, '已清空购物车');
};
