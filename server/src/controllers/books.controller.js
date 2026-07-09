// 文件说明：处理图书的查询、详情、新增、编辑和上下架状态切换。
import pool from '../config/db.js';

export const getBooks = async (req, res) => {
  const { category_id, keyword = '', status, page = 1, pageSize = 8 } = req.query;
  const filters = [];
  const params = [];

  if (category_id) {
    filters.push('b.category_id = ?');
    params.push(category_id);
  }
  if (keyword) {
    filters.push('(b.title LIKE ? OR b.author LIKE ? OR b.publisher LIKE ?)');
    params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
  }
  if (status !== undefined && status !== '') {
    filters.push('b.status = ?');
    params.push(Number(status));
  }

  const whereSql = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const offset = (Number(page) - 1) * Number(pageSize);

  const [rows] = await pool.query(
    `SELECT b.*, c.category_name,
            ROUND(b.price * b.discount, 2) AS sale_price
     FROM books b
     JOIN book_categories c ON b.category_id = c.category_id
     ${whereSql}
     ORDER BY b.book_id DESC
     LIMIT ? OFFSET ?`,
    [...params, Number(pageSize), offset]
  );

  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM books b
     ${whereSql}`,
    params
  );

  return res.success({
    list: rows,
    pagination: {
      page: Number(page),
      pageSize: Number(pageSize),
      total: countRows[0].total
    }
  });
};

export const getBookById = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT b.*, c.category_name,
            ROUND(b.price * b.discount, 2) AS sale_price
     FROM books b
     JOIN book_categories c ON b.category_id = c.category_id
     WHERE b.book_id = ?`,
    [req.params.id]
  );
  if (!rows.length) return res.fail('图书不存在', null, 404);
  return res.success(rows[0]);
};

export const createBook = async (req, res) => {
  const { category_id, title, author, publisher, summary, price, discount, stock, cover_url, status } = req.body;
  if (!category_id || !title || price === undefined) return res.fail('请填写完整图书信息');

  const [result] = await pool.query(
    `INSERT INTO books (category_id, title, author, publisher, summary, price, discount, stock, cover_url, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      category_id,
      title,
      author || null,
      publisher || null,
      summary || null,
      price,
      discount ?? 1,
      stock ?? 0,
      cover_url || null,
      status ?? 1
    ]
  );

  return res.success({ book_id: result.insertId }, '新增图书成功');
};

export const updateBook = async (req, res) => {
  const { category_id, title, author, publisher, summary, price, discount, stock, cover_url, status } = req.body;
  const [result] = await pool.query(
    `UPDATE books
     SET category_id = ?, title = ?, author = ?, publisher = ?, summary = ?, price = ?, discount = ?, stock = ?, cover_url = ?, status = ?
     WHERE book_id = ?`,
    [
      category_id,
      title,
      author || null,
      publisher || null,
      summary || null,
      price,
      discount ?? 1,
      stock ?? 0,
      cover_url || null,
      status ?? 1,
      req.params.id
    ]
  );
  if (!result.affectedRows) return res.fail('图书不存在', null, 404);
  return res.success(null, '更新图书成功');
};

export const updateBookStatus = async (req, res) => {
  const { status } = req.body;
  const [result] = await pool.query('UPDATE books SET status = ? WHERE book_id = ?', [status, req.params.id]);
  if (!result.affectedRows) return res.fail('图书不存在', null, 404);
  return res.success(null, '更新上架状态成功');
};
