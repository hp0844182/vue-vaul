import { join } from 'node:path'
import { merge } from 'webpack-merge'
import type { WebpackConfig } from '../common/types'
import { getVantConfig, getWebpackConfig, setBuildTarget } from '../common'
import { ES_DIR, LIB_DIR } from '../common/constant'
import { baseConfig } from './webpack.base'

export function getPackageConfig(isMinify: boolean): WebpackConfig {
  const { name } = getVantConfig()

  setBuildTarget('package')

  return getWebpackConfig(
    merge(baseConfig as any, {
      mode: 'production',
      entry: {
        [name]: join(ES_DIR, 'index.js'),
      },
      stats: 'none',
      output: {
        path: LIB_DIR,
        library: name,
        libraryTarget: 'umd',
        filename: isMinify ? '[name].min.js' : '[name].js',
        umdNamedDefine: true,
        // https://github.com/webpack/webpack/issues/6522
        globalObject: '(typeof self !== \'undefined\' ? self : this)',
      },
      externals: {
        vue: {
          root: 'Vue',
          commonjs: 'vue',
          commonjs2: 'vue',
          amd: 'vue',
        },
      },
      performance: false,
      optimization: {
        minimize: isMinify,
      },
    }),
  )
}
