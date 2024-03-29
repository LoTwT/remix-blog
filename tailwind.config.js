// @ts-check

import { nextui } from "@nextui-org/react"
import TailwindTypography from "@tailwindcss/typography"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // 包含 Remix app 的所有页面
    "./app/**/*.tsx",
    // NextUI 的组件
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui(), TailwindTypography()],
}
