"use client";

import { useEffect, useRef, useState } from "react";
import type { Game } from "phaser";
import type { WorldBridge, WorldView } from "@/game/world/WorldModel";
import { formatNumber, t } from "@/lib/i18n";

type Status = "loading" | "ready" | "paused" | "error";

export function GameCanvas() {
  const host = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [attempt, setAttempt] = useState(0);
  const [world, setWorld] = useState<WorldView | null>(null);
  const bridge = useRef<WorldBridge>({ publish: setWorld });

  useEffect(() => {
    const parent = host.current;
    if (!parent) return;
    // Each effect owns its own mount, including during React Strict Mode's replay.
    const mount = document.createElement("div");
    mount.style.cssText = "width:100%;height:100%";
    parent.appendChild(mount);
    let cancelled = false;
    let game: Game | undefined;
    const fail = () => { if (!cancelled) setStatus("error"); };
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
    import("@/game/bootstrap/createGame").then(({ createGame }) => {
      if (cancelled) return;
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

  return <section aria-label={t("game.region")}>
    <div ref={host} className="canvas-host" role="region" aria-label={t("game.canvas")} />
    <p className="mt-2 text-sm">{t("game.controls")}</p>
    <div className="mt-3 flex flex-wrap gap-3">
      <button className="button" disabled={status !== "ready"} onClick={() => bridge.current.command?.({ type: "INSPECT" })}>{t("game.inspect")}</button>
      <button className="button" disabled={status !== "ready"} onClick={() => bridge.current.command?.({ type: "RECENTER" })}>{t("game.recenter")}</button>
    </div>
    {world && <>
      <p className="mt-3 text-sm" data-testid="player-position">{t("game.position", { x: formatNumber(world.position.x, { minimumFractionDigits: 1, maximumFractionDigits: 1 }), y: formatNumber(world.position.y, { minimumFractionDigits: 1, maximumFractionDigits: 1 }), state: t(world.moving ? "game.walking" : "game.idle") })}</p>
      <p role="status" className="mt-2 text-sm">{t(world.message)}</p>
      {world.selected && <section aria-label={t("booth.panel")} className="mt-3 rounded-xl border-2 border-[#302b40] bg-white p-4">
        <h2 className="font-bold">{t("booth.name")}</h2>
        <p className="mt-2">{t(world.atBooth ? "booth.arrived" : "booth.approaching")}</p>
        <p className="mt-2 text-sm">{t("booth.scope")}</p>
        <button className="button mt-3" onClick={() => bridge.current.command?.({ type: "DISMISS" })}>{t("booth.close")}</button>
      </section>}
    </>}
    <div className="mt-3 flex min-h-12 flex-wrap items-center justify-between gap-3">
      <p role="status" data-testid="renderer-status" className="text-sm font-bold">
        {t(`renderer.${status}`)}
      </p>
      {status === "error" && <button className="button" onClick={() => { setStatus("loading"); setAttempt(value => value + 1); }}>{t("renderer.retry")}</button>}
    </div>
  </section>;
}