/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class', // 通过添加 class="dark" 切换
  theme: {
    extend: {
      // 主题色：科技蓝 + 赛博朋克学术风
      colors: {
        // 主色系：科技蓝
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#5e72e4', // 主品牌色
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#0a1929', // 深空蓝（暗色背景）
        },
        // 辅色：氖光紫
        accent: {
          DEFAULT: '#a855f7',
          glow: '#c084fc',
        },
        // 辅色：电光青（用于状态高亮）
        cyan: {
          neon: '#06b6d4',
          glow: '#22d3ee',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Noto Serif SC', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        // 霓虹闪烁效果（设备状态点）
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 8px currentColor' },
          '50%': { opacity: '0.7', boxShadow: '0 0 16px currentColor' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
