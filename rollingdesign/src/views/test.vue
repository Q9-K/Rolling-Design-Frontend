<template>
    <el-button type="primary" style="position: fixed; right: 50px; top: 14px; z-index:1000" @click="drawer = true">
        搜索消息
    </el-button>
    <el-drawer v-model="drawer" title="I am the title" :with-header="false">
        <el-input placeholder="请输入" v-model="inputVal" clearable size="big" style="margin:2px"></el-input>
        <el-button :icon="Search" type="primary" size="big" @click="this.searchData(true)"
            style="margin: 5px 10px 0 10px; height: 30px; right: 10%">搜索</el-button>
        <div v-for="message in searchMessages" :key="message" style="margin:20px">
            {{ message }}
        </div>
    </el-drawer>
</template>
<script>
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue';
export default{
    watch: {
        inputVal(newValue) {
            if (newValue) {
                this.searchData(true);
            } else {
                this.searchData(false);
            }
        },
    },
    data(){
        return {
            messages:['2','222','333','444'],
            searchMessages: ['1', '2'],
            drawer: ref(false),
            inputVal: "", // 输入框输入值
        }
    },
    methods:{
        searchData(bool) {
            if (bool) {
                console.log('bbb')        
                const searchMessage = this.inputVal.toLowerCase(); // 将搜索查询转换为小写以进行不区分大小写的匹配
                this.searchMessages = this.messages.filter(messages => messages.toLowerCase().includes(searchMessage));
                console.log(this.searchMessages)
            }
        },
    }
}
</script>