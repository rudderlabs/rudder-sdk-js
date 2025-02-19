import { isErrRetryable } from '../../src/utilities/http';

describe('utilities - http', () => {
  describe('isErrRetryable', () => {
    const testCases: [number, boolean][] = [
      // 2xx status codes - should be retryable
      [200, true],
      [201, true],
      [204, true],

      // 3xx status codes - should be retryable
      [301, true],
      [302, true],
      [304, true],

      // 4xx status codes - should NOT be retryable (except 429)
      [400, false],
      [401, false],
      [403, false],
      [404, false],
      [422, false],
      [429, true], // Too Many Requests - should be retryable
      [451, false],

      // 5xx status codes - should be retryable
      [500, true],
      [501, true],
      [502, true],
      [503, true],
      [504, true],
    ];

    it.each(testCases)('should return %p when status code is %p', (statusCode, expected) => {
      expect(isErrRetryable(statusCode)).toBe(expected);
    });

    it('should handle edge cases', () => {
      // Invalid status codes should follow the same logic
      expect(isErrRetryable(0)).toBe(true);
      expect(isErrRetryable(-1)).toBe(true);
      expect(isErrRetryable(600)).toBe(true);
    });
  });
});
