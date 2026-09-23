<template>
  <div class="home-container">
    <!-- Верхняя фиксированная плашка с прогрессом -->
    <header class="fixed-header">
      <div class="header-card">
        <h1 class="app-title">ИСТОРИЯ БЕЛАРУСИ</h1>
        <div class="progress-container">
          <div class="section-badge">РАЗДЕЛ I</div>
          <div class="progress-track">
            <div class="progress-bar" style="width: 25%"></div>
          </div>
          <span class="progress-percentage">25%</span>
        </div>
      </div>
    </header>

    <!-- Центральная область для карусели (Идеальное выравнивание по центру) -->
    <main class="center-content">
      <LessonCarousel 
        :lessons="lessons" 
        :initial-index="1"
        @select="handleLessonSelect"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LessonCarousel from '../components/LessonCarousel.vue'
import { LessonRepository, type Lesson } from '../repositories/LessonRepository'

const router = useRouter()
const lessonRepo = new LessonRepository()

// Переменная теперь принимает данные из SQLite
const lessons = ref<Lesson[]>([])
const isLoading = ref(true)

const handleLessonSelect = (id: number) => {
  router.push('/lesson/' + id)
}

onMounted(async () => {
  try {
    // Загружаем уроки из оффлайн-репозитория
    lessons.value = await lessonRepo.getLessonsForCarousel()
    
    // Искусственная заглушка: если вдруг сидинг не успел, подстрахуемся
    if (lessons.value.length === 0) {
      lessons.value = [
        { id: 1, categoryId: '1', title: 'Эволюция общества и экономики в древности.', content: '', orderIndex: 1, progress: '10/10', status: 'completed' },
        { id: 2, categoryId: '1', title: 'Эволюция общества и экономики в древности.', content: '', orderIndex: 2, progress: '2/10', status: 'in_progress' },
        { id: 3, categoryId: '1', title: 'Эволюция общества и экономики в древности.', content: '', orderIndex: 3, progress: '0/10', status: 'not_started' }
      ]
    }
  } catch (error) {
    console.error('Failed to load lessons from database:', error)
  } finally {
    isLoading.value = false
  }
})
</script>


<style scoped>
/* Контейнер занимает ровно высоту экрана смартфона и запрещает любой паразитный скролл */
.home-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #050814;
  overflow: hidden;
  box-sizing: border-box;
}

/* Жестко фиксируем верхнее меню вверху экрана */
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 16px 16px 0 16px;
  z-index: 100;
  /* Безопасная зона для "челок" на смартфонах */
  padding-top: calc(16px + env(safe-area-inset-top)); 
}

/* Плашка прогресса из макета */
.header-card {
  width: 100%;
  max-width: 340px;
  background-color: #0c132b;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 16px;
  text-align: center;
}

.app-title {
  font-size: 0.8rem;
  font-weight: 400;
  color: #6c757d;
  letter-spacing: 1.5px;
  margin-bottom: 12px;
  text-transform: uppercase;
}

.progress-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.section-badge {
  background-color: #3a86ff;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 10px;
}

.progress-track {
  flex: 1;
  height: 14px;
  background-color: #161f38;
  border-radius: 7px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #3a86ff;
  border-radius: 7px;
}

.progress-percentage {
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Центрируем карусель строго в пространстве между fixed-header и нативным таббаром */
.center-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Компенсируем высоту верхнего меню (~110px) и нижнего таббара (~65px) внутренними отступами */
  padding-top: calc(110px + env(safe-area-inset-top));
  padding-bottom: calc(65px + env(safe-area-inset-bottom));
  box-sizing: border-box;
}
</style>
