import { createRouter, createWebHashHistory } from 'vue-router'
import Home from "@/views/Home.vue";
import Game from "@/views/Game.vue";
import Settings from "@/views/Settings.vue";

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/game',
    name: 'game',
    component: Game
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
