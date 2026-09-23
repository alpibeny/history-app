import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

// Блокируем вызов контекстного меню (долгий тап на смартфонах / правая кнопка мыши)
document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})

// Блокируем попытки копирования через горячие клавиши (для веб-версии/тестирования)
document.addEventListener('keydown', (e) => {
  // Запрет Ctrl+C, Ctrl+A, Ctrl+U (просмотр кода), F12
  if (
    (e.ctrlKey && ['c', 'a', 'u', 's'].includes(e.key.toLowerCase())) || 
    e.key === 'F12'
  ) {
    e.preventDefault()
    return false
  }
})

createApp(App)
  .use(router)
  .mount('#app')
