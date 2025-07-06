/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",    // App Router
    "./pages/**/*.{js,ts,jsx,tsx}",  // Pages Router
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },

        // 🔮 Warna tambahan
        finance: {
          purple: "#7C3AED",
          light: "#EDE9FE",
        },
        glass: {
          white: "rgba(255, 255, 255, 0.1)", // Ini adalah bg-white/10
          border: "rgba(255, 255, 255, 0.3)", // Ini adalah border-white/30
          // Menambahkan varian untuk sidebar glass (jika Anda ingin warna yang berbeda)
          sidebarBg: "rgba(255, 255, 255, 0.05)", // bg-white/5
          sidebarBorder: "rgba(255, 255, 255, 0.2)" // border-white/20
        },
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px", // Tailwind default xl
        "2xl": "24px", // Menambahkan definisi 2xl untuk backdrop-blur-2xl
        "3xl": "32px", // Menambahkan definisi 3xl jika ingin blur lebih kuat
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
