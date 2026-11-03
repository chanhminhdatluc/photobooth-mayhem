import { project } from "../isometric/projection";
import { SHOP } from "../world/shop";
export interface Bounds { left: number; top: number; right: number; bottom: number }
export function shopBounds(): Bounds {
  const points = [{ x: 0, y: 0 }, { x: SHOP.size - 1, y: 0 }, { x: 0, y: SHOP.size - 1 }, { x: SHOP.size - 1, y: SHOP.size - 1 }].map(project);
  return { left: Math.min(...points.map(p => p.x)) - 24, right: Math.max(...points.map(p => p.x)) + 24, top: Math.min(...points.map(p => p.y)) - 64, bottom: Math.max(...points.map(p => p.y)) + 26 };
}
export function fitCamera(width: number, height: number, bounds = shopBounds()) {
  // A readable slice of the room, not a miniature fitted diorama.
  const zoom = Math.max(2.5, Math.min(5, Math.max(width / 260, height / 230)));
  return { zoom, centerX: (bounds.left + bounds.right) / 2 - 30, centerY: (bounds.top + bounds.bottom) / 2 };
}
export function clampCameraCenter(x: number, y: number, width: number, height: number, zoom: number, bounds = shopBounds()) {
  const clamp = (value: number, low: number, high: number) => low > high ? (low + high) / 2 : Math.min(high, Math.max(low, value));
  // Small overscan lets edge tiles remain reachable without unlimited empty-space panning.
  const halfW = width / (2 * zoom), halfH = height / (2 * zoom), overscan = 30;
  return { x: clamp(x, bounds.left - overscan + halfW, bounds.right + overscan - halfW), y: clamp(y, bounds.top - overscan + halfH, bounds.bottom + overscan - halfH) };
}