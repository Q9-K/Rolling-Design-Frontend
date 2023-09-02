<!--
 * @Date: 2023-08-26 16:33:45
 * @Author: Q9K
 * @Description: 
-->
<template>
    <div class="wrapper">
        <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" class="title"
            :disabled="disabled" />
        <!-- <el-input :value="modelValue" @input="handleInput($event)"></el-input> -->
    </div>
</template>

<script setup>
defineProps(['modelValue', 'disabled'])
const emit = defineEmits(['update:modelValue'])
</script>

<style lang="scss">
.wrapper {
    display: flex;
    border: 1px solid transparent;
    box-sizing: border-box;
    background: transparent;
    height: 36px;
    display: block;

    .title {
        // width: 100%;
        display: inline-block;
        outline: none;
        border: 1px solid transparent;
        caret-color: blue;
        text-overflow: ellipsis;
        // max-width: 220px;
        width: auto;
        background: transparent;
        box-sizing: border-box;
        height: 36px;
        line-height: 36px;
        padding: 1px 8px;
        font-size: 18px;
        font-weight: 550;
        white-space: pre;
        // // overflow: hidden;
        opacity: 0.8;
        border-radius: 4px;

        &:focus {
            border: 1px solid #4d90fe;
        }
    }
}
</style>

