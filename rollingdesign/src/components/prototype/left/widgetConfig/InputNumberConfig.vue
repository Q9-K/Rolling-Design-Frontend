<script setup>
import './widgetTypeConfig.scss'
import {ref, watch} from "vue";

const props = defineProps([
  'currentElement'
])

const currentInputNumber = ref(null)

if (props.currentElement) {
  currentInputNumber.value = props.currentElement
}

watch(
  () => props.currentElement,
  (newValue, oldValue) => {
    console.log('子组件接收到的属性发生变化：', newValue, oldValue);
    // 在这里可以执行响应的操作，比如重新渲染子组件内容
    if (newValue) {
      currentInputNumber.value = newValue
    }
  }
)

const minimize = ref(-10)
const maximize = ref(10)

const handleMinimizeChange = (value) => {
  minimize.value = value
  currentInputNumber.value.min = value
}

const handleMaximizeChange = (value) => {
  maximize.value = value
  currentInputNumber.value.max = value
}

</script>

<template>
  <div class="config-outer">
    <div class="config-box">
      <div class="config-title">
        最小值
      </div>
      <el-input-number
        v-model="minimize"
        @change="cur => handleMinimizeChange(cur)"
        :min="-100"
        :max="100"
        class="config-setter"
        style="height: 80%;"
      />
    </div>
    <div class="config-box">
      <div class="config-title">
        最大值
      </div>
      <el-input-number
        v-model="maximize"
        @change="cur => handleMaximizeChange(cur)"
        :min="-100"
        :max="100"
        class="config-setter"
        style="height: 80%;"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
