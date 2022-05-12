import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import Icons from 'unplugin-icons/vite'
import Unocss from 'unocss/vite'
import { presetAttributify, presetUno, presetIcons } from 'unocss'
import { extractorSvelte } from '@unocss/core'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Unocss({
      extractors: [extractorSvelte],
      presets: [
        presetAttributify({ /* preset options */}),
        presetUno(),
        presetIcons({
          extraProperties: {
            'display': 'inline-block',
            'vertical-align': 'middle',
            'margin': '5px'
          },
        }),
      ],
      rules: [
        ['mono', {'font-family': `'Major Mono Display', monospace;`}],
        ['less-mono', {'font-family': `'Space Mono', monospace;`}],
      ]
    }),
    svelte(),
    Icons({ compiler: 'svelte' })
  ]
})
