import { createApp } from 'vue';
import App from './App.vue';
import axios from "axios";
import VueAxios from "vue-axios";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css';

const app = createApp(App);

app.config.productionTip = false;
app.use(VueAxios, axios);
app.use(ElementPlus) 

axios.defaults.baseURL = "http://101.43.159.45";

app.mount('#app');
