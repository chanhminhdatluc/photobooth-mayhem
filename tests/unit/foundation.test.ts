import { describe, expect, it } from "vitest";
import { SeededRandom } from "../../game/core/random";
import { SimulationClock } from "../../game/core/clock";

describe("seeded randomness", () => {
  it("replays the same seed deterministically", () => {
    const a = new SeededRandom(42), b = new SeededRandom(42);
    for (let i = 0; i < 100; i++) expect(a.next()).toBe(b.next());
  });
  it("restores its serialized state", () => {
    const a = new SeededRandom(19);
    a.next();
    const b = new SeededRandom(a.snapshot());
    expect(a.next()).toBe(b.next());
  });
  it("handles zero and bounds all results", () => {
    const random = new SeededRandom(0);
    for (let i = 0; i < 1000; i++) {
      const value = random.next();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
  it("rejects invalid seeds", () => expect(() => new SeededRandom(NaN)).toThrow());
});

describe("fixed-step clock", () => {
  it("retains partial time and advances in fixed increments", () => {
    const clock = new SimulationClock();
    const ticks: number[] = [];
    expect(clock.advance(49, d => ticks.push(d))).toBe(0);
    expect(clock.advance(51, d => ticks.push(d))).toBe(2);
    expect(ticks).toEqual([50, 50]);
  });
  it("bounds catch-up after browser suspension", () => {
    expect(new SimulationClock().advance(60000, () => {})).toBe(5);
  });
  it("resets partial time on pause", () => {
    const clock = new SimulationClock();
    clock.advance(49, () => {});
    clock.reset();
    expect(clock.advance(1, () => {})).toBe(0);
  });
  it("rejects invalid inputs", () => {
    expect(() => new SimulationClock(0)).toThrow();
    expect(() => new SimulationClock().advance(-1, () => {})).toThrow();
  });
});