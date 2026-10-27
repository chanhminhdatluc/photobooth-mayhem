import type { Point } from "../isometric/projection";
import { findPath } from "./navigation";
import { SHOP, same, walkable } from "./shop";

export type WorldMessage = "world.hint" | "world.blocked" | "world.walking" | "world.alreadyHere" | "world.routeBlocked" | "world.atBooth" | "world.arrived";
export interface WorldView { position: Point; moving: boolean; selected: boolean; atBooth: boolean; message: WorldMessage }
export type WorldCommand = { type: "INSPECT" } | { type: "DISMISS" } | { type: "RECENTER" };
export interface WorldBridge { publish: (view: WorldView) => void; command?: (command: WorldCommand) => void }

export class WorldModel {
  position: Point = { ...SHOP.spawn };
  private route: Point[] = [];
  selected = false;
  message: WorldMessage = "world.hint";

  move(goal: Point): boolean {
    // Finish the current edge before rerouting, preventing diagonal cuts through furniture.
    const next = this.route[0];
    const anchor = next ?? this.position;
    const path = findPath(anchor, goal);
    if (!path) { this.message = "world.blocked"; return false; }
    this.route = next ? [next, ...path] : path;
    this.message = this.route.length ? "world.walking" : "world.alreadyHere";
    return true;
  }
  inspect(): void { this.selected = true; this.move(SHOP.boothAccess); }
  update(seconds: number): void {
    if (!Number.isFinite(seconds) || seconds < 0) throw new Error("Invalid movement delta");
    let remaining = Math.min(seconds, 0.25) * SHOP.speed;
    while (remaining > 0 && this.route.length) {
      const target = this.route[0]!;
      if (!walkable(target)) { this.route = []; this.message = "world.routeBlocked"; break; }
      const dx = target.x - this.position.x, dy = target.y - this.position.y;
      const distance = Math.hypot(dx, dy);
      if (distance <= remaining) { this.position = { ...target }; this.route.shift(); remaining -= distance; }
      else { this.position.x += dx / distance * remaining; this.position.y += dy / distance * remaining; remaining = 0; }
      if (!this.route.length) this.message = this.selected && same(this.position, SHOP.boothAccess) ? "world.atBooth" : "world.arrived";
    }
  }
  view(): WorldView { return { position: { ...this.position }, moving: this.route.length > 0, selected: this.selected, atBooth: same(this.position, SHOP.boothAccess), message: this.message }; }
}