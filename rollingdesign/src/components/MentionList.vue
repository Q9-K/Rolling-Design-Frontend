<template>
    <div class="items">
        <template v-if="items.length > 0">
            <div class="item" :class="{ 'is-selected': index === selectedIndex }" v-for="(item, index) in items"
                :key="item.id" @click="selectItem(index)">
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
import { authStore } from "../store/index.js"
import { useSocketStore } from '../store/useSocketStore'

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
            if (this.items.length > 0) {
                const item = this.items[index]
                let socket = socketStore.socket
                if (socket != null && socket.readyState != 1) {
                    socket = new WebSocket(`ws://101.43.159.45:8001/notice/${authStore().userId}`)
                    socket.onopen = () => {
                        socket.send(JSON.stringify({
                            'type': 'file',
                            'user_id': item.id,
                            'url': window.location.href,
                            'file_id': `${this.$route.params.id}`,
                        }))
                        console.info("🚀 ~ file: MentionList.vue:107 ~ selectItem ~ user_id:", '重新连接socket发送', item.id)
                    }
                    socketStore.socket = socket
                }
                else {
                    socket.send(JSON.stringify({
                        'type': 'file',
                        'user_id': item.id,
                        'url': window.location.href,
                        'file_id': `${this.$route.params.id}`,
                        // 'text': '我是傻逼'
                    }))
                    console.info("🚀 ~ file: MentionList.vue:119 ~ selectItem ~ user_id:", '直接发送成功', item.id)
                }
                this.command({ id: item.username })
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