<template>
  <div style="position:absolute;left:48%;top:40%">
    <div v-for="( item, index) in list" :key="index" style="margin-bottom: 10px;">
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
  </div>

  <!--搜索-->
  <!-- <div>
    <input type="text" v-model="searchKeyword" placeholder="Search" />

    <ul>
      <li v-for="item in filteredItems" :key="item">{{ item }}</li>
    </ul>
  </div> -->
</template>

<script setup>
import { computed } from 'vue';
import { ref, unref } from 'vue'
import { ClickOutside as vClickOutside } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  CaretBottom,
  CaretRight,
  MoreFilled,
  More,
} from '@element-plus/icons-vue'
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
//-----
const items = ref(['Apple', 'Banana', 'Cherry', 'Date', 'Grape']);
const searchKeyword = ref('');

// 使用计算属性来过滤数组
const filteredItems = computed(() => {
  const keyword = searchKeyword.value.toLowerCase();
  return items.value.filter(item => item.toLowerCase().includes(keyword));
});
</script>

<style scoped>
.img-size {
  width: 80px;
  height: 80px;
}

.highlighted-row {
  background-color: rgb(237, 237, 237);
}

.round {
  border-radius: 10px;
  /* 设置边框圆角半径，根据需要调整 */
}

.block {
  width: 150px;
  height: 150px;
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
</style>