// import { Oswald } from "next/font/google";
// import type { Config } from "tailwindcss";

// export default {
//   content: [
//     "./pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       fontFamily:{
//         Oswald:["Oswald", "sans-serif"],
//         roboto: ["Roboto", "sans-serif"],

//       },
//       colors: {
//         primary: "#d4000d",
//         dark: "#0a0a0a",
//         light: "#ffffff",
        
//       },
//     },
//   },
  
//   plugins: [],
// } satisfies Config;
import { type Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#d4000d",
        dark: "#0a0a0a",
        light: "#ffffff",
      },
      fontFamily: {
        oswald: ["var(--font-oswald)", "Oswald", "sans-serif"],
        roboto: ["var(--font-roboto)", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
