import Phaser from "phaser";
import { ShopScene } from "../scenes/ShopScene";
import type { WorldBridge } from "../world/WorldModel";
import { RENDERING } from "../config/rendering";

export function createGame(parent: HTMLElement, ready: () => void, bridge: WorldBridge): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.CANVAS,
    parent,
    width: RENDERING.width,
    height: RENDERING.height,
    backgroundColor: RENDERING.background,
    pixelArt: true,
    banner: false,
    audio: { noAudio: true },
    fps: { target: RENDERING.targetFps },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [new ShopScene(ready, bridge)],
  });
}