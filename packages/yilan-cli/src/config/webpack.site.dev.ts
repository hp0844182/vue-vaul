import { join } from 'node:path'
import { merge } from 'webpack-merge'
import WebpackBar from 'webpackbar'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { get } from 'lodash'
import type { WebpackConfig } from '../common/types'
import { getVantConfig, getWebpackConfig } from '../common'
import { VantCliSitePlugin } from '../compiler/vant-cli-site-plugin'
import {
  GREEN,
  SITE_DESKTOP_SHARED_FILE,
  SITE_MODILE_SHARED_FILE,
} from '../common/constant'
import { baseConfig } from './webpack.base'

export function getSiteDevBaseConfig(): WebpackConfig {
  const vantConfig = getVantConfig()
  const headHtml = get(vantConfig, 'site.headHtml')
  const baiduAnalytics = get(vantConfig, 'site.baiduAnalytics')

  function getSiteConfig() {
    const siteConfig = vantConfig.site

    if (siteConfig.locales)
      return siteConfig.locales[siteConfig.defaultLang || 'en-US']

    return siteConfig
  }

  function getTitle(config: { title: string; description?: string }) {
    let { title } = config

    if (config.description)
      title += ` - ${config.description}`

    return title
  }

  const siteConfig = getSiteConfig()
  const title = getTitle(siteConfig)
  const { htmlPluginOptions } = vantConfig.site

  return merge(baseConfig as any, {
    entry: {
      'site-desktop': [join(__dirname, '../../site/desktop/main.js')],
      'site-mobile': [join(__dirname, '../../site/mobile/main.js')],
    },
    devServer: {
      port: 8080,
      quiet: true,
      host: '0.0.0.0',
      stats: 'errors-only',
      publicPath: '/',
      disableHostCheck: true,
    },
    resolve: {
      alias: {
        'site-mobile-shared': SITE_MODILE_SHARED_FILE,
        'site-desktop-shared': SITE_DESKTOP_SHARED_FILE,
      },
    },
    output: {
      chunkFilename: '[name].js',
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          chunks: {
            chunks: 'all',
            minChunks: 2,
            minSize: 0,
            name: 'chunks',
          },
        },
      },
    },
    plugins: [
      new WebpackBar({
        name: 'Vant Cli',
        color: GREEN,
      }),
      new VantCliSitePlugin(),
      new HtmlWebpackPlugin({
        title,
        logo: siteConfig.logo,
        description: siteConfig.description,
        usingSearch: !!siteConfig.searchConfig,
        chunks: ['chunks', 'site-desktop'],
        template: join(__dirname, '../../site/desktop/index.html'),
        filename: 'index.html',
        headHtml,
        baiduAnalytics,
        ...htmlPluginOptions,
      }),
      new HtmlWebpackPlugin({
        title,
        logo: siteConfig.logo,
        description: siteConfig.description,
        chunks: ['chunks', 'site-mobile'],
        template: join(__dirname, '../../site/mobile/index.html'),
        filename: 'mobile.html',
        headHtml,
        baiduAnalytics,
        ...htmlPluginOptions,
      }),
    ],
  })
}

export function getSiteDevConfig(): WebpackConfig {
  return getWebpackConfig(getSiteDevBaseConfig())
}
