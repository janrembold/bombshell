import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import scss from 'rollup-plugin-scss'
import replace from 'rollup-plugin-replace'
import html from 'rollup-plugin-template-html'
import del from 'rollup-plugin-delete'

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH

export default {
  input: 'src/main.js',
  output: {
    file: 'public/bundle-[hash].js',
    format: 'iife',
    sourcemap: true,
  },
  plugins: [
    del({
      targets: ['public/bundle-*'],
    }),
    resolve({ browser: true }),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(
        production ? 'production' : 'development',
      ),
    }),
    scss(),
    production && terser(),
    html({
      template: 'src/index.html',
      filename: 'index.html',
    }),
  ],
}
