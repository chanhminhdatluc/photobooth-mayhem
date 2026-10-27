import Link from "next/link";
import { t } from "@/lib/i18n";
export default function NotFound() {
  return <main className="shell"><h1 className="text-2xl font-bold">{t("notFound.title")}</h1><p className="my-5">{t("notFound.description")}</p><Link className="button" href="/">{t("nav.home")}</Link></main>;
}