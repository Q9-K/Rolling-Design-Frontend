<template>
    <div>
        <div class="chat-container">
            <vue-advanced-chat height="calc(100vh )" :theme="theme" :current-user-id="currentUserId"
                :rooms="JSON.stringify(rooms)" :rooms-loaded="true" :loading-rooms="loadingRooms"
                :load-first-room="loadFirst" :room-id="roomId" :messages="JSON.stringify(messages)"
                :messages-loaded="messagesLoaded" :single-room="single" :user-tags-enabled="tag"
                :show-add-room="addRoomButton" :username-options="usernameOptions"
                :menu-actions="JSON.stringify(menuActions)"
                :message-selection-actions="JSON.stringify(messageSelectionActions)"
                @edit-message="editMessage($event.detail[0])" @delete-message="deleteMessage($event.detail[0])"
                @message-action-handler="handleMessageAction" @send-message="sendMessage($event.detail[0])"
                @fetch-messages="fetchMessages($event.detail[0])"
                @message-selection-action-handler="messageSelectionActionHandler($event.detail[0])"
                @open-file="openFile($event.detail[0])" @add-room="addRoom($event.detail[0])"
                @menu-action-handler="menuActionHandler($event.detail[0])">"
            </vue-advanced-chat>
            <div class="backHome">
                <div class="actions1">
                    <div class="backToCenter">
                        <el-tooltip class="box-item" effect="dark" content="返回个人中心" placement="bottom-end">
                            <i class="iconfont icon-shouye" @click="this.$router.push('/index')"
                                style="color: deepskyblue;font-size:36px"></i>
                        </el-tooltip>
                    </div>
                </div>
            </div>
            <div class="button-theme">
                <el-button class="button-light" @click="theme = 'light', console.log('changeToDark')">
                    Light
                </el-button>
                <el-button class="button-dark" @click="theme = 'dark', console.log('changeToLight')">
                    Dark
                </el-button>
            </div>
            <div v-if="showModal" class="modal-overlay">
                <div class="infoHead" style="height: 10% ;display: flex; justify-content: center; align-items: center;">
                    <el-input placeholder="选择消息" class="addRoomInput" v-model="inputVal" clearable
                        style="height: 60%; width: 80%; box-sizing: border-box;">
                        <template #append>
                            <el-button icon="Search" @click="searchData(true)"></el-button>
                        </template>
                    </el-input>
                </div>
                <div class="infoBody" style="height: 80%;overflow-y:auto ; ">
                    <div style="height:20px">
                        <p v-if="this.searchMessages.length != 0" style="font-size: small;position: absolute; right: 50px;">
                            一共{{ this.searchMessages.length }}条消息</p>
                    </div>
                    <ul>
                        <li class="message" v-for="(item, index) in searchMessages" :key="index" :id="item.id"
                            @mouseover="handleMouseOver(item)" @mouseleave="handleMouseLeave(item)" @click="locate(item)"
                            :style="getStyle(item)">
                            <div style="display: flex; align-items: center; height: 40px;">
                                <div style="flex-grow: 1; display: flex; justify-content: center; align-items: center;">
                                    <img :src="item.avatar" alt="Avatar" style="height: 40px; width:40px;">
                                </div>
                                <div style="display: flex; flex-direction: column; flex-grow: 6;">
                                    <div style="text-align: left;">{{ item.username }}</div>
                                    <div style="text-align: left;">{{ item.content }}</div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="infoFoot" style="height: 10%">
                    <div style="display: flex; text-align: center ; justify-content:flex-start;height:100%">
                        <el-button @click="closeModal()" style="height: 50%; width:30%; margin-top:15px; margin-left: 20px">
                            关闭
                        </el-button>
                    </div>
                </div>
            </div>
            <!-- 展示群聊信息 -->
            <div v-if="showRoomInformation" class="modal-overlay">
                <div class="infoHead" style="height: 10% ;display: flex; justify-content: center; align-items: center;">
                    <el-input placeholder="搜索群成员" class="addRoomInput" v-model="searchInfoKey" clearable
                        style="height: 60%; width: 80%; box-sizing: border-box;">
                        <template #append>
                            <el-button icon="Search" @click="searchInfoUsers"></el-button>
                        </template>
                    </el-input>
                </div>
                <div class="infoBody" style="height: 80%; overflow-y:auto">
                    <div class="infoBodyContainer">
                        <!-- <div class="infoBodyBlock" v-for="(item, index) in currentUsers" :key="index"
                            @click="singleChat(item)">
                            <img :src="item.avatar" alt="用户头像" style="width:40px;height:40px">
                            {{ item.username }}
                        </div> -->
                        <div class="infoBlock">
                            <div class="infoRoomRightBodyBlock" v-for="(item, index) in searchCurrentUsers" :key="index"
                                @click="singleChat(item)">
                                <img :src="item.avatar" alt="用户头像" style="width:40px;height:40px">
                                <div class="roomNameContainer">
                                    <div class="roomName"> {{ item.username }} </div>
                                </div>
                            </div>
                            <div class="infoRoomRightBodyBlock">
                                <el-icon style="width:40px;height:40px" @click="infoInviteUser()">
                                    <CirclePlus />
                                </el-icon>
                                <div class="roomNameContainer">
                                    <div class="roomName"> 添加新用户 </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="infoBodySeparator"></div>
                    <div class="infoBodyModify" style="max-height: 500px; background-color:white">
                        <div class="infoBodyModifyOne" style="height: 60px;margin-top:10px">
                            <div style="margin-left: 30px ;margin-top:10px">
                                <p style="font-size: 16px;" @click="showSearch = !showSearch">群聊名称</p>
                            </div>
                            <div v-show="!showSearch" @click="showSearch = true" style="margin-left: 30px ;margin-top:10px">
                                <span style="font-size: 14px;font-wight:bold;color:#CCCCCC"> 点击修改群名称 </span>
                                <el-icon style="color:#CCCCCC">
                                    <EditPen />
                                </el-icon>
                            </div>
                            <el-input v-show="showSearch" ref="searchInput"
                                style="margin-left: 20px;margin-right:30px; margin-top:5px;width:200px;"
                                @keyup.enter="updateGroupName" v-model="newGroupName">搜索</el-input>
                        </div>
                    </div>
                </div>
                <div class="infoFoot" style="height: 10%">
                    <div style="display: flex; text-align: center ; justify-content:flex-start;height:100%">
                        <el-button @click="closeModal()" style="height: 50%; width:30%; margin-top:15px; margin-left: 20px">
                            关闭
                        </el-button>
                    </div>
                </div>
            </div>
            <div v-if="showForward" class="forward-overlay">
                <div class="forward">
                    <div class="forwardLeft">
                        <div class="addRoomLeftHead">
                            <el-input placeholder="选择群聊" class="forwardInput" v-model="searchForwardRoomKey" clearable>
                                <template #append>
                                    <el-button icon="Search" @click="searchForwardRooms()"></el-button>
                                </template>
                            </el-input>
                        </div>
                        <div class="addRoomLeftBody">
                            <ul>

                                <li v-for="(item, index) in searchForwardRoom" :key="index" class="addRoomUser"
                                    style="display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid #ddd;">
                                    <input type="checkbox" v-model="item.checked"
                                        @change="handleForwardCheckboxChange(item)"
                                        style="flex: 1 0 auto; margin-right: 10px; border-radius: 50%;">
                                    <div
                                        style="flex: 0 0 auto; display: flex; justify-content: center; align-items: center; height: 40px;">
                                        <img :src="item.avatar" alt="Avatar"
                                            style="height: 25px; width: 25px; text-align: center;">
                                    </div>
                                    <div style="flex: 6; display: flex; align-items: center; margin-left: 10px;">
                                        <span>{{ item.roomName }}</span>
                                    </div>
                                </li>

                                <!-- <li v-for="(item, index) in searchForwardRoom" :key="index" class="addRoomUser">
                                    <input type="checkbox" v-model="item.checked"
                                        @change="handleForwardCheckboxChange(item)" style="flex-grow: 1;border-radius: 50%">
                                    <div
                                        style="flex-grow: 1;display: flex; justify-content: center; align-items: center; height: 40px;">
                                        <img :src="item.avatar" alt="Avatar"
                                            style="height: 25px; width:25px; text-align:center">
                                    </div>
                                    <div
                                        style="display: flex; justify-content: flex-start; align-items: center; height: 40px; flex-grow:6">
                                        <span style="text-align: center;">{{ item.roomName }}</span>
                                    </div>
                                </li> -->
                            </ul>
                        </div>
                    </div>
                    <div class="forwardRight">
                        <div class="addRoomRightHead">
                            <div class="addRoomRightHeadText">
                                <span>选择群聊</span>
                            </div>
                            <div class="num"
                                style="flex-grow: 6; display: flex; justify-content: flex-end; margin-right:30px">
                                <p v-if="this.forwardSelectedRooms.length != 0" style="font-size: small;">
                                    已选择{{ this.forwardSelectedRooms.length }}个群聊</p>
                            </div>
                        </div>
                        <div class="addRoomRightBody">
                            <div class="block">
                                <div class="addRoomRightBodyBlock" v-for="(item, index) in forwardRooms" :key="index">
                                    <img :src="item.avatar" alt="群聊头像" style="width:40px;height:40px">
                                    <div class="roomNameContainer">
                                        <div class="roomName"> {{ item.roomName }} </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="addRoomRightFoot">
                            <el-button @click="sendMergedForward()" class="addRoomRightFootButton">完成</el-button>
                            <el-button @click="closeForward()" class="addRoomRightFootButton">取消</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="showAddRoom" class="forward-overlay">
                <div class="forward">
                    <div class="forwardLeft">
                        <div class="addRoomLeftHead">
                            <el-input placeholder="选择用户" class="addRoomInput" v-model="searchAddRoomKey" clearable>
                                <template #append>
                                    <el-button icon="Search" @click="searchAddedUsers()"></el-button>
                                </template>
                            </el-input>
                        </div>
                        <div class="addRoomLeftBody">
                            <ul>
                                <!-- <li v-for="(item, index) in searchAddRoomUsers" :key="index" class="addRoomUser">
                                    <input type="checkbox" v-model="item.checked" @change="handleCheckboxChange(item)"
                                        style="flex-grow: 1;border-radius: 50%">
                                    <div
                                        style="flex-grow: 1;display: flex; justify-content: center; align-items: center; height: 40px;">
                                        <img :src="item.avatar_url" alt="Avatar"
                                            style="height: 25px; width:25px; text-align:center">
                                    </div>
                                    <div
                                        style="display: flex; justify-content: flex-start; align-items: center; height: 40px; flex-grow:6">
                                        <span style="text-align: center;">{{ item.username }}</span>
                                    </div>
                                </li> -->
                                <li v-for="(item, index) in searchAddRoomUsers" :key="index" class="addRoomUser"
                                    style="display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid #ddd;">
                                    <input type="checkbox" v-model="item.checked" @change="handleCheckboxChange(item)"
                                        style="flex: 1 0 auto; margin-right: 10px; border-radius: 50%;">
                                    <div
                                        style="flex: 0 0 auto; display: flex; justify-content: center; align-items: center; height: 40px;">
                                        <img :src="item.avatar_url" alt="Avatar"
                                            style="height: 25px; width: 25px; text-align: center;">
                                    </div>
                                    <div style="flex: 6; display: flex; align-items: center; margin-left: 10px;">
                                        <span>{{ item.username }}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="forwardRight">
                        <div class="addRoomRightHead">
                            <div class="addRoomRightHeadText">
                                <span>选择联系人</span>
                            </div>
                            <div class="num"
                                style="flex-grow: 6; display: flex; justify-content: flex-end; margin-right:30px">
                                <p v-if="this.addRoomSelectedUsers.length != 0" style="font-size: small;">
                                    已选择{{ this.addRoomSelectedUsers.length }}个用户</p>
                            </div>
                        </div>
                        <div class="addRoomRightBody">
                            <div class="block">
                                <div class="addRoomRightBodyBlock" v-for="(item, index) in addSelectedRoomUsers"
                                    :key="index">
                                    <img :src="item.avatar_url" alt="用户头像" style="width:40px;height:40px">
                                    <div class="roomNameContainer">
                                        <div class="roomName"> {{ item.username }} </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="addRoomRightFoot">
                            <el-button @click="sendAddRoom" class="addRoomRightFootButton">完成</el-button>
                            <el-button @click="closeAddRoom" class="addRoomRightFootButton">取消</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="showInviteUsers" class="forward-overlay">
                <div class="forward">
                    <div class="forwardLeft">
                        <div class="addRoomLeftHead">
                            <el-input placeholder="选择用户" class="addRoomInput" v-model="searchInviteRoomKey" clearable>
                                <template #append>
                                    <el-button icon="Search" @click="searchInvitedUsers()"></el-button>
                                </template>
                            </el-input>
                        </div>
                        <div class="addRoomLeftBody">
                            <ul>
                                <li v-for="(item, index) in searchInviteUsers" :key="index" class="addRoomUser">
                                    <input type="checkbox" v-model="item.checked" @change="handleInviteCheckboxChange(item)"
                                        style="flex-grow: 1;border-radius: 50%">
                                    <div
                                        style="flex-grow: 1;display: flex; justify-content: center; align-items: center; height: 40px;">
                                        <img :src="item.avatar_url" alt="Avatar"
                                            style="height: 25px; width:25px; text-align:center">
                                    </div>
                                    <div
                                        style="display: flex; justify-content: flex-start; align-items: center; height: 40px; flex-grow:6">
                                        <span style="text-align: center;">{{ item.username }}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="forwardRight">
                        <div class="addRoomRightHead">
                            <div class="addRoomRightHeadText">
                                <span>选择联系人</span>
                            </div>
                            <div class="num"
                                style="flex-grow: 6; display: flex; justify-content: flex-end; margin-right:30px">
                                <p v-if="this.inviteSelectedUsers.length != 0" style="font-size: small;">
                                    已选择{{ this.inviteSelectedUsers.length }}个用户</p>
                            </div>
                        </div>
                        <div class="addRoomRightBody">
                            <div class="block">
                                <div class="addRoomRightBodyBlock" v-for="(item, index) in invitedUsers" :key="index">
                                    <img :src="item.avatar_url" alt="用户头像" style="width:40px;height:40px">
                                    <div class="roomNameContainer">
                                        <div class="roomName"> {{ item.username }} </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="addRoomRightFoot">
                            <el-button @click="sendInviteUser" class="addRoomRightFootButton">完成</el-button>
                            <el-button @click="closeInviteUser" class="addRoomRightFootButton">取消</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="isForwardMessages" class="forward-overlay">
                <div style="height:10%">
                    聊天记录
                </div>
                <div style="height:80%">
                    <ul>
                        <li v-for="(item, index) in receiveForwardMessages" :key="index" class="message">
                            <div v-if="item.forwarded_messages.length === 0">
                                <!-- <img :src="item.avatar_url" alt="Avatar">
                                <span>{{ item.message }}</span>
                                <span>{{ item.user_name }}</span> -->
                                <div style="display: flex; align-items: center; height: 40px;">
                                    <div style="flex-grow: 1; display: flex; justify-content: center; align-items: center;">
                                        <img :src="item.avatar_url" alt="Avatar" style="height: 40px; width:40px;">
                                    </div>
                                    <div style="display: flex; flex-direction: column; flex-grow: 6;">
                                        <div style="text-align: left;">{{ item.user_name }}</div>
                                        <div style="text-align: left;">{{ item.message }}</div>
                                    </div>
                                </div>
                            </div>
                            <div v-else @click="handleClick(item.forwarded_messages)">
                                <div style="display: flex; align-items: center; height: 40px;">
                                    <div style="flex-grow: 1; display: flex; justify-content: center; align-items: center;">
                                        聊天记录
                                    </div>
                                    <div style="display: flex; flex-direction: column; flex-grow: 6;">
                                        <div style="text-align: left;">{{ item.user_name }}</div>
                                        <div style="text-align: left;">{{ item.message }}</div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div style="height:10%">
                    <el-button @click="this.isForwardMessages = false">退出</el-button>
                </div>
            </div>
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
    components: {
        Search
    },
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
            theme: 'dark',
            showSearch: false,
            isForwardMessages: false,
            isMerge: false,
            isOneByOne: false,
            newGroupName: '',
            group_id: '',
            addUserKey: '',
            searchAddRoomKey: '',
            searchInviteRoomKey: '',
            searchForwardRoomKey: '',
            searchInfoKey: '',
            showAddRoom: false,
            showModal: false,
            showForward: false,
            showInviteUsers: false,
            messagesPerPage: 20,
            currentTeam: '',
            saveReceiveForwardMessages: [],
            receiveForwardMessages: [],
            saveSearchAddRoomUsers: [],
            searchAddRoomUsers: [], //创建和添加共用
            saveSearchInviteUsers: [],
            searchInviteUsers: [],
            searchMessages: [],
            searchForwardRoom: [],
            searchCurrentUsers: [],
            drawer: ref(false),
            currentUserId: '1',
            roomId: '1', //默认进入的id
            selectedRoom: '', //当前选中群聊id
            lastRoomId: '',
            lastUser: '',
            messagesLoaded: false,
            startRooms: null,
            endRooms: null,
            roomsLoaded: true,
            loadingRooms: false,
            loadingLastMessageByRoom: 0,
            lastLoadedMessage: null,
            loadFirst: true,
            previousLastLoadedMessage: null,
            single: false,
            tag: true,
            addRoomButton: true,
            showRoomInformation: false,
            forwardMessages: [],
            initRooms: [],
            teams: [], //存储该用户所参加的群聊
            sockets: [], //存储建立的websocket
            noticeWs: '',
            roomsListeners: [],
            listeners: [],
            inputVal: "", // 输入框输入值
            monitorData: [], // 表数据
            addSelectedRoomUsers: [],
            addRoomSelectedUsers: [],
            inviteSelectedUsers: [],
            invitedUsers: [],
            forwardSelectedRooms: [],
            forwardRooms: [],
            currentUsers: [],
            mergedMessages: [],
            messageSelectionActions: [
                {
                    name: 'deleteMessages',
                    title: '删除'
                },
                {
                    name: 'forwardMessagesOneByOne',
                    title: '逐条转发'
                },
                {
                    name: 'forwardMergedMessages',
                    title: '合并转发'
                }
            ],
            menuActions: [
                { name: 'inviteUser', title: 'Invite User' }
            ],
            messageSelectionActions: [
                {
                    name: 'deleteMessages',
                    title: '删除'
                },
                {
                    name: 'forwardMessagesOneByOne',
                    title: '逐条转发'
                },
                {
                    name: 'forwardMergedMessages',
                    title: '合并转发'
                }
            ],
            //群聊
            rooms: [],
            messages: [],
            messagesLoaded: false
        }
    },
    async created() {
        this.currentUserId = authStore().userId
        this.getTeams()
        this.getCurrentTeam()
        setTimeout(() => {
            this.createWebsocket()
            console.log('当前用户id' + this.currentUserId)
            this.roomId = '3'
            this.selectedRoom = this.roomId
            console.log('现在所在的群聊' + this.selectedRoom)
        }, 500)
    },
    mounted() {
        setTimeout(() => {
            console.log('sockets')
            console.log(this.sockets)
            this.currentUserId = authStore().userId
            console.log('当前用户id' + this.currentUserId)
            this.init();
        }, 500)
        setTimeout(() => {
            this.requestData(this.selectedRoom)
        }, 1000)
        document.addEventListener('click', this.checkClickOutside);
    },
    beforeDestroy() {
        document.removeEventListener('click', this.checkClickOutside);
    },
    methods: {
        async init() {
            setTimeout(async () => {
                try {
                    const { data: res } = await axios.get(`http://www.aamofe.top/api/chat/initial/` + this.currentUserId);
                    console.log(`http://101.43.159.45:8001/api/chat/initial/` + this.currentUserId)
                    console.log(res)
                    this.rooms = ref([...res.rooms]);
                    this.initRooms = this.rooms
                    // await this.$nextTick
                    console.log('所有群聊')
                    console.log(this.initRooms)
                    console.log(this.rooms);
                    // for (let room of this.rooms) {
                    //     // const userExists = room.users.some(user => user.id == '9999');
                    //     // if (!userExists) {
                    //     //     const newUser = { _id: 9999, name: "所有人" };
                    //     //     room.users.push(newUser);
                    //     // }
                    //     if (room.roomId == this.selectedRoom) {
                    //         const identification = room.users.find(user => user._id == this.currentUserId).role
                    //         room.users = room.users.filter(user => user._id != this.currentUserId);
                    //         room.unreadCount = 0;
                    //         console.log(room.users);
                    //         const hasUserWithId = room.users.some(user => user._id == '9999');
                    //         if ((!hasUserWithId && identification == 'CR')) {
                    //             let all = {
                    //                 username: '所有人',
                    //                 _id: '9999',
                    //             }
                    //             room.users.push(all)
                    //             // const userIndex = room.users.findIndex(user => user._id == '9999');
                    //             // // 如果找到用户，则将其从数组中删除
                    //             // if (userIndex !== -1) {
                    //             //     room.users.splice(userIndex, 1);
                    //             // }
                    //         }
                    //         break; // 如果 roomId 是唯一的，找到后就跳出循环
                    //     }
                    //     // room.users
                    // }
                }
                catch (error) {
                    console.log(error);
                }
            }, 0)
        },
        locate(item) {
            this.showModal = false
            const tag = document.getElementsByTagName('vue-advanced-chat')[0]
            //console.log(tag)
            const located = tag.shadowRoot.getElementById(item.id)
            const innerElement = located.querySelector('.vac-format-message-wrapper span span');
            innerElement.style.color = 'red';
            innerElement.style.fontSize = '20px';
            setTimeout(() => {
                if (this.theme == 'light') {
                    innerElement.style.color = 'black';
                    innerElement.style.fontSize = '14px';
                }
                else {
                    innerElement.style.color = 'white';
                    innerElement.style.fontSize = '14px';
                }
            }, 5000);
            console.log(located)
            located.scrollIntoView({ behavior: 'smooth', block: 'end' })
            console.log('跳转成功')
        },
        handleMouseOver(item) {
            // 在这里进行鼠标悬停时的事件处理
            console.log('鼠标悬停在', item.content);
            // 其他逻辑...
            item.isHovered = true
            console.log(item.isHovered)
        },
        handleMouseLeave(item) {
            console.log('鼠标离开', item.content)
            item.isHovered = false
            console.log(item.isHovered)
        },
        getStyle(item) {
            console.log(item.isHovered)
            return {
                backgroundColor: item.isHovered ? '#555' : 'white'
            };
        },
        searchData(bool) {
            if (bool) {
                console.log('bbb')
                const searchMessage = this.inputVal.toLowerCase().replace(/\s/g, ''); // 将搜索查询转换为小写以进行不区分大小写的匹配
                const searchMessagesArray = this.messages.filter(messages => messages.content.toLowerCase().includes(searchMessage));
                this.searchMessages = searchMessagesArray.map((message) => ({ id: message._id, content: message.content, isHovered: false, avatar: message.avatar, username: message.username }));
                console.log(this.searchMessages)
            }
        },
        async getTeams() {
            try {
                const { data: res } = await axios.get('http://101.43.159.45:8001/api/chat/get_group/' + authStore().userId);
                console.log('获取的teams' + res)
                // this.teams = res.teams.map(team => team.id);
                this.teams = res.groups
                console.log(this.teams)
            }
            catch (error) {
                console.log(error);
            }
        },
        async getCurrentTeam() {
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
                console.log('当前所在的团队' + this.currentTeam)
            }
            catch (error) {
                console.log(error);
            }
        },
        createWebsocket() {
            console.log('需要获取的群聊', this.teams)
            setTimeout(() => {
                const url = `ws://101.43.159.45:8001/notice/${this.currentUserId}`
                const ws = new WebSocket(url);
                console.log(url)
                ws.onopen = () => {
                    console.log(`Notice Connected to the websocket server`);
                };
                ws.onerror = (error) => {
                    console.error(`WebSocket for team notice encountered an error:`, error);
                };
                ws.onmessage = this.onMessageReceived;
                ws.onclose = (event) => {
                    console.log(`WebSocket for notice is closed.`);
                    console.log(event)
                };
                // 将 WebSocket 实例添加到 sockets 数组中
                this.noticeWs = ws
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
                        console.log(`WebSocket for team ${team} is closed.`);
                        console.log(event)
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
            //邀请成员老用户
            if (parsedData.type === 'chat_add_members') {
                this.rooms.find(room => room.roomId == parsedData.roomId).users = parsedData.users
                console.log(this.rooms.find(room => room.roomId == parsedData.roomId).users)
                console.log('添加用户后的群聊成员')
                //修改@user
                let room = this.rooms.find(room => room.roomId == parsedData.roomId)
                if (room.roomId == this.selectedRoom) {
                    this.currentUsers = room.users
                    console.log('添加成员的users')
                    console.log(this.currentUsers)
                    //修改群聊信息里的user数组
                    //room.users = room.users.filter(user => user._id != this.currentUserId);
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
                }
            }
            //解散群聊
            if (parsedData.type === 'chat_delete_all') {
                let foundRoom = null;
                for (let i = 0; i < this.rooms.length; i++) {
                    if (this.rooms[i].roomId == parsedData.roomID) {
                        foundRoom = this.rooms[i];
                        break;
                    }
                }
                console.log(foundRoom)
                this.rooms = this.rooms.filter(room => room.roomId != parsedData.roomID)
                console.log(this.rooms)
                console.log('解散成功')
            }
            //退出群聊
            if (parsedData.type === 'chat_delete_personal') {
                console.log(this.rooms)
                const room = this.rooms.find(room => room.roomId == parsedData.roomId);
                console.log(room)
                if (room) {
                    // 从群聊的 users 数组中移除 userid 为 uid 的人
                    room.users = room.users.filter(user => user._id != parsedData.deleter_id);
                    console.log(room.users)
                }
                console.log('删除成功')
            }
            //新建群聊和邀请成员
            if (parsedData.type === 'new_group_chat') {
                console.log(parsedData.room[0].roomId)
                this.rooms = [...this.rooms, parsedData.room[0]]
                console.log('现在所有房间')
                console.log(this.rooms)
                const url = `ws://101.43.159.45:8001/${parsedData.room[0].roomId}/chat/${this.currentUserId}`;
                const ws = new WebSocket(url);
                console.log(333, parsedData.room[0].roomId)
                console.log(url)
                ws.onopen = () => {
                    console.log(`${parsedData.room[0].roomId}Connected to the websocket server`);
                };
                ws.onerror = (error) => {
                    console.error(`WebSocket for team ${parsedData.room[0].roomId} encountered an error:`, error);
                };
                ws.onmessage = this.onMessageReceived;
                ws.onclose = (event) => {
                    console.log(`WebSocket for team ${parsedData.room[0].roomId} is closed.`);
                    console.log(event)
                };
                // 将 WebSocket 实例添加到 sockets 数组中
                this.sockets[parsedData.room[0].roomId] = ws
            }
            //接收消息
            if (parsedData.type === 'chat_message') {
                if (parsedData.team_id == this.selectedRoom) {
                    const message = {
                        senderId: String(parsedData.user_id),
                        content: parsedData.message,
                        timestamp: parsedData.time,
                        avatar: parsedData.avatar_url,
                        _id: parsedData.message_id,
                        date: parsedData.date,
                        username: parsedData.user_name,
                        // date: parsedData.date
                        // replyMessage: parsedData.replyMessage,
                        files: parsedData.files.filter(file => file !== null)
                    }
                    // if (parsedData.replyMessage != null) {
                    //     // console.log('麻了')
                    //     // const parsedObject = JSON.parse(parsedData.messages[i].replyMessage);
                    //     // const replyMessage = {
                    //     //     content : parsedObject.content,
                    //     //     sender_id : parsedObject.sender_id,
                    //     //     _id : parsedObject._id
                    //     // }
                    //     message.replyMessage = parsedData.replyMessage
                    // }
                    console.log('获得的消息')
                    console.log(message)

                    const proxyMessage = new Proxy(message, {});

                    this.messages = [
                        ...this.messages,
                        proxyMessage
                    ];

                    // this.messages = [
                    //     ...this.messages,
                    //     message
                    // ]
                    console.log('发送消息之后')
                    console.log(this.messages)
                    this.sockets[this.selectedRoom].send(JSON.stringify({
                        clean: 'clean'
                    }))
                }
            }
            if (parsedData.type == 'chat_forward_message') {
                if (parsedData.team_id == this.selectedRoom) {
                    const message = {
                        senderId: String(parsedData.message.user_id),
                        content: parsedData.message.message,
                        timestamp: parsedData.message.time,
                        avatar: parsedData.message.avatar_url,
                        _id: parsedData.message.message_id,
                        date: parsedData.message.date,
                        username: parsedData.message.user_name,
                        files: parsedData.message.files.filter(file => file !== null),
                        forwarded_messages: parsedData.message.forwarded_messages,
                        replyMessage: parsedData.message.replyMessage
                    }
                    console.log('获得的消息')
                    console.log(message)

                    const proxyMessage = new Proxy(message, {});

                    this.messages = [
                        ...this.messages,
                        proxyMessage
                    ];
                    this.sockets[this.selectedRoom].send(JSON.stringify({
                        clean: 'clean'
                    }))
                    setTimeout(() => {
                        const tag = document.getElementsByTagName('vue-advanced-chat')[0]

                        const located = tag.shadowRoot.getElementById(parsedData.message.message_id)

                        const innerElement = located.querySelector('.vac-format-message-wrapper span span');
                        console.log(innerElement)
                        //innerElement.addEventListener('click', this.handleClick(event));
                        located.addEventListener("contextmenu", (event) => {
                            this.isForwardMessages = true;
                            console.log(this.isForwardMessages);
                            this.receiveForwardMessages = parsedData.message.forwarded_messages;
                            console.log(parsedData.message.forwarded_messages);
                            console.log('显示成功');
                        });
                    }, 200);
                }
            }
            //改变群聊状态信息
            if (parsedData.type === 'chat_status') {
                for (let room of this.rooms) {
                    if (room.roomId == parsedData.team_id) {
                        //room.lastMessage.content = parsedData.latest_message;
                        room.lastMessage.username = parsedData.username;
                        room.lastMessage.timestamp = parsedData.time;
                        room.unreadCount = parsedData.unread_count;
                        room.index = parsedData.index
                        if (this.selectedRoom == parsedData.team_id) {
                            room.unreadCount = 0;
                        }
                        if (parsedData.latest_message != null) {
                            room.lastMessage.content = parsedData.latest_message;
                        }
                        console.log(room.index)
                        break; // 如果 roomId 是唯一的，找到后就跳出循环
                    }
                }
            }
            //获取消息
            if (!('type' in parsedData)) {
                try {
                    const messages = []
                    if (parsedData.messages.length > 0) {
                        for (let i = 0; i < parsedData.messages.length; i++) {
                            let message = {
                                senderId: parsedData.messages[i].user_id,
                                content: parsedData.messages[i].message,
                                timestamp: parsedData.messages[i].time,
                                avatar: parsedData.messages[i].avatar_url,
                                date: parsedData.messages[i].date,
                                _id: parsedData.messages[i].message_id,
                                username: parsedData.messages[i].username,
                                files: parsedData.messages[i].files,
                                forwarded_messages: parsedData.messages[i].forwarded_messages,

                            };
                            // if (parsedData.messages[i].replyMessage!= '{}'){
                            //     console.log('麻了')
                            //     const parsedObject = JSON.parse(parsedData.messages[i].replyMessage);
                            //     const replyMessage = {
                            //         content : parsedObject.content,
                            //         sender_id : parsedObject.sender_id,
                            //         _id : parsedObject._id
                            //     }
                            //     message.replyMessage = replyMessage
                            // }
                            if (parsedData.messages[i].forwarded_messages.length != 0) {
                                setTimeout(() => {
                                    const tag = document.getElementsByTagName('vue-advanced-chat')[0]

                                    const located = tag.shadowRoot.getElementById(parsedData.messages[i].message_id)
                                    console.log(parsedData.messages[i])
                                    const innerElement = located.querySelector('.vac-format-message-wrapper span span');
                                    console.log(innerElement)
                                    //innerElement.addEventListener('click', this.handleClick(event));
                                    located.addEventListener("contextmenu", (event) => {
                                        this.isForwardMessages = true;
                                        console.log(this.isForwardMessages);
                                        this.receiveForwardMessages = parsedData.messages[i].forwarded_messages;
                                        console.log(parsedData.messages[i].forwarded_messages);
                                        console.log('显示成功');
                                    });
                                }, 200);
                            }
                            messages.push(message);
                        }
                        this.messages = messages
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        },
        handleClick(forwardedMessages) {
            this.receiveForwardMessages = forwardedMessages
            this.isForwardMessages = false
            setTimeout(() => {
                this.isForwardMessages = true
            }, 1000);
            console.log(this.receiveForwardMessages)
        },
        requestData(selectedRoom) {
            if (this.sockets[selectedRoom] && this.sockets[selectedRoom].readyState === WebSocket.OPEN) {
                const messageData = {
                    all: '10',
                    user_id: this.currentUserId
                };
                this.sockets[selectedRoom].send(JSON.stringify(messageData))
                console.log('请求群聊消息发送成功')
            }
        },
        sendDataToServer(data, roomId) {
            if (this.sockets[roomId] && this.sockets[roomId].readyState === WebSocket.OPEN) {
                // 如果发送的数据是对象，可以先将其转换为JSON字符串
                const dataStr = JSON.stringify(data);
                this.sockets[roomId].send(dataStr);
                const containsAt = data.message.includes("usertag");
                const containsAtAll = data.message.includes("9999");
                const regex = /<usertag>(.*?)<\/usertag>/;
                const match = data.message.match(regex);
                const value = match ? match[1] : null;
                if (containsAt) {
                    if (containsAtAll) {
                        console.log('@所有人')
                        this.noticeWs.send(JSON.stringify({
                            type: 'chat',
                            range: 'all',
                            roomID: roomId,
                            url: 'http://localhost:8081/chat',
                        }));
                    }
                    else {
                        console.log(value)
                        console.log('@单个人')
                        this.noticeWs.send(JSON.stringify({
                            type: 'chat',
                            range: 'individual',
                            roomID: roomId,
                            url: 'http://localhost:8081/chat',
                            user_id: value
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
            // this.lastLoadedMessage = null
            // this.previousLastLoadedMessage = null
            // this.listeners.forEach(listener => listener())
            // this.listeners = []
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
        async formattedFiles(files) {
            const formattedFiles = []

            for (const file of files) {
                const url = file.url || file.localUrl
                console.log(file.url || file.localUrl)
                let theFile
                let formData = new FormData()

                let extension = "";

                if (file.type === "application/pdf") {
                    extension = ".pdf";
                } else if (file.type === "image/jpeg" || file.type === "image/jpg") {
                    extension = ".jpg";
                } else if (file.type === "image/png") {
                    extension = ".png";
                } else if (file.type === "video/mp4") {
                    extension = ".mp4";
                } else if (file.type === "audio/mpeg" || file.type === "audio/mp3") {
                    extension = ".mp3";
                } else if (file.type === "text/plain") {
                    extension = ".txt";
                } else if (file.type === "") {
                    extension = ".md";
                }
                // 可以根据需要添加其他 MIME 类型和对应的默认后缀

                const fileName = file.name + extension;

                try {
                    const response = await fetch(url)
                    console.log(file.url || file.localUrl)
                    const blob = await response.blob()
                    theFile = new File([blob], fileName, {
                        type: file.type,
                        lastModified: new Date().getTime()
                    })
                    formData.append('avatar', theFile)
                    console.log('formData')
                    console.log(formData.get('avatar'))
                    const { data: res } = await axios.post(`http://www.aamofe.top/api/chat/document/${this.selectedRoom}/${this.currentUserId}`, formData)
                    console.log('获取成功')
                    console.log(res.url)
                    const messageFile = {
                        name: fileName,
                        size: file.size,
                        type: file.type,
                        //extension: file.extension || file.type,
                        url: res.url,
                        //file: theFile
                    }

                    if (file.audio) {
                        messageFile.audio = true
                        messageFile.duration = file.duration
                    }
                    formattedFiles.push(messageFile)
                } catch (error) {
                    console.error(error)
                }
            }
            return formattedFiles
        },
        //获取消息
        async fetchMessages({ room, options = {} }) {
            this.selectedRoom = room.roomId
            setTimeout(() => {
                //加载messages
                if (options.reset) {
                    this.resetMessages()
                    try {
                        if (this.rooms.length !== 0 && this.selectedRoom != null) {
                            const room = this.rooms.find(room => room.roomId == this.selectedRoom);
                            const roomIndex = this.initRooms.find(room => room.roomId == this.selectedRoom);
                            console.log(room)
                            this.currentUsers = room ? room.users : [];
                            this.currentUsers = this.currentUsers.filter(user => user._id != '9999')
                            console.log('this.currentUsers')
                            console.log(this.currentUsers)
                            if (room.type == "group" && room.creator_id == this.currentUserId) {
                                this.menuActions = [
                                    { name: 'inviteUser', title: '邀请用户' },
                                    { name: 'deleteRoom', title: '解散群聊' },
                                    { name: 'searchMessage', title: '搜索消息' },
                                    { name: 'roomInformation', title: '群聊信息' }
                                ]
                            }
                            else if (room.type == "group" && !room.creator_id == this.currentUserId) {
                                this.menuActions = [
                                    { name: 'removeUser', title: '退出群聊' },
                                    { name: 'searchMessage', title: '搜索消息' },
                                    { name: 'roomInformation', title: '群聊信息' }
                                ]
                            }
                            else if (room.type == "team") {
                                this.menuActions = [
                                    { name: 'searchMessage', title: '搜索消息' },
                                    { name: 'roomInformation', title: '群聊信息' }
                                ]
                            }
                            else {
                                this.menuActions = [
                                    { name: 'searchMessage', title: '搜索消息' },
                                    { name: 'roomInformation', title: '群聊信息' }
                                ]
                            }
                        }
                    } catch (error) {
                        console.log(error)
                    }
                    //把上次的room恢复user，存lastRoomId,lastUser
                    // for (let room of this.rooms) {
                    //     if (room.roomId == this.lastRoomId) {
                    //         room.users = [...room.users, this.lastUser]
                    //         console.log('恢复后的room')
                    //         console.log(room)
                    //         break; // 如果 roomId 是唯一的，找到后就跳出循环
                    //     }
                    // }
                    for (let room of this.rooms) {
                        if (room.roomId == this.selectedRoom) {
                            console.log('room群聊')
                            console.log(room)
                            this.lastRoomId = this.selectedRoom
                            this.lastUser = room.users.find(user => user._id == this.currentUserId)
                            console.log("lastUser")
                            console.log(this.lastUser)
                            const identification = room.users.find(user => user._id == this.currentUserId).role
                            //room.users = room.users.filter(user => user._id != this.currentUserId);
                            room.unreadCount = 0;
                            console.log(room.users);
                            const hasUserWithId = room.users.some(user => user._id == 9999);
                            if (!hasUserWithId && identification == 'CR') {
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
                    console.log('当前群聊的id' + this.selectedRoom)
                    setTimeout(() => {
                        console.log('群聊长度' + this.messages.length)
                        if (this.messages.length == 0 || this.messages.length < this.messagesPerPage) {
                            this.messagesLoaded = true
                        }
                    }, 2000);
                }
                else {
                    this.messagesLoaded = true
                }
            })
        },
        //发送一条新的聊天消息。
        async sendMessage({ content, files, replyMessage }) {
            console.log('发送消息的群聊id:' + this.selectedRoom)
            const date = new Date();
            const day = date.getDate();
            const month = date.toLocaleString('en-US', { month: 'long' });
            const formattedDate = `${day} ${month}`;
            console.log('日期' + formattedDate)
            const messageData = {
                message: content,
                user_id: this.currentUserId,
                date: formattedDate
            };
            //messageData.files = []
            if (files) {
                messageData.files = await this.formattedFiles(files)
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
            console.log(messageData)
            this.sendDataToServer(messageData, this.selectedRoom);
            console.log('发送后' + this.messages.length)
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
            const link = document.createElement('a');
            // 这里是将链接地址url转成blob地址，
            fetch(file.file.url).then(res => res.blob()).then(blob => {
                link.href = URL.createObjectURL(blob)
                // 下载文件的名称及文件类型后缀
                link.download = file.file.name;
                document.body.appendChild(link)
                link.click()
                //在资源下载完成后 清除 占用的缓存资源
                window.URL.revokeObjectURL(link.href);
                document.body.removeChild(link);
            });
            window.open(file.file.url, '_blank')
        },
        menuActionHandler({ action, roomId }) {
            switch (action.name) {
                case 'inviteUser':
                    return this.inviteUser(roomId)
                case 'removeUser':
                    return this.ExitRoom(roomId)
                case 'deleteRoom':
                    return this.dissolveRoom(roomId)
                case 'deleteSingleRoom':
                    return this.dissolveSingleRoom(roomId)
                case 'searchMessage':
                    return this.searchMessage()
                case 'roomInformation':
                    return this.showInformation()
            }
        },
        showInformation() {
            this.showRoomInformation = true
            this.searchCurrentUsers = this.currentUsers
            setTimeout(() => {
                this.$nextTick(() => {
                    const modalOverlay = document.querySelector('.modal-overlay');
                    modalOverlay.classList.add('show-modal');
                });
            }, 300);
        },
        closeInformation() {
            const modalOverlay = document.querySelector('.modal-overlay');
            modalOverlay.classList.remove('show-modal');
            setTimeout(() => {
                this.showModal = false;
            }, 300); // 等待动画完成再移除元素
        },
        searchMessage() {
            console.log('搜索消息')
            this.showModal = true;
            setTimeout(() => {
                this.$nextTick(() => {
                    const modalOverlay = document.querySelector('.modal-overlay');
                    modalOverlay.classList.add('show-modal');
                });
            }, 300);
        },
        closeModal() {
            const modalOverlay = document.querySelector('.modal-overlay');
            modalOverlay.classList.remove('show-modal');
            setTimeout(() => {
                this.showModal = false;
            }, 300); // 等待动画完成再移除元素
        },
        closeSearch() {
            const modalOverlay = document.querySelector('.modal-overlay');
            modalOverlay.classList.remove('show-modal');
            setTimeout(() => {
                this.showModal = false;
            }, 300); // 等待动画完成再移除元素
        },
        messageSelectionActionHandler({ action, messages, roomId }) {
            switch (action.name) {
                case 'deleteMessages':
                    messages.forEach(message => {
                        return this.deleteMessage({ message, roomId })
                    })
                case 'forwardMessagesOneByOne':
                    return this.forwardMessagesOneByOne(messages)
                case 'forwardMergedMessages':
                    // messages.forEach(message => {
                    //     return this.forwardMergedMessages()
                    // })
                    return this.forwardMergedMessages(messages)
            }
        },
        // async forwardMessagesOneByOne(messages, roomId) {
        //     this.showForward = true
        // },
        forwardMergedMessages(messages) {
            this.isMerge = true
            this.showForward = true
            this.forwardMessages = messages
            console.log(messages)
            this.searchForwardRoom = this.rooms
            console.log('被搜索的群聊')
            console.log(this.searchForwardRoom)
        },
        forwardMessagesOneByOne(messages) {
            this.isOneByOne = true
            this.showForward = true
            this.forwardMessages = messages
            console.log(messages)
            this.searchForwardRoom = this.rooms
            console.log('被搜索的群聊')
            console.log(this.searchForwardRoom)
        },
        closeForward() {
            this.showForward = false
            this.forwardRooms = []
            this.forwardSelectedRooms = []
            this.searchForwardRoomKey = ''
            this.searchForwardRooms = []
            this.isMerge = false
            this.isOneByOne = false
            this.searchInfoKey = ''
        },
        closeAddRoom() {
            this.showAddRoom = false
            this.addRoomSelectedUsers = []
            this.addSelectedRoomUsers = []
            this.searchAddRoomKey = ''
        },
        async infoInviteUser() {
            try {
                console.log(this.rooms.find(room => room.roomId == this.selectedRoom))
                if (!(this.currentUsers.find(user => user._id == this.currentUserId).role == 'CR' && this.rooms.find(room => room.roomId == this.selectedRoom).type == 'group')) {
                    return this.$message.error('您无法邀请成员')
                }
            } catch (error) {
                return this.$message.error('您无法邀请成员')
            }
            this.showInviteUsers = true
            const { data: res } = await axios.get('http://www.aamofe.top/api/chat/get_all_groups_members/' + authStore().userId);
            this.searchAddRoomUsers = res.members;
            //const filteredArray = mainArray.filter(item => !removeArray.includes(item));
            console.log(this.currentUsers)
            this.searchInviteUsers = res.members.filter(item => !this.currentUsers.some(user => user._id == item.id));
            this.saveSearchInviteUsers = this.searchInviteUsers
            this.showRoomInformation = false
            console.log('InviteUser所有人')
            console.log(this.searchInviteUsers)
        },
        async inviteUser() {
            this.showInviteUsers = true
            const { data: res } = await axios.get('http://www.aamofe.top/api/chat/get_all_groups_members/' + authStore().userId);
            this.searchAddRoomUsers = res.members;
            //const filteredArray = mainArray.filter(item => !removeArray.includes(item));
            console.log(this.currentUsers)
            this.searchInviteUsers = res.members.filter(item => !this.currentUsers.some(user => user._id == item.id));
            this.saveSearchInviteUsers = this.searchInviteUsers
            this.showRoomInformation = false
            console.log('InviteUser所有人')
            console.log(this.searchInviteUsers)
        },
        async sendInviteUser() {
            const inviteRoomData = {
                group_id: this.selectedRoom,
                invitees: this.inviteSelectedUsers,
            }
            const { data: res } = await axios.post('http://www.aamofe.top/api/chat/add_group_member', inviteRoomData);
            this.showInviteUsers = false
            return this.$message.success("邀请成员成功")
        },
        closeInviteUser() {
            this.showInviteUsers = false
            this.inviteSelectedUsers = []
            this.searchInviteUsers = []
            this.invitedUsers = []
            this.searchInviteRoomKey = ''
        },
        async sendAddRoom() {
            const addRoomData = {
                creator_id: this.currentUserId,
                invitees: this.addRoomSelectedUsers,
                url: "https://summer-1315620690.cos.ap-beijing.myqcloud.com/team_cover/default.png"
            }
            const { data: res } = await axios.post('http://www.aamofe.top/api/chat/make_group', addRoomData);
            this.group_id = res.group_id
            console.log('addRoom所有人')
            console.log(this.group_id)
            console.log(this.searchAddRoomUsers)
            return this.$message.success("创建群聊成功");
        },
        async addRoom() {
            this.showAddRoom = true
            const { data: res } = await axios.get('http://www.aamofe.top/api/chat/get_all_groups_members/' + authStore().userId);
            this.searchAddRoomUsers = res.members;
            this.saveSearchAddRoomUsers = res.members;
            console.log('addRoom所有人')
            console.log(this.searchAddRoomUsers)
        },
        dissolveRoom() {
            const messageData = {
                delete_all: '2',
                room_id: this.currentUserId,
            };
            this.sockets[this.selectedRoom].send(JSON.stringify(messageData))
            this.rooms = this.rooms.filter(room => room.roomId != this.selectedRoom)
            console.log('解散群聊成功')
            console.log(this.rooms.length)
            return this.$message.success(`群聊解散成功`);
        },
        dissolveSingleRoom(){
            const messageData = {
                delete_all: '2',
                room_id: this.currentUserId,
            };
            this.sockets[this.selectedRoom].send(JSON.stringify(messageData))
            this.rooms = this.rooms.filter(room => room.roomId != this.selectedRoom)
            console.log('解散群聊成功')
            console.log(this.rooms.length)
            return this.$message.success(`私聊解散成功`);
        },
        ExitRoom(roomId) {
            const messageData = {
                delete_personal: '2',
                deleter_id: this.currentUserId,
                user_id: this.currentUserId
            };
            this.sockets[this.selectedRoom].send(JSON.stringify(messageData))
            this.rooms = this.rooms.filter(room => room.roomId != this.selectedRoom)
            console.log('退出群聊成功')
            console.log(this.rooms.length)
            return this.$message.success("退出群聊成功");
        },
        handleInviteCheckboxChange(item) {
            if (item.checked) {
                // 将选中的项添加到 users 数组中
                if (!this.addSelectedRoomUsers.some(user => user.id == item.id)) {
                    this.inviteSelectedUsers.push(item.id);
                    this.invitedUsers.push(item)
                }
            } else {
                // 从 users 数组中移除未被选中的项
                this.inviteSelectedUsers = this.inviteSelectedUsers.filter(user => user !== item.id);
                this.invitedUsers = this.invitedUsers.filter(user => user.id !== item.id)
            }
            console.log(this.inviteSelectedUsers)
        },
        handleCheckboxChange(item) {
            if (item.checked) {
                if (!this.addSelectedRoomUsers.some(user => user.id == item.id)) {
                    // 将选中的项添加到 users 数组中
                    this.addSelectedRoomUsers.push(item)
                    this.addRoomSelectedUsers.push(item.id);
                }
            } else {
                // 从 users 数组中移除未被选中的项
                this.addRoomSelectedUsers = this.addRoomSelectedUsers.filter(user => user !== item.id);
                this.addSelectedRoomUsers = this.addSelectedRoomUsers.filter(user => user.id !== item.id)
            }
            console.log(this.addRoomSelectedUsers)
            console.log(this.addSelectedRoomUsers)
        },
        handleForwardCheckboxChange(item) {
            if (item.checked) {
                if (!this.forwardRooms.some(room => room.roomId == item.roomId)) {
                    // 将选中的项添加到 users 数组中
                    this.forwardRooms.push(item)
                    this.forwardSelectedRooms.push(item.roomId);
                }
            } else {
                // 从 users 数组中移除未被选中的项
                this.forwardRooms = this.forwardRooms.filter(user => user.roomId !== item.roomId);
                this.forwardSelectedRooms = this.forwardSelectedRooms.filter(user => user !== item.roomId)
            }
            console.log(item.roomId)
            console.log(this.forwardRooms)
        },
        async singleChat(item) {
            console.log(item)
            if (item._id != this.currentUserId) {
                const addRoomData = {
                    creator_id: this.currentUserId,
                    invitee_id: item._id,
                }
                const { data: res } = await axios.post('http://www.aamofe.top/api/chat/make_private_chat', addRoomData);
                //this.group_id = res.group_id
                //this.selectedRoom = this.group_id
                //this.roomId = this.group_id
                console.log('进行私聊')
                console.log(this.group_id)
                return this.$message.success(`与用户${item._id}建立私聊成功`)
            }

        },
        searchForwardRooms() {
            const searchMessage = this.searchForwardRoomKey.toLowerCase().replace(/\s/g, ''); // 将搜索查询转换为小写以进行不区分大小写的匹配
            console.log(searchMessage)
            const selectedRooms = this.rooms.filter(room => room.roomId != this.selectedRoom)
            console.log(selectedRooms)
            const searchMessagesArray = selectedRooms.filter(messages => messages.roomName.toLowerCase().includes(searchMessage));
            console.log(searchMessagesArray)
            this.searchForwardRoom = searchMessagesArray.map((message) => ({ avatar: message.avatar, roomId: message.roomId, roomName: message.roomName }));
            console.log(this.searchForwardRoom)
        },
        searchAddedUsers() {
            const searchMessage = this.searchAddRoomKey.toLowerCase().replace(/\s/g, ''); // 将搜索查询转换为小写以进行不区分大小写的匹配
            const searchMessagesArray = this.saveSearchAddRoomUsers.filter(messages => messages.username.toLowerCase().includes(searchMessage));
            this.searchAddRoomUsers = searchMessagesArray.map((message) => ({ avatar_url: message.avatar_url, id: message.id, username: message.username }));
            console.log(this.searchAddRoomUsers)
        },
        searchInvitedUsers() {
            const searchMessage = this.searchInviteRoomKey.toLowerCase().replace(/\s/g, ''); // 将搜索查询转换为小写以进行不区分大小写的匹配
            const searchMessagesArray = this.saveSearchInviteUsers.filter(messages => messages.username.toLowerCase().includes(searchMessage));
            this.searchInviteUsers = searchMessagesArray.map((message) => ({ avatar_url: message.avatar_url, id: message.id, username: message.username }));
            console.log(this.searchInviteUsers)
        },
        searchInfoUsers() {
            const searchMessage = this.searchInfoKey.toLowerCase().replace(/\s/g, ''); // 将搜索查询转换为小写以进行不区分大小写的匹配
            const searchMessagesArray = this.currentUsers.filter(messages => messages.username.toLowerCase().includes(searchMessage));
            this.searchCurrentUsers = searchMessagesArray.map((message) => ({ avatar: message.avatar, id: message.id, username: message.username }));
            console.log(this.searchInviteUsers)
        },
        updateGroupName() {

        },
        //forwardMessages,forwardRooms
        sendMergedForward() {
            const date = new Date();
            const day = date.getDate();
            const month = date.toLocaleString('en-US', { month: 'long' });
            const formattedDate = `${day} ${month}`;
            const messages_ids = this.forwardMessages.map(item => item._id)
            //const group_id = this.forwardRooms.map(item => item.roomId)
            if (this.isMerge) {
                const group_id = this.forwardRooms[0].roomId
                this.sockets[this.selectedRoom].send(JSON.stringify({
                    forward_all: "",
                    message_ids: messages_ids,
                    group_id: group_id,
                }))
                this.forwardMessages = []
                this.showForward = false
            }
            else if (this.isOneByOne) {
                const group_id = this.this.forwardRooms[0].roomId
                this.sockets[this.selectedRoom].send(JSON.stringify({
                    forward_single: "",
                    message_ids: messages_ids,
                    group_id: group_id,
                }))
            }
        }
    }
}
</script>
  
<style lang="scss" scoped> body {
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
                 font-size: 36px;
                 cursor: pointer;
                 opacity: 0.8;

                 &:hover {
                     color: #3671ff;
                 }
             }
         }

     }
 }

 .chat-container {
     position: relative;
     width: 100vw;
     /* 视窗的宽度 */
     height: 100vh;
     /* 视窗的高度 */
 }

 .com {
     width: 100%;
     height: 100%;
 }

 .modal-overlay {
     position: absolute;
     top: 64px;
     right: -500px;
     /* 使其部分重叠在 .com 上 */
     width: 300px;
     height: 570px;
     z-index: 9999;
     background-color: white;
     transition: right 0.3s ease-out;
     /* 过渡效果 */
 }

 .show-modal {
     right: 0 !important;
     /* 当显示时，右边位置为0 */
 }

 .forward-overlay {
     position: absolute;
     height: 500px;
     width: 600px;
     top: 50%;
     left: 60%;
     transform: translate(-50%, -50%);
     z-index: 9999;
     background-color: white
 }

 .forward {
     width: 100%;
     height: 100%;
     display: flex;
     position: relative;
 }

 .forward::after {
     content: "";
     position: absolute;
     top: 0;
     bottom: 0;
     width: 1px;
     background-color: black;
     left: 46.5%;
     transform: translateX(-50%);
 }

 .forward .forwardLeft {
     flex: 1;
     background-color: white;
 }

 .forward .forwardRight {
     flex: 1;
     background-color: white;
 }

 .messages {
     height: 500px;
     overflow-y: auto;
 }

 .message {
     border: 1px solid #ccc;
     border-radius: 4px;
     height: 30px;
     padding: 20px;
 }

 .backHome {
     position: absolute;
     height: 40px;
     width: 40px;
     top: 15px;
     right: 200px;
     margin: 0 0 0 0;
     z-index: 999999;
 }

 .button-theme {
     position: absolute;
     height: 40px;
     width: 200px;
     top: 15px;
     right: 220px;
     margin: 0 0 0 0;
     z-index: 999999;
 }

 .addRoomLeftHead {
     display: flex;
     align-items: center;
     padding: 10px;
 }

 .addRoomInput {
     flex: 1;
     margin-right: 10px;
     margin-left: 10px;
 }

 .addRoomLeftBody ul {
     list-style: none;
     padding: 0;
     margin: 0;
     overflow-y: auto;
     height: 430px
 }

 .addRoomUser {
     display: flex;
     align-items: center;
     margin-bottom: 10px;
 }


 .addRoomRightHead {
     height: 10%;
     display: flex;
     align-items: center;
     justify-content: flex-start;
     position: relative;
 }

 .addRoomRightHeadText {
     text-align: center;
     margin-left: 20px;
     flex-grow: 2;
 }


 .addRoomRightFoot {
     height: 10%;
     display: flex;
     align-items: center;
     justify-content: center;
 }

 .addRoomRightFootButton {
     margin-left: 50px;
     margin-right: 50px;
 }

 .addRoomRightBody {
     height: 80%;
 }

 .block {
     display: grid;
     grid-template-columns: repeat(3, 1fr);
     /* 每行三列，每列宽度相等 */
     grid-gap: 10px;
     /* 列之间的间距 */
 }

 .infoBlock {
     display: grid;
     grid-template-columns: repeat(4, 1fr);
     /* 每行三列，每列宽度相等 */
     grid-gap: 10px;
     /* 列之间的间距 */
 }

 // .addRoomRightBodyBlock {
 //     box-sizing: border-box;
 //     border: 1px hidden;
 //     padding: 10px;
 //     height: 70px;
 //     display: flex;
 //     flex-direction: column;
 //     align-items: center;
 // }
 .addRoomRightBodyBlock {
     display: flex;
     flex-direction: column;
     align-items: center;
     height: 70px;
     width: 70px;
     /* 每行宽度的三分之一，减去间距的宽度 */
     box-sizing: border-box;
     margin-top: 20px;
 }

 .infoRoomRightBodyBlock {
     display: flex;
     flex-direction: column;
     align-items: center;
     height: 65px;
     width: 64px;
     /* 每行宽度的三分之一，减去间距的宽度 */
     box-sizing: border-box;
     margin-top: 20px;
 }

 .infoBodyContainer {
     display: flex;
     flex-wrap: wrap;
     max-height: 200px;
     overflow-y: auto;
     background-color: white;
 }

 .infoBodyBlock {
     width: 25%;
     /* 每个块状元素占据一行的 25% 宽度 */
     box-sizing: border-box;
     border: 1px hidden;
     padding: 10px;
 }

 .roomNameContainer {
     width: 70px;
     overflow: hidden;
     text-overflow: ellipsis;
     white-space: nowrap;
 }

 .roomNameContainer:hover {
     overflow: visible;
 }

 .roomNameContainer .roomName {
     font-size: 10px;
     white-space: nowrap;
     text-overflow: ellipsis;
     text-align: center;
 }

 .roomNameContainer .roomName:hover {
     white-space: normal;
     overflow: visible;
     text-overflow: inherit;
 }

 .infoBodySeparator {
     border-top: 1px solid #ccc;
     margin: 10px 0;
 }
</style>
  