<!--
 * @Date: 2023-08-27 19:40:56
 * @Author: Q9K
 * @Description: 
-->
<template>
    <div class="box">
        <button :disabled="disabled">
            <slot></slot>
        </button>
    </div>
</template>


<script setup>
import { ref } from 'vue'
const props = defineProps(['disabled'])

const disabled = ref(props.disabled)
// const shareFile = () => {
//     console.log(props.shareLink)
//     // navigator.clipboard.writeText(props.shareLink);
//     // alert('复制成功')
// }
</script>

<style scoped lang="scss">
button {
    background: #3671ff;
    height: 28px;
    outline: none;
    line-height: 28px;
    width: 56px;
    text-align: center;
    font-family: PingFangSC-Medium;
    display: inline-block;
    font-weight: 500;
    padding: 0;
    border: 0;
    color: #fff;
    cursor: pointer;
    border-radius: 2px;

    &:hover {
        background-color: #175ceb;
    }
}
</style>