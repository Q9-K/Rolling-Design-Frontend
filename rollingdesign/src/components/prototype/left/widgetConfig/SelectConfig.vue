<script setup>

import {ref, watch} from "vue";

const props = defineProps([
  'currentElement'
])

const currentSelect = ref(null)
const newSelectOption = ref('')

if (props.currentElement) {
  currentSelect.value = props.currentElement
}

watch(
  () => props.currentElement,
  (newValue, oldValue) => {
    console.log('子组件接收到的属性发生变化：', newValue, oldValue);
    // 在这里可以执行响应的操作，比如重新渲染子组件内容
    if (newValue) {
      currentSelect.value = newValue
      console.log(currentSelect.value)
    }
  }
)

const handleAddOptions = () => {
  currentSelect.value.addOptions({
    label: newSelectOption.value,
    value: newSelectOption.value
  })
  console.log(currentSelect.value)
}

const handleNewOptionsInput = (value) => {
  newSelectOption.value = value
}

const handleDeleteOptions = (value) => {
  currentSelect.value.deleteOptions({
    label: value,
    value: value
  })
}

</script>

<template>
  <div class="config-outer">
    <div class="config-box">
      <el-button
        @click="handleAddOptions"
        type="primary"
        class="config-title"
        style="height: 70%;"
      >
        添加选项
      </el-button>
      <el-input
        class="config-setter"
        v-model="newSelectOption"
        @change="value => handleNewOptionsInput(value)"
        style="height: 70%;"
      />
    </div>
    <div v-for="option in currentSelect.options" :key="option.value" class="config-box">
      <el-button
        @click="handleDeleteOptions(option.value)"
        type="danger"
        class="config-title"
        style="height: 70%;"
      >
        删除选项
      </el-button>
      <div class="config-setter">
        <p style="height: 100%; font-size: 27px">
          {{ option.label }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
