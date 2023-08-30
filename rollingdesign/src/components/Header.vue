<template>
  <!--header-->
  <div>
    <!--顶部-->
    <el-row style="display: flex;justify-content: flex-end;">
      <!--通知-->
      <div @click="this.$router.push('/chat')">聊天</div>
      <receiveMessage></receiveMessage>

      <!--顶部的头像-->
      <div style="margin-left:2%">
        <!-- <el-avatar :size="50" :src="circleUrl" ref="buttonRef" v-click-outside="onClickOutside" /> -->
        <el-avatar :size="50" :src="user.userAvatar" ref="buttonRef" v-click-outside="onClickOutside" />
        <!-- <el-avatar :size="50" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" ref="buttonRef" v-click-outside="onClickOutside" /> -->

      </div>

      <!--点击头像，出现悬浮板-->
      <el-popover ref="popoverRef" :virtual-ref="buttonRef" trigger="click" title="" virtual-triggering width="240px"
        class="popover-customer"> <!--怎么设置颜色？？-->
        <div style="padding-left:15px;padding-right:15px">
          <div style="display: flex;align-items: center;padding-top:10px;" @click="personMsgDialog = true;">
            <!--完善关闭悬浮-->
            <el-avatar :size="50" :src="user.userAvatar" @click="personMsgDialog = true" style="margin-right:5px" />
            <span style="font-weight:900;font-size:16px;">{{
              user.nickName }}</span>
          </div>
          <div class="my-divider"></div>

          <div style="display: flex;align-items: center;height: 35px;" @click="personMsgDialog = true">
            <el-icon style="margin-right:5px">
              <Tools />
            </el-icon> 账户设置
          </div>

          <div style="display: flex;align-items: center;height: 35px;" @click="logout()">
            <el-icon style="margin-right:5px">
              <SwitchButton />
            </el-icon> 退出登录
          </div>
        </div>
      </el-popover>

      <!--修改个人信息界面-->
      <el-dialog v-model="personMsgDialog" title="账号信息" width="23%" class="rounded-dialog">
        <div style="width:84%;padding-left:8%">
          <!--展示昵称和头像-->
          <div class="borderBlock" style="margin-bottom:35px;padding-left: 10px;">
            <el-row style="display: flex;align-items: center;justify-content: space-between;">
              <div class="leftContent" style="display: flex;justify-content:flex-start">
                <el-avatar :size="50" :src="user.userAvatar" style="margin-right:10px" />
                <div>
                  <div class="hintText" style="text-align: left;">昵称</div>
                  <div style="text-align: left;">{{ user.nickName }}</div>
                </div>
              </div>
            </el-row>
          </div>

          <!--昵称-->
          <el-row style="display: flex;align-items: center;justify-content: space-between;">
            <div class="leftContent" style="display: flex;justify-content:flex-start">
              <div>
                <div class="hintText" style="text-align: left;margin-bottom: 5px;">昵称</div>
                <div style="text-align: left;">{{ user.nickName }}</div>
              </div>
            </div>
            <el-button link type="primary" size="small" style="justify-content: flex-end;"
              @click="nickNameConfig = true">修改昵称</el-button>
          </el-row>
          <el-divider />

          <!--昵称修改对话框-->
          <el-dialog v-model="nickNameConfig" title="修改昵称" width="20%">
            <el-row style="display: flex;flex-direction: row;justify-items: flex-start;width: 90%;padding-left: 20px;">
              <el-col class="hintText" :span="24" style="text-align: left;margin-bottom: 10px;">请输入昵称</el-col>
              <el-col :span="24">
                <el-input v-model="nickNameConfigInput" @keyup.enter="nickNameConfig = false; nickNameConfigMethod()" placeholder="请输入昵称" />
              </el-col>
            </el-row>

            <template #footer>
              <span class="dialog-footer">
                <el-button @click="nickNameConfig = false">取消</el-button>
                <el-button type="primary" @click="nickNameConfig = false; nickNameConfigMethod()"><!--发送修改-->
                  确认
                </el-button>
              </span>
            </template>
          </el-dialog>

          <!--头像-->
          <el-row style="display: flex;align-items: center;justify-content: space-between;">
            <div class="leftContent" style="display: flex;justify-content:flex-start">
              <el-avatar :size="50" :src="user.userAvatar" style="margin-right:10px" />
            </div>
            <el-upload v-model:file-list="fileList" class="upload-demo"
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" multiple :on-preview="handlePreview"
              :on-remove="handleRemove" :before-remove="beforeRemove" :limit="3" :on-exceed="handleExceed">
              <el-button link type="primary" size="small" style="justify-content: flex-end;">更换头像</el-button>
            </el-upload>

          </el-row>
          <el-divider />

          <!--点击头像上传-->
          <el-dialog v-model="avatarConfig" title="更换头像" width="20%">
            <el-row style="display: flex;flex-direction: row;justify-items: flex-start;width: 90%;padding-left: 20px;">
              <el-col class="hintText" :span="24" style="text-align: left;margin-bottom: 10px;">请输入昵称</el-col>
              <el-col :span="24">
                <el-input v-model="nickNameConfigInput" placeholder="请输入昵称" />
              </el-col>
            </el-row>

            <template #footer>
              <span class="dialog-footer">
                <el-button @click="nickNameConfig = false">取消</el-button>
                <el-button type="primary" @click="nickNameConfig = false"><!--发送修改-->
                  确认
                </el-button>
              </span>
            </template>
          </el-dialog>

          <!--真实姓名-->
          <div class="leftContent"
            style="text-align: left;margin-top: 20px;display: flex;flex-direction: column;justify-content:flex-start">
            <div class="hintText" style="margin-bottom: 6px;">真实姓名 </div>
            <div style=""> {{ user.name }}</div>
          </div>
          <el-divider />

          <!--邮箱-->
          <div class="leftContent"
            style="text-align: left;display: flex;flex-direction: column;justify-content:flex-start">
            <div class="hintText" style="margin-bottom: 6px;">已绑定邮箱 </div>
            <div style="">{{ user.email }}</div>
          </div>
          <el-divider />

          <!--登录密码-->
          <el-row style="display: flex;margin-bottom: 40px;align-items: center;justify-content:space-between">
            <div class="leftContent" style="display: flex;justify-content:flex-start">
              <div>
                <div class="hintText" style="text-align: left;margin-bottom: 6px;">登录密码</div>
                <div style="text-align: left;font-size:small">已设置密码</div>
              </div>
            </div>
            <div style="justify-self: end;">
              <el-button link type="primary" size="small" @click="pwdConfig = true">修改密码</el-button>
            </div>
          </el-row>
        </div>

        <!--修改密码对话框-->
        <el-dialog v-model="pwdConfig" :title="pwdConfigTitle" width="20%" style="flex-direction: column;">
          <el-row style="display: flex;flex-direction: row;justify-items: flex-start;width: 90%;padding-left: 20px;">
            <el-col class="hintText" :span="24" style="text-align: left;margin-bottom: 10px;">请输入密码</el-col>
            <el-col :span="24">
              <el-input v-model="pwdConfigInput" type="password" placeholder="设置密码8位以上，包含字母和数字" show-password />
            </el-col>
          </el-row>
          <el-row style="margin-top:25px;width: 90%;padding-left: 20px;">
            <el-col class="hintText" :span="24" style="text-align: left;margin-bottom: 10px;">请在此确认密码</el-col>
            <el-col :span="24">
              <el-input v-model="pwdSureInput" type="password" placeholder="请再次确认密码" show-password />
            </el-col>
          </el-row>

          <template #footer>
            <span class="dialog-footer">
              <el-button @click="pwdConfig = false">取消</el-button>
              <!--点击确认，修改密码-->
              <el-button type="primary" @click="pwdConfig = false; pwdConfigMethod()">
                确认
              </el-button>
            </span>
          </template>
        </el-dialog>
      </el-dialog>
    </el-row>
  </div>
</template>

<script setup>
import qs from 'qs'
// import { UserFiled } from 'element-plus/'
import receiveMessage from './prototype/receiveMessage.vue'
import { UserFilled } from '@element-plus/icons-vue'
import axios from 'axios'
import { reactive, toRefs } from 'vue'
import { ref, unref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted } from 'vue'
import { UploadProps, UploadUserFile } from 'element-plus'
import {
  Bell,
  Tools,
  SwitchButton,
} from '@element-plus/icons-vue'

const user = reactive({
  userId: '',
  name: '',
  nickName: '',
  userAvatar: '',
  email: '',
})

/*切换团队*/
const btnSwiTeam = ref()
const popoverTeam = ref()
const teamOutside = () => {
  unref(popoverTeam).popoverTeam?.delayHide?.()
}

/*显示头像*/
const state = reactive({
  circleUrl:
    'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
  squareUrl:
    'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
  sizeList: ['small', '', 'large'],
})
const { circleUrl, squareUrl, sizeList } = toRefs(state)
/*点击头像，有下拉列表*/
import { ClickOutside as vClickOutside } from 'element-plus'
import { authStore } from '@/store'
const buttonRef = ref()
const popoverRef = ref()
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}
/*进入账户设置*/
const personMsgDialog = ref(false)
const nickNameConfig = ref(false)
const nickNameConfigInput = ref('')
const avatarConfig = ref(false)
const pwdConfig = ref(false)
const pwdConfigTitle = ref('修改密码')
const pwdConfigInput = ref('')
const pwdSureInput = ref('')

const handleRemove = (file, uploadFiles) => {
  console.log(file, uploadFiles)
}

const handlePreview = (uploadFile) => {
  console.log(uploadFile)
}

const handleExceed = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${files.length + uploadFiles.length
    } totally`
  )
}

const beforeRemove = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(
    `Cancel the transfer of ${uploadFile.name} ?`
  ).then(
    () => true,
    () => false
  )
}

/*跳转对应页*/
const jumpTo = (path) => {
  //this.$router.push('/video/'+video_id);
  const path_url = '/' + path;
  window.open(path_url, '_self');
}


const fetchUserData = () => {
  let Headers = { 'Authorization': authStore().token };

  axios.get('http://www.aamofe.top/api/user/show_info/0', { headers: Headers })
    .then((response) => {
      // console.log(Headers);
      console.log(response);

      if (response.data.errno == 0) {  //获取成功“我”的身份信息
        user.userId = response.data.user_info.id;
        user.name = response.data.user_info.username;
        localStorage.setItem('username', user.name);
        user.nickName = response.data.user_info.nickname;
        nickNameConfigInput.value = user.nickName;
        user.userAvatar = response.data.user_info.avatar_url;
        localStorage.setItem('userAvatar', user.userAvatar)  //这是头像
        // console.log("🚀 ~ file: Header.vue:291 ~ .then ~ authStore().userAvatar:", authStore().userAvatar)
        user.email = response.data.user_info.email;
        return;
      }
      else {
        ElMessage.warning(response.data.msg);
      }
    }).catch(error => {
      console.log(error);
    })

  // axios.get('http://www.aamofe.top/api/user/personal_info/', { headers: Headers })
  //   .then((response) => {
  //     console.log(Headers);
  //     console.log(response);

  //     if (response.data.errno == 0) {  //获取成功“我”的身份信息
  //       user.userId = response.data.user_info.id;
  //       user.name = response.data.user_info.username;
  //       user.nickName = response.data.user_info.nickname;
  //       user.userAvatar = response.data.user_info.avatar_url;   //这是头像
  //       user.email = response.data.user_info.email;
  //       console.log(user);
  //       return;
  //     }
  //     else {
  //       ElMessage.warning(response.data.msg);
  //     }
  //   }).catch(error => {
  //     console.log(error);
  //   })
}

onMounted(() => {
  fetchUserData();
})


/*修改昵称*/
const nickNameConfigMethod = () => {
  if (!(nickNameConfigInput.value)) {
    console.log('昵称不能为空');
    ElMessage.warning('请输入昵称');
    return;
  }
  axios.post('http://www.aamofe.top/api/user/update_info/',
    qs.stringify({ nickname: nickNameConfigInput.value }), { headers: { Authorization: authStore().token } })
    .then(res => {
      // 处理响应数据
      console.log(res);

      if (res.data.errno == 0)//成功
      {
        user.nickName = nickNameConfigInput.value;
        nickNameConfig = false;
        nickNameConfigInput.value = '';
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

/*修改密码*/
const pwdConfigMethod = () => {
  if (!(pwdConfigInput.value)) {
    console.log('密码不能为空');
    ElMessage.warning('请输入密码');
    return;
  }
  axios.post('http://www.aamofe.top/api/user/update_info/',
    qs.stringify({ password: pwdConfigInput.value }), { headers: { Authorization: authStore().token } })
    .then(res => {
      // 处理响应数据
      console.log(formData);
      console.log(res);

      if (res.data.errno == 0)//成功
      {
        pwdConfig = false;
        pwdConfigInput.value = '';
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

/*主页面的退出登录*/
const logout = () => {
  authStore().isLogin = false;
  authStore().token = '';
  /*浏览器中*/
  localStorage.removeItem('isLogin');
  localStorage.removeItem('token');

  console.log(authStore().isLogin);
  console.log('token' + authStore().token);

  /*跳转到欢迎页*/
  jumpTo('');
}

</script>

<style scoped>
.hintText {
  color: gray;
  font-size: small;
  font-weight: 600;
}

.borderBlock {
  /* border: 1px solid rgba(176, 170, 170, 0.703);
  border-radius: 4px; */
  border: 2px solid #d0dcdc9a;
  border-radius: 10px;
  padding: 10px 0 10px 0;
  box-shadow: 0 .5px 0 .5px#e7f6f69a;
}

.popover-customer {
  background-color: #0084ff !important;
  /* 设置背景颜色 */
}


/*对话框圆角*/
.rounded-dialog {
  border-radius: 10px;
  /* 设置边框圆角半径，根据需要调整 */
}

/*上传团队封面*/
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.my-divider {
  height: 1px;
  /* 设置横线的高度 */
  background-color: rgb(234, 232, 232);
  /* 设置横线的颜色 */
  margin: 10px 0;
  /* 可选：设置横线上下的间距 */
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>