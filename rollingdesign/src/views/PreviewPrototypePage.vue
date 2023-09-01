<script setup>
import {useRoute} from "vue-router";
import PreviewPrototype from "@/components/prototype/preview/PreviewPrototype.vue";

const route = useRoute()
const prototypeShareLink = route.params.token

</script>

<template>
  <div class="preview-prototype-outer">
    <PreviewPrototype
      :prototype-token="prototypeShareLink"
    />
  </div>

</template>

<style scoped lang="scss">
.preview-prototype-outer {
  width: 100vw;
  height: 100vh;
}
</style>
