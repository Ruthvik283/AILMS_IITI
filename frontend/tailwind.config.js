/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        screens: {
          'custom-md': '1120px', // You can use any name you prefer
        },
  
      },
    },
    plugins: [
        function ({ addUtilities }) {
          const newUtilities = {
            '.user-select-none': {
              userSelect: 'none',
            },
          };
          addUtilities(newUtilities, ['responsive', 'hover']);
        },
      ],
  }

