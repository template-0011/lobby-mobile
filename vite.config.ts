import path from 'node:path'
import process from 'node:process'
import { loadEnv } from 'vite'
import type { ConfigEnv, UserConfig } from 'vite'
import viewport from 'postcss-mobile-forever'
import autoprefixer from 'autoprefixer'
import { createVitePlugins } from './build/vite'
import { exclude, include } from './build/vite/optimize'

export default ({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const env = loadEnv(mode, root)

  return {
    base: env.VITE_APP_PUBLIC_PATH,
    plugins: createVitePlugins(),

    server: {
      host: true,
      port: 4000,
      proxy: {
        /** 代理前缀为 /dev-api 的请求  */
        [env.VITE_APP_BASE_API]: {
          changeOrigin: true,
          // 接口地址
          target: env.VITE_APP_API_URL,
          ws: false,
        },
      },
    },

    resolve: {
      alias: {
        '~@': path.join(__dirname, './src'),
        '@': path.join(__dirname, './src'),
        '~': path.join(__dirname, './src/assets'),
      },
    },

    css: {
      postcss: {
        plugins: [
          autoprefixer(),
          // https://github.com/wswmsword/postcss-mobile-forever
          viewport({
            appSelector: '#app',
            viewportWidth: 375,
            maxDisplayWidth: 600,
            valueBlackList: ['1px solid'], // 属性值包含 '1px solid' 的内容不会转换
            selectorBlackList: ['.ignore', 'keep-px', '.swiper-slide', '.van-tabs__content'], // 下面配置表示类名中含有'keep-px'以及'.ignore'类都不会被转换
            mobileUnit: 'vw', // 指定需要转换成的视口单位，建议使用 vw
            rootContainingBlockSelectorList: [
              'van-tabbar',
              'van-popup',
              'van-popup--bottom',
            ],
            exclude: [/node_modules/], // 排除文件或文件夹
          }),
        ],
      },
    },

    build: {
      cssCodeSplit: true, // 启用CSS代码分割
      chunkSizeWarningLimit: 1500,
      minify: 'terser', // Vite 2.6.x 以上需要配置 minify: "terser", terserOptions 才能生效
      terserOptions: {
        compress: {
          keep_infinity: true, // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
          drop_console: true, // 生产环境去除 console
          drop_debugger: true, // 生产环境去除 debugger
          pure_funcs: ['console.log', 'console.info'], // 移除特定的console方法
        },
        format: {
          comments: false, // 删除注释
        },
      },
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // 第三方库单独打包
            if (id.includes('node_modules')) {
              // Vue相关库
              if (id.includes('vue') || id.includes('@vue')) {
                return 'vue-vendor'
              }
              // UI库
              if (id.includes('vant') || id.includes('@vant')) {
                return 'vant-vendor'
              }
              // 工具库
              if (id.includes('lodash') || id.includes('dayjs') || id.includes('axios')) {
                return 'utils-vendor'
              }
              // 图表库
              if (id.includes('echarts')) {
                return 'echarts-vendor'
              }
              // 其他第三方库
              return 'vendor'
            }
            // 子模块分别打包
            if (id.includes('src/01-kk-system')) {
              return 'kk-system'
            }
            if (id.includes('src/02-kk-i18n')) {
              return 'kk-i18n'
            }
            if (id.includes('src/04-kk-component-mobile')) {
              return 'kk-components'
            }
            // 页面按目录分包
            if (id.includes('src/pages')) {
              const match = id.match(/src\/pages\/([^/]+)/)
              if (match) {
                return `page-${match[1]}`
              }
            }
          },
          // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
          entryFileNames: 'js/[name].[hash].js',
          // 用于命名代码拆分时创建的共享块的输出命名
          chunkFileNames: 'js/[name].[hash].js',
          // 用于输出静态资源的命名，[ext]表示文件扩展名
          assetFileNames: (assetInfo: any) => {
            const info = assetInfo.name.split('.')
            let extType = info[info.length - 1]
            // console.log('文件信息', assetInfo.name)
            if (
              /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)
            ) {
              extType = 'media'
            }
            else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetInfo.name)) {
              extType = 'img'
            }
            else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
              extType = 'fonts'
            }
            return `${extType}/[name].[hash].[ext]`
          },
        },
      },
    },

    optimizeDeps: { include, exclude },
  }
}
