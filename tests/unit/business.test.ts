import { describe, expect, it } from "vitest";
import { BusinessSimulation } from "../../game/business/BusinessSimulation";

describe("business day simulation", () => {
  it("enforces valid lifecycle transitions and publishes typed events", () => {
    const sim = new BusinessSimulation({ startingCashVnd: 1234 });
    const events: string[] = [];
    sim.events.subscribe(event => events.push(event.type));
    expect(sim.dispatch({ type: "PAUSE_SHOP" })).toBe(false);
    expect(sim.dispatch({ type: "OPEN_SHOP" })).toBe(true);
    expect(sim.dispatch({ type: "OPEN_SHOP" })).toBe(false);
    expect(sim.dispatch({ type: "PAUSE_SHOP" })).toBe(true);
    expect(sim.dispatch({ type: "PAUSE_SHOP" })).toBe(false);
    expect(sim.dispatch({ type: "RESUME_SHOP" })).toBe(true);
    expect(sim.dispatch({ type: "CLOSE_DAY" })).toBe(true);
    expect(events).toEqual(["DAY_STARTED", "DAY_PAUSED", "DAY_RESUMED", "DAY_COMPLETED"]);
  });
  it("stops while paused and resets partial time instead of leaking it through resume", () => {
    const sim = new BusinessSimulation({ fixedStepMs: 50, spawnIntervalMs: 100 });
    sim.dispatch({ type: "OPEN_SHOP" }); sim.advance(49);
    sim.dispatch({ type: "PAUSE_SHOP" }); sim.advance(1000);
    expect(sim.view().elapsedMs).toBe(0);
    sim.dispatch({ type: "RESUME_SHOP" }); sim.advance(49);
    expect(sim.view().elapsedMs).toBe(0);
    sim.advance(51);
    expect(sim.view().elapsedMs).toBe(100);
  });
  it("emits deterministic timed spawn requests only while open", () => {
    const sim = new BusinessSimulation({ spawnIntervalMs: 100 });
    const requests: number[] = [];
    sim.events.subscribe(event => { if (event.type === "CUSTOMER_SPAWN_REQUESTED") requests.push(event.payload.request); });
    sim.advance(1000); sim.dispatch({ type: "OPEN_SHOP" }); sim.advance(250);
    expect(requests).toEqual([1, 2]);
    expect(sim.view().currentDay?.spawnRequests).toBe(2);
  });
  it("closes valid zero-transaction stats and carries persistent cash across days", () => {
    const sim = new BusinessSimulation({ startingCashVnd: 777 });
    sim.dispatch({ type: "OPEN_SHOP" }); sim.advance(250);
    sim.dispatch({ type: "CLOSE_DAY" });
    expect(sim.view().lastDay).toEqual({ day: 1, elapsedMs: 250, spawnRequests: 0, revenueVnd: 0, expensesVnd: 0, profitVnd: 0 });
    sim.dispatch({ type: "OPEN_SHOP" });
    expect(sim.view()).toMatchObject({ day: 2, cashVnd: 777, shopStatus: "open", currentDay: { revenueVnd: 0 } });
  });
  it("reports only financial transactions that actually occurred", () => {
    const sim = new BusinessSimulation();
    sim.dispatch({ type: "OPEN_SHOP" }); sim.dispatch({ type: "CLOSE_DAY" });
    expect(sim.view().lastDay?.revenueVnd).toBe(0);
    expect(() => new BusinessSimulation({ startingCashVnd: -1 })).toThrow();
  });
  it("clamps suspension catchup and does not retain a second stepping timer", () => {
    const sim = new BusinessSimulation({ fixedStepMs: 50, maxFrameMs: 250 });
    sim.dispatch({ type: "OPEN_SHOP" });
    expect(sim.advance(60_000)).toBe(5);
    expect(sim.view().elapsedMs).toBe(250);
    sim.dispatch({ type: "CLOSE_DAY" });
    sim.advance(60_000);
    expect(sim.view().elapsedMs).toBe(250);
  });
});