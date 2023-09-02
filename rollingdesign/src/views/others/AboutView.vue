<template>
  <!--主页-->
  <div class="common-layout">
    <el-container>
      <!--侧边-->
      <el-aside width="15%">
        <!--侧栏，引入-->
        <GuideAside />
      </el-aside>
      <!--侧边结束-->

      <el-container>
        <!--顶部-->
        <el-header style="padding-top:13px">
          <Header />
        </el-header>

        <el-divider />
        <!--顶部结束-->

        <!--主页面，不同的地方-->
        <el-main>
          <!--文件夹内部-->
          <el-page-header @back="goBack">
            <template #content>
              <span class="text-large font-600 mr-3"> Title </span>
            </template>
          </el-page-header>
          <div>
            <el-row>
              <div class="designBlock" v-for="item, index) in list" :key="index">
                <!-- <div style="width:100%">
                  <img class="round designImg" src="@/assets/projectImage.png" style="width:90%;height:150px" />
                </div>
                <div style="display:flex;justify-content: space-between;width:90%">
                  <span class="designName" style="padding-left:4px;display: flex;">
                    hh
                  </span>
                </div> -->
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
                        <el-dropdown-menu>
                          <el-dropdown-item @click="rename(index)">Action 1</el-dropdown-item>
                          <el-dropdown-item>
                            Action 2
                          </el-dropdown-item>
                          <el-dropdown-item>Action 3</el-dropdown-item>
                          <el-dropdown-item>Action 4</el-dropdown-item>
                          <el-dropdown-item>Action 5</el-dropdown-item>
                        </el-dropdown-menu>
                      </template>

                    </el-dropdown>
                  </div>
                  <div v-else
                    style="display: flex;justify-content:flex-end;text-align: right;justify-items: flex-end;justify-self: right;">
                    &nbsp;&nbsp;
                  </div>

                  <div class="fileBlock">
                    <!-- <img class="img-size" src="@/assets/projects/folder.png" /> -->
                    <!-- <img class="img-size" src="@/assets/projects/word.jpg" /> -->
                    <img class="img-size" src="@/assets/projects/design.png" />

                    name
                  </div>
                </div>
              </div>
            </el-row>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadProps, UploadUserFile } from 'element-plus'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
  Avatar,
  ArrowDown,
  Edit,
  Platform,
  Bell,
  Tools,
  SwitchButton,
  Plus,
  HomeFilled,
  Share,
  DeleteFilled,
  Comment,
  Grid,
} from '@element-plus/icons-vue'
/*侧栏*/

/*切换团队*/

/*侧栏导航栏*/
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}
const goBack = () => {
  console.log('go back');
  router.go(-1);
}

/*跳转对应页*/
const jumpTo = (path) => {
  //this.$router.push('/video/'+video_id);
  const path_url = '/' + path;
  window.open(path_url, '_self');
}
/*侧栏导航栏结束*/

const list = ref(['item1', 'item2']);
// import type { UploadProps } from 'element-plus'
// const i = ref(1);
const highlightIndex = ref(-1);
const moreIndex = ref(-1);
const clickIndex = ref(-1);

const highlightBlock = (index) => {
  highlightIndex.value = index;
  moreIndex.value = index;
  // console.log('ii:' + index);

  // console.log('11--' + highlightIndex.value);

};

const resetBlock = (index) => {
  // if (flag.value<0) {
  highlightIndex.value = -1;
  moreIndex.value = -1;
  // }
  // console.log('i:' + index.value);
  // console.log('r:' + highlightIndex.value);
  // console.log('c:' + clickIndex.value);

};
const flagtimes = ref([0, 0, 0]);
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
const rename = () => {
  clickIndex.value = -1;
  // console.log('rr:' + highlightIndex.value);
  // console.log('cc:' + clickIndex.value);
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
  border-radius: 10px;
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

.designBlock {
  width: 18%;
  margin-bottom: 40px;
  margin-right: 14px;
  /* text-align: left; */
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

.block {
  width: 150px;
  height: 150px;
  border-radius: 10px;
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
.highlighted-row {
  background-color: rgb(237, 237, 237);
}
</style>
