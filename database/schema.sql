DROP DATABASE IF EXISTS BookStoreDB;
CREATE DATABASE BookStoreDB CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE BookStoreDB;

CREATE TABLE admins (
  admin_id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'admin id',
  username VARCHAR(50) NOT NULL UNIQUE COMMENT 'admin username',
  password VARCHAR(255) NOT NULL COMMENT 'login password',
  name VARCHAR(50) NULL COMMENT 'admin name',
  role VARCHAR(20) NOT NULL DEFAULT 'admin' COMMENT 'role',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'created time'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='admins';

CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'user id',
  username VARCHAR(50) NOT NULL UNIQUE COMMENT 'user username',
  password VARCHAR(255) NOT NULL COMMENT 'login password',
  name VARCHAR(50) NULL COMMENT 'name',
  email VARCHAR(100) NULL COMMENT 'email',
  phone VARCHAR(20) NULL COMMENT 'phone',
  address VARCHAR(255) NULL COMMENT 'address',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'created time'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='users';

CREATE TABLE book_categories (
  category_id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'category id',
  category_name VARCHAR(50) NOT NULL UNIQUE COMMENT 'category name',
  description VARCHAR(255) NULL COMMENT 'description'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='book categories';

CREATE TABLE books (
  book_id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'book id',
  category_id INT NOT NULL COMMENT 'category id',
  title VARCHAR(100) NOT NULL COMMENT 'title',
  author VARCHAR(100) NULL COMMENT 'author',
  publisher VARCHAR(100) NULL COMMENT 'publisher',
  summary TEXT NULL COMMENT 'summary',
  price DECIMAL(10,2) NOT NULL COMMENT 'price',
  discount DECIMAL(4,2) NOT NULL DEFAULT 1.00 COMMENT 'discount',
  stock INT NOT NULL DEFAULT 0 COMMENT 'stock',
  cover_url VARCHAR(255) NULL COMMENT 'cover url',
  status TINYINT NOT NULL DEFAULT 1 COMMENT 'status',
  CONSTRAINT fk_books_category FOREIGN KEY (category_id) REFERENCES book_categories(category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='books';

CREATE TABLE cart_items (
  cart_item_id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'cart item id',
  user_id INT NOT NULL COMMENT 'user id',
  book_id INT NOT NULL COMMENT 'book id',
  quantity INT NOT NULL DEFAULT 1 COMMENT 'quantity',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'created time',
  UNIQUE KEY uk_user_book (user_id, book_id),
  CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(user_id),
  CONSTRAINT fk_cart_book FOREIGN KEY (book_id) REFERENCES books(book_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='cart items';

CREATE TABLE orders (
  order_id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'order id',
  order_no VARCHAR(40) NOT NULL UNIQUE COMMENT 'order no',
  user_id INT NOT NULL COMMENT 'user id',
  admin_id INT NULL COMMENT 'admin id',
  total_amount DECIMAL(12,2) NOT NULL COMMENT 'total amount',
  status VARCHAR(20) NOT NULL DEFAULT '待发货' COMMENT 'status',
  order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'order date',
  ship_date DATETIME NULL COMMENT 'ship date',
  receiver_name VARCHAR(50) NULL COMMENT 'receiver name',
  receiver_phone VARCHAR(20) NULL COMMENT 'receiver phone',
  receiver_address VARCHAR(255) NULL COMMENT 'receiver address',
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(user_id),
  CONSTRAINT fk_orders_admin FOREIGN KEY (admin_id) REFERENCES admins(admin_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='orders';

CREATE TABLE order_items (
  order_item_id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'order item id',
  order_id INT NOT NULL COMMENT 'order id',
  book_id INT NOT NULL COMMENT 'book id',
  quantity INT NOT NULL COMMENT 'quantity',
  unit_price DECIMAL(10,2) NOT NULL COMMENT 'unit price',
  discount DECIMAL(4,2) NOT NULL COMMENT 'discount',
  subtotal DECIMAL(12,2) NOT NULL COMMENT 'subtotal',
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(order_id),
  CONSTRAINT fk_order_items_book FOREIGN KEY (book_id) REFERENCES books(book_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='order items';

CREATE TABLE admin_logs (
  log_id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'log id',
  admin_id INT NOT NULL COMMENT 'admin id',
  action VARCHAR(100) NOT NULL COMMENT 'action',
  target_type VARCHAR(50) NULL COMMENT 'target type',
  target_id VARCHAR(50) NULL COMMENT 'target id',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'created time',
  CONSTRAINT fk_admin_logs_admin FOREIGN KEY (admin_id) REFERENCES admins(admin_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='admin logs';
