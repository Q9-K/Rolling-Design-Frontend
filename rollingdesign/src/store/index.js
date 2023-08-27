import { defineStore } from 'pinia'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export const authStore = defineStore({
  id: 'auth',
  state: () => ({

    // // 所有这些属性都将自动推断出它们的类型
    userId: localStorage.getItem('userId') ? localStorage.getItem('userId') : '',//当前登录者的id
    isLogin: localStorage.getItem('isLogin') ? localStorage.getItem('isLogin') : false,
    token: localStorage.getItem('token') ? localStorage.getItem('token') : '',
    // nickName: '',
    // avatar: '',
    // // username: '',
    // // password: '',
    // // account: 'passenger',
    // // phone_number: '',
    // // email: ''
  }),
  getters: {
    getUserID() {
      return this.userId;
    },
    getUsername() {
      return this.nickName;
    },
    getAvatar() {
      return this.avatar;
    },
    getToken() {
      return this.token;
    }
  },
  actions: {
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
