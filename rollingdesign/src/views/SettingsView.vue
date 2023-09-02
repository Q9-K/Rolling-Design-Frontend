<template>
  <!--主页-->
  <div class="common-layout">
    <el-container>
      <!--侧边-->
      <el-aside width="15%">
        <!--侧栏，引入-->
        <GuideAside />
      </el-aside>
      <!--侧边结束-->

      <el-container>
        <!--顶部-->
        <el-header style="padding-top:13px">
          <Header />
        </el-header>

        <el-divider />
        <!--顶部结束-->

        <!--主页面，不同的地方-->
        <el-main>

          <div class="page" style="width:98%;margin-left: 1%;">
            <!--团队信息-->
            <div style="width:90%;padding-left:5%">
              <el-row style="margin-bottom: 30px;">
                <span style="font-size:23px;font-weight: 500;">
                  团队设置
                </span>
              </el-row>


              <!-- <el-col :span="24"> -->
              <div class="block" style="display: flex;align-items: center;width:100%">
                  <el-avatar shape="square" :size="50" :src="nowTeam.cover_url" style="margin-right:20px" />
                  <span style="font-size:21px;font-weight: 800;">{{ nowTeam.name }}</span>
              </div>
              <!-- </el-col> -->

              <!--功能按钮-->
              <!-- <el-col :span="8">
                  <div style="display: flex;flex:1;justify-content: flex-end;">
                    <el-popover placement="bottom" :width="300" trigger="click">
                      <template #reference>
                        <el-button
                          v-if="(nowTeam.role_string === 'CR' || nowTeam.role_string === 'MG') && nowTeam.name != '个人空间'"
                          type="primary" plain>邀请成员</el-button>
                      </template>
                      <div class="link-block" style="margin-bottom: 12px;">
                        <div>{{ inviteLink }}</div>
                      </div>
                      <div><el-butn type="primary" @click="copyLink()">点击复制链接</el-butn></div>
                    </el-popover>
                  </div>
                </el-col> -->


              <!--信息展示-->
              <!-- <div style="width:90%;padding-left:5%"> -->
              <!--展示昵称和头像-->
              <!-- <div class="borderBlock" style="margin-bottom:35px;padding-left: 10px;">
                <el-row style="display: flex;align-items: center;justify-content: space-between;">
                  <div class="leftContent" style="display: flex;justify-content:flex-start">
                    <div>
                      <div class="hintText" style="text-align: left;">空间名称</div>
                      <div style="text-align: left;">{{ nowTeam.name }}</div>
                    </div>
                  </div>
                </el-row>
              </div> -->

              <!--团队名称-->
              <el-row style="margin-top: 50px;display: flex;align-items: center;justify-content: space-between;">
                <div class="leftContent" style="display: flex;justify-content:flex-start;width:80%">
                  <div style="width:100%">
                    <div class="hintText" style="text-align: left;margin-bottom: 12px;">团队名称</div>
                    <div v-if="nameConfig" style="width:100%">
                      <el-input v-model="nameConfigInput" style="width:50%"
                        @keyup.enter="nameConfig = false; nameConfigMethod()" placeholder="请输入名称" />
                    </div>
                    <div v-else style="text-align: left;font-size: 21px;">{{ nowTeam.name }}</div>
                  </div>
                </div>
                <el-button v-if="nameConfig" link type="primary" size="small" style="justify-content: flex-end;"
                  @click="nameConfig = false; nameConfigMethod()">修改完成</el-button>
                <el-button v-else link type="primary" size="small" style="justify-content: flex-end;"
                  @click="nameConfig = true">修改团队名称</el-button>
              </el-row>
              <el-divider />

              <!--昵称修改对话框-->
              <!-- <el-dialog v-model="nickNameConfig" title="修改昵称" width="20%">
                <el-row
                  style="display: flex;flex-direction: row;justify-items: flex-start;width: 90%;padding-left: 20px;">
                  <el-col class="hintText" :span="24" style="text-align: left;margin-bottom: 10px;">请输入昵称</el-col>
                  <el-col :span="24">
                    <el-input v-model="nickNameConfigInput" @keyup.enter="nickNameConfig = false; nickNameConfigMethod()"
                      placeholder="请输入昵称" />
                  </el-col>
                </el-row>

                <template #footer>
                  <span class="dialog-footer">
                    <el-button @click="nickNameConfig = false">取消</el-button>
                    <el-button type="primary" @click="nickNameConfig = false; nickNameConfigMethod()">
                      确认
                    </el-button>
                  </span>
                </template>
              </el-dialog> -->

              <el-row style="display: flex;align-items: center;justify-content: space-between;">
                <div class="leftContent" style="display: flex;justify-content:flex-start;width:80%">
                  <div style="width:100%">
                    <div class="hintText" style="text-align: left;margin-bottom: 12px;">团队描述</div>
                    <div v-if="desConfig" style="width:100%">
                      <el-input v-model="desConfigInput" style="width:100%"
                        @keyup.enter="desConfig = false; desConfigMethod()" placeholder="请输入团队描述" />
                    </div>
                    <div v-else style="text-align: left;font-size: 21px;">{{ nowTeam.des }}</div>
                  </div>
                </div>
                <el-button v-if="desConfig" link type="primary" size="small" style="justify-content: flex-end;"
                  @click="desConfig = false; desConfigMethod()">修改完成</el-button>
                <el-button v-else link type="primary" size="small" style="justify-content: flex-end;"
                  @click="desConfig = true">修改团队描述</el-button>
              </el-row>
              <el-divider />

              <!--创建者-->
              <el-row style="display: flex;align-items: center;justify-content: space-between;">
                <div class="leftContent" style="display: flex;justify-content:flex-start">
                  <div>
                    <div class="hintText" style="text-align: left;margin-bottom: 12px;">创建者</div>
                    <div style="text-align: left;font-size: 21px;">{{ nowTeam.creator }}</div>
                  </div>
                </div>
              </el-row>
              <el-divider />

              <!--创建者-->
              <el-row style="display: flex;align-items: center;justify-content: space-between;">
                <div class="leftContent" style="display: flex;justify-content:flex-start">
                  <div>
                    <div class="hintText" style="text-align: left;margin-bottom: 12px;">项目数量</div>
                    <div style="text-align: left;font-size: 21px;">共有{{ nowTeam.projectNum }}个项目</div>
                  </div>
                </div>
              </el-row>
              <el-divider />

              <!--空间头像-->

              <!--删除团队/退出团队-->


            </div>
          </div>





        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import qs from 'qs'
import axios from 'axios'
import { ref, unref } from 'vue'
import { onMounted } from 'vue'
import { authStore } from "../store/index.js"
import { reactive, toRefs } from 'vue'
import GuideAside from '@/components/GuideAside.vue'
import Header from '@/components/Header.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadProps, UploadUserFile } from 'element-plus'
import {
  Share,
  DeleteFilled,
  Comment,
  Grid,
} from '@element-plus/icons-vue'
/*侧栏*/



/*侧栏导航栏*/
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}

/*跳转对应页*/
const jumpTo = (path) => {
  //this.$router.push('/video/'+video_id);
  const path_url = '/' + path;
  window.open(path_url, '_self');
}

let nowTeam = reactive({
  teamId: '',
  name: '',
  des: '',
  cover_url: '',
  createTime: '',
  creator: '',
  memberNum: '',
  projectNum: '',
  role_string: '',
})

const nameConfig = ref(false);
const nameConfigInput = ref('');

const desConfig = ref(false);
const desConfigInput = ref(false);

//获取数据
onMounted(() => {
  fetchNowTeam();
})

//获取当前团队
const fetchNowTeam = () => {
  let Headers = { 'Authorization': authStore().token };
  axios.get('http://www.aamofe.top/api/team/get_current_team/', { params: { user_id: authStore().userId }, headers: Headers })
    .then((response) => {
      console.log(response);

      if (response.data.errno == 0) {  //获取成功“我”的身份信息
        nowTeam.teamId = response.data.team.id;
        nowTeam.name = response.data.team.name;
        nowTeam.des = response.data.team.description;
        nowTeam.cover_url = response.data.team.cover_url;

        nowTeam.createTime = response.data.team.created_at;
        nowTeam.creator = response.data.team.creator;
        nowTeam.role_string = response.data.team.role_string;
        if ((nowTeam.role_string === 'CR' || nowTeam.role_string === 'MG') && nowTeam.name != "个人空间") {
          getInviteLink();
        }
        nowTeam.projectNum = response.data.team.project_num;
        localStorage.setItem('teamId', response.data.team.id);
        localStorage.setItem('teamName', response.data.team.name);

        desConfigInput.value = nowTeam.des;

        if (response.data.team.role_string === "CR" || response.data.team.role_string === "MG") { localStorage.setItem('isAdmin', true); }
        else { localStorage.setItem('isAdmin', false); }
        return;
      }
      else {
        ElMessage.warning(response.data.msg);
      }
    }).catch(error => {
      console.log(error);
    })
}

const inviteLink = ref('');
//邀请别人加入团队
const getInviteLink = () => {
  let Headers = { 'Authorization': authStore().token };
  axios.get('http://www.aamofe.top/api/team/get_invitation/', { params: { team_id: nowTeam.teamId }, headers: Headers })
    .then((response) => {
      console.log(response);

      if (response.data.errno == 0) {  //获取成功“我”的身份信息
        inviteLink.value = response.data.invatation;
        return;
      }
      else {
        ElMessage.warning(response.data.msg);
      }
    }).catch(error => {
      console.log(error);
    })
}

const nameConfigMethod = () => {
  if (!(nameConfigInput.value)) {
    console.log('团队名称不能为空');
    ElMessage.warning('请输入团队名称');
    return;
  }
  axios.post('http://www.aamofe.top/api/team/update_team/',
    qs.stringify({ team_name: nameConfigInput.value }), { headers: { Authorization: authStore().token } })
    .then(res => {
      // 处理响应数据
      console.log(res);

      if (res.data.errno == 0)//成功
      {
        nowTeam.name = nameConfigInput.value;
        nameConfig.value = false;
        nameConfigInput.value = '';
        window.location.reload();
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

const desConfigMethod = () => {
  if (!(desConfigInput.value)) {
    console.log('团队描述不能为空');
    ElMessage.warning('请输入团队描述');
    return;
  }
  axios.post('http://www.aamofe.top/api/team/update_team/',
    qs.stringify({ description: desConfigInput.value }), { headers: { Authorization: authStore().token } })
    .then(res => {
      // 处理响应数据
      console.log(res);

      if (res.data.errno == 0)//成功
      {
        nowTeam.des = desConfigInput.value;
        desConfig.value = false;
        desConfigInput.value = '';
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


</script>

<style scoped>
.hintText {
  color: gray;
  font-size: 18px;
  font-weight: 600;
}

.borderBlock {
  /* border: 1px solid rgba(176, 170, 170, 0.703);
  border-radius: 4px; */
  border: 2px solid #d0dcdc9a;
  border-radius: 10px;
  padding: 10px 0 10px 0;
  box-shadow: 0 .5px 0 .5px#e7f6f69a;
  border-radius: 10px;
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

.designBlock {
  width: 18%;
  margin-bottom: 40px;
  margin-right: 14px;
  /* text-align: left; */
  font-size: 14px;
  font-weight: 500;
}

.round {
  border-radius: 10px;
  /* 设置边框圆角半径，根据需要调整 */
}


.designImg {
  margin-bottom: 5px;
}

.block {
  width: 150px;
  /* height: 100px; */
  border-radius: 10px;
  /* display: flex; */
  /* align-items: center; */
}

.fileBlock {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-items: center; */
  margin-top: 8px;
}

.highlighted-row {
  background-color: rgb(237, 237, 237);
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
