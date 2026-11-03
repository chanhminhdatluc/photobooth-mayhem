import { ECONOMY } from "../config/economy";
import { SimulationClock } from "../core/clock";
import { DomainEventBus } from "../core/events";

export type ShopStatus = "closed" | "open" | "paused";
export interface DailyStatistics {
  day: number;
  elapsedMs: number;
  spawnRequests: number;
  revenueVnd: number;
  expensesVnd: number;
  profitVnd: number;
}
export interface BusinessState {
  schemaVersion: 1;
  shopStatus: ShopStatus;
  day: number;
  elapsedMs: number;
  cashVnd: number;
  currentDay: Omit<DailyStatistics, "day"> | null;
  lastDay: DailyStatistics | null;
}
export type BusinessCommand = { type: "OPEN_SHOP" } | { type: "PAUSE_SHOP" } | { type: "RESUME_SHOP" } | { type: "CLOSE_DAY" };

export interface BusinessOptions {
  startingCashVnd?: number;
  fixedStepMs?: number;
  maxFrameMs?: number;
  spawnIntervalMs?: number;
}

/** Deterministic, renderer-independent day and clock authority. Money changes only through real domain commands. */
export class BusinessSimulation {
  readonly events = new DomainEventBus();
  private readonly clock: SimulationClock;
  private readonly spawnIntervalMs: number;
  private spawnAccumulator = 0;
  private state: BusinessState;

  constructor(options: BusinessOptions = {}) {
    const cash = options.startingCashVnd ?? ECONOMY.startingCashVnd;
    if (!Number.isSafeInteger(cash) || cash < 0) throw new Error("Starting cash must be a non-negative safe integer VND amount");
    this.clock = new SimulationClock(options.fixedStepMs ?? 50, options.maxFrameMs ?? 250);
    this.spawnIntervalMs = options.spawnIntervalMs ?? 30_000;
    if (!Number.isSafeInteger(this.spawnIntervalMs) || this.spawnIntervalMs <= 0) throw new Error("Spawn interval must be a positive integer");
    this.state = { schemaVersion: 1, shopStatus: "closed", day: 0, elapsedMs: 0, cashVnd: cash, currentDay: null, lastDay: null };
  }

  view(): Readonly<BusinessState> { return structuredClone(this.state); }

  dispatch(command: BusinessCommand): boolean {
    switch (command.type) {
      case "OPEN_SHOP":
        if (this.state.shopStatus !== "closed") return false;
        this.clock.reset(); this.spawnAccumulator = 0;
        this.state = { ...this.state, shopStatus: "open", day: this.state.day + 1, elapsedMs: 0,
          currentDay: { elapsedMs: 0, spawnRequests: 0, revenueVnd: 0, expensesVnd: 0, profitVnd: 0 } };
        this.events.emit("DAY_STARTED", { day: this.state.day });
        return true;
      case "PAUSE_SHOP":
        if (this.state.shopStatus !== "open") return false;
        this.state = { ...this.state, shopStatus: "paused" }; this.clock.reset();
        this.events.emit("DAY_PAUSED", { day: this.state.day, elapsedMs: this.state.elapsedMs });
        return true;
      case "RESUME_SHOP":
        if (this.state.shopStatus !== "paused") return false;
        this.clock.reset(); this.state = { ...this.state, shopStatus: "open" };
        this.events.emit("DAY_RESUMED", { day: this.state.day, elapsedMs: this.state.elapsedMs });
        return true;
      case "CLOSE_DAY": {
        if (this.state.shopStatus === "closed" || !this.state.currentDay) return false;
        this.clock.reset(); this.spawnAccumulator = 0;
        const day: DailyStatistics = { ...this.state.currentDay, day: this.state.day,
          profitVnd: this.state.currentDay.revenueVnd - this.state.currentDay.expensesVnd };
        this.state = { ...this.state, shopStatus: "closed", currentDay: null, lastDay: day };
        this.events.emit("DAY_COMPLETED", day);
        return true;
      }
    }
  }

  /** Advance only while open; clock clamps suspension catch-up and emits deterministic spawn requests. */
  advance(realDeltaMs: number): number {
    if (this.state.shopStatus !== "open") return 0;
    return this.clock.advance(realDeltaMs, stepMs => {
      const current = this.state.currentDay;
      if (!current || this.state.shopStatus !== "open") return;
      const elapsedMs = current.elapsedMs + stepMs;
      let spawnRequests = current.spawnRequests;
      const spawnEvents: { request: number; elapsedMs: number }[] = [];
      this.spawnAccumulator += stepMs;
      while (this.spawnAccumulator >= this.spawnIntervalMs) {
        this.spawnAccumulator -= this.spawnIntervalMs;
        spawnRequests++;
        spawnEvents.push({ request: spawnRequests, elapsedMs });
      }
      this.state = { ...this.state, elapsedMs, currentDay: { ...current, elapsedMs, spawnRequests } };
      for (const event of spawnEvents) this.events.emit("CUSTOMER_SPAWN_REQUESTED", { day: this.state.day, ...event });
    });
  }
}