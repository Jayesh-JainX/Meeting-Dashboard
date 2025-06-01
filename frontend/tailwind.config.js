/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "sidebar-bg": "#FFFFFF", // As per design (left white panel)
        "main-bg": "#F7F8FA", // As per design (main content area light gray)
        "primary-purple": "#6A0DAD", // Example purple for buttons, can be adjusted
        "active-link-bg": "#E9EFFF", // Example for active link background
        "active-link-text": "#4A55A2", // Example for active link text
        "status-upcoming": "#34D399", // Green
        "status-in-review": "#FBBF24", // Yellow
        "status-cancelled": "#F87171", // Red
        "status-overdue": "#F59E0B", // Amber
        "status-published": "#60A5FA", // Blue
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Example font, adjust as needed
      },
    },
  },
  plugins: [],
};
