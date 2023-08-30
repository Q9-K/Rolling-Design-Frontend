<template>
    <div>
        <div class=" header">
            <div class="actions1">
                <div class="backToCenter">
                    <el-tooltip class="box-item" effect="dark" content="返回个人中心" placement="bottom-end">
                        <i class="iconfont icon-shouye" @click="this.$router.push('/index')"></i>
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
                    <!-- <template v-if="authStore().isLogin"> -->
                    <el-avatar :size="40" :icon="UserFilled" style="font-size: 30px;"></el-avatar>
                    <!-- </template> -->
                    <!-- <template v-else> -->
                    <!-- <el-avatar :size="40" style="font-size: 30px;"></el-avatar> -->
                    <!-- </template> -->
                </div>
            </div>
        </div>
        <el-button type="primary" style="position: fixed; right: 50px; top: 14px; z-index:1000" @click="drawer = true">
            搜索消息
        </el-button>
        <el-drawer v-model="drawer" title="I am the title" :with-header="false">
            <el-input placeholder="请输入" v-model="inputVal" clearable size="big" style="margin:2px"></el-input>
            <el-button :icon="Search" type="primary" size="big" @click="searchData(true)"
                style="margin: 5px 10px 0 10px; height: 30px; right: 10%">搜索</el-button>
            <div v-for="message in searchMessages" :key="message" style="margin:20px">
                {{ message }}
            </div>
        </el-drawer>
        <div>
            <vue-advanced-chat height="calc(100vh )" :current-user-id="currentUserId" :rooms="JSON.stringify(rooms)"
                :rooms-loaded="true" :loading-rooms="loadingRooms" :load-first-room="loadFirst" :room-id="roomId"
                :messages="JSON.stringify(messages)" :messages-loaded="messagesLoaded" :single-room="single"
                :user-tags-enabled="tag" :show-add-room="addRoom" :username-options="usernameOptions"
                :menu-actions="menuActions" @edit-message="editMessage($event.detail[0])"
                @delete-message="deleteMessage($event.detail[0])" @message-action-handler="handleMessageAction"
                @send-message="sendMessage($event.detail[0])" @fetch-messages="fetchMessages($event.detail[0])"
                @message-selection-action-handler="
                    messageSelectionActionHandler($event.detail[0])
                    " @open-file="openFile($event.detail[0])">
            </vue-advanced-chat>
        </div>
    </div>
</template>
  
<script>
import Button from '../components/Button.vue';
import { Search } from '@element-plus/icons-vue'
//import { authStore } from "../store/index.js"
import axios from 'axios'
import { ref } from 'vue';
import { register } from 'vue-advanced-chat'
import { authStore } from "../store/index.js"
import { useTransitionFallthroughEmits } from 'element-plus';
register()
export default {
    watch: {
        inputVal(newValue) {
            if (newValue) {
                this.searchData(true);
            } else {
                this.searchData(false);
            }
        },
    },
    data() {
        return {
            currentTeam: '',
            searchMessages: ['1', '2'],
            drawer: ref(false),
            currentUserId: '1',
            roomId: '1', //默认进入的id
            selectedRoom: '13', //当前选中群聊id
            messageSelectionActions: [{ name: 'deleteMessages', title: 'Delete' }],
            startRooms: null,
            endRooms: null,
            roomsLoaded: false,
            loadingRooms: false,
            loadingLastMessageByRoom: 0,
            lastLoadedMessage: null,
            loadFirst: true,
            previousLastLoadedMessage: null,
            single: false,
            tag: true,
            addRoom: false,
            teams: [], //存储该用户所参加的群聊
            sockets: [], //存储建立的websocket
            roomsListeners: [],
            listeners: [],
            inputVal: "", // 输入框输入值
            monitorData: [], // 表数据
            // menuActions: [
            // 	{ name: 'inviteUser', title: 'Invite User' }
            // ],
            //群聊
            rooms: [],
            // rooms: [
            //     {
            //         roomId: '1',
            //         roomName: 'Room 1',
            //         avatar: 'https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj',
            //         unreadCount: 4,
            //         index: 2,
            //         lastMessage: {
            //             content: 'Last message received',
            //             username: 'John Doe',
            //             timestamp: '10:20',
            //         },
            //         users: [
            //             {
            //                 _id: '4321',
            //                 username: 'John Snow',
            //                 avatar: 'https://pic1.zhimg.com/v2-d58ce10bf4e01f5086c604a9cfed29f3_r.jpg?source=1940ef5c',
            //             },
            //             {
            //                 _id: '1111',
            //                 username: 'John Mike',
            //                 avatar: 'https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj',

            //             },
            //             // { 
            //             // 	_id: '9999', 
            //             // 	username: '所有人', 
            //             // 	avatar: 'https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj',

            //             // }
            //         ],
            //     },
            // ]   
            messages: [
            ],
            messagesLoaded: false
        }
    },
    async created() {
        this.getTeams()
        this.getCurrentTeam()
        this.currentUserId = authStore().userId
        setTimeout(()=>{
            this.createWebsocket()
            console.log('当前用户id'+this.currentUserId)
            this.roomId = this.currentTeam
            this.selectedRoom = this.roomId
            console.log('现在所在的群聊'+this.selectedRoom) 
        },500) 
    },
    mounted() {
        setTimeout(() => {
            console.log('11111' + this.sockets)
            this.currentUserId = authStore().userId
            console.log('当前用户id'+this.currentUserId)
            this.init();
        }, 500)
        setTimeout(()=>{
            this.requestData(this.selectedRoom)
        },1000) 
    },
    methods: {
        // async init() {
        //     setTimeout(async () => {
        //         try {
        //             const { data: res } = await axios.get(`http://101.43.159.45:8001/api/chat/initial/` + this.currentUserId);
        //             console.log(`http://101.43.159.45:8001/api/chat/initial/` + this.currentUserId)
        //             // console.log(`获取到的消息` + res);
        //             this.rooms = ref([...res.rooms]);
        //             // await this.$nextTick
        //             console.log('所有群聊')
        //             console.log(res.rooms)
        //             console.log(this.rooms);
        //         }
        //         catch (error) {
        //             console.log(error);
        //         }
        //         for (let room of this.rooms) {
        //             if (room.roomId == this.selectedRoom) {
        //                 room.users = room.users.filter(user => user._id != this.currentUserId);
        //                 room.unreadCount = 0;
        //                 console.log(room.users);
        //                 const hasUserWithId = room.users.some(user => user._id == 9999);
        //                 if (!hasUserWithId) {
        //                     let all = {
        //                         username: '所有人',
        //                         _id: '9999',
        //                     }
        //                     room.users.push(all)
        //                 }
        //                 console.log(room.users)
        //                 break; // 如果 roomId 是唯一的，找到后就跳出循环
        //             }
        //         }
        //     }, 0)
        // },
        searchData(bool) {
            if (bool) {
                console.log('bbb')
                const msg = JSON.parse(this.messages)
                const searchMessage = this.inputVal.toLowerCase(); // 将搜索查询转换为小写以进行不区分大小写的匹配
                this.searchMessages = this.msg.filter(messages => messages.message.toLowerCase().includes(searchMessage));
            }
        },
        async getTeams() {
            try {
                const { data: res } = await axios.get('http://www.aamofe.top/api/team/all_teams/',
                    {
                        headers: {
                            Authorization: authStore().token
                        }
                    }
                );
                console.log('获取的teams' + res)
                this.teams = res.teams.map(team => team.id);
                console.log(this.teams)
            }
            catch (error) {
                console.log(error);
            }
        },
        async getCurrentTeam(){
            try {
                const { data: res } = await axios.get('http://www.aamofe.top/api/team/get_current_team/',
                    {
                        headers: {
                            Authorization: authStore().token
                        }
                    }
                );
                console.log(res)
                this.currentTeam = res.team.id
                console.log('当前所在的团队'+this.currentTeam)
            }
            catch (error) {
                console.log(error);
            }
        },
        createWebsocket() {
            console.log('需要获取的群聊', this.teams)
            setTimeout(() => {
                this.teams.forEach(team => {
                    const url = `ws://101.43.159.45:8001/${team}/chat/${this.currentUserId}`;
                    const ws = new WebSocket(url);
                    console.log(333, team)
                    console.log(url)
                    ws.onopen = () => {
                        console.log(`${team}Connected to the websocket server`);
                    };
                    ws.onerror = (error) => {
                        console.error(`WebSocket for team ${team} encountered an error:`, error);
                    };
                    ws.onmessage = this.onMessageReceived;
                    ws.onclose = (event) => {
                        console.log(`WebSocket for team ${team} is closed.` + event);
                    };
                    // 将 WebSocket 实例添加到 sockets 数组中
                    this.sockets[team] = ws
                });
            }, 0)

        },
        onMessageReceived(event) {
            console.log('Message received from server:', event.data);
            const parsedData = JSON.parse(event.data);
            console.log(parsedData)
            if (parsedData.type === 'chat_message') {
                if (parsedData.team_id == this.selectedRoom) {
                    const message = {
                        senderId: String(parsedData.user_id),
                        content: parsedData.message,
                        timestamp: parsedData.time,
                        avatar: parsedData.avatar_url,
                        _id: this.messages.length + 1,
                        username: parsedData.username,
                        files: parsedData.files
                    }
                    this.messages = [
                        ...this.messages,
                        message
                    ]
                    this.sockets[this.selectedRoom].send(JSON.stringify({
                        clean: 'clean'
                    }))
                }
            }
            if (parsedData.type === 'chat_status') {
                for (let room of this.rooms) {
                    if (room.roomId == parsedData.team_id) {
                        room.lastMessage.content = parsedData.latest_message;
                        room.lastMessage.username = parsedData.username;
                        room.lastMessage.timestamp = parsedData.time;
                        room.unreadCount = parsedData.unread_count;
                        room.index = parsedData.index
                        if (this.selectedRoom == parsedData.team_id) {
                            room.unreadCount = 0;
                        }
                        console.log(room.index)
                        break; // 如果 roomId 是唯一的，找到后就跳出循环
                    }
                }
            }
            if (!('type' in parsedData)) {
                const messages = []
                for (let i = 0; i < parsedData.messages.length; i++) {
                    let message = {
                        senderId: parsedData.messages[i].user_id,
                        content: parsedData.messages[i].message,
                        timestamp: parsedData.messages[i].time,
                        avatar: parsedData.messages[i].avatar_url,
                        _id: i + 1,
                        username: parsedData.messages[i].username,  // 修正这
                        // files: filesObject
                    };
                    messages.push(message);
                }
                this.messages = messages
            }
        },
        requestData(selectedRoom) {
            if (this.sockets[selectedRoom] && this.sockets[selectedRoom].readyState === WebSocket.OPEN) {
                const messageData = {
                    all: '1',
                    user_id: this.currentUserId
                };
                this.sockets[selectedRoom].send(JSON.stringify(messageData))
                console.log('请求群聊消息发送成功')
            }
        },
        sendDataToServerTest(data, roomId) {
            if (roomId == 1) {
                // 首先确保WebSocket连接是开启的
                if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                    // 如果发送的数据是对象，可以先将其转换为JSON字符串
                    const dataStr = JSON.stringify(data);
                    this.ws.send(dataStr);
                    console.log(dataStr)
                    console.log('发送成功')
                }
                else {
                    console.log('false')
                }
            }
            else if (roomId == 2) {
                // 首先确保WebSocket连接是开启的
                if (this.ws2 && this.ws2.readyState === WebSocket.OPEN) {
                    // 如果发送的数据是对象，可以先将其转换为JSON字符串
                    const dataStr = JSON.stringify(data);
                    this.ws2.send(dataStr);
                    console.log(dataStr)
                    console.log('发送成功')
                }
            }
        },
        sendDataToServer(data, roomId) {
            if (this.sockets[roomId] && this.sockets[roomId].readyState === WebSocket.OPEN) {
                // 如果发送的数据是对象，可以先将其转换为JSON字符串
                const dataStr = JSON.stringify(data);
                this.sockets[roomId].send(dataStr);
                const containsAt = data.message.includes("@");
                const containsAtAll = data.message.includes("@所有人");

                if (containsAt) {
                    if (containsAtAll) {
                        this.sockets[roomId].send(JSON.stringify({
                            type: 'chat',
                            range: 'all',
                            roomId: roomId,
                            url: 'http://localhost:8081/chat',
                        }));
                    }
                    else {
                        const user = this.rooms[Id].users.find(user => user.username === username);
                        this.sockets[roomId].send(JSON.stringify({
                            type: 'chat',
                            range: 'individual',
                            roomId: roomId,
                            url: 'http://localhost:8081/chat',
                            user_id: user.id
                        }));
                    }
                }
                console.log(dataStr)
                console.log('发送成功')
            }
            else {
                console.log('false')
            }
        },
        resetMessages() {
            this.messages = []
            this.messagesLoaded = false
            this.lastLoadedMessage = null
            this.previousLastLoadedMessage = null
            this.listeners.forEach(listener => listener())
            this.listeners = []
        },

        handleMessageAction(action) {
            switch (action.name) {
                case 'addMessageToFavorite':
                    // 你添加到收藏的代码
                    console.log('1')
                    break;
                case 'shareMessage':
                    // 你分享消息的代码
                    console.log('2')
                    break;
                // 添加其他case语句来处理其他的操作
            }
        },
        //格式化文件
        formattedFiles(files) {
            const formattedFiles = []
            console.log('文件')
            console.log(files)
            files.forEach(file => {
                const messageFile = {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    extension: file.extension || file.type,
                    url: file.url || file.localUrl
                }

                if (file.audio) {
                    messageFile.audio = true
                    messageFile.duration = file.duration
                }

                if (file.video) {
                    messageFile.video = true
                    // 如果视频有特定的属性，例如duration或resolution，您可以在这里添加它们
                    // messageFile.videoDuration = file.videoDuration;
                    // messageFile.videoResolution = file.videoResolution;
                }
                formattedFiles.push(messageFile)
            })

            return formattedFiles
        },
        //格式化消息
        formatMessage(room, message) {
            // const senderUser = room.users.find(user => user._id === message.sender_id)
            const formattedMessage = {
                ...message,
                ...{
                    senderId: message.sender_id,
                    _id: message.id,
                    seconds: message.timestamp.seconds,
                    timestamp: '',
                    date: '',
                    username: room.users.find(user => message.sender_id === user._id)
                        ?.username,
                    // avatar: senderUser ? senderUser.avatar : null,
                    distributed: true
                }
            }

            if (message.replyMessage) {
                formattedMessage.replyMessage = {
                    ...message.replyMessage,
                    ...{
                        senderId: message.replyMessage.sender_id
                    }
                }
            }

            return formattedMessage
        },
        //获取消息
        fetchMessages({ room, options = {} }) {
            this.selectedRoom = room.roomId
            setTimeout(() => {
                //加载messages
                if (options.reset) {
                    this.messages = []
                    for (let room of this.rooms) {
                        if (room.roomId == this.selectedRoom) {
                            room.users = room.users.filter(user => user._id != this.currentUserId);
                            room.unreadCount = 0;
                            console.log(room.users);
                            const hasUserWithId = room.users.some(user => user._id == 9999);
                            if (!hasUserWithId) {
                                let all = {
                                    username: '所有人',
                                    _id: '9999',
                                }
                                room.users.push(all)
                            }
                            break; // 如果 roomId 是唯一的，找到后就跳出循环
                        }
                    }
                    this.requestData(this.selectedRoom)
                    console.log(this.messages)
                    console.log('当前群聊的id' + room.roomId)
                }
            })
        },
        //生成一个消息数组，用于模拟从后端获取的数据。
        addMessages(reset) {
            const messages = []
            //console.log(roomId)
            for (let i = 0; i < 5; i++) {
                messages.push({
                    _id: reset ? i : messages.length + i,
                    content: `${reset ? '' : 'paginated'}message ${i + 1}`,
                    avatar: 'https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj',
                    senderId: '4321',
                    username: 'John Snow',
                    date: '13 November',
                    timestamp: '10:20'
                })
            }
            for (let i = 0; i < 5; i++) {
                messages.push({
                    _id: reset ? i : messages.length + i,
                    content: `${reset ? '' : 'paginated'}message ${i + 1}`,
                    avatar: 'https://pic1.zhimg.com/v2-d58ce10bf4e01f5086c604a9cfed29f3_r.jpg?source=1940ef5c',
                    senderId: '1111',
                    username: 'John Mike',
                    date: '13 November',
                    timestamp: '10:20',
                    system: false,
                    saved: false,
                    distributed: false,
                    seen: true,
                    deleted: false,
                    failure: false,
                    disableActions: false,
                    disableReactions: false,
                })
            }
            return messages
        },
        //发送一条新的聊天消息。
        sendMessage({ content, files, replyMessage }) {
            console.log('发送消息的群聊id:' + this.selectedRoom)
            // const user = this.rooms[0].users.find(u => u._id === this.currentUserId);
            // const username = user ? user.username : 'Unknown User';
            // const message = {
            // 	senderId: this.currentUserId,
            // 	content: content,
            // 	timestamp: new Date().toString().substring(16, 21),
            // 	date: new Date().toDateString(),
            // 	avatar: 'https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj',
            // 	_id: this.messages.length,
            // }
            const messageData = {
                message: content,
                user_id: this.currentUserId
            };
            if (files) {
                messageData.files = this.formattedFiles(files)
                fetch(files.localUrl)
                    .then(response => response.blob())
                    .then(blob => {
                        // 这里你可以处理这个Blob对象
                        console.log('文件' + blob);
                    })
                    .catch(error => {
                        console.error("Error fetching the blob:", error);
                    });
            }
            if (replyMessage) {
                messageData.replyMessage = {
                    _id: replyMessage._id,
                    content: replyMessage.content,
                    sender_id: replyMessage.senderId
                }
            }
            // if(replyMessage.files){
            //   messageData.replyMessage.files = replyMessage.files
            // }
            console.log('发送消息')
            //发送消息给服务器
            this.sendDataToServer(messageData, this.selectedRoom);
            console.log('发送后' + this.messages.length)
        },
        //模拟发送一条新消息。
        addNewMessage() {
            setTimeout(() => {
                this.messages = [
                    ...this.messages,
                    {
                        _id: this.messages.length,
                        content: 'NEW MESSAGE',
                        senderId: '1234',
                        timestamp: new Date().toString().substring(16, 21),
                        date: new Date().toDateString()
                    }
                ]
            }, 2000)
        },
        async deleteMessage({ message }) {
            try {
                //从本地状态中删除消息
                this.messages = this.messages.filter(m => m._id !== message._id);
            } catch (error) {
                console.error("Error deleting message:", error);
                // 可以在这里处理错误，例如显示一个错误提示给用户
            }
        },
        messageSelectionActionHandler({ action, messages }) {
            switch (action.name) {
                case 'deleteMessages':
                    messages.forEach(message => {
                        this.deleteMessage({ message })
                    })
            }
        },
        editMessage({ messageId, newContent }) {
            console.log('ok')
            // 查找要编辑的消息在数组中的位置
            const messageIndex = this.messages.findIndex(messages => messages._id === messageId);
            console.log(newContent)
            console.log(messageIndex)
            console.log(this.messages[messageIndex])
            //this.messages[messageIndex].editedAt = new Date(); // 如果你想跟踪何时编辑了消息
            // 如果你正在使用Vue，那么可能需要重新设置数组以触发视图的更新
            this.messages = [...this.messages];
            console.log(this.messages)
            this.$set(this.messages, messageIndex, {
                ...this.messages[messageIndex],
                content: newContent,
                edited: new Date()
            });

        },
        openFile({ file }) {
            window.open(file.file.url, '_blank')
        },
        // 右上角搜索框--模糊查询
        searchData(bool) {
            this.currentPage = 1;
            if (bool) {
                // 前端实现模糊查询--不用对接口
                let newListData = []; // 用于存放搜索出来数据的新数组
                if (this.inputVal) {
                    this.monitorData.filter((item) => {
                        if (item.name.indexOf(this.inputVal) !== -1) {
                            newListData.push(item);
                        }
                    });
                }
                this.monitorData = newListData;
            } else {
                this.refreshData(); //刷新页面，即点击搜索框的清除会回到原始页面
            }
        },
        // menuActionHandler({ action }) {
        // 	switch (action.name) {
        // 		case 'inviteUser':
        // 			console.log('访问成功')
        // 	}
        // },
    }
}
</script>
  
<style lang="scss">
body {
    font-family: 'Quicksand', sans-serif;
}

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
</style>
  