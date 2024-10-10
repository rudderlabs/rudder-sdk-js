import {
  ABANDON,
  ASAP,
  DEFAULT_CLOCK_LATE_FACTOR,
  RESCHEDULE,
  Schedule,
} from '../../../src/utilities/retryQueue/Schedule';

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
    jest.setSystemTime(0);
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('run', () => {
    const testCallback = jest.fn();

    beforeEach(() => {
      testCallback.mockClear();
    });

    it('should call task after timeout', () => {
      schedule.run(testCallback, clockTick);
      jest.advanceTimersByTime(clockTick);
      expect(testCallback).toHaveBeenCalledTimes(1);
    });

    it('should call ASAP task after timeout even after long duration', () => {
      schedule.run(testCallback, clockTick, ASAP);

      // Fast forward the time
      jest.setSystemTime(schedule.now() + clockTick * DEFAULT_CLOCK_LATE_FACTOR);

      // Trigger timers here
      jest.advanceTimersByTime(clockTick);

      expect(testCallback).toHaveBeenCalledTimes(1);
    });

    it('should not call ABANDON task if past duration factor', () => {
      schedule.run(testCallback, clockTick, ABANDON);

      // Fast forward the time
      jest.setSystemTime(schedule.now() + clockTick * DEFAULT_CLOCK_LATE_FACTOR);

      // Trigger timers here
      jest.advanceTimersByTime(clockTick);

      expect(testCallback).toHaveBeenCalledTimes(0);

      // Ensure task is not rescheduled
      jest.advanceTimersByTime(clockTick);
      expect(testCallback).toHaveBeenCalledTimes(0);
    });

    it('should call ABANDON task if running on time', () => {
      schedule.run(testCallback, clockTick, ABANDON);
      jest.advanceTimersByTime(clockTick);
      expect(testCallback).toHaveBeenCalledTimes(1);
    });

    it('should reschedule and call RESCHEDULE task if skipped', () => {
      schedule.run(testCallback, clockTick, RESCHEDULE);

      // Fast forward the time
      jest.setSystemTime(schedule.now() + clockTick * DEFAULT_CLOCK_LATE_FACTOR);

      // Trigger timers here
      jest.advanceTimersByTime(clockTick);

      expect(testCallback).toHaveBeenCalledTimes(0);

      // Ensure task is rescheduled
      jest.advanceTimersByTime(clockTick);
      expect(testCallback).toHaveBeenCalledTimes(1);
    });

    it('should call RESCHEDULE task if running on time', () => {
      schedule.run(testCallback, clockTick, RESCHEDULE);
      jest.advanceTimersByTime(clockTick);
      expect(testCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('now', () => {
    it('should return current time', () => {
      jest.setSystemTime(100);
      const now = schedule.now();

      expect(now).toBe(100);
    });
  });

  describe('cancel', () => {
    const testCallback = jest.fn();

    beforeEach(() => {
      testCallback.mockClear();
    });

    it('should cancel the task', () => {
      const id = schedule.run(testCallback, clockTick);

      schedule.cancel(id);
      jest.advanceTimersByTime(clockTick);

      expect(testCallback).toHaveBeenCalledTimes(0);
    });

    it('should not cancel the task if already executed', () => {
      const id = schedule.run(testCallback, clockTick);
      jest.advanceTimersByTime(clockTick);

      schedule.cancel(id);
      expect(testCallback).toHaveBeenCalledTimes(1);
    });

    it('should not cancel the task if already cancelled', () => {
      const id = schedule.run(testCallback, clockTick);

      schedule.cancel(id);
      schedule.cancel(id);
      jest.advanceTimersByTime(clockTick);

      expect(testCallback).toHaveBeenCalledTimes(0);
    });

    it('should not throw error if task is not found', () => {
      expect(() => schedule.cancel('invalid-id')).not.toThrow();
    });
  });

  describe('cancelAll', () => {
    const testCallback = jest.fn();

    beforeEach(() => {
      testCallback.mockClear();
    });

    it('should cancel all tasks', () => {
      schedule.run(testCallback, clockTick);
      schedule.run(testCallback, clockTick);

      schedule.cancelAll();
      jest.advanceTimersByTime(clockTick);

      expect(testCallback).toHaveBeenCalledTimes(0);

      // Ensure tasks are not rescheduled
      jest.advanceTimersByTime(clockTick);
      expect(testCallback).toHaveBeenCalledTimes(0);
    });

    it('should not throw error if no tasks are found', () => {
      expect(() => schedule.cancelAll()).not.toThrow();
    });
  });
});
