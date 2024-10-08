import type { IHttpClientError, ResponseDetails } from '../../src/types/HttpClient';
import { isErrRetryable } from '../../src/utilities/http';

describe('http utilities', () => {
  describe('isErrRetryable', () => {
    it('should return true for 429 status code', () => {
      expect(
        isErrRetryable({ error: { status: 429 } as IHttpClientError } as ResponseDetails),
      ).toBe(true);
    });

    it('should return true for 500 status code', () => {
      expect(
        isErrRetryable({ error: { status: 500 } as IHttpClientError } as ResponseDetails),
      ).toBe(true);
    });

    it('should return true for 5xx status code', () => {
      expect(
        isErrRetryable({ error: { status: 524 } as IHttpClientError } as ResponseDetails),
      ).toBe(true);
    });

    it('should return true for 599 status code', () => {
      expect(
        isErrRetryable({ error: { status: 599 } as IHttpClientError } as ResponseDetails),
      ).toBe(true);
    });

    it('should return false for 400 status code', () => {
      expect(
        isErrRetryable({ error: { status: 400 } as IHttpClientError } as ResponseDetails),
      ).toBe(false);
    });

    it('should return false for 600 status code', () => {
      expect(
        isErrRetryable({ error: { status: 600 } as IHttpClientError } as ResponseDetails),
      ).toBe(false);
    });

    it('should return false for 0 status code', () => {
      expect(isErrRetryable({ error: { status: 0 } as IHttpClientError } as ResponseDetails)).toBe(
        false,
      );
    });

    it('should return false for undefined status code', () => {
      expect(isErrRetryable({ error: {} as IHttpClientError } as ResponseDetails)).toBe(false);
    });

    it('should return false for undefined error', () => {
      expect(isErrRetryable({} as ResponseDetails)).toBe(false);
    });
  });
});
