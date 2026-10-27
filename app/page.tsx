import Link from "next/link";
import { t } from "@/lib/i18n";

export default function Home() {
  return <main className="shell">
    <p className="eyebrow mb-10">{t("home.eyebrow")}</p>
    <div className="rounded-3xl border-2 border-[#302b40] bg-[#f3c6d8] p-7 sm:p-12">
      <p className="eyebrow mb-4">{t("home.slogan")}</p>
      <h1 className="text-4xl font-black leading-none tracking-tight sm:text-6xl">{t("brand.first")}<br /><span className="text-[#624d86]">{t("brand.second")}</span></h1>
      <p className="mt-6 max-w-md text-lg leading-relaxed">{t("home.intro")}</p>
      <Link className="button mt-8" href="/game">{t("home.enter")} <span aria-hidden="true"> ↗</span></Link>
    </div>
    <section className="mt-8" aria-labelledby="status-heading">
      <h2 id="status-heading" className="text-xl font-bold">{t("home.heading")}</h2>
      <p className="mt-3 leading-relaxed">{t("home.description")}</p>
      <p className="mt-4 text-sm">{t("home.notice")}</p>
    </section>
  </main>;
}