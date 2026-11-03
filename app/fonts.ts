import localFont from "next/font/local";

export const bodyFont = localFont({
  src: [
    { path: "./fonts/BeVietnamPro-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/BeVietnamPro-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/BeVietnamPro-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-body", display: "swap", preload: true,
  fallback: ["Be Vietnam Pro", "Nunito", "Arial", "sans-serif"], adjustFontFallback: "Arial",
});
export const headingFont = localFont({
  src: "./fonts/Nunito-Variable.ttf", weight: "200 1000", style: "normal",
  variable: "--font-heading", display: "swap", preload: true,
  fallback: ["Nunito", "Arial", "sans-serif"], adjustFontFallback: "Arial",
});
export const fontVariables = `${bodyFont.variable} ${headingFont.variable}`;