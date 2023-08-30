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
                <el-button type="primary" @click="newDesign()">新建原型</el-button>
                <el-button type="primary" @click="newDoc()">新建文档</el-button>
                <!--如果是管理员有“邀请”这一项，判断登陆者在该团队中的身份-->
                <el-button type="primary">邀请成员</el-button>
              </div>
            </el-row>
            <!--团队信息结束-->

            <el-row style="margin-top:40px;margin-bottom: 30px;">
              <span style="font-size:large;font-weight: 500;">{{ nowProject.name }}</span>
            </el-row>

            <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
              <el-tab-pane label="原型" name="designs">
                <!--原型部分-->
                <!--展开状态（此为默认状态）-->
                <div v-if="designShow">
                  <el-row style="margin-top:40px;margin-bottom: 30px;">
                    <span style="font-size:large;font-weight: 500;">
                      <el-icon @click="designShow = false">
                        <CaretBottom />
                      </el-icon>原型（{{ nowProject.designNum }}）
                    </span>
                  </el-row>

                  <!--原型封面图-->
                  <!--如果有原型-->
                  <el-row v-if="nowProject.designNum">
                    <div class="designBlock" v-for="(item, index) in designList" :key="index">
                      <div style="width:100%">
                        <img @click="jumpToDesign(item.id)" class="round designImg" src="@/assets/projectImage.png"
                          style="width:90%;height:150px" />
                      </div>
                      <div style="display:flex;justify-content: space-between;width:90%">
                        <span class="designName" style="padding-left:4px;display: flex;">
                          {{ item.title }}
                        </span>
                        <span class="rightContent">
                          <el-icon>
                            <More />
                          </el-icon>
                        </span>
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
                      </el-icon>原型（{{ nowProject.designNum }}）
                    </span>
                  </el-row>
                </div>
              </el-tab-pane>

              <el-tab-pane label="文档" name="documents">
                <!--文档部分-->
                <!--展开状态（此为默认状态）-->
                <div v-if="docShow">
                  <el-row style="margin-top:40px;margin-bottom: 30px;">
                    <span style="font-size:large;font-weight: 500;">
                      <el-icon @click="docShow = false">
                        <CaretBottom />
                      </el-icon>文档（{{ nowProject.docNum }}）
                    </span>
                  </el-row>

                  <!--如果有文档-->
                  <el-row v-if="nowProject.docNum">
                    <div class="designBlock" v-for="(item, index) in docList" :key="index">
                      <div style="width:100%">
                        <img @click="jumpToDoc(item.id)" class="round designImg" src="@/assets/projectImage.png"
                          style="width:90%;height:150px" />
                      </div>
                      <div style="display:flex;justify-content: space-between;width:90%">
                        <span class="designName" style="padding-left:4px;display: flex;" @click="jumpToDoc(item.id)">
                          {{ item.title }}
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
                              style="margin-bottom:6px;padding: 3px 0 3px 5px;" @click="jumpToDoc(item.id)">
                              <el-icon style="margin-right:3px;">
                                <FolderOpened />
                              </el-icon>打开
                            </div>
                            <div @mouseover="highlightRow(2)" @mouseleave="resetRow(2)"
                              :class="{ 'highlighted-row': highlightedIndex === 2 }" class="in-center round-choice"
                              style="margin-bottom:6px;padding: 3px 0 3px 5px;" @click="renameDocDialog = true"><el-icon
                                style="margin-right:3px;">
                                <EditPen />
                              </el-icon>重命名</div>
                            <div @mouseover="highlightRow(3)" @mouseleave="resetRow(3)"
                              :class="{ 'highlighted-row': highlightedIndex === 3 }" class="in-center round-choice"
                              style="margin-bottom:6px;padding: 3px 0 3px 5px;" @click="deleteDoc(item.id)">
                              <el-icon style="margin-right:3px;">
                                <FolderDelete />
                              </el-icon>删除
                            </div>

                            <!--重命名-->
                            <el-dialog v-model="renameDocDialog" title="重命名文档" width="20%" center>
                              <el-input v-model="renameDocInput" placeholder="请输入名称" />
                              <template #footer>
                                <span class="dialog-footer">
                                  <el-button type="primary" @click="renameDoc(index, item.id)">
                                    确认
                                  </el-button>
                                </span>
                              </template>
                            </el-dialog>
                          </el-popover>

                        </span>
                      </div>
                    </div>
                  </el-row>
                  <!--如果没有文档-->
                  <el-row v-else>
                    <!-- <img class="round" src="@/assets/noFile.png" style="width: 100%;" /> -->
                    <el-empty description="该项目暂无文档" style="width: 100%;">
                      <el-button type="primary" plain @click="newDoc()">新建文档</el-button>
                    </el-empty>
                  </el-row>
                </div>
                <!--如果被折叠-->
                <div v-else>
                  <el-row style="margin-top:40px;margin-bottom: 30px;">
                    <span style="font-size:large;font-weight: 500;" @click="docShow = true">
                      <el-icon>
                        <CaretRight />
                      </el-icon>文档（{{ nowProject.docNum }}）
                    </span>
                  </el-row>
                </div>
              </el-tab-pane>
              <el-tab-pane label="最近删除" name="delete">
                Config
              </el-tab-pane>
            </el-tabs>
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
import GuideAside from '@/components/GuideAside.vue'
import Header from '@/components/Header.vue'
import { authStore } from "../store/index.js"
import Clipboard from 'clipboard';
import { ClickOutside as vClickOutside } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadProps, UploadUserFile } from 'element-plus'
import { reactive, toRefs } from 'vue'
import { TabsPaneContext } from 'element-plus'//【】
import router from '@/router';
import {
  CaretBottom,
  CaretRight,
  MoreFilled,
  More,
  EditPen,
  FolderDelete,
  FolderOpened,
} from '@element-plus/icons-vue'
const route = useRoute()
const activeName = ref('designs')

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

const jumpToDoc = (id) => {
  //this.$router.push('/video/'+video_id);
  const path_url = '/doc/' + id;
  window.open(path_url, '_self');
}
const isPopoverVisible = ref(-1);
const highlightedIndex = ref(-1);
/*main*/
const designShow = ref(true)//默认展开
const designList = ref([]);
const renameDesignDialog = ref(false);
const renameDesignInput = ref('');

const docShow = ref(true)//默认展开
const docList = ref([]);
const renameDocDialog = ref(false);
const renameDocBlock = ref([]);//点击其他地方关闭
const renameDocInput = ref([]);

const delDocList = ref([]);
const delDocShow = ref(true);
const delDocNum = ref('');

const delDesignList = ref([]);
const delDesignShow = ref(true);
const delDesignNum = ref('');

const nowTeam = reactive({
  teamId: '',
  name: '',
  logo: '',
  createTime: '',
  creator: '',
  memberNum: '',
  projectNum: '',
  role_string: '',
})

const nowProject = reactive({
  projectId: '',
  name: '',
  docNum: '',
  designNum: '',
})

onMounted(() => {
  fetchNowTeam();
  fetchNowProject();
  fetchDesignListData();
  fetchDocListData();
  // fetchDelDesignListData();
  // fetchDelDocListData();
})

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
const fetchNowProject = () => {
  let Headers = { 'Authorization': authStore().token };

  axios.get('http://www.aamofe.top/api/team/get_one_project/', { params: { project_id: route.params.id }, headers: Headers })
    .then((response) => {
      // console.log(response);

      if (response.data.errno == 0) {  //获取成功“我”的身份信息
        nowProject.projectId = response.data.project.id;
        nowProject.name = response.data.project.name;
        nowProject.docNum = response.data.project.document_num;
        nowProject.designNum = response.data.project.prototype_num;

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

//原型
const fetchDesignListData = () => {
  let Headers = { 'Authorization': authStore().token };
  axios.get('http://www.aamofe.top/api/document/all_file/', { params: { file_type: 'prototype', project_id: nowProject.projectId }, headers: Headers })
    .then((response) => {
      console.log(response);

      if (response.data.errno == 0) {
        response.data.files.forEach((design, index) => {
          designList.value.push(design);
        })
        designList.value.pop();
        // console.log(designList.value);//xxList.value是一个数组。用的时候可以直接foeEach xxList
      }
      else {
        ElMessage.warning(response.data.msg);
      }
    }).catch(error => {
      console.log(error);
    })
}

//文档
const fetchDocListData = () => {
  let Headers = { 'Authorization': authStore().token };
  axios.get('http://www.aamofe.top/api/document/all_file/', { params: { file_type: 'document', project_id: nowProject.projectId }, headers: Headers })
    .then((response) => {
      console.log(response);

      if (response.data.errno == 0) {
        response.data.file.forEach((doc, index) => {
          docList.value.push(doc);/*【这样写】*/
        })
        docList.value.pop();
        console.log(docList.value);
      }
      else {
        ElMessage.warning(response.data.msg);
      }
    }).catch(error => {
      console.log(error);
    })
}

const newDesign = () => {
  // if (!(designNameInput)) {
  //   console.log('不能为空');
  //   ElMessage.warning('请输入名称');
  //   return;
  // }

  axios.post('http://www.aamofe.top/api/document/create/', qs.stringify({ file_type: 'prototype', project_id: nowProject.projectId, title: '默认原型' }), {
    headers: { Authorization: authStore().token }
  })
    .then(res => {
      // 处理响应数据
      console.log(res);

      if (res.data.errno == 0)//成功
      {
        // designDialogVisible = false;
        // designNameInput = '';

        //进入原型设计页面
        jumpToDesign(res.data.prototype.id);
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

const newDoc = () => {
  axios.post('http://www.aamofe.top/api/document/create/', qs.stringify(
    { file_type: 'document', project_id: nowProject.projectId, title: '默认文档' }
  ),
    {
      headers: {
        Authorization: authStore().token
      }
    })
    .then(res => {
      // 处理响应数据
      console.log(res);

      if (res.data.errno == 0)//成功
      {
        // ElMessage.success(res.data.msg);
        //进入文档
        jumpToDoc(res.data.document.id);
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
//【】
const renameDesign = (index, designId) => {
  if (!(renameDesignInput.value)) {
    console.log('不能为空');
    ElMessage.warning('请输入名称');
    return;
  }
  axios.post('http://www.aamofe.top/api/team/rename_project/', qs.stringify({
    name: renameDesignInput.value, project_id: projectId
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
        designList.value[index - 1] = { "name": renameDesignInput.value, "id": projectId };

        renameDesignInput.value = '';
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
//【】
const renameDoc = (docId) => {
  if (!(renameDocInput.value)) {
    console.log('不能为空');
    ElMessage.warning('请输入名称');
    return;
  }
  // axios.post('http://www.aamofe.top/api/team/rename_project/', qs.stringify({
  //   name: renameProjectInput.value, project_id: projectId
  // }), {
  //   headers: {
  //     Authorization: authStore().token
  //   }
  // })
  //   .then(res => {
  //     // 处理响应数据
  //     console.log(res);

  //     if (res.data.errno == 0)//成功
  //     {
  //       ElMessage.success(res.data.msg);
  //       renameProjectDialog.value = false;
  //       projectList.value[index - 1] = { "name": renameProjectInput.value, "id": projectId };

  //       renameProjectInput.value = '';
  //       return;
  //     }
  //     else {//失败
  //       ElMessage.error(res.data.msg);
  //       return;
  //     }
  //   })
  //   .catch(error => {
  //     // 处理请求错误
  //     console.error(error);
  //   });
}
//0代表临时删除
const deleteDoc = (docId) => {
  console.log(docId);
  axios.post('http://www.aamofe.top/api/document/delete', qs.stringify({ file_type: 'document', file_id: docId, project_id: nowProject.projectId, forever: 0 }), {
    headers: { Authorization: authStore().token }
  })
    .then(res => {
      // 处理响应数据
      console.log(res);

      if (res.data.errno == 0)//成功
      {
        ElMessage.success(res.data.msg);
        //把项目从projectList里删除
        if (index >= 0 && index < docList.value.length) {
          docList.value.splice(index, 1);
        }//【】
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

const deleteDesign = (designId) => {
  axios.post('http://www.aamofe.top/api/document/delete', qs.stringify({ file_type: 'prototype', file_id: designId, project_id: nowProject.projectId, forever: 0 }), {
    headers: { Authorization: authStore().token }
  })
    .then(res => {
      // 处理响应数据
      console.log(res);

      if (res.data.errno == 0)//成功
      {
        ElMessage.success(res.data.msg);
        //把项目从projectList里删除
        if (index >= 0 && index < designList.value.length) {
          designList.value.splice(index, 1);
        }//【】
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

//最近删除文件中
//最近删除中的内容【】。看看最后一个是num吗？
// const fetchDelDocListData = () => {
//   let Headers = { 'Authorization': authStore().token };
//   axios.get('http://www.aamofe.top/api/document/all_deleted/' + route.params.id + '/', { headers: Headers })
//     .then((response) => {
//       console.log(response);

//       if (response.data.errno == 0) {  //所有团队信息
//         response.data.documents.forEach((doc, index) => {
//           delDocList.value.push(doc);/*【这样写】*/
//         })
//         delDocList.value.pop();
//         console.log(delDocList.value);//memberList.value是一个数组。用的时候可以直接foeEach memberList
//       }
//       else {
//         ElMessage.warning(response.data.msg);
//       }
//     }).catch(error => {
//       console.log(error);
//     })
// }
// //【】
// const fetchDelDesignListData = () => {
//   let Headers = { 'Authorization': authStore().token };
//   axios.get('http://www.aamofe.top/api/document/all_deleted_document/' + route.params.id + '/', { headers: Headers })
//     .then((response) => {
//       console.log(response);

//       if (response.data.errno == 0) {  //所有团队信息
//         response.data.documents.forEach((doc, index) => {
//           //op字段为当前登录者可以对该
//           // if()
//           delDesignList.value.push(doc);/*【这样写】*/
//         })
//         delDesignList.value.pop();
//         console.log(delDesignList.value);//memberList.value是一个数组。用的时候可以直接foeEach memberList
//       }
//       else {
//         ElMessage.warning(response.data.msg);
//       }
//     }).catch(error => {
//       console.log(error);
//     })
// }
//【】可能有问题
const recoverDoc = (index, docId) => {
  console.log(docId);
  console.log(index);
  axios.post('http://www.aamofe.top/api/document/restore/', qs.stringify({ file_type: 'document', file_id: docId, project_id: nowProject.projectId }), {
    headers: { Authorization: authStore().token }
  })
    .then(res => {
      // 处理响应数据
      console.log(res);

      if (res.data.errno == 0)//成功
      {
        ElMessage.success(res.data.msg);
        //放回文档中
        // docList.value.push(delDocList.value[index]);
        fetchDocListData();
        //把项目从delDocList里删除
        // if (index >= 0 && index < delDocList.value.length) {
        //   delDocList.value.splice(index, 1);
        // }
        fetchDelDocListData();
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

const recoverDesign = (designId) => {
  axios.post('http://www.aamofe.top/api/document/restore', qs.stringify({ file_type: 'prototype', file_id: designId, project_id: nowProject.projectId }), {
    headers: { Authorization: authStore().token }
  })
    .then(res => {
      // 处理响应数据
      console.log(res);

      if (res.data.errno == 0)//成功
      {
        ElMessage.success(res.data.msg);
        fetchDelDesignListData();
        fetchDesignListData();
        //把项目从projectList里删除
        // if (index >= 0 && index < designList.value.length) {
        //   designList.value.splice(index, 1);
        // }//【】
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

//永久删除
const deleteDocForever = (docId) => {
  console.log(docId);
  axios.post('http://www.aamofe.top/api/team/delete', qs.stringify({ file_type: 'document', file_id: docId, project_id: nowProject.projectId, forever: 1 }), {
    headers: { Authorization: authStore().token }
  })
    .then(res => {
      // 处理响应数据
      console.log(res);

      if (res.data.errno == 0)//成功
      {
        ElMessage.success(res.data.msg);
        //把项目从projectList里删除

        delDocList.value = [];
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
const deleteDesignForever = (designId) => {
  axios.post('http://www.aamofe.top/api/team/delete', qs.stringify({ file_type: 'prototype', file_id: designId, project_id: nowProject.projectId, forever: 1 }), {
    headers: { Authorization: authStore().token }
  })
    .then(res => {
      // 处理响应数据
      console.log(res);

      if (res.data.errno == 0)//成功
      {
        ElMessage.success(res.data.msg);
        //把项目从projectList里删除
        delDocList.value = [];
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
const handleClick = (tab, event) => {
  // console.log(tab, event)
}

const highlightRow = (index) => {
  highlightedIndex.value = index;
};

const resetRow = (index) => {
  highlightedIndex.value = -1;
};

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

.demo-tabs > .el-tabs__title {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
