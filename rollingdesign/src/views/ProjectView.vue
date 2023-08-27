<template>
  <!--项目页：id-->
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
          <Header></Header>
        </el-header>

        <el-divider />
        <!--顶部结束-->
        <!--主页面，不同的地方-->
        <el-main>
          <div class="page" style="width:98%;margin-left: 1%;">
            <!--团队信息-->
            <el-row class="block" style="display: flex;align-items: center;">
              <!-- <el-avatar shape="square" :size="50" :src="squareUrl" style="margin-right:20px" /> -->
              <span style="font-size:larger;font-weight: 800;">{{ nowTeam.name }}</span>

              <div style="display: flex;flex: 1;justify-content: flex-end;">
                <el-button type="primary" @click="designDialogVisible = true">新建原型</el-button>
                <el-button type="primary" @click="newDoc()">新建文档</el-button>
                <!--如果是管理员有“邀请”这一项，判断登陆者在该团队中的身份-->
                <el-button type="primary" @click="centerDialogVisible = true">邀请成员</el-button>
              </div>
            </el-row>

            <el-dialog v-model="designDialogVisible" title="新建原型" width="26%" center>
              <span>
                <!--输入信息，查找-->
                <el-input v-model="designNameInput" placeholder="请输入原型名字" />
                <!--通过链接-->
              </span>
              <template #footer>
                <span class="dialog-footer">
                  <el-button type="primary" @click="newDesign();">
                    确认
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

            <el-row style="margin-top:40px;margin-bottom: 30px;">
              <span style="font-size:large;font-weight: 500;">{{ nowProject.name }}</span>
            </el-row>

            <!--原型部分-->
            <!--展开状态（此为默认状态）-->
            <div v-if="designShow">
              <el-row style="margin-top:40px;margin-bottom: 30px;">
                <span style="font-size:large;font-weight: 500;">
                  <el-icon @click="designShow = false">
                    <CaretBottom />
                  </el-icon>原型
                </span>
              </el-row>

              <!--原型封面图-->
              <!--如果有原型-->
              <el-row v-if="nowProject.designNum">
                <div class="designBlock" v-for="(item, index) in designList" :key="index">
                  <div style="width:100%">
                    <img @click="jumpToDesign(item.id)" class="round designImg" src="@/assets/projectImage.png" style="width:90%;height:150px" />
                  </div>
                  <div style="display:flex;justify-content: space-between;width:90%">
                    <span class="designName" style="padding-left:4px;display: flex;">
                      {{ item.title }}
                    </span>
                    <!-- <span class="rightContent">
                      <el-icon >
                        <More />
                      </el-icon>
                    </span> -->
                  </div>

                </div>
              </el-row>
              <!--如果没有原型-->
              <el-row v-else>
                <img class="round" src="@/assets/noFile.png" style="width: 100%;" />
              </el-row>
            </div>
            <!--如果被折叠-->
            <div v-else>
              <el-row style="margin-top:40px;margin-bottom: 30px;">
                <span style="font-size:large;font-weight: 500;" @click="designShow = true">
                  <el-icon>
                    <CaretRight />
                  </el-icon>原型
                </span>
              </el-row>
            </div>

            <!--文档部分-->
            <!--展开状态（此为默认状态）-->
            <div v-if="fileShow">
              <el-row style="margin-top:40px;margin-bottom: 30px;">
                <span style="font-size:large;font-weight: 500;">
                  <el-icon @click="fileShow = false">
                    <CaretBottom />
                  </el-icon>文档
                </span>
              </el-row>
              <!--原型封面图-->
              <!--如果有原型-->
              <el-row v-if="nowProject.projectNum">
                <div class="designBlock" v-for="(item, index) in docList" :key="index">
                  <div style="width:100%">
                    <img class="round designImg" src="@/assets/projectImage.png" style="width:90%;height:150px" />
                  </div>
                  <div style="display:flex;justify-content: space-between;width:90%">
                    <span class="designName" style="padding-left:4px;display: flex;">
                      {{ item.tiele }}
                    </span>
                    <span class="rightContent">
                      <el-icon ref="docMoreOp" v-click-outside="docOpOut">
                        <More />
                      </el-icon>
                    </span>
                  </div>

                  <el-popover ref="decPopoverOp" :virtual-ref="docMoreOp" trigger="click" title="With title"
                    virtual-triggering>
                    <span> Some content </span>
                  </el-popover>

                </div>
              </el-row>
              <!--如果没有文档-->
              <el-row v-else>
                <img class="round" src="@/assets/noFile.png" style="width: 100%;" />
              </el-row>
            </div>
            <!--如果被折叠-->
            <div v-else>
              <el-row style="margin-top:40px;margin-bottom: 30px;">
                <span style="font-size:large;font-weight: 500;" @click="fileShow = true">
                  <el-icon>
                    <CaretRight />
                  </el-icon>文档
                </span>
              </el-row>
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
import { useRoute } from 'vue-router';
const route = useRoute()
import GuideAside from '@/components/GuideAside.vue'
import Header from '@/components/Header.vue'
import { authStore } from "../store/index.js"
import Clipboard from 'clipboard';
import { ClickOutside as vClickOutside } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadProps, UploadUserFile } from 'element-plus'
import {
  CaretBottom,
  CaretRight,
  MoreFilled,
  More,
} from '@element-plus/icons-vue'
/*侧栏*/

/*新建团队*/
const addTeamVisible = ref(false)
const addTeamNameInput = ref('')
const addTeamIntroductionInput = ref('')
/*上传团队标志*/
const imageUrl = ref('')
const designDialogVisible=ref(false);
const designNameInput=ref('')
/*头像*/
import { reactive, toRefs } from 'vue'
import router from '@/router';

/*侧栏导航栏*/
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}

/*跳转对应页*/
const jumpToDesign = (id) => {
  //this.$router.push('/video/'+video_id);
  const path_url = '/design/' + id;
  window.open(path_url, '_self');
}
/*侧栏导航栏结束*/

/*邀请成员*/
// import { ref } from 'vue'
const centerDialogVisible = ref(false) /*邀请对话框*/
const input = ref('')/*邀请成员时，输入框*/

/*main*/
const designShow = ref(true)
const items = ref(['Item 1', 'Item 2', 'Item 3', 'Item 3', 'Item 5', 'Item 6'])
const designNum = ref(5)//该项目中原型的数量

const fileShow = ref(true)
const fileNum = ref(0)//该项目中原型的数量

/*文件操作下拉气泡*/
const designMoreOp = ref()
const designPopoverOp = ref()
const designOpOut = () => {
  unref(designPopoverOp).popperRef?.delayHide?.()
}

const fileMoreOp = ref()
const filePopoverOp = ref()
const fileOpOut = () => {
  unref(filePopoverOp).popperRef?.delayHide?.()
}

const nowTeam = reactive({
  teamId: '',
  name: '',
  logo: '',
  createTime: '',
  creator: '',
  // des: '',
  // projectNum: '',
  // memberNum:'',
})
const fetchNowTeam = () => {
  let Headers = { 'Authorization': authStore().token };
  console.log(Headers);
  // console.log(authStore().userId)

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

//单个项目
const nowProject = reactive({
  projectId: '',
  name: '',
  docNum: '',
  designNum: '',
})
const fetchNowProject = () => {
  let Headers = { 'Authorization': authStore().token };
  console.log(Headers);
  // console.log(authStore().userId)

  axios.get('http://www.aamofe.top/api/team/get_one_project/', { params: { project_id: route.params.id }, headers: Headers })
    .then((response) => {
      console.log(response);

      if (response.data.errno == 0) {  //获取成功“我”的身份信息
        nowProject.projectId = response.data.project.id;
        nowProject.name = response.data.project.name;
        nowProject.docNum = response.data.project.document_num;
        nowProject.designNum = response.data.project.prototype_num;
        // nowTeam. = response.data.team.team_num;

        console.log(nowProject);
        return;
      }
      else {
        ElMessage.warning(response.data.msg);
      }
    }).catch(error => {
      console.log(error);
    })

}

//
//设计
const designList = ref([]);
const fetchDesignListData = () => {
  let Headers = { 'Authorization': authStore().token };
  axios.get('http://www.aamofe.top/api/document/all_prototype/' + route.params.id + '/', { headers: Headers })
    .then((response) => {
      console.log(response);

      if (response.data.errno == 0) {  //所有团队信息
        response.data.prototype.forEach((design, index) => {
          //op字段为当前登录者可以对该
          // if()
          designList.value.push(design);/*【这样写】*/
        })
        // designNum=response.data.prototype.
        console.log(designList.value);//memberList.value是一个数组。用的时候可以直接foeEach memberList
      }
      else {
        ElMessage.warning(response.data.msg);
      }
    }).catch(error => {
      console.log(error);
    })
}

//文档
const docList = ref([]);
const fetchDocListData = () => {
  let Headers = { 'Authorization': authStore().token };
  axios.get('http://www.aamofe.top/api/document/all_prototype/' + route.params.id + '/', { headers: Headers })
    .then((response) => {
      console.log(response);

      if (response.data.errno == 0) {  //所有团队信息
        response.data.documents.forEach((doc, index) => {
          //op字段为当前登录者可以对该
          // if()
          docList.value.push(doc);/*【这样写】*/
        })
        console.log(docList.value);//memberList.value是一个数组。用的时候可以直接foeEach memberList
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
  fetchNowProject();
  fetchDesignListData();
  fetchDocListData();
  console.log();
})


const newDesign=()=>{
  if (!(designInput)) {
    console.log('不能为空');
    ElMessage.warning('请输入名称');
    return;
  }

  let formData = new FormData();
  formData.append("team_name", addTeamIntroductionInput.value);
  formData.append("Authorization", authStore().token);

  axios.post('http://www.aamofe.top/api/document/create_prototype/'+nowProject.projectId+'/', qs.stringify({
    title: designNameInput.value
  }),{
    headers:{
      Authorization:authStore().token
    }
  })
    .then(res => {
      // 处理响应数据
      console.log(formData);
      console.log(res);

      if (res.data.errno == 0)//成功
      {
        ElMessage.success(res.data.msg);
        designDialogVisible = false;
        designNameInput = '';
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

const newDoc=()=>{
  // if (!(designInput)) {
  //   console.log('不能为空');
  //   ElMessage.warning('请输入名称');
  //   return;
  // }

  let formData = new FormData();
  formData.append("team_name", addTeamIntroductionInput.value);
  formData.append("Authorization", authStore().token);

  axios.post('http://www.aamofe.top/api/document/create_document/'+nowProject.projectId+'/', qs.stringify(
    // {title: designNameInput.value}
    ),
    {
    headers:{
      Authorization:authStore().token
    }
  })
    .then(res => {
      // 处理响应数据
      console.log(formData);
      console.log(res);

      if (res.data.errno == 0)//成功
      {
        ElMessage.success(res.data.msg);
        // designDialogVisible = false;
        // designNameInput = '';
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

.rightContent {
  display: flex;
  text-align: right;
  justify-content: end;
}

.borderBlock {
  /* border: 1px solid rgba(176, 170, 170, 0.703);
  border-radius: 4px; */
  border: 2px solid #d0dcdc9a;
  border-radius: 10px;
  padding: 10px 0 10px 0;
  box-shadow: 0 .5px 0 .5px#e7f6f69a;
}

.round {
  border-radius: 10px;
  /* 设置边框圆角半径，根据需要调整 */
}

.designImg {
  margin-bottom: 5px;
}

.popover-customer {
  background-color: #0084ff !important;
  /* 设置背景颜色 */
}

.designBlock {
  width: 18%;
  margin-bottom: 40px;
  margin-right: 14px;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
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