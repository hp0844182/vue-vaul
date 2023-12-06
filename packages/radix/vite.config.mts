/// <reference types="histoire" />
import { defineConfig } from 'vite';
import { resolve } from 'node:path'
import { HstVue } from '@histoire/plugin-vue2'
import vueJsx from '@vitejs/plugin-vue2-jsx'
import vue from '@vitejs/plugin-vue2'
import dts from 'vite-plugin-dts'
import VueMacros from 'unplugin-vue-macros/vite'

export default defineConfig({
  histoire: {
    setupFile: '/src/histoire-setup.ts',
    plugins: [
      HstVue(),
    ],
  },
  plugins: [
    VueMacros({
      plugins:{
        vue:vue(),
        vueJsx:vueJsx()
      }
    }),
    dts({
      cleanVueFileName: true,
      exclude: ['src/test/**'],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      name: 'radix-vue2',
      fileName: 'index',
      entry: resolve(__dirname, 'src/index.ts'),
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library (Vue)
      external: ['vue', '@floating-ui/vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          'vue': 'Vue',
        },
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'style.css')
            return 'index.css'
          return chunkInfo.name as string
        },
      },
    },
  },
})
