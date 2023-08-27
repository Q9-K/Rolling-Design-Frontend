/*
 * @Date: 2023-08-25 01:08:32
 * @Author: Q9K
 * @Description: 
 */
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../App.vue')
    // redirect: '/tiptap/3'
  },
  // {
  //   path: '/fileEdit',
  //   name: 'fileEdit',
  //   component: () => import('../views/FileEditor.vue')
  // },
  // {
  //   path: '/test',
  //   name: 'test',
  //   component: () => import('../views/Test.vue')
  // },
  {
    path: '/tiptap/:id',
    name: 'tiptap',
    component: () => import('../views/TipTap.vue')
  },
  {
    path: '/invite/:token',
    name: 'invite',
    component: () => import('../views/Invite.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
