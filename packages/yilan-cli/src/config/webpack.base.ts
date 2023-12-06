import { join } from 'node:path'
import { existsSync } from 'node:fs'
import sass from 'sass'
import FriendlyErrorsPlugin from '@nuxt/friendly-errors-webpack-plugin'
import { VueLoaderPlugin } from 'vue-loader'
import { consola } from '../common/logger'
import type { WebpackConfig } from '../common/types'
import {
  CACHE_DIR,
  CWD,
  POSTCSS_CONFIG_FILE,
  SCRIPT_EXTS,
  STYLE_EXTS,
} from '../common/constant'

const CACHE_LOADER = {
  loader: 'cache-loader',
  options: {
    cacheDirectory: CACHE_DIR,
  },
}

const CSS_LOADERS = [
  'style-loader',
  'css-loader',
  {
    loader: 'postcss-loader',
    options: {
      config: {
        path: POSTCSS_CONFIG_FILE,
      },
    },
  },
]

const plugins = [
  new VueLoaderPlugin(),
  new FriendlyErrorsPlugin({
    clearConsole: false,
    logLevel: 'WARNING',
  }),
]

const tsconfigPath = join(CWD, 'tsconfig.json')
if (existsSync(tsconfigPath)) {
  const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin')
  plugins.push(
    new ForkTsCheckerPlugin({
      formatter: 'codeframe',
      vue: { enabled: true },
      logger: {
        // skip info message
        info() {},
        warn(message: string) {
          consola.warn(message)
        },
        error(message: string) {
          consola.error(message)
        },
      },
    }),
  )
}

const VUE_LOADER = {
  loader: 'vue-loader',
  options: {
    compilerOptions: {
      preserveWhitespace: false,
    },
  },
}

export const baseConfig: WebpackConfig = {
  mode: 'development',
  resolve: {
    extensions: [...SCRIPT_EXTS, ...STYLE_EXTS],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [CACHE_LOADER, VUE_LOADER],
      },
      {
        test: /\.(js|ts|jsx|tsx)$/,
        exclude: /^node_modules(\/\.pnpm)?\/(?!(@vant\/cli))/,
        use: [CACHE_LOADER, 'babel-loader'],
      },
      {
        test: /\.css$/,
        sideEffects: true,
        use: CSS_LOADERS,
      },
      {
        test: /\.less$/,
        sideEffects: true,
        use: [...CSS_LOADERS, 'less-loader'],
      },
      {
        test: /\.scss$/,
        sideEffects: true,
        use: [
          ...CSS_LOADERS,
          {
            loader: 'sass-loader',
            options: {
              implementation: sass,
            },
          },
        ],
      },
      {
        test: /\.md$/,
        use: [CACHE_LOADER, VUE_LOADER, '@vant/markdown-loader'],
      },
    ],
  },
  plugins,
}
