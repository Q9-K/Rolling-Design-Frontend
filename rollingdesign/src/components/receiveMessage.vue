<!--
 * @Date: 2023-08-27 14:53:57
 * @Author: Q9K
 * @Description:
-->
<template>
	<div class="container">
		<el-popover placement="top" width="1000" trigger="click"
			popper-style="padding: 0;width:400px; max-height=800px;overflow-y:auto;">
			<template #reference>
				<div class="box">
					<i class="iconfont icon-xiaoxitongzhi" style="font-size: 32px;cursor: pointer;"></i>
					<div class="count" v-if="unReadMessageCount > 0">
						{{ unReadMessageCount }}
					</div>
				</div>

			</template>
			<template #default>
				<div class="bigbox">
					<div class="menu">
						<div class="yidu" @click="setUnRead()">
							未读
						</div>
						<div class="unRead" @click="setRead()">
							已读
						</div>
					</div>
					<div class="messagebox">
						<div class="one" v-for='(dataitem, index) in storeData' :key=dataitem.id>
							<template v-if="dataitem.is_read == showMessageType">
								<div class="message_content">
									有人在<a style="text-decoration: none; color:#fc6203;" :href="dataitem.url"
										@click="dataitem.is_read == false ? markRead(index) : ''">{{
											dataitem.type }}</a>中@了你
								</div>
								<div class="actionsxxx">

									<el-button v-if="dataitem.is_read == false" link type="success" class="action_one"
										@click="markRead(index)">
										标记已读
									</el-button>
									<el-button v-else link type="warning" class="action_one" @click="markunRead(index)">
										标记未读
									</el-button>

									<el-button link type="danger" class="action_one" @click="deleteMessage(index)">
										删除消息
									</el-button>
								</div>
							</template>
						</div>

					</div>
					<div class="operations">
						<div @click="markReadAll()" class="operation1">
							全部已读
						</div>
						<div @click=" deleteAllRead()" class="operation2">
							删除已读
						</div>
					</div>
				</div>
			</template>
		</el-popover>
	</div>
</template>

<script>
import { nextTick } from 'vue'
import axios from 'axios'
import qs from 'qs'
import { authStore } from "../store/index.js"
import { useSocketStore } from '../store/useSocketStore.js'
export default {
	data() {
		return {
			storeData: [],
			showMessageType: false,
			unReadMessageCount: 0,
			isMounted: false,
		}
	},
	async mounted() {
		let res = await axios.get(`http://www.aamofe.top/api/chat/${authStore().userId}`)
		console.log("🚀 ~ file: receiveMessage.vue:173 ~ onMounted ~ res:", res.data[0])
		this.storeData = res.data
		this.storeData.forEach((item) => {
			if (item.is_read == false) {
				this.unReadMessageCount++
			}
		})
		const socketStore = useSocketStore()
		let socket = socketStore.socket
		if ((socket == null || socket.readyState != 1) && (authStore().isLogin)) {
			socket = new WebSocket(`ws://101.43.159.45:8001/notice/${authStore().userId}`)
			socketStore.socket = socket
			socket.onmessage = (event) => {
				console.log(event.data)
				const dataObject = JSON.parse(event.data);
				this.unReadMessageCount++
				const formattedObject = {
					id: dataObject.id,
					type: dataObject.type,
					url: dataObject.url,
					is_read: dataObject.is_read
				};
				this.storeData.push(formattedObject)
				console.log('storeData')
				console.log(this.storeData)
			}
		}
		this.isMounted = true

	},
	methods: {
		setRead() {
			this.showMessageType = true//显示已读
		},
		setUnRead() {
			this.showMessageType = false//显示未读
		},
		async markunRead(index) {
			this.unReadMessageCount++
			this.storeData[index].is_read = false
			let res = await axios.post(`http://www.aamofe.top/api/chat/notice/make_unread/${this.storeData[index].id}`)
			// console.log("🚀 ~ file: receiveMessage.vue:101 ~ markunRead ~ res:", res.data)
		},
		async markRead(index) {
			this.unReadMessageCount--
			this.storeData[index].is_read = true
			let res = await axios.post(`http://www.aamofe.top/api/chat/notice/make_read/${this.storeData[index].id}`)
			// console.log("🚀 ~ file: receiveMessage.vue:106 ~ markRead ~ res:", res.data)
		},
		async deleteMessage(index) {
			let res = await axios.delete(`http://www.aamofe.top/api/chat/notice/delete/${this.storeData[index].id}`)
			if (this.storeData[index].is_read == false) {
				this.unReadMessageCount--
			}
			this.storeData.splice(index, 1)
			// console.log("🚀 ~ file: receiveMessage.vue:110 ~ deleteMessage ~ res:", res)
		},

		async markReadAll() {
			this.unReadMessageCount = 0
			let res = await axios.put(`http://www.aamofe.top/api/chat/notice/all_as_read/${authStore().userId}`)
			this.storeData.forEach((item) => {
				item.is_read = true
			})
			// console.log("🚀 ~ file: receiveMessage.vue:124 ~ markReadAll ~ res:", res)
		},
		async deleteAllRead() {
			let res = await axios.delete(`http://www.aamofe.top/api/chat/notice/delete_all_read/${authStore().userId}`)
			this.storeData = this.storeData.filter((item) => {
				// console.log(item.is_read)
				return item.is_read == false
			})
			// console.log("🚀 ~ file: receiveMessage.vue:131 ~ deleteAllRead ~ res:", res)
		}
	},
	// watch: {
	// 	storeData: {
	// 		handler(newval, oldval) {
	// 			const socketStore = useSocketStore()
	// 			let socket = socketStore.socket
	// 			console.log('socketstate', socket.readyState)
	// 		},
	// 		deep: true
	// 	}
	// }
}


</script>

<style lang="scss">
.icon-xiaoxitongzhi {
	&:hover {
		color: #e36846;
	}
}

.box {
	position: relative;

	.count {
		position: absolute;
		// border: 1px solid red;
		background-color: red;
		height: 16px;
		width: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		top: -5px;
		left: 20px;
		border-radius: 50%;
	}
}

.bigbox {
	overflow: hidden;
	display: flex;
	flex-direction: column;

	.menu {
		cursor: pointer;
		// height: 40px;
		display: flex;
		text-align: center;
		background-color: aliceblue;

		.yidu {
			text-align: center;
			flex: 1;
			box-sizing: border-box;
			height: 25px;
			display: flex;
			align-items: center;
			justify-content: center;

			&:hover {
				background-color: red;
			}

			// border-right: 0.5px solid black;
		}

		.unRead {
			text-align: center;
			flex: 1;
			box-sizing: border-box;
			height: 25px;
			display: flex;
			align-items: center;
			justify-content: center;

			&:hover {
				background-color: red;
			}

			// border-left: 0.5px solid black;
		}


	}


	.messagebox {
		// background-color: red;
		height: 200px;
		overflow: auto;

		.one {
			// border: 1px solid red;
			display: flex;
			justify-content: space-around;
			align-items: center;

			.message_content {
				// justify-content: center;
				padding: 5px;
			}

			.actionsxxx {
				display: flex;
				flex: 1;
				align-items: center;
				cursor: pointer;
				padding: 5px;

				.action_one {
					flex: 1;
				}

			}
		}

	}

	.operations {
		display: flex;
		align-items: center;

		.operation1 {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 30px;
			cursor: pointer;
			background-color: #54c75647;
			flex: 1;
			text-align: center;

			&:hover {
				background-color: #b2e346;
			}
		}

		.operation2 {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 30px;
			cursor: pointer;
			background-color: #54c75647;
			flex: 1;
			text-align: center;

			&:hover {
				background-color: #e925259e;
			}
		}

	}
}
</style>
