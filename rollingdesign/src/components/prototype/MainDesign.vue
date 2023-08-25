<!--
  原型设计中的中间主要工作区
-->
<script setup>

</script>

<template>
  <div ref="main" class="poster-editor-main" @contextmenu.prevent="">
    <div ref="mainPanelScrollContent" class="main-panel-scroll-content">
      <div class="main-panel-contaienr">
        <main-panel ref="mainPanel" @openContextmenu="openContextmenu" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>