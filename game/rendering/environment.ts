import Phaser from "phaser";
import { project, depth } from "../isometric/projection";
import { SHOP } from "../world/shop";
import { t } from "../../lib/i18n";
import { sceneFontFamily } from "../../lib/presentation/fonts";

export function drawEnvironment(scene: Phaser.Scene): void {
  const g = scene.add.graphics().setDepth(-1000);
  const poly = (color: number, points: number[][]) => g.fillStyle(color).fillPoints(points.map(p => new Phaser.Math.Vector2(p[0], p[1])), true);
  poly(0xbca6c3, [[20, 195], [180, 115], [340, 195], [340, 211], [180, 291], [20, 211]]);
  for (let x = 0; x < SHOP.size; x++) for (let y = 0; y < SHOP.size; y++) {
    const p = project({ x, y });
    scene.add.image(p.x, p.y, `floor-${(x * 3 + y * 7) % 3}`).setOrigin(0.5).setDepth(-900);
  }
  const walls = scene.add.graphics().setDepth(-800);
  const wall = (color: number, points: number[][]) => walls.fillStyle(color).fillPoints(points.map(p => new Phaser.Math.Vector2(p[0], p[1])), true);
  wall(0xbda2cd, [[20, 195], [180, 115], [180, 61], [20, 141]]);
  wall(0xe2c0d8, [[180, 115], [340, 195], [340, 141], [180, 61]]);
  wall(0xfce5e6, [[16, 139], [180, 57], [344, 139], [340, 145], [180, 65], [20, 145]]);
  wall(0x907299, [[20, 186], [180, 106], [180, 115], [20, 195]]);
  wall(0xb68cae, [[180, 106], [340, 186], [340, 195], [180, 115]]);
  walls.lineStyle(1, 0xcdb4d8, 0.8);
  for (let i = 1; i < 8; i++) { walls.lineBetween(20 + i * 20, 141 - i * 10, 20 + i * 20, 186 - i * 10); walls.lineBetween(180 + i * 20, 61 + i * 10, 180 + i * 20, 106 + i * 10); }
  for (const [x, y] of [[77, 141], [115, 119], [259, 132]]) {
    const poster = scene.add.graphics().setDepth(-700);
    poster.fillStyle(0x8d7299).fillRect(x!, y! - 29, 23, 30);
    poster.fillStyle(0xfff2dd).fillRect(x! + 2, y! - 27, 19, 26);
    for (let i = 0; i < 3; i++) {
      poster.fillStyle(i % 2 ? 0xd6b6d5 : 0xaccfbd).fillRect(x! + 5, y! - 24 + i * 7, 13, 6);
      poster.fillStyle(0xf0c09d).fillRect(x! + 10, y! - 23 + i * 7, 3, 3);
    }
  }
  scene.add.text(204, 87, t("scene.studio"), { fontFamily: sceneFontFamily(), fontStyle: "bold", fontSize: "10px", color: "#fff8ed", backgroundColor: "#9c7ba6", padding: { x: 6, y: 6 } }).setDepth(-650);
  // Small wall decals: static decoration, never simulated event feedback.
  const accents = scene.add.graphics().setDepth(-640);
  for (const [x, y] of [[42, 157], [150, 89], [315, 160]]) {
    accents.fillStyle(0xffe5ad).fillCircle(x!, y!, 4);
    accents.fillStyle(0xfff5dc).fillCircle(x! - 1, y! - 1, 2);
  }
  const entry = project(SHOP.entrance);
  const mat = scene.add.graphics().setDepth(-600);
  mat.fillStyle(0x789f98).fillPoints([new Phaser.Math.Vector2(entry.x - 23, entry.y), new Phaser.Math.Vector2(entry.x, entry.y - 11), new Phaser.Math.Vector2(entry.x + 23, entry.y), new Phaser.Math.Vector2(entry.x, entry.y + 11)], true);
  scene.add.text(entry.x, entry.y - 2, t("scene.welcome"), { fontFamily: sceneFontFamily(), fontSize: "9px", color: "#fff3df", padding: { top: 4, bottom: 3 } }).setOrigin(0.5).setDepth(-500);
  for (const item of SHOP.furniture) {
    const p = project(item.position);
    if (item.kind !== "booth") scene.add.image(p.x, p.y + 6, item.kind).setOrigin(0.5, 1).setDepth(depth(item.position));
  }
}