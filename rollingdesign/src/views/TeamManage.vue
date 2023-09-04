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
              <span style="font-size:large;font-weight: 500;">团队管理</span>
            </el-row>

            <!--团队信息-->
            <el-row class="block" style="display: flex;align-items: center;margin-bottom: 30px;">
              <!-- <el-avatar shape="square" :size="50" :src="squareUrl" style="margin-right:20px" /> -->
              <span style="font-size:larger;font-weight: 800;">{{ }}</span>

              <div style="display: flex;flex: 1;justify-content: flex-end;">
                <!--如果是管理员有“邀请”这一项，判断登陆者在该团队中的身份-->
                <!--
                <el-button type="primary" @click="centerDialogVisible = true">邀请成员</el-button>
                -->
                <!--
                  TODO now-team
                -->
<!--                <InviteMemberButton />-->
                <el-button type="primary">新建项目</el-button>
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

            <!--********开始-->
            <el-tabs v-model="activeTab">
              <el-tab-pane label="团队项目" name="tab1">
                <!--项目部分-->
                <div style="margin-top:20px">
                  <!-- <ProjectDisplay /> -->
                  <ProjectDisplay></ProjectDisplay>
                </div>

              </el-tab-pane>

              <el-tab-pane label="成员权限" name="tab2">
                <div>
                  <el-table :data="tableData" style="width: 100%">
                    <el-table-column prop="nickName" label="昵称" width="180" />
                    <el-table-column prop="name" label="真实姓名" width="180" />
                    <el-table-column prop="email" label="邮箱" />
                    <el-table-column prop="role" label="身份" />
                    <!--如果登录者是创建者-->
                    <!-- <el-table-column prop="op" label="操作">
                    <template #default>
                      <el-button link type="primary" size="small">Detail</el-button>
                      <el-button link type="primary" size="small">Edit</el-button>
                    </template>
                  </el-table-column> -->
                    <el-table-column prop="op" label="操作">
                      <template #default>
                        <el-button link type="primary" size="small">Detail</el-button>
                        <el-button link type="primary" size="small">Detail</el-button>
                      </template>
                    </el-table-column>
                  </el-table>

                </div>
              </el-tab-pane>

              <el-tab-pane label="团队设置" name="tab3">
                <p>这是标签页 3 的内容</p>
                <!--昵称-->
                <el-row style="display: flex;align-items: center;justify-content: space-between;">
                  <div class="leftContent" style="display: flex;justify-content:flex-start">
                    <div>
                      <div class="hintText" style="text-align: left;margin-bottom: 5px;">昵称</div>
                      <div style="text-align: left;">xx用户名</div>
                    </div>
                  </div>
                  <el-button link type="primary" size="small" style="justify-content: flex-end;"
                    @click="nickNameConfig = true">修改昵称</el-button>
                </el-row>
                <el-divider />
              </el-tab-pane>
            </el-tabs>
            <!--********结束-->


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
  Comment,
  Grid,
} from '@element-plus/icons-vue'
import InviteMemberButton from "@/components/InviteMemberButton.vue";
const route = useRoute()
const activeTab = ref('tab1'); // 设置默认激活的标签页


/*跳转对应页*/
const jumpTo = (path) => {
  //this.$router.push('/video/'+video_id);
  const path_url = '/' + path;
  window.open(path_url, '_self');
}
/*邀请成员*/
// import { ref } from 'vue'
const centerDialogVisible = ref(false) /*邀请对话框*/
const input = ref('')/*邀请成员时，输入框*/



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

const fetchData = () => {
  // console.log(route.meta.index);
}

onMounted(() => {
  fetchData();
})
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

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
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
