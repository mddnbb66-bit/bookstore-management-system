// 文件说明：统一封装接口成功与失败的返回格式，保证前后端数据结构一致。
export const responseMiddleware = (req, res, next) => {
  res.success = (data = {}, message = '操作成功') => {
    res.json({
      success: true,
      message,
      data
    });
  };

  res.fail = (message = '操作失败', data = null, status = 400) => {
    res.status(status).json({
      success: false,
      message,
      data
    });
  };

  next();
};
