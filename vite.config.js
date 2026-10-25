import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Relative base + hash routing lets the build run from any path:
// ronnebybk.github.io/ronneby-bk/, a custom domain, or a local preview.
export default defineConfig({
  base: './',
  plugins: [
    vue({
      template: {
        // Instagram feed widget from behold.so
        compilerOptions: { isCustomElement: (tag) => tag === 'behold-widget' },
      },
    }),
  ],
})
