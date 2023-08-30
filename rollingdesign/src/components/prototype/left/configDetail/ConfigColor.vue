<script setup>
import {ref, watch} from "vue";

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

const props = defineProps(['currentElement'])

let pickedColor = ref(null)

if (!props.currentElement) {
  pickedColor.value = "#409EFF"
}
else {
  pickedColor.value = props.currentElement.attrs.fill
}

const changeCurrentColor = (value) => {
  pickedColor.value = value
  props.currentElement.attrs.fill = value
}

</script>

<template>
  <el-color-picker v-model="pickedColor" @active-change="changeCurrentColor" />
</template>

<style scoped lang="scss">

</style>
