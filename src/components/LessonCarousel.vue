<template>
  <div 
    class="carousel-viewport"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseUp"
  >
    <div class="carousel-slider" :style="sliderStyle">
      
      <div 
        v-for="(lesson, index) in lessons" 
        :key="lesson.id"
        class="lesson-card-wrapper"
        :class="getCardClass(index)"
      >
        <!-- Круг урока -->
        <div class="lesson-circle">
          <div class="lesson-circle-inner">
            <span class="lesson-number">Урок {{ lesson.id }}</span>
            
            <!-- КРИТИЧЕСКИЙ ФИКС: Рендерим контент ТОЛЬКО для активного центрального элемента -->
            <template v-if="index === activeIndex">
              <h2 class="lesson-title">{{ lesson.title }}</h2>
              
              <span v-if="lesson.status !== 'not_started'" class="lesson-counter">
                {{ lesson.progress }}
              </span>
              
              <button class="action-btn" @click="emit('select', lesson.id)">
                {{ lesson.status === 'completed' ? 'ПОВТОРИТЬ' : lesson.status === 'in_progress' ? 'ПРОДОЛЖИТЬ' : 'НАЧАТЬ' }}
              </button>
            </template>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Lesson {
  id: number;
  title: string;
  progress: string;
  status: string;
}

const props = defineProps<{
  lessons: Lesson[]
  initialIndex?: number
}>()

const emit = defineEmits<{
  (e: 'select', id: number): void
}>()

const activeIndex = ref(props.initialIndex ?? 1)
const touchOffsetX = ref(0)
const isDragging = ref(false)

let startX = 0
const CARD_WIDTH = 210 // Слегка увеличили базовую ширину для стабильности
const CARD_GAP = 28

const sliderStyle = computed(() => {
  const baseShift = -activeIndex.value * (CARD_WIDTH + CARD_GAP)
  const currentShift = baseShift + touchOffsetX.value
  return {
    transform: `translateX(${currentShift}px)`,
    transition: isDragging.value ? 'none' : 'transform 0.3s cubic-bezier(0.1, 0.8, 0.25, 1)'
  }
})

const getCardClass = (index: number) => {
  const classes: string[] = []
  
  if (index === activeIndex.value) classes.push('active')
  else if (index < activeIndex.value) classes.push('prev')
  else classes.push('next')

  if (index === 0) classes.push('gold-theme')
  else if (index === 1) classes.push('blue-theme')
  else classes.push('gray-theme')

  return classes.join(' ')
}

const handleTouchStart = (e: TouchEvent) => {
  if (!e.touches.length) return
  startX = e.touches[0].clientX
  isDragging.value = true
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value || !e.touches.length) return
  touchOffsetX.value = e.touches[0].clientX - startX
}

const handleTouchEnd = () => {
  if (!isDragging.value) return
  isDragging.value = false
  
  const threshold = 60
  if (touchOffsetX.value < -threshold && activeIndex.value < props.lessons.length - 1) {
    activeIndex.value++
  } else if (touchOffsetX.value > threshold && activeIndex.value > 0) {
    activeIndex.value--
  }
  touchOffsetX.value = 0
}

const handleMouseDown = (e: MouseEvent) => {
  startX = e.clientX
  isDragging.value = true
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return
  touchOffsetX.value = e.clientX - startX
}

const handleMouseUp = () => {
  handleTouchEnd()
}
</script>

<style scoped>
/* Контейнер карусели */
.carousel-viewport {
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 340px;
  position: relative;
  touch-action: pan-x !important;
  user-select: none;
}

/* Рельс для карточек */
.carousel-slider {
  display: flex;
  align-items: center;
  position: absolute;
  left: calc(50% - 105px); /* Ровно половина от CARD_WIDTH (210px) */
}

/* Обертка карточки с жесткими размерами */
.lesson-card-wrapper {
  width: 210px;
  height: 210px;
  flex-shrink: 0;
  margin-right: 28px; /* CARD_GAP */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.1, 0.8, 0.25, 1);
}

/* Базовый круг урока */
.lesson-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  transition: background-color 0.3s, border-color 0.3s;
}

.lesson-circle-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
  text-align: center;
}

/* --- СОСТОЯНИЕ БОКОВЫХ ЭЛЕМЕНТОВ (ОРИГИНАЛЬНЫЙ ОБЪЕМ) --- */
.lesson-card-wrapper.prev,
.lesson-card-wrapper.next {
  transform: scale(0.9); /* Делаем их крупными, как на макете */
}

/* Эффект прозрачности накладываем ТОЛЬКО на внутренний контент боковых кругов, */
/* чтобы сами круги (фон и рамки) оставались плотными и сочными! */
.lesson-card-wrapper.prev .lesson-circle-inner,
.lesson-card-wrapper.next .lesson-circle-inner {
  opacity: 0.4;
}

/* --- ТОЧНОЕ СООТВЕТСТВИЕ ЦВЕТАМ ИЗ МАКЕТА --- */

/* ЗОЛОТАЯ ТЕМА (Урок 1) */
/* --- ЗОЛОТАЯ ТЕМА (Урок 1) --- */
.gold-theme .lesson-circle {
  border: 6px solid #ffb703;
  background-color: #856926; /* Точный матовый золотисто-оливковый фон из оригинала */
}
.gold-theme .lesson-number,
.gold-theme .lesson-title,
.gold-theme .lesson-counter { 
  color: #ffb703 !important; 
  opacity: 1 !important;
}

.gold-theme .action-btn {
  background-color: #ffb703 !important;
  color: #3b2c00 !important; /* Тёмно-коричневый текст для идеального контраста */
  border: none;
}

/* СИНЯЯ ТЕМА С ДУГОЙ ПРОГРЕССА (Урок 2 - Активный) */
.blue-theme .lesson-circle {
  background-color: #1b3b77; /* Глубокий синий фон */
  border: 6px solid transparent;
  background-image: linear-gradient(#1b3b77, #1b3b77), conic-gradient(#3a86ff 75%, #162642 75%);
  background-origin: border-box;
  background-clip: content-box, border-box;
}
.blue-theme .lesson-number { 
  color: #a2c2f2; 
  font-weight: 500;
}
.blue-theme .lesson-title { 
  color: #ffffff; 
}
.blue-theme .lesson-counter { 
  color: #a2c2f2; 
}
.blue-theme .action-btn {
  background-color: #3a86ff;
  color: #ffffff;
}

/* СЕРАЯ ТЕМА (Урок 3) */
.gray-theme .lesson-circle {
  border: 4px solid #293142; /* Четкая серая рамка */
  background-color: #141b29; /* Плотный темно-серый фон */
}
.gray-theme .lesson-number {
  color: #ffffff !important; /* Белый текст для Урока 3 */
}
.gray-theme .action-btn {
  background-color: transparent;
  border: 2px solid #293142;
  color: #ffffff;
}

/* --- ТИПОГРАФИКА И КНОПКИ --- */
.lesson-number {
  font-size: 0.85rem;
  margin-bottom: 8px;
}

.lesson-title {
  font-size: 0.8rem;
  font-weight: 400; /* Убираем жирность! Шрифт становится узким и аккуратным */
  line-height: 1.4;
  margin-bottom: 6px;
  max-width: 150px;
}

.lesson-counter {
  font-size: 0.75rem;
  font-weight: 400;
  margin-bottom: 12px;
}

/* Длинная прямоугольная кнопка со слабым скруглением */
.action-btn {
  border: none;
  border-radius: 8px; /* Умеренное скругление углов */
  padding: 10px 0;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  max-width: 145px; /* Вытянутая форма */
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
