<script setup>
import textWidgetIcon from '@/assets/icon/textWidgetIcon.png'
import imageWidgetIcon from '@/assets/icon/imageWidgetIcon.png'
import buttonWidgetIcon from '@/assets/icon/buttonWidgetIcon.png'
import inputWidgetIcon from '@/assets/icon/inputWidgetIcon.png'
import choiceWidgetIcon from '@/assets/icon/choiceWidgetIcon.png'
import rectWidgetIcon from '@/assets/icon/rectWidgetIcon.png'
import switchWidgetIcon from '@/assets/icon/switchWidgetIcon.png'
import sliderWidgetIcon from '@/assets/icon/sliderWidgetIcon.png'
import selectWidgetIcon from '@/assets/icon/selectWidgetIcon.png'
import inputNumberWidgetIcon from '@/assets/icon/inputNumberWidgetIcon.png'
import WidgetConfig from "@/components/prototype/left/widgetConfig/WidgetConfig.vue";

import {ref, toRefs, watch, provide} from "vue";

const props = defineProps([
  'setGraphSize',
  'addText',
  'addImage',
  'addButton',
  'addInput',
  'addRadio',
  'addRect',
  'addSwitch',
  'addSlider',
  'addSelect',
  'addInputNumber',
  'currentElement',
  'prototypeTitle',
  "initialSize"
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
    title: "点击选择",
    icon: choiceWidgetIcon,
    key: "choice",
    handleClick: props.addRadio
  },
  {
    title: "矩形",
    icon: rectWidgetIcon,
    key: "rect",
    handleClick: props.addRect
  },
  {
    title: "开关",
    icon: switchWidgetIcon,
    key: "switch",
    handleClick: props.addSwitch
  },
  {
    title: "滑块",
    icon: sliderWidgetIcon,
    key: "slider",
    handleClick: props.addSlider
  },
  {
    title: "下拉选择",
    icon: selectWidgetIcon,
    key: "select",
    handleClick: props.addSelect
  },
  {
    title: "数字输入",
    icon: inputNumberWidgetIcon,
    key: "inputNumber",
    handleClick: props.addInputNumber
  }
]

const prototypeName = ref('')
const activeNames = ref(['page-config', 'add-widget'])

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

watch(
  () => props.prototypeTitle,
  (newValue, oldValue) => {
    console.log('子组件接收到的属性发生变化：', newValue, oldValue);
    // 在这里可以执行响应的操作，比如重新渲染子组件内容
    if (newValue) {
      prototypeName.value = props.prototypeTitle
    }
  }
);

if (props.currentElement) {
  activeNames.value = ['widget-config']
}

const graphWidth = ref()
const graphHeight = ref()

if (props.initialSize) {
  graphWidth.value = props.initialSize.width
  graphHeight.value = props.initialSize.height
}

watch(
  () => props.initialSize,
  (newValue) => {
    graphWidth.value = newValue.width
    graphHeight.value = newValue.height
  }
)

const handleSetGraphWidth = (value) => {
  graphWidth.value = value
  setGraphSize()
}

const handleSetGraphHeight = (value) => {
  graphHeight.value = value
  setGraphSize()
}

const setGraphSize = () => {
  props.setGraphSize({
    width: graphWidth.value,
    height: graphHeight.value
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
            画布宽度
          </p>
          <el-input-number
            v-model="graphWidth"
            class="select-size"
            :min="10"
            :max="5000"
            @change="cur => handleSetGraphWidth(cur)"
          />
        </div>
        <div style="width: 100%; height: 3vh" ></div>
        <div class="select-size-box">
          <p class="select-size-title">
            画布高度
          </p>
          <el-input-number
            v-model="graphHeight"
            class="select-size"
            :min="10"
            :max="5000"
            @change="cur => handleSetGraphHeight(cur)"
          />
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
          margin-right: 5%;
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
