<template>
    <div class="items">
        <template v-if="items.length">
            <div class="item" :class="{ 'is-selected': index === selectedIndex }" v-for="(item, index) in items"
                :key="index" @click="selectItem(index)">
                <div class="userInfo">
                    <el-avatar :src="item.avatar_url" :size="20" shape="square"></el-avatar>
                    <span style="text-indent: 5px;">{{ item.username }}</span>
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
import qs from 'qs'
import { authStore } from "../store/index.js"
import { UserFilled } from '@element-plus/icons-vue'
import { useSocketStore } from '../stores/useSocketStore'
// import { useRoute } from 'vue-router'

const socketStore = useSocketStore()
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

        selectItem(index) {
            // console.log(this.items[index])
            const item = this.items[index]

            // try {
            // let res = axios.post('/api接口')
            // TODO:完成发送消息
            // console.log(this.$route)
            let socket = socketStore.socket

            // console.log(socket.readyState)
            if (socket.readyState != 1) {
                socket = new WebSocket(`ws://101.43.159.45:8001/notice/${authStore().userId}`)
                socketStore.socket = socket
            }
            // } catch (err) {
            //     console.error(err)
            // }
            setTimeout(() => {
                socketStore.socket = socket
                console.log(socket.readyState)
                socket.send(JSON.stringify({
                    'type': 'file',
                    'user_id': '4',
                    'url': 'www.baidu.com',
                    'file_id': `${this.$route.params.id}`,
                    // 'text': '我是傻逼'
                }))
                console.log(`@user_name 成功`)
            }, 2000)
            this.command({ id: item.username })

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