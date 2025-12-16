/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary": "#f9f506",
                "background-light": "#f8f8f5",
                "background-dark": "#23220f",
                "surface-light": "#ffffff",
                "surface-dark": "#2c2c20",
                "surface-accent": "#f4f4e6",
                "surface-accent-dark": "#363628",
                "text-dark": "#1c1c0d",
                "text-light": "#fcfcf8",
                "text-muted": "#9e9d47",
                "input-bg": "#f4f4e6",
                "stone-850": "#1c1917",
                "border-light": "#e6e6db",
                "border-dark": "#44443a",
                "text-main": "#1c1c0d",
                "text-secondary": "#5e5e54",
            },
            fontFamily: {
                "display": ["Spline Sans", "sans-serif"],
                "body": ["Noto Sans", "sans-serif"],
                "arabic": ["Noto Naskh Arabic", "serif"],
            },
            borderRadius: {
                "DEFAULT": "1rem",
                "lg": "2rem",
                "xl": "3rem",
                "full": "9999px"
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries'),
    ],
}
