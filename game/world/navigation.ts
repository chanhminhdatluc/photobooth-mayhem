import type { Point } from "../isometric/projection";
import { same, walkable } from "./shop";
/** Breadth-first shortest path on the small uniform-cost grid. No diagonal corner cutting. */
export function findPath(start: Point, goal: Point, allowed: (p: Point) => boolean = walkable): Point[] | null {
  if (!allowed(start) || !allowed(goal)) return null;
  const queue: Point[][] = [[start]], visited = new Set([`${start.x},${start.y}`]);
  for (let index = 0; index < queue.length; index++) {
    const path = queue[index]!;
    const cell = path[path.length - 1]!;
    if (same(cell, goal)) return path.slice(1);
    for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]] as const) {
      const next = { x: cell.x + dx, y: cell.y + dy }, key = `${next.x},${next.y}`;
      if (allowed(next) && !visited.has(key)) { visited.add(key); queue.push([...path, next]); }
    }
  }
  return null;
}