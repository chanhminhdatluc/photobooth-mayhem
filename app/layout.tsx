import type { Metadata, Viewport } from "next";
import "./globals.css";
import { DEFAULT_LOCALE, t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: t("brand.title"),
  description: t("meta.description"),
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#f8f0e7" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang={DEFAULT_LOCALE}><body>{children}</body></html>;
}