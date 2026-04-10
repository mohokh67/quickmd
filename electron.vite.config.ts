import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    build: {
      outDir: 'dist-electron/main',
      lib: {
        entry: 'electron/main/index.ts',
      },
    },
  },
  preload: {
    build: {
      outDir: 'dist-electron/preload',
      lib: {
        entry: 'electron/preload/index.ts',
      },
    },
  },
  renderer: {
    root: '.',
    plugins: [react()],
    build: {
      outDir: 'dist-electron/renderer',
      rollupOptions: {
        input: './index.html',
      },
    },
  },
})
