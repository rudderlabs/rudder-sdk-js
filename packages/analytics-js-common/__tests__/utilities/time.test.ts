import {
  getCurrentTimeFormatted,
  getFormattedTimestamp,
  getTimezone,
  wait,
} from '../../src/utilities/time';

describe('time', () => {
  describe('wait', () => {
    it('should return a promise that resolves after the specified time', async () => {
      const time = 1000;
      const startTime = Date.now();

      await wait(time);

      const endTime = Date.now();

      expect(endTime - startTime).toBeGreaterThanOrEqual(time);
    });

    it('should return a promise that resolves immediately even if the time is 0', async () => {
      const time = 0;
      const startTime = Date.now();

      await wait(time);

      const endTime = Date.now();

      expect(endTime - startTime).toBeGreaterThanOrEqual(time);
    });

    it('should return a promise that resolves immediately even if the time is negative', async () => {
      const time = -1000;
      const startTime = Date.now();

      await wait(time);

      const endTime = Date.now();

      expect(endTime - startTime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getTimezone', () => {
    it('should return timezone of the user', () => {
      const timezone = getTimezone();
      expect(typeof timezone).toBe('string');
      expect(timezone.startsWith('GMT')).toBe(true);
    });

    it('should return NA if timezone is not found', () => {
      jest.spyOn(Date.prototype, 'toString').mockImplementation(() => '');

      const timezone = getTimezone();
      expect(timezone).toBe('NA');

      jest.spyOn(Date.prototype, 'toString').mockRestore();
    });
  });

  describe('getFormattedTimestamp', () => {
    it('should return the formatted timestamp', () => {
      // Arrange
      const date = new Date('2021-01-01T00:00:00Z');

      // Act
      const result = getFormattedTimestamp(date);

      // Assert
      expect(result).toBe('2021-01-01T00:00:00.000Z');
    });
  });

  describe('getCurrentTimeFormatted', () => {
    it('should return the current formatted timestamp', () => {
      // Arrange
      const date = new Date('2021-01-01T00:00:00Z');
      const dateSpy = jest.spyOn(global, 'Date').mockImplementationOnce(() => date);

      // Act
      const result = getCurrentTimeFormatted();

      // Assert
      expect(result).toBe('2021-01-01T00:00:00.000Z');

      dateSpy.mockRestore();
    });
  });
});
