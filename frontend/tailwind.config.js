/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#f6f8f6',  
          DEFAULT: '#0EAD69', 
          dark: '#086B40',    
        },
      },
    },
  },
  plugins: [],
};
