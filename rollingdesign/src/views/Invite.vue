<!--
 * @Date: 2023-08-28 00:49:43
 * @Author: Q9K
 * @Description: 团队邀请界面
-->
<template>
    <div class="container">
        <div class="wrapper">
            <div class="center">
                <div class="logo">
                </div>
                <div class="items1">
                    <span>{{ invitor }}</span>
                    在<span>Rolling Design</span>
                    邀请你加入团队
                </div>
                <template v-if="isLogined">
                    <div class="joinButton">
                        加入团队
                    </div>
                </template>
                <template v-else>
                    <div class="joinButton">
                        登录/注册
                    </div>
                </template>

                <div class="link">
                    <div>
                        <a href="www.aamofe.top">
                            Rolling Design
                        </a>
                        <span>天机流转一回头，览镜何须空自羞。雪尽草生春意好，人心不解漫间愁</span>
                    </div>
                    <div>
                        www.aamofe.top
                    </div>
                </div>
            </div>
        </div>
    </div>
    <el-dialog></el-dialog>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted, inject } from 'vue'
import qs from 'qs'
const axios = inject('axios')
const route = useRoute()
const invitor = ref()
onMounted(async () => {
    // let res = axios.get('/api接口', qs.stringify({

    // }))
    // console.log(res.data)
    // invitor.value = res.data
})

</script>
<style scoped lang="scss">
.container {

    height: 100%;

    .wrapper {
        height: 100%;
        background: #f7f9fc;
        display: flex;
        justify-content: center;
        align-items: center;

        .center {

            height: 600px;
            padding: 15px;

            .logo {
                height: 300px;
                background: url(../assets/logo.png);
                background-repeat: no-repeat;
                background-position: center;
                background-size: contain;
                opacity: 0.5;
            }

            .items1 {}

            .joinButton {}

            .link {
                a {
                    text-decoration: none;
                    color: #3671ff;
                }
            }
        }
    }
}
</style>