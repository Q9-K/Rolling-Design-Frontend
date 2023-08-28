<!--
 * @Date: 2023-08-28 03:58:55
 * @Author: Q9K
 * @Description:
-->
<template>
    <div class="container">
      <div class="wrapper">
        <div class="center">
          <div class="logo">
          </div>
          <div class="items1">
            <span>{{ invitor }}</span>
            在<span>Rolling Design</span>
            邀请你加入团队
          </div>
          <div style="width: 100%; height: 7vh">
          </div>
          <template v-if="isLogined">
            <el-button type="primary" class="joinButton">
              加入团队
            </el-button>
          </template>
          <template v-else>
            <div style="
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%"
            >
              <el-button type="primary" class="joinButton">
                登录/注册
              </el-button>
            </div>
  
          </template>
          <div style="width: 100%; height: 6vh">
          </div>
          <div class="link">
            <div style="display: flex; flex-wrap: wrap; align-items: center">
              <a style="width: 100%; display: flex; justify-content: center" href="www.aamofe.top">
                Rolling Design
              </a>
              <div style="width: 100%; height: 2vh"></div>
              <span style="width: 100%; display: flex; justify-content: center; color: #8c8f8f">
                天机流转一回头，览镜何须空自羞。雪尽草生春意好，人心不解漫间愁
              </span>
            </div>
            <div style="position: relative; top: 10vh; display: flex; align-items: center; justify-content: center">
              www.aamofe.top
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog></el-dialog>
  </template>
  
  <script setup>
  import { provide, onMounted, onBeforeMount } from 'vue'
  import axios from 'axios'
  // const axiosInstance = axios.create({
  //   baseURL: 'http://www.aamofe.top/api', // 设置基本 URL
  // });
  // provide('axios', axiosInstance)
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
  
  <style scoped lang="scss">
  .container {
    height: 100%;
    .wrapper {
      height: 100%;
      background: #f7f9fc;
      display: flex;
      justify-content: center;
      align-items: center;
      .center {
        height: 600px;
        padding: 15px;
        .logo {
          height: 300px;
          background: url(./assets/logo.png);
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
          opacity: 0.5;
        }
        .items1 {
          font-family: "fantasy";
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 25px;
        }
        .joinButton {}
        .link {
  
          a {
            text-decoration: none;
            color: #3671ff;
          }
        }
      }
    }
  }
  </style>
  