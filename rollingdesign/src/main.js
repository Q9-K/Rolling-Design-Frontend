/*
 * @Date: 2023-08-28 05:58:10
 * @Author: Q9K
 * @Description: 
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import axios from 'axios';
import { createPinia } from 'pinia';

const pinia = createPinia();
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(router).use(ElementPlus).use(pinia).mount('#app')

const axiosInstance = axios.create({
  baseURL: 'http://www.aamofe.top/api', // 设置基本 URL
});
provide('axios', axiosInstance)


