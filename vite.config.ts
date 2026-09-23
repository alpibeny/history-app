import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  base: './', // Важно: относительные пути для корректной работы внутри Android/iOS активов
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // Удобный алиас для чистого импорта компонентов по SRP
    },
  },
  server: {
    port: 3000,
  }
})
