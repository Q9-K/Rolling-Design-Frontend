<script setup>
import {useRoute} from "vue-router";
import {nextTick, onMounted, ref} from "vue";
import {authStore} from "@/store";
import axios from "axios";
import Konva from "konva";

import sharePreviewLinkIcon from '@/assets/prototypeIcon/sharePreviewLinkIcon.png'
import {ElMessage, ElNotification} from "element-plus";
import PrototypeHeader from "@/components/prototype/header/PrototypeHeader.vue";

const route = useRoute()
const prototypeShareToken = route.params.token

const previewList = ref([])
const prototypeShareLink = ref('')

if (route.params.token) {
  prototypeShareLink.value = 'http://www.aamofe.top/preview/' + route.params.token
}

onMounted(() => {
  const currentUserToken = authStore().token
  const Header = { 'Authorization': currentUserToken }

  axios.get('http://www.aamofe.top/api/document/view_prototype/' + prototypeShareToken, {
    headers: Header,
  })
    .then(async (response) => {
      if (response.status === 200) {
        if (response.data.errno === 0) {
          const prototypeList = response.data.prototype
          const length = prototypeList.length
          for (let i = 0; i < length - 1; i++) {
            const item = prototypeList[i]
            previewList.value.push({
              id: item.id,
              title: item.title,
              content: item.content,
              stage: null,
              width: item.width,
              height: item.height
            })
          }
          console.log("喂喂喂")

          await nextTick()

          previewList.value.forEach((preview) => {
            const stageJSON = JSON.parse(preview.content)
            console.log(stageJSON)
            const container = document.getElementById(preview.id)
            const containerWidth = container.offsetWidth
            const containerHeight = container.offsetHeight
            console.log(containerWidth)
            console.log(containerHeight)
            let delta = containerWidth / preview.width
            if ( containerHeight / preview.height < delta ) {
              delta = containerHeight / preview.height
            }
            preview.stage = Konva.Node.create(stageJSON, '' + preview.id)
            console.log(delta)
            preview.stage.scale({
              x: delta,
              y: delta
            })
            preview.stage.draw()
          })


        }
      }
    })
})

const handleCopyShareLink = () => {
  navigator.clipboard.writeText(prototypeShareLink.value)

  ElMessage({
    message: '复制成功',
    type: 'success'
  })
}

</script>

<template>
<!--  <div class="preview-prototype-outer">-->
<!--    <PreviewPrototype-->
<!--      :prototype-token="prototypeShareToken"-->
<!--    />-->
<!--  </div>-->
  <PrototypeHeader />
  <div class="preview-prototype-outer">
    <div class="preview-prototype-graph-outer">
      <el-carousel height="100%" class="preview-carousel" :autoplay="false">
        <el-carousel-item  v-for="preview in previewList" :key="preview.id">
          <div class="preview-container-outer">
            <div :id="preview.id" class="preview-container">
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="preview-prototype-share-outer">
      <div style="height: 10vh;"></div>
      <el-popover
        trigger="click"
        popper-style="width: 300px; height: 200px; box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
        placement="left"
      >
        <template #reference>
          <img class="preview-prototype-icon" :src="sharePreviewLinkIcon" :alt="分享预览链接">
        </template>
        <template #default>
          <div style="width: 100%; height: 100%" class="preview-prototype-link-outer">
            <div style="width: 100%; height: 65%; ">
              <el-input
                v-model="prototypeShareLink"
                class="preview-prototype-link"
                disabled="disabled"
                type="textarea"
                :rows="4"
                style="text-wrap: normal; width: 100%; height: 100%"
              />
            </div>
            <div style="width: 100%; height: 5%"></div>
            <div
              style="width: 100%; height: 30%; display: flex; align-items: center; justify-content: right;"
            >
              <el-button
                type="primary"
                class="preview-prototype-link-copy"
                style="margin: 3% 2%; width: 30%;"
                @click="handleCopyShareLink"
              >
                复制链接
              </el-button>
            </div>
          </div>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<style scoped lang="scss">
.preview-prototype-outer {
  width: 100vw;
  position: fixed;
  top: 10vh;
  height: 90vh;
  display: flex;
  flex-wrap: nowrap;
  background-color: #f8f8f8;
  .preview-prototype-graph-outer {
    height: 100%;
    width: 96%;
    .preview-carousel {
      margin: 4% 5%;
      width: 92%;
      height: 90%;
      .el-carousel__container {
        width: 100%;
        height: 100%;
        .preview-container-outer {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          .preview-container {
            background-color: white;
            width: 90vw;
            height: 85vh;
            overflow: auto;
          }
        }
      }
    }
  }
  .preview-prototype-share-outer {
    height: 100%;
    width: 4%;
    .preview-prototype-icon {
      height: 6vh;
    }
  }
}
</style>
