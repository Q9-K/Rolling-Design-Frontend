<script setup>
import {ref, toRaw, watch} from "vue";
import RectConfig from "@/components/prototype/left/widgetConfig/RectConfig.vue";
import {Rect} from "konva/lib/shapes/Rect";
import {Text} from "konva/lib/shapes/Text";
import TextConfig from "@/components/prototype/left/widgetConfig/TextConfig.vue";
import KonvaRadio from "@/components/prototype/konvaWidget/KonvaRadio";
import KonvaRect from "@/components/prototype/konvaWidget/KonvaRect";
import KonvaText from "@/components/prototype/konvaWidget/KonvaText";
import RadioConfig from "@/components/prototype/left/widgetConfig/RadioConfig.vue";
import KonvaSelect from "@/components/prototype/konvaWidget/KonvaSelect";
import SelectConfig from "@/components/prototype/left/widgetConfig/SelectConfig.vue";

const props = defineProps([
  'currentElement'
])

const widgetType = ref(null)

const handleDifferentType = (widget) => {
  console.log(widget)
  if (widget instanceof KonvaRect) {
    widgetType.value = 'rect'
  }
  else if (widget instanceof KonvaText) {
    widgetType.value = 'text'
  }
  else if (widget instanceof KonvaRadio) {
    widgetType.value = 'radio'
  }
  else if (widget instanceof KonvaSelect) {
    widgetType.value = 'select'
  }
}

watch(
  () => props.currentElement,
  (newValue, oldValue) => {
    console.log('子组件接收到的属性发生变化：', newValue, oldValue);
    // 在这里可以执行响应的操作，比如重新渲染子组件内容
    if (newValue) {
      handleDifferentType(toRaw(newValue))
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
    <TextConfig
      v-else-if="widgetType === 'text'"
      :current-element="currentElement"
    />
    <RadioConfig
      v-else-if="widgetType === 'radio'"
      :current-element="currentElement"
    />
    <SelectConfig
      v-else-if="widgetType === 'select'"
      :current-element="currentElement"
    />
    <p v-else>
      哈哈哈
    </p>
  </div>
</template>

<style scoped lang="scss">

</style>
