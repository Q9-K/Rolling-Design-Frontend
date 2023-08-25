<!--
  原型设计中的左侧组件菜单组件
-->
<script setup>
import BackgroundWidget from "@/components/prototype/widgets/BackgroundWidget.vue";
import ImageWidget from "@/components/prototype/widgets/ImageWidget.vue";
import TextWidget from "@/components/prototype/widgets/TextWidget.vue";

import imageIcon from '@/assets/icon/imageIcon.png'
import textIcon from '@/assets/icon/textIcon.png'
import backgroundIcon from '@/assets/icon/backgroundIcon.png'
import {ref} from "vue";

let current = ref(null)

const widgets = [
  {
    type: 'image',
    component: ImageWidget,
    name: '图片',
    icon: imageIcon
  },
  {
    type: 'background',
    component: BackgroundWidget,
    name: '背景',
    icon: backgroundIcon
  },
  {
    type: 'text',
    component: TextWidget,
    name: '文本',
    icon: textIcon
  },
]

const handleWidgetClick = (item) => {
  console.log(item)
  current.value = item
}

</script>

<template>
  <div class="left-side">
    <!--最左侧的大类型图标，保留-->
    <ul class="widget-list">
      <li v-for="item in widgets" :key="item.type" @click="handleWidgetClick(item)">
          <i style="width: 100%; height: 100%">
            <el-tooltip
              class="widget-item"
              effect="dark"
              :content="item.name"
              placement="right"
              transition="el-zoom-in-center"
            >
              <img class="widget-icon" :src="item.icon" />
            </el-tooltip>
          </i>
      </li>
    </ul>
    <!--选中大类型后的具体小组件，保留-->
    <div v-if="current" class="widget-container">
      <!--这里的component仅仅是占位符号，实际上渲染的是current.component对应的组件-->
      <component :is="current.component" :key="current.component" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.left-side {
  background-color: #c4c2c2;
  box-sizing: border-box;
  border-right: 1px solid rgb(224, 224, 224);
  display: flex;
  .widget-list {
    width: 40px;
    height: 100%;
    border-right: 1px solid rgb(224, 224, 224);
    .widget-item {
      display: block;
      width: 40px;
      height: 40px;
      cursor: pointer;
      text-align: center;
      line-height: 40px;
      font-size: 20px;
      transition: 0.2s;
      border-radius: 2px;
      .widget-icon {
        width: 100%;
        height: 100%;
      }
      /* color: #fff; */
      &:hover,
      &.active {
        background-color: white;
        color: #fff;
      }
    }
  }
  .widget-container {
    width: 200px;
    height: 100%;
  }
}
</style>