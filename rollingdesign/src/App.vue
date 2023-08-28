<!--
 * @Date: 2023-08-28 08:13:16
 * @Author: Q9K
 * @Description: 
-->
<template>
<<<<<<< HEAD
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


=======
	<nav>
	  <router-link to="/">Home</router-link> |
	  <router-link to="/about">About</router-link>
	  <router-link to="/chat">Chat</router-link>
	</nav>
	<router-view/>
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
  
  <style lang="scss">
  #app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
  }
  
  nav {
	padding: 30px;
  
	a {
	  font-weight: bold;
	  color: #2c3e50;
  
	  &.router-link-exact-active {
		color: #42b983;
	  }
	}
  }
  </style>
>>>>>>> wzw
