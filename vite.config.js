import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import seo from './build/seo.js'

// Relative base + hash routing lets the build run from any path:
// ronnebybk.github.io/ronneby-bk/, a custom domain, or a local preview.
export default defineConfig({
  base: './',
  plugins: [
    seo(),
    vue({
      template: {
        // Instagram feed widget from behold.so
        compilerOptions: { isCustomElement: (tag) => tag === 'behold-widget' },
      },
    }),
  ],
})
