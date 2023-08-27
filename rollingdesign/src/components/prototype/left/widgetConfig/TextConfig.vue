<script setup>
import './widgetTypeConfig.scss'
import {ref, watch} from "vue";

const props = defineProps([
  'currentElement'
])

const currentText = ref(null)
const textSize = ref(12)

if (props.currentElement) {
  currentText.value = props.currentElement
}

watch(
  () => props.currentElement,
  (newValue, oldValue) => {
    console.log('子组件接收到的属性发生变化：', newValue, oldValue);
    // 在这里可以执行响应的操作，比如重新渲染子组件内容
    if (newValue) {
      currentText.value = newValue
    }
  }
)

const changeTextSize = (value) => {
  console.log(value)
  // currentText.value.attrs.fontSize = value
}
</script>

<template>
  <div class="config-outer">
    <div class="config-box">
      <!--
      <div class="config-title">
        字号
      </div>
      <el-slider
        v-model="textSize"
        min="2"
        max="30"
        class="config-setter"
        @input="value => changeTextSize(value)"
      />
      -->
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
