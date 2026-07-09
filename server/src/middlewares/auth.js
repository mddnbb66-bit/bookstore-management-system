// 文件说明：提供登录校验和角色校验中间件，用于区分游客、会员和管理员权限。
import jwt from 'jsonwebtoken';

const getToken = (req) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.replace('Bearer ', '').trim();
};

export const optionalAuth = (req, res, next) => {
  const token = getToken(req);
  if (!token) {
    return next();
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'bookstore-demo-secret');
  } catch (error) {
    req.user = null;
  }

  next();
};

export const requireAuth = (req, res, next) => {
  const token = getToken(req);
  if (!token) {
    return res.fail('未登录或登录已失效', null, 401);
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'bookstore-demo-secret');
    next();
  } catch (error) {
    return res.fail('登录凭证无效', null, 401);
  }
};

// 会员接口和管理员接口分开校验，答辩时可以直接说明 RBAC 的最小实现方式。
export const requireUser = (req, res, next) => {
  if (!req.user || req.user.role !== 'user') {
    return res.fail('只有会员可以执行该操作', null, 403);
  }
  next();
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.fail('只有管理员可以执行该操作', null, 403);
  }
  next();
};
