import { getCurrentTimeFormatted, getFormattedTimestamp } from '../../src/utilities/timestamp';

describe('timestamp', () => {
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
