export var ScheduleModes;
(function (ScheduleModes) {
  ScheduleModes[(ScheduleModes['ASAP'] = 1)] = 'ASAP';
  ScheduleModes[(ScheduleModes['RESCHEDULE'] = 2)] = 'RESCHEDULE';
  ScheduleModes[(ScheduleModes['ABANDON'] = 3)] = 'ABANDON';
})(ScheduleModes || (ScheduleModes = {}));
const DEFAULT_CLOCK_LATE_FACTOR = 2;
const DEFAULT_CLOCK = {
  setTimeout(fn, ms) {
    return globalThis.setTimeout(fn, ms);
  },
  clearTimeout(id) {
    return globalThis.clearTimeout(id);
  },
  Date: globalThis.Date,
  clockLateFactor: DEFAULT_CLOCK_LATE_FACTOR,
};
class Schedule {
  constructor() {
    this.tasks = {};
    this.nextId = 1;
    this.clock = DEFAULT_CLOCK;
  }
  now() {
    return +new this.clock.Date();
  }
  run(task, timeout, mode) {
    const id = (this.nextId + 1).toString();
    this.tasks[id] = this.clock.setTimeout(
      this.handle(id, task, timeout, mode || ScheduleModes.ASAP),
      timeout,
    );
    return id;
  }
  handle(id, callback, timeout, mode) {
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
  cancel(id) {
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
