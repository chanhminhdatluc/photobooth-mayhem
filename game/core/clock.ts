/** Render-independent fixed-step accumulator. Discards long suspension gaps. */
export class SimulationClock {
  private accumulator = 0;

  constructor(readonly stepMs = 50, readonly maxFrameMs = 250) {
    if (!Number.isFinite(stepMs) || stepMs <= 0 || !Number.isFinite(maxFrameMs) || maxFrameMs < stepMs) {
      throw new Error("Invalid clock configuration");
    }
  }

  advance(deltaMs: number, step: (deltaMs: number) => void): number {
    if (!Number.isFinite(deltaMs) || deltaMs < 0) throw new Error("Invalid elapsed time");
    this.accumulator += Math.min(deltaMs, this.maxFrameMs);
    let steps = 0;
    while (this.accumulator >= this.stepMs) {
      this.accumulator -= this.stepMs;
      step(this.stepMs);
      steps++;
    }
    return steps;
  }

  reset(): void { this.accumulator = 0; }
}