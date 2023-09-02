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
            <div style="display: flex;align-items: center;margin-bottom: 18px;">
              <!-- <el-avatar shape="square" :size="50" :src="squareUrl" style="margin-right:20px" /> -->
              <span style="font-size:larger;font-weight: 800;display: flex;align-items: center;">{{ nowProject.name
              }}&nbsp;<el-icon>
                  <ArrowRightBold />
                </el-icon> </span>

              <div style="display: flex;flex: 1;justify-content: flex-end;">
                <el-button type="primary" @click="newFolderDialog = true">新建文件夹</el-button>
                <el-button type="primary" @click="newDesign()">新建原型</el-button>
                <el-button type="primary" @click="newDoc()">新建文档</el-button>
                <el-button v-if="activeName==='delete'" type="primary" @click="deleteAllDelFileForever()">全部删除</el-button>
              </div>
            </div>

            <el-dialog v-model="newFolderDialog" title="创建文件夹" width="30%">
              <el-input v-model="newFolderNameInput" placeholder="请输入文件夹名称" />
              <template #footer>
                <span class="dialog-footer">
                  <el-button type="primary" @click="newFolder()">
                    确认创建
                  </el-button>
                </span>
              </template>
            </el-dialog>

            <!--团队信息结束-->

            <!-- <el-row style="margin-top:40px;margin-bottom: 30px;">
              <span style="font-size:large;font-weight: 500;">{{ nowProject.name }} </span>
            </el-row> -->

            <!--文件-->
            <el-tabs v-model="activeName" class="demo-tabs" @tab-click="">
              <el-tab-pane label="文件" name="files">

                <el-row v-if="fileNum"><!--如果该项目下有文件-->
                  <div class="designBlock" v-for="(item, index) in fileList" :key="index">

                    <div class="block" @mouseover="highlightBlock(index)" @mouseleave="resetBlock(index)"
                      :class="{ 'highlighted-row': highlightIndex === index || clickIndex === index }">
                      <div v-if="index === highlightIndex || clickIndex === index"
                        style="display: flex;justify-content:flex-end;text-align: right;justify-items: flex-end;justify-self: right;">

                        <el-dropdown trigger="click" placement="bottom-start">
                          <!-- <el-icon style="text-align: right;justify-self: right;justify-content:flex-end;"> -->
                          <el-icon class="el-icon--right" @click="clickIcon(index)">
                            <More />
                          </el-icon>

                          <template #dropdown>
                            <el-dropdown-menu v-if="item.type === 'folder'">
                              <el-dropdown-item :icon="FolderOpened"
                                @click="openFile(index, item.type, item.id)">打开</el-dropdown-item>
                              <el-dropdown-item :icon="EditPen" @click="renameInputBlock[index] = true">
                                重命名
                              </el-dropdown-item>
                              <!-- <el-dropdown-item :icon="CopyDocument"
                                @click="copyFile(index, item.type, item.id, item)">复制</el-dropdown-item> -->
                              <el-dropdown-item :icon="FolderDelete"
                                @click="deleteFile(index, item.type, item.id)">删除</el-dropdown-item>
                            </el-dropdown-menu>

                            <el-dropdown-menu v-else>
                              <el-dropdown-item :icon="Document"
                                @click="openFile(index, item.type, item.id)">打开</el-dropdown-item>
                              <el-dropdown-item :icon="EditPen" @click="renameInputBlock[index] = true">
                                重命名
                              </el-dropdown-item>
                              <!-- <el-dropdown-item :icon="CopyDocument"
                                @click="copyFile(index, item.type, item.id, item)">复制</el-dropdown-item> -->
                              <el-dropdown-item :icon="DocumentDelete"
                                @click="deleteFile(index, item.type, item.id)">删除</el-dropdown-item>

                            </el-dropdown-menu>
                          </template>

                        </el-dropdown>
                      </div>
                      <div v-else
                        style="display: flex;justify-content:flex-end;text-align: right;justify-items: flex-end;justify-self: right;">
                        &nbsp;&nbsp;
                      </div>

                      <div class="fileBlock">

                        <img v-if="item.type === 'folder'" class="img-size" src="@/assets/projects/folder.png"
                          @click="openFile(index, item.type, item.id)" />
                        <img v-if="item.type === 'document'" class="img-size" src="@/assets/projects/word.jpg"
                          @click="openFile(index, item.type, item.id)" />
                        <img v-if="item.type === 'prototype'" class="img-size" src="@/assets/projects/design.png"
                          @click="openFile(index, item.type, item.id)" />

                        <div v-if="renameInputBlock[index]">
                          <el-input v-model="renameInput" placeholder="请输入名称"
                            @keyup.enter="renameFile(index, item.type, item.id)" />
                        </div>
                        <div v-else>
                          {{ item.name }}
                        </div>
                      </div>
                    </div>
                  </div>
                </el-row>
                <el-row v-else>
                  <el-empty description="该项目暂无文件" style="width: 100%;">
                    <el-button type="primary" plain @click="newFolder()">新建文件夹</el-button>
                    <el-button type="primary" plain @click="newDesign()">新建原型</el-button>
                    <el-button type="primary" plain @click="newDoc()">新建文档</el-button>
                  </el-empty>
                </el-row>

                <!--模板-->
                <!-- <el-footer> -->

                <div class="draftFiles footer" style="margin-top:20px">
                  <!--如果展示的是网页推荐模板-->
                  <el-row style="margin-top:20px;margin-bottom: 30px;margin-left:24px;" v-if="webTemplateShow">
                    <!--页头-->
                    <el-col :span="24">
                      <el-row class="blockHeader" style="display:flex">
                        <el-col :span="14" class="blockTitle" style="text-align: left;margin-bottom: 10px;">
                          <span style="font-size:large;font-weight: 700;color:#409eff;"
                            @click="webTemplateShow = true; myTemplateShow = false;">
                            推荐模版
                          </span>
                          <el-divider direction="vertical" />
                          <span style="font-size:large;font-weight: 700;"
                            @click="webTemplateShow = false; myTemplateShow = true;">
                            所创建模版
                          </span>
                        </el-col>
                      </el-row>
                    </el-col>

                    <el-col :span="12">
                      <div>
                        <div style="text-align: left;font-weight: 600;margin-bottom: 12px;">
                          原型
                        </div>

                        <el-row :gutter="3">
                          <el-col :span="4" v-for="(item, index) in design_public" :key="index"
                            style="margin-bottom: 20px;">
                            <div style="width:100%;">
                              <div style="display: flex;justify-content: center;">
                                <img src="@/assets/projects/design.png" style="width:70px;height:70px"
                                  @click="import_from_template(item.id, 'prototype')" />
                              </div>
                              <div style="font-size: 10px;display: flex;justify-content: center;">
                                {{ item.title }}
                              </div>
                            </div>
                          </el-col>
                        </el-row>
                      </div>
                    </el-col>

                    <el-divider direction="vertical" style="height: 170px;"></el-divider>

                    <el-col :span="11">
                      <div style="margin-left:24px">
                        <div style="text-align: left;font-weight: 500;margin-bottom: 12px;">
                          文档
                        </div>
                        <el-row :gutter="3">
                          <el-col :span="4" v-for="(item, index) in document_public" :key="index"
                            style="margin-bottom: 20px;">
                            <div style="width:100%;">
                              <div style="display: flex;justify-content: center;">
                                <img src="@/assets/projects/word.jpg" style="width:70px;height:70px"
                                  @click="import_from_template(item.id, 'document')" />
                              </div>
                              <div style="text-align:center;font-size: 12px;">
                                {{ item.title }}
                              </div>
                            </div>
                          </el-col>
                        </el-row>
                      </div>
                    </el-col>
                  </el-row>

                  <!--自己的模板-->
                  <el-row style="margin-top:20px;margin-bottom: 30px;margin-left:24px;" v-else-if="myTemplateShow">
                    <!--页头-->
                    <el-col :span="24">
                      <el-row class="blockHeader" style="display:flex">
                        <el-col :span="14" class="blockTitle" style="text-align: left;margin-bottom: 10px;">
                          <span style="font-size:large;font-weight: 700;"
                            @click="webTemplateShow = true; myTemplateShow = false;">
                            推荐模版
                          </span>
                          <el-divider direction="vertical" />
                          <span style="font-size:large;font-weight: 700;color:#409eff;"
                            @click="webTemplateShow = false; myTemplateShow = true;">
                            所创建模版
                          </span>
                        </el-col>
                      </el-row>
                    </el-col>

                    <el-col :span="12">
                      <div style="">
                        <div style="text-align: left;font-weight: 600;margin-bottom: 12px;">
                          原型
                        </div>
                        <div v-if="design_private_num">
                          <el-row :gutter="3">
                            <el-col v-for="(item, index) in design_private" :key="index" :span="4"
                              style="margin-bottom: 20px;">
                              <div style="width:100%;">
                                <div style="display: flex;justify-content: center;">
                                  <img src="@/assets/projects/design.png" style="width:70px;height:70px"
                                    @click="import_from_template(item.id, 'prototype')" />
                                </div>
                                <div style="font-size: 10px;display: flex;justify-content: center;">
                                  {{ item.title }}
                                </div>
                              </div>
                            </el-col>
                          </el-row>
                        </div>
                        <div v-else style="display: flex;justify-content: center;">
                          暂无模板
                          <!-- <el-empty description="暂无创建的原型模板" style="width: 100%;height:100px;"> -->
                          <!-- <el-button type="primary" plain @click="newProjectDialog = true">新建项目</el-button> -->
                          <!-- </el-empty> -->
                        </div>
                      </div>
                    </el-col>
                    <el-divider direction="vertical" style="height: 170px;"></el-divider>
                    <el-col :span="11">
                      <div style="margin-left:24px">
                        <div style="text-align: left;font-weight: 500;margin-bottom: 12px;">
                          文档
                        </div>
                        <div v-if="document_private_num">
                          <el-row :gutter="3">
                            <el-col :span="4" v-for="(item, index) in document_private" :key="index"
                              style="margin-bottom: 20px;">
                              <div style="width:100%;">
                                <div style="display: flex;justify-content: center;">
                                  <img src="@/assets/projects/word.jpg" style="width:70px;height:70px"
                                    @click="import_from_template(item.id, 'document')" />
                                </div>
                                <div style="font-size: 12px;display: flex;justify-content: center;">
                                  {{ item.title }}
                                </div>
                              </div>
                            </el-col>
                          </el-row>
                        </div>
                        <div v-else style="display: flex;justify-content: center;">
                          暂无模板
                          <!-- <el-empty description="暂无创建的文档模板" style="margin-left: 40%;width: 180px;height:70px"> -->
                          <!-- </el-empty> -->
                        </div>
                      </div>
                    </el-col>

                  </el-row>
                </div>


                <!-- </el-footer> -->
              </el-tab-pane>

              <!--最近删除-->
              <el-tab-pane label="最近删除" name="delete">
                <el-row v-if="delFileNum"><!--如果该项目下有文件-->
                  <div class="designBlock" v-for="(item, index) in delFileList" :key="index">

                    <div class="block" @mouseover="highlightBlock(index)" @mouseleave="resetBlock(index)"
                      :class="{ 'highlighted-row': highlightIndex === index || clickIndex === index }">
                      <div v-if="index === highlightIndex || clickIndex === index"
                        style="display: flex;justify-content:flex-end;text-align: right;justify-items: flex-end;justify-self: right;">

                        <el-dropdown trigger="click" placement="bottom-start">
                          <!-- <el-icon style="text-align: right;justify-self: right;justify-content:flex-end;"> -->
                          <el-icon class="el-icon--right" @click="clickIcon(index)">
                            <More />
                          </el-icon>

                          <template #dropdown>
                            <el-dropdown-item :icon="FolderOpened"
                              @click="recoverDelFile(index, item.type, item.id, item)">恢复</el-dropdown-item>
                            <el-dropdown-item :icon="FolderDelete"
                              @click="deleteDelFileForever(index, item.type, item.id, item)">
                              删除
                            </el-dropdown-item>

                            <el-dropdown-item :icon="DeleteFilled"
                              @click="deleteAllDelFileForever(index, item.type, item.id, item)">全部删除</el-dropdown-item>
                          </template>
                        </el-dropdown>
                      </div>
                      <div v-else
                        style="display: flex;justify-content:flex-end;text-align: right;justify-items: flex-end;justify-self: right;">
                        &nbsp;&nbsp;
                      </div>

                      <div class="fileBlock">

                        <img v-if="item.type === 'folder'" class="img-size" src="@/assets/projects/folder.png"
                          @click="openWarning(item.type, item.name)" />
                        <img v-if="item.type === 'document'" class="img-size" src="@/assets/projects/word.jpg"
                          @click="openWarning(item.type, item.name)" />
                        <img v-if="item.type === 'prototype'" class="img-size" src="@/assets/projects/design.png"
                          @click="openWarning(item.type, item.name)" />


                        <div>
                          {{ item.name }}
                        </div>
                      </div>
                    </div>
                  </div>
                </el-row>
                <el-row v-else>
                  <el-empty description="该项目暂无删除文件" style="width: 100%;" />
                </el-row>
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
  MoreFilled,
  ArrowRightBold,
  DeleteFilled,
  Document,
  DocumentDelete,
  More,
  EditPen,
  CopyDocument,
  FolderDelete,
  FolderOpened,
} from '@element-plus/icons-vue'
const route = useRoute()
const activeName = ref('files')

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
  const path_url = '/design/' + nowProject.projectId + '/' + nowProject.folderId + '/' + id;
  window.open(path_url, '_self');
}

const jumpToDoc = (id) => {
  const path_url = '/tiptap/' + nowProject.projectId + '/' + id;
  window.open(path_url, '_self');
}

const jumpToFolder = (id) => {
  const path_url = '/project/' + route.params.id + '/folder/' + id;
  window.open(path_url, '_self');
}

const isPopoverVisible = ref(-1);
const highlightedIndex = ref(-1);
const flagtimes = ref([0, 0, 0]);

const highlightIndex = ref(-1);
const moreIndex = ref(-1);
const clickIndex = ref(-1);
/*main*/
// const designShow = ref(true)//默认展开
// const designList = ref([]);
// const renameDesignDialog = ref(false);
// const renameDesignInput = ref('');

// const docShow = ref(true)//默认展开
// const docList = ref([]);
// const renameDocDialog = ref(false);
// const renameDocBlock = ref([]);//点击其他地方关闭
// const renameDocInput = ref([]);

// const delDocList = ref([]);
// const delDocShow = ref(true);
// const delDocNum = ref('');

// const delDesignList = ref([]);
// const delDesignShow = ref(true);
// const delDesignNum = ref('');

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
  folderId: '',
  name: '',
  docNum: '',
  designNum: '',
})

onMounted(() => {
  fetchNowTeam();
  fetchNowProject();
  fetchDelFileListData();
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
        fetchAllTemplate();
        nowProject.name = response.data.project.name;
        nowProject.docNum = response.data.project.document_num;
        nowProject.designNum = response.data.project.prototype_num;
        nowProject.folderId = response.data.project.folder_id;
        fetchAllFile();
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

const fileList = ref('');//所有的子文件夹。对应的是children里面的
const fileNum = ref(0);
const renameInput = ref('');
const renameInputBlock = ref([]);
const nameInput = ref('')
const nameInputDialog = ref(false);
const newFolderDialog = ref(false);
const newFolderNameInput = ref('');
const webTemplateShow = ref(true);//模板区默认展示的是网页推荐模板
const myTemplateShow = ref(false);//

//获取项目下所有文件
const fetchAllFile = () => {
  let Headers = { 'Authorization': authStore().token };
  // console.log(route.params.id)
  //直接用nowProject.projectId可能会有顺序问题
  //默认为按最近获取时间
  axios.get('http://www.aamofe.top/api/document/view_folder/', { params: { parent_folder_id: nowProject.folderId, sorted_by: 'created_at' }, headers: Headers })
    .then((response) => {
      console.log(response);

      if (response.data.errno == 0) {
        fileList.value = response.data.parent_folder.children;
        console.log(fileList.value)

        fileNum.value = fileList.value.length;//children是个数组
        console.log(fileList.value.length)

        let i = 0;
        for (i = 0; i < fileNum; i++) {
          renameInputBlock.value.push(false);
        }
      }
      else {
        ElMessage.warning(response.data.msg);
      }
    }).catch(error => {
      console.log(error);
    })
}

const document_public = ref([])//网页公共模板
const document_private = ref([])
const design_public = ref([])//网页公共模板
const design_private = ref([])
const design_private_num = ref(0)
const document_private_num = ref(0)

//获取项目下的所有模板
const fetchAllTemplate = () => {
  let Headers = { 'Authorization': authStore().token };
  //直接用nowProject.projectId可能会有顺序问题
  //默认为按最近获取时间
  axios.get('http://www.aamofe.top/api/document/all_template/', { params: { project_id: nowProject.projectId }, headers: Headers })
    .then((response) => {
      console.log(response);

      if (response.data.errno == 0) {
        document_public.value = response.data.document_public;
        document_private.value = response.data.document_private;
        design_public.value = response.data.prototype_public;
        design_private.value = response.data.prototype_private;

        console.log(document_public.value);
        console.log(document_private.value);
        console.log(design_public.value);
        console.log(design_private.value);


        design_private_num.value = document_private.value.length;
        document_private_num.value = design_private.value.length;

        return;
      }
      else {
        ElMessage.warning(response.data.msg);
      }
    }).catch(error => {
      console.log(error);
    })
}

//点击模版
const import_from_template = (id, type) => {
  console.log(id);
  console.log(type)
  axios.post('http://www.aamofe.top/api/document/import_from_template/', qs.stringify({ file_id: id, file_type: type, parent_folder_id: nowProject.folderId }), {
    headers: { Authorization: authStore().token }
  })
    .then(res => {
      // 处理响应数据
      console.log(res);

      if (res.data.errno == 0)//成功
      {
        // ElMessage.success(res.data.msg);
        //文件列表增加一个，且跳转过去
        if (type === 'document') {
          fileList.value.push({ "id": res.data.document.id, "type": type, "name": res.data.document.name })
          jumpToDoc(id);
        }
        else if (type === 'prototype') {
          fileList.value.push({ "id": res.data.prototype.id, "type": type, "name": res.data.prototype.name });
          jumpToDesign(id);
        }
        //跳转过去
        
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

const openFile = (index, type, id) => {
  if (type === 'folder') {
    jumpToFolder(id);//跳转至文件夹
  }
  else if (type === 'prototype') {
    jumpToDesign(id);
  }
  else if (type === 'document') {
    jumpToDoc(id);
  }

  //点击
  closeClickIcon(index);
}

const closeClickIcon = (index) => {
  clickIndex.value = index;
  flagtimes.value[index]++;
  if (flagtimes.value[index] % 2 == 0) {
    clickIndex.value = -1;
  }
}

const copyFile = (index, type, id) => {

}

const renameFile = (index, type, id, item) => {
  console.log(id);
  console.log(type)
  //可以不加content参数吗？
  axios.post('http://www.aamofe.top/api/document/save/', qs.stringify({ file_type: type, file_id: id, title: renameInput.value }), {
    headers: { Authorization: authStore().token }
  })
    .then(res => {
      // 处理响应数据
      console.log(res);

      if (res.data.errno == 0)//成功
      {
        ElMessage.success(res.data.msg);
        //把项目从projectList里删除

        fileList.value[index].name = renameInput.value;
        renameInputBlock.value[index] = false;
        renameInput.value = '';

        closeClickIcon(index);

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
//临时删除
const deleteFile = (index, type, id) => {
  console.log(fileList.value);
  axios.post('http://www.aamofe.top/api/document/delete/', qs.stringify({ file_type: type, file_id: id, forever: 0 }), {
    headers: { Authorization: authStore().token }
  })
    .then(res => {
      // 处理响应数据
      console.log(res);

      if (res.data.errno == 0)//成功
      {
        ElMessage.success(res.data.msg);
        console.log(index);
        delFileList.value.push(fileList.value[index]);
        delFileNum.value++;

        let i = 0;
        for (i =index; i < fileNum.value - 1; i++) {
          console.log(i);
            fileList.value[i] = fileList.value[i + 1];
        }
        fileList.value.pop();
        // console.log(projectList.value);
        fileNum.value--;
        console.log(fileList.value);
        closeClickIcon(index);

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

const newFolder = () => {
  axios.post('http://www.aamofe.top/api/document/create_folder/', qs.stringify(
    { parent_folder_id: nowProject.folderId, folder_name: newFolderNameInput.value }
  ),
    {
      headers: {
        Authorization: authStore().token
      }
    })
    .then(res => {
      // 处理响应数据
      // console.log(res);

      if (res.data.errno == 0)//成功
      {
        fileList.value.push({ "id": res.data.folder.folder_id, "name": newFolderNameInput.value, "type": "folder" })
        fileNum.value++;
        //关闭
        newFolderDialog.value = false;
        newFolderNameInput.value = '';

        return;
      }
      else {//失败
        ElMessage.error(res.data.msg);
        return;
      }
    })
    .catch(error => {
      console.error(error);
    });
}

const newDesign = () => {
  // if (!(designNameInput)) {
  //   console.log('不能为空');
  //   ElMessage.warning('请输入名称');
  //   return;
  // }

  axios.post('http://www.aamofe.top/api/document/create/', qs.stringify({ file_type: 'prototype', parent_folder_id: nowProject.folderId, title: '新建原型' }), {
    headers: { Authorization: authStore().token }
  })
    .then(res => {
      // 处理响应数据
      // console.log(res);

      if (res.data.errno == 0)//成功
      {
        fileList.value.push({ "id": res.data.document.id, "name": '新建原型', "type": "prototype" })
        fileNum.value++;
        console.log(fileList.value);

        //进入原型设计页面
        jumpToDesign(res.data.document.id);//【添加项目id】
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
    { file_type: 'document', parent_folder_id: nowProject.folderId, title: '新建文档' }
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
        fileList.value.push({ "id": res.data.document.id, "name": '新建文档', "type": "document" })
        fileNum.value++;

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

//最近删除文件中
const delFileList = ref([])
const delFileNum = ref(0)
//最近删除中的内容【】。看看最后一个是num吗？
const fetchDelFileListData = () => {
  let Headers = { 'Authorization': authStore().token };
  axios.get('http://www.aamofe.top/api/document/all_deleted/', { params: { project_id: route.params.id }, headers: Headers })
    .then((response) => {
      console.log(response);

      if (response.data.errno == 0) {  //所有团队信息
        delFileList.value = response.data.deleted_items;
        delFileNum.value = delFileList.value.length;
        console.log(delFileList.value);//memberList.value是一个数组。用的时候可以直接foeEach memberList
      }
      else {
        ElMessage.warning(response.data.msg);
      }
    }).catch(error => {
      console.log(error);
    })
}

//【】可能有问题

const recoverDelFile = (index, type, id, item) => {
  console.log(type);
  console.log(id);
  console.log(index);
  axios.post('http://www.aamofe.top/api/document/restore/', qs.stringify({ file_type: type, file_id: id, project_id: route.params.id }), {
    headers: { Authorization: authStore().token }
  })
    .then(res => {
      // 处理响应数据
      console.log(res);

      if (res.data.errno == 0)//成功
      {
        ElMessage.success(res.data.msg);
        //放回文档中
        fileList.value.push(delFileList.value[index]);

        //把项目从delFileList里删除
        let i = 0;
        for (i = 0; i < delFileNum.value - 1; i++) {
          if (i >= index) {
            delFileList.value[i] = delFileList.value[i + 1];
          }
        }
        delFileList.value.pop();
        // console.log(projectList.value);
        delFileNum.value--;
        console.log(delFileList.value);

        closeClickIcon(index);
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

//永久删除，只删一个
const deleteDelFileForever = (index, type, id, item) => {
  console.log(type);
  console.log(id);
  axios.post('http://www.aamofe.top/api/document/delete/', qs.stringify({ file_type: type, file_id: id, forever: 1 }), {
    headers: { Authorization: authStore().token }
  })
    .then(res => {
      // 处理响应数据
      console.log(res);

      if (res.data.errno == 0)//成功
      {
        ElMessage.success(res.data.msg);

        //把项目从delFileList里删除
        let i = 0;
        for (i = 0; i < delFileNum.value - 1; i++) {
          if (i >= index) {
            delFileList.value[i] = delFileList.value[i + 1];
          }
        }
        delFileList.value.pop();
        // console.log(projectList.value);
        delFileNum.value--;
        
        console.log(delFileList.value);

        closeClickIcon(index);
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

const deleteAllDelFileForever = (index, type, id, item) => {
  console.log(nowProject.projectId)
  axios.post('http://www.aamofe.top/api/document/delete_permanently/', qs.stringify({ project_id:nowProject.projectId }), {
    headers: { Authorization: authStore().token }
  })
    .then(res => {
      // 处理响应数据
      console.log(res);

      if (res.data.errno == 0)//成功
      {
        ElMessage.success(res.data.msg);
        //把项目从projectList里删除
        delFileList.value = [];
        delFileNum.value=0;
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

const openWarning = (type, name) => {
  ElMessageBox.alert('您不能在最近删除文件中打开' + '"' + name + '"，请恢复后操作', '', {
    confirmButtonText: 'OK',
  })
}
const handleClick = (tab, event) => {
  // console.log(tab, event)
}


const highlightBlock = (index) => {
  highlightIndex.value = index;
  moreIndex.value = index;
  // console.log('ii:' + index);

  // console.log('11--' + highlightIndex.value);

};

const resetBlock = (index) => {
  highlightIndex.value = -1;
  moreIndex.value = -1;
};

const clickIcon = (index) => {
  // flag.value = - flag.value;
  clickIndex.value = index;
  flagtimes.value[index]++;
  // console.log('rr:' + highlightIndex.value);
  // console.log('cc:' + clickIndex.value);
  if (flagtimes.value[index] % 2 == 0) {
    clickIndex.value = -1;
  }

}
</script>

<style scoped>
.hintText {
  color: gray;
  font-size: small;
  font-weight: 600;
}

.img-size {
  width: 66px;
  height: 66px;
}

.highlighted-row {
  background-color: rgb(237, 237, 237);
}

.round {
  border-radius: 10px;
  /* 设置边框圆角半径，根据需要调整 */
}

.block {
  width: 130px;
  height: 130px;
  /* display: flex; */
  /* align-items: center; */
}

.fileBlock {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-items: center; */
  margin-top: 8px;
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

.draftFiles {
  width: 100%;
  background-color: rgba(248, 247, 247, 0.888);
  /* border: 2px solid #d0dcdc9a; */
  border-radius: 10px;
  /* padding: 5px 0 10px 0; */
  box-shadow: 0 .5px 0 .5px#e7f6f69a;
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
  width: 9%;
  margin-bottom: 40px;
  margin-right: 19px;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
}

.footer {
  /* position: relative;  */
  left: 0;
  /* 左侧对齐 */
  margin-top: auto;
  bottom: 0;
  /* 底部对齐 */
  width: 100%;
  /* 横向占满整个视口宽度 */
  /* background-color: #f0f0f0;  */
  padding: 10px;
  text-align: center;
  /* 文本居中对齐 */
  z-index: 999;
  /* 设置 z-index，以控制在其他元素之上 */
}

/*对话框圆角*/
.rounded-dialog {
  border-radius: 10px;
  /* 设置边框圆角半径，根据需要调整 */
}

.el-tabs__header {
  color: #6b778c !important;
  font-size: 50px !important;
}
</style>

<!-- <style>
.el-tabs__header {
  color: #6b778c!important;
  font-size: 50px!important;

}
</style> -->
