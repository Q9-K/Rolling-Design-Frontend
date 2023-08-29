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
import { provide, onMounted } from 'vue'
import axios from 'axios'
const axiosInstance = axios.create({
  baseURL: 'http://www.aamofe.top/api', // 设置基本 URL
});
provide('axios', axiosInstance)
</script>


