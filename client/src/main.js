// 文件说明：前端入口文件，负责创建 Vue 应用并挂载 Pinia、路由和全局样式。
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './styles/main.css';

createApp(App).use(createPinia()).use(router).mount('#app');
