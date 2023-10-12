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
export declare const enum ScheduleModes {
  ASAP = 1,
  RESCHEDULE = 2,
  ABANDON = 3,
}
declare const DEFAULT_CLOCK_LATE_FACTOR = 2;
declare const DEFAULT_CLOCK: ScheduleClock;
declare class Schedule {
  tasks: Record<string, number>;
  nextId: number;
  clock: ScheduleClock;
  constructor();
  now(): number;
  run(task: () => any, timeout: number, mode?: ScheduleModes): string;
  handle(
    id: string,
    callback: () => any,
    timeout: number,
    mode: ScheduleModes,
  ): () => any | undefined;
  cancel(id: string): void;
  cancelAll(): void;
}
export { Schedule, DEFAULT_CLOCK, DEFAULT_CLOCK_LATE_FACTOR };
