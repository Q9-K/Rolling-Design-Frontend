<template>
  <!--回收站-->
  <div class="common-layout">
    <el-container>
      <!--侧边-->
      <el-aside width="15%">
        <!--侧栏-->
        <GuideAside />
      </el-aside>
      <!--侧边结束-->

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
            <el-row style="margin-bottom: 30px;">
              <span style="font-size:23px;font-weight: 500;">
                回收站
              </span>
            </el-row>

            <el-row class="block" style="display: flex;align-items: center;margin-bottom: 35px;">
              <!-- <el-avatar shape="square" :size="50" :src="squareUrl" style="margin-right:20px" /> -->
              <span style="font-size:19px;font-weight: 800;">已删除项目</span>

              <div style="display: flex;flex: 1;justify-content: flex-end;">
                <!-- <el-popconfirm title="此操作不可撤回，您确定要全部删除吗？" confirm-button-text="确定" cancel-button-text="取消"
                  @confirm="deleteAll()" >
                  <template #reference>
                    <el-button type="primary" >清倒</el-button>
                  </template>
                </el-popconfirm> -->

                <el-button plain type="danger" @click="openDelAllBox()">清倒</el-button>
                <!-- <el-button type="success" plain @click="openRecoverAllBox()">全部恢复</el-button> -->
              </div>
            </el-row>
            <!--团队信息结束-->

            <!-- <el-row style="margin-top:40px;margin-bottom: 30px;">
              <span style="font-size:large;font-weight: 500;">回收站</span>
            </el-row> -->

            <!--项目部分-->
            <!--展开状态（此为默认状态）-->

            <!--如果有项目-->
            <el-row v-if="delProjectNum">
              <div class="designBlock" v-for="(item, index) in delProjectList" :key="index">
                <div style="width:100%">
                  <img class="round designImg" src="@/assets/projectImage.png" @click="cannotOpen(item.name)"
                    style="width:90%;height:150px" />
                </div>
                <div style="display:flex;justify-content: space-between;width:90%">
                  <span class="projectName" style="padding-left:4px;display: flex;">
                    {{ item.name }}
                  </span>
                  <span class="rightContent">

                    <el-dropdown trigger="click" placement="bottom-start">

                      <el-icon>
                        <More />
                      </el-icon>
                      <template #dropdown>
                        <el-dropdown-item :icon="RemoveFilled"
                          @click="deleteProject(index, item.id)">删除项目</el-dropdown-item>
                        <el-dropdown-item :icon="DeleteFilled" @click="openDelAllBox()">全部删除</el-dropdown-item>
                        <el-dropdown-item :icon="CirclePlusFilled"
                          @click="recoverProject(index, item.id)">恢复项目</el-dropdown-item>
                      </template>
                    </el-dropdown>
                  </span>
                </div>
              </div>
            </el-row>
            <!--如果没有项目-->
            <el-row v-else>
              <el-empty description="暂无项目" style="width: 100%;" />
            </el-row>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import qs from 'qs'
import { ref, unref } from 'vue'
import { ClickOutside as vClickOutside } from 'element-plus'
import axios from 'axios'
import { onMounted } from 'vue'
import { reactive, toRefs } from 'vue'
import GuideAside from '@/components/GuideAside.vue'
import Header from '@/components/Header.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadProps, UploadUserFile } from 'element-plus'
import {
  CaretBottom,
  CaretRight,
  MoreFilled,
  EditPen,
  FolderDelete,
  FolderOpened,
  RemoveFilled,
  DeleteFilled,
  CirclePlusFilled,
  More,
} from '@element-plus/icons-vue'
import { authStore } from '@/store'
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

/*main*/
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

const delProjectNum = ref('')//项目的数量
const delProjectList = ref([])
const invideLink = ref('');

onMounted(() => {
  fetchDelProjectData();
  fetchNowTeam();
})

//获取当前团队
const fetchNowTeam = () => {
  let Headers = { 'Authorization': authStore().token };
  axios.get('http://www.aamofe.top/api/team/get_current_team/', { params: { user_id: authStore().userId }, headers: Headers })
    .then((response) => {
      // console.log(response);

      if (response.data.errno == 0) {  //获取成功“我”的身份信息
        nowTeam.teamId = response.data.team.id;
        nowTeam.name = response.data.team.name;
        nowTeam.createTime = response.data.team.created_at;
        nowTeam.creator = response.data.team.creator;
        nowTeam.role_string = response.data.team.role_string;
        // if ((nowTeam.role_string === 'CR' || nowTeam.role_string === 'MG') && nowTeam.name != "个人空间") {
        //   getInviteLink();
        // }
        localStorage.setItem('teamId', response.data.team.id);
        localStorage.setItem('teamName', response.data.team.name);

        if (response.data.team.role_string === "CR" || response.data.team.role_string === "MR") { localStorage.setItem('isAdmin', true); }
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

const fetchDelProjectData = () => {
  let Headers = { 'Authorization': authStore().token };
  axios.get('http://www.aamofe.top/api/team/all_deleted_project/', { headers: Headers })
    .then((response) => {
      console.log(response);

      if (response.data.errno == 0) {  //所有团队信息
        response.data.projects.forEach((project, index) => {
          delProjectList.value.push(project);/*【这样写】*/
        })
        // console.log(projectList.value);

        delProjectNum.value = response.data.projects.length;
        // console.log(response.data.projects.length)
        console.log(delProjectList.value);
        return;
      }
      else {
        ElMessage.warning(response.data.msg);
      }
    }).catch(error => {
      console.log(error);
    })
}

const deleteProject = (index, projectId) => {
  // console.log(index);
  // console.log(projectId);
  axios.post('http://www.aamofe.top/api/team/delete_permanently/', qs.stringify({ project_id: projectId }), {
    headers: { Authorization: authStore().token }
  })
    .then(res => {
      // 处理响应数据
      // console.log(res);

      if (res.data.errno == 0)//成功
      {
        ElMessage.success(res.data.msg);
        let i = 0;
        for (i = 0; i < delProjectList.value.length - 1; i++) {
          if (i >= index) {
            // console.log(i);
            delProjectList.value[i] = delProjectList.value[i + 1];
          }
        }
        delProjectList.value.pop();
        // console.log(projectList.value);
        delProjectNum.value--;
      }
      else {//失败
        console.log(projectId);
        ElMessage.error(res.data.msg);
        return;
      }
    })
    .catch(error => {
      // 处理请求错误
      console.error(error);
    });
}

const recoverProject = (index, projectId) => {
  console.log(index);

  console.log(projectId);
  axios.post('http://www.aamofe.top/api/team/recover_one_project/', qs.stringify({ project_id: projectId }), {
    headers: { Authorization: authStore().token }
  })
    .then(res => {
      // 处理响应数据
      console.log(res);
      console.log(projectId);

      if (res.data.errno == 0)//成功
      {
        ElMessage.success(res.data.msg);
        //把项目从projectList里删除
        let i = 0;
        for (i = 0; i < delProjectList.value.length - 1; i++) {
          if (i >= index) {
            // console.log(i);
            delProjectList.value[i] = delProjectList.value[i + 1];
          }
        }
        delProjectList.value.pop();
        // console.log(projectList.value);
        delProjectNum.value--;
      }
      else {//失败
        console.log(projectId);
        ElMessage.error(res.data.msg);
        return;
      }
    })
    .catch(error => {
      // 处理请求错误
      console.error(error);
    });
}
//输入为0
const deleteAll = () => {
  axios.post('http://www.aamofe.top/api/team/delete_permanently/', qs.stringify({ project_id: 0 }),{ headers: { Authorization: authStore().token } })
    .then(res => {
      // 处理响应数据
      console.log(res);

      if (res.data.errno == 0)//成功
      {
        // ElMessage.success(res.data.msg);
        //把项目从projectList里删除
        delProjectList.value = [];
        delProjectNum.value=0;
        ElMessage.success('全部删除成功')
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

const recoverAll = () => {
  console.log(nowTeam.teamId);

  axios.post('http://www.aamofe.top/api/team/recover_all_project/', qs.stringify({ team_id: nowTeam.teamId }), {
    headers: { Authorization: authStore().token }
  })
    .then(res => {
      // 处理响应数据
      console.log(res);
      if (res.data.errno == 0)//成功
      {
        ElMessage.success(res.data.msg);
        //把项目从projectList里删除
        delProjectList.value = [];
        delProjectNum.value=0;
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
//打开是否确认全部删除和恢复的按钮
const openDelAllBox = () => {
  ElMessageBox.confirm(
    '此操作不可撤回，您确定要全部删除吗？',
    '确认删除',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      deleteAll();
    })
    .catch(() => {
    })
}

const openRecoverAllBox = () => {
  ElMessageBox.confirm(
    '您即将将回收站里的项目全部恢复，您确定吗？',
    '确认恢复',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      recoverAll();
    })
    .catch(() => {
    })
}
//【】
const cannotOpen = (name) => {
  ElMessageBox.alert('不能打开项目' + '"' + name + '",因为它在回收站中', '', {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: 'OK',
  })
}
/*获取邀请链接*/
// const getLink = () => {
//   axios.get('http://www.aamofe.top/api/team/get_invitation/', { params: { team_id: 1 }, headers: { Authorization: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTM0ODQ1NDUsImlkIjoxfQ.8ZA60G5SWc793QCzywrXKW4lrEzFW26DqSVj7vj-7FI" } })
//     .then(res => {
//       // 处理响应数据
//       console.log(res);

//       if (res.data.errno == 0)//成功
//       {
//         console.log(res.data.invatation);
//         invideLink.value = res.data.invatation;
//         return;
//       }
//       else {//失败
//         ElMessage.error(res.data.msg);
//         return;
//       }
//     })
//     .catch(error => {
//       // 处理请求错误
//       console.error(error);
//     });
// }
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

.round {
  border-radius: 10px;
  /* 设置边框圆角半径，根据需要调整 */
}

.designImg {
  margin-bottom: 5px;
}

.designBlock {
  width: 18%;
  margin-bottom: 40px;
  margin-right: 14px;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
}

.rightContent {
  display: flex;
  text-align: right;
  justify-content: end;
}
</style>