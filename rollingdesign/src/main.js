/*
 * @Date: 2023-08-25 09:36:55
 * @Author: Q9K
 * @Description: 
 */
import { createApp, provide, ref } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import ElementTiptapPlugin from 'element-tiptap'
import 'element-plus/dist/index.css'
import 'element-tiptap/lib/style.css'
import './assets/css/main.css'
import './assets/icons/iconfont.css'
import axios from 'axios';
import { createPinia } from 'pinia';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
const pinia = createPinia();
app.use(router)
app.use(ElementPlus)
app.use(ElementTiptapPlugin)
use(pinia)
app.mount('#app')


// const axiosInstance = axios.create({
//   baseURL: 'http://www.aamofe.top/api', // 设置基本 URL
// });
// const axioss = ref(axiosInstance)
// // app.config.globalProperties.$axios = axiosInstance;
// provide('axios',axioss)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
