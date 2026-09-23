<template>
  <div class="page home-page">
    <header class="header">
      <h1>ИСТОРИЯ БЕЛАРУСИ</h1>
      <span class="badge">РАЗДЕЛ I</span>
    </header>

    <main class="content-grid">
      <!-- Сюда пойдут круги уроков с макета -->
      <div class="lesson-node active">
        <div class="circle">Урок 1</div>
        <button class="btn-primary" @click="$router.push('/lesson/1')">ПОВТОРИТЬ</button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page {
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
.badge {
  background: var(--accent-blue);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
}
</style>
