import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Импортируем роутер
import './assets/styles/main.css'

createApp(App)
  .use(router) // Подключаем роутер
  .mount('#app')
