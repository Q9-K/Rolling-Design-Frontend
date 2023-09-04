<script setup>
import {ref, watch} from "vue";
import './widgetTypeConfig.scss'
import ConfigColor from "../../left/configDetail/ConfigColor.vue";

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
  <div class="config-outer">
    <div class="config-box">
      <div class="config-title">
        颜色
      </div>
      <ConfigColor class="config-setter" :current-element="currentRect"/>
    </div>
    <div class="config-box">
      <div class="config-title">
        圆角
      </div>
      <el-slider
        v-model="radius"
        max="50"
        class="config-setter"
        @input="value => changeRectRadius(value)"
      />
    </div>
    <div class="config-box">
      <div class="config-title">
        边框粗细
      </div>
      <el-slider
        v-model="strokeWidth"
        max="20"
        class="config-setter"
        @input="value => changeRectStrokeWidth(value)"
      />
    </div>
    <div class="config-box">
      <div class="config-title">
        边框颜色
      </div>
      <el-color-picker
        v-model="strokeColor"
        class="config-setter"
        @active-change="value => changeRectStrokeColor(value)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
