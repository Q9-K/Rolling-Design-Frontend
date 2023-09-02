<script setup >
import exportPNGIcon from '@/assets/prototypeIcon/exportPNG.png'
import exportHTMLIcon from '@/assets/prototypeIcon/exportHTML.png'
import saveGraphIcon from '@/assets/prototypeIcon/saveGraph.png'
import quitPrototypeIcon from '@/assets/prototypeIcon/quitPrototype.png'
import saveAsTemplateIcon from '@/assets/prototypeIcon/saveAsTemplate.png'
import previewPrototypeIcon from '@/assets/prototypeIcon/previewPrototype.png'
import {inject, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {authStore} from "@/store";
import axios from "axios";
import qs from "qs";
import {ElMessage} from "element-plus";

const router = useRouter()

const props = defineProps([
  'saveGraph',
  'saveAsTemplate',
  'previewPrototype',
  'exportPng',
  'exportHtml',
  'currentElement',
  'isTemplate',
  "designId"
])

console.log(props.currentElement)

const isShare = ref(true)
const prototypeShareToken = ref('')
const prototypeShareLink = ref('')
const previewBoxHeight = ref(228)

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
  // props.previewPrototype()

  const Headers = { 'Authorization': authStore().token }

  axios.post('http://www.aamofe.top/api/document/share_prototype/', qs.stringify({
    prototype_id: props.designId,
    visible: "1"
  }), {
    headers: Headers
  })
    .then((response) => {
      if (response.status === 200) {
        if (response.data.errno === 0) {
          prototypeShareToken.value = response.data.token
          prototypeShareLink.value = "http://www.aamofe.top/preview/" + response.data.token
            // console.log(previewPrototypeToken.value)
          // isPreviewOpen.value = true
          console.log(response.data)
        }
      }
    })
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

const handleCopyShareLink = () => {
  navigator.clipboard.writeText(prototypeShareLink.value)

  ElMessage({
    message: '复制成功',
    type: 'success'
  })
}

const handleShareStatusChange = (value) => {
  isShare.value = value
  if (value === false) {
    axios.post('http://www.aamofe.top/api/document/share_prototype/', qs.stringify({
      prototype_id: props.designId,
      visible: "0"
    }), {
      headers: {
        Authorization: authStore().token
      }
    }).then((response) => {
        if (response.status === 200) {
          if (response.data.errno === 0) {
            previewBoxHeight.value = 40
            ElMessage({
              message: "取消分享成功",
              type: "success"
            })
          }
        }
      })
  }
  else if (value === true) {
    axios.post('http://www.aamofe.top/api/document/share_prototype/', qs.stringify({
      prototype_id: props.designId,
      visible: "1"
    }), {
      headers: {
        Authorization: authStore().token
      }
    }).then((response) => {
        if (response.status === 200) {
          if (response.data.errno === 0) {
            previewBoxHeight.value = 228
            ElMessage({
              message: "分享预览成功",
              type: "success"
            })
          }
        }
      })
  }
}

</script>

<template>
  <div class="right-tools">
    <div style="width: 100%; height: 2vh"></div>
    <div v-for="tool in toolsList" class="single-tool">
      <el-tooltip
        :content="tool.title"
        effect="light"
        placement="right"
        trigger="hover"
      >
        <img
          v-if="tool.title !== '预览'"
          @click="tool.handleClick"
          class="tool-icon"
          :src="tool.imageSrc"
          :alt="tool.title"
        >
        <div v-if="tool.title === '预览'">
          <el-popover
            placement="left"
            trigger="click"
            popper-style="width: 300px; height: 228px; box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
          >
            <template #reference>
              <img @click="tool.handleClick" class="tool-icon" :src="tool.imageSrc" :alt="tool.title">
            </template>
            <template #default>
              <div style="display: flex; flex-wrap: wrap;">
                <div style="width: 100%; display: flex; justify-content: center">
                  <el-switch
                    v-model="isShare"
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                    active-text="分享预览"
                    inactive-text="取消分享"
                    @change="val => handleShareStatusChange(val)"
                  />
                </div>
                <div style="width: 100%; height: 12px"></div>
                <div style="width: 100%">
                  <el-input
                    disabled
                    rows="4"
                    type="textarea"
                    v-model="prototypeShareLink"
                  />
                </div>
                <div style="width: 100%; height: 10px"></div>
                <div style="width: 100%; display: flex; justify-content: right">
                  <el-button
                    v-if="isShare === true"
                    type="primary"
                    style="margin: 3% 2%; width: 30%;"
                    @click="handleCopyShareLink"
                  >
                    复制链接
                  </el-button>
                  <el-button
                    v-if="isShare === false"
                    type="primary"
                    style="margin: 3% 2%; width: 30%;"
                    disabled
                  >
                    复制链接
                  </el-button>
                </div>
              </div>
            </template>
          </el-popover>
        </div>
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
