import { createApp, provide,ref } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import axios from 'axios';
import { createPinia } from 'pinia';

const pinia = createPinia();
const app = createApp(App)

app.use(router).use(ElementPlus).use(pinia).mount('#app')

// const axiosInstance = axios.create({
//   baseURL: 'http://www.aamofe.top/api', // 设置基本 URL
// });
// const axioss = ref(axiosInstance)
// // app.config.globalProperties.$axios = axiosInstance;
// provide('axios',axioss)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
