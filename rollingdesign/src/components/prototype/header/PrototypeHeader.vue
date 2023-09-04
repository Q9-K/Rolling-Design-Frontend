<script setup>
import logo from '../../../assets/prototypeIcon/logo_without_background.png'

</script>

<template>
  <div class="prototype-header">
    <div style="width: 50%; height: 100%; background: linear-gradient(to right, white, #b0bfea)">
      <img class="prototype-header-logo" :src="logo">
    </div>
    <div style="width: 50%; height: 100%; background: linear-gradient(to left, white, #b0bfea)"></div>
  </div>
</template>

<style scoped lang="scss">
.prototype-header {
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100vw;
  height: 10vh;
  display: flex;
  justify-content: left;
  flex-wrap: nowrap;
  .prototype-header-logo {
    height: 100%;
  }
}
</style>
