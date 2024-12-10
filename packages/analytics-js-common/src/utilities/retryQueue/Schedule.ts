export type ScheduleTaskHandler = (
  id: string,
  callback: () => any,
  timeout: number,
  mode: number,
) => any;

export type ScheduleClock = {
  setTimeout: (fn: ScheduleTaskHandler, ms: number) => number;
  clearTimeout: (id: number) => void;
  Date: DateConstructor;
  clockLateFactor: number;
};

export const ASAP = 1;
export const RESCHEDULE = 2;
export const ABANDON = 3;

export type ScheduleModes = 1 | 2 | 3;

const DEFAULT_CLOCK_LATE_FACTOR = 2;

const DEFAULT_CLOCK: ScheduleClock = {
  setTimeout(fn: ScheduleTaskHandler, ms: number): number {
    return (globalThis as typeof window).setTimeout(fn, ms);
  },
  clearTimeout(id: number) {
    return (globalThis as typeof window).clearTimeout(id);
  },
  Date: (globalThis as typeof window).Date,
  clockLateFactor: DEFAULT_CLOCK_LATE_FACTOR,
};

class Schedule {
  tasks: Record<string, number>;
  nextId;
  clock: ScheduleClock;

  constructor() {
    this.tasks = {};
    this.nextId = 1;
    this.clock = DEFAULT_CLOCK;
  }

  now(): number {
    return +new this.clock.Date();
  }

  run(task: () => any, timeout: number, mode?: number): string {
    const id = this.nextId.toString();

    this.tasks[id] = this.clock.setTimeout(this.handle(id, task, timeout, mode ?? ASAP), timeout);
    this.nextId += 1;
    return id;
  }

  handle(id: string, callback: () => any, timeout: number, mode: number): () => any {
    const start = this.now();

    return () => {
      delete this.tasks[id];
      const elapsedTimeoutTime = start + timeout * this.clock.clockLateFactor;
      const currentTime = this.now();
      const notCompletedOrTimedOut = mode >= RESCHEDULE && elapsedTimeoutTime < currentTime;

      if (notCompletedOrTimedOut) {
        if (mode === RESCHEDULE) {
          this.run(callback, timeout, mode);
        }

        return;
      }

      callback();
    };
  }

  cancel(id: string) {
    if (this.tasks[id]) {
      this.clock.clearTimeout(this.tasks[id]);
      delete this.tasks[id];
    }
  }

  cancelAll() {
    Object.values(this.tasks).forEach(this.clock.clearTimeout);
    this.tasks = {};
  }
}

export { Schedule, DEFAULT_CLOCK, DEFAULT_CLOCK_LATE_FACTOR };
