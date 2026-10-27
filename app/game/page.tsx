import Link from "next/link";
import { GameCanvas } from "@/components/game/GameCanvas";
import { t } from "@/lib/i18n";

export default function GamePage() {
  return <main className="shell">
    <header className="mb-5 flex flex-wrap items-center justify-between gap-4">
      <div><p className="eyebrow">{t("brand.title")}</p><h1 className="mt-1 text-2xl font-black">{t("game.title")}</h1></div>
      <Link href="/" className="inline-flex min-h-12 items-center font-bold underline">{t("nav.home")}</Link>
    </header>
    <GameCanvas />
    <p className="mt-3 text-sm">{t("game.javascript")}</p>
    <p className="mt-5 text-sm leading-relaxed">{t("game.scope")}</p>
  </main>;
}