/** Serializable xorshift32 state. Never use for security or identifiers. */
export class SeededRandom {
  private state: number;

  constructor(seed: number) {
    if (!Number.isInteger(seed)) throw new Error("Seed must be an integer");
    this.state = (seed >>> 0) || 1;
  }

  next(): number {
    let value = this.state;
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    this.state = value >>> 0;
    return this.state / 4294967296;
  }

  snapshot(): number { return this.state; }
}