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
                  <span style="font-size:larger;font-weight: 800;">{{ nowTeam.name }}</span>
                </el-row>
              </el-col>

              <!--功能按钮-->
              <el-col :span="8">
                <div style="display: flex;flex:1;justify-content: flex-end;">
                  <el-button type="primary" @click="newProjectDialog = true">新建项目</el-button>
                  <!--如果是管理员有“邀请”这一项，判断登陆者在该团队中的身份-->
                  <!--邀请成员的框-->
                  <el-popover placement="bottom" :width="300" trigger="click">
                    <template #reference>
                      <el-button
                        v-if="(nowTeam.role_string === 'CR' || nowTeam.role_string === 'MG') && nowTeam.name != '个人空间'"
                        type="primary">邀请成员</el-button>
                    </template>
                    <div class="link-block" style="margin-bottom: 12px;">
                      <div>{{ inviteLink }}</div>
                    </div>
                    <div><el-button type="primary" @click="copyLink()">点击复制链接</el-button></div>
                  </el-popover>
                </div>
              </el-col>
            </el-row>

            <!--创建新项目的对话框-->
            <el-dialog v-model="newProjectDialog" title="创建新项目" width="26%" center>
              <span>
                <el-input v-model="newProjectNameInput" placeholder="请输入项目名称" />
              </span>
              <template #footer>
                <span class="dialog-footer">
                  <el-button type="primary" @click="createNewProject()">
                    确认创建
                  </el-button>
                </span>
              </template>
            </el-dialog>
            <!--团队信息结束-->

            <el-row style="margin-top:40px;margin-bottom:30px;">
              <span style="font-size: 23px;font-weight: 900;">主页</span>
            </el-row>

            <!-- <el-row style="margin-top:40px;margin-bottom: 30px;">
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
            </el-row> -->

            <!-- <el-tabs v-model="activeTab"> -->
            <!-- <el-tab-pane label="团队项目" name="tab1"> -->
            <!--项目部分-->
            <div style="margin-top:20px">
              <el-row style="margin-top:40px;margin-bottom: 30px;">
                <span style="font-size:large;font-weight: 500;" @click="projectShow = false">
                  项目（{{ projectNum }}）
                </span>
              </el-row>
              <!--项目封面图-->
              <!--如果有项目-->
              <el-row v-if="projectNum">
                <div class="designBlock" v-for="(projectItem, index) in projectList" :key="index">
                  <div style="width:100%">
                    <img @click="jumpToProject(projectItem.id)" class="round designImg" src="@/assets/projectImage.png"
                      style="width:90%;height:150px" />
                  </div>
                  <div style="display:flex;justify-content: space-between;width:90%">
                    <span class="designName" style="padding-left:4px;display: flex;">
                      {{ projectItem.name }}
                    </span>
                    <span class="rightContent">

                      <el-popover placement="bottom" :width="100" trigger="click">
                        <template #reference>
                          <el-icon>
                            <More />
                          </el-icon>
                        </template>
                        <div @mouseover="highlightRow(1)" @mouseleave="resetRow(1)"
                          :class="{ 'highlighted-row': highlightedIndex === 1 }" class="in-center round-choice"
                          style="margin-bottom:6px;padding: 3px 0 3px 5px;" @click="jumpToProject(projectItem.id)">
                          <el-icon style="margin-right:3px;">
                            <FolderOpened />
                          </el-icon>打开
                        </div>
                        <div @mouseover="highlightRow(2)" @mouseleave="resetRow(2)"
                          :class="{ 'highlighted-row': highlightedIndex === 2 }" class="in-center round-choice"
                          style="margin-bottom:6px;padding: 3px 0 3px 5px;" @click="renameProjectDialog = true"><el-icon
                            style="margin-right:3px;">
                            <EditPen />
                          </el-icon>重命名</div>
                        <div @mouseover="highlightRow(3)" @mouseleave="resetRow(3)"
                          :class="{ 'highlighted-row': highlightedIndex === 3 }" class="in-center round-choice"
                          style="margin-bottom:6px;padding: 3px 0 3px 5px;" @click="deleteProject(index, projectItem.id)">
                          <el-icon style="margin-right:3px;">
                            <FolderDelete />
                          </el-icon>删除
                        </div>

                        <el-dialog v-model="renameProjectDialog" title="重命名项目" width="20%" center>
                          <el-input v-model="renameProjectInput" placeholder="请输入项目名称" />
                          <template #footer>
                            <span class="dialog-footer">
                              <el-button type="primary" @click="renameProject(index, projectItem.id)">
                                确认
                              </el-button>
                            </span>
                          </template>
                        </el-dialog>
                      </el-popover>
                    </span>

                    <!-- <el-dialog v-model="renameProjectDialog" title="重命名项目" width="20%" center>
                      <el-input v-model="renameProjectInput" placeholder="请输入项目名称" />
                      <template #footer>
                        <span class="dialog-footer">
                          <el-button type="primary" @click="renameProject(index, projectItem.id)">
                            确认
                          </el-button>
                        </span>
                      </template>
                    </el-dialog> -->
                  </div>
                </div>
              </el-row>
              <!--如果没有项目-->
              <el-row v-else>
                <!-- <img class="round" src="@/assets/noFile.png" style="width: 100%;" /> -->
                <el-empty description="该团队暂无项目，快来新建吧" style="width: 100%;">
                  <el-button type="primary" plain @click="createNewProject()">新建项目</el-button>
                </el-empty>
              </el-row>
            </div>

            <!-- </el-tab-pane> -->

            <!-- <el-tab-pane label="团队设置" name="tab2"-->
            <!--昵称-->
            <!-- <div style="width:80%;margin-left: 10%;">
                  <el-row style="display: flex;align-items: center;justify-content: space-between;">
                    <div class="leftContent" style="display: flex;justify-content:flex-start">
                      <div>
                        <div class="hintText" style="text-align: left;margin-bottom: 5px;">团队名称</div>
                        <div style="text-align: left;">xx用户名</div>
                      </div>
                    </div>
                    <el-button link type="primary" size="small" style="justify-content: flex-end;"
                      @click="nickNameConfig = true">修改用户名</el-button>
                  </el-row>
                  <el-divider />
                </div>
              </el-tab-pane>
            </el-tabs> -->
            <!--********结束-->
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
import { useRoute } from 'vue-router';
import { onMounted } from 'vue'
import { authStore } from "../store/index.js"
import { reactive, toRefs } from 'vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import GuideAside from '@/components/GuideAside.vue'
import Header from '@/components/Header.vue'
import { UploadProps, UploadUserFile } from 'element-plus'
import Clipboard from 'clipboard';
import {
  Menu as IconMenu,
  ArrowDown,
  ArrowRight,
  Plus,
  EditPen,
  FolderDelete,
  FolderOpened,
  HomeFilled,
  DeleteFilled,
  Grid,
} from '@element-plus/icons-vue'
const route = useRoute()

//变量
const activeTab = ref('tab1'); // 设置默认激活的标签页
const highlightedIndex = ref(-1);

const newProjectDialog = ref(false)
const newProjectNameInput = ref('');
const renameProjectDialog = ref(false);
const renameProjectInput = ref('');
/*邀请成员*/
const inviteLink = ref('');


/*侧栏导航栏*/
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}


/*跳转对应页*/
const jumpToProject = (id) => {
  //this.$router.push('/video/'+id);
  const path_url = '/project/' + id;
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

const projectNum = ref('');
const projectList = ref([]);

onMounted(() => {
  fetchNowTeam();
  fetchProjectData();
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
        nowTeam.createTime = response.data.team.created_at;
        nowTeam.creator = response.data.team.creator;
        nowTeam.role_string = response.data.team.role_string;
        if ((nowTeam.role_string === 'CR' || nowTeam.role_string === 'MG') && nowTeam.name != "个人空间") {
          getInviteLink();
        }
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

const fetchProjectData = () => {
  let Headers = { 'Authorization': authStore().token };

  axios.get('http://www.aamofe.top/api/team/all_projects/', { headers: Headers })
    .then((response) => {
      console.log(response);

      if (response.data.errno == 0) {  //所有团队信息
        response.data.projects.forEach((project, index) => {
          projectList.value.push(project);/*【这样写】*/
        })
        // console.log(projectList.value);

        projectNum.value = response.data.projects.length;
        // console.log(response.data.projects.length)
        // console.log(projectNum);
        return;
      }
      else {
        ElMessage.warning(response.data.msg);
      }
    }).catch(error => {
      console.log(error);
    })
}

//创建新项目
const createNewProject = () => {
  if (!(newProjectNameInput.value)) {
    console.log('不能为空');
    ElMessage.warning('请输入名称');
    return;
  }

  axios.post('http://www.aamofe.top/api/team/create_project/' + nowTeam.teamId + '/', qs.stringify({
    project_name: newProjectNameInput.value
  }), {
    headers: {
      Authorization: authStore().token
    }
  })
    .then(res => {
      // 处理响应数据
      console.log(res);

      if (res.data.errno == 0)//成功
      {
        ElMessage.success(res.data.msg);
        newProjectDialog.value = false;
        projectList.value.push({ "id": res.data.project.id, "name": newProjectNameInput.value })
        projectNum.value++;
        newProjectNameInput.value = '';
        // window.location.reload();
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

const renameProject = (index, projectId) => {
  if (!(renameProjectInput.value)) {
    console.log('不能为空');
    ElMessage.warning('请输入名称');
    return;
  }
  axios.post('http://www.aamofe.top/api/team/rename_project/', qs.stringify({
    name: renameProjectInput.value, project_id: projectId
  }), {
    headers: {
      Authorization: authStore().token
    }
  })
    .then(res => {
      // 处理响应数据
      console.log(res);

      if (res.data.errno == 0)//成功
      {
        ElMessage.success(res.data.msg);
        renameProjectDialog.value = false;
        projectList.value[index] = { "name": renameProjectInput.value, "id": projectId };
        renameProjectInput.value = '';
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

const deleteProject = (index, projectId) => {
  console.log(projectId);
  axios.post('http://www.aamofe.top/api/team/delete_one_project/', qs.stringify({ project_id: projectId }), {
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
        // console.log(index);
        let i = 0;
        for (i = 0; i < projectList.value.length - 1; i++) {
          if (i >= index) {
            // console.log(i);
            projectList.value[i] = projectList.value[i + 1];
          }
        }
        projectList.value.pop();
        // console.log(projectList.value);
        projectNum--;
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

const copyLink = () => {
  console.log("can u see me")

  navigator.clipboard.writeText(inviteLink.value)

  // popper.value.hide()
  // console.log(popper.value)

  ElNotification({
    title: 'Success',
    message: '复制成功',
    type: 'success',
    duration: 1000
  })

  // // 创建 Clipboard 实例，指定要复制的文本
  // const clipboard = new Clipboard('.copy-button', {
  //   text: () => inviteLink.value,
  // });
  //
  // // 复制成功时的处理
  // clipboard.on('success', (e) => {
  //   console.log('复制成功', e);
  //   e.clearSelection(); // 清除选中状态
  //   clipboard.destroy(); // 销毁 clipboard 实例
  // });
  //
  // // 复制失败时的处理
  // clipboard.on('error', (e) => {
  //   console.error('复制失败', e);
  //   clipboard.destroy(); // 销毁 clipboard 实例
  // });
  //
  // // 触发点击事件，开始复制
  // clipboard.onClick({
  //   // 触发点击事件的元素，这里使用按钮
  //   delegateTarget: () => $refs.copyButton,
  // });
}

const highlightRow = (index) => {
  highlightedIndex.value = index;
};

const resetRow = (index) => {
  highlightedIndex.value = -1;
};
</script>

<style scoped>
.in-center {
  display: flex;
  align-items: center;
}

.highlighted-row {
  background-color: rgb(237, 237, 237);
}

.round-choice {
  border-radius: 5px;
}

.hintText {
  color: gray;
  font-size: small;
  font-weight: 600;
}

.designBlock {
  width: 18%;
  margin-bottom: 40px;
  margin-right: 14px;
  text-align: left;
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

.link-block {
  border: 2px solid #d0dcdc9a;
  border-radius: 10px;
  padding: 10px 0 10px 0;
  box-shadow: 0 .5px 0 .5px#e7f6f69a;

  background-color: #f3f1f1fe;
}

.link-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
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
