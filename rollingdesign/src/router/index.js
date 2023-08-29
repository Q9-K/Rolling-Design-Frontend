import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

const routes = [
  /*登录页面*/
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  /*相当于主页*/
  {
    path: '/index',
    name: 'index',
    component: () => import(/* webpackChunkName: "about" */ '../views/IndexView.vue'),
    meta: {
      index: 'index',
      requireAuth: true
    }
  },
  // 项目展示页
  {

    path: '/project/:id',
    name: 'project',

    component: () => import(/* webpackChunkName: "about" */ '../views/ProjectView.vue'),
    meta: {
      index: 'project',
      requireAuth: true
    }
  },
  {
    // path: '/video/:id',/*注意这里*/
    path: '/design/:id',
    name: '/design',
    component: () => import('../views/PrototypeDesign.vue'),
    meta: {
      requireAuth: false
    }
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
    component: () => import('../views/TipTap.vue'),
    meta: {
      requireAuth: false
    }
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
    meta: {
      index: 'teamPeople',
      requireAuth: true
    }
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
    meta: {
      index: 'teamManage',
      requireAuth: true
    }
  },
  {
    path: '/recover',
    name: 'recover',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/RecoverView.vue'),
    meta: {
      index: 'recover',
      requireAuth: true
    }
  },
  // 消息
  {
    path: '/message',
    name: 'message',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/MessageView.vue'),
    meta: {
      index: 'message',
      requireAuth: true
    }
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/others/TestView.vue'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: "/chat",
    name: 'chat',
    component: () => import('../views/chatRoom.vue'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/team/:token',
    name: 'invite',
    component: () => import('../views/Invite.vue'),
    meta: {
      requireAuth: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('../views/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    next('/home')
  }
  else {
    next()
  }
})


export default router
