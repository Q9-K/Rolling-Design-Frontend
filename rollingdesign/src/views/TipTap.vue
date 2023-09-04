<!--
 * @Date: 2023-08-25 21:07:30
 * @Author: Q9K
 * @Description: 协同编辑器的基本实现，使用了element-tiptap和yjs
-->
<template>
    <VOnboardingWrapper ref="wrapper" :steps="steps">
    </VOnboardingWrapper>
    <div class="box2">
        <!-- 这个元素主要是为了引导动画 -->
        <div id="blank" style="position: absolute; top:50%;left: 50%;"></div>
        <template v-if="dataLoaded">
            <div class="header" id="header">
                <div class="actions1" id="foo">
                    <div class="backToCenter">
                        <el-tooltip class="box-item" effect="dark" content="返回个人中心" placement="bottom-end">
                            <i class="iconfont icon-shouye" @click="router.push('/index')"></i>
                        </el-tooltip>
                    </div>
                </div>

                <div class="fileinfo">
                    <Title v-model="title" @keyup.enter="changeTitle(title)" :disabled="!editable" id="title"></Title>
                    <el-popover :disabled="!editable" :width="300" trigger="click" ref='popper'
                        popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;">
                        <template #reference>
                            <span id="history" class="lastEditTime" style="font-size: 12px; opacity:0.48; height: 18px; line-height: 18px;
                 box-sizing: border-box; " @click="editable ? showFileHistory() : ''">Last Modified: {{ lastEditTime
                 }}</span>
                        </template>
                        <template #default>
                            <el-timeline>
                                <el-timeline-item v-for="(data, index) in fileHistory" :key="index"
                                    :timestamp="data.modified_at" @click="switchToHistoryFile(index)">
                                    修改人:{{ data.user }}
                                </el-timeline-item>
                            </el-timeline>
                        </template>
                    </el-popover>
                </div>
                <div class="actions2">
                    <el-row :gutter="20">
                        <el-col :span="6">
                            <el-dropdown trigger="click" @command="downloadFile">
                                <el-button color="#3671ff" type="primary" :disabled="!editable" id="downloadButton">
                                    下载
                                </el-button>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item command="md" :divided="true">markdown格式</el-dropdown-item>
                                        <el-dropdown-item command="json" :divided="true">json格式</el-dropdown-item>
                                        <el-dropdown-item command="html" :divided="true">html格式</el-dropdown-item>
                                        <el-dropdown-item command="docx" :divided="true">docx格式</el-dropdown-item>
                                        <el-dropdown-item command="pdf" :divided="true">pdf格式</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </el-col>
                        <el-col :span="6">
                            <el-button color="#3671ff" @click="updateFileAndInform()" :disabled="!editable" id="syncButton"
                                type="primary" class="children">
                                同步
                            </el-button>
                        </el-col>
                        <el-col :span="6">

                            <el-popover class="children" :width="300" trigger="click" ref='popper'
                                popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;">
                                <template #reference>
                                    <el-button color="#3671ff" @click="generateLink()" :disabled="!editable"
                                        id="shareButton" type="primary">
                                        分享
                                    </el-button>
                                </template>
                                <template #default>
                                    <div disabled style="text-align: center;">
                                        <el-input v-model="link"></el-input>
                                        <div>
                                            <div style="margin-top: 10px;">分享权限</div>
                                            <el-switch v-model="shareeditable" class="ml-2" active-text='可以编辑'
                                                inactive-text="不可编辑"
                                                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                                                @change="switchPermission()" />
                                        </div>
                                        <div style="color: #d2d3d7;text-align: center;
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
                        </el-col>
                        <el-col :span="6">
                            <el-button class="children" color="#3671ff" @click="saveAsTemplate" :disabled="!editable"
                                id="template" type="primary" style="z-index: 1;">保存为模板</el-button>
                        </el-col>
                    </el-row>
                </div>
                <div class="userAvatars">
                    <div v-if="online_users.length > 0" style="font-size: 14px; opacity:0.48; height: 18px; line-height: 18px;
                 box-sizing: border-box; ">
                        当前有
                        <span style="font-weight: bolder;opacity: 1;color: black;">
                            {{ online_users.length }}
                        </span>
                        位用户正在一起编辑
                    </div>
                    <div class="team_members">
                        <template v-for="(item, index) in online_users" :key="item.id">
                            <el-avatar :src="item.avatar_url" :size="30" v-if="item.id != authStore().userId"></el-avatar>
                        </template>
                    </div>
                    <div class="selfAvatars">
                        <template v-if="authStore().isLogin">
                            <el-avatar :size="40" :src='authStore().userAvatar' style="font-size: 30px;"></el-avatar>
                        </template>
                        <template v-else>
                            <el-avatar :size="40" style="font-size: 30px;" :icon="UserFilled"></el-avatar>
                        </template>
                    </div>
                </div>
            </div>

            <el-tiptap v-model:content="content" :extensions="extensions" placeholder="欢迎使用Rolling Markdown Editor!👏"
                @keydown.s.ctrl.prevent="updateFileAndInform()" spellcheck :readonly="!editable" @onCreate="onCreate"
                @onBlur="onBlur" id="editor" autoFocus />
        </template>
    </div>
</template>
  

<script setup>
import outputFile from '../utils/output'
import qs from 'qs'
import { UserFilled } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import { ref, onMounted, inject, nextTick, onBeforeMount, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'

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
import { TiptapCollabProvider } from '@hocuspocus/provider'
import Typography from '@tiptap/extension-typography'
import Title from '../components/Title.vue';
import * as Y from 'yjs'
import Mention from '@tiptap/extension-mention'
import suggestion from '../utils/suggestion.js'
import Button from '../components/Button.vue';
import { useSocketStore } from '../store/useSocketStore'
import { authStore } from "../store/index.js"
import { VOnboardingWrapper, VOnboardingStep, useVOnboarding } from 'v-onboarding'
import 'v-onboarding/dist/style.css'
const wrapper = ref(null)
const { start, goToStep, finish } = useVOnboarding(wrapper)
const steps = [
    {
        attachTo: {
            element: '#blank',
        },
        content: {
            title: '欢迎使用Rolling Markdown Editor!',
            description: '可以点击关闭按钮跳过引导步骤！'
        },
    },
    {
        attachTo: {
            element: '.backToCenter',
        },
        content: {
            title: '1/8',
            description: '点击此处返回工作台页面'
        },
    },
    {
        attachTo: {
            element: '#template',
        },
        content: {
            title: '2/8',
            description: '你可以选择将文档存储为模板，方便二次使用'
        }
    },
    {
        attachTo: {
            element: '#title',
        },
        content: {
            title: '3/8',
            description: '在这里你可以修改文档标题'
        }
    },
    {
        attachTo: {
            element: '#history',
        },
        content: {
            title: '4/8',
            description: '我们保存了文档最近的10次编辑历史，方便你进行版本回退'
        }
    },
    {
        attachTo: {
            element: '.el-dropdown',
        },
        content: {
            title: '5/8',
            description: '点击可以下载当前文档，支持pdf,json,html,doc,markdown等5种格式的导出！'
        }
    },
    {
        attachTo: {
            element: '#syncButton',
        },
        content: {
            title: '6/8',
            description: '点击可以保存文档至服务器，按ctrl+s也可以保存，不过不用担心，当脱离编辑状态20s文档会自动保存！'
        }
    },
    {
        attachTo: {
            element: '#shareButton',
        },
        content: {
            title: '7/8',
            description: '点击可以通过生成链接分享给他人查看，同时你可以修改文档的编辑权限！'
        }
    },
    {
        attachTo: {
            element: '.el-tiptap-editor__content'
        },
        content: {
            title: '8/8',
            description: '在这里你可以愉快地使用markdown语法！并且输入@符号可以通知团队其他成员，开始你的创意吧！'
        },
        options: {
            popper: { placement: 'right' },
        }
    }
]
const socketStore = useSocketStore()
const router = useRouter()
const route = useRoute()
const title = ref('Rolling Document')
const content = ref('')
const dataLoaded = ref(false)
const shareeditable = ref(true)
const lastEditTime = ref('')
const fileHistory = ref()
const axios = inject('axios')
let editable = false
let socket = null
let editorInstance
let online_users = ref([])


const contentTemplate = ref('')
const popper = ref()
const link = ref('')
const team_members = ref('')
let memberSocket
let username = authStore().username
let document_id = 'test'
let extensions = []
let provider = null




// Collaboration.config.disableSync = true;//为了防止协作文档重复写入,但是没卵用
onBeforeMount(async () => {
    const res = await axios.get(`/document/view_document/${route.params.id}`)
    const document = res.data.document
    title.value = document.title
    document_id = document.id
    contentTemplate.value = document.content
    lastEditTime.value = new Date(document.modified_at).toLocaleString()

    if (authStore().isLogin) {
        editable = document.editable
        // console.log("🚀 ~ file: TipTap.vue:298 ~ onBeforeMount ~ document.editable:", document.editable)
    }
    const res2 = await axios.get('/team/all_members/')
    authStore().team_members = res2.data.members
    team_members.value = res2.data.members
    setTimeout(() => {

        provider = new TiptapCollabProvider({
            // url: 'ws://101.43.159.45:1234',
            appId: '8mzo739x', // get this at collab.tiptap.dev
            name: `rolling-document-${document.id}`, // e.g. a uuid uuidv4();
            token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.e30.XD10Gr3Bz7Fscz4rzIU60eSnlJkxG7WhEL2juHd9BVY', // see "Authentication" below
            document: new Y.Doc(),
            onConnect() {
                console.log("🚀 ~ file: TipTap.vue:190 ~ provider.configuration.onConnect ~ provider:", provider.status)
                socket = socketStore.socket
                if ((socket == null || socket.readyState != 1) && (authStore().isLogin) && (editable == true)) {
                    socket = new WebSocket(`ws://101.43.159.45:8001/notice/${authStore().userId}`)
                    socketStore.socket = socket
                }
                if (authStore().isLogin && editable == true) {
                    memberSocket = new WebSocket(`ws://101.43.159.45:8001/${document.id}/document/${authStore().userId}`)
                    memberSocket.onopen = (event) => {
                        console.log("🚀 ~ file: TipTap.vue:310 ~ onMounted ~ event:", '连接协同编辑服务器成功！')
                    }
                    memberSocket.onmessage = (event) => {
                        online_users.value = JSON.parse(event.data).online_users
                        if (!dataLoaded.value) {
                            dataLoaded.value = true
                        }
                    }
                }
                else {
                    if (!dataLoaded.value) {
                        dataLoaded.value = true
                    }
                }

            }
        })
        extensions = [
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
                draggable: true,
                uploadRequest(file) {
                    const fd = new FormData()
                    fd.append('file', file)
                    fd.append('file_type', 'document')
                    //这里似乎用浏览器原生的formdata速度足够快，不会出现先创建img节点的问题，又或者是我的写法的问题
                    // 这里 return 是返回 Promise 对象
                    return axios.post('/document/upload/', fd).then(({ data: res }) => {
                        // 这个 return 是返回最后的结果
                        return res.url
                    })
                },
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
            Color,
            Print,
            Highlight,
            SelectAll,
            FontSize,
            FontFamily,
            Fullscreen,
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
                    name: username,
                    color: ['#09f7e3d9', '#8613d0a6', '#67b42be0', '#d01a5382', '#0993f7db', '#a8a232', '#693f19', '#28474d'][Math.floor(Math.random() * 8 + 1) - 1]
                },
            }),
        ];
    }, 500);
})

onMounted(() => {
    // localStorage.setItem('isNewWriter', true)
})


onUnmounted(() => {
    if (socket != null) {
        socket.close()
        socketStore.socket = null
    }
    if (memberSocket) {
        memberSocket.close()
    }
})



const generateLink = async () => {

    let res = await axios.post('/document/share_document/', qs.stringify({
        document_id,
    }))
    const baseUrl = 'www.aamofe.top'
    link.value = baseUrl + "/tiptap/" + route.params.projectId + '/' + res.data.data.token
    console.log("🚀 ~ file: TipTap.vue:421 ~ generateLink ~ res.data.data.url:", res.data.data.token)

}
const copyLink = () => {
    navigator.clipboard.writeText(link.value)
    popper.value.hide()
    ElNotification({
        title: 'Success',
        message: '复制成功',
        type: 'success',
        duration: 1000
    })
}

const downloadFile = (command) => {
    // console.log("🚀 ~ file: TipTap.vue:398 ~ downloadFile ~ command:", command)
    const fileType = command
    const editorContentDOM = window.document.querySelector('.el-tiptap-editor__content')
    console.log("🚀 ~ file: TipTap.vue:338 ~ downloadFile ~ content:", content)
    outputFile(fileType, content.value, title.value, editorContentDOM, editorInstance)
}


const updateFile = async () => {
    // console.log("🚀 ~ file: TipTap.vue:367 ~ updateFile ~ content.value:", content.value)
    lastEditTime.value = new Date().toLocaleString();
    let res = axios.post('/document/save/', qs.stringify({
        file_type: 'document',
        content: content.value,
        file_id: route.params.id,
        title: title.value,
    }))

}


const updateFileAndInform = async () => {
    await updateFile()
    ElNotification({
        title: 'Success',
        message: '保存文件成功！',
        type: 'success',
        duration: 1000
    })
}

const changeTitle = async () => {
    await updateFile()
    ElNotification({
        title: 'Success',
        message: '重命名文件成功！',
        type: 'success',
        duration: 1000
    })
}


const showFileHistory = async () => {
    let res = await axios.get('/document/history/', {
        params: {
            document_id,
        },
        headers: {
            Authorization: authStore().token
        }
    })
    fileHistory.value = res.data.history
    // console.log("🚀 ~ file: TipTap.vue:484 ~ showFileHistory ~ res:", res.data.history)

}

const switchToHistoryFile = async (index) => {
    await editorInstance.commands.setContent(fileHistory.value[index].content)
    ElNotification({
        title: 'Success',
        message: '切换到历史版本文件成功！',
        type: 'success',
        duration: 1000
    })
}


const switchPermission = async () => {
    console.log("🚀 ~ file: TipTap.vue:506 ~ switchPermission ~ shareeditable.value:", shareeditable.value)
    let res = await axios.post('/document/update_document_permisson/', qs.stringify({
        document_id,
        editable: shareeditable.value == true ? '1' : '0',
    }))
    console.log("🚀 ~ file: TipTap.vue:517 ~ switchPermission ~ res:", res.data)
}

//设置30s脱离焦点自动保存文件
let saveTimer = null//通过节流实现操作
const onBlur = async ({ editor }) => {
    clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
        if (editable == true) {
            updateFile()
            ElNotification({
                title: 'Success',
                message: '自动保存文件成功！',
                type: 'success',
                duration: 1000
            })
        }
    }, 30000)
}

const saveAsTemplate = async () => {
    let res = await axios.post('/document/save_as_template/', qs.stringify({
        content: content.value,
        title: title.value,
        file_type: 'document',
        project_id: route.params.projectId
    }))
    ElNotification({
        title: 'Success',
        message: '保存为模板成功！',
        type: 'success',
        duration: 1000
    })
    console.log("🚀 ~ file: TipTap.vue:435 ~ saveAsTemplate ~ res:", res.data)
}


const onCreate = async ({ editor }) => {
    if (!localStorage.getItem('isNewWriter')) {
        start()
        localStorage.setItem('isNewWriter', 'test')
    }
    editorInstance = editor
    // const position = { from: 3, to: 3 };
    // editorInstance.commands.setSelection(position)

    // console.log("🚀 ~ file: TipTap.vue:454 ~ onCreate ~ editorInstance:", editorInstance.state.selection.$cursor.pos)

    if (socketStore.socket != null && socketStore.socket.readyState == 1) {
        console.log("🚀 ~ file: TipTap.vue:418 ~ onCreate ~ readyState:", 'CONNECTED!')
    }

    // console.log("🚀 ~ file: TipTap.vue:579 ~ onCreate ~ route.query.is:", route.query.hasOwnProperty('is'))
    if (route.query.hasOwnProperty('is_template')) {
        editorInstance.commands.setContent(contentTemplate.value)
    }
    if (editable == false) {
        editorInstance.extensionManager.extensions.find((extension) => extension.name === 'collaborationCursor').options.user.name = ''
        let elements = window.document.getElementsByClassName("el-tiptap-editor");
        //TODO:根据用户状态弹出消息
        if (!authStore().isLogin) {
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
        const element = elements[0];
        element.style.opacity = '0.45'
        // Collaboration.config.disableSync = false 没啥用
    }
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

        justify-content: space-between;

        .actions1 {
            width: 5%;
            // background: red;
            background: transparent;
            // margin-left: -50px;
            outline: none;
            text-align: center;
            // background: red;
            // width: 120px;
            // display: flex;
            // align-items: center;
            // justify-content: space-around;

            .backToCenter {
                // height: 80px;
                // background-color: red;
                text-align: center;
                // font-size: 20px;

                i {
                    width: 100%;
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
            width: 32%;
            // background-color: red;
            display: flex;
            align-items: center;
            justify-content: space-between;

        }

        .actions2 {
            display: flex;
            width: 25%;
            // background: red;
            // align-items: center;
            // justify-content: space-around;

            // .chdildren:nth-child(n) {
            //     height: 100%;
            //     flex: 1;
            //     // margin: 0 10px;
            //     text-align: center;
            // }
        }

        .userAvatars {
            display: flex;
            // background-color: red;
            width: 25%;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;

            .team_members {
                display: flex;
                align-items: center;
                justify-content: space-around;
            }

            .selfAvatars {
                display: flex;
                align-items: center;
                justify-content: center;
            }
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
    // padding: 0.1rem 0.3rem;
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