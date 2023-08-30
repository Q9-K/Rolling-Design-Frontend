import { defineStore } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export const authStore = defineStore({
  id: 'auth',
  state: () => ({
    //用户
    userId: localStorage.getItem('userId') ? localStorage.getItem('userId') : '',//当前登录者的id
    isLogin: localStorage.getItem('isLogin') ? localStorage.getItem('isLogin') : false,
    token: localStorage.getItem('token') ? localStorage.getItem('token') : '',
    userAvatar: localStorage.getItem('userAvatar') ? localStorage.getItem('userAvatar') : '',
    username: localStorage.getItem('username') ? localStorage.getItem('username') : 'Tourist',
    // nickName: '',

    //团队
    teamId: localStorage.getItem('teamId') ? localStorage.getItem('teamId') : '',
    teamName: localStorage.getItem('teamName') ? localStorage.getItem('teamName') : '',
    isAdmin: localStorage.getItem('isAdmin') ? localStorage.getItem('isAdmin') : false,//当前登录者在当前团队是否有管理权限
    projectList: localStorage.getItem('projectList') ? localStorage.getItem('projectList') : [],//初始化为一个空数组
    // memberList:localStorage.getItem('memberList') ? localStorage.getItem('memberList') : [],
  }),
  getters: {
    // getUserID() {
    //   return this.userId;
    // },
    // getUsername() {
    //   return this.nickName;
    // },
    // getAvatar() {
    //   return this.avatar;
    // },
    // getToken() {
    //   return this.token;
    // }
  },
  actions: {
    //获取当前团队
    //获取当前所有项目

    //邀请

    // $_login(state) {
    //   state.isLogin = true;
    //   localStorage.setItem('isLogin', true);
    // },
    // $_logout(state) {
    //   localStorage.removeItem('isLogin');
    //   localStorage.removeItem('isAdmin');
    //   localStorage.removeItem('token');
    //   localStorage.removeItem('nowUser');
    // },
    // $_logAdmin(state, value) {
    //   if (value == 1) { //登录的是管理员
    //     state.isAdmin = true;
    //     localStorage.setItem('isAdmin', true);
    //   } else {  //是普通用户
    //     state.isAdmin = false;
    //     localStorage.setItem('isAdmin', false);
    //   }
    // },
    // $_setToken(state, value) { //设置存储token
    //   state.token = value;
    //   localStorage.setItem('token', value);
    // },
    // $_setNowUser(state, user_id) {
    //   state.nowUser = user_id;
    //   localStorage.setItem('nowUser', user_id)
    // }
  }
})
