<template>
    <!--侧栏-->
    <div>
        <el-col :span="24"><!--占一整列-->
            <el-menu :default-active="guideIndex" width="100%" style="height:100vh" class="el-menu-vertical-demo side-guide"
                @open="handleOpen" @close="handleClose">
                <!--logo图标-->
                <img alt="web logo" src="@/assets/webLogo.png" style="width:100%;margin-bottom: 10px;">

                <!--团队信息-->
                <div
                    style="background-color:rgb(232, 247, 254);padding-left: 18px;padding-top: 18px;padding-bottom: 18px;margin-bottom: 20px;">
                    <el-row class="block" style="display: flex;justify-content: space-between;align-items: center;">
                        <div style="display: flex;align-items: center;">
                            <!-- <el-avatar shape="square" :size="50" :src="squareUrl" style="margin-right:20px" /> -->
                            <span style="font-size:larger;font-weight: 800;">{{ nowTeam.name }}</span>
                        </div>
                        <el-icon class="el-icon--right" style="margin-right:7%" ref="btnSwiTeam"
                            v-click-outside="teamOutside">
                            <ArrowRight />
                        </el-icon>
                    </el-row>
                </div>

                <!--切换团队-->
                <!-- <el-button width="100px" type="primary" plain ref="btnSwiTeam" v-click-outside="teamOutside">切换团队
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </el-button> -->

                <el-popover ref="popoverTeam" :virtual-ref="btnSwiTeam" trigger="click" title="" virtual-triggering
                    width="300px" placement="left">
                    <div style="margin-left:10px;">
                        <div style="font-weight:900;font-size: 18px;margin-bottom: 15px;">
                            <span>切换团队</span>
                        </div>
                        <div>

                            <!--团队信息-->
                            <div class="block" v-for="(teamItem, index) in teamList" :key="index">
                                <div style="display: flex;flex-direction: row;align-items: center;"
                                    @click="switchToTeam(teamItem.id)">
                                    <!-- <el-avatar shape="square" :size="50" :src="squareUrl" style="" /> -->
                                    <!--昵称和介绍-->
                                    <el-row
                                        style="display: flex;flex-direction: row;justify-items: flex-start;width: 90%;margin-left: 12px;">
                                        <el-col :span="24"
                                            style="text-align: left;font-weight: 600;font-size: 17px;margin-bottom: 5px;">{{
                                                teamItem.name }}</el-col>
                                        <!-- <el-col :span="24" style="text-align: left;color: rgb(80, 79, 79);font-size: 13px;">描述</el-col> -->
                                    </el-row>
                                </div>
                                <!-- <el-divider /> -->
                                <div v-if="index != teamList.length - 2" class="my-divider"></div><!--【】因为多了num-->
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

                    <el-menu-item v-for="(projectItem, index) in projectList" :key="index"
                        :index="'project-' + projectItem.id" @click="jumpToProject(projectItem.id)">{{ projectItem.name
                        }}</el-menu-item>
                    <!-- <el-menu-item index="1-2">项目2</el-menu-item> -->
                </el-sub-menu>

                <!--回收站-->
                <!-- <el-menu-item index="recover" @click="jumpTo('recover')">
            <el-icon>
              <DeleteFilled />
            </el-icon>
            <span>回收站</span>
          </el-menu-item> -->

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
import axios from 'axios'
import { ref, unref, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router';
const route = useRoute()
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
/*侧栏*/
const squareUrl = ref('https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png')

let nowTeam = reactive({
    teamId: '',
    name: '',
    logo: '',
    createTime: '',
    creator: '',
    // des: '',
    // projectNum: '',
    // memberNum:'',
})
let teamList = ref([]);
let projectList = ref([]);
/*切换团队*/
const btnSwiTeam = ref()
const popoverTeam = ref()
const teamOutside = () => {
    unref(popoverTeam).popoverTeam?.delayHide?.()
}

const switchToTeam = async (team_id) => {

    console.log(team_id);
    nowTeam.teamId = team_id
    await nextTick()
    // const router = useRouter()
    location.reload()
    let formData = new FormData();
    formData.append("team_id", team_id);
    console.log(authStore().token);
    formData.append("Authorization", authStore().token);
    // formData.append("Authorization", Authorization: authStore().token);
    axios.post('http://www.aamofe.top/api/team/checkout_team/', qs.stringify(
        {
            team_id: team_id
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
                //重新载入数据
                fetchNowTeam();
                fetchTeamlistData();
                fetchProjectData();

                console.log(teamList.value);
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
// const getNowTeam = (team_id) => {
//   console.log('hhhh' + team_id);
// }
/*新建团队*/
const addTeamVisible = ref(false)
const addTeamNameInput = ref('')
const addTeamIntroductionInput = ref('')

/*侧栏导航栏*/
const handleOpen = (key, keyPath) => {
    // console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
    // console.log(key, keyPath)
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

const fetchTeamlistData = () => {
    let Headers = { 'Authorization': authStore().token };
    teamList = ref([]);

    axios.get('http://www.aamofe.top/api/team/all_teams/', { headers: Headers })
        .then((response) => {
            // console.log(authStore().token)
            // console.log(Headers);
            console.log(response);

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
        }).catch(error => {
            console.log(error);
        })
}

const fetchProjectData = () => {
    let Headers = { 'Authorization': authStore().token };
    projectList = ref([])
    axios.get('http://www.aamofe.top/api/team/all_projects/', { headers: Headers })
        .then((response) => {
            // console.log(authStore().token);
            console.log(response);

            if (response.data.errno == 0) {  //所有团队信息
                response.data.projects.forEach((project, index) => {
                    projectList.value.push(project);/*【这样写】*/
                    return;
                })
                // console.log(projectList.value);
            }
            else {
                ElMessage.warning(response.data.msg);
            }
        }).catch(error => {
            console.log(error);
        })
}

const fetchNowTeam = () => {
    let Headers = { 'Authorization': authStore().token };
    console.log(Headers);
    // console.log(authStore().userId)

    nowTeam = reactive({
        teamId: '',
        name: '',
        logo: '',
        createTime: '',
        creator: '',
        // des: '',
        // projectNum: '',
        // memberNum:'',
    })

    axios.get('http://www.aamofe.top/api/team/get_current_team/', { params: { user_id: authStore().userId }, headers: Headers })
        .then((response) => {
            console.log(response);

            if (response.data.errno == 0) {  //获取成功“我”的身份信息
                nowTeam.teamId = response.data.team.id;
                nowTeam.name = response.data.team.name;
                nowTeam.createTime = response.data.team.created_at;
                nowTeam.creator = response.data.team.creator;
                // nowTeam. = response.data.team.team_num;
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
    fetchTeamlistData();
    fetchProjectData();
    highLight();
})



const guideIndex = ref();//侧栏导航高亮标识！！！
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
/*侧栏导航栏结束*/

/*邀请成员*/
// import { ref } from 'vue'
const centerDialogVisible = ref(false) /*邀请对话框*/
const input = ref('')/*邀请成员时，输入框*/

//
const buildNewTeam = () => {

    if (!(addTeamIntroductionInput)) {
        console.log('不能为空');
        ElMessage.warning('请输入团队名称');
        return;
    }

    let formData = new FormData();
    formData.append("team_name", addTeamIntroductionInput.value);
    formData.append("Authorization", authStore().token);
    console.log(222, addTeamNameInput.value)
    axios.post('http://www.aamofe.top/api/team/create_team/', qs.stringify({
        team_name: addTeamNameInput.value
    }), {
        headers: {
            Authorization: authStore().token
        }
    })
        .then(res => {
            // 处理响应数据
            console.log(formData);
            console.log(res);

            if (res.data.errno == 0)//成功
            {
                ElMessage.success(res.data.msg);
                addTeamVisible.value = false;
                addTeamIntroductionInput.value = '';
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
