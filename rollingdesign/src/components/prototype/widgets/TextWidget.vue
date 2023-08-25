<script setup>
import { usePrototypeStore } from "@/stores/prototypeStore";

const prototypeStore = usePrototypeStore()

const presuppositionTextList = [
  {
    text: '标题',
    style: {
      fontSize: '24px'
    }
  },
  {
    text: '副标题',
    style: {
      fontSize: '18px'
    }
  },
  {
    text: '正文内容',
    style: {
      fontSize: '14px'
    }
  },
  {
    text: '粗体文本',
    style: {
      fontSize: '14px',
      fontWeight: 'bold'
    }
  },
  {
    text: '斜体文本',
    style: {
      fontSize: '14px',
      fontStyle: 'italic'
    }
  }
]

const addText = (item) => {
  console.log(item)
  prototypeStore.addItem(item)
  console.log(prototypeStore)
}
</script>

<template>
  <div class="outer-text-widget">
    <ul>
      <li
        v-for="(item, index) in presuppositionTextList"
        :key="index"
        class="presupposition-item"
        :style="item.style"
        @click="addText(item)"
      >
        {{ `添加${item.text}` }}
      </li>
    </ul>
    <el-button
      class="add-text"
      size="small"
      type="default"
      @click="addText(null)"
    >添加文本</el-button>
  </div>
</template>

<style scoped lang="scss">
.outer-text-widget {
  width: 100%;
  height: 90%;
  box-sizing: border-box;
  padding: 10px;
  .presupposition-item {
    padding: 12px 0 !important;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
    cursor: pointer;
    &:hover {
      color: white !important;
    }
  }
  .add-text {
    width: 100%;
    margin-top: 20px;
  }
}
</style>