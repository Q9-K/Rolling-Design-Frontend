<script setup>
import {ref, watch} from "vue";

const props = defineProps([
  'currentElement'
])

const currentRect = ref(null)

const radius = ref(0)
const strokeColor = ref("#ffffff")
const strokeWidth = ref(0)

if (props.currentElement) {
  currentRect.value = props.currentElement
}

watch(
  () => props.currentElement,
  (newValue, oldValue) => {
    console.log('子组件接收到的属性发生变化：', newValue, oldValue);
    // 在这里可以执行响应的操作，比如重新渲染子组件内容
    if (newValue) {
      currentRect.value = newValue
    }
  }
)

const changeRectRadius = (value) => {
  currentRect.value.attrs.cornerRadius = value
}

const changeRectStrokeWidth = (value) => {
  currentRect.value.attrs.strokeWidth = value
}

const changeRectStrokeColor = (value) => {
  currentRect.value.attrs.stroke = value
}

</script>

<template>
  <div class="rect-config">
    <div class="rect-config-box">
      <div class="rect-config-title">
        圆角
      </div>
      <el-slider
        v-model="radius"
        max="50"
        class="rect-config-setter"
        @input="value => changeRectRadius(value)"
      />
    </div>
    <div class="rect-config-box">
      <div class="rect-config-title">
        边框粗细
      </div>
      <el-slider
        v-model="strokeWidth"
        max="20"
        class="rect-config-setter"
        @input="value => changeRectStrokeWidth(value)"
      />
    </div>
    <div class="rect-config-box">
      <div class="rect-config-title">
        边框颜色
      </div>
      <el-color-picker
        v-model="strokeColor"
        class="rect-config-setter"
        @active-change="value => changeRectStrokeColor(value)"
      />
    </div>
    <!--
    TODO 有时间的话实现Rect的诸多属性的配置，虽然大概率没时间
    -->
  </div>
</template>

<style scoped lang="scss">
.rect-config {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .rect-config-box {
    width: 100%;
    height: 7vh;
    display: flex;
    flex-wrap: nowrap;
    .rect-config-title {
      width: 30%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .rect-config-setter {
      width: 60%;
      height: 100%;
      margin-left: 5%;
      margin-right: 5%;
    }
  }
}
</style>
