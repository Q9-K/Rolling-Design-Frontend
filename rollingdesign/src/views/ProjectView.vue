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
              <el-avatar shape="square" :size="50" :src="squareUrl" style="margin-right:20px" />
              <span style="font-size:larger;font-weight: 800;">xxx的团队</span>

              <div style="display: flex;flex: 1;justify-content: flex-end;">
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
            <!--团队信息结束-->

            <el-row style="margin-top:40px;margin-bottom: 30px;">
              <span style="font-size:large;font-weight: 500;">项目名字</span>
            </el-row>

            <!--原型部分-->
            <!--展开状态（此为默认状态）-->
            <div v-if="designShow">
              <el-row style="margin-top:40px;margin-bottom: 30px;">
                <span style="font-size:large;font-weight: 500;" >
                  <el-icon @click="designShow = false">
                    <CaretBottom />
                  </el-icon>原型
                </span>
              </el-row>

              <!--原型封面图-->
              <!--如果有原型-->
              <el-row v-if="designNum">
                <div class="designBlock" v-for="(item, index) in items" :key="index">
                  <div style="width:100%">
                    <img class="round designImg" src="@/assets/projectImage.png" style="width:90%;height:150px" />
                  </div>
                  <div style="display:flex;justify-content: space-between;width:90%">
                    <span class="designName" style="padding-left:4px;display: flex;">
                      项目名字{{ index }}
                    </span>
                    <span class="rightContent">
                      <el-icon ref="designMoreOp" v-click-outside="designOpOut">
                        <More />
                      </el-icon>
                    </span>
                  </div>

                  <el-popover ref="designPopoverOp" :virtual-ref="designMoreOp" trigger="click" title="With title" virtual-triggering>
                    <span> Some content </span>
                  </el-popover>

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
                <span style="font-size:large;font-weight: 500;" >
                  <el-icon @click="fileShow = false">
                    <CaretBottom />
                  </el-icon>文档
                </span>
              </el-row>
              <!--原型封面图-->
              <!--如果有原型-->
              <el-row v-if="fileNum">
                <div class="designBlock" v-for="(item, index) in items" :key="index">
                  <div style="width:100%">
                    <img class="round designImg" src="@/assets/projectImage.png" style="width:90%;height:150px" />
                  </div>
                  <div style="display:flex;justify-content: space-between;width:90%">
                    <span class="designName" style="padding-left:4px;display: flex;">
                      文档名字{{ index }}
                    </span>
                    <span class="rightContent">
                      <el-icon ref="docMoreOp" v-click-outside="docOpOut">
                        <More />
                      </el-icon>
                    </span>
                  </div>

                  <el-popover ref="decPopoverOp" :virtual-ref="docMoreOp" trigger="click" title="With title" virtual-triggering>
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
import { ref, unref } from 'vue'
import GuideAside from '@/components/GuideAside.vue'
import Header from '@/components/Header.vue'
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

// const handleAvatarSuccess: UploadProps['onSuccess'] = (
//   response,
//   uploadFile
// ) => {
//   imageUrl.value = URL.createObjectURL(uploadFile.raw!)
// }

// const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
//   if (rawFile.type !== 'image/jpeg') {
//     ElMessage.error('Avatar picture must be JPG format!')
//     return false
//   } else if (rawFile.size / 1024 / 1024 > 2) {
//     ElMessage.error('Avatar picture size can not exceed 2MB!')
//     return false
//   }
//   return true
// }
/*头像*/
import { reactive, toRefs } from 'vue'
const state = reactive({
  circleUrl:
    'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
  squareUrl:
    'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
  sizeList: ['small', '', 'large'],
})
const { circleUrl, squareUrl, sizeList } = toRefs(state)
/*点击头像，有下拉列表*/
const buttonRef = ref()
const popoverRef = ref()
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
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
const jumpTo = (path) => {
  //this.$router.push('/video/'+video_id);
  const path_url = '/' + path;
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