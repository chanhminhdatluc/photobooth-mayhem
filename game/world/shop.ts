import type { Point } from "../isometric/projection";
export interface Furniture { id: string; kind: "booth" | "counter" | "plant"; position: Point; footprint: Point[] }
export const SHOP = {
  size: 8,
  entrance: { x: 3, y: 7 },
  spawn: { x: 3, y: 6 },
  boothAccess: { x: 3, y: 3 },
  speed: 2.5,
  furniture: [
    { id: "booth-1", kind: "booth", position: { x: 3, y: 2 }, footprint: [{ x: 3, y: 2 }] },
    { id: "counter-1", kind: "counter", position: { x: 5, y: 4 }, footprint: [{ x: 5, y: 4 }] },
    { id: "plant-1", kind: "plant", position: { x: 1, y: 2 }, footprint: [{ x: 1, y: 2 }] },
    { id: "plant-2", kind: "plant", position: { x: 6, y: 6 }, footprint: [{ x: 6, y: 6 }] },
  ] satisfies Furniture[],
};
export function same(a: Point, b: Point): boolean { return a.x === b.x && a.y === b.y; }
export function walkable(p: Point): boolean {
  if (!Number.isInteger(p.x) || !Number.isInteger(p.y)) return false;
  if (same(p, SHOP.entrance)) return true;
  return p.x > 0 && p.y > 0 && p.x < SHOP.size - 1 && p.y < SHOP.size - 1
    && !SHOP.furniture.some(item => item.footprint.some(cell => same(cell, p)));
}