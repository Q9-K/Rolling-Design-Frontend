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
</template>
<script setup>
import { provide, onMounted, onBeforeMount } from 'vue'
import axios from 'axios'
import { useSocketStore } from './stores/useSocketStore'
// const socketStore = useSocketStore()
// const axiosInstance = axios.create({
//   baseURL: 'http://www.aamofe.top/api', // 设置基本 URL
// });
// provide('axios', axiosInstance)
const gridData = [
  {
    date: '2016-05-02',
    name: 'Jack',
    address: 'New York City',
  },
  {
    date: '2016-05-04',
    name: 'Jack',
    address: 'New York City',
  },
  {
    date: '2016-05-01',
    name: 'Jack',
    address: 'New York City',
  },
  {
    date: '2016-05-03',
    name: 'Jack',
    address: 'New York City',
  },
]

onMounted(() => {

})
// onBeforeMount(() => {
//   const socket = new WebSocket('ws://101.43.159.45:8001/13/chat/2')
//   socketStore.socket = socket
// })
// socket.close(1000, '我太傻逼了')

</script>

<style scoped lang="scss">
.box {
  position: relative;
  display: flex;
  // align-items: center;

  i {
    font-size: 40px;
    width: 40px;
    position: relative;

    &:hover {
      color: #175ceb;
      cursor: pointer;
    }
  }

  .dot {
    position: absolute;

    border-radius: 50%;

    height: 15px;
    width: 15px;
    background: red;
  }
}
</style>