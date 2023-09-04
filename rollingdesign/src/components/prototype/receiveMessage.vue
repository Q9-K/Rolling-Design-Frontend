<!--
 * @Date: 2023-08-27 14:53:57
 * @Author: Q9K
 * @Description:
-->
<template>
	<!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav> -->
	<!-- <router-view /> -->

	<!--
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
	<router-link to="/chat">Chat</router-link>
  </nav>
  <router-view/>


    user
  </router-link> -->
	<!-- <router-view></router-view> -->
	<div class="container">
		<el-popover placement="top-start" :width="800" trigger="click"
			popper-style="padding: 0;width:400px; max-height=800px;overflow-y:auto;">
			<template #reference>
				<div class="box">
					<i class="iconfont icon-xiaoxitongzhi"></i>
					<div class='dot'></div>
				</div>
			</template>
			<template #default>
				<div class="bigbox">
					<div class="menu">
						<div class="yidu" @click="this.setUnRead()">
							未读
						</div>
						<div class="weidu" @click="this.setRead()">
							已读
						</div>
						<div class="allyidu" @click="this.markReadAll()">
							全部已读
						</div>
					</div>
					<div class="messagebox">
						<div class="one" v-for='(dataitem, index) in storeData' :key=dataitem.id>
							<template v-if="dataitem.is_read == showMessageType">
								<div class="message_content">
									<span>张三</span>在<a target="_blank" href='http://www.aamofe.top/chat'>{{ dataitem.type }}</a>中@了你
								</div>
								<div class="actions">
									<template v-if="dataitem.type == false">
										<div class="aciton1" @click="this.markRead(index)">
											标记已读
										</div>
									</template>
									<template v-else>
										<div class="action1" @click="this.markweidu(index)">
											标记未读
										</div>
									</template>
									<div class="action2" @click="this.deleteMessage(index)">
										删除消息
									</div>
								</div>
							</template>
						</div>

					</div>
					<!-- </template> -->
				</div>
				<div class="delete"> <el-button type="danger">删除全部</el-button> </div>
			</template>
		</el-popover>
	</div>
</template>
<script>
// const app = createApp(App)


import { Check, Delete, Edit, Message, Search, Star } from '@element-plus/icons-vue'
import { provide, onMounted, onBeforeMount, ref, reactive } from 'vue'
import axios from 'axios'
import qs from 'qs'
import { useSocketStore } from '../../store/useSocketStore'
import { authStore } from '@/store'
export default {
	data() {
		return {
			datalist: [],
			storeData: [],
			showMessageType: true
		}
	},
	async mounted() {
		const { data: res } = await axios.get('http://101.43.159.45:8001/api/chat/' + authStore().userId);
		console.log(res)
		this.storeData = res
		//this.datalist = this.storeData.filter(obj => obj.is_read === false)
		this.datalist = this.storeData
		console.log('datalist' + this.datalist)
	},
	methods: {
		setRead() {
			this.showMessageType = !this.showMessageType
			// this.storeData[index].is_read = !this.storeData[index].is_read
			// this.datalist = this.storeData.filter(obj => obj.is_read === true)
		},
		setUnRead() {
			this.showMessageType = !this.showMessageType
		},
		async markweidu(index) {
			this.storeData[index].is_read = !this.storeData[index].is_read

			//let res = await axios.post('将一个消息标记为未读接口')
			console.log(1)
		},
		async markRead(index) {
			this.storeData[index].is_read = !this.storeData[index].is_read
			let res = await axios.post(`http://101.43.159.45:8001/api/chat/notice/make_read/${this.storeData[index].id}`,)
			// let targetObject = this.storeData.find(obj => obj.id === this.datalist[index].Id);
			// console.log(targetObject)
			console.log(res.data)
			// targetObject.is_read = true
			// this.datalist = this.storeData.filter(obj => obj.is_read === false)
		},
		async deleteMessage(index) {
			let res = await axios.delete('http://101.43.159.45:8001/api/chat/notice/delete/' + this.storeData[index].id)
			this.storeData.splice(index, 1)
			console.log(res.data)
		},
		async markRead(index) {

			this.storeData[index].is_read = !this.storeData[index].is_read
			let res = await axios.post('http://101.43.159.45:8001/api/chat/notice/make_read/', qs.stringify({
				id: this.storeData[index].id
			}))

		},

		async markReadAll() {
			let res = await axios.put(`http://101.43.159.45:8001/api/chat/notice/all_as_read/1`)
		},
		async deleteMessageAll() {
			this.storeData = []
			let res = await axios.delete('http://101.43.159.45:8001/api/chat/notice/delete_all_read/1')
		}
	}
}
// const message_type = ref(false)
// let datalist = reactive([{}])
// let storeData = reactive([{}])

// const deleteMessage = (index) => {
// 	datalist.splice(index, 1)
// }
// const deleteMessageAll = () => {

// }
// const setRead = () => {
// 	datalist
// }
// const socketStore = useSocketStore()
// const axiosInstance = axios.create({
//   baseURL: 'http://www.aamofe.top/api', // 设置基本 URL
// });
// provide('axios', axiosInstance)


onMounted(async () => {
	let res = await axios.get('http://101.43.159.45:8001/api/chat/1')
	// storeData = JSON.parse(res.data)
	// console.log(storeData)
	console.log(res.data)
	storeData = res.data
	// datalist = storeData.filter(obj => obj.is_read === true)
	console.log(datalist)
})
// onBeforeMount(() => {
//   const socket = new WebSocket('ws://101.43.159.45:8001/13/chat/2')
//   socketStore.socket = socket
// })
// socket.close(1000, '我太傻逼了')

</script>

<style lang="scss">
.bigbox {
	display: flex;
	flex-direction: column;
	width: 400px;

	.menu {
		cursor: pointer;
		height: 20px;
		display: flex;
		text-align: center;
		background-color: aliceblue;

		.yidu {
			text-align: center;
			flex: 1;
		}

		.weidu {
			text-align: center;
			flex: 1;
		}

		.allyidu {
			text-align: center;
			flex: 1;
		}

	}


	.messagebox {
		// background-color: red;
		height: 200px;

		.one {
			display: flex;

			.message_content {
				left: 5px;
				justify-content: center;
				padding-top: 5px;
				flex: 2;
			}

			.actions {
				display: flex;
				flex: 2;
				cursor: pointer;
				.action1 {
					margin-top: 5px;
					padding-left: 20px;
					padding-right: 20px;
					flex: 1;
				}

				.action2 {
					margin-top: 5px;
					padding-left: 20px;
					padding-right: 20px;
					flex: 1;
				}
			}
		}

	}
}
</style>
