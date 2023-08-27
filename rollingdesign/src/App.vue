<!--
 * @Date: 2023-08-28 03:58:55
 * @Author: Q9K
 * @Description: 
-->
<template>
  <!-- <router-link :to="/tiptap/1">
    user
  </router-link> -->
  <router-view></router-view>
  <div class="container">
    <el-popover placement="bottom" :width="400" trigger="click"
      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;">
      <template #reference>
        <div class="box">
          <i class="iconfont icon-xiaoxitongzhi"></i>
          <div class='dot'></div>
        </div>
      </template>
      <template #default>
        <div>我是傻逼</div>
        <!-- <el-table :data="gridData">
        <el-table-column width="150" property="date" label="date" />
        <el-table-column width="100" property="name" label="name" />
        <el-table-column width="300" property="address" label="address" />
      </el-table> -->
      </template>
    </el-popover>
  </div>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <router-view/>
</template>

<script setup>
import { provide, onMounted, onBeforeMount } from 'vue'
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