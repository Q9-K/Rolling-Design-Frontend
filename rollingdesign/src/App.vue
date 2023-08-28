<!--
 * @Date: 2023-08-28 08:13:16
 * @Author: Q9K
 * @Description: 
-->
<template>
  <router-view />
</template>

<script setup>
import { provide, onMounted } from 'vue'
import axios from 'axios'
const axiosInstance = axios.create({
  baseURL: 'http://www.aamofe.top/api', // 设置基本 URL
});
provide('axios', axiosInstance)
</script>


