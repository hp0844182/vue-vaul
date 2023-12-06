import { resolve } from 'node:path'
import { defineConfig } from 'vite'

// import vueJsx from '@vitejs/plugin-vue2-jsx'
import { HstVue } from '@histoire/plugin-vue2'
import vue from '@vitejs/plugin-vue2'
import dts from 'vite-plugin-dts'
import VueMacros from 'unplugin-vue-macros/vite'

export default defineConfig({
  histoire: {
    setupFile: './histoire-setup.ts',
    plugins: [
      HstVue(),
    ],
  },
  plugins: [
    VueMacros({
      plugins: {
        vue: vue(),
        // vueJsx: vueJsx(),
      },
    }),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    dts({
      cleanVueFileName: true,
      exclude: ['src/test/**'],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'vue': resolve(__dirname, 'node_modules/vue/dist/vue.runtime.esm.js'),
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
          vue: 'Vue',
        },
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'style.css')
            return 'index.css'

          if (chunkInfo.name === 'index.mjs')
            return 'index.js'

          return chunkInfo.name as string
        },
      },
    },
  },
})
