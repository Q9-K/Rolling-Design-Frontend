<template>
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
        <span class="rightContent">
    
          <el-popover placement="bottom" :width="400" trigger="click">
            <template #reference>
              <el-icon>
                <More />
              </el-icon>
            </template>
            hello
          </el-popover>
        </span>
      </div>

    </div>
  </el-row>
  <!--如果没有项目-->
  <el-row v-else>
    <img class="round" src="@/assets/noFile.png" style="width: 100%;" />
  </el-row>
</template>


<script setup>
import axios from 'axios'
import { reactive, toRefs } from 'vue'
import { ref, unref } from 'vue'
import { onMounted } from 'vue'
import { ClickOutside as vClickOutside } from 'element-plus'
import {
  CaretBottom,
  CaretRight,
  MoreFilled,
  More,
} from '@element-plus/icons-vue'

const projectNum = ref(3)//
const items = ref(['Item 1', 'Item 2', 'Item 3', 'Item 3', 'Item 5', 'Item 6'])

const buttonRef = ref()
const popoverRef = ref()
const onClickOutside = () => {
  // console.log('hh');
  // console.log(popoverRef);
  unref(popoverRef).popperRef?.delayHide?.()
  // popoverRef.value.doClose()
}
</script>

<style>
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
</style>