import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import router from './router'
import axios from "axios";

createApp(App).use(router).use(ElementPlus).mount('#app')

export const prefixUrl = 'http://www.aamofe.top'
