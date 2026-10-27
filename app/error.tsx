"use client";
import { t } from "@/lib/i18n";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="shell"><h1 className="text-2xl font-bold">{t("error.title")}</h1><p className="my-5">{t("error.description")}</p><button className="button" onClick={reset}>{t("error.retry")}</button></main>;
}