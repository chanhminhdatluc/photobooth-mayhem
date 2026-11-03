import type Phaser from "phaser";

/** Original hand-authored procedural pixel textures. Generated once, never per frame.
 * External PNG sheets can replace the same texture keys/frame dimensions via preloadArt.
 */
export const ART = { actorWidth: 32, actorHeight: 48, actorFrames: 16, boothWidth: 56, boothHeight: 88 } as const;
export type BoothAppearance = "available" | "inUse" | "broken" | "repairing" | "empty";
export const BOOTH_STATES: BoothAppearance[] = ["available", "inUse", "broken", "repairing", "empty"];
export const EXTERNAL_SHEETS: { key: string; url: string; frameWidth: number; frameHeight: number }[] = [];
export function preloadArt(scene: Phaser.Scene): void {
  for (const sheet of EXTERNAL_SHEETS) scene.load.spritesheet(sheet.key, sheet.url, { frameWidth: sheet.frameWidth, frameHeight: sheet.frameHeight });
}

export function createTextures(scene: Phaser.Scene): void {
  function texture(key: string, width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void, frames = 1): void {
    if (scene.textures.exists(key)) return;
    const canvas = document.createElement("canvas"); canvas.width = width * frames; canvas.height = height;
    const ctx = canvas.getContext("2d")!; ctx.imageSmoothingEnabled = false; draw(ctx);
    const tex = scene.textures.addCanvas(key, canvas)!;
    for (let i = 0; i < frames; i++) tex.add(i, 0, i * width, 0, width, height);
  }
  const polygon = (c: CanvasRenderingContext2D, color: string, points: number[][]) => {
    c.fillStyle = color; c.beginPath(); points.forEach(([x, y], i) => i ? c.lineTo(x!, y!) : c.moveTo(x!, y!)); c.closePath(); c.fill();
  };
  const rect = (c: CanvasRenderingContext2D, color: string, x: number, y: number, w: number, h: number) => { c.fillStyle = color; c.fillRect(x, y, w, h); };
  for (let variant = 0; variant < 3; variant++) texture(`floor-${variant}`, 40, 22, c => {
    polygon(c, "#c5aab9", [[0, 10], [20, 0], [40, 10], [20, 22]]);
    polygon(c, ["#fff0d8", "#f3dce0", "#e7e5d9"][variant]!, [[1, 10], [20, 1], [39, 10], [20, 20]]);
    polygon(c, "#ffffff70", [[2, 10], [20, 2], [20, 3], [4, 11]]);
    rect(c, "#d3bac150", 17, 8, 2, 1); rect(c, "#ffffff80", 24, 11, 3, 1);
  });
  texture("plant", 40, 56, c => {
    polygon(c, "#5b496431", [[2, 48], [19, 42], [38, 49], [20, 55]]);
    polygon(c, "#b5738d", [[10, 32], [30, 32], [27, 49], [14, 49]]);
    rect(c, "#ecc2ba", 10, 31, 20, 5); rect(c, "#f9dcd0", 14, 37, 3, 9);
    rect(c, "#516e59", 19, 14, 2, 19);
    for (const [x, y, flip] of [[5, 14, 0], [21, 8, 1], [4, 25, 0], [23, 22, 1], [12, 3, 0]]) {
      polygon(c, "#497d70", [[x!, y! + 4], [x! + 7, y!], [x! + 13, y! + 7], [x! + 7, y! + 13]]);
      polygon(c, flip ? "#a7d8a5" : "#7db89a", [[x! + 2, y! + 4], [x! + 7, y! + 1], [x! + 10, y! + 7], [x! + 6, y! + 8]]);
    }
  });
  texture("counter", 52, 56, c => {
    polygon(c, "#4e3a6330", [[0, 44], [28, 35], [51, 45], [24, 55]]);
    polygon(c, "#94768e", [[3, 25], [29, 33], [29, 50], [3, 40]]);
    polygon(c, "#bda5b4", [[29, 33], [49, 23], [49, 39], [29, 50]]);
    polygon(c, "#d3efdc", [[0, 23], [21, 12], [51, 23], [29, 36]]);
    polygon(c, "#fff4dc", [[2, 22], [21, 14], [47, 23], [29, 32]]);
    for (let x = 7; x < 27; x += 5) rect(c, "#e2bac3", x, 33 + (x - 7) / 3, 2, 9);
    rect(c, "#51475e", 24, 6, 17, 15); rect(c, "#9ac9bd", 26, 8, 13, 9); rect(c, "#f2df97", 28, 10, 7, 2);
    rect(c, "#51475e", 30, 20, 5, 4); rect(c, "#edb6bf", 8, 17, 8, 7); rect(c, "#fff3dc", 10, 15, 5, 2);
  });
  texture("booth", ART.boothWidth, ART.boothHeight, c => {
    BOOTH_STATES.forEach((state, frame) => {
      c.save(); c.translate(frame * ART.boothWidth, 0);
      polygon(c, "#57405e30", [[1, 78], [31, 69], [55, 79], [27, 87]]);
      polygon(c, "#85658e", [[37, 7], [51, 15], [51, 73], [37, 81]]);
      polygon(c, "#f2cada", [[4, 9], [18, 2], [51, 15], [37, 23]]);
      rect(c, "#624e72", 3, 10, 36, 69); rect(c, "#e3a5be", 5, 12, 32, 65);
      rect(c, "#fff3dc", 7, 15, 28, 13); rect(c, "#f8dce3", 8, 30, 27, 44);
      rect(c, "#514361", 10, 32, 17, 39);
      for (let x = 11; x < 26; x += 4) { rect(c, "#a582ba", x, 33, 3, 36); rect(c, "#cfacd5", x, 33, 1, 34); }
      rect(c, "#3c354b", 29, 33, 5, 7); rect(c, "#a9dccc", 30, 34, 3, 4);
      rect(c, "#443b52", 28, 45, 7, 6); rect(c, "#8da8be", 30, 46, 3, 3); rect(c, "#fff8e8", 30, 46, 1, 1);
      rect(c, "#5c4968", 28, 62, 7, 3); rect(c, "#fff7df", 29, 65, 5, 5);
      rect(c, "#c086aa", 43, 27, 5, 31); for (let y = 30; y < 57; y += 5) rect(c, "#a7759b", 43, y, 5, 1);
      const colors = { available: "#a8dfaf", inUse: "#f8d87e", broken: "#f07883", repairing: "#a7c4ff", empty: "#f2ac73" };
      rect(c, colors[state], 29, 54, 5, 3);
      if (state === "broken") { rect(c, "#503c59", 15, 39, 3, 12); rect(c, "#503c59", 11, 43, 12, 3); }
      if (state === "repairing") { rect(c, "#e8c76c", 8, 58, 27, 5); for (let x = 9; x < 34; x += 6) rect(c, "#5b4c65", x, 58, 3, 5); }
      if (state === "empty") rect(c, "#f2ac73", 28, 65, 7, 5);
      rect(c, "#59495d", 7, 77, 5, 4); rect(c, "#59495d", 31, 77, 5, 4); c.restore();
    });
  }, 5);
  texture("manager", 32, 48, c => {
    for (let frame = 0; frame < 16; frame++) {
      c.save(); c.translate(frame * 32, 0);
      const direction = Math.floor(frame / 4), step = frame % 4, bob = step === 1 || step === 3 ? 1 : 0;
      polygon(c, "#54456535", [[5, 43], [16, 39], [27, 43], [16, 47]]);
      const leg = step === 1 ? 2 : step === 3 ? -2 : 0;
      rect(c, "#5f5d86", 10, 32, 5, 10 + leg); rect(c, "#484967", 17, 32, 5, 10 - leg);
      rect(c, "#fff1d8", 8, 41 + leg, 7, 3); rect(c, "#fff1d8", 17, 41 - leg, 7, 3);
      polygon(c, "#e5ac60", [[9, 22 + bob], [22, 22 + bob], [24, 33], [8, 33]]);
      rect(c, "#f7d48a", 11, 22 + bob, 10, 9); rect(c, "#718e91", 11, 27 + bob, 10, 8);
      rect(c, "#b9d5c2", 13, 29 + bob, 6, 3);
      rect(c, "#efbd9e", 6, 25 + bob + leg, 4, 7); rect(c, "#efbd9e", 22, 25 + bob - leg, 4, 7);
      polygon(c, "#64516c", [[7, 9 + bob], [10, 4 + bob], [22, 4 + bob], [26, 9 + bob], [25, 20 + bob], [21, 23 + bob], [10, 22 + bob], [7, 18 + bob]]);
      rect(c, "#f7d2b4", 9, 10 + bob, 15, 12); rect(c, "#eeb0b0", 10, 18 + bob, 3, 2); rect(c, "#eeb0b0", 21, 18 + bob, 3, 2);
      rect(c, "#80657c", 8, 7 + bob, 17, 6); rect(c, "#64516c", direction === 1 ? 22 : 8, 10 + bob, 3, 8);
      rect(c, "#eab5d0", 22, 8 + bob, 5, 3); rect(c, "#ffe7ad", 24, 7 + bob, 1, 5);
      if (direction < 2) { rect(c, "#423b4c", direction === 0 ? 18 : 13, 16 + bob, step === 2 ? 3 : 2, step === 2 ? 1 : 2); rect(c, "#d88d89", 18, 19 + bob, 3, 1); }
      else rect(c, "#514151", 10, 11 + bob, 14, 9);
      rect(c, "#a78082", 12, 7 + bob, 5, 1); c.restore();
    }
  }, 16);
}