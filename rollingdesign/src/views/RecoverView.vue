<template>
  <!--回收站-->
  <div class="common-layout">
    <el-container>
      <!--侧边-->
      <el-aside width="15%">
        <!--侧栏-->
        <GuideAside />
      </el-aside>
      <!--侧边结束-->

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
              <el-avatar shape="square" :size="50" :src="squareUrl" style="margin-right:20px" />
              <span style="font-size:larger;font-weight: 800;">xxx的团队</span>

              <div style="display: flex;flex: 1;justify-content: flex-end;">
                <!--如果是管理员有“邀请”这一项，判断登陆者在该团队中的身份-->
                <!-- <el-button type="primary" @click="centerDialogVisible = true; getLink()">邀请成员</el-button> -->
              </div>
            </el-row>

            <!--团队信息结束-->

            <el-row style="margin-top:40px;margin-bottom: 30px;">
              <span style="font-size:large;font-weight: 500;">回收站</span>
            </el-row>


            <!--项目部分-->
            <!--展开状态（此为默认状态）-->
            <div v-if="projectShow">
              <el-row style="margin-top:40px;margin-bottom: 30px;">
                <span style="font-size:large;font-weight: 500;" @click="projectShow = false">
                  <el-icon>
                    <CaretBottom />
                  </el-icon>项目
                </span>
              </el-row>
              <!--项目封面图-->
              <!--如果有项目-->
              <el-row v-if="projectNum">
                <div class="designBlock" v-for="(item, index) in items" :key="index">
                  <div style="width:100%">
                    <img class="round designImg" src="@/assets/projectImage.png" style="width:90%;height:150px" />
                  </div>
                  <div style="display:flex;justify-content: space-between;width:90%">
                    <span class="designName" style="padding-left:4px;display: flex;">
                      项目名字{{ index }}
                    </span>
                  </div>

                </div>
              </el-row>
              <!--如果没有项目-->
              <el-row v-else>
                <img class="round" src="@/assets/noFile.png" style="width: 100%;" />
              </el-row>
            </div>
            <!--如果被折叠-->
            <div v-else>
              <el-row style="margin-top:40px;margin-bottom: 30px;">
                <span style="font-size:large;font-weight: 500;" @click="projectShow = true">
                  <el-icon>
                    <CaretRight />
                  </el-icon>项目
                </span>
              </el-row>
            </div>

            <!--原型部分-->
            <!--展开状态（此为默认状态）-->
            <div v-if="designShow">
              <el-row style="margin-top:40px;margin-bottom: 30px;">
                <span style="font-size:large;font-weight: 500;" @click="designShow = false">
                  <el-icon>
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
                      <el-icon>
                        <More />
                      </el-icon>
                    </span>
                  </div>

                  <!-- <el-popover ref="popoverOp" :virtual-ref="moreOp" trigger="click" title="With title" virtual-triggering>
                    <span> Some content </span>
                  </el-popover> -->

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
                <span style="font-size:large;font-weight: 500;" @click="fileShow = false">
                  <el-icon>
                    <CaretBottom />
                  </el-icon>文档
                </span>
              </el-row>
              <!--文档封面图-->
              <!--如果有文档-->
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
                      <el-icon>
                        <More />
                      </el-icon>
                    </span>
                  </div>

                  <!-- <el-popover ref="popoverOp" :virtual-ref="moreOp" trigger="click" title="With title" virtual-triggering>
                    <span> Some content </span>
                  </el-popover> -->

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
import { ClickOutside as vClickOutside } from 'element-plus'
import axios from 'axios'
import { reactive, toRefs } from 'vue'
import GuideAside from '@/components/GuideAside.vue'
import Header from '@/components/Header.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadProps, UploadUserFile } from 'element-plus'
import {
  CaretBottom,
  CaretRight,
  MoreFilled,
  More,
} from '@element-plus/icons-vue'
/*侧栏*/

/*切换团队*/
const btnSwiTeam = ref()
const popoverTeam = ref()
const teamOutside = () => {
  unref(popoverTeam).popoverTeam?.delayHide?.()
}
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

const state = reactive({
  circleUrl:
    'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
  squareUrl:
    'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
  sizeList: ['small', '', 'large'],
})
const { circleUrl, squareUrl, sizeList } = toRefs(state)



const handleRemove = (file, uploadFiles) => {
  console.log(file, uploadFiles)
}

const handlePreview = (uploadFile) => {
  console.log(uploadFile)
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
const projectShow = ref(true)
const projectNum = ref(3)//项目的数量
const designShow = ref(true)
const items = ref(['Item 1', 'Item 2', 'Item 3', 'Item 3', 'Item 5', 'Item 6'])
const designNum = ref(7)//原型的数量

const fileShow = ref(true)
const fileNum = ref(0)//文件的数量

const projectButtonRef = ref()
const projectPopoverRef = ref()

const projectOut = () => {
  // console.log(logmyButton.value.textContent)
  console.log(projectPopoverRef)
  console.log( unref(projectPopoverRef))
  unref(projectPopoverRef).popperRef?.delayHide?.()
}

const invideLink = ref();
/*获取邀请链接*/
const getLink = () => {
  axios.get('http://www.aamofe.top/api/team/get_invitation/', { params: { team_id: 1 }, headers: { Authorization: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTM0ODQ1NDUsImlkIjoxfQ.8ZA60G5SWc793QCzywrXKW4lrEzFW26DqSVj7vj-7FI" } })
    .then(res => {
      // 处理响应数据
      console.log(res);

      if (res.data.errno == 0)//成功
      {
        console.log(res.data.invatation);
        invideLink.value = res.data.invatation;
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


.round {
  border-radius: 10px;
  /* 设置边框圆角半径，根据需要调整 */
}

.designImg {
  margin-bottom: 5px;
}

.designBlock {
  width: 18%;
  margin-bottom: 40px;
  margin-right: 14px;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
}

.rightContent {
  display: flex;
  text-align: right;
  justify-content: end;
}
</style>