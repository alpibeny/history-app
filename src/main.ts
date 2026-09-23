import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import { DatabaseService } from './services/database'
import { LessonRepository } from './repositories/LessonRepository'

// Глобальная блокировка контекстного меню и копирования
document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})

document.addEventListener('keydown', (e) => {
  if (
    (e.ctrlKey && ['c', 'a', 'u', 's'].includes(e.key.toLowerCase())) || 
    e.key === 'F12'
  ) {
    e.preventDefault()
    return false
  }
})

// Главная функция запуска приложения
async function startApp() {
  try {
    // 1. Поднимаем SQLite соединение на устройстве
    const dbService = DatabaseService.getInstance()
    await dbService.initialize()

    // 2. Делаем тестовый сидинг (наполнение) базы данных
    const lessonRepo = new LessonRepository()
    await lessonRepo.seedInitialLessons([
      {
        id: 1,
        categoryId: 'section_1',
        title: 'Эволюция общества и экономики в древности.',
        content: 'Контент первого параграфа истории Беларуси...',
        orderIndex: 1
      },
      {
        id: 2,
        categoryId: 'section_1',
        title: 'Эволюция общества и экономики в древности.',
        content: 'Контент второго параграфа про каменный и бронзовый века...',
        orderIndex: 2
      },
      {
        id: 3,
        categoryId: 'section_1',
        title: 'Эволюция общества и экономики в древности.',
        content: 'Контент третьего параграфа про появление городищ...',
        orderIndex: 3
      }
    ])

    // 3. И только когда данные готовы, монтируем Vue интерфейс
    const app = createApp(App)
    app.use(router)
    app.mount('#app')

    console.log('App successfully launched with active SQLite layer.')
  } catch (error) {
    console.error('Critical app startup crash:', error)
    
    // Фолбек: если БД упала, интерфейс всё равно запустим, чтобы не было вечного белого экрана
    const app = createApp(App)
    app.use(router)
    app.mount('#app')
  }
}

// Запускаем весь процесс
startApp()
