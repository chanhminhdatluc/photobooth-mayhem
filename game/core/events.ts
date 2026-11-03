export interface DomainEventMap {
  DAY_STARTED: { day: number };
  DAY_PAUSED: { day: number; elapsedMs: number };
  DAY_RESUMED: { day: number; elapsedMs: number };
  DAY_COMPLETED: { day: number; elapsedMs: number; spawnRequests: number; revenueVnd: number; expensesVnd: number; profitVnd: number };
  CUSTOMER_SPAWN_REQUESTED: { day: number; request: number; elapsedMs: number };
}
export type DomainEventType = keyof DomainEventMap;
export type DomainEvent = { [K in DomainEventType]: { type: K; payload: DomainEventMap[K] } }[DomainEventType];
export type DomainEventListener = (event: DomainEvent) => void;

/** Small synchronous event bus. Listener snapshots make unsubscribe-during-dispatch safe. */
export class DomainEventBus {
  private listeners = new Set<DomainEventListener>();
  subscribe(listener: DomainEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  emit<K extends DomainEventType>(type: K, payload: DomainEventMap[K]): void {
    const event = { type, payload } as DomainEvent;
    for (const listener of [...this.listeners]) listener(event);
  }
  clear(): void { this.listeners.clear(); }
}