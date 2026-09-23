<template>
  <div class="app-container">
    <!-- Основной контент страницы -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- Нижний навигационный таббар -->
    <nav class="tab-bar">
      <router-link to="/" class="tab-item" active-class="active">
        <span class="icon">🏠</span>
      </router-link>
      <router-link to="/sections" class="tab-item" active-class="active">
        <span class="icon">📖</span>
      </router-link>
      <router-link to="/trainers" class="tab-item" active-class="active">
        <span class="icon">🔑</span>
      </router-link>
      <router-link to="/stats" class="tab-item" active-class="active">
        <span class="icon">📊</span>
      </router-link>
    </nav>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding-bottom: 70px; /* Чтобы контент не перекрывался нижним меню */
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: var(--bg-card);
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 100;
}

.tab-item {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 25%;
  height: 100%;
  transition: color 0.2s ease;
}

.tab-item.active {
  color: var(--accent-blue);
}
</style>
