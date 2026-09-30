import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// GitHub Pages 项目页需带仓库名路径；本地 / Vercel 用根路径
const pagesBase = process.env.GITHUB_PAGES_BASE || '/'

export default defineConfig({
  base: pagesBase,
  plugins: [vue()],
  resolve: {
    // 与 file:../看板组件库 共用同一份 Vue，避免 $bt mixin 装到另一份构造器上
    dedupe: ['vue'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      vue: path.resolve(__dirname, 'node_modules/vue/dist/vue.runtime.esm.js'),
      'jdl-board-kit': path.resolve(__dirname, '../看板组件库'),
      // 扩展侧栏缺失的 Icon 3.0（Ai / LightbulbAward），保持线性默认 + Solid 选中
      '@lui/icons': path.resolve(__dirname, 'src/shims/lui-icons.js')
    }
  },
  optimizeDeps: {
    include: ['@lui/lui-ui', '@lui/lui-pro/lib/page-layout.js', 'vue']
  },
  server: {
    host: true,
    port: 5173,
    fs: {
      allow: [path.resolve(__dirname, '..')]
    }
  }
})
