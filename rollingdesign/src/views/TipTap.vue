<!--
 * @Date: 2023-08-25 21:07:30
 * @Author: Q9K
 * @Description: 协同编辑器的基本实现，使用了element-tiptap和yjs
-->
<template>
    <div class="box2">
        <div class=" header">
            <div class="actions1">
                <div class="backToCenter">
                    <el-tooltip class="box-item" effect="dark" content="返回个人中心" placement="bottom-end">
                        <i class="iconfont icon-shouye" @click="router.push('/index')"></i>
                    </el-tooltip>
                </div>
                <!-- <div class="select"></div> -->
            </div>
            <div class="fileinfo">
                <Title v-model="title" @keyup.enter="changeTitle(title)"></Title>
                <span class="lastEditTime" style="font-size: 12px; opacity:0.48; height: 18px; line-height: 18px;
                 box-sizing: border-box; ">Last Modified: {{ lastEditTime }}</span>
            </div>
            <div class="actions2">
                <Button @click="downloadFile()">
                    下载
                </Button>
                <Button @click="updateFileAndInform()">
                    同步
                </Button>
                <el-popover :width="300" trigger="click" ref='popper'
                    popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;">
                    <template #reference>
                        <Button @click="generateLink()">
                            分享
                        </Button>
                        <!-- <el-avatar src="https://avatars.githubusercontent.com/u/72015883?v=4" /> -->
                    </template>
                    <template #default>
                        <div disabled style="text-align: center;">
                            <el-input v-model="link" disabled></el-input>
                            <div style="color: #d2d3d7;text-align: left;
                            margin-top: 20px;">该链接将在<span style="font-weight: 700;">24小时</span>内过期
                            </div>
                        </div>
                        <button @click="copyLink" class="copyLink"
                            style="text-align: center; 
                            background-color: #3671ff;
                            outline: none;
                        margin-left:auto; margin-right: auto; margin-top: 15px; padding: 10px; box-sizing: content-box;">复制链接</button>
                    </template>
                </el-popover>
            </div>
            <div class="userAvatars">
                <!-- <div v-for="">
                    {{  }}
                </div> -->
                <div class="selfAvatars">
                    <template v-if="authStore().isLogin">
                        <el-avatar :size="40" :icon="UserFilled" style="font-size: 30px;"></el-avatar>
                    </template>
                    <template v-else>
                        <el-avatar :size="40" style="font-size: 30px;"></el-avatar>
                    </template>
                </div>
            </div>
        </div>
        <!-- <template v-if="dataLoaded"> -->
        <el-tiptap v-model:content="content" :extensions="extensions" ref="editor"
            placeholder="欢迎使用Rolling Markdown Editor!👏" @keydown.s.ctrl.prevent="updateFile()" spellcheck
            :readonly="!editAble" @onCreate="onCreate" />
        <!-- </template>
        <template v-else>
            <div>
                请稍等
            </div>
        </template> -->

    </div>
</template>
  
<script setup>
import qs from 'qs'
import { UserFilled } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import { ref, watch, onUnmounted, onMounted, onBeforeUnmount, onUpdated, onBeforeMount, nextTick, inject, reactive } from 'vue';
import { ArrowLeftBold, Download } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
import TurndownService from 'turndown'
import {
    Document,
    Text,
    Paragraph,
    Bold,
    Italic,
    Strike,
    Underline,
    CodeBlock,
    Blockquote,
    BulletList,
    OrderedList,
    TaskList,
    TextAlign,
    Indent,
    HorizontalRule,
    // Table,
    History,
    Color,
    Print,
    Highlight,
    SelectAll,
    Image,
} from 'element-tiptap';
import {
    HardBreak,
    Heading,
    FontFamily,
    FontSize,
    Fullscreen,
} from 'element-tiptap-vue3-fixed'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import { HocuspocusProvider } from '@hocuspocus/provider'
import Typography from '@tiptap/extension-typography'
import Title from '../components/Title.vue';
import * as Y from 'yjs'
import Mention from '@tiptap/extension-mention'
import suggestion from '../utils/suggestion.js'
import Button from '../components/Button.vue';
import { useSocketStore } from '../stores/useSocketStore'
import { authStore } from "../store/index.js"
const socketStore = useSocketStore()
const axios = inject('axios')

const ydoc = new Y.Doc();
const provider = new HocuspocusProvider({
    url: 'ws://101.43.159.45:1234',
    // url: 'ws://localhost:1234',
    name: 'rolling-cowork-document',
    document: ydoc,
})





const router = useRouter()
const route = useRoute()
const title = ref('Rolling Document')
const editor = ref(null)
const content = ref()
const editAble = ref(true)
const dataLoaded = ref(false)
// const lock = ref(false)

const downloadFile = () => {
    console.info(content.value)
    const turndownService = new TurndownService()
    const fileContent = turndownService.turndown(content.value)
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title.value}.md`;
    link.click();
    URL.revokeObjectURL(link.href);

}


const updateFile = async () => {
    try {
        let res = axios.post('/document/save_document/', qs.stringify({
            content: content.value,
            document_id: 3,
            title: title.value,
        }), {
            'headers': {
                'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTM1NTQ4NzMsImlkIjoxfQ.qZECLptaKJv6EJaIdv8GY3pgMPuhB2FrDApPHvx8SsQ'
            }
        })
        ElNotification({
            title: 'Success',
            message: '保存成功',
            type: 'success',
            duration: 1000
        })
        console.log(res.data)
    } catch (err) {
        console.error(err)
    }
}


const updateFileAndInform = async () => {
    await updateFile()
}

const changeTitle = async () => {
    await updateFile()
}


let needToChangeLock = false
const lastEditTime = ref('')
const beforeunloadHandler = async (e) => {
    e.preventDefault()
    e.returnValue = ''
    setTimeout(() => {
    }, 0);
    // e.returnValue = ""
    // console.log('刷新页面')
    let res = await axios.post('/document/change_lock/', qs.stringify({
        document_id: 3,
        type: '-'
    }))
    console.log('out', res.data)

}

// const unloadHandler = async (e) => {
//     e.preventDefault()
//     e.returnValue = ""
//     // console.log('刷新页面')
//     if (needToChangeLock) {
//         needToChangeLock = false
//         let res = await axios.post('/document/change_lock/', qs.stringify({
//             document_id: 3
//         }))
//         console.log(1, res.data)
//     }
//     // window.confirm('are you sure to leave?')
// }
onMounted(async () => {
    let socket = socketStore.socket
    if (socket == null || socket.readyState != 1) {
        socket = new WebSocket(`ws://101.43.159.45:8001/notice/${authStore().userId}`)
        socketStore.socket = socket
    }
    window.addEventListener('beforeunload', e => beforeunloadHandler(e))
    const route = useRoute()
    // console.log('id', route.params.id)
    // window.addEventListener('unload', e => unloadHandler(e))
    let res = await axios.get(`/document/view_document/${route.params.id}`, {
        headers: {
            //TODO:通过pinia全局获取本地token
            Authorization: authStore().token
        }
    })
    const document = res.data.document
    title.value = document.title
    const lock = document.is_locked
    const time = document.modified_at.replace("T", " ").replace("Z", " ")
    lastEditTime.value = new Date(time).toLocaleString()
    editAble.value = document.editable
    res = await axios.get('/team/all_members/', {
        headers: {
            Authorization: authStore().token
        }
    })
    authStore().team_members = res.data.members
    // console.log('team_members', res.data.members)
    // console.log('锁', res.data.document.is_locked)

    // editAble.value = true
    dataLoaded.value = true


    // UserName = document.


    // needToChangeLock = true

    let response = await axios.post('/document/change_lock/', qs.stringify({
        document_id: 3,
        type: '+'
    }))
    console.log(response.data)
    if (lock > 0) {
        content.value = ''
        console.log('next open')
        // await nextTick()
    }
    else {
        content.value = document.content
        console.log('first open')
    }

    if (editAble.value == false) {
        let elements = window.document.getElementsByClassName("el-tiptap-editor");
        //TODO:根据用户状态弹出消息
        if (true) {
            ElMessage({
                message: '您尚未登录，登陆后方可编辑文档！',
                type: 'info',
                duration: 2500,
                center: true,
                offset: 8,
                grouping: true,
                showClose: true
            })
        }
        else {
            ElMessage({
                message: '你尚不具备该文档编辑权限，请联系文档管理员！',
                type: 'info',
                duration: 2500,
                center: true,
                offset: 8,
                grouping: true,
                showClose: true
            })
        }

        setTimeout(() => {
            const element = elements[0];
            element.style.opacity = '0.45'
        }, 0);


    }

})

const extensions = [
    History.configure({
        history: false
    }),
    Document,
    Text,
    Paragraph,
    Heading,
    Bold.configure({
        bubble: true
    }),
    Italic.configure({
        bubble: true
    }),
    Strike,
    Underline.configure({
        bubble: true
    }),
    Image.configure({
        inline: true,
        allowBase64: false
    }),
    CodeBlock,
    Blockquote,
    BulletList,
    OrderedList,
    TaskList,
    TextAlign,
    Indent,
    HardBreak,
    HorizontalRule,
    // Table,
    Color,
    Print,
    Highlight,
    SelectAll,
    FontSize,
    FontFamily,
    Fullscreen,
    // Markdown,
    Typography,
    Mention.configure({
        HTMLAttributes: {
            class: 'mention',
        },
        suggestion,
    }),
    Collaboration.configure({
        document: provider.document,
    }),
    // Register the collaboration cursor extension
    CollaborationCursor.configure({
        provider: provider,
        user: {
            //TODO:通过状态管理获取用户名
            name: '我是傻逼',
            color: ['#09f7e3d9', '#8613d0a6', '#67b42be0', '#d01a5382', '#0993f7db', '#a8a232', '#693f19', '#28474d'][Math.floor(Math.random() * 8 + 1) - 1]
        },
    }),
];

onUnmounted(() => {

})


const popper = ref()
const link = ref('')


const generateLink = async () => {

    let res = await axios.post('/document/share_document/', qs.stringify({
        document_id: 3,
        editable: 1
    }), {
        headers: {
            Authorization: authStore().token
        }
    })
    // console.log(res.data.data[0])
    link.value = res.data.data[0]

}
const copyLink = () => {
    navigator.clipboard.writeText(link.value)

    popper.value.hide()
    // console.log(popper.value)

    ElNotification({
        title: 'Success',
        message: '复制成功',
        type: 'success',
        duration: 1000
    })
}

const onCreate = ({ editor }) => {
    // editor.isFocused = true
    // console.log(editor)
}

</script>


<style lang="scss">
.box2 {
    height: 100%;
    display: flex;
    flex-direction: column;

    .header {
        height: 56px;
        background-color: #f9fafb;
        padding: 0 4px;
        border-bottom: 2px solid #3671ff;
        display: flex;
        align-items: center;

        justify-content: space-around;

        .actions1 {
            width: 120px;
            background: red;
            background: transparent;
            margin-left: -50px;
            outline: none;
            // background: red;
            width: 120px;

            .backToCenter {
                // height: 80px;
                // background-color: red;
                margin-left: -130px;
                text-align: center;
                // font-size: 20px;

                i {
                    font-size: 25px;
                    cursor: pointer;
                    opacity: 0.8;

                    &:hover {
                        color: #3671ff;
                    }
                }
            }

        }

        .fileinfo {
            width: 500px;
            display: flex;
            align-items: center;
            justify-content: space-between;

        }

        .actions2 {
            display: flex;
            width: 200px;
            align-items: center;
            justify-content: space-between;
        }
    }
}

.copyLink {
    width: 80%;
    color: #fff;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 5px;

    &:hover {
        background-color: #175ceb;
    }

}


//共享光标样式
.collaboration-cursor__caret {
    border-left: 1px solid #0D0D0D;
    border-right: 1px solid #0D0D0D;
    margin-left: -0.5px;
    margin-right: -0.5px;
    pointer-events: none;
    position: relative;
    word-break: normal;
}


.collaboration-cursor__label {
    border-radius: 3px 3px 3px 0;
    color: #0D0D0D;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    left: -1px;
    line-height: normal;
    padding: 0.1rem 0.3rem;
    position: absolute;
    top: -1.4em;
    user-select: none;
    white-space: nowrap;
}

.el-tiptap-editor__menu-bar {
    width: 100%;
    margin: 0 auto;
    justify-content: center;
    // line-height: 20px;
    height: 44px;
    background: #f9fafb;
    padding-top: 8px;
    padding-bottom: 8px;
    box-sizing: border-box;
    border: none;
}


.el-tiptap-editor__menu-bubble--active {
    background-color: #fff;
    padding: 2px 6px;
    border: none;
    border-radius: 20px;

    .el-tiptap-editor__command-button {
        height: 18px;
        width: 18px;
        margin-left: 7px;
        margin-right: 7px;

        svg {
            width: 12px;
            height: 12px;
        }
    }

}

.el-tiptap-editor__command-button {
    height: 24px;
    width: 24px;
    padding: 2px;
    background: transparent;
    margin-left: 10px;
    margin-right: 10px;

    svg {
        width: 20px;
        height: 20px;
    }

}

.el-tiptap-editor {
    background-color: #f3f5f7;
    box-sizing: border-box;
    overflow: hidden;
    flex: 1;

    * {
        caret-color: #3409f7;
    }
}

.el-tiptap-editor__footer {
    justify-content: space-between;
    height: 32px;
    position: sticky;
    bottom: 0;
    padding: 0 16px;
    border-top: 1px solid transparent;
    opacity: 0.5;

    .el-tiptap-editor__characters {
        font-size: 14px;
        font-weight: 700;
    }
}

.el-tiptap-editor--with-footer>.el-tiptap-editor__content {
    flex: 1;
    width: 45%;
    padding: 20px 30px;
    // max-width: min-content;
    word-wrap: break-word;
    overflow-wrap: break-word;
    overflow-x: hidden;
    margin: 0 auto;
    background-color: #ffffff;
    /* border-radius: 20px; */
    border-bottom: none;
    box-shadow: 10px 0px 10px #dad8d9, -10px 0px 10px #dad8d9;
    // z-index: 20;

}

.el-tiptap-dropdown-menu .el-tiptap-dropdown-menu__item {
    // width: 20px;
    padding: 4px 5px;
    box-sizing: border-box;
    line-height: 30px;

    span {
        text-align: center;
    }
}

.el-tiptap-popper__menu__item {
    padding: 4px 0;
    line-height: 18px;
}

div[data-tippy-root] {
    border-radius: 20px;
    background: transparent;
}

.tippy-box {

    border-radius: 20px;
    background: transparent;

    .tippy-content {
        border-radius: 20px;
        background: transparent;
    }
}

$colors: #09f7e3d9, #8613d0a6, #67b42be0, #d01a5382;
$numColors: 1000;

//at提示框
@for $i from 1 through $numColors {
    p:nth-child(#{$i}) .mention {
        background: nth($colors, $i % 4 + 1);
        font-weight: 700;
        border-radius: 0.4rem;
        padding: 0.1rem 0.3rem;
        box-decoration-break: clone;
    }
}
</style>
