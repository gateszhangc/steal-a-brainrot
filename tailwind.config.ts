import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        night: "#0C0D14",
        panel: "#1A1B26",
        surface: "#2A2B36",
        accent: "#41E161",
        slate: "#3B444E"
      },
      boxShadow: {
        glow: "0 8px 20px rgba(65,225,97,0.3)"
      },
      fontFamily: {
        nunito: ["var(--font-nunito)", "Nunito", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
