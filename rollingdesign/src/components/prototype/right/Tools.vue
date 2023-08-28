<script setup >
import exportPNGIcon from '@/assets/icon/exportPNG.png'
import exportHTMLIcon from '@/assets/icon/exportHTML.png'
import saveGraphIcon from '@/assets/icon/saveGraph.png'
import quitPrototypeIcon from '@/assets/icon/quitPrototype.png'
import {inject, ref, watch} from "vue";
import {useRouter} from "vue-router";

const router = useRouter()

const props = defineProps([
  'saveGraph',
  'exportPng',
  'exportHtml',
  'currentColor',
  'currentElement'
])

watch(
  () => props.currentElement,
  (newValue, oldValue) => {
    console.log('子组件接收到的属性发生变化：', newValue, oldValue);
    // 在这里可以执行响应的操作，比如重新渲染子组件内容
    if (!newValue) {
      pickedColor.value = "#409EFF"
    }
    else {
      pickedColor.value = newValue.attrs.fill
    }
  }
);

let pickedColor = ref(null)

console.log(props.currentElement)

if (!props.currentElement) {
  pickedColor.value = "#409EFF"
}
else {
  pickedColor.value = props.currentElement.attrs.fill
}

const handleExportPng = () => {
  props.exportPng()
}

const handleSaveGraph = () => {
  props.saveGraph()
}

const handleExportHtml = () => {
  props.exportHtml()
}

const changeCurrentColor = (value) => {
  pickedColor.value = value
  props.currentElement.attrs.fill = value
}

const quitPrototype = () => {
  sessionStorage.removeItem('stageStringify')
  router.push('/index')
}

</script>

<template>
  <div class="right-tools">
    <div style="width: 100%; height: 2vh"></div>
    <div class="single-tool">
      <el-tooltip
        content="推出"
        effect="light"
        placement="right"
      >
        <img @click="quitPrototype" class="tool-icon" :src="quitPrototypeIcon" alt="退出">
      </el-tooltip>
    </div>
    <div class="single-tool">
      <el-tooltip
        content="保存"
        effect="light"
        placement="right"
      >
        <img @click="handleSaveGraph" class="tool-icon" :src="saveGraphIcon" alt="保存">
      </el-tooltip>
    </div>
    <div class="single-tool">
      <el-tooltip
        content="导出HTML"
        effect="light"
        placement="right"
      >
        <img @click="handleExportHtml" class="tool-icon" :src="exportHTMLIcon" alt="导出HTML">
      </el-tooltip>
    </div>
    <div class="single-tool">
      <el-tooltip
        content="导出PNG"
        effect="light"
        placement="right"
      >
        <img @click="handleExportPng" class="tool-icon" :src="exportPNGIcon" alt="导出PNG">
      </el-tooltip>
    </div>
    <div class="single-tool">
      <el-tooltip
        content="选择颜色"
        effect="light"
        placement="right"
      >
        <el-color-picker v-model="pickedColor" @active-change="changeCurrentColor" />
      </el-tooltip>
    </div>
  </div>
</template>

<style scoped lang="scss">
.right-tools {
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: start;
  .single-tool {
    width: 100%;
    height: 8%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    .tool-icon {
      height: 5vh;
      width: 5vh;
    }
  }
}
</style>
