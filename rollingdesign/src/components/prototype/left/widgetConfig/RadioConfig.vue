<script setup>
import {ref, watch} from "vue";
import './widgetTypeConfig.scss'

const props = defineProps([
  'currentElement'
])

const currentRadio = ref(null)
const newRadioOption = ref('')

if (props.currentElement) {
  currentRadio.value = props.currentElement
}

watch(
  () => props.currentElement,
  (newValue, oldValue) => {
    console.log('子组件接收到的属性发生变化：', newValue, oldValue);
    // 在这里可以执行响应的操作，比如重新渲染子组件内容
    if (newValue) {
      currentRadio.value = newValue
      console.log(currentRadio.value)
    }
  }
)

const handleAddOptions = () => {
  currentRadio.value.addOptions({
    label: newRadioOption.value,
    value: newRadioOption.value
  })
  console.log(currentRadio.value)
}

const handleNewOptionsInput = (value) => {
  newRadioOption.value = value
}

const handleDeleteOptions = (value) => {
  currentRadio.value.deleteOptions({
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
        v-model="newRadioOption"
        @change="value => handleNewOptionsInput(value)"
        style="height: 70%;"
      />
    </div>
    <div v-for="option in currentRadio.attrs.options" :key="option.value" class="config-box">
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
