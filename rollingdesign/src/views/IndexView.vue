<template>
  <!--主页-->
  <div class="common-layout">
    <VOnboardingWrapper ref="wrapper" :steps="steps" />
    <el-container>
      <!--侧边-->
      <el-aside width="15%">
        <!--侧栏-->
        <!-- <GuideAside :steps="$props.steps1"/> -->
        <!-- <GuideAside /> -->
        <!---->
        <div>
          <el-scrollbar>
            <el-col :span="24">
              <el-menu :default-active="guideIndex" width="100%" style="height:100vh"
                class="el-menu-vertical-demo side-guide" @open="handleOpen" @close="handleClose">
                <img alt="web logo" src="@/assets/webLogo.png" style="width:100%;margin-bottom: 10px;">
                <div id="team_info"
                  style="background-color:rgb(232, 247, 254);padding-left: 18px;padding-top: 18px;padding-bottom: 18px;margin-bottom: 20px;">
                  <el-row class="block" style="display: flex;justify-content: space-between;align-items: center;">
                    <div style="display: flex;align-items: center;">
                      <el-avatar shape="square" :size="50" :src="nowTeam.cover_url" style="margin-right:20px" />
                      <span style="font-size:larger;font-weight: 800;">{{ nowTeam.name
                      }}</span>
                    </div>

                    <el-icon class="el-icon--right" style="margin-right:1%" ref="btnSwiTeam"
                      v-click-outside="teamOutside">
                      <ArrowRightBold />
                    </el-icon>
                  </el-row>
                </div>

                <!--切换团队-->
                <el-popover ref="popoverTeam" :virtual-ref="btnSwiTeam" trigger="click" title="" virtual-triggering
                  width="300px" placement="left">
                  <div style="margin-left:10px;">
                    <div style="font-weight:900;font-size: 18px;margin-bottom: 15px;">
                      <span style="margin-left: 6px;">切换团队</span>
                    </div>
                    <div>

                      <!--团队信息-->
                      <div class="block round" v-for="(teamItem, index) in teamList" :key="index"
                        @mouseover="highlightRow(index)" @mouseleave="resetRow(index)"
                        :class="{ 'highlighted-row_aside': highlightedIndex_aside === index }"
                        style="margin-bottom: 10px;padding:4px 0 4px 5px">

                        <div style="display: flex;flex-direction: row;align-items: center;"
                          @click="switchToTeam(teamItem.id)">
                          <el-avatar shape="square" :size="50" :src="teamItem.cover_url" style="" />
                          <!--昵称和介绍-->
                          <el-row
                            style="display: flex;flex-direction: row;justify-items: flex-start;width: 90%;margin-left: 12px;">
                            <el-col :span="24" class="in-center round-choice_aside"
                              style="text-align: left;font-weight: 600;font-size: 17px;margin-bottom: 5px;">{{
                                teamItem.name }}</el-col>
                            <!-- <el-col :span="24" style="text-align: left;color: rgb(80, 79, 79);font-size: 13px;">描述</el-col> -->
                          </el-row>
                        </div>
                        <!-- <el-divider /> -->
                        <!-- <div v-if="index < teamList.length - 2" class="my-divider"></div> -->
                      </div>

                      <!--团队信息结束-->
                    </div>
                  </div>
                </el-popover>

                <div id="guide">
                  <el-menu-item index="index" @click="jumpTo('index')">
                    <template #title>
                      <el-icon>
                        <HomeFilled />
                      </el-icon>
                      <span> 主页 </span>
                    </template>
                  </el-menu-item>

                  <el-menu-item index="teamPeople" @click="jumpTo('teamPeople')">
                    <template #title>
                      <el-icon>
                        <Avatar />
                      </el-icon>
                      <span> 团队成员 </span>
                    </template>
                  </el-menu-item>

                  <el-sub-menu index="project">
                    <template #title>
                      <el-icon>
                        <Grid />
                      </el-icon>
                      <span>项目</span>
                    </template>

                    <el-menu-item v-for="(projectItem, index) in projectList" :key="index"
                      @click="jumpToProject(projectItem.id)">{{ projectItem.name
                      }}</el-menu-item>
                    <!-- <el-menu-item index="1-2">项目2</el-menu-item> -->
                  </el-sub-menu>

                  <el-menu-item index="recover" @click="jumpTo('recover')">
                    <el-icon>
                      <DeleteFilled />
                    </el-icon>
                    <span>回收站</span>
                  </el-menu-item>

                  <el-menu-item index="chat" @click="jumpTo('chat')">
                    <el-icon>
                      <Comment />
                    </el-icon>
                    <span>聊天中心</span>
                  </el-menu-item>

                  <el-menu-item index="settings" @click="jumpTo('settings')">
                    <el-icon>
                      <Tools />
                    </el-icon>
                    <span> 团队设置 </span>
                  </el-menu-item>

                  <!--新建团队-->
                  <el-menu-item @click="addTeamVisible = true">
                    <el-icon>
                      <Plus />
                    </el-icon>
                    <span>新建团队</span>
                  </el-menu-item>
                </div>

                <!--新建团队的对话框-->
                <el-dialog v-model="addTeamVisible" title="" width="35%" center>
                  <el-row class="tac">
                    <!--文本部分-->
                    <el-col class="textAddTeam" :span="12" style="display: flex;flex-direction: column;">
                      <div style="font-size:25px;font-weight:600;margin-bottom: 5px;">创建新团队</div>
                      <div>你可以和成员在团队中一起协作</div>

                      <!--团队名称-->
                      <div style="font-size:larger;font-weight:500;margin-top: 20px;margin-bottom: 5px;">
                        团队名称</div>
                      <div> <el-input style="width:90%" v-model="addTeamNameInput" placeholder="请输入团队名称" />
                      </div>

                      <!--团队描述-->
                      <div style="font-size:larger;font-weight:500;margin-top: 20px;margin-bottom: 5px;">
                        团队描述</div>
                      <div> <el-input style="width:90%" v-model="addTeamInfoInput" placeholder="请输入团队描述" />
                      </div>


                      <div style="margin-left:8%;margin-top: 30%;margin-bottom: 10px;">
                        <el-button style="width:84%;" type="primary" @click="buildNewTeam()">
                          确认创建
                        </el-button>
                      </div>

                      <!--logo-->
                      <img alt="web logo" src="@/assets/webLogo.png" style="width:90%;margin-top: 10px;">

                    </el-col>
                    <!--图片部分-->
                    <el-col :span="12">
                      <div class="imageAddTeam">
                        <img src="@/assets/addTeamImage.png" alt="Image" style="width:100%" />
                      </div>
                    </el-col>
                  </el-row>
                </el-dialog>
              </el-menu>
            </el-col>
          </el-scrollbar>
        </div>
        <!---->
      </el-aside>

      <el-container>
        <!--顶部-->
        <el-header style="padding-top:13px">
          <!-- <Header :steps="$props.steps2" /> -->
          <!-- <Header /> -->
          <div>
            <el-row style="display: flex;justify-content: flex-end;align-items: center;">
              <div>
                <span id="beginner-guidance" @click="start">新手引导</span>
              </div>
              <!-- <div id="chat" style="margin-left: 50px;" @click="this.$router.push('/chat')">聊天</div> -->
              <span id="message" style="margin-left: 3%;">
                <receiveMessage></receiveMessage>
              </span>

              <div id="user_info" style="margin-left:3%">
                <el-avatar :size="50" :src="user.userAvatar" ref="buttonRef" v-click-outside="onClickOutside" />
              </div>

              <!--点击头像，出现悬浮板-->
              <el-popover ref="popoverRef" :virtual-ref="buttonRef" trigger="click" title="" virtual-triggering
                width="240px" class="popover-customer"> <!--怎么设置颜色？？-->
                <div style="padding-left:15px;padding-right:15px">
                  <div style="display: flex;align-items: center;padding-top:10px;" @click="personMsgDialog = true;">
                    <!--完善关闭悬浮-->
                    <span class="canClick"><el-avatar :size="50" :src="user.userAvatar" @click="personMsgDialog = true"
                        style="margin-right:5px" /></span>
                    <span style="font-weight:900;font-size:16px;">{{
                      user.nickName }}</span>
                  </div>
                  <div class="my-divider_header"></div>

                  <div style="display: flex;align-items: center;height: 35px;" @click="personMsgDialog = true">
                    <el-icon style="margin-right:5px">
                      <Tools />
                    </el-icon> 账户设置
                  </div>

                  <div style="display: flex;align-items: center;height: 35px;" @click="logout()">
                    <el-icon style="margin-right:5px">
                      <SwitchButton />
                    </el-icon> 退出登录
                  </div>
                </div>
              </el-popover>

              <el-dialog v-model="personMsgDialog" title="账号信息" width="23%" class="rounded-dialog">
                <div style="width:84%;padding-left:8%">
                  <!--展示昵称和头像-->
                  <div class="borderBlock" style="margin-bottom:35px;padding-left: 10px;">
                    <el-row style="display: flex;align-items: center;justify-content: space-between;">
                      <div class="leftContent" style="display: flex;justify-content:flex-start">
                        <el-avatar :size="50" :src="user.userAvatar" style="margin-right:10px" />
                        <div>
                          <div class="hintText" style="text-align: left;">昵称</div>
                          <div style="text-align: left;">{{ user.nickName }}</div>
                        </div>
                      </div>
                    </el-row>
                  </div>

                  <!--昵称-->
                  <el-row style="display: flex;align-items: center;justify-content: space-between;">
                    <div class="leftContent" style="display: flex;justify-content:flex-start">
                      <div>
                        <div class="hintText" style="text-align: left;margin-bottom: 5px;">昵称</div>
                        <div style="text-align: left;">{{ user.nickName }}</div>
                      </div>
                    </div>
                    <el-button link type="primary" size="small" style="justify-content: flex-end;"
                      @click="nickNameConfig = true">修改昵称</el-button>
                  </el-row>
                  <el-divider />

                  <!--昵称修改对话框-->
                  <el-dialog v-model="nickNameConfig" title="修改昵称" width="20%">
                    <el-row
                      style="display: flex;flex-direction: row;justify-items: flex-start;width: 90%;padding-left: 20px;">
                      <el-col class="hintText" :span="24" style="text-align: left;margin-bottom: 10px;">请输入昵称</el-col>
                      <el-col :span="24">
                        <el-input v-model="nickNameConfigInput"
                          @keyup.enter="nickNameConfig = false; nickNameConfigMethod()" placeholder="请输入昵称" />
                      </el-col>
                    </el-row>

                    <template #footer>
                      <span class="dialog-footer">
                        <el-button @click="nickNameConfig = false">取消</el-button>
                        <el-button type="primary" @click="nickNameConfig = false; nickNameConfigMethod()"><!--发送修改-->
                          确认
                        </el-button>
                      </span>
                    </template>
                  </el-dialog>

                  <!--头像-->
                  <el-row style="display: flex;align-items: center;justify-content: space-between;">
                    <div class="leftContent" style="display: flex;justify-content:flex-start">
                      <el-avatar :size="50" :src="user.userAvatar" style="margin-right:10px" />
                    </div>
                    <el-upload v-model:file-list="fileList" class="upload-demo"
                      action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" multiple
                      :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" :limit="3"
                      :on-exceed="handleExceed">
                      <el-button link type="primary" size="small" style="justify-content: flex-end;">更换头像</el-button>
                    </el-upload>
                  </el-row>
                  <el-divider />

                  <!--点击头像上传-->
                  <el-dialog v-model="avatarConfig" title="更换头像" width="20%">
                    <el-row
                      style="display: flex;flex-direction: row;justify-items: flex-start;width: 90%;padding-left: 20px;">
                      <el-col class="hintText" :span="24" style="text-align: left;margin-bottom: 10px;">请输入昵称</el-col>
                      <el-col :span="24">
                        <el-input v-model="nickNameConfigInput" placeholder="请输入昵称" />
                      </el-col>
                    </el-row>

                    <template #footer>
                      <span class="dialog-footer">
                        <el-button @click="nickNameConfig = false">取消</el-button>
                        <el-button type="primary" @click="nickNameConfig = false"><!--发送修改-->
                          确认
                        </el-button>
                      </span>
                    </template>
                  </el-dialog>

                  <!--真实姓名-->
                  <div class="leftContent"
                    style="text-align: left;margin-top: 20px;display: flex;flex-direction: column;justify-content:flex-start">
                    <div class="hintText" style="margin-bottom: 6px;">真实姓名 </div>
                    <div style=""> {{ user.name }}</div>
                  </div>
                  <el-divider />

                  <!--邮箱-->
                  <div class="leftContent"
                    style="text-align: left;display: flex;flex-direction: column;justify-content:flex-start">
                    <div class="hintText" style="margin-bottom: 6px;">已绑定邮箱 </div>
                    <div style="">{{ user.email }}</div>
                  </div>
                  <el-divider />

                  <!--登录密码-->
                  <el-row style="display: flex;margin-bottom: 40px;align-items: center;justify-content:space-between">
                    <div class="leftContent" style="display: flex;justify-content:flex-start">
                      <div>
                        <div class="hintText" style="text-align: left;margin-bottom: 6px;">登录密码</div>
                        <div style="text-align: left;font-size:small">已设置密码</div>
                      </div>
                    </div>
                    <div style="justify-self: end;">
                      <el-button link type="primary" size="small" @click="pwdConfig = true">修改密码</el-button>
                    </div>
                  </el-row>
                </div>

                <!--修改密码对话框-->
                <el-dialog v-model="pwdConfig" :title="pwdConfigTitle" width="20%" style="flex-direction: column;">
                  <el-row
                    style="display: flex;flex-direction: row;justify-items: flex-start;width: 90%;padding-left: 20px;">
                    <el-col class="hintText" :span="24" style="text-align: left;margin-bottom: 10px;">请输入密码</el-col>
                    <el-col :span="24">
                      <el-input v-model="pwdConfigInput" type="password" placeholder="设置密码8位以上，包含字母和数字" show-password />
                    </el-col>
                  </el-row>
                  <el-row style="margin-top:25px;width: 90%;padding-left: 20px;">
                    <el-col class="hintText" :span="24" style="text-align: left;margin-bottom: 10px;">请在此确认密码</el-col>
                    <el-col :span="24">
                      <el-input v-model="pwdSureInput" type="password" placeholder="请再次确认密码" show-password />
                    </el-col>
                  </el-row>

                  <template #footer>
                    <span class="dialog-footer">
                      <el-button @click="pwdConfig = false">取消</el-button>
                      <!--点击确认，修改密码-->
                      <el-button type="primary" @click="pwdConfig = false; pwdConfigMethod()">
                        确认
                      </el-button>
                    </span>
                  </template>
                </el-dialog>

              </el-dialog>
            </el-row>
          </div>
        </el-header>
        <el-divider />

        <!--主页面，不同的地方-->
        <el-main>
          <div class="page" style="width:98%;margin-left: 1%;">

            <el-dialog class="beginner" v-model="beginner_guide_show" title="" width="50%" center>
              <div style="width:96%;margin-left: 2%;">
                <div style="font-size: 21px;font-weight: 900;margin-bottom: 10px;">欢迎来到流转设计~</div>
                <div style="font-size: 18px;font-weight: 600;margin-bottom: 7px;">新手引导将带您初步了解这个网站</div>
                <div style="font-size:18px;font-weight: 600;">您可以根据需要选择是否进行新手引导（新手引导可随时点击主页上方导航栏查看）</div>
                <el-row>
                  <el-col :span="12">
                    <img src="@/assets/img1.svg" style="width: 100%;height:500px" />
                    <el-button style="width: 80%;margin-left: 10%;" plain
                      @click="beginner_guide_show = false;">我不需要新手引导</el-button>
                  </el-col>
                  <el-col :span="12">
                    <img src="@/assets/img2.svg" style="width: 96%;height:500px" />
                    <el-button style="width: 80%;margin-left: 10%;" color="#626aef"
                      @click="beginner_guide_show = false; start()">
                      开始
                    </el-button>
                  </el-col>
                </el-row>
              </div>
            </el-dialog>

            <!--团队信息-->
            <el-row class="block" style="display: flex;align-items: center;">
              <el-col :span="16">
                <el-row style="display: flex;align-items: center;" id="foo">
                  <!-- <el-avatar shape="square" :size="50" :src="squareUrl" style="margin-right:20px" /> -->
                  <span style="font-size:23px;font-weight: 900;">主页</span>
                </el-row>
              </el-col>

              <!--功能按钮-->
              <el-col :span="8" id="btn">
                <div style="display: flex;flex:1;justify-content: flex-end;">
                  <el-button id="newProject" type="primary" @click="newProjectDialog = true">新建项目</el-button>
                  <!--如果是管理员有“邀请”这一项，判断登陆者在该团队中的身份-->
                  <!--邀请成员的框-->
                  <el-popover placement="bottom" :width="300" trigger="click">
                    <template #reference>
                      <el-button
                        v-if="(nowTeam.role_string === 'CR' || nowTeam.role_string === 'MG') && nowTeam.name != '个人空间'"
                        type="primary">邀请成员</el-button>
                    </template>
                    <div class="link-block" style="margin-bottom: 12px;">
                      <div>{{ inviteLink }}</div>
                    </div>
                    <div><el-button type="primary" @click="copyLink()">点击复制链接</el-button></div>
                  </el-popover>
                </div>
              </el-col>
            </el-row>

            <!--创建新项目的对话框-->
            <el-dialog v-model="newProjectDialog" title="创建新项目" width="26%" center>
              <span>
                <el-input v-model="newProjectNameInput" placeholder="请输入项目名称" />
              </span>
              <template #footer>
                <span class="dialog-footer">
                  <el-button type="primary" @click="createNewProject()">
                    确认创建
                  </el-button>
                </span>
              </template>
            </el-dialog>
            <!--团队信息结束-->

            <!--项目部分-->
            <div style="margin-top:20px">
              <el-row style="margin-top:40px;margin-bottom: 30px;display: flex;align-items: center;">
                <el-col :span="13">
                  <span style="font-size:large;font-weight: 500;" @click="projectShow = false">
                    项目（{{ projectNum }}）
                  </span>
                </el-col>

                <!--搜索查找-->
                <el-col :span="5" id="search">
                  <!-- <input type="text" v-model="searchKeyword" placeholder="Search" :suffix-icon="Search" style="width:90%;height:30px"/> -->
                  <!-- <el-input v-model="input1" class="w-50 m-2" size="large" placeholder="Please Input"
                    :suffix-icon="Search" /> -->
                  <el-input v-model="searchKeyword" class="w-50 m-2" placeholder="请输入项目名称" :prefix-icon="Search" />
                </el-col>
                <el-col :span="2"></el-col>

                <!--排序下拉列表-->
                <el-col :span="4" id="sort">
                  <el-dropdown trigger="click">
                    <span class="el-dropdown-link" style="display: flex;justify-content: center;">
                      <el-icon>
                        <Sort />
                      </el-icon>&nbsp;{{ nowSortType }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                    </span>
                    <template #dropdown>
                      <el-dropdown-menu>

                        <el-dropdown-item @click="sortSwitch('创建时间', nowSortWay)">
                          <span style="width: 20px;display: flex;align-items: center;"><el-icon
                              v-if="nowSortType === '创建时间'"><Select /></el-icon></span>

                          创建时间</el-dropdown-item>

                        <el-dropdown-item @click="sortSwitch('名称', nowSortWay)">
                          <span style="width: 20px;display: flex;align-items: center;"><el-icon
                              v-if="nowSortType === '名称'"><Select /></el-icon></span>
                          名称

                        </el-dropdown-item>

                        <div class="my-divider"></div>

                        <el-dropdown-item @click="sortSwitch(nowSortType, '升序')">
                          <span style="width: 20px;display: flex;align-items: center;">
                            <el-icon v-if="nowSortWay === '升序'"><Select /></el-icon></span>
                          升序</el-dropdown-item>

                        <el-dropdown-item @click="sortSwitch(nowSortType, '降序')">
                          <span style="width: 20px;display: flex;align-items: center;">
                            <el-icon v-if="nowSortWay === '降序'"><Select /></el-icon></span>
                          降序</el-dropdown-item>

                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </el-col>
              </el-row>

              <!--项目封面图-->
              <!--如果有项目-->
              <div id="project_area">
                <el-row v-if="projectNum">
                  <div class="designBlock" v-for="(projectItem, index) in filteredProjects" :key="index">
                    <div :id="'project' + index" @mouseover="highlightBlock(index)" @mouseleave="resetBlock(index)"
                      :class="{ 'highlighted-row': highlightedIndex === index }"
                      style="padding-bottom: 10px;padding-top: 4px;">
                      <div style="width:100%">
                        <img @click="jumpToProject(projectItem.id)" class="round designImg" :src="projectItem.cover_url"
                          style="width:96%;height:160px" />


                        <el-row style="width:90%;text-align: left;">
                          <el-col :span="23">
                            <span v-if="renameProjectBlock[index]" class="designName" style="padding-left:2%;">
                              <el-input v-model="renameProjectInput" placeholder="请输入项目名称"
                                @keyup.enter="renameProject(index, projectItem.id); renameProjectBlock[index] = false" />
                            </span>
                            <span v-else class="designName" style="padding-left:5%">
                              {{ projectItem.name }}
                            </span>
                          </el-col>
                          <el-col :span="1">
                            <span class="rightContent" style="text-align: right;">

                              <el-dropdown trigger="click" placement="bottom-start">
                                <el-icon class="el-icon--right" style="">
                                  <More />
                                </el-icon>
                                <template #dropdown>
                                  <el-dropdown-item :icon="FolderOpened"
                                    @click="jumpToProject(projectItem.id)">打开项目</el-dropdown-item>
                                  <!-- <el-dropdown-item :icon="EditPen" @click="renameProjectDialog = true">重命名</el-dropdown-item> -->
                                  <el-dropdown-item :icon="EditPen"
                                    @click="renameProjectBlock[index] = true">重命名</el-dropdown-item>

                                  <el-dropdown-item :icon="CopyDocument"
                                    @click="copyProject(index, projectItem.id)">复制项目</el-dropdown-item>
                                  <el-dropdown-item :icon="FolderDelete"
                                    @click="deleteProject(index, projectItem.id)">删除</el-dropdown-item>

                                </template>
                              </el-dropdown>


                            </span>
                          </el-col>
                        </el-row>
                      </div>

                    </div>
                  </div>
                </el-row>
                <!--如果没有项目-->
                <el-row v-else>
                  <!-- <img class="round" src="@/assets/noFile.png" style="width: 100%;" /> -->
                  <el-empty id="no_project" description="该团队暂无项目，快来新建吧" style="width: 100%;">
                    <el-button type="primary" plain @click="newProjectDialog = true">新建项目</el-button>
                  </el-empty>
                </el-row>
              </div>
            </div>

            <!--********结束-->
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
//自己的页面IndexView
import qs from 'qs'
import axios from 'axios'
import { ref, unref } from 'vue'
import { useRoute } from 'vue-router';
import { onMounted, computed } from 'vue'
import { authStore } from "../store/index.js"
import { UserFilled } from '@element-plus/icons-vue'
import { reactive, toRefs } from 'vue'
import { ClickOutside as vClickOutside } from 'element-plus'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import GuideAside from '@/components/GuideAside.vue'
import Header from '@/components/Header.vue'
import receiveMessage from '@/components/receiveMessage.vue'
import { UploadProps, UploadUserFile } from 'element-plus'
import Clipboard from 'clipboard';
import {
  Menu as IconMenu,
  ArrowDown,
  Avatar,
  ArrowRight,
  Sort,
  Plus,
  CopyDocument,
  EditPen,
  Comment,
  FolderDelete,
  FolderOpened,
  HomeFilled,
  Search,
  DeleteFilled,
  Grid,
  Tools,
  SwitchButton,
  ArrowRightBold,
} from '@element-plus/icons-vue'
const route = useRoute()
import { defineComponent } from 'vue'
import { VOnboardingWrapper, useVOnboarding, appendSteps } from 'v-onboarding'
import 'v-onboarding/dist/style.css'

//引导
const wrapper = ref(null)
const { start, goToStep, finish } = useVOnboarding(wrapper)

const steps = [
  {
    attachTo: { element: '#team_info' },
    content: {
      title: "团队信息",
      description: "点击查看团队具体信息，点击右侧图标可以切换团队；初次注册登录默认创建进入个人空间"
    },
    popper: {
      modifiers: {
        offset: {
          offset: '0, 10' // 在垂直方向上向下偏移 10 个像素
        },
        // preventOverflow: {
        //   enabled: true, // 避免弹出框超出视窗边界
        //   padding: 10 // 边界的内边距
        // },
        // flip: {
        //   enabled: true // 自动翻转位置以适应视窗
        // }
      },
    },
    options: {
      labels: {
        previousButton: '上一步',   // 将 'Previous' 修改为 '上一步'
        nextButton: '下一步',       // 将 'Next' 修改为 '下一步'
        finishButton: '结束'        // 将 'Finish' 修改为 '结束'
      }
    }
  },
  {
    attachTo: { element: '#guide' },
    content: {
      title: "导航栏",
      description: "根据需求点击导航项，进入对应页面"
    },
    options: {
      labels: {
        previousButton: '上一步',   // 将 'Previous' 修改为 '上一步'
        nextButton: '下一步',       // 将 'Next' 修改为 '下一步'
        finishButton: '结束'        // 将 'Finish' 修改为 '结束'
      }
    }
  },
  {
    attachTo: { element: '#user_info' },
    content: {
      title: "个人信息",
      description: "点击这里可查看账户信息，可以退出登录"
    },
    options: {
      labels: {
        previousButton: '上一步',   // 将 'Previous' 修改为 '上一步'
        nextButton: '下一步',       // 将 'Next' 修改为 '下一步'
        finishButton: '结束'        // 将 'Finish' 修改为 '结束'
      }
    }
  },
  {
    attachTo: { element: '#message' },
    content: {
      title: "消息通知",
      description: "点击查看消息通知，可一键已读所有未读消息"
    },
    options: {
      labels: {
        previousButton: '上一步',   // 将 'Previous' 修改为 '上一步'
        nextButton: '下一步',       // 将 'Next' 修改为 '下一步'
        finishButton: '结束'        // 将 'Finish' 修改为 '结束'
      }
    }
  },
  // {
  //   attachTo: { element: '#chat' },
  //   content: {
  //     title: "聊天页面",
  //     description: "点击进入聊天页面进行聊天，除个人空间外的每个空间都有一个默认的群聊，您可以根据需要进行私聊或创建新的群聊"
  //   },
  //   options: {
  //     labels: {
  //       previousButton: '上一步',   // 将 'Previous' 修改为 '上一步'
  //       nextButton: '下一步',       // 将 'Next' 修改为 '下一步'
  //       finishButton: '结束'        // 将 'Finish' 修改为 '结束'
  //     }
  //   }
  // },
  {
    attachTo: { element: '#beginner-guidance' },
    content: {
      title: "新手引导",
      description: "您可以点击此处，查看新手引导"
    },
    options: {
      labels: {
        previousButton: '上一步',   // 将 'Previous' 修改为 '上一步'
        nextButton: '下一步',       // 将 'Next' 修改为 '下一步'
        finishButton: '结束'        // 将 'Finish' 修改为 '结束'
      }
    }
  },
  {
    attachTo: { element: '#btn' },
    content: {
      title: "功能区",
      description: "您可以在此处创建新项目开始工作；当有管理权限且当前团队非个人空间时也可以邀请成员加入当前团队"
    },
    options: {
      labels: {
        previousButton: '上一步',   // 将 'Previous' 修改为 '上一步'
        nextButton: '下一步',       // 将 'Next' 修改为 '下一步'
        finishButton: '结束'        // 将 'Finish' 修改为 '结束'
      }
    }
  },
  {
    attachTo: { element: '#search' },
    content: {
      title: "搜索",
      description: "您可以输入关键字搜索，快速找到您需要的文件"
    },
    options: {
      labels: {
        previousButton: '上一步',   // 将 'Previous' 修改为 '上一步'
        nextButton: '下一步',       // 将 'Next' 修改为 '下一步'
        finishButton: '结束'        // 将 'Finish' 修改为 '结束'
      }
    }
  },
  {
    attachTo: { element: '#sort' },
    content: {
      title: "排序",
      description: "您可以设定文件的排序方式，默认排序方式为按创建时间的升序"
    },
    options: {
      labels: {
        previousButton: '上一步',   // 将 'Previous' 修改为 '上一步'
        nextButton: '下一步',       // 将 'Next' 修改为 '下一步'
        finishButton: '结束'        // 将 'Finish' 修改为 '结束'
      }
    }
  },
  {
    // attachTo: { element: projectList.value[0]?'#project0':null},
    attachTo: { element: '#project_area' },
    content: {
      title: "项目",
      description: "点击进入项目，可创建原型或文档"
    },
    options: {
      labels: {
        previousButton: '上一步',   // 将 'Previous' 修改为 '上一步'
        nextButton: '下一步',       // 将 'Next' 修改为 '下一步'
        finishButton: '结束'        // 将 'Finish' 修改为 '结束'
      }
    }
  }
]
const beginner_guide_show = ref(false);//根据登录的返回值（是否是第一次登录）
//变量
const activeTab = ref('tab1'); // 设置默认激活的标签页
const sortChoice = ref(['名称', '创建时间', '升序', '降序']);
const nowChoice = ref('')
const highlightedIndex = ref(-1);
const searchKeyword = ref('');
const nowSortType = ref('创建时间');//现在的排序方式，默认按创建时间的升序排了
const nowSortWay = ref('升序');//现在的排序方式，默认按创建时间的升序排了


const newProjectDialog = ref(false)
const newProjectNameInput = ref('');
const renameProjectDialog = ref(false);
const renameProjectInput = ref('');
/*邀请成员*/
const inviteLink = ref('');


/*侧栏导航栏*/
const handleOpen = (key, keyPath) => {
  // console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  // console.log(key, keyPath)
}


/*跳转对应页*/
const jumpTo = (path) => {
  const path_url = '/' + path;
  window.open(path_url, '_self');
}

const jumpToProject = (id) => {
  //this.$router.push('/video/'+id);
  const path_url = '/project/' + id;
  window.open(path_url, '_self');
}

/*main*/
let nowTeam = reactive({
  teamId: '',
  name: '',
  desription: '',
  cover_url: '',
  createTime: '',
  creator: '',
  memberNum: '',
  projectNum: '',
  role_string: '',
})

const projectNum = ref('');
const projectList = ref([]);
const renameProjectBlock = ref([]);

onMounted(() => {
  fetchUserData();
  fetchNowTeam();
  fetchTeamlistData();
  fetchProjectData();
  highLight();
  if (authStore().is_new) {
    beginner_guide_show.value = true;
    authStore().is_new = false;
  }
  // console.log(wrapper.labels.previousButton);

  // const {myConst}=GuideAside.setup();
  // console.log(myConst);
})

//获取当前团队
const fetchNowTeam = () => {
  let Headers = { 'Authorization': authStore().token };
  axios.get('http://www.aamofe.top/api/team/get_current_team/', { params: { user_id: authStore().userId }, headers: Headers })
    .then((response) => {
      // console.log(response);

      if (response.data.errno == 0) {  //获取成功“我”的身份信息
        nowTeam.teamId = response.data.team.id;
        nowTeam.name = response.data.team.name;
        nowTeam.desription = response.data.team.description;
        nowTeam.cover_url = response.data.team.cover_url;
        nowTeam.createTime = response.data.team.created_at;
        nowTeam.creator = response.data.team.creator;
        nowTeam.role_string = response.data.team.role_string;
        if ((nowTeam.role_string === 'CR' || nowTeam.role_string === 'MG') && nowTeam.name != "个人空间") {
          getInviteLink();
        }
        localStorage.setItem('teamId', response.data.team.id);
        localStorage.setItem('teamName', response.data.team.name);

        if (response.data.team.role_string === "CR" || response.data.team.role_string === "MR") { localStorage.setItem('isAdmin', true); }
        else { localStorage.setItem('isAdmin', false); }
        return;
      }
      else {
        ElMessage.warning(response.data.msg);
      }
    }).catch(error => {
      console.log(error);
    })
}

const teamList = ref([]);
const fetchTeamlistData = () => {
  let Headers = { 'Authorization': authStore().token };
  teamList.value = [];

  axios.get('http://www.aamofe.top/api/team/all_teams/', { headers: Headers })
    .then((response) => {
      console.log(response);
      if (response.data.errno == 0) {  //所有团队信息
        response.data.teams.forEach((team, index) => {
          teamList.value.push(team);/*【这样写】*/
          return;
        })
        teamList.value.pop();
        // console.log(teamList.value);
      }
      else {
        ElMessage.warning(response.data.msg);
      }
    }).catch(error => {
      console.log(error);
    })
}

const fetchProjectData = () => {
  let Headers = { 'Authorization': authStore().token };
  projectList.value = [];
  axios.get('http://www.aamofe.top/api/team/all_projects/', { params: { sort_by: 'created_at' }, headers: Headers })
    .then((response) => {
      console.log(response);

      if (response.data.errno == 0) {  //所有团队信息
        response.data.projects.forEach((project, index) => {
          projectList.value.push(project);/*【这样写】*/
          // filteredProjects.value.push(project);
          renameProjectBlock.value.push(false);

        })
        // console.log(projectList.value);
        // filteredProjects.value=projectList.value;

        projectNum.value = response.data.projects.length;
        // console.log(filteredProjects.value);
        // console.log(projectList.value);

        // console.log(response.data.projects.length)
        // console.log(projectNum);
        return;
      }
      else {
        ElMessage.warning(response.data.msg);
      }
    }).catch(error => {
      console.log(error);
    })
}

//创建新项目
const createNewProject = () => {
  if (!(newProjectNameInput.value)) {
    console.log('不能为空');
    ElMessage.warning('请输入名称');
    return;
  }

  axios.post('http://www.aamofe.top/api/team/create_project/' + nowTeam.teamId + '/', qs.stringify({
    project_name: newProjectNameInput.value
  }), {
    headers: {
      Authorization: authStore().token
    }
  })
    .then(res => {
      // 处理响应数据
      console.log(res);

      if (res.data.errno == 0)//成功
      {
        ElMessage.success(res.data.msg);
        newProjectDialog.value = false;
        projectList.value.push({ "id": res.data.project.id, "name": res.data.project.name, "cover_url": res.data.project.cover_url, "folder_id": res.data.project.folder_id })
        projectNum.value++;
        newProjectNameInput.value = '';
        // window.location.reload();
        return;
      }
      else {//失败
        ElMessage.error(res.data.msg);
        return;
      }
    })
    .catch(error => {
      // 处理请求错误
      console.error(error);
    });
}
//根据关键字进行搜索
const filteredProjects = computed(() => {
  const searchTerm = searchKeyword.value.toLowerCase(); // 转换为小写以进行不区分大小写的匹配
  return projectList.value.filter((project) =>
    project.name.toLowerCase().includes(searchTerm)
  );
});

//排序
const sortSwitch = (type, way) => {
  let Headers = { 'Authorization': authStore().token };
  const finalSort = ref('');
  if (type === '创建时间' && way === '降序') {
    finalSort.value = '-created_at';
    nowSortType.value = '创建时间';
    nowSortWay.value = '降序';
  }
  else if (type === '创建时间' && way === '升序') {
    finalSort.value = 'created_at';
    nowSortType.value = '创建时间';
    nowSortWay.value = '升序';
  }
  else if (type === '名称' && way === '降序') {
    finalSort.value = '-name';
    nowSortType.value = '名称';
    nowSortWay.value = '降序';
  }
  else if (type === '名称' && way === '升序') {
    finalSort.value = 'name';
    nowSortType.value = '名称';
    nowSortWay.value = '升序';
  }
  //清空
  projectList.value = [];
  projectNum.value = 0;
  renameProjectBlock.value = [];
  console.log(finalSort.value);

  axios.get('http://www.aamofe.top/api/team/all_projects/', { params: { sort_by: finalSort.value }, headers: Headers })
    .then((response) => {
      console.log(response);

      if (response.data.errno == 0) {  //所有团队信息
        response.data.projects.forEach((project, index) => {
          projectList.value.push(project);/*【这样写】*/
          // filteredProjects.value.push(project);
          renameProjectBlock.value.push(false);

        })
        // console.log(projectList.value);
        // filteredProjects.value=projectList.value;

        projectNum.value = response.data.projects.length;
        // console.log(filteredProjects.value);
        console.log(projectList.value);

        // console.log(response.data.projects.length)
        // console.log(projectNum);
        return;
      }
      else {
        ElMessage.warning(response.data.msg);
      }
    }).catch(error => {
      console.log(error);
    })
}


const renameProject = (index, projectId) => {
  if (!(renameProjectInput.value)) {
    console.log('不能为空');
    ElMessage.warning('请输入名称');
    return;
  }
  axios.post('http://www.aamofe.top/api/team/rename_project/', qs.stringify({
    name: renameProjectInput.value, project_id: projectId
  }), {
    headers: {
      Authorization: authStore().token
    }
  })
    .then(res => {
      // 处理响应数据
      console.log(res);

      if (res.data.errno == 0)//成功
      {
        ElMessage.success(res.data.msg);
        renameProjectDialog.value = false;
        renameProjectBlock.value[index] = false;
        // projectList.value[index].name=renameProjectInput.value;
        // projectList.value[index].cover_url=res.data.project.cover_url;


        // projectList.value[index] = '';
        projectList.value[index] = { "folder_id": projectList.value[index].folder_id, "name": renameProjectInput.value, "id": projectId, "cover_url": res.data.project.cover_url };
        window.location.reload();//重载页面

        // console.log(projectList.value);
        renameProjectInput.value = '';
        return;
      }
      else {//失败
        ElMessage.error(res.data.msg);
        return;
      }
    })
    .catch(error => {
      // 处理请求错误
      console.error(error);
    });
}

const deleteProject = (index, projectId) => {
  console.log(projectId);
  axios.post('http://www.aamofe.top/api/team/delete_one_project/', qs.stringify({ project_id: projectId }), {
    headers: { Authorization: authStore().token }
  })
    .then(res => {
      // 处理响应数据
      // console.log(res);
      // console.log(projectId);

      if (res.data.errno == 0)//成功
      {
        ElMessage.success(res.data.msg);
        //把项目从projectList里删除
        // console.log(index);
        let i = 0;
        for (i = 0; i < projectList.value.length - 1; i++) {
          if (i >= index) {
            // console.log(i);
            projectList.value[i] = projectList.value[i + 1];
          }
        }
        projectList.value.pop();
        // console.log(projectList.value);
        projectNum.value--;
      }
      else {//失败
        console.log(projectId);
        ElMessage.error(res.data.msg);
        return;
      }
    })
    .catch(error => {
      // 处理请求错误
      console.error(error);
    });
}

const copyProject = (index, projectId) => {
  axios.post('http://www.aamofe.top/api/team/copy/', qs.stringify({ project_id: projectId }), {
    headers: { Authorization: authStore().token }
  })
    .then(res => {
      // 处理响应数据
      // console.log(res);
      // console.log(projectId);

      if (res.data.errno == 0)//成功
      {
        ElMessage.success(res.data.msg);

        projectList.value.push({ "id": res.data.project.id, "name": res.data.project.name, "cover_url": res.data.project.cover_url, "folder_id": res.data.project.folder_id });
        console.log(projectList.value);
        projectNum.value++;
      }
      else {//失败
        console.log(projectId);
        ElMessage.error(res.data.msg);
        return;
      }
    })
    .catch(error => {
      // 处理请求错误
      console.error(error);
    });
}
//邀请别人加入团队
const getInviteLink = () => {
  let Headers = { 'Authorization': authStore().token };
  axios.get('http://www.aamofe.top/api/team/get_invitation/', { params: { team_id: nowTeam.teamId }, headers: Headers })
    .then((response) => {
      console.log(response);

      if (response.data.errno == 0) {  //获取成功“我”的身份信息
        inviteLink.value = response.data.token;
        return;
      }
      else {
        ElMessage.warning(response.data.msg);
      }
    }).catch(error => {
      console.log(error);
    })
}

const copyLink = () => {
  console.log("can u see me")

  navigator.clipboard.writeText(inviteLink.value)

  // popper.value.hide()
  // console.log(popper.value)

  ElNotification({
    title: 'Success',
    message: '复制成功',
    type: 'success',
    duration: 1000
  })

  // // 创建 Clipboard 实例，指定要复制的文本
  // const clipboard = new Clipboard('.copy-button', {
  //   text: () => inviteLink.value,
  // });
  //
  // // 复制成功时的处理
  // clipboard.on('success', (e) => {
  //   console.log('复制成功', e);
  //   e.clearSelection(); // 清除选中状态
  //   clipboard.destroy(); // 销毁 clipboard 实例
  // });
  //
  // // 复制失败时的处理
  // clipboard.on('error', (e) => {
  //   console.error('复制失败', e);
  //   clipboard.destroy(); // 销毁 clipboard 实例
  // });
  //
  // // 触发点击事件，开始复制
  // clipboard.onClick({
  //   // 触发点击事件的元素，这里使用按钮
  //   delegateTarget: () => $refs.copyButton,
  // });
}

const highlightBlock = (index) => {
  highlightedIndex.value = index;
};

const resetBlock = (index) => {
  highlightedIndex.value = -1;
};


//侧边------------
// let teamList = ref([]);
/*切换团队*/
const btnSwiTeam = ref()
const popoverTeam = ref()
const teamOutside = () => {
  unref(popoverTeam).popoverTeam?.delayHide?.()
}
// /*新建团队*/
const addTeamVisible = ref(false)
const addTeamNameInput = ref('')
const addTeamInfoInput = ref('')
const guideIndex = ref();//侧栏导航高亮标识！！
const highLight = () => {//计算侧栏应该是哪里高亮
  // console.log(route.meta.index);
  if (route.meta.index != "teamManage" && route.meta.index != "project") {
    guideIndex.value = route.meta.index;
  }
  else if (route.meta.index == "teamManage") {
    guideIndex.value = 'team-' + route.params.id;
  }
  else if (route.meta.index == "project") {
    guideIndex.value = 'project-' + route.params.id;
  }
  // console.log("v:" + guideIndex.value);
}
// const highlightedIndex = ref(-1);


const switchToTeam = (team_to_id) => {
  axios.post('http://www.aamofe.top/api/team/checkout_team/', qs.stringify({ team_id: team_to_id }), { headers: { Authorization: authStore().token } })
    .then(res => {
      // console.log(res);
      if (res.data.errno == 0)//成功
      {
        //重新载入数据
        localStorage.setItem('teamName', res.data.current_team.team_name);
        // teamId: localStorage.getItem('teamId') ? localStorage.getItem('teamId') : '',
        // teamName: localStorage.getItem('teamName') ? localStorage.getItem('teamName') : '',
        //   isAdmin: localStorage.getItem('isAdmin') ? localStorage.getItem('isAdmin') : false,//当前登录者在当前团队是否有管理权限
        //     projectList: localStorage.getItem('projectList') ? localStorage.getItem('projectList') : [],//初始化为一个空数组
        window.location.reload();//重载页面
        return;
      }
      else {//失败
        ElMessage.error(res.data.msg);
        return;
      }
    })
    .catch(error => {
      // 处理请求错误
      console.error(error);
    });
}

const buildNewTeam = () => {
  if (!(addTeamNameInput.value)) {
    console.log('不能为空');
    ElMessage.warning('请输入团队名称');
    return;
  }

  axios.post('http://www.aamofe.top/api/team/create_team/', qs.stringify({ team_name: addTeamNameInput.value }), { headers: { Authorization: authStore().token } })
    .then(res => {
      // console.log(res);

      if (res.data.errno == 0)//成功
      {
        ElMessage.success(res.data.msg);
        addTeamVisible.value = false;
        addTeamNameInput.value = '';
        //重新获取团队列表
        fetchTeamlistData();
        return;
      }
      else {//失败
        ElMessage.error(res.data.msg);
        return;
      }
    })
    .catch(error => {
      // 处理请求错误
      console.error(error);
    });
}

const highlightedIndex_aside = ref(-1)
const highlightRow = (index) => {
  highlightedIndex_aside.value = index;
};

const resetRow = (index) => {
  highlightedIndex_aside.value = -1;
};

//Header----------
const buttonRef = ref()
const popoverRef = ref()
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}
const user = reactive({
  userId: '',
  name: '',
  nickName: '',
  userAvatar: '',
  email: '',
})
const fetchUserData = () => {
  let Headers = { 'Authorization': authStore().token };

  axios.get('http://www.aamofe.top/api/user/show_info/0', { headers: Headers })
    .then((response) => {
      // console.log(Headers);
      console.log(response);

      if (response.data.errno == 0) {  //获取成功“我”的身份信息
        user.userId = response.data.user_info.id;
        user.name = response.data.user_info.username;
        localStorage.setItem('username', user.name);
        user.nickName = response.data.user_info.nickname;
        nickNameConfigInput.value = user.nickName;
        user.userAvatar = response.data.user_info.avatar_url;
        localStorage.setItem('userAvatar', user.userAvatar)  //这是头像
        // console.log("🚀 ~ file: Header.vue:291 ~ .then ~ authStore().userAvatar:", authStore().userAvatar)
        user.email = response.data.user_info.email;
        return;
      }
      else {
        ElMessage.warning(response.data.msg);
      }
    }).catch(error => {
      console.log(error);
    })
}

/*进入账户设置*/
const personMsgDialog = ref(false)
const nickNameConfig = ref(false)
const nickNameConfigInput = ref('')
const avatarConfig = ref(false)
const pwdConfig = ref(false)
const pwdConfigTitle = ref('修改密码')
const pwdConfigInput = ref('')
const pwdSureInput = ref('')

const handleRemove = (file, uploadFiles) => {
  console.log(file, uploadFiles)
}

const handlePreview = (uploadFile) => {
  console.log(uploadFile)
}

const handleExceed = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${files.length + uploadFiles.length
    } totally`
  )
}

const beforeRemove = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(
    `Cancel the transfer of ${uploadFile.name} ?`
  ).then(
    () => true,
    () => false
  )
}

/*修改昵称*/
const nickNameConfigMethod = () => {
  if (!(nickNameConfigInput.value)) {
    console.log('昵称不能为空');
    ElMessage.warning('请输入昵称');
    return;
  }
  axios.post('http://www.aamofe.top/api/user/update_info/',
    qs.stringify({ nickname: nickNameConfigInput.value }), { headers: { Authorization: authStore().token } })
    .then(res => {
      // 处理响应数据
      console.log(res);

      if (res.data.errno == 0)//成功
      {
        user.nickName = nickNameConfigInput.value;
        nickNameConfig = false;
        nickNameConfigInput.value = '';
        return;
      }
      else {//失败
        ElMessage.error(res.data.msg);
        return;
      }
    })
    .catch(error => {
      // 处理请求错误
      console.error(error);
    });
}

/*修改密码*/
const pwdConfigMethod = () => {
  if (!(pwdConfigInput.value)) {
    console.log('密码不能为空');
    ElMessage.warning('请输入密码');
    return;
  }
  axios.post('http://www.aamofe.top/api/user/update_info/',
    qs.stringify({ password: pwdConfigInput.value }), { headers: { Authorization: authStore().token } })
    .then(res => {
      // 处理响应数据
      console.log(formData);
      console.log(res);

      if (res.data.errno == 0)//成功
      {
        pwdConfig = false;
        pwdConfigInput.value = '';
        return;
      }
      else {//失败
        ElMessage.error(res.data.msg);
        return;
      }
    })
    .catch(error => {
      // 处理请求错误
      console.error(error);
    });
}

/*主页面的退出登录*/
const logout = () => {
  authStore().isLogin = false;
  authStore().token = '';
  /*浏览器中*/
  localStorage.removeItem('isLogin');
  localStorage.removeItem('token');

  console.log(authStore().isLogin);
  console.log('token' + authStore().token);

  /*跳转到欢迎页*/
  jumpTo('');
}

</script>

<style scoped>
.in-center {
  display: flex;
  align-items: center;
}

.highlighted-row {
  background-color: rgb(237, 237, 237);
}

.highlighted-row_aside {
  background-color: rgb(237, 237, 237);
}

.my-divider_header {
  height: 1px;
  /* 设置横线的高度 */
  background-color: rgb(234, 232, 232);
  /* 设置横线的颜色 */
  margin: 10px 0;
  /* 可选：设置横线上下的间距 */
}

.round-choice {
  border-radius: 5px;
}

.round-choice_aside {
  border-radius: 5px;
  margin-bottom: 6px;
  padding: 3px 0 3px 5px;
}

.hintText {
  color: gray;
  font-size: small;
  font-weight: 600;
}

.designBlock {
  width: 18%;
  margin-bottom: 40px;
  margin-right: 14px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
}

.round {
  border-radius: 10px;
  /* 设置边框圆角半径，根据需要调整 */
}


.designImg {
  margin-bottom: 5px;
}

.draftFiles {
  width: 100%;
  background-color: rgba(243, 241, 241, 0.745);
  /* border: 2px solid #d0dcdc9a; */
  border-radius: 10px;
  /* padding: 5px 0 10px 0; */
  box-shadow: 0 .5px 0 .5px#e7f6f69a;
}


.my-divider {
  height: 1px;
  /* 设置横线的高度 */
  background-color: rgb(234, 232, 232);
  /* 设置横线的颜色 */
  margin: 0 0;
  /* 可选：设置横线上下的间距 */
}

.blockTitle {
  padding-left: 24px;
  padding-top: 20px;
  padding-bottom: 20px;
}

.rightTitle {
  padding-right: 40px;
  padding-top: 20px;
  padding-bottom: 20px;
  display: flex;
  text-align: right;
  display: flex;
  flex: 1;
  justify-content: flex-end;
}

.borderBlock {
  /* border: 1px solid rgba(176, 170, 170, 0.703);
  border-radius: 4px; */
  border: 2px solid #d0dcdc9a;
  border-radius: 10px;
  padding: 10px 0 10px 0;
  box-shadow: 0 .5px 0 .5px#e7f6f69a;
}

.link-block {
  border: 2px solid #d0dcdc9a;
  border-radius: 10px;
  padding: 10px 0 10px 0;
  box-shadow: 0 .5px 0 .5px#e7f6f69a;

  background-color: #f3f1f1fe;
}

.link-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

::v-deep .beginner {
  /* --el-bg-color: #000741 !important; */
  /* height: 100vh; */
  /* width: 100%; */
  /* height: 100%; */
  overflow: hidden;
  background-image: url('../assets/b_bg1.png');
  /* background-size: cover;  */
  background-size: 100% 100%;
  opacity: 0.85;
  background-repeat: no-repeat;
}

/*对话框圆角*/
.rounded-dialog {
  border-radius: 10px;
  /* 设置边框圆角半径，根据需要调整 */
}

.popover-customer {
  background-color: #0084ff !important;
  /* 设置背景颜色 */
}

/*上传团队封面*/
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}</style>
