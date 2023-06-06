import {
  DEFAULT_CLOCK_LATE_FACTOR,
  Schedule,
  ScheduleModes,
} from '@rudderstack/analytics-js-plugins/xhrQueue/localstorage-retry/Schedule';

describe('Schedule', () => {
  const clockTick = 500; // in ms
  let schedule: Schedule;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    schedule = new Schedule();
    schedule.now = () => +new window.Date();
  });

  afterEach(() => {
    schedule.resetClock();
    jest.setSystemTime(0);
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('run', () => {
    it('should call task after timeout', () => {
      const testCallback = jest.fn();
      schedule.run(testCallback, clockTick);
      jest.advanceTimersByTime(clockTick);
      expect(testCallback).toHaveBeenCalledTimes(1);
    });

    it('should call task ASAP after timeout even after long duration', () => {
      const testCallback = jest.fn();
      schedule.run(testCallback, clockTick, ScheduleModes.ASAP);
      jest.setSystemTime(clockTick * DEFAULT_CLOCK_LATE_FACTOR);
      jest.advanceTimersByTime(clockTick);
      expect(testCallback).toHaveBeenCalledTimes(1);
    });

    it('should not call ABANDON task if past duration factor', () => {
      const testCallback = jest.fn();
      schedule.run(testCallback, clockTick, ScheduleModes.ABANDON);
      // Fast forwards time but doesnt trigger timers
      jest.setSystemTime(schedule.now() + clockTick * DEFAULT_CLOCK_LATE_FACTOR);
      // Trigger timers here
      jest.advanceTimersByTime(clockTick);
      expect(testCallback).toHaveBeenCalledTimes(0);
      jest.advanceTimersByTime(clockTick);
      // Ensure task is not rescheduled
      expect(testCallback).toHaveBeenCalledTimes(0);
    });

    it('should call ABANDON task if running on time', () => {
      const testCallback = jest.fn();
      schedule.run(testCallback, clockTick, ScheduleModes.ABANDON);
      jest.advanceTimersByTime(clockTick);
      expect(testCallback).toHaveBeenCalledTimes(1);
    });

    it('should RESCHEDULE and call task if skipped', () => {
      const testCallback = jest.fn();
      schedule.run(testCallback, clockTick, ScheduleModes.RESCHEDULE);
      // Fast forwards time but doesnt trigger timers
      jest.setSystemTime(schedule.now() + clockTick * DEFAULT_CLOCK_LATE_FACTOR);
      // Trigger timers here
      jest.advanceTimersByTime(clockTick);
      expect(testCallback).toHaveBeenCalledTimes(0);
      jest.advanceTimersByTime(clockTick);
      // Ensure task is rescheduled
      expect(testCallback).toHaveBeenCalledTimes(1);
    });
  });
});
