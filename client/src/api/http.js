// 文件说明：创建 Axios 实例，统一配置接口基地址、超时和请求拦截逻辑。
import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('bookstore_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error.response?.data || { message: error.message })
);

export default http;
