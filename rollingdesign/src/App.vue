<!--
 * @Date: 2023-08-27 14:53:57
 * @Author: Q9K
 * @Description: 
-->
<template>
  <!-- <router-link :to="/tiptap/1">
    user
  </router-link> -->
  <router-view></router-view>
  <!-- test -->
</template>
<script setup>
import { provide, onMounted } from 'vue'
import axios from 'axios'
const axiosInstance = axios.create({
  baseURL: 'http://www.aamofe.top/api', // 设置基本 URL
});
provide('axios', axiosInstance)
// // onMounted(async () => {
// let res = await axios.get('http://www.aamofe.top/api/team/all_teams', {
//   headers: {
//     Authorization: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTM1NDg0OTQsImlkIjoxfQ.HIgCyImqu4gytXnLAeE_7qkYd0INgcHeh6NHL_W3dMQ'
//   }
// })
// console.log(res.data)

//   console.log(res.data)
// })

// provide('test', 'test')
</script>