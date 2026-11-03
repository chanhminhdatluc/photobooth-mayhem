"use client";

import { useEffect, useRef } from "react";
import { t } from "@/lib/i18n";

/** Native modal keeps focus and blocks click-through without resizing the canvas. */
export function GameSheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const active = document.activeElement as HTMLElement | null;
    dialog.showModal();
    return () => { dialog.close(); if (active?.isConnected) active.focus(); };
  }, []);
  return <dialog ref={ref} className="game-sheet" aria-label={title} onCancel={event => { event.preventDefault(); onClose(); }}>
    <div className="sheet-heading"><h2>{title}</h2><button className="icon-control" autoFocus onClick={onClose}>{t("overlay.close")}</button></div>
    {children}
  </dialog>;
}