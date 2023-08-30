<template>
  <div class="invite-outer">
    <div class="invite">
      <div style="width: 100%; height: 16%"></div>
      <div class="logo-outer">
        <img class="logo" :src="logo">
      </div>
      <div style="width: 100%; height: 2%"></div>
      <div class="invite-information-outer">
        <p class="invite-information-person">
          {{ inviterPerson }}&nbsp;&nbsp;
        </p>
        <p class="invite-information">
          邀请你加入团队
        </p>
        <p class="invite-information-team">
          &nbsp;&nbsp;{{ inviterTeam }}
        </p>
      </div>
      <div class="invite-button-outer">
        <el-button v-if="haveLoggedIn" class="invite-button" type="primary" @click="handleToIndex">
          加入团队
        </el-button>
        <el-button v-else class="invite-button" type="primary" @click="handleToLogin">
          登录/注册
        </el-button>
      </div>
      <div style="width: 100%; height: 8%"></div>
      <div class="slogan-outer">
        <div class="slogan-title-outer">
          <p class="slogan-title">
            流转设计
          </p>
        </div>
        <div class="slogan-information-outer">
          <p class="slogan-information">
            天机流转一回头，览镜何须空自羞。雪尽草生春意好，人心不解漫间愁
          </p>
        </div>
      </div>
      <div style="width: 100%; height: 7%"></div>
      <div class="link-outer">
        <p @click="handleToLogin" class="link">
          www.aamofe.top
        </p>
      </div>
    </div>
  </div>
  <el-dialog></el-dialog>
</template>

<script setup>
import logo from '../assets/logo.png'
import {authStore} from "@/store";
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import axios from "axios";

let haveLoggedIn = false

const inviterPerson = ref('大傻逼')
const inviterTeam = ref('傻逼之家')

const route = useRoute()
const router = useRouter()
// 邀请加入的团队的token
const teamToken = route.params.token;

onMounted(() => {

  let Headers = { 'Authorization': authStore().token }

  axios.get('http://www.aamofe.top/api/team/team_name/' + teamToken, {
    headers: Headers
  })
    .then((response) => {
      if (response.status === 200) {
        if (response.data.errno === 0) {
          inviterPerson.value = response.data.invite_info.inviter
          inviterTeam.value = response.data.invite_info.team_name
        }
      }
    })
})

if (authStore().token) {
  haveLoggedIn = true
}
else {
  haveLoggedIn = false
}

console.log(authStore().token)

const handleToLogin = () => {
  router.push('/')
}

const handleToIndex = () => {
  router.push('/index')
}

</script>

<style scoped lang="scss">
.invite-outer {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  .invite {
    height: 100%;
    width: 50%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: start;
    .logo-outer {
      width: 100%;
      height: 25%;
      display: flex;
      align-items: center;
      justify-content: center;
      .logo {
        height: 100%;
      }
    }
    .invite-information-outer {
      width: 100%;
      height: 14%;
      display: flex;
      justify-content: center;
      align-items: center;
      .invite-information-person {
        font-family: "STFangsong";
        display: flex;
        text-align: center;
        font-size: 25px;
      }
      .invite-information {
        font-family: "Arial";
        text-align: center;
        font-size: 25px;
      }
      .invite-information-team {
        font-family: "STFangsong";
        text-align: center;
        font-size: 25px;
      }
    }
    .invite-button-outer {
      width: 100%;
      display: flex;
      height: 10%;
      justify-content: center;
      align-items: center;
      .invite-button {
        height: 50%;
        width: 30%;
      }
    }
    .slogan-outer {
      width: 100%;
      height: 10%;
      display: flex;
      flex-wrap: wrap;
      .slogan-title-outer {
        height: 40%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .slogan-title {
          width: 100%;
          text-align: center;
          color: #27398d;
          font-family: STZhongsong;
        }
      }
      .slogan-information-outer {
        height: 60%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .slogan-information {
          width: 100%;
          text-align: center;
          color: #8c939d;
          font-family: "STXinwei";
        }
      }
    }
    .link-outer {
      width: 100%;
      height: 8%;
      display: flex;
      justify-content: center;
      align-items: center;
      .link {
        width: 100%;
        text-align: center;
        color: #27398d;
        cursor: pointer;
      }
    }
  }
}
</style>
