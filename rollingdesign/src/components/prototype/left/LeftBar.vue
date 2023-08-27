<script setup>
import textWidgetIcon from '@/assets/icon/textWidgetIcon.png'
import imageWidgetIcon from '@/assets/icon/imageWidgetIcon.png'
import buttonWidgetIcon from '@/assets/icon/buttonWidgetIcon.png'
import inputWidgetIcon from '@/assets/icon/inputWidgetIcon.png'
import choiceWidgetIcon from '@/assets/icon/choiceWidgetIcon.png'
import rectWidgetIcon from '@/assets/icon/rectWidgetIcon.png'
import {ref, toRefs, watch, provide} from "vue";
import WidgetConfig from "@/components/prototype/left/widgetConfig/WidgetConfig.vue";

const props = defineProps([
  'setGraphSize',
  'addText',
  'addImage',
  'addButton',
  'addInput',
  'addRadio',
  'addRect',
  'currentElement'
])

const widgets = [
  {
    title: "文本",
    icon: textWidgetIcon,
    key: "title",
    handleClick: props.addText
  },
  {
    title: "图片",
    icon: imageWidgetIcon,
    key: "image",
    handleClick: props.addImage
  },
  {
    title: "输入框",
    icon: inputWidgetIcon,
    key: "input",
    handleClick: props.addInput
  },
  {
    title: "按钮",
    icon: buttonWidgetIcon,
    key: "button",
    handleClick: props.addButton
  },
  {
    title: "选择",
    icon: choiceWidgetIcon,
    key: "choice",
    handleClick: props.addRadio
  },
  {
    title: "矩形",
    icon: rectWidgetIcon,
    key: "rect",
    handleClick: props.addRect
  }
]

const prototypeName = ref('')
const activeNames = ref(['page-config', 'add-widget'])
const currentSize = ref("16 × 9")

watch(
  () => props.currentElement,
  (newValue, oldValue) => {
    console.log('子组件接收到的属性发生变化：', newValue, oldValue);
    // 在这里可以执行响应的操作，比如重新渲染子组件内容
    if (newValue) {
      activeNames.value = ['widget-config']
    }
  }
);

if (props.currentElement) {
  activeNames.value = ['widget-config']
}

const sizeOptions = [
  {
    value: {
      width: 950.4,
      height: 534.6
    },
    label: "16 × 9",
  },
  {
    value: {
      width: 720,
      height: 540
    },
    label: "4 × 3",
  }
]

const setGraphSize = (value) => {
  props.setGraphSize({
    width: value.width,
    height: value.height
  })
}

const setPrototypeName = (value) => {
  prototypeName.value = value
  console.log(value)
  sessionStorage.setItem("prototypeName", prototypeName.value)
}

</script>

<template>
  <div class="left-bar">
    <div class="prototype-name-box">
      <div class="prototype-name-tile">
        设计名
      </div>
      <el-input
        v-model="prototypeName"
        class="prototype-name-input"
        @input="value => setPrototypeName(value)"
      />
    </div>
    <el-collapse v-model="activeNames" class="collapse-outer">
      <el-collapse-item name="page-config" title="设置" class="page-config">
        <div class="select-size-box">
          <p class="select-size-title">
            画布比例
          </p>
          <el-select
            class="select-size"
            v-model="currentSize"
            placeholder="Select"
            @change="(value) => setGraphSize(value)"
          >
            <el-option
              v-for="item in sizeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </el-collapse-item>
      <el-collapse-item name="add-widget" title="组件库" class="add-widget">
        <div class="widget-list">
          <div
            v-for="item in widgets"
            @click="item.handleClick"
            :key="item.key"
            class="single-widget"
          >
            <div class="widget-icon-outer">
              <img class="widget-icon" :alt="item.title" :src="item.icon">
            </div>
            <div class="widget-title-outer">
              <div class="widget-title">
                {{ item.title }}
              </div>
            </div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item name="widget-config" title="组件配置" class="widget-config-outer">
        <WidgetConfig
          :current-element="props.currentElement"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped lang="scss">

.left-bar {
  position: relative;
  top: 2vh;
  width: 100%;
  height: calc(100% - 4vh);
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  background-color: white;
  .prototype-name-box {
    width: 90%;
    height: 10%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    padding: 2% 5%;
    .prototype-name-tile {
      width: 30%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .prototype-name-input {
      width: 70%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .collapse-outer {
    width: 97%;
    // height: 100%;
    padding-left: 3%;
    .page-config {
      width: 100%;
      .select-size-box {
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;
        .select-size-title {
          height: 100%;
          width: 30%;
        }
        .select-size {
          height: 100%;
          width: 70%;
          padding-right: 5%;
          display: flex;
          justify-content: center;
          align-items: center
        }
      }
    }
    .add-widget {
      width: 100%;
      .widget-list {
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        .single-widget {
          width: 25%;
          height: 15%;
          display: flex;
          flex-wrap: wrap;
          cursor: pointer;
          margin-bottom: 1.5vh;
          .widget-icon-outer {
            height: 65%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            .widget-icon {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 6vh;
              width: 6vh;
            }
          }
          .widget-title-outer {
            width: 100%;
            height: 35%;
            .widget-title {
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100%;
            }
          }
        }
      }
    }
    .widget-config-outer {
      width: 100%;
    }
  }
}
</style>