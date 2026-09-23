<script setup lang="ts">
// Импортируем SVG-иконки напрямую из папки assets
import homeIcon from './assets/menu-home.svg'
import homeActiveIcon from './assets/menu-home-active.svg'
import bookIcon from './assets/menu-book.svg'
import bookActiveIcon from './assets/menu-book-active.svg'
import trainIcon from './assets/menu-train.svg'
import trainActiveIcon from './assets/menu-train-active.svg'
import rankIcon from './assets/menu-rank.svg'
import rankActiveIcon from './assets/menu-rank-active.svg'
</script>

<template>
  <div class="app-container">
    <!-- Основной контент страницы -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- Нижний навигационный таббар -->
       <!-- Открой src/App.vue и проверь блок .tab-bar, он должен быть таким: -->
    <nav class="tab-bar">
      <!-- 1. ГЛАВНАЯ -->
      <router-link to="/" class="tab-item" v-slot="{ isActive }">
        <img :src="isActive ? homeActiveIcon : homeIcon" alt="Home" class="tab-icon" />
      </router-link>

      <!-- 2. ТРЕНАЖЕРЫ (Переехал на второе место) -->
      <router-link to="/trainers" class="tab-item" v-slot="{ isActive }">
        <img :src="isActive ? trainActiveIcon : trainIcon" alt="Trainers" class="tab-icon" />
      </router-link>

      <!-- 3. ВЫБОР РАЗДЕЛА (Переехал на третье место) -->
      <router-link to="/sections" class="tab-item" v-slot="{ isActive }">
        <img :src="isActive ? bookActiveIcon : bookIcon" alt="Sections" class="tab-icon" />
      </router-link>

      <!-- 4. СТАТИСТИКА -->
      <router-link to="/stats" class="tab-item" v-slot="{ isActive }">
        <img :src="isActive ? rankActiveIcon : rankIcon" alt="Stats" class="tab-icon" />
      </router-link>
    </nav>

  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #050814;
}

.main-content {
  flex: 1;
  padding-bottom: 75px;
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 65px;
  background-color: #070B19;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 999;
}

.tab-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20%;
  height: 100%;
  cursor: pointer;
  transition: transform 0.1s ease;
}

.tab-item:active {
  transform: scale(0.92);
}

.tab-icon {
  width: 26px;
  height: 26px;
  object-fit: contain;
}
</style>
