import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  /*登录页面*/
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  /*相当于主页*/
  {
    path: '/index',
    name: 'index',
    component: () => import(/* webpackChunkName: "about" */ '../views/IndexView.vue'),
    meta: { index: 'index' }
  },
  // 项目展示页
  {

    path: '/project/:id',
    name: 'project',

    component: () => import(/* webpackChunkName: "about" */ '../views/ProjectView.vue'),
    meta: { index: 'project' }
  },
  {
    // path: '/video/:id',/*注意这里*/
    path: '/design/:id',
    name: '/design',
    component: () => import('../views/PrototypeDesign.vue')
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/DesignView.vue'),
    // meta: { index: 'project:id' }
    // meta: (route) => ({ index: `project-${route.params.id}` })// 使用 route.params.id 设置 meta 值
  },
  {
    // path: '/video/:id',/*注意这里*/
    path: '/tiptap/:id',
    name: '/tiptap',
    component: () => import('../views/TipTap.vue')
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/DocView.vue'),
    // meta: { index: 'project:id' }
    // meta: (route) => ({ index: `project-${route.params.id}` })// 使用 route.params.id 设置 meta 值
  },
  // 团队成员
  {
    path: '/teamPeople',
    name: 'teamPeople',
    component: () => import(/* webpackChunkName: "about" */ '../views/TeamPeople.vue'),
    // meta: { index: 'team:id' }/*--------*/
    // meta: (route) => ({ index: `team-${route.params.id}` }) // 使用 route.params.id 设置 meta 值
    meta: { index: 'teamPeople' }
  },
  // 管理团队中的成员
  {
    path: '/teamManage/:id',
    name: 'teamManage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/TeamManage.vue'),
    // meta: { index: 'team:id' }/*--------*/
    // meta: (route) => ({ index: `team-${route.params.id}` }) // 使用 route.params.id 设置 meta 值
    meta: { index: 'teamManage' }
  },
  // 分享
  // {
  //   path: '/share',
  //   name: 'share',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/ShareView.vue'),
  //   meta: { index: 'share' }
  // },
  // // 草稿箱
  // {
  //   path: '/draft',
  //   name: 'draft',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/DraftView.vue'),
  //   meta: { index: 'draft' }
  // },
  // 回收站
  {
    path: '/recover',
    name: 'recover',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/RecoverView.vue'),
    meta: { index: 'recover' }
  },
  // 消息
  {
    path: '/message',
    name: 'message',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/MessageView.vue'),
    meta: { index: 'message' }
  },
  {
    path: '/test',
    name: 'test',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/others/TestView.vue')
  },
  {
    path:"/chat",
    name:'chat',
    component:()=>import('../views/chatRoom.vue')
  },
  {
    path: '/team/:token',
    name: 'invite',
    component: () => import('../views/Invite.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
