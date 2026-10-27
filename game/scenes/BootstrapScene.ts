import Phaser from "phaser";
import { t } from "../../lib/i18n";

/** A renderer fixture, deliberately not a shop simulation or tile-map implementation. */
export class BootstrapScene extends Phaser.Scene {
  constructor(private readonly ready: () => void) { super("bootstrap"); }

  create(): void {
    const art = this.add.graphics();
    art.fillStyle(0xc6b7d8).fillEllipse(180, 310, 238, 56);
    art.fillStyle(0xfff5e5).fillPoints([new Phaser.Math.Vector2(44, 260), new Phaser.Math.Vector2(180, 192), new Phaser.Math.Vector2(316, 260), new Phaser.Math.Vector2(180, 328)], true);
    art.lineStyle(2, 0xd9cbbb);
    for (let i = 1; i < 4; i++) {
      art.lineBetween(44 + i * 34, 260 - i * 17, 180 + i * 34, 328 - i * 17);
      art.lineBetween(44 + i * 34, 260 + i * 17, 180 + i * 34, 192 + i * 17);
    }
    // Chunky original booth silhouette; replace with production sprites in later phases.
    art.fillStyle(0x302b40).fillRect(112, 124, 116, 160);
    art.fillStyle(0xe9a9c5).fillRect(116, 128, 108, 152);
    art.fillStyle(0xb989b7).fillPoints([new Phaser.Math.Vector2(228, 124), new Phaser.Math.Vector2(252, 138), new Phaser.Math.Vector2(252, 270), new Phaser.Math.Vector2(228, 284)], true);
    art.fillStyle(0xfff5e5).fillRect(124, 138, 92, 26);
    art.fillStyle(0x302b40).fillRect(128, 176, 76, 96);
    art.fillStyle(0x9477b5).fillRect(132, 180, 34, 88).fillRect(170, 180, 30, 88);
    art.fillStyle(0x775e99).fillRect(140, 180, 6, 88).fillRect(184, 180, 6, 88);
    art.fillStyle(0xf8db7d).fillRect(210, 188, 8, 12);
    art.fillStyle(0x302b40).fillRect(116, 280, 12, 10).fillRect(212, 280, 12, 10);
    art.fillStyle(0xd98c9f).fillRect(68, 250, 22, 28);
    art.fillStyle(0x86bca3).fillRect(72, 224, 14, 30).fillRect(62, 232, 34, 12);
    this.add.text(170, 150, t("scene.photo"), { fontFamily: "Arial", fontSize: "16px", color: "#302b40", fontStyle: "bold" }).setOrigin(0.5);
    this.add.text(180, 68, t("scene.slogan"), { fontFamily: "Arial", fontSize: "13px", color: "#624d86" }).setOrigin(0.5);
    this.add.text(180, 364, t("scene.foundation"), { fontFamily: "Arial", fontSize: "12px", color: "#624d86" }).setOrigin(0.5);
    this.game.events.once(Phaser.Core.Events.POST_RENDER, this.ready);
  }
}