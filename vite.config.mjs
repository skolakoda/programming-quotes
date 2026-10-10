import {defineConfig} from 'vitest/config'
import {loadEnv} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({command, mode, isPreview}) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    base: command === 'build' || isPreview ? '/programming-quotes/' : '/',
    define: {
      'process.env.REACT_APP_DATA_MODE': JSON.stringify(mode === 'server' ? 'server' : env.REACT_APP_DATA_MODE || 'local'),
      'process.env.REACT_APP_ENV': JSON.stringify(command === 'build' ? 'production' : 'development'),
      'process.env.REACT_APP_API_URL': JSON.stringify(env.REACT_APP_API_URL || '')
    },
    build: {outDir: 'build'},
    server: {port: 3000},
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.js']
    }
  }
})
