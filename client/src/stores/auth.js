// 文件说明：用户登录态仓库，负责 token、当前身份信息和登录登出逻辑。
import { defineStore } from 'pinia';
import { api } from '../api/services';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('bookstore_token') || '',
    user: JSON.parse(localStorage.getItem('bookstore_user') || 'null')
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
    isUser: (state) => state.user?.role === 'user'
  },
  actions: {
    // 登录态持久化到 localStorage，刷新页面后仍可恢复当前身份。
    persist(token, user) {
      this.token = token;
      this.user = user;
      localStorage.setItem('bookstore_token', token);
      localStorage.setItem('bookstore_user', JSON.stringify(user));
    },
    clear() {
      this.token = '';
      this.user = null;
      localStorage.removeItem('bookstore_token');
      localStorage.removeItem('bookstore_user');
    },
    async login(payload) {
      const result = await api.login(payload);
      this.persist(result.data.token, result.data.user);
      return result;
    },
    async fetchMe() {
      if (!this.token) return null;

      const result = await api.me();
      this.user = result.data;
      localStorage.setItem('bookstore_user', JSON.stringify(result.data));
      return result.data;
    },
    async logout() {
      if (this.token) {
        try {
          await api.logout();
        } catch (error) {
        }
      }
      this.clear();
    }
  }
});
