<script setup>
import {nextTick, onBeforeMount, onMounted, ref, watch} from "vue";
import axios from "axios";
import {authStore} from "@/store";
import Konva from "konva";

const props = defineProps([
  'prototypeToken',
])

const previewList = ref([])
const prototypeShareToken = ref('')
const previewShareLink = ref('')

// console.log("can u see me")

prototypeShareToken.value = props.prototypeToken
previewShareLink.value = 'http://www.aamofe.top/preview/' + props.prototypeToken

onMounted(() => {

  const currentUserToken = authStore().token
  const Header = { 'Authorization': currentUserToken }

  console.log(prototypeShareToken.value)

  axios.get('http://www.aamofe.top/api/document/view_prototype/' + prototypeShareToken.value, {
    headers: Header,
    // params: {
    //   prototype_id: 1
    // }
  })
    .then(async (response) => {
      if (response.status === 200) {
        if (response.data.errno === 0) {
          const prototypeList = response.data.prototype
          // previewList.value = prototypeList.map((item, index) => {
          //   return {
          //     id: item.id,
          //     title: item.title,
          //     content: item.content,
          //     stage: null,
          //     width: item.width,
          //     height: item.length            }
          // })
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


</script>

<template>
  <div class="preview">
    <div class="preview-carousel-outer">
      <el-carousel height="100%" class="preview-carousel" :autoplay="false">
        <el-carousel-item  v-for="preview in previewList" :key="preview.id">
          <div class="preview-container-outer">
            <div :id="preview.id" class="preview-container">
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="preview-share-outer">
      <div class="preview-share-link-outer">
        <div class="preview-share-link">
          {{ previewShareLink }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.preview {
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  background-color: #8c939d;
  .preview-carousel-outer {
    height: 100%;
    width: 80%;
    .preview-carousel {
      margin: 4% 5%;
      width: 92%;
      height: 90%;
      .el-carousel__container {
        width: 100%;
        height: 100%;
        .preview-container-outer {
          width: 90%;
          height: 92%;
          margin: 4% 5%;
          display: flex;
          justify-content: center;
          align-items: center;
          .preview-container {
            background-color: white;
            max-width: 100%;
            max-height: 100%;
            overflow: auto;
          }
        }
      }
    }
  }
  .preview-share-outer {
    height: 100%;
    width: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
    .preview-share-link-outer {
      width: 100%;
      height: 25%;
      display: flex;
      justify-content: center;
      align-items: center;
      .preview-share-link {
        color: white;
        width: 100%;
        white-space: normal;
        word-break: break-all;
        overflow: hidden;
      }
    }
  }
}
</style>
