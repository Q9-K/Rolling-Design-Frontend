<template>
    <div class="common-layout">
        <el-container>
            <!--侧边-->
            <el-aside width="15%">
                <!--侧栏-->
                <GuideAside></GuideAside>
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

                        <el-row style="margin-top:0;margin-bottom: 30px;">
                            <span style="font-size:large;font-weight: 500;">团队成员</span>
                        </el-row>

                        <!--团队信息-->
                        <el-row class="block" style="display: flex;align-items: center;margin-bottom: 30px;">
                            <!-- <el-avatar shape="square" :size="50" :src="squareUrl" style="margin-right:20px" /> -->
                            <span style="font-size:larger;font-weight: 800;">{{ nowTeam.name }}</span>

                            <div style="display: flex;flex: 1;justify-content: flex-end;">
                                <!--如果是管理员有“邀请”这一项，判断登陆者在该团队中的身份-->
                                <!--
                                <el-button type="primary" @click="centerDialogVisible = true">邀请成员</el-button>
                                -->
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
                        </el-row>

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



                        <div>
                            <el-table :data="memberList" style="width: 100%">
                                <el-table-column prop="nickname" label="昵称" width="180" />
                                <el-table-column prop="username" label="真实姓名" width="180" />
                                <el-table-column prop="email" label="邮箱" width="300" />
                                <!-- <el-table-column prop="role" label="身份" /> -->

                                <el-table-column label="身份">

                                    <template #default="scope">
                                        <!--如果该栏是创建者 或者 目前登录者身份是普通成员-->
                                        <div v-if="scope.row.role_string === 'CR' || roleOperation === 'formal'">
                                            <span style="color:gray">{{ scope.row.role }}</span>
                                        </div>
                                        <!--到这，说明该栏肯定不是创建者 目前登录者身份也不是普通成员-->
                                        <!--目前登录者身份是创建者-->
                                        <div v-else-if="roleOperation === 'all'">
                                            <!--该栏为管理员-->
                                            <div v-if="scope.row.role_string === 'MR'">
                                                {{ scope.row.role }}
                                            </div>
                                            <!--该栏为普通成员-->
                                            <div v-else-if="scope.row.role_string === 'MB'">
                                                {{ scope.row.role }}
                                            </div>
                                        </div>

                                        <!--目前登录者身份是管理员-->
                                        <div v-else-if="roleOperation === 'admin'">
                                            <div v-if="scope.row.role_string === 'MR'">
                                                <span style="color:gray">{{ scope.row.role }}</span>
                                            </div>
                                            <div v-if="scope.row.role_string === 'MB'">
                                                {{ scope.row.role }}
                                            </div>
                                        </div>



                                        <!--到这，说明该栏肯定不是创建者-->

                                        <!--当前登录者为创建者-->
                                        <el-popover
                                            v-if="(!(scope.row.role_string === 'CR' || roleOperation === 'formal')) && roleOperation === 'all'"
                                            effect="light" trigger="click" placement="bottom" width="auto">
                                            <template #default>
                                                <!--当前这一栏是什么-->
                                                <div @click="updateRole(scope.row.id, 'MR')">管理员<span
                                                        v-if="scope.row.role_string === 'MR'"><el-icon><Select /></el-icon></span>
                                                </div>
                                                <div @click="updateRole(scope.row.id, 'MB')">普通成员<span
                                                        v-if="scope.row.role_string === 'MB'"><el-icon><Select /></el-icon></span>
                                                </div>
                                                <div class="my-divider"></div>
                                                <div @click="updateRole(scope.row.id, 'DE')">移除成员<el-icon>
                                                        <DeleteFilled />
                                                    </el-icon></div>
                                            </template>

                                            <template #reference>
                                                <el-icon>
                                                    <ArrowDown />
                                                </el-icon>
                                            </template>
                                        </el-popover>

                                        <!--当前登录者为管理员 且 该栏为普通成员-->
                                        <el-popover
                                            v-if="(!(scope.row.role_string === 'CR' || roleOperation === 'formal')) && roleOperation === 'admin' && scope.row.role_string === 'MR'"
                                            effect="light" trigger="click" placement="bottom" width="auto">
                                            <template #default>
                                                <div @click="updateRole(scope.row.id, 'MR')"> <span>管理员</span></div>
                                                <div>普通成员<span><el-icon><Select /></el-icon></span></div>
                                                <div class="my-divider"></div>
                                                <div @click="updateRole(scope.row.id, 'DE')">移除成员<el-icon>
                                                        <DeleteFilled />
                                                    </el-icon></div>
                                            </template>

                                            <template #reference>
                                                <el-icon>
                                                    <ArrowDown />
                                                </el-icon>
                                            </template>
                                        </el-popover>

                                    </template>
                                </el-table-column>

                                <!--如果登录者是创建者-->
                                <!-- <el-table-column prop="op" label="操作">
                      <template #default>
                        <el-button link type="primary" size="small">Detail</el-button>
                        <el-button link type="primary" size="small">Edit</el-button>
                      </template>
                    </el-table-column> -->
                            </el-table>

                        </div>


                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
  
<script setup>
import GuideAside from '@/components/GuideAside.vue'
import Header from '@/components/Header.vue'
import ProjectDisplay from '@/components/ProjectDisplay.vue'
import axios from 'axios'
import { ref, unref } from 'vue'
import { ClickOutside as vClickOutside } from 'element-plus'
import { useRoute } from 'vue-router';
import { onMounted } from 'vue'
import { authStore } from "../store/index.js"
import { reactive, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadProps, UploadUserFile } from 'element-plus'
import {
    More,
    ArrowDown,
    Select,
    DeleteFilled
} from '@element-plus/icons-vue'
import { now } from '@vueuse/shared'
const route = useRoute()

/*跳转对应页*/
const jumpTo = (path) => {
    //this.$router.push('/video/'+video_id);
    const path_url = '/' + path;
    window.open(path_url, '_self');
}
/*邀请成员*/
const centerDialogVisible = ref(false) /*邀请对话框*/
const input = ref('')/*邀请成员时，输入框*/

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

const memberList = ref([])//!!!
/*成员列表*/
const tableData = [
    {
        nickName: '哈哈哈哈',
        name: 'Tom',
        email: '11324@qq.com',
        role: '创建者',
        op: '',
    },
    {
        nickName: '哈哈哈哈',
        name: 'Tom',
        email: '11324@qq.com',
        role: '创建者',
        op: '',
    },
]

/*main*/
const nowTeam = reactive({
    teamId: '',
    name: '',
    createTime: '',
    creator: '',
    roleString: '',
})

let roleOperation = ref('');
const fetchData = () => {
    let Headers = { 'Authorization': authStore().token };
    //获取当前团队
    axios.get('http://www.aamofe.top/api/team/get_current_team/', { params: { user_id: authStore().userId }, headers: Headers })
        .then((response) => {
            console.log(response);

            if (response.data.errno == 0) {  //获取信息
                nowTeam.teamId = response.data.team.id;
                nowTeam.name = response.data.team.name;
                nowTeam.createTime = response.data.team.created_at;
                nowTeam.creator = response.data.team.creator;
                nowTeam.role = response.data.team.role;
                nowTeam.roleString = response.data.team.role_string;

                //执行获取团队所有成员
                axios.get('http://www.aamofe.top/api/team/all_members/', { params: { team_id: nowTeam.teamId }, headers: Headers })
                    .then((response) => {
                        console.log(response);

                        if (response.data.errno == 0) {  //所有团队信息
                            response.data.members.forEach((member, index) => {
                                //op字段为当前登录者可以对该
                                // if()

                                memberList.value.push(member);/*【这样写】*/
                                return;
                            })
                            console.log(memberList.value);//memberList.value是一个数组。用的时候可以直接foeEach memberList
                        }
                        else {
                            ElMessage.warning(response.data.msg);
                        }
                    }).catch(error => {
                        console.log(error);
                    })

                console.log(nowTeam.roleString);
                if (nowTeam.roleString === "CR") {
                    roleOperation = "all";
                    // console.log(12);
                }
                else if (nowTeam.roleString === "MR") { //管理员
                    roleOperation = "admin";
                }
                else if (nowTeam.roleString === "MB") { //普通成员
                    roleOperation = "formal";
                }
                console.log('roleOperation' + roleOperation);
            }
            else {
                ElMessage.warning(response.data.msg);
            }
        }).catch(error => {
            console.log(error);
        })
    // console.log('team_id:' + nowTeam.teamId);
}

onMounted(() => {
    fetchData();
})

const updateRole = (user_id, newRole) => {
    let formData = new FormData();
    formData.append("choice", newRole);
    formData.append("user_id", user_id);
    formData.append("Authorization", authStore().token);
    console.log('http://www.aamofe.top/api/team/update_permisson/' + nowTeam.teamId + '/');
    axios.post('http://www.aamofe.top/api/team/update_permisson/' + nowTeam.teamId + '/', formData)
        .then(response => {
            // console.log(formData);
            console.log(response);

            if (response.data.errno == 0) {
                // this.$message.success('投诉视频成功');
                axios.get('http://www.aamofe.top/api/team/all_members/', { params: { team_id: nowTeam.teamId }, headers: Headers })
                    .then((response) => {
                        console.log(response);

                        if (response.data.errno == 0) {  //所有团队信息
                            memberList = ref([]);//!!!
                            response.data.members.forEach((member, index) => {
                                //op字段为当前登录者可以对该
                                // if()

                                memberList.value.push(member);/*【这样写】*/
                                return;
                            })
                            console.log(memberList.value);//memberList.value是一个数组。用的时候可以直接foeEach memberList
                        }
                        else {
                            ElMessage.warning(response.data.msg);
                        }
                    }).catch(error => {
                        console.log(error);
                    })
            }
            else {
                /*投诉不成功，对话框不关闭*/
                ElMessage.warning(response.data.msg);/*弹窗显示报错*/
                return;
            }
        })
        .catch(error => {
            console.log('Error: ' + error);
            ElMessage.warning('发生错误，投诉视频失败');
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

.example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
}

.el-dialog__title {
    font-size: 20px;
    /* 设置字体大小 */
    text-align: left;
    /* 设置文本居中 */
}

.dialog-with-background {
    background: rgba(163, 55, 55, 0.5);
    /* 设置背景颜色，这里是半透明黑色背景 */
}

/*对话框圆角*/
.rounded-dialog {
    border-radius: 10px;
    /* 设置边框圆角半径，根据需要调整 */
}


/*card*/
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.my-divider {
    height: 1px;
    /* 设置横线的高度 */
    background-color: rgb(234, 232, 232);
    /* 设置横线的颜色 */
    margin: 10px 0;
    /* 可选：设置横线上下的间距 */
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