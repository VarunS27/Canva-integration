export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
  animation: {
    'slide-in': 'slideIn 0.6s ease-out forwards'
  },
  keyframes: {
    slideIn: {
      '0%': { transform: 'translateX(-100%)'},
      '100%': { transform: 'translateX(0)'}
    }
  }
}
,
  },
  plugins: [],
  fontFamily: {
  sans: ['Outfit', 'sans-serif'],
}
};
