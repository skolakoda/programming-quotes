import {defineConfig} from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig(({command, isPreview}) => {
  return {
    plugins: [react()],
    base: command === 'build' || isPreview ? '/programming-quotes/' : '/',
    build: {outDir: 'build'},
    server: {port: 3000},
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.js']
    }
  }
})
