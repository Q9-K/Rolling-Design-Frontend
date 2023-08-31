/*
 * @Date: 2023-08-28 05:58:10
 * @Author: Q9K
 * @Description:
 */
import { createApp, provide, ref } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import { ElementTiptapPlugin } from 'element-tiptap';
import 'element-plus/dist/index.css'
import 'element-tiptap/lib/style.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import axios from 'axios';
import { createPinia } from 'pinia';
import './assets/css/main.css'
import './assets/icons/iconfont.css'
import vue3ToPdf from "vue3-to-pdf";

const pinia = createPinia();
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(vue3ToPdf)
app.use(ElementTiptapPlugin)
app.use(router)
app.use(ElementPlus)
app.use(pinia)
app.mount('#app')



