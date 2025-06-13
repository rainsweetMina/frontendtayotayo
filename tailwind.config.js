/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          50: '#F9FAFB',
          // 필요에 따라 다른 회색 색상도 추가할 수 있습니다
        }
      }
    },
  },
  plugins: [],
}
