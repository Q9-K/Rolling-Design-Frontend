import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import ElementTiptapPlugin from 'element-tiptap'
import 'element-plus/dist/index.css'
import 'element-tiptap/lib/style.css'
import './assets/css/main.css'
import './assets/icons/iconfont.css'

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.use(ElementTiptapPlugin)
app.mount('#app')