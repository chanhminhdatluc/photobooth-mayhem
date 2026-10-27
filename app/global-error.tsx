"use client";
import { DEFAULT_LOCALE, t } from "@/lib/i18n";
export default function GlobalError({ reset }: { reset: () => void }) {
  return <html lang={DEFAULT_LOCALE}><body><h1>{t("error.title")}</h1><p>{t("error.description")}</p><button onClick={reset}>{t("error.retry")}</button></body></html>;
}