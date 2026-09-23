import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from './views/HomeView.vue'
import SectionsView from './views/SectionsView.vue'
import StatsView from './views/StatsView.vue'
import TrainersView from './views/TrainersView.vue'
import LessonView from './views/LessonView.vue'

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: HomeView },
  { path: '/sections', component: SectionsView },
  { path: '/stats', component: StatsView },
  { path: '/trainers', component: TrainersView },
  { path: '/lesson/:id', component: LessonView, props: true }
]

const router = createRouter({
  // КРИТИЧЕСКИ ВАЖНО ДЛЯ CAPACITOR: Используем Hash-историю, 
  // так как нативные приложения открывают файлы по протоколу file://
  history: createWebHashHistory(),
  routes
})

export default router
