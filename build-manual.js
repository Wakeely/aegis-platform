import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { build } from 'vite'

async function buildProject() {
  try {
    await build({
      root: '/workspace/aegis-platform',
      plugins: [react()],
      build: {
        outDir: 'dist',
        sourcemap: true
      }
    })
    console.log('Build completed successfully!')
  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
}

buildProject()
