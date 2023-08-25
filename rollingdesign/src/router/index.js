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
    redirect: '/fileEdit'
  },
  {
    path: '/fileEdit',
    name: 'fileEdit',
    component: () => import('../views/FileEditor.vue')
  },
  // {
  //   path: '/test',
  //   name: 'test',
  //   component: () => import('../views/Test.vue')
  // },
  {
    path: '/tiptap',
    name: 'tiptap',
    component: () => import('../views/TipTap.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
