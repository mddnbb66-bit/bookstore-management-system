// 文件说明：处理图书分类的增删改查，供前台筛选和后台管理共用。
import pool from '../config/db.js';

export const getCategories = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT c.*, COUNT(b.book_id) AS book_count
     FROM book_categories c
     LEFT JOIN books b ON c.category_id = b.category_id
     GROUP BY c.category_id
     ORDER BY c.category_id ASC`
  );
  return res.success(rows);
};

export const createCategory = async (req, res) => {
  const { category_name, description } = req.body;
  if (!category_name) return res.fail('分类名称不能为空');
  await pool.query('INSERT INTO book_categories (category_name, description) VALUES (?, ?)', [category_name, description || null]);
  return res.success(null, '新增分类成功');
};

export const updateCategory = async (req, res) => {
  const { category_name, description } = req.body;
  const [result] = await pool.query(
    'UPDATE book_categories SET category_name = ?, description = ? WHERE category_id = ?',
    [category_name, description || null, req.params.id]
  );
  if (!result.affectedRows) return res.fail('分类不存在', null, 404);
  return res.success(null, '更新分类成功');
};

export const deleteCategory = async (req, res) => {
  const [books] = await pool.query('SELECT COUNT(*) AS total FROM books WHERE category_id = ?', [req.params.id]);
  if (books[0].total > 0) return res.fail('该分类下仍有图书，不能删除');
  const [result] = await pool.query('DELETE FROM book_categories WHERE category_id = ?', [req.params.id]);
  if (!result.affectedRows) return res.fail('分类不存在', null, 404);
  return res.success(null, '删除分类成功');
};
