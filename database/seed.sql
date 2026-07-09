USE BookStoreDB;

INSERT INTO admins (admin_id, username, password, name, role) VALUES
(1, 'admin', '123456', '系统管理员', 'admin');

INSERT INTO users (user_id, username, password, name, email, phone, address, created_at) VALUES
(1, 'zhangsan', '123456', '张三', 'zhangsan@example.com', '13800000001', '北京市海淀区学院路 1 号', '2026-06-01 09:00:00'),
(2, 'lisi', '123456', '李四', 'lisi@example.com', '13800000002', '上海市浦东新区锦绣路 8 号', '2026-06-03 10:30:00'),
(3, 'wangwu', '123456', '王五', 'wangwu@example.com', '13800000003', '广州市天河区中山大道 18 号', '2026-06-08 12:00:00');

INSERT INTO book_categories (category_id, category_name, description) VALUES
(1, '计算机', '程序设计、数据库、软件工程相关图书'),
(2, '文学小说', '经典文学、现代小说与畅销故事'),
(3, '经济管理', '商业、管理、投资与经济学图书'),
(4, '教育考试', '考研、英语、职业认证与学习辅导'),
(5, '科学技术', '自然科学、工程技术与科普读物');

INSERT INTO books (book_id, category_id, title, author, publisher, summary, price, discount, stock, cover_url, status) VALUES
(1, 1, 'MySQL 数据库原理与应用', '陈志远', '清华大学出版社', '围绕数据库设计、SQL、索引与事务展开，适合数据库课设参考。', 69.00, 0.88, 12, 'https://placehold.co/320x440/111111/ffffff?text=MySQL', 1),
(2, 1, 'Node.js Web 开发实战', '张维', '人民邮电出版社', '介绍 Node.js、Express 与 RESTful 接口开发流程。', 76.00, 0.85, 10, 'https://placehold.co/320x440/1e293b/ffffff?text=Node.js', 1),
(3, 1, 'Vue.js 前端开发项目化教程', '李鹏', '电子工业出版社', '从组件、路由到状态管理，覆盖前端项目开发核心知识。', 68.00, 0.90, 15, 'https://placehold.co/320x440/065f46/ffffff?text=Vue3', 1),
(4, 1, '算法设计与分析', '王磊', '机械工业出版社', '讲解常见算法思想与复杂度分析。', 59.00, 0.92, 4, 'https://placehold.co/320x440/0f172a/ffffff?text=Algorithm', 1),
(5, 2, '活着', '余华', '作家出版社', '中国当代文学经典作品，讲述普通人在时代中的命运。', 39.00, 0.95, 20, 'https://placehold.co/320x440/7c2d12/ffffff?text=%E6%B4%BB%E7%9D%80', 1),
(6, 2, '百年孤独', '加西亚·马尔克斯', '南海出版公司', '魔幻现实主义代表作，描写布恩迪亚家族的传奇。', 55.00, 0.90, 9, 'https://placehold.co/320x440/7f1d1d/ffffff?text=Novel', 1),
(7, 2, '三体', '刘慈欣', '重庆出版社', '中国科幻代表作，宇宙文明与人类命运交织。', 56.00, 0.89, 6, 'https://placehold.co/320x440/1d4ed8/ffffff?text=Sci-Fi', 1),
(8, 2, '解忧杂货店', '东野圭吾', '南海出版公司', '治愈系推理小说，多线故事温暖交汇。', 45.00, 0.93, 13, 'https://placehold.co/320x440/9a3412/ffffff?text=Story', 1),
(9, 3, '原则', '瑞·达利欧', '中信出版社', '从生活原则和工作原则总结管理与决策方法。', 88.00, 0.86, 7, 'https://placehold.co/320x440/334155/ffffff?text=Principles', 1),
(10, 3, '从零到一', '彼得·蒂尔', '中信出版社', '创业与创新的经典商业读物。', 48.00, 0.90, 3, 'https://placehold.co/320x440/475569/ffffff?text=Business', 1),
(11, 3, '高效能人士的七个习惯', '史蒂芬·柯维', '中国青年出版社', '个人成长与组织管理的经典方法论。', 62.00, 0.87, 11, 'https://placehold.co/320x440/64748b/ffffff?text=Management', 1),
(12, 3, '经济学原理', '曼昆', '北京大学出版社', '微观与宏观经济学基础教材。', 79.00, 0.84, 5, 'https://placehold.co/320x440/1f2937/ffffff?text=Economics', 1),
(13, 4, '考研英语真题精讲', '刘晓艳', '外语教学与研究出版社', '系统梳理考研英语历年真题和解题技巧。', 58.00, 0.91, 16, 'https://placehold.co/320x440/0f766e/ffffff?text=Exam', 1),
(14, 4, '高等数学同步辅导', '周建华', '高等教育出版社', '面向大学数学课程的同步讲解与练习。', 42.00, 0.95, 8, 'https://placehold.co/320x440/166534/ffffff?text=Math', 1),
(15, 4, '教师资格证笔试通关', '王丽', '教育科学出版社', '覆盖教师资格证笔试重点考点。', 52.00, 0.89, 2, 'https://placehold.co/320x440/15803d/ffffff?text=Teacher', 1),
(16, 4, '计算机二级 MS Office', '孙宁', '电子工业出版社', '适用于全国计算机等级考试二级备考。', 46.00, 0.92, 14, 'https://placehold.co/320x440/3f6212/ffffff?text=Office', 1),
(17, 5, '时间简史', '史蒂芬·霍金', '湖南科学技术出版社', '以通俗方式解释宇宙起源与时间概念。', 49.00, 0.94, 7, 'https://placehold.co/320x440/0c4a6e/ffffff?text=Science', 1),
(18, 5, '人工智能简史', '尼克', '人民邮电出版社', '从早期 AI 到深度学习的发展脉络。', 63.00, 0.88, 18, 'https://placehold.co/320x440/0369a1/ffffff?text=AI', 1),
(19, 5, '航天工程概论', '刘航', '国防工业出版社', '介绍航天器、轨道与工程系统基础。', 72.00, 0.86, 4, 'https://placehold.co/320x440/1d4ed8/ffffff?text=Space', 1),
(20, 5, '科普中国：新能源革命', '陈楠', '科学出版社', '面向大众介绍新能源技术与产业趋势。', 51.00, 0.90, 9, 'https://placehold.co/320x440/0f766e/ffffff?text=Energy', 1);

INSERT INTO cart_items (cart_item_id, user_id, book_id, quantity, created_at) VALUES
(1, 1, 3, 1, '2026-07-08 08:10:00'),
(2, 1, 10, 2, '2026-07-08 08:11:00'),
(3, 2, 17, 1, '2026-07-08 08:12:00');

INSERT INTO orders (order_id, order_no, user_id, admin_id, total_amount, status, order_date, ship_date, receiver_name, receiver_phone, receiver_address) VALUES
(1, 'ORD2026061509300151', 1, 1, 149.28, '已完成', '2026-06-15 09:30:01', '2026-06-16 10:00:00', '张三', '13800000001', '北京市海淀区学院路 1 号'),
(2, 'ORD2026062011050247', 2, 1, 102.14, '已发货', '2026-06-20 11:05:02', '2026-06-21 14:20:00', '李四', '13800000002', '上海市浦东新区锦绣路 8 号'),
(3, 'ORD2026062516230392', 1, NULL, 117.08, '待发货', '2026-06-25 16:23:03', NULL, '张三', '13800000001', '北京市海淀区学院路 1 号'),
(4, 'ORD2026070110150444', 3, 1, 188.92, '已完成', '2026-07-01 10:15:04', '2026-07-02 09:45:00', '王五', '13800000003', '广州市天河区中山大道 18 号'),
(5, 'ORD2026070518200528', 2, NULL, 95.78, '待发货', '2026-07-05 18:20:05', NULL, '李四', '13800000002', '上海市浦东新区锦绣路 8 号');

INSERT INTO order_items (order_item_id, order_id, book_id, quantity, unit_price, discount, subtotal) VALUES
(1, 1, 1, 1, 69.00, 0.88, 60.72),
(2, 1, 5, 2, 39.00, 0.95, 74.10),
(3, 1, 13, 1, 58.00, 0.25, 14.46),
(4, 2, 7, 1, 56.00, 0.89, 49.84),
(5, 2, 14, 1, 42.00, 0.95, 39.90),
(6, 2, 17, 1, 49.00, 0.25, 12.40),
(7, 3, 9, 1, 88.00, 0.86, 75.68),
(8, 3, 16, 1, 46.00, 0.90, 41.40),
(9, 4, 2, 1, 76.00, 0.85, 64.60),
(10, 4, 18, 2, 63.00, 0.88, 110.88),
(11, 4, 10, 1, 48.00, 0.28, 13.44),
(12, 5, 3, 1, 68.00, 0.90, 61.20),
(13, 5, 20, 1, 51.00, 0.68, 34.58);

INSERT INTO admin_logs (log_id, admin_id, action, target_type, target_id, created_at) VALUES
(1, 1, '订单发货', 'orders', '1', '2026-06-16 10:00:00'),
(2, 1, '订单发货', 'orders', '2', '2026-06-21 14:20:00'),
(3, 1, '订单发货', 'orders', '4', '2026-07-02 09:45:00');
