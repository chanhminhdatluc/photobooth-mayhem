export interface Point { x: number; y: number }
export const ISO = { width: 40, height: 20, origin: { x: 180, y: 125 } } as const;
export function project(p: Point): Point {
  return { x: ISO.origin.x + (p.x - p.y) * ISO.width / 2, y: ISO.origin.y + (p.x + p.y) * ISO.height / 2 };
}
export function unproject(p: Point): Point {
  const x = (p.x - ISO.origin.x) / (ISO.width / 2), y = (p.y - ISO.origin.y) / (ISO.height / 2);
  return { x: (x + y) / 2, y: (y - x) / 2 };
}
export function tileAt(p: Point): Point { const grid = unproject(p); return { x: Math.round(grid.x), y: Math.round(grid.y) }; }
/** Objects and actors share a ground-contact baseline; never sort by sprite top. */
export function depth(p: Point): number { return project(p).y; }