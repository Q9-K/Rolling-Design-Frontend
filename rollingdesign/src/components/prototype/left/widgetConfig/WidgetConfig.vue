<script setup>
import {ref, watch} from "vue";
import RectConfig from "@/components/prototype/left/widgetConfig/RectConfig.vue";
import {Rect} from "konva/lib/shapes/Rect";

const props = defineProps([
  'currentElement'
])

const widgetType = ref(null)

const handleDifferentType = (widget) => {
  if (widget instanceof Rect) {
    widgetType.value = 'rect'
  }
}

watch(
  () => props.currentElement,
  (newValue, oldValue) => {
    console.log('子组件接收到的属性发生变化：', newValue, oldValue);
    // 在这里可以执行响应的操作，比如重新渲染子组件内容
    if (newValue) {
      handleDifferentType(newValue)
    }
  }
)

</script>

<template>
  <div class="widget-config">
    <RectConfig
      v-if="widgetType === 'rect'"
      :current-element="currentElement"
    />
    <p v-else>
      哈哈哈
    </p>
  </div>
</template>

<style scoped lang="scss">

</style>
