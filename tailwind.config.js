/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        "love-pink": "#FF5858",
        "love-light": "#FF8080",
        "love-dark": "#E63E3E",
        "love-accent": "#b8e1ff",
        "love-purple": "#d9a9ff",
      },
    },
  },
  daisyui: {
    themes: [
      {
        beats: {
          "primary": "#FF5858",
          "primary-focus": "#E63E3E",
          "primary-content": "#ffffff",
          
          "secondary": "#d9a9ff",
          "secondary-focus": "#b57edb",
          "secondary-content": "#ffffff",
          
          "accent": "#b8e1ff",
          "accent-focus": "#8ac5f2",
          "accent-content": "#1c2b36",
          
          "neutral": "#322c3b",
          "neutral-focus": "#222222",
          "neutral-content": "#ffffff",
          
          "base-100": "#ffffff",
          "base-200": "#f9fafb",
          "base-300": "#f2f3f5",
          "base-content": "#322c3b",
          
          "info": "#b8e1ff",
          "success": "#a6e3c5",
          "warning": "#ffcf86",
          "error": "#ff9494",
          
          "--rounded-box": "1.2rem",
          "--rounded-btn": "0.8rem",
          "--rounded-badge": "0.5rem",
          "--animation-btn": "0.3s",
          "--animation-input": "0.3s",
          "--btn-focus-scale": "0.95",
          "--border-btn": "2px",
          "--tab-border": "2px",
          "--tab-radius": "0.7rem",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
} 