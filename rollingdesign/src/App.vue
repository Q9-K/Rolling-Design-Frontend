<!--
 * @Date: 2023-08-29 12:11:46
 * @Author: Q9K
 * @Description: 
-->
<template>
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav> -->
  <router-view />
</template>

<!-- <script setup>
import {ref ,provide} from 'vue'
// const app = createApp(App)

// import axios from 'axios'
// const axiosInstance = axios.create({
//   baseURL: 'http://www.aamofe.top/api', // 设置基本 URL
// });
// provide('axios',axiosInstance)
</script> -->

<script setup>
// import { ElLoading } from 'element-plus'
import { provide, ref, nextTick } from 'vue'
import axios from 'axios'
import { ElLoading } from 'element-plus';
const axiosInstance = axios.create({
  baseURL: 'http://www.aamofe.top/api', // 设置基本 URL
});

let ElLoadingInstance
const startLoading = () => {
  ElLoadingInstance = ElLoading.service({
    text: 'Loading!',
    fullscreen: false,
  })
}
const endLoading = () => {
  ElLoadingInstance.close()
}

axiosInstance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  startLoading()
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});


axiosInstance.interceptors.response.use(function (response) {
  nextTick(() => {
    endLoading()
  })
  return response;
}, function (error) {
  return Promise.reject(error);
});


provide('axios', axiosInstance)
</script>

<style lang="scss">
.el-loading-spinner .circular {
  display: none;
}

.el-loading-spinner {
  width: 260px;
  height: 260px;
  // top: 50%;
  // left: 50%;
  transform: translate(-130px, -130px);
  background-size: 100% 100%;
}

.el-loading-mask {
  // 提高loading层级
  z-index: 9999 !important;
  background: linear-gradient(to right, rgb(131, 96, 195), rgb(46, 191, 145));
  opacity: 0.8;
}
</style>


