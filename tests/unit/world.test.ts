import { describe, expect, it } from "vitest";
import { depth, project, tileAt, unproject } from "../../game/isometric/projection";
import { findPath } from "../../game/world/navigation";
import { SHOP, walkable } from "../../game/world/shop";
import { WorldModel } from "../../game/world/WorldModel";

describe("isometric world", () => {
  it("round-trips fractional grid positions", () => { for (const p of [{ x: 0, y: 0 }, { x: 2.5, y: 6.25 }, { x: -1, y: 4 }]) expect(unproject(project(p))).toEqual(p); });
  it("selects the nearest diamond and orders ground baselines", () => { expect(tileAt(project({ x: 2.1, y: 3.2 }))).toEqual({ x: 2, y: 3 }); expect(depth({ x: 3, y: 3 })).toBeGreaterThan(depth({ x: 3, y: 2 })); });
  it("blocks boundaries and furniture but permits the entrance", () => {
    expect(walkable(SHOP.entrance)).toBe(true);
    for (const p of [{ x: -1, y: 3 }, { x: 0, y: 2 }, { x: 8, y: 3 }, { x: 3, y: 2 }, { x: 5, y: 4 }]) expect(walkable(p)).toBe(false);
  });
  it("routes around furniture with cardinal steps", () => {
    const start = { x: 2, y: 2 }, goal = { x: 4, y: 2 }, path = findPath(start, goal)!;
    expect(path.at(-1)).toEqual(goal);
    let previous = start;
    for (const p of path) { expect(walkable(p)).toBe(true); expect(Math.abs(p.x - previous.x) + Math.abs(p.y - previous.y)).toBe(1); previous = p; }
  });
  it("handles blocked, unreachable and identical destinations", () => {
    expect(findPath(SHOP.spawn, { x: 3, y: 2 })).toBeNull();
    expect(findPath(SHOP.spawn, SHOP.spawn)).toEqual([]);
    expect(findPath({ x: 1, y: 1 }, { x: 3, y: 1 }, p => p.y === 1 && (p.x === 1 || p.x === 3))).toBeNull();
  });
  it("moves visibly, reroutes without cutting corners, and reaches the booth", () => {
    const world = new WorldModel(); world.move({ x: 2, y: 6 }); world.update(0.1);
    expect(world.position.x).toBe(2.75);
    world.inspect();
    for (let i = 0; i < 100; i++) { world.update(0.05); expect(Number.isInteger(world.position.x) || Number.isInteger(world.position.y)).toBe(true); }
    expect(world.view()).toMatchObject({ moving: false, selected: true, atBooth: true });
  });
  it("rejects blocked requests without teleporting and bounds suspension catchup", () => {
    const world = new WorldModel(); expect(world.move({ x: 0, y: 0 })).toBe(false); expect(world.position).toEqual(SHOP.spawn);
    world.inspect(); world.update(100); expect(world.view().moving).toBe(true);
    expect(() => world.update(NaN)).toThrow();
  });
});