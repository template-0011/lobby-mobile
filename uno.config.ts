import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetMini,
  presetUno,
} from 'unocss'

import presetRemToPx from '@unocss/preset-rem-to-px'

// unocss可以借助这个工具： https://to-unocss.netlify.app

export default defineConfig({
  presets: [
    presetUno,
    presetAttributify,
    presetIcons(),
    // 为什么要用到这个插件？
    // 模板使用 viewport 作为移动端适配方案，unocss 默认单位为 rem
    // 所以需要转成 px，然后由 postcss 把 px 转成 vw/vh，完成适配
    presetRemToPx({
      // 这里为什么要设置基础字体大小？看下面这篇文章
      // https://juejin.cn/post/7262975395620618298
      baseFontSize: 16,
    }),
    presetMini(),
  ],
  shortcuts: [
    // shortcuts to multiple utilities
    ['btn', 'px-4 py-1 rounded-1 border-none inline-block bg-#33334b text-white cursor-pointer !outline-none disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['flex-center', 'flex justify-center items-center'], // flex布局居中
    ['flex-x-center', 'flex justify-center'], // flex布局：主轴居中
    ['flex-y-center', 'flex items-center'], // flex布局：交叉轴居中
    ['text-overflow', 'overflow-hidden whitespace-nowrap text-ellipsis'], // 文本溢出显示省略号
    ['text-break', 'whitespace-normal break-all break-words'], // 文本溢出换行
  ],
})
