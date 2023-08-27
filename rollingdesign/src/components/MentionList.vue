<template>
    <div class="items">
        <template v-if="items.length">
            <div class="item" :class="{ 'is-selected': index === selectedIndex }" v-for="(item, index) in items"
                :key="index" @click="selectItem(index)">
                <div class="userInfo">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" :size="20"
                        shape="square"></el-avatar>
                    <span style="text-indent: 5px;">{{ item.name }}</span>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="item">
                No others!
            </div>
        </template>

    </div>
</template>
  
<script>
import { UserFilled } from '@element-plus/icons-vue'
export default {
    props: {
        items: {
            type: Array,
            required: true,
        },

        command: {
            type: Function,
            required: true,
        },
    },

    data() {
        return {
            selectedIndex: 0,
        }
    },

    watch: {
        items() {
            this.selectedIndex = 0
        },
    },

    methods: {
        onKeyDown({ event }) {
            if (event.key === 'ArrowUp') {
                this.upHandler()
                return true
            }

            if (event.key === 'ArrowDown') {
                this.downHandler()
                return true
            }

            if (event.key === 'Enter') {
                this.enterHandler()
                return true
            }

            return false
        },

        upHandler() {
            this.selectedIndex = ((this.selectedIndex + this.items.length) - 1) % this.items.length
        },

        downHandler() {
            this.selectedIndex = (this.selectedIndex + 1) % this.items.length
        },

        enterHandler() {
            this.selectItem(this.selectedIndex)
        },

        async selectItem(index) {
            // console.log(this.items[index])
            const item = this.items[index].name

            if (item) {
                try {
                    // let res = axios.post('/api接口')
                    // TODO:完成发送消息
                    let socket = new WebSocket(`ws://101.43.159.45:8001/notice/${user_id}`)
                    socket.send(JSON.stringify('我是傻逼'))
                    socket.close(1000, '我太傻逼了')
                } catch (err) {
                    console.error(err)
                }
                this.command({ id: item })
            }
        },
    },
}
</script>
  
<style lang="scss">
.items {
    padding: 0.2rem;
    // display: block;
    // justify-content: flex-start;
    // align-items: center;
    position: relative;
    border-radius: 5px;
    margin-top: -32px;
    margin-left: 20px;
    background: #ffffff;
    overflow: hidden;
    color: #a5a5a5;
    font-size: 30px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05),
        0px 10px 20px rgba(0, 0, 0, 0.1),
    ;

    .tippy-box {
        border-radius: 20px;
        background: red;

        .tippy-content {
            border-radius: 20px;
            background: red;
        }
    }


    // border: none;
    // z-index: 21210;

}

.item {
    width: 92px;
    display: block;
    margin: 0;
    // box-sizing: border-box;
    // position: relative;
    border: none;
    height: 24px;
    line-height: 24px;
    background: transparent;
    text-align: left;
    text-indent: 2px;
    padding: 0.2rem 0.2rem;
    font-size: 14px;

    // border-radius: 0.5rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    &.is-selected {
        border-color: #000;
        background: #ececee;
        color: #74557e96;
    }

    .userInfo {
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

}

button {
    display: block;
}
</style>