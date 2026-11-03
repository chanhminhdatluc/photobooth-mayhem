import Phaser from "phaser";
import { t } from "../../lib/i18n";
import { depth, project, tileAt } from "../isometric/projection";
import { SHOP } from "../world/shop";
import { WorldModel, type WorldBridge } from "../world/WorldModel";
import { createTextures, preloadArt } from "../assets/textures";
import { drawEnvironment } from "../rendering/environment";
import { fitCamera, clampCameraCenter } from "../rendering/camera";
import { sceneFontFamily } from "../../lib/presentation/fonts";
import { BusinessSimulation } from "../business/BusinessSimulation";

export class ShopScene extends Phaser.Scene {
  private model = new WorldModel();
  private simulation = new BusinessSimulation();
  private avatar!: Phaser.GameObjects.Image;
  private marker!: Phaser.GameObjects.Arc;
  private highlight!: Phaser.GameObjects.Graphics;
  private reaction!: Phaser.GameObjects.Graphics;
  private reactionUntil = 0;
  private previousMessage = "";
  private gesture?: { x: number; y: number; scrollX: number; scrollY: number; dragged: boolean };
  private lastView = "";
  private direction = 0;
  private reducedMotion = false;
  private cameraCenter = { x: 180, y: 180 };
  constructor(private ready: () => void, private bridge: WorldBridge) { super("shop"); }
  preload(): void { preloadArt(this); }
  private frameShop = (): void => {
    const c = this.cameras.main, fit = fitCamera(this.scale.width, this.scale.height);
    const center = clampCameraCenter(fit.centerX, fit.centerY, c.width, c.height, fit.zoom);
    c.setZoom(fit.zoom).centerOn(center.x, center.y).setRoundPixels(true);
    this.recordCamera();
  };
  private resizeShop = (): void => {
    const c = this.cameras.main, zoom = fitCamera(c.width, c.height).zoom;
    const center = clampCameraCenter(this.cameraCenter.x, this.cameraCenter.y, c.width, c.height, zoom);
    c.setZoom(zoom).centerOn(center.x, center.y); this.recordCamera();
  };
  private recordCamera(): void {
    const c = this.cameras.main;
    this.cameraCenter = { x: c.scrollX + c.width / 2, y: c.scrollY + c.height / 2 };
    this.game.canvas.dataset.camera = JSON.stringify({ zoom: c.zoom, scrollX: c.scrollX, scrollY: c.scrollY, width: c.width, height: c.height });
  }
  create(): void {
    this.bridge.publishBusiness?.(this.simulation.view());
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    createTextures(this); drawEnvironment(this);
    const booth = project(SHOP.furniture[0]!.position);
    this.add.image(booth.x, booth.y + 8, "booth", 0).setOrigin(0.5, 1).setDepth(depth(SHOP.furniture[0]!.position));
    this.add.text(booth.x - 7, booth.y - 58, t("scene.photo"), { fontFamily: sceneFontFamily(), fontSize: "9px", fontStyle: "bold", color: "#6b527c", padding: { top: 4, bottom: 2 } }).setOrigin(0.5).setDepth(booth.y + 0.1);
    this.highlight = this.add.graphics().setDepth(booth.y - 1);
    this.highlight.lineStyle(2, 0xffe7a7).strokeRoundedRect(booth.x - 27, booth.y - 77, 51, 85, 4).setVisible(false);
    this.avatar = this.add.image(0, 0, "manager", 0).setOrigin(0.5, 0.92);
    this.reaction = this.add.graphics().setDepth(1000).setVisible(false);
    this.marker = this.add.circle(0, 0, 8, 0xf6d185, 0.55).setStrokeStyle(1, 0xfff8df).setScale(1, 0.5).setDepth(-400).setVisible(false);
    this.frameShop(); this.scale.on("resize", this.resizeShop);
    this.bridge.command = command => {
      if (command.type === "RECENTER") this.frameShop();
      if (command.type === "INSPECT") this.model.inspect();
      if (command.type === "DISMISS") this.model.selected = false;
      this.publish();
    };
    this.bridge.businessCommand = command => {
      if (this.simulation.dispatch(command)) this.bridge.publishBusiness?.(this.simulation.view());
    };
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => { this.gesture = { x: p.x, y: p.y, scrollX: this.cameras.main.scrollX, scrollY: this.cameras.main.scrollY, dragged: false }; });
    this.input.on("pointermove", (p: Phaser.Input.Pointer) => {
      const g = this.gesture; if (!g || !p.isDown) return;
      const dx = p.x - g.x, dy = p.y - g.y, c = this.cameras.main;
      if (Math.hypot(dx, dy) > 8) g.dragged = true;
      if (g.dragged) {
        const center = clampCameraCenter(g.scrollX - dx / c.zoom + c.width / 2, g.scrollY - dy / c.zoom + c.height / 2, c.width, c.height, c.zoom);
        c.centerOn(center.x, center.y);
      }
      this.recordCamera();
    });
    this.input.on("pointerup", (p: Phaser.Input.Pointer) => {
      const gesture = this.gesture; this.gesture = undefined;
      if (!gesture || gesture.dragged) return;
      const world = this.cameras.main.getWorldPoint(p.x, p.y);
      if (world.x >= booth.x - 25 && world.x <= booth.x + 25 && world.y >= booth.y - 77 && world.y <= booth.y + 8) this.model.inspect();
      else {
        const cell = tileAt(world);
        if (this.model.move(cell)) { const pos = project(cell); this.marker.setPosition(pos.x, pos.y).setVisible(true); }
      }
      this.publish();
    });
    const cancel = () => { this.gesture = undefined; };
    this.input.on("pointerupoutside", cancel);
    this.game.canvas.addEventListener("touchcancel", cancel); this.game.canvas.addEventListener("pointercancel", cancel);
    document.addEventListener("visibilitychange", cancel);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      delete this.bridge.command; delete this.bridge.businessCommand; this.simulation.events.clear(); this.scale.off("resize", this.resizeShop);
      this.game.canvas.removeEventListener("touchcancel", cancel); this.game.canvas.removeEventListener("pointercancel", cancel);
      document.removeEventListener("visibilitychange", cancel);
    });
    this.game.events.once(Phaser.Core.Events.POST_RENDER, this.ready); this.publish();
  }
  private publish(): void {
    const view = this.model.view(), key = JSON.stringify({ ...view, position: { x: Math.round(view.position.x * 10) / 10, y: Math.round(view.position.y * 10) / 10 } });
    if (view.message !== this.previousMessage) {
      this.previousMessage = view.message;
      if (view.message === "world.atBooth" || view.message === "world.blocked") {
        this.reactionUntil = this.time.now + 1100;
        this.reaction.clear().fillStyle(0xfffae9).fillRoundedRect(-8, -8, 16, 16, 5);
        this.reaction.fillStyle(view.message === "world.atBooth" ? 0xc983a6 : 0x8b79a5);
        if (view.message === "world.atBooth") this.reaction.fillCircle(-2, -1, 3).fillCircle(2, -1, 3).fillTriangle(-5, 0, 5, 0, 0, 5);
        else this.reaction.fillRect(-1, -4, 2, 5).fillRect(-1, 3, 2, 2);
      }
    }
    if (key !== this.lastView) { this.lastView = key; this.bridge.publish(view); }
  }
  update(time: number, delta: number): void {
    const beforeBusiness = JSON.stringify(this.simulation.view());
    this.simulation.advance(delta);
    if (beforeBusiness !== JSON.stringify(this.simulation.view())) this.bridge.publishBusiness?.(this.simulation.view());
    const before = { ...this.model.position }; this.model.update(delta / 1000);
    const pos = this.model.position, p = project(pos), dx = pos.x - before.x, dy = pos.y - before.y;
    if (dx || dy) this.direction = dx > 0 ? 0 : dy > 0 ? 1 : dx < 0 ? 2 : 3;
    const moving = this.model.view().moving;
    const frame = moving ? Math.floor(time / 130) % 4 : this.reducedMotion ? 0 : time % 3200 < 180 ? 2 : 0;
    this.avatar.setFrame(this.direction * 4 + frame).setPosition(p.x, p.y).setDepth(depth(pos) + 0.5);
    this.game.canvas.dataset.actorFrame = String(this.direction * 4 + frame);
    this.highlight.setVisible(this.model.selected);
    this.reaction.setVisible(time < this.reactionUntil).setPosition(p.x, p.y - 51);
    if (!moving) this.marker.setVisible(false);
    this.publish();
  }
}