<template>
  <!--主页-->
  <div class="common-layout">
    <el-container>
      <!--侧边-->
      <el-aside width="15%">
        <!--侧栏-->
        <GuideAside />
      </el-aside>

      <el-container>
        <!--顶部-->
        <el-header style="padding-top:13px">
          <Header />
        </el-header>
        <el-divider />

        <!--主页面，不同的地方-->
        <el-main>
          <div class="page" style="width:98%;margin-left: 1%;">

            <!--团队信息-->
            <el-row class="block" style="display: flex;align-items: center;">
              <el-col :span="16">
                <el-row style="display: flex;align-items: center;">
                  <!-- <el-avatar shape="square" :size="50" :src="squareUrl" style="margin-right:20px" /> -->
                  <span style="font-size:larger;font-weight: 800;">{{nowTeam.name}}</span>
                </el-row>
              </el-col>

              <el-col :span="8">
                <div style="display: flex;flex:1;justify-content: flex-end;">
                  <el-button type="primary" @click="newProjectDialog=true">新建项目</el-button>

                  <!--如果是管理员有“邀请”这一项，判断登陆者在该团队中的身份-->
                  <el-button type="primary" @click="centerDialogVisible = true">邀请成员</el-button>
                </div>
              </el-col>
            </el-row>


            <el-dialog v-model="newProjectDialog" title="创建新项目" width="26%" center>
              <span>
                <!--输入信息，查找-->
                <el-input v-model="newProjectNameInput" placeholder="请输入项目名称" />
                <!--通过链接-->
              </span>
              <template #footer>
                <span class="dialog-footer">
                  <el-button type="primary" @click="createNewProject()">
                    确认创建
                  </el-button>
                </span>
              </template>
            </el-dialog>


            <el-dialog v-model="centerDialogVisible" title="邀请成员加入团队" width="26%" center>
              <span>
                <!--输入信息，查找-->
                <el-input v-model="input" placeholder="Please input" />
                <!--通过链接-->
              </span>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="centerDialogVisible = false">Cancel</el-button>
                  <el-button type="primary" @click="centerDialogVisible = false">
                    Confirm
                  </el-button>
                </span>
              </template>
            </el-dialog>
            <!--团队信息结束-->

            <el-row style="margin-top:40px;margin-bottom:0;">
              <span style="font-size: 23px;font-weight: 900;">主页</span>
            </el-row>

            <div class="draftFiles" style="margin-top:20px">
              <el-row style="margin-top:20px;margin-bottom: 30px;">
                <el-col :span="24">
                  <el-row class="blockHeader" style="display:flex">
                    <el-col :span="14" class="blockTitle"
                      style="font-size:large;font-weight: 600;text-align: left;">草稿箱</el-col>
                    <el-col :span="10" class="rightTitle" style="">查看更多</el-col>
                  </el-row>
                </el-col>


                <el-col :span="12">
                  <div style="margin-left:24px">
                    <div style="text-align: left;font-weight: 500;margin-bottom: 12px;">
                      原型
                    </div>
                    <el-col :span="4">
                      <div style="width:100%;">
                        <div>
                          <img src="@/assets/projectImage.png" style="width:170px;height:120px" />
                        </div>
                        <div style="text-align: left;font-size: 14px;margin-bottom: 14px;">
                          文档名字
                        </div>
                      </div>
                    </el-col>
                  </div>
                </el-col>

                <el-divider direction="vertical" style="height: 170px;"></el-divider>
                <el-col :span="11">
                  <div style="margin-left:24px">
                    <div style="text-align: left;font-weight: 500;margin-bottom: 12px;">
                      文档
                    </div>
                    <el-col :span="4">
                      <div style="width:100%;">
                        <div>
                          <img src="@/assets/projectImage.png" style="width:170px;height:120px" />
                        </div>
                        <div>
                          文档名字
                        </div>
                      </div>
                    </el-col>
                  </div>
                </el-col>
              </el-row>
            </div>

            <el-row style="margin-top:40px;margin-bottom: 30px;">
              <span style="font-size:large;font-weight: 500;">项目</span>
            </el-row>
            <el-row :gutter="25">
              <el-col :span="4" style="margin-bottom:40px">
                <div>
                  <div style="width:100%">
                    <img src="@/assets/projectImage.png" style="width:200px;height:150px" />
                  </div>
                  项目名字
                </div>
              </el-col>
              <el-col :span="4">
                <div style="width:100%">
                  <img class="round" src="@/assets/projectImage.png" style="width:170px;height:140px" />
                </div>
                <div>
                  项目名字
                </div>
              </el-col>
              <el-col :span="4">
                <div>
                  <img src="@/assets/projectImage.png" style="width:200px;height:150px" />
                  项目名字
                </div>
              </el-col>
              <el-col :span="4">
                <div>
                  <img src="@/assets/projectImage.png" style="width:200px;height:150px" />
                  项目名字
                </div>
              </el-col>
              <el-col :span="4">
                <div>
                  <img src="@/assets/projectImage.png" style="width:200px;height:150px" />
                  项目名字
                </div>
              </el-col>
              <el-col :span="4">
                <div>
                  <img src="@/assets/projectImage.png" style="width:200px;height:150px" />
                  项目名字
                </div>
              </el-col>
              <el-col :span="4">
                <div>
                  <img src="@/assets/projectImage.png" style="width:200px;height:150px" />
                  项目名字
                </div>
              </el-col>
              <el-col :span="4">
                <div>
                  <img src="@/assets/projectImage.png" style="width:200px;height:150px" />
                  项目名字
                </div>
              </el-col>
            </el-row>

          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, unref} from 'vue'
import { useRoute } from 'vue-router';
const route = useRoute()
import { onMounted } from 'vue'
import { authStore } from "../store/index.js"
import { reactive, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import GuideAside from '@/components/GuideAside.vue'
import Header from '@/components/Header.vue'
import { UploadProps, UploadUserFile } from 'element-plus'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
  Avatar,
  ArrowDown,
  Edit,
  Platform,
  Bell,
  Tools,
  SwitchButton,
  Plus,
  HomeFilled,
  Share,
  DeleteFilled,
  Comment,
  Grid,
} from '@element-plus/icons-vue'
/*侧栏*/

/*切换团队*/
const btnSwiTeam = ref()
const popoverTeam = ref()
const teamOutside = () => {
  unref(popoverTeam).popoverTeam?.delayHide?.()
}
/*新建团队*/
const addTeamVisible = ref(false)
const addTeamNameInput = ref('')
const addTeamIntroductionInput = ref('')
/*头像*/
const squareUrl = ref('https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png')
// const state = reactive({
//   circleUrl:
//     'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
//   squareUrl:
//     'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
//   sizeList: ['small', '', 'large'],
// })
// const { circleUrl, squareUrl, sizeList } = toRefs(state)
/*点击头像，有下拉列表*/
import { ClickOutside as vClickOutside } from 'element-plus'
// const buttonRef = ref()
// const popoverRef = ref()
// const onClickOutside = () => {
//   unref(popoverRef).popperRef?.delayHide?.()
//}
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
/*侧栏导航栏结束*/

/*邀请成员*/
// import { ref } from 'vue'
const centerDialogVisible = ref(false) /*邀请对话框*/
const input = ref('')/*邀请成员时，输入框*/

/*main*/
const nowTeam = reactive({
  teamId: '',
  name: '',
  logo: '',
  createTime:'',
  creator:'',
})

const fetchNowTeam = () => {
  let Headers = { 'Authorization': authStore().token };
  console.log(Headers);
  console.log(authStore().userId)

  axios.get('http://www.aamofe.top/api/team/get_current_team/', { params: { user_id: authStore().userId }, headers: Headers })
    .then((response) => {
      console.log(response);

      if (response.data.errno == 0) {  //获取成功“我”的身份信息
        nowTeam.teamId = response.data.team.id;
        nowTeam.name = response.data.team.name;
        nowTeam.createTime= response.data.team.created_at;
        nowTeam.creator = response.data.team.creator;
        // nowTeam. = response.data.team.team_num;
        console.log(nowTeam.name);
        return;
      }
      else {
        ElMessage.warning(response.data.msg);
      }
    }).catch(error => {
      console.log(error);
    })

}

onMounted(() => {
  fetchNowTeam();
})

const newProjectDialog=ref(false)
const newProjectNameInput=ref('');
//创建新项目
const createNewProject=()=>{
  let Headers = { 'Authorization': authStore().token };
  // axios.post('',)
  //....
}
</script>

<style scoped>
.hintText {
  color: gray;
  font-size: small;
  font-weight: 600;
}

.draftFiles {
  width: 100%;
  background-color: rgba(243, 241, 241, 0.745);
  /* border: 2px solid #d0dcdc9a; */
  border-radius: 10px;
  /* padding: 5px 0 10px 0; */
  box-shadow: 0 .5px 0 .5px#e7f6f69a;
}

.blockTitle {
  padding-left: 24px;
  padding-top: 20px;
  padding-bottom: 20px;
}

.rightTitle {
  padding-right: 40px;
  padding-top: 20px;
  padding-bottom: 20px;
  display: flex;
  text-align: right;
  display: flex;
  flex: 1;
  justify-content: flex-end;
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

.round {
  border-radius: 10px;
  /* 设置边框圆角半径，根据需要调整 */
}

/*上传团队封面*/
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
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