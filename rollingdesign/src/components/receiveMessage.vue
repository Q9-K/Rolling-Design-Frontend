<!--
 * @Date: 2023-08-27 14:53:57
 * @Author: Q9K
 * @Description:
-->
<template>
	<div class="container">
		<el-popover placement="top-start" :width="800" trigger="click"
			popper-style="padding: 0;width:400px; max-height=800px;overflow-y:auto;">
			<template #reference>
				<div class="box">
					<i class="iconfont icon-xiaoxitongzhi"></i>
				</div>
			</template>
			<template #default>
				<div class="bigbox">
					<div class="menu">
						<el-button class="yidu" @click="setUnRead()">
							未读
						</el-button>
						<el-button class="unRead" @click="setRead()">
							已读
						</el-button>
					</div>
					<div class="messagebox">
						<div class="one" v-for='(dataitem, index) in storeData' :key=dataitem.id>
							<template v-if="dataitem.is_read == showMessageType">
								<div class="message_content">
									<span>张三</span>在<a href='#' @click="dataitem.is_read == false ? markRead(index) : ''">{{
										dataitem.type }}</a>中@了你
								</div>
								<div class="actions">
									<template v-if="dataitem.is_read == false">
										<div class="aciton_one" @click="markRead(index)">
											标记已读
										</div>
									</template>
									<template v-else>
										<div class="action_one" @click="markunRead(index)">
											标记未读
										</div>
									</template>
									<div class="action2" @click="deleteMessage(index)">
										删除消息
									</div>
								</div>
							</template>
						</div>

					</div>
				</div>

				<div class="operations">
					<el-button @click="markReadAll()">
						全部已读
					</el-button>
					<el-button @click=" deleteAllRead()">
						删除已读
					</el-button>
				</div>
			</template>
		</el-popover>
	</div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
import { authStore } from "../store/index.js"
import { useSocketStore } from '../store/useSocketStore.js'
export default {
	data() {
		return {
			storeData: [],
			showMessageType: false
		}
	},
	async beforeCreate() {
		let res = await axios.get(`http://www.aamofe.top/api/chat/${authStore().userId}`)
		console.log("🚀 ~ file: receiveMessage.vue:173 ~ onMounted ~ res:", res.data)
		this.storeData = res.data
		const socketStore = useSocketStore()
		let socket = socketStore.socket
		if ((socket == null || socket.readyState != 1) && (authStore().isLogin)) {
			socket = new WebSocket(`ws://101.43.159.45:8001/notice/${authStore().userId}`)
			socketStore.socket = socket
			socket.onmessage = (event) => {
				console.log("🚀 ~ file: receiveMessage.vue:95 ~ beforeCreate ~ event:", event.data)
				this.storeData.unshift(event.data)
			}
		}

	},
	methods: {
		setRead() {
			this.showMessageType = true//显示已读
		},
		setUnRead() {
			this.showMessageType = false//显示未读
		},
		async markunRead(index) {
			this.storeData[index].is_read = false
			let res = await axios.post(`http://www.aamofe.top/api/chat/notice/make_unread/${this.storeData[index].id}`)
			console.log("🚀 ~ file: receiveMessage.vue:101 ~ markunRead ~ res:", res.data)
		},
		async markRead(index) {
			this.storeData[index].is_read = true
			let res = await axios.post(`http://www.aamofe.top/api/chat/notice/make_read/${this.storeData[index].id}`)
			console.log("🚀 ~ file: receiveMessage.vue:106 ~ markRead ~ res:", res.data)
		},
		async deleteMessage(index) {
			let res = await axios.delete(`http://www.aamofe.top/api/chat/notice/delete/${this.storeData[index].id}`)
			this.storeData.splice(index, 1)
			console.log("🚀 ~ file: receiveMessage.vue:110 ~ deleteMessage ~ res:", res)
		},

		async markReadAll() {
			let res = await axios.put(`http://www.aamofe.top/api/chat/notice/all_as_read/${authStore().userId}`)
			this.storeData.forEach((item) => {
				item.is_read = true
			})
			console.log("🚀 ~ file: receiveMessage.vue:124 ~ markReadAll ~ res:", res)
		},
		async deleteAllRead() {
			let res = await axios.delete(`http://www.aamofe.top/api/chat/notice/delete_all_read/${authStore().userId}`)
			this.storeData = this.storeData.filter((item) => {
				// console.log(item.is_read)
				return item.is_read == false
			})
			console.log("🚀 ~ file: receiveMessage.vue:131 ~ deleteAllRead ~ res:", res)
		}
	}
}


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
			box-sizing: border-box;
			border-right: 0.5px solid black;
		}

		.unRead {
			text-align: center;
			flex: 1;
			box-sizing: border-box;
			border-left: 0.5px solid black;
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

				.action_one {
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
