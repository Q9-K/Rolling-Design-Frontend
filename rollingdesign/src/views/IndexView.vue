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

                            <el-col :span="8">
                                <div style="display: flex;flex:1;justify-content: flex-end;">
                                    <el-button type="primary" @click="newProjectDialog = true">新建项目</el-button>

                                    <!--如果是管理员有“邀请”这一项，判断登陆者在该团队中的身份-->
                                    <el-popover :width="300" trigger="click" ref='popper'
                                        popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;">
                                        <template #reference>
                                            <el-button type="primary" @click="generateLink()">邀请成员</el-button>
                                            <!-- <el-avatar src="https://avatars.githubusercontent.com/u/72015883?v=4" /> -->
                                        </template>
                                        <template #default>
                                            <div disabled style="text-align: center;">
                                                <el-input v-model="link" disabled></el-input>
                                                <div style="color: #d2d3d7;text-align: left;
                            margin-top: 20px;">该链接将在<span style="font-weight: 700;">24小时</span>内过期
                                                </div>
                                            </div>
                                            <button @click="copyLink" class="copyLink"
                                                style="text-align: center; 
                            background-color: #3671ff;
                            outline: none;
                        margin-left:auto; margin-right: auto; margin-top: 15px; padding: 10px; box-sizing: content-box;">复制链接</button>
                                        </template>
                                    </el-popover>
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

                        <el-row style="margin-top:40px;margin-bottom:30px;">
                            <span style="font-size: 23px;font-weight: 900;">主页</span>
                        </el-row>

                        <!-- <div class="draftFiles" style="margin-top:20px">
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
              </div> -->

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
                            <!-- <ProjectDisplay /> -->
                            <el-row style="margin-top:40px;margin-bottom: 30px;">
                                <span style="font-size:large;font-weight: 500;" @click="projectShow = false">
                                    项目
                                </span>
                            </el-row>
                            <!--项目封面图-->
                            <!--如果有项目-->
                            <el-row v-if="projectNum">
                                <div class="designBlock" v-for="(projectItem, index) in projectList" :key="index">
                                    <div style="width:100%">
                                        <img @click="jumpToProject(projectItem.id)" class="round designImg"
                                            src="@/assets/projectImage.png" style="width:90%;height:150px" />
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
                                                <div sytle="margin-bottom:10px" @click="renameProject(projectItem.id)">重命名
                                                </div>
                                                <div @click="deleteProject(projectItem.id)">删除</div>
                                            </el-popover>
                                        </span>

                                        <el-dialog v-model="renameProjectDialog" title="重命名项目" width="30%"
                                            :before-close="handleClose">
                                            <el-input v-model="newProjectNameInput" placeholder="请输入项目名称" />
                                            <template #footer>
                                                <span class="dialog-footer">
                                                    <el-button type="primary" @click="renameProject(projectItem.id)">
                                                        确认
                                                    </el-button>
                                                </span>
                                            </template>
                                        </el-dialog>
                                    </div>
                                </div>
                            </el-row>
                            <!--如果没有项目-->
                            <el-row v-else>
                                <img class="round" src="@/assets/noFile.png" style="width: 100%;" />
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
const route = useRoute()
import { onMounted } from 'vue'
import { authStore } from "../store/index.js"
import { reactive, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import GuideAside from '@/components/GuideAside.vue'
import Header from '@/components/Header.vue'
import { UploadProps, UploadUserFile } from 'element-plus'
import { ElNotification } from 'element-plus'

/*侧栏*/
const activeTab = ref('tab1'); // 设置默认激活的标签页




/*进入账户设置*/
const personMsgDialog = ref(false)
const nickNameConfig = ref(false)
const nickNameConfigInput = ref('')
const avatarConfig = ref(false)
const pwdConfig = ref(false)
const pwdConfigTitle = ref('修改密码')
const pwdConfigInput = ref('')
const pwdSureInput = ref('')

const copyLink = () => {
    navigator.clipboard.writeText(link.value)

    // popper.value.hide()
    // console.log(popper.value)

    ElNotification({
        title: 'Success',
        message: '复制成功',
        type: 'success',
        duration: 1000
    })
}

const handleRemove = (file, uploadFiles) => {
    console.log(file, uploadFiles)
}

const handlePreview = (uploadFile) => {
    console.log(uploadFile)
}
const renameProjectDialog = ref(false);
const renameProjectInput = ref('');
const renameProject = (projectId) => {
    if (!(renameProjectInput)) {
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

// deleteProject

const link = ref('')
const generateLink = async () => {

    let Headers = { 'Authorization': authStore().token }

    let res = await axios.get('http://www.aamofe.top/api/team/get_invitation/', {
        headers: Headers,
        params: {
            team_id: nowTeam.teamId,
        }
    })
    console.log(res.data)
    link.value = res.data.invatation
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
const jumpToProject = (id) => {
    //this.$router.push('/video/'+id);
    const path_url = '/project/' + id;
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
    createTime: '',
    creator: '',
})

const projectNum = ref();
const projectList = ref([]);
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
                nowTeam.createTime = response.data.team.created_at;
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
    fetchProjectData();
})

const newProjectDialog = ref(false)
const newProjectNameInput = ref('');
//创建新项目
const createNewProject = () => {
    let Headers = { 'Authorization': authStore().token };
    // axios.post('',)
    //....

    if (!(newProjectNameInput)) {
        console.log('不能为空');
        ElMessage.warning('请输入名称');
        return;
    }

    let formData = new FormData();
    // formData.append("team_name", addTeamIntroductionInput.value);
    formData.append("Authorization", authStore().token);

    axios.post('http://www.aamofe.top/api/team/create_project/' + nowTeam.teamId + '/', qs.stringify({
        project_name: newProjectNameInput.value
    }), {
        headers: {
            Authorization: authStore().token
        }
    })
        .then(res => {
            // 处理响应数据
            // console.log(formData);
            console.log(res.data);

            if (res.data.errno == 1)//成功
            {
                ElMessage.success(res.data.msg);
                newProjectDialog.value = false;
                newProjectNameInput.value = '';
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

const fetchProjectData = () => {
    let Headers = { 'Authorization': authStore().token };

    axios.get('http://www.aamofe.top/api/team/all_projects/', { headers: Headers })
        .then((response) => {
            // console.log(authStore().token);
            console.log(response);

            if (response.data.errno == 0) {  //所有团队信息
                response.data.projects.forEach((project, index) => {
                    projectList.value.push(project);/*【这样写】*/
                })
                console.log(projectList.value);

                projectNum.value = response.data.projects.length;
                console.log(response.data.projects.length)
                // console.log(projectNum);
                // console.log('hhh');
                return;
            }
            else {
                ElMessage.warning(response.data.msg);
            }
        }).catch(error => {
            console.log(error);
        })
}
</script>
  
<style scoped>
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