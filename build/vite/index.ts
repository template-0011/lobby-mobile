import path from 'node:path'
import process from 'node:process'
import { unheadVueComposablesImports } from '@unhead/vue'
import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import mockDevServerPlugin from 'vite-plugin-mock-dev-server'
import { VitePWA } from 'vite-plugin-pwa'
import Sitemap from 'vite-plugin-sitemap'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { createViteVConsole } from './vconsole'

export function createVitePlugins() {
  return [

    vue(),

    // https://github.com/jbaubree/vite-plugin-sitemap
    Sitemap(),

    // https://github.com/pengzhanbo/vite-plugin-mock-dev-server
    mockDevServerPlugin(),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      dirs: [
        'src/04-kk-component-mobile',
        'src/components',
      ],
      extensions: ['vue'],
      resolvers: [VantResolver()],
      include: [/\.vue$/, /\.vue\?vue/],
      // 指定自动导入组件TS类型声明文件路径 (false:关闭自动生成)
      // dts: false,
      dts: true,
    }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      include: [
        /\.[tj]sx?$/,
        /\.vue$/,
        /\.vue\?vue/,
      ],
      imports: [
        'vue',
        '@vueuse/core',
        VueRouterAutoImports,
        {
          'vue-router/auto': ['useLink'],
          '@/i18n': ['i18n'],
          'vue-i18n': ['useI18n'],
        },
        unheadVueComposablesImports,
      ],
      dts: 'src/types/auto-imports.d.ts',
      dirs: [
        'src/composables',
      ],
    }),

    // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
    // VueI18nPlugin({
    //   // locale messages resource pre-compile option
    //   include: resolve(dirname(fileURLToPath(import.meta.url)), '../../src/locales/**'),
    // }),

    legacy({
      targets: ['defaults', 'not IE 11'],
    }),

    // https://github.com/antfu/unocss
    // see uno.config.ts for config
    UnoCSS(),

    // https://github.com/vadxq/vite-plugin-vconsole
    createViteVConsole(),

    // https://github.com/antfu/vite-plugin-pwa
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: false,
      },
      // includeAssets: ['favicon.svg', 'safari-pinned-tab.svg'],
      // 添加workbox配置来处理大文件
      workbox: {
        // 增加最大文件缓存大小
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
        // 配置运行时缓存
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30天
              },
            },
          },
          {
            urlPattern: /^https:\/\/.*\.(?:js|css)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
            },
          },
        ],
        // 跳过等待，立即激活新的service worker
        skipWaiting: true,
        clientsClaim: true,
      },
      manifest: {
        name: 'lottery-mobile-web',
        short_name: 'lottery-mobile-web',
        theme_color: '#101115',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            // src: '/pwa-192x192.png',
            src: 'https://mlobby.51666.me/img/pwa.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'https://mlobby.51666.me/img/pwa.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'https://mlobby.51666.me/img/pwa.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      // resolve(pathSrc, 'assets/icons')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
      svgoOptions: {
        full: true,
        plugins: [
          {
            name: 'removeAttrs',
            params: {
              attrs: 'fill',
            },
          },
        ],
      },
    }),
  ]
}
