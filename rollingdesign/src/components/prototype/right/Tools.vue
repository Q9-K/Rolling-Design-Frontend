<script setup >
import exportPNGIcon from '@/assets/icon/exportPNG.png'
import exportHTMLIcon from '@/assets/icon/exportHTML.png'
import saveGraphIcon from '@/assets/icon/saveGraph.png'
import quitPrototypeIcon from '@/assets/icon/quitPrototype.png'
import saveAsTemplateIcon from '@/assets/icon/saveAsTemplate.png'
import previewPrototypeIcon from '@/assets/icon/previewPrototype.png'
import {inject, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {authStore} from "@/store";
import axios from "axios";

const router = useRouter()

const props = defineProps([
  'saveGraph',
  'saveAsTemplate',
  'previewPrototype',
  'exportPng',
  'exportHtml',
  'currentElement',
  'isTemplate'
])

console.log(props.currentElement)

const isShare = ref(false)
const prototypeShareToken = ref('')

const handleExportPNG = () => {
  props.exportPng()
}

const handleSaveGraph = () => {
  props.saveGraph()
}

const handleExportHtml = () => {
  props.exportHtml()
}

const quitPrototype = () => {
  sessionStorage.removeItem('stageStringify')
  router.push('/index')
}

const handleSaveAsTemplate = () => {
  // console.log("save as template")
  // console.log("can u see me")
  props.saveAsTemplate()
}

const handlePreviewPrototype = () => {
  console.log("share prototype")
  props.previewPrototype()
}

const toolsList = [
  {
    title: "退出",
    handleClick: quitPrototype,
    imageSrc: quitPrototypeIcon,
  },
  {
    title: "保存",
    handleClick: handleSaveGraph,
    imageSrc: saveGraphIcon
  },
  {
    title: "预览",
    handleClick: handlePreviewPrototype,
    imageSrc: previewPrototypeIcon
  },
  {
    title: "保存为模板",
    handleClick: handleSaveAsTemplate,
    imageSrc: saveAsTemplateIcon
  },
  {
    title: "导出HTML",
    handleClick: handleExportHtml,
    imageSrc: exportHTMLIcon
  },
  {
    title: "导出为PNG",
    handleClick: handleExportPNG,
    imageSrc: exportPNGIcon
  }
]

watch(
  () => props.isTemplate,
  (newValue, oldValue) => {
    if (newValue === true) {
      toolsList.filter((item) => {
        return item.title !== '保存为模板';
      })
    }
  }
)

</script>

<template>
  <div class="right-tools">
    <div style="width: 100%; height: 2vh"></div>
    <div v-for="tool in toolsList" class="single-tool">
      <el-tooltip
        v-if="tool.title !== '预览'"
        :content="tool.title"
        effect="light"
        placement="right"
      >
        <img @click="tool.handleClick" class="tool-icon" :src="tool.imageSrc" :alt="tool.title">
      </el-tooltip>
      <el-popover
        v-if="tool.title === '预览'"
        placement="left"
        trigger="click"
        popper-style="width: 300px; height: 200px; box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
      >
        <template #reference>
          <img @click="tool.handleClick" class="tool-icon" :src="tool.imageSrc" :alt="tool.title">
        </template>
        <template #default>
          <div style="display: flex; flex-wrap: wrap">
            <div>
              <el-switch
                v-model="isShare"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                active-text="分享预览"
                inactive-text="取消分享"
              />
            </div>
            <div>
              <el-input

              />
            </div>
          </div>
        </template>
      </el-popover>
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
