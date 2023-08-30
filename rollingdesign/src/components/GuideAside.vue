<template>
  <!--侧栏-->
  <div>
    <el-col :span="24"><!--占一整列-->
      <el-menu :default-active="guideIndex" width="100%" style="height:100vh" class="el-menu-vertical-demo side-guide"
        @open="handleOpen" @close="handleClose">
        <!--logo图标-->
        <!-- <img alt="web logo" src="@/assets/logo.svg" style="width:100%;margin-bottom: 10px;"> -->
        <img alt="web logo" src="@/assets/webLogo.png" style="width:100%;margin-bottom: 10px;">

        <!--团队信息-->
        <div
          style="background-color:rgb(232, 247, 254);padding-left: 18px;padding-top: 18px;padding-bottom: 18px;margin-bottom: 20px;">
          <el-row class="block" style="display: flex;justify-content: space-between;align-items: center;">
            <div style="display: flex;align-items: center;">
              <!-- <el-avatar shape="square" :size="50" :src="squareUrl" style="margin-right:20px" /> -->
              <span v-if="authStore().isLogin" style="font-size:larger;font-weight: 800;">{{ authStore().teamName
              }}</span>
            </div>
            <el-icon class="el-icon--right" style="margin-right:7%" ref="btnSwiTeam" v-click-outside="teamOutside">
              <ArrowRight />
            </el-icon>
          </el-row>
        </div>

        <el-popover ref="popoverTeam" :virtual-ref="btnSwiTeam" trigger="click" title="" virtual-triggering width="300px"
          placement="left">
          <div style="margin-left:10px;">
            <div style="font-weight:900;font-size: 18px;margin-bottom: 15px;">
              <span style="margin-left: 15px;">切换团队</span>
            </div>
            <div>

              <!--团队信息-->
              <div class="block" v-for="(teamItem, index) in teamList" :key="index" @mouseover="highlightRow(index)"
                @mouseleave="resetRow(index)" :class="{ 'highlighted-row': highlightedIndex === index }">
                <div style="display: flex;flex-direction: row;align-items: center;" @click="switchToTeam(teamItem.id)">
                  <!-- <el-avatar shape="square" :size="50" :src="squareUrl" style="" /> -->
                  <!--昵称和介绍-->
                  <el-row
                    style="display: flex;flex-direction: row;justify-items: flex-start;width: 90%;margin-left: 12px;">
                    <el-col :span="24" class="in-center round-choice"
                      style="text-align: left;font-weight: 600;font-size: 17px;margin-bottom: 5px;">{{
                        teamItem.name }}</el-col>
                    <!-- <el-col :span="24" style="text-align: left;color: rgb(80, 79, 79);font-size: 13px;">描述</el-col> -->
                  </el-row>
                </div>
                <!-- <el-divider /> -->
                <!-- <div v-if="index < teamList.length - 2" class="my-divider"></div> -->
              </div>

              <!--团队信息结束-->
            </div>
          </div>
        </el-popover>


        <!--主页-->
        <el-menu-item index="index" @click="jumpTo('index')">
          <template #title>
            <el-icon>
              <HomeFilled />
            </el-icon>
            <span> 主页 </span>
          </template>
        </el-menu-item>

        <el-menu-item index="teamPeople" @click="jumpTo('teamPeople')">
          <template #title>
            <el-icon>
              <Avatar />
            </el-icon>
            <span> 团队成员 </span>
          </template>
        </el-menu-item>

        <!--项目-->
        <el-sub-menu index="project">
          <template #title>
            <el-icon>
              <Grid />
            </el-icon>
            <span>项目</span>
          </template>

          <el-menu-item v-for="(projectItem, index) in projectList" :key="index" :index="'project-' + projectItem.id"
            @click="jumpToProject(projectItem.id)">{{ projectItem.name }}</el-menu-item>
          <!-- <el-menu-item index="1-2">项目2</el-menu-item> -->
        </el-sub-menu>

        <!-- 回收站-->
        <el-menu-item index="recover" @click="jumpTo('recover')">
          <el-icon>
            <DeleteFilled />
          </el-icon>
          <span>回收站</span>
        </el-menu-item>

        <!--消息中心-->
        <el-menu-item index="message" @click="jumpTo('message')">
          <el-icon>
            <Comment />
          </el-icon>
          <span>消息中心</span>
        </el-menu-item>

        <!--新建团队-->
        <el-menu-item @click="addTeamVisible = true">
          <el-icon>
            <Plus />
          </el-icon>
          <span>新建团队</span>
        </el-menu-item>

        <!--新建团队的对话框-->
        <el-dialog v-model="addTeamVisible" title="" width="35%" center>
          <el-row class="tac">
            <!--文本部分-->
            <el-col class="textAddTeam" :span="12" style="display: flex;flex-direction: column;">
              <div style="font-size:25px;font-weight:600;margin-bottom: 5px;">创建新团队</div>
              <div>你可以和成员在团队中一起协作</div>

              <!--团队名称-->
              <div style="font-size:larger;font-weight:500;margin-top: 20px;margin-bottom: 5px;">
                团队名称</div>
              <div> <el-input style="width:90%" v-model="addTeamNameInput" placeholder="请输入团队名称" />
              </div>

              <div style="margin-left:8%;margin-top: 30%;margin-bottom: 10px;">
                <el-button style="width:84%;" type="primary" @click="buildNewTeam()">
                  确认创建
                </el-button>
              </div>

              <!--logo-->
              <img alt="web logo" src="@/assets/webLogo.png" style="width:90%;margin-top: 10px;">

            </el-col>
            <!--图片部分-->
            <el-col :span="12">
              <div class="imageAddTeam">
                <img src="@/assets/addTeamImage.png" alt="Image" style="width:100%" />
              </div>
            </el-col>
          </el-row>

          <!-- <template #footer>
            <div style="margin-bottom:0 ;">
              <el-button style="width:40%;" type="primary" @click="centerDialogVisible = false; buildNewTeam()">
                确认创建
              </el-button>
            </div>
          </template> -->
        </el-dialog>

      </el-menu>


    </el-col>
  </div>
</template>

<script setup>
import qs from 'qs'

import { ref, unref, inject } from 'vue'
import { useRoute } from 'vue-router';
import { onMounted } from 'vue'
import { authStore } from "../store/index.js"
import { reactive, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadProps, UploadUserFile } from 'element-plus'
import {
  Menu as IconMenu,
  Avatar,
  ArrowDown,
  ArrowRight,
  Plus,
  HomeFilled,
  DeleteFilled,
  Comment,
  Grid,
} from '@element-plus/icons-vue'
const route = useRoute()

const axios = inject('axios')

let teamList = ref([]);
let projectList = ref([]);
/*切换团队*/
const btnSwiTeam = ref()
const popoverTeam = ref()
/*新建团队*/
const addTeamVisible = ref(false)
const addTeamNameInput = ref('')
const addTeamIntroductionInput = ref('')

const guideIndex = ref();//侧栏导航高亮标识！！
const highlightedIndex = ref(-1);

let nowTeam = reactive({
  teamId: '',
  name: '',
  logo: '',
  createTime: '',
  creator: '',
  memberNum: '',
  projectNum: '',
  role_string: '',
})

//获取数据
onMounted(async () => {
  await fetchTeamlistData();
  await fetchNowTeam();
  await fetchProjectData();
  await highLight();
})

//获取当前团队
const fetchNowTeam = async () => {
  let Headers = { 'Authorization': authStore().token };
  let response = await axios.get('/team/get_current_team/', { params: { user_id: authStore().userId }, headers: Headers })
  console.log("🚀 ~ file: GuideAside.vue:225 ~ .then ~ response:", response)
  // console.log(response);

  if (response.data.errno == 0) {  //获取成功“我”的身份信息
    nowTeam.teamId = response.data.team.id;
    nowTeam.name = response.data.team.name;
    nowTeam.createTime = response.data.team.created_at;
    nowTeam.creator = response.data.team.creator;
    nowTeam.role_string = response.data.team.role_string;

    localStorage.setItem('teamId', response.data.team.id);
    localStorage.setItem('teamName', response.data.team.name);

    if (response.data.team.role_string === "CR" || response.data.team.role_string === "MG") { localStorage.setItem('isAdmin', true); }
    else { localStorage.setItem('isAdmin', false); }
    return;
  }
  else {
    ElMessage.warning(response.data.msg);
  }
}


const fetchTeamlistData = async () => {
  let Headers = { 'Authorization': authStore().token };
  teamList = ref([]);

  let response = await axios.get('/team/all_teams/', { headers: Headers })
  // .then((response) => {
  console.log("🚀 ~ file: GuideAside.vue:255 ~ .then ~ response:", response.data)
  // console.log(response);
  if (response.data.errno == 0) {  //所有团队信息
    response.data.teams.forEach((team, index) => {
      teamList.value.push(team);/*【这样写】*/
      return;
    })
    // console.log(teamList.value);
  }
  else {
    ElMessage.warning(response.data.msg);
  }
}

//获取项目列表
const fetchProjectData = () => {
  let Headers = { 'Authorization': authStore().token };
  projectList = ref([])
  axios.get('http://www.aamofe.top/api/team/all_projects/', { headers: Headers })
    .then((response) => {
      // console.log(response);

      if (response.data.errno == 0) {  //所有团队信息
        response.data.projects.forEach((project, index) => {
          projectList.value.push(project);/*【这样写】*/
          return;
        })
        localStorage.setItem('projectList', response.data.projects);
        // console.log(projectList.value);
      }
      else {
        ElMessage.warning(response.data.msg);
      }
    }).catch(error => {
      console.log(error);
    })
}

//切换团队
const switchToTeam = (team_to_id) => {
  axios.post('http://www.aamofe.top/api/team/checkout_team/', qs.stringify({ team_id: team_to_id }), { headers: { Authorization: authStore().token } })
    .then(res => {
      console.log(res);
      if (res.data.errno == 0)//成功
      {
        //重新载入数据
        localStorage.setItem('teamName', res.data.current_team.team_name);
        // teamId: localStorage.getItem('teamId') ? localStorage.getItem('teamId') : '',
        // teamName: localStorage.getItem('teamName') ? localStorage.getItem('teamName') : '',
        //   isAdmin: localStorage.getItem('isAdmin') ? localStorage.getItem('isAdmin') : false,//当前登录者在当前团队是否有管理权限
        //     projectList: localStorage.getItem('projectList') ? localStorage.getItem('projectList') : [],//初始化为一个空数组
        window.location.reload();//重载页面
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

const buildNewTeam = () => {
  if (!(addTeamNameInput.value)) {
    console.log('不能为空');
    ElMessage.warning('请输入团队名称');
    return;
  }

  axios.post('http://www.aamofe.top/api/team/create_team/', qs.stringify({ team_name: addTeamNameInput.value }), { headers: { Authorization: authStore().token } })
    .then(res => {
      console.log(res);

      if (res.data.errno == 0)//成功
      {
        ElMessage.success(res.data.msg);
        addTeamVisible.value = false;
        addTeamNameInput.value = '';
        //重新获取团队列表
        fetchTeamlistData();
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

const highLight = () => {//计算侧栏应该是哪里高亮
  // console.log(route.meta.index);
  if (route.meta.index != "teamManage" && route.meta.index != "project") {
    guideIndex.value = route.meta.index;
  }
  else if (route.meta.index == "teamManage") {
    guideIndex.value = 'team-' + route.params.id;
  }
  else if (route.meta.index == "project") {
    guideIndex.value = 'project-' + route.params.id;
  }
  // console.log("v:" + guideIndex.value);
}

/*侧栏导航栏*/
const handleOpen = (key, keyPath) => {
  // console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  // console.log(key, keyPath)
}

const teamOutside = () => {
  unref(popoverTeam).popoverTeam?.delayHide?.()
}

/*跳转对应页*/
const jumpTo = (path) => {
  //this.$router.push('/video/'+video_id);
  const path_url = '/' + path;
  window.open(path_url, '_self');
}

const jumpToProject = (project_id) => {
  //this.$router.push('/video/'+video_id);
  const project_show_url = '/project/' + project_id;
  window.open(project_show_url, '_self');
}

const jumpToTeam = (team_id) => {
  console.log('team' + team_id)
  //this.$router.push('/video/'+video_id);
  const team_show_url = '/teamManage/' + team_id;
  window.open(team_show_url, '_self');
}

const highlightRow = (index) => {
  highlightedIndex.value = index;
};

const resetRow = (index) => {
  highlightedIndex.value = -1;
};

const print = (content) => {
  console.log(content);
}

</script>

<style scoped>
.borderBlock {
  /* border: 1px solid rgba(176, 170, 170, 0.703);
  border-radius: 4px; */
  border: 2px solid #d0dcdc9a;
  border-radius: 10px;
  padding: 10px 0 10px 0;
  box-shadow: 0 .5px 0 .5px#e7f6f69a;
}

.in-center {
  display: flex;
  align-items: center;
}

.highlighted-row {
  background-color: rgb(237, 237, 237);
}

.round-choice {
  border-radius: 5px;
  margin-bottom: 6px;
  padding: 3px 0 3px 5px;
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

.my-divider {
  height: 1px;
  /* 设置横线的高度 */
  background-color: rgb(234, 232, 232);
  /* 设置横线的颜色 */
  margin: 10px 0;
  /* 可选：设置横线上下的间距 */
}
</style>
