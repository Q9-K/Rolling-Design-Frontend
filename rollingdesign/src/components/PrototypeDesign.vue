<!--
  原型设计大组件
-->
<script setup>
import LeftBar from "@/components/prototype/LeftBar.vue";
import MainDesign from "@/components/prototype/MainDesign.vue";
import UsefulFunction from "@/components/prototype/UsefulTools.vue";
import DesignConfig from "@/components/prototype/DesignConfig.vue";

</script>

<template>
  <div class="prototype-design" :class="{ 'init-loading': initLoading }">
    <div class="base">
      <!-- 左侧添加组件栏 -->
      <LeftBar class="left-bar" />
      <!-- 主要操作区域 -->
      <MainDesign class="main-design" ref="main" />
      <!-- 常用功能栏 -->
      <UsefulFunction class="useful-function" />
      <!-- 组件编辑区域 -->
      <DesignConfig class="design-config" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.prototype-design {
  width: 100%;
  min-width: 900px;
  height: 100%;
  background-color: #fff;
  position: fixed;
  &.init-loading {
    filter: blur(6px);
  }
  .base {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
  }
  .left-bar {
    height: 100%;
  }
  .main-design {
    flex: 1;
    height: 100%;
    box-sizing: border-box;
  }
  .useful-function {
    width: 50px;
    height: 100%;
    border-left: 1px solid white;
  }
  .design-config {
    width: 200px;
    height: 100%;
    box-sizing: border-box;
    border-left: 1px solid white;
  }
}
</style>