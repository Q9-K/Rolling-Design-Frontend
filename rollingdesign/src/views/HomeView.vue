<template>
  <div class="loginContainer">
    <!--header-->
    <el-container>
      <el-header>
        <!--如果已经登录-->
        <div v-if="userStore.isLogin">
          <div class="head" style=" display: flex;align-items: center;justify-content: center;">
            <!-- <img alt="web logo" src="@/assets/webLogo.png" style="margin-top:25px ;width:10%;margin-right: 30px;"> -->

            <img alt="web logo" src="@/assets/logo.svg" style=";margin-right: 30px;height:100px;">

            <span style="margin-right:30px">
              主页
            </span>
            <span style="margin-right:30px">
              草稿箱
            </span>
            <span style="margin-right:30px">
              团队管理
            </span>
            <span style="margin-right:30px">
              项目
            </span>
            <span>
              消息中心
            </span>
            <!-- <div style="display: flex;"> -->
              
              <el-button color="#626aef" style="z-index:1999;margin-left:8%" size="large" @click="jumpTo('index')">进入工作区</el-button>
              <el-button color="#626aef" style="z-index:1999;margin-left:1%" size="large" @click="logout()">退出登录</el-button>
            <!-- </div> -->
              
            <!-- <a href=" " target="_blank">备案号：</a>
        <a href="https://beian.miit.gov.cn/" target="_blank">京ICP备2023003129号-1</a> -->
          </div>

          <div>
            <img class="show" src="@/assets/show.png" />
          </div>
        </div>
        <!--未登录-->
        <div v-else>
          <div class="head" style=" display: flex;align-items: center;justify-content: center;padding-top: 24px;">
            <!-- <img alt="web logo" src="@/assets/webLogo.png" style="width:8%;margin-right: 30px;"> -->
            <img alt="web logo" src="@/assets/logo.svg" style="position: absolute;top:-24px;left:22%; height:150px;">
            <span style="margin-right:30px" @click="jumpTo('/index')">
              主页
            </span>

            <span style="margin-right:30px" @click="jumpTo('/teamPeople')">
              团队人员
            </span>
            <span style="margin-right:30px" @click="jumpTo('/index')">
              项目
            </span>
            <span @click="jumpTo('/message')">
              消息中心
            </span>

            <!-- <div class="likeBtnBlock" style="margin-left:8%" @click="loginDialog = true"> 登录</div> -->
            <el-button color="#626aef" style="z-index:1999;margin-left:8%" size="large" @click="loginDialog = true">登录</el-button>
            <el-button color="#626aef" style="z-index:1999;margin-left:1%" size="large" @click="registerDialog = true">注册</el-button>


            <!-- <a href=" " target="_blank">备案号：</a>
          <a href="https://beian.miit.gov.cn/" target="_blank">京ICP备2023003129号-1</a> -->


            <!--登录-->
            <el-dialog v-model="loginDialog" class="loginPage" title="密码登录" width="20%">
              <el-row style="display: flex;flex-direction: row;justify-items: flex-start;width: 90%;margin-left: 5%;">
                <el-col class="hintText" :span="24" style="text-align: left;margin-bottom: 10px;">请使用邮箱登录</el-col>
                <el-col :span="24">
                  <el-input v-model="loginEmailInput" placeholder="输入邮箱" />
                </el-col>
              </el-row>
              <el-row style="margin-top:25px;width: 90%;margin-left: 5%;">
                <el-col class="hintText" :span="24" style="text-align: left;margin-bottom: 10px;">请输入密码</el-col>
                <el-col :span="24">
                  <el-input v-model="loginPwdInput" type="password" placeholder="输入密码" show-password />
                </el-col>
              </el-row>

              <div style="margin-top:25px;width: 100%;">
                <el-button type="primary" style="width:90%" @click="login()">登录</el-button>
              </div>
              <div style="margin-top:25px;width: 90%;padding-left: 20px;">
                <div style="display: flex;justify-content: center;">
                  <el-button link size="small" @click="loginDialog = false; registerDialog = true">还没有账号？去注册</el-button>
                </div>
              </div>
            </el-dialog>

            <!--注册-->
            <el-dialog v-model="registerDialog" class="registerPage" title="注册" width="20%">
              <el-row style="display: flex;flex-direction: row;justify-items: flex-start;width: 90%;margin-left: 5%;">
                <el-col class="hintText" :span="24" style="text-align: left;margin-bottom: 10px;">请使用邮箱注册</el-col>
                <el-col :span="24">
                  <el-input v-model="registerEmailInput" placeholder="输入邮箱" />
                </el-col>
              </el-row>
              <el-row
                style="margin-top:25px;display: flex;flex-direction: row;justify-items: flex-start;width: 90%;margin-left: 5%;">
                <el-col class="hintText" :span="24" style="text-align: left;margin-bottom: 10px;">真实姓名</el-col>
                <el-col :span="24">
                  <el-input v-model="registerNameInput" placeholder="输入姓名" />
                </el-col>
              </el-row>
              <el-row
                style="margin-top:25px;display: flex;flex-direction: row;justify-items: flex-start;width: 90%;margin-left: 5%;">
                <el-col class="hintText" :span="24" style="text-align: left;margin-bottom: 10px;">昵称</el-col>
                <el-col :span="24">
                  <el-input v-model="registerNickNameInput" placeholder="输入昵称" />
                </el-col>
              </el-row>
              <el-row style="margin-top:25px;width: 90%;margin-left: 5%;">
                <el-col class="hintText" :span="24"
                  style="text-align: left;margin-bottom: 10px;">密码要求8-16位且包含数字和字母</el-col>
                <el-col :span="24">
                  <el-input v-model="registerPwdInput" type="password" placeholder="输入密码" show-password />
                </el-col>
              </el-row>
              <el-row style="margin-top:25px;width: 90%;margin-left: 5%;">
                <el-col class="hintText" :span="24" style="text-align: left;margin-bottom: 10px;">确认密码</el-col>
                <el-col :span="24">
                  <el-input v-model="registerPwdConfrimInput" type="password" placeholder="请再次输入密码" show-password />
                </el-col>
              </el-row>

              <!-- <el-row style="margin-top:25px;justify-items: flex-start;width: 90%;margin-left: 5%;">
          <el-col class="hintText" :span="24" style="text-align: left;margin-bottom: 10px;">验证码2分钟内有效</el-col>
          <el-col :span="24">
            <el-row :gutter="10">
              <el-col :span="15">
                <el-input v-model="registerCode" placeholder="验证码" />
              </el-col>
              <el-col :span="4">
                <el-button plain @click="sendCode">获取验证码</el-button>
              </el-col>
              <el-col :span="5"></el-col>
            </el-row>
          </el-col>
        </el-row> -->

              <div style="margin-top:25px;width: 100%;">
                <el-button type="primary" style="width:90%" @click="register">注册</el-button>
              </div>
              <div style="margin-top:25px;width: 90%;padding-left: 20px;">
                <div style="display: flex;justify-content: center;">
                  <el-button link size="small" @click="loginDialog = true; registerDialog = false">已有账号？去登录</el-button>
                </div>
              </div>

            </el-dialog>
          </div>
        </div>
      </el-header>

      <el-main style="height:80vh">
        <div>
          <img class="show" src="@/assets/show.png" />
        </div>
      </el-main>
      <el-footer style=" position: absolute;bottom: 0;right: 0;text-align: center;"><a href=" " target="_blank">备案号：</a>
        <a href="https://beian.miit.gov.cn/" target="_blank">京ICP备2023003129号-1</a></el-footer>
    </el-container>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, unref, inject, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { authStore } from "../store/index.js"
// import { isDark } from '~/composables/dark'
import { reactive, toRefs } from 'vue'
import axios from 'axios'
// const axios = inject('axios')


// const incrementCount = () => {
//   authStore.increment() // 调用 store 中的 mutation
// }
/*----------*/
const router = useRouter()

/**/
const state = reactive({
  circleUrl:
    'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
  squareUrl:
    'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
  sizeList: ['small', '', 'large'],
})
const { circleUrl, squareUrl, sizeList } = toRefs(state)

const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}

const btnSwiTeam = ref()
const popoverTeam = ref()
const teamOutside = () => {
  unref(popoverTeam).popoverTeam?.delayHide?.()
}

/*main*/
const loginDialog = ref(false)
const registerDialog = ref(false)

const loginEmailInput = ref()
const loginPwdInput = ref('')

const registerEmailInput = ref('')
const registerNameInput = ref()
const registerNickNameInput = ref()
const registerPwdInput = ref()
const registerPwdConfrimInput = ref('')

/*注册*/
const register = () => {
  // console.log(registerEmailInput);

  if (!(registerEmailInput.value && registerNameInput.value && registerPwdInput.value && registerPwdConfrimInput.value)) {
    console.log('不能为空');
    ElMessage.error('请输入所有信息，不能为空');
    return;
  }

  let formData = new FormData();
  formData.append("username", registerNameInput.value);
  formData.append("nickname", registerNickNameInput.value);
  formData.append("password1", registerPwdInput.value);
  formData.append("password2", registerPwdConfrimInput.value);
  formData.append("email", registerEmailInput.value);
  console.log(formData);

  axios.post('http://www.aamofe.top/api/user/register/', formData)
    .then(res => {
      // 处理响应数据
      console.log(formData);
      console.log(res);

      if (res.data.errno == 0)//成功
      {
        ElMessage.success(res.data.msg);
        return;
      }
      else {//失败
        ElMessage.error(res.data.msg);
        return;
      }
    })
    .catch(error => {
      // 处理请求错误
      console.error(error);
    });
}
const userStore = authStore() // 获取 store 实例
const token = ref() // 访问 store 中的状态
/*因为退出登录后，会跳转到HomeView，所以不需要将这两个方法保存在全局*/
/*登录*/
const login = () => {
  if (!(loginEmailInput.value)) {
    console.log('邮件不能为空');
    ElMessage.error('请输入邮件');
    return;
  }

  if (!(loginPwdInput.value)) {
    console.log('密码不能为空');
    ElMessage.error('请输入密码');
    return;
  }

  let formData = new FormData();
  formData.append("email", loginEmailInput.value);
  formData.append("password", loginPwdInput.value);
  console.log(formData);

  axios.post('http://www.aamofe.top/api/user/login/', formData)
    .then(res => {
      // 处理响应数据
      console.log(formData);
      console.log(res);

      if (res.data.errno == 0)//成功
      {
        //ElMessage.success('登录成功');//也许会有跳转失败
        //登录状态
        userStore.isLogin = true;
        localStorage.setItem('token', res.data.user_info.token);
        localStorage.setItem('isLogin', true);
        localStorage.setItem('userId', res.data.user_info.user_id);
        //id
        userStore.userId = res.data.user_info.user_id;
        //token
        token.value = res.data.user_info.token;
        console.log(token.value);
        userStore.token = res.data.user_info.token;

        //跳转
        // const path_url = '/' + path;
        // setTimeout(() => {
        window.open('/index', '_self');
        // }, 3000); // 3秒后执行
        loginDialog = false;

        return;
      }
      else {//失败
        ElMessage.error(res.data.msg);
        return;
      }
    })
    .catch(error => {
      // 处理请求错误
      console.error(error);
    });
}

console.log('hhh' + userStore.isLogin);
/*跳转对应页*/
const jumpTo = (path) => {
  //this.$router.push('/video/'+video_id);
  console.log(1);
  if (authStore().isLogin === false) {
    loginDialog.value = true;
    return;
  }
  console.log(3);
  const path_url = '/' + path;
  window.open(path_url, '_self');
}

/*欢迎页的退出登录*/
const logout = () => {
  userStore.isLogin = false;
  userStore.isAdmin = false;
  userStore.userAvatar = '';
  userStore.token = '';
  userStore.userId = '';
  userStore.teamId = '';
  userStore.teamName = '';
  userStore.peojectList = [];
  /*浏览器中*/
  localStorage.removeItem('isLogin');
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('userAvatar');
  localStorage.removeItem('isAdmin');

  localStorage.removeItem('teamId');
  localStorage.removeItem('teamName');
  localStorage.removeItem('projectList');

  console.log(userStore.isLogin);
  console.log('token' + userStore.token);
}

const fetchTeamlistData = () => {
  let Headers = { 'Authorization': authStore().token };
  console.log(Headers);
  console.log(authStore().token)
  console.log(userStore.token)
}

onMounted(() => {
  fetchTeamlistData();
})
</script>

<script>

</script>

<style scoped>
.loginContainer {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  /* overflow: hidden; */
  position: absolute;
  height: 100vh;
  width: 100%;
  /* height: 100%; */
  overflow: hidden;
  background-image: url('../assets/bk2.png');
  /* background-size: cover;  */
  background-size: 100% 100%;
  background-position: center;
  /* background-repeat: no-repeat; */
  opacity: 0.9;
  background-repeat: no-repeat;
}

.head {
  /* font-family: SimHei;  */
  font-weight: 600;
  font-size: 18px;
}

.center-text {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}

::v-deep .loginPage {
  /* --el-bg-color: #000741 !important; */
  /* height: 100vh; */
  /* width: 100%; */
  /* height: 100%; */
  overflow: hidden;
  background-image: url('../assets/login_bg.png');
  /* background-size: cover;  */
  background-size: 100% 100%;
  opacity: 0.85;
  background-repeat: no-repeat;
}

::v-deep .registerPage {
  /* --el-bg-color: #000741 !important; */
  /* height: 100vh; */
  /* width: 100%; */
  /* height: 100%; */
  overflow: hidden;
  background-image: url('../assets/login_bg.png');
  /* background-size: cover;  */
  background-size: 100% 100%;
  opacity: 0.85;
  background-repeat: no-repeat;
}

.hintText {
  color: rgb(52, 52, 52);
  font-size: small;
  font-weight: 600;
}

/*插图*/
.show {
  position: absolute;
  /* 将图片设置为绝对定位，相对于容器定位 */
  bottom: 0;
  /* 图片距离容器底部的距离 */
  left: 5%;
  /* 图片距离容器左侧的距离 */
  border-radius: 10px;
  width: 50%;
}

.likeBtnBlock {
  border: 2px solid #d0dcdc9a;
  border-radius: 10px;
  padding: 10px 0 10px 0;
  box-shadow: 0 .5px 0 .5px#e7f6f69a;
}
</style>