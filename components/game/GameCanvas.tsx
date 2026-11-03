"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Game } from "phaser";
import type { WorldBridge, WorldView } from "@/game/world/WorldModel";
import type { BusinessState } from "@/game/business/BusinessSimulation";
import { formatNumber, formatVnd, t } from "@/lib/i18n";
import { waitForSceneFonts } from "@/lib/presentation/fonts";
import { Icon } from "@/components/ui/Icon";
import Link from "next/link";
import { GameSheet } from "./GameSheet";

type Status = "loading" | "ready" | "paused" | "error";
const subscribeHydration = () => () => {};
const clientHydrated = () => true;
const serverHydrated = () => false;

export function GameCanvas() {
  const root = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [attempt, setAttempt] = useState(0);
  const [world, setWorld] = useState<WorldView | null>(null);
  const [business, setBusiness] = useState<Readonly<BusinessState> | null>(null);
  const bridge = useRef<WorldBridge>({ publish: setWorld, publishBusiness: setBusiness });
  const [panel, setPanel] = useState<"menu" | "business" | null>(null);
  const hydrated = useSyncExternalStore(subscribeHydration, clientHydrated, serverHydrated);

  useEffect(() => {
    const html = document.documentElement, body = document.body;
    const oldHtml = html.style.overflow, oldBody = body.style.overflow;
    html.style.overflow = "hidden"; body.style.overflow = "hidden";
    const viewport = window.visualViewport;
    const resize = () => {
      // Keyboard/browser chrome may shrink the visual viewport without changing 100dvh.
      if (root.current) root.current.style.height = viewport && viewport.scale === 1 ? `${viewport.height}px` : "";
    };
    resize(); viewport?.addEventListener("resize", resize);
    return () => { viewport?.removeEventListener("resize", resize); html.style.overflow = oldHtml; body.style.overflow = oldBody; };
  }, []);

  useEffect(() => {
    const parent = host.current;
    if (!parent) return;
    // Each effect owns its own mount, including during React Strict Mode's replay.
    const mount = document.createElement("div");
    mount.style.cssText = "width:100%;height:100%";
    parent.appendChild(mount);
    let cancelled = false;
    let game: Game | undefined;
    let failed = false;
    const fail = () => { failed = true; if (!cancelled) setStatus("error"); };
    const timeout = window.setTimeout(fail, 15000);
    const visibility = () => {
      if (!game || cancelled) return;
      if (document.hidden) game.loop.sleep();
      else game.loop.wake();
      setStatus(current => current === "error" ? current : document.hidden ? "paused" : "ready");
    };
    const observer = new ResizeObserver(() => game?.scale.refresh());
    observer.observe(parent);
    document.addEventListener("visibilitychange", visibility);
    Promise.all([import("@/game/bootstrap/createGame"), waitForSceneFonts()]).then(([{ createGame }]) => {
      if (cancelled || failed) return;
      mount.dataset.fontsReady = "true";
      game = createGame(mount, () => {
        window.clearTimeout(timeout);
        if (!cancelled) {
          setStatus("ready");
          if (document.hidden) visibility();
        }
      }, bridge.current);
    }).catch(fail);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      if (game) {
        game.destroy(true, false);
        // Destruction is deferred until a frame; wake a background-paused loop.
        game.loop.wake();
      }
      mount.remove();
    };
  }, [attempt]);

  return <section ref={root} className="game-root" aria-label={t("game.region")}>
    {!hydrated && <p className="game-no-script">{t("game.javascript")}</p>}
    <h1 className="sr-only">{t("brand.title")}</h1>
    <div className="game-hud game-layer">
      <div className="hud-pill">{business && <><span aria-label={t("overlay.cash")}>{formatVnd(business.cashVnd)}</span><span>{business.day ? t("business.day", { day: business.day }) : t("overlay.beforeDay")}</span></>}<span className="save-state"><Icon name="cloud"/>{t("hud.unsaved")}</span></div>
      <button className="floating-control" aria-label={t("overlay.menu")} onClick={() => { bridge.current.command?.({ type: "DISMISS" }); setPanel("menu"); }}><Icon name="flower"/></button>
    </div>
    <div ref={host} className="canvas-host" role="region" aria-label={t("game.canvas")} />
    <div className="game-actions game-layer">
      <button className="floating-control" aria-label={t("game.recenter")} disabled={status !== "ready"} onClick={() => bridge.current.command?.({ type: "RECENTER" })}><Icon name="focus"/></button>
      <button className="floating-control" aria-label={t("game.inspect")} disabled={status !== "ready"} onClick={() => { setPanel(null); bridge.current.command?.({ type: "INSPECT" }); }}><Icon name="camera"/></button>
      <button className="floating-control" aria-label={t("overlay.business")} disabled={status !== "ready"} onClick={() => { bridge.current.command?.({ type: "DISMISS" }); setPanel("business"); }}><Icon name="home"/></button>
      {business && <button className="button" disabled={status !== "ready"} onClick={() => bridge.current.businessCommand?.({ type: business.shopStatus === "closed" ? "OPEN_SHOP" : business.shopStatus === "open" ? "PAUSE_SHOP" : "RESUME_SHOP" })}>{t(business.shopStatus === "closed" ? "business.openAction" : business.shopStatus === "open" ? "business.pauseAction" : "business.resumeAction")}</button>}
    </div>
    {world && <>
      <p className="sr-only" data-testid="player-position">{t("game.position", { x: formatNumber(world.position.x, { minimumFractionDigits: 1, maximumFractionDigits: 1 }), y: formatNumber(world.position.y, { minimumFractionDigits: 1, maximumFractionDigits: 1 }), state: t(world.moving ? "game.walking" : "game.idle") })}</p>
      <div className="game-hints game-layer"><p className="game-hint">{t("overlay.hint")}</p><p role="status" className="game-hint">{t(world.message)}</p></div>
      {world.selected && <GameSheet title={t("booth.panel")} onClose={() => bridge.current.command?.({ type: "DISMISS" })}><section aria-label={t("booth.panel")}>
        <div className="panel-heading"><span className="icon-sticker"><Icon name="camera"/></span><div><p className="eyebrow">{t("hud.boothTag")}</p><h2>{t("booth.name")}</h2></div></div>
        <p className="mt-2">{t(world.atBooth ? "booth.arrived" : "booth.approaching")}</p>
        <p className="mt-2 text-sm">{t("booth.scope")}</p>
        <button className="button mt-3" onClick={() => bridge.current.command?.({ type: "DISMISS" })}>{t("booth.close")}</button>
      </section></GameSheet>}
    </>}
    {business && panel === "business" && <GameSheet title={t("overlay.business")} onClose={() => setPanel(null)}><section className="business-panel" aria-label={t("business.panelLabel")} data-testid="business-panel">
      <div className="business-heading"><h2>{t("business.day", { day: business.day || 1 })}</h2><span className={`business-status business-status--${business.shopStatus}`}>{t(`business.${business.shopStatus}`)}</span></div>
      <p>{t("business.elapsed", { time: formatNumber(Math.floor(business.elapsedMs / 60_000), { minimumIntegerDigits: 2 }) + ":" + formatNumber(Math.floor(business.elapsedMs / 1_000) % 60, { minimumIntegerDigits: 2 }) })}</p>
      {business.currentDay && <div className="business-stats"><p>{t("business.revenue", { amount: formatVnd(business.currentDay.revenueVnd) })}</p><p>{t("business.expenses", { amount: formatVnd(business.currentDay.expensesVnd) })}</p><p>{t("business.profit", { amount: formatVnd(business.currentDay.profitVnd) })}</p><p className="business-spawns">{t("business.spawnRequests", { count: business.currentDay.spawnRequests })}</p></div>}
      {business.lastDay && <div className="business-summary" data-testid="day-summary"><h3>{t("business.daySummary", { day: business.lastDay.day })}</h3><p>{t("business.revenue", { amount: formatVnd(business.lastDay.revenueVnd) })}</p><p>{t("business.expenses", { amount: formatVnd(business.lastDay.expensesVnd) })}</p><p>{t("business.profit", { amount: formatVnd(business.lastDay.profitVnd) })}</p>{business.lastDay.spawnRequests === 0 && <p>{t("business.noRevenueYet")}</p>}</div>}
      <div className="business-actions">
        {business.shopStatus === "closed" && <button className="button" disabled={status !== "ready"} onClick={() => bridge.current.businessCommand?.({ type: "OPEN_SHOP" })}>{t("business.openAction")}</button>}
        {business.shopStatus === "open" && <><button className="icon-control" onClick={() => bridge.current.businessCommand?.({ type: "PAUSE_SHOP" })}>{t("business.pauseAction")}</button><button className="button business-close" onClick={() => bridge.current.businessCommand?.({ type: "CLOSE_DAY" })}>{t("business.closeAction")}</button></>}
        {business.shopStatus === "paused" && <><button className="button" onClick={() => bridge.current.businessCommand?.({ type: "RESUME_SHOP" })}>{t("business.resumeAction")}</button><button className="icon-control" onClick={() => bridge.current.businessCommand?.({ type: "CLOSE_DAY" })}>{t("business.closeAction")}</button></>}
      </div>
      <p className="business-scope">{t("business.scope")}</p>
      <p>{t("overlay.spawnScope")}</p>
    </section></GameSheet>}
    {panel === "menu" && <GameSheet title={t("overlay.menu")} onClose={() => setPanel(null)}><p>{t("game.controls")}</p><p>{t("business.scope")}</p><Link className="button" href="/">{t("nav.home")}</Link></GameSheet>}
    <div className={status === "ready" ? "sr-only" : "game-loading"}>
      <p role="status" data-testid="renderer-status" className="text-sm font-bold">
        {t(`renderer.${status}`)}
      </p>
      {status === "error" && <button className="button" onClick={() => { setStatus("loading"); setAttempt(value => value + 1); }}>{t("renderer.retry")}</button>}
    </div>
  </section>;
}