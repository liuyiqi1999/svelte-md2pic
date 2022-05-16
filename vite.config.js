import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
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
            'min-width': '1em'
          },
        }),
      ],
      rules: [
        ['mono', {'font-family': `'Major Mono Display', monospace;`}],
        ['less-mono', {'font-family': `'Space Mono', monospace;`}],
      ],
      theme: {
        colors: {
          'accent': '#ff3e00'
        }
      }
    }),
    svelte(),
  ]
})
