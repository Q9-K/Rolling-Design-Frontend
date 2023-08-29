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

              <div v-if="roleOperation == 'all' || roleOperation == 'admin'"
                style="display: flex;flex: 1;justify-content: flex-end;">
                <!--如果是管理员有“邀请”这一项，判断登陆者在该团队中的身份-->
                <el-button type="primary" @click="centerDialogVisible = true">邀请成员</el-button>
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
              <el-table :data="memberList" style="width: 90%">
                <el-table-column prop="nickname" label="昵称" width="400">
                  <template #default="scope">
                    <span class="in-center" style="height:58px">
                      <el-avatar :size="50" :src="scope.row.avatar_url" style="margin-right: 8px;"/>
                      {{ scope.row.nickname }}
                      <el-tag v-if="scope.row.id == authStore().userId" size="small" style="margin-left: 10px;">我</el-tag>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="username" label="真实姓名" width="300" />
                <el-table-column prop="email" label="邮箱" width="400" />
                <!-- <el-table-column prop="role" label="身份" /> -->

                <el-table-column label="身份">
                  <template #default="scope">
                    {{ scope.row.role }}

                    <!--如果该栏是创建者 或者 目前登录者身份是普通成员，就什么都做不了-->
                    <span v-if="scope.row.role_string === 'CR' || roleOperation === 'formal'">
                    </span>
                    <!--到这，说明该栏肯定不是创建者 目前登录者身份也不是普通成员-->
                    <!--目前登录者身份是创建者-->
                    <span v-else-if="roleOperation === 'all'">
                      <!--判断该栏人员的身份-->
                      <el-popover effect="light" trigger="click" placement="bottom" width="auto">
                        <template #default>
                          <!--当前这一栏是什么-->
                          <div @click="updateRole(scope.row.id, 'MG')" @mouseover="highlightRow(1)"
                            @mouseleave="resetRow(1)" :class="{ 'highlighted-row': highlightedIndex === 1 }"
                            class="in-center round-choice">管理员
                            <span v-if="scope.row.role_string === 'MG'">
                              <el-icon style="margin-left:3px;"><Select /></el-icon></span>
                          </div>
                          <div @mouseover="highlightRow(2)" @mouseleave="resetRow(2)"
                            :class="{ 'highlighted-row': highlightedIndex === 2 }" @click="updateRole(scope.row.id, 'MB')"
                            class="in-center round-choice">协作者<span v-if="scope.row.role_string === 'MB'"><el-icon
                                style="margin-left:3px;"><Select /></el-icon></span></div>
                          <div class="my-divider"></div>
                          <div @mouseover="highlightRow(3)" @mouseleave="resetRow(3)"
                            :class="{ 'highlighted-row': highlightedIndex === 3 }" @click="updateRole(scope.row.id, 'DE')"
                            class="in-center round-choice">移除成员<el-icon style="margin-left:3px;">
                              <DeleteFilled />
                            </el-icon></div>
                        </template>
                        <template #reference>
                          <el-icon>
                            <ArrowDown />
                          </el-icon>
                        </template>
                      </el-popover>
                    </span>
                    <!--目前登录者身份是管理员-->
                    <span v-else-if="roleOperation === 'admin'">
                      <!--当前登录者为管理员 且 该栏为普通成员-->
                      <el-popover v-if="scope.row.role_string === 'MB'" effect="light" trigger="click" placement="bottom"
                        width="auto">
                        <template #default>
                          <div @mouseover="highlightRow(1)" @mouseleave="resetRow(1)"
                            :class="{ 'highlighted-row': highlightedIndex === 1 }" @click="updateRole(scope.row.id, 'MG')"
                            class="in-center round-choice"> <span>管理员</span>
                          </div>
                          <div @mouseover="highlightRow(2)" @mouseleave="resetRow(2)"
                            :class="{ 'highlighted-row': highlightedIndex === 2 }" class="in-center round-choice">协作者
                            <span>
                              <el-icon style="margin-left:3px;"><Select /></el-icon></span>
                          </div>

                          <div class="my-divider"></div>
                          <div @mouseover="highlightRow(3)" @mouseleave="resetRow(3)"
                            :class="{ 'highlighted-row': highlightedIndex === 3 }" @click="updateRole(scope.row.id, 'DE')"
                            class="in-center round-choice">移除成员
                            <el-icon style="margin-left:3px;">
                              <DeleteFilled />
                            </el-icon>
                          </div>
                        </template>
                        <template #reference>
                          <el-icon>
                            <ArrowDown />
                          </el-icon>
                        </template>
                      </el-popover>

                    </span>

                  </template>
                </el-table-column>
              </el-table>

            </div>


                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import qs from 'qs'
import GuideAside from '@/components/GuideAside.vue'
import Header from '@/components/Header.vue'
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
import InviteMemberButton from "@/components/InviteMemberButton.vue";
const route = useRoute()
const highlightedIndex = ref(-1);

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
      // console.log(response);

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

        // console.log(nowTeam.roleString);
        if (nowTeam.roleString === "CR") {
          roleOperation = "all";
        }
        else if (nowTeam.roleString === "MG") { //管理员
          roleOperation = "admin";
        }
        else if (nowTeam.roleString === "MB") { //普通成员
          roleOperation = "formal";
        }
        // console.log('roleOperation' + roleOperation);
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
  axios.post('http://www.aamofe.top/api/team/update_permisson/' + nowTeam.teamId + '/',
    qs.stringify({ choice: newRole, user_id: user_id }), { headers: { Authorization: authStore().token } })
    .then(response => {
      console.log(response);

      if (response.data.errno == 0) {
        let Headers = { 'Authorization': authStore().token };
        axios.get('http://www.aamofe.top/api/team/all_members/', { headers: Headers })
          .then((response) => {
            console.log(response);

            if (response.data.errno == 0) {  //所有团队信息
              memberList.value = [];//!!!
              response.data.members.forEach((member, index) => {
                memberList.value.push(member);/*【这样写】*/
                return;
              })
              console.log(memberList.value);//memberList.value是一个数组。用的时候可以直接foeEach memberList
            }
            else {
                /*投诉不成功，对话框不关闭*/
                ElMessage.warning(response.data.msg);/*弹窗显示报错*/
                return;
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
    });
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

.el-table {
  border: none; /* 隐藏表格的所有边框，包括横向分割线 */
}

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
.round {
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

.creator-row {
  background-color: #ffcccc;
  /* 设置背景色为红色 */
}

.admin-row {
  background-color: #ccffcc;
  /* 设置背景色为绿色 */
}

.form-row {
  background-color: #ccffcc;
  /* 设置背景色为绿色 */
}</style>
