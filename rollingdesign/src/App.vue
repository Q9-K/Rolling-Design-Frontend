<!--
 * @Date: 2023-08-29 12:11:46
 * @Author: Q9K
 * @Description: 
-->
<template>
  <router-view />
</template>


<script setup>
// import { ElLoading } from 'element-plus'
import { provide, ref, nextTick } from 'vue'
import axios from 'axios'
import { authStore } from "./store/index"
import { ElLoading } from 'element-plus';
const axiosInstance = axios.create({
  baseURL: 'http://www.aamofe.top/api', // 设置基本 URL
  headers: {
    Authorization: authStore().token
  }
});

const axiosInstanceWithoutLoading =
  axios.create({
    baseURL: 'http://www.aamofe.top/api', // 设置基本 URL
    headers: {
      Authorization: authStore().token
    }
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
  endLoading()
  return Promise.reject(error);
});


axiosInstance.interceptors.response.use(function (response) {
  endLoading()
  return response;
}, function (error) {
  endLoading()
  return Promise.reject(error);
});


axiosInstanceWithoutLoading.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // startLoading()
  return config;
}, function (error) {
  // 对请求错误做些什么
  // endLoading()
  return Promise.reject(error);
});


axiosInstanceWithoutLoading.interceptors.response.use(function (response) {
  // endLoading()
  return response;
}, function (error) {
  // endLoading()
  return Promise.reject(error);
});


provide('axios', axiosInstance)
provide('axios2', axiosInstanceWithoutLoading)
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

