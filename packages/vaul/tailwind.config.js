import { nextui } from '@yilanui/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{vue,html,js,md}', './App.vue'],
  theme: {
    extend: {},
  },
  plugins: [
    nextui(),
  ],
}
