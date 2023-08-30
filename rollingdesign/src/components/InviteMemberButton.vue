<script setup>
import {ref} from "vue";
import {ElNotification} from "element-plus";
import axios from "axios";
import {authStore} from "@/store";

const props = defineProps(['nowTeam'])

const nowTeam = props.nowTeam

const link = ref('')
const generateLink = async () => {

  let Headers = { 'Authorization': authStore().token }

  let res = await axios.get('http://www.aamofe.top/api/team/get_invitation/', {
    headers: Headers,
    params: {
      team_id: nowTeam.teamId,
    }
  })
  console.log(res.data)
  link.value = res.data.invatation
}

const copyLink = () => {
  console.log("can u see me")

  navigator.clipboard.writeText(link.value)

  // popper.value.hide()
  // console.log(popper.value)

  ElNotification({
    title: 'Success',
    message: '复制成功',
    type: 'success',
    duration: 1000
  })
}
</script>

<template>
  <el-popover
    :width="300"
    trigger="click"
    ref='popper'
    popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
  >
    <template #reference>
      <el-button type="primary" @click="generateLink()">邀请成员</el-button>
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
</template>

<style scoped lang="scss">

</style>
