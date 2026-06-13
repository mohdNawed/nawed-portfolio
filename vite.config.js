import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/nawed-portfolio/',
  plugins: [
    react({
      include: '**/*.{js,jsx}',
      exclude: /node_modules/
    })
  ],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'build'
  }
})
