export type ScheduleTaskHandler = (
  id: string,
  callback: () => any,
  timeout: number,
  mode: ScheduleModes,
) => any;

export type ScheduleClock = {
  setTimeout: (fn: ScheduleTaskHandler, ms: number) => number;
  clearTimeout: (id: number) => void;
  Date: DateConstructor;
  clockLateFactor: number;
};

export const enum ScheduleModes {
  ASAP = 1,
  RESCHEDULE = 2,
  ABANDON = 3,
}

const DEFAULT_CLOCK_LATE_FACTOR = 2;

const DEFAULT_CLOCK: ScheduleClock = {
  setTimeout(fn: ScheduleTaskHandler, ms: number): number {
    return (globalThis as typeof window).setTimeout(fn, ms);
  },
  clearTimeout(id: number) {
    return (globalThis as typeof window).clearTimeout(id);
  },
  Date: globalThis.Date,
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

  run(task: () => any, timeout: number, mode?: ScheduleModes): string {
    if (this.nextId === Number.MAX_SAFE_INTEGER) {
      this.nextId = 1;
    }

    const id = (this.nextId++).toString();

    this.tasks[id] = this.clock.setTimeout(
      this.handle(id, task, timeout, mode || ScheduleModes.ASAP),
      timeout,
    );

    return id;
  }

  handle(
    id: string,
    callback: () => any,
    timeout: number,
    mode: ScheduleModes,
  ): () => any | undefined {
    const start = this.now();

    return () => {
      delete this.tasks[id];
      const elapsedTimeoutTime =
        start + timeout * (this.clock.clockLateFactor || DEFAULT_CLOCK_LATE_FACTOR);
      const currentTime = this.now();
      const notCompletedOrTimedOut =
        mode >= ScheduleModes.RESCHEDULE && elapsedTimeoutTime < currentTime;

      if (notCompletedOrTimedOut) {
        if (mode === ScheduleModes.RESCHEDULE) {
          this.run(callback, timeout, mode);
        }

        return undefined;
      }

      return callback();
    };
  }

  cancel(id: string) {
    if (this.tasks[id]) {
      this.clock.clearTimeout(this.tasks[id] as number);
      delete this.tasks[id];
    }
  }

  cancelAll() {
    Object.values(this.tasks).forEach(this.clock.clearTimeout);
    this.tasks = {};
  }
}

export { Schedule, DEFAULT_CLOCK, DEFAULT_CLOCK_LATE_FACTOR };
