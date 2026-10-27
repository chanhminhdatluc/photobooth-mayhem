import Phaser from "phaser";
import { t } from "../../lib/i18n";
import { depth, project, tileAt } from "../isometric/projection";
import { SHOP } from "../world/shop";
import { WorldModel, type WorldBridge } from "../world/WorldModel";

export class ShopScene extends Phaser.Scene {
  private model = new WorldModel();
  private avatar!: Phaser.GameObjects.Container;
  private marker!: Phaser.GameObjects.Arc;
  private gesture?: { x: number; y: number; scrollX: number; scrollY: number; dragged: boolean };
  private lastView = "";
  constructor(private ready: () => void, private bridge: WorldBridge) { super("shop"); }

  create(): void {
    const floor = this.add.graphics().setDepth(-1000);
    for (let x = 0; x < SHOP.size; x++) for (let y = 0; y < SHOP.size; y++) {
      const p = project({ x, y });
      floor.fillStyle((x + y) % 2 ? 0xfff3df : 0xf0dfd9).lineStyle(1, 0xdac7ce);
      const corners = [new Phaser.Math.Vector2(p.x, p.y - 10), new Phaser.Math.Vector2(p.x + 20, p.y), new Phaser.Math.Vector2(p.x, p.y + 10), new Phaser.Math.Vector2(p.x - 20, p.y)];
      floor.fillPoints(corners, true).strokePoints(corners, true);
      if (x === 0 || y === 0) {
        floor.fillStyle(0xd2b9dd).fillPoints([new Phaser.Math.Vector2(p.x - 20, p.y), new Phaser.Math.Vector2(p.x - 20, p.y - 45), new Phaser.Math.Vector2(p.x, p.y - 55), new Phaser.Math.Vector2(p.x + 20, p.y - 45), new Phaser.Math.Vector2(p.x + 20, p.y), new Phaser.Math.Vector2(p.x, p.y - 10)], true);
      }
    }
    const entry = project(SHOP.entrance);
    this.add.text(entry.x, entry.y, t("scene.welcome"), { fontFamily: "Arial", fontSize: "10px", padding: { top: 3, bottom: 2 }, color: "#624d86", backgroundColor: "#c7e8d4" }).setOrigin(0.5).setDepth(-500);
    for (const item of SHOP.furniture) {
      const p = project(item.position), art = this.add.graphics().setPosition(p.x, p.y).setDepth(depth(item.position));
      if (item.kind === "booth") {
        art.fillStyle(0x302b40).fillRect(-17, -64, 34, 69);
        art.fillStyle(0xe9a9c5).fillRect(-15, -62, 30, 65);
        art.fillStyle(0xfff3df).fillRect(-12, -57, 24, 12);
        art.fillStyle(0x775e99).fillRect(-11, -40, 22, 40);
        art.fillStyle(0x9477b5).fillRect(-9, -40, 7, 39).fillRect(3, -40, 6, 39);
        this.add.text(p.x, p.y - 52, t("scene.photo"), { fontFamily: "Arial", fontSize: "9px", padding: { top: 2 }, color: "#302b40" }).setOrigin(0.5).setDepth(depth(item.position) + 0.1);
      } else if (item.kind === "counter") {
        art.fillStyle(0x887098).fillRect(-18, -20, 36, 25);
        art.fillStyle(0xc7e8d4).fillRect(-19, -25, 38, 10);
        art.fillStyle(0x302b40).fillRect(0, -35, 12, 11);
      } else {
        art.fillStyle(0xd98c9f).fillRect(-8, -12, 16, 15);
        art.fillStyle(0x86bca3).fillRect(-5, -34, 10, 25).fillRect(-13, -27, 26, 10);
      }
    }
    const body = this.add.graphics();
    body.fillStyle(0x574969).fillEllipse(0, 1, 18, 8);
    body.fillStyle(0x302b40).fillRect(-6, -10, 5, 11).fillRect(2, -10, 5, 11);
    body.fillStyle(0xf4cc71).fillRect(-8, -25, 16, 18);
    body.fillStyle(0xf1bd9c).fillRect(-6, -38, 12, 14);
    body.fillStyle(0x493b52).fillRect(-7, -40, 14, 7);
    body.fillStyle(0x302b40).fillRect(2, -31, 2, 2);
    this.avatar = this.add.container(0, 0, [body]);
    this.marker = this.add.circle(0, 0, 8, 0x7354b3, 0.35).setScale(1, 0.5).setDepth(-400).setVisible(false);
    this.bridge.command = command => {
      if (command.type === "RECENTER") this.cameras.main.setScroll(0, 0);
      if (command.type === "INSPECT") this.model.inspect();
      if (command.type === "DISMISS") this.model.selected = false;
      this.publish();
    };
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.gesture = { x: pointer.x, y: pointer.y, scrollX: this.cameras.main.scrollX, scrollY: this.cameras.main.scrollY, dragged: false };
    });
    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      const g = this.gesture;
      if (!g || !pointer.isDown) return;
      const dx = pointer.x - g.x, dy = pointer.y - g.y;
      if (Math.hypot(dx, dy) > 8) g.dragged = true;
      if (g.dragged) this.cameras.main.setScroll(Phaser.Math.Clamp(g.scrollX - dx, -60, 60), Phaser.Math.Clamp(g.scrollY - dy, -70, 70));
    });
    this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
      const gesture = this.gesture; this.gesture = undefined;
      if (!gesture || gesture.dragged) return;
      const world = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      const booth = project(SHOP.furniture[0]!.position);
      if (Math.abs(world.x - booth.x) <= 22 && world.y >= booth.y - 68 && world.y <= booth.y + 6) this.model.inspect();
      else {
        const cell = tileAt(world);
        if (this.model.move(cell)) { const p = project(cell); this.marker.setPosition(p.x, p.y).setVisible(true); }
      }
      this.publish();
    });
    const cancel = () => { this.gesture = undefined; };
    this.input.on("pointerupoutside", cancel);
    this.game.canvas.addEventListener("touchcancel", cancel);
    this.game.canvas.addEventListener("pointercancel", cancel);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      delete this.bridge.command;
      this.game.canvas.removeEventListener("touchcancel", cancel);
      this.game.canvas.removeEventListener("pointercancel", cancel);
    });
    this.game.events.once(Phaser.Core.Events.POST_RENDER, this.ready);
    this.publish();
  }
  private publish(): void {
    const view = this.model.view(), key = JSON.stringify({ ...view, position: { x: Math.round(view.position.x * 10) / 10, y: Math.round(view.position.y * 10) / 10 } });
    if (key !== this.lastView) { this.lastView = key; this.bridge.publish(view); }
  }
  update(_time: number, delta: number): void {
    this.model.update(delta / 1000);
    const p = project(this.model.position);
    this.avatar.setPosition(p.x, p.y).setDepth(depth(this.model.position) + 0.5);
    if (!this.model.view().moving) this.marker.setVisible(false);
    this.publish();
  }
}