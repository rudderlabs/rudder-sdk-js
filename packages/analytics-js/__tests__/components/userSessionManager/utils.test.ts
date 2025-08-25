import type { SessionInfo } from '@rudderstack/analytics-js-common/types/Session';
import {
  hasSessionExpired,
  generateSessionId,
  generateAutoTrackingSession,
  generateManualTrackingSession,
  MIN_SESSION_ID_LENGTH,
  isStorageTypeValidForStoringData,
  isCutOffTimeExceeded,
  generateAnonymousId,
  getCutOffExpirationTimestamp,
  getFinalResetOptions,
} from '../../../src/components/userSessionManager/utils';
import { defaultLogger } from '../../../src/services/Logger';

describe('Utilities: User session manager', () => {
  describe('hasSessionExpired', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(0);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return true if the current timestamp is less than the session expiry time', () => {
      const sessionInfo: SessionInfo = {
        autoTrack: true,
        timeout: 10 * 60 * 1000,
        expiresAt: Date.now() + 1000,
        id: 1234567890,
        sessionStart: undefined,
        cutOff: {
          enabled: false,
          duration: 12 * 60 * 60 * 1000,
        },
      };

      const outcome = hasSessionExpired(sessionInfo);
      expect(outcome).toEqual(false);
    });

    it('should return true if the current timestamp is greater than the session expiry time', () => {
      const sessionInfo: SessionInfo = {
        autoTrack: true,
        timeout: 10 * 60 * 1000,
        expiresAt: Date.now() - 1000,
        id: 1234567890,
        sessionStart: undefined,
        cutOff: {
          enabled: false,
          duration: 12 * 60 * 60 * 1000,
        },
      };

      const outcome = hasSessionExpired(sessionInfo);
      expect(outcome).toEqual(true);
    });

    it('should return true if the current timestamp is equal to the session expiry time', () => {
      const sessionInfo: SessionInfo = {
        autoTrack: true,
        timeout: 10 * 60 * 1000,
        expiresAt: Date.now(),
        cutOff: {
          enabled: false,
          duration: 12 * 60 * 60 * 1000,
        },
      };

      const outcome = hasSessionExpired(sessionInfo);
      expect(outcome).toEqual(true);
    });

    it('should return true if the session expiry timestamp is not set', () => {
      const sessionInfo: SessionInfo = {
        autoTrack: true,
        timeout: 10 * 60 * 1000,
        cutOff: {
          enabled: false,
          duration: 12 * 60 * 60 * 1000,
        },
      };

      const outcome = hasSessionExpired(sessionInfo);
      expect(outcome).toEqual(true);
    });

    it('should return true if the session has not expired but the current timestamp is greater than the cut off time', () => {
      const sessionInfo: SessionInfo = {
        autoTrack: true,
        timeout: 10 * 60 * 1000,
        expiresAt: Date.now() + 1000,
        cutOff: {
          enabled: true,
          duration: 12 * 60 * 60 * 1000,
          expiresAt: Date.now() - 500, // 500ms ago
        },
      };

      const outcome = hasSessionExpired(sessionInfo);
      expect(outcome).toEqual(true);
    });

    it('should return false if the session has not expired and the current timestamp is less than the cut off time', () => {
      const sessionInfo: SessionInfo = {
        autoTrack: true,
        timeout: 10 * 60 * 1000,
        expiresAt: Date.now() + 1000,
        cutOff: {
          enabled: true,
          duration: 12 * 60 * 60 * 1000,
          expiresAt: Date.now() + 5000,
        },
      };

      const outcome = hasSessionExpired(sessionInfo);
      expect(outcome).toEqual(false);
    });

    it('should return false if the session has not expired and the current timestamp is equal to the cut off time', () => {
      const sessionInfo: SessionInfo = {
        autoTrack: true,
        timeout: 10 * 60 * 1000,
        expiresAt: Date.now() + 1000,
        cutOff: {
          enabled: true,
          duration: 12 * 60 * 60 * 1000,
          expiresAt: Date.now(),
        },
      };

      const outcome = hasSessionExpired(sessionInfo);
      expect(outcome).toEqual(false);
    });

    it('should return false if the session has not expired and the cut off expiry timestamp is not set', () => {
      const sessionInfo: SessionInfo = {
        autoTrack: true,
        timeout: 10 * 60 * 1000,
        expiresAt: Date.now() + 1000,
        cutOff: {
          enabled: true,
          duration: 12 * 60 * 60 * 1000,
        },
      };

      const outcome = hasSessionExpired(sessionInfo);
      expect(outcome).toEqual(false);
    });

    it('should return true when both the session expiry and cut off expiry timestamps are less than the current timestamp', () => {
      const sessionInfo: SessionInfo = {
        autoTrack: true,
        timeout: 10 * 60 * 1000,
        expiresAt: Date.now() - 1000,
        cutOff: {
          enabled: true,
          duration: 12 * 60 * 60 * 1000,
          expiresAt: Date.now() - 2000,
        },
      };

      const outcome = hasSessionExpired(sessionInfo);
      expect(outcome).toEqual(true);
    });
  });

  describe('generateSessionId', () => {
    it('should return newly generated session id', () => {
      const outcome = generateSessionId();
      expect(typeof outcome).toBe('number');
      expect(outcome.toString().length).toEqual(13);
    });
  });

  describe('generateAutoTrackingSession', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(0);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return a freshly generated auto tracking session information object', () => {
      const outcome = generateAutoTrackingSession({
        autoTrack: true,
        timeout: 10 * 60 * 1000,
        cutOff: {
          enabled: false,
          duration: 12 * 60 * 60 * 1000,
        },
      });

      expect(outcome).toEqual({
        autoTrack: true,
        timeout: 10 * 60 * 1000,
        expiresAt: Date.now() + 10 * 60 * 1000,
        id: Date.now(),
        cutOff: {
          enabled: false,
          duration: 12 * 60 * 60 * 1000,
        },
      });
    });

    it('should return auto tracking session information with id and expires timestamp overridden if provided', () => {
      const outcome = generateAutoTrackingSession({
        autoTrack: true,
        timeout: 10 * 60 * 1000,
        id: 1234567890,
        expiresAt: Date.now() + 1000,
      });

      expect(outcome).toEqual({
        autoTrack: true,
        timeout: 10 * 60 * 1000,
        expiresAt: Date.now() + 10 * 60 * 1000,
        id: Date.now(),
      });
    });
  });

  describe('generateManualTrackingSession', () => {
    it('should return newly generated manual session', () => {
      const sessionId = 1234567890;
      const outcome = generateManualTrackingSession(sessionId, defaultLogger);
      expect(outcome).toEqual({
        manualTrack: true,
        id: sessionId,
        sessionStart: undefined,
      });
    });
    it('should return newly generated manual session if session id is not provided', () => {
      const outcome = generateManualTrackingSession(undefined, defaultLogger);
      expect(outcome).toEqual({
        manualTrack: true,
        id: expect.any(Number),
        sessionStart: undefined,
      });
    });
    it('should print a error message if the provided session id is not a number', () => {
      const sessionId = '1234567890';
      defaultLogger.warn = jest.fn();
      // @ts-expect-error testing invalid input
      generateManualTrackingSession(sessionId, defaultLogger);
      expect(defaultLogger.warn).toHaveBeenCalledWith(
        `UserSessionManager:: The provided session ID (${sessionId}) is either invalid, not a positive integer, or not at least "${MIN_SESSION_ID_LENGTH}" digits long. A new session ID will be auto-generated instead.`,
      );
    });
    it('should print a error message if the provided session id a decimal number', () => {
      const sessionId = 1234.5;
      defaultLogger.warn = jest.fn();
      generateManualTrackingSession(sessionId, defaultLogger);
      expect(defaultLogger.warn).toHaveBeenCalledWith(
        `UserSessionManager:: The provided session ID (${sessionId}) is either invalid, not a positive integer, or not at least "${MIN_SESSION_ID_LENGTH}" digits long. A new session ID will be auto-generated instead.`,
      );
    });
    it('should print a error message if the provided session id is not 10 digits', () => {
      const sessionId = 1234;
      defaultLogger.warn = jest.fn();
      generateManualTrackingSession(sessionId, defaultLogger);
      expect(defaultLogger.warn).toHaveBeenCalledWith(
        `UserSessionManager:: The provided session ID (${sessionId}) is either invalid, not a positive integer, or not at least "${MIN_SESSION_ID_LENGTH}" digits long. A new session ID will be auto-generated instead.`,
      );
    });
  });

  describe('isStorageTypeValidForStoringData', () => {
    it('should return true only for storage type cookie/LS/memory', () => {
      const outcome1 = isStorageTypeValidForStoringData('cookieStorage');
      const outcome2 = isStorageTypeValidForStoringData('localStorage');
      const outcome3 = isStorageTypeValidForStoringData('memoryStorage');
      const outcome4 = isStorageTypeValidForStoringData('sessionStorage');
      const outcome5 = isStorageTypeValidForStoringData('none');
      const outcome6 = isStorageTypeValidForStoringData('random');
      expect(outcome1).toEqual(true);
      expect(outcome2).toEqual(true);
      expect(outcome3).toEqual(true);
      expect(outcome4).toEqual(true);
      expect(outcome5).toEqual(false);
      expect(outcome6).toEqual(false);
    });
  });

  describe('isCutOffTimeExceeded', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(0);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return false if the cut off time is greater than the current timestamp', () => {
      const outcome = isCutOffTimeExceeded({
        id: 1234567890,
        expiresAt: Date.now() + 1,
        cutOff: { enabled: true, duration: 1000, expiresAt: Date.now() + 1000 },
      });

      expect(outcome).toEqual(false);
    });

    it('should return true if the cut off time is less than the current timestamp', () => {
      const outcome = isCutOffTimeExceeded({
        id: 1234567890,
        expiresAt: Date.now() + 1,
        cutOff: { enabled: true, duration: 1000, expiresAt: Date.now() - 1000 },
      });

      expect(outcome).toEqual(true);
    });

    it('should return false if the cut off time is equal to the current timestamp', () => {
      const outcome = isCutOffTimeExceeded({
        id: 1234567890,
        expiresAt: Date.now() + 1,
        cutOff: { enabled: true, duration: 1000, expiresAt: Date.now() },
      });

      expect(outcome).toEqual(false);
    });

    it('should return false if the cut off time is not set', () => {
      const outcome = isCutOffTimeExceeded({
        id: 1234567890,
        expiresAt: Date.now() + 1,
        cutOff: { enabled: true },
      });

      expect(outcome).toEqual(false);
    });

    it('should return false if cut off is not enabled', () => {
      const outcome = isCutOffTimeExceeded({
        id: 1234567890,
        expiresAt: Date.now() + 1,
        cutOff: { enabled: false },
      });

      expect(outcome).toEqual(false);
    });

    it('should return false if cut off is not defined', () => {
      const outcome = isCutOffTimeExceeded({
        id: 1234567890,
        expiresAt: Date.now() + 1,
      });

      expect(outcome).toEqual(false);
    });
  });

  describe('getCutOffExpirationTimestamp', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(0);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return undefined if cut off is not defined', () => {
      const outcome = getCutOffExpirationTimestamp(undefined);
      expect(outcome).toEqual(undefined);
    });

    it('should return undefined if cut off is not enabled', () => {
      const outcome = getCutOffExpirationTimestamp({ enabled: false });
      expect(outcome).toEqual(undefined);
    });

    it('should return the cut off expiry timestamp if it is set', () => {
      const outcome = getCutOffExpirationTimestamp({
        enabled: true,
        duration: 1000,
        expiresAt: 1234567890,
      });
      expect(outcome).toEqual(1234567890);
    });

    it('should calculate and return the cut off expiry timestamp based on the duration', () => {
      const outcome = getCutOffExpirationTimestamp({ enabled: true, duration: 1000 });
      expect(outcome).toEqual(Date.now() + 1000);
    });

    it('should return undefined if the cut off duration is not a valid number', () => {
      const outcome = getCutOffExpirationTimestamp({ enabled: true });
      expect(outcome).toEqual(undefined);
    });
  });

  describe('generateAnonymousId', () => {
    it('should return a newly generated anonymous id', () => {
      const outcome = generateAnonymousId();
      expect(outcome).toMatch(/^[\dA-Fa-f]{8}(?:-[\dA-Fa-f]{4}){3}-[\dA-Fa-f]{12}$/);
    });
  });

  describe('getFinalResetOptions', () => {
    const defaultOptions = {
      entries: {
        userId: true,
        userTraits: true,
        groupId: true,
        groupTraits: true,
        sessionInfo: true,
        authToken: true,
        anonymousId: false,
        initialReferrer: false,
        initialReferringDomain: false,
      },
    };

    const testCases = [
      {
        input: undefined,
        expected: defaultOptions,
      },
      {
        input: true,
        expected: {
          ...defaultOptions,
          entries: {
            ...defaultOptions.entries,
            anonymousId: true,
          },
        },
      },
      {
        input: {
          entries: {
            userId: false,
          },
        },
        expected: {
          ...defaultOptions,
          entries: {
            ...defaultOptions.entries,
            userId: false,
          },
        },
      },
      {
        input: {
          entries: {
            userId: false,
          },
        },
        expected: {
          ...defaultOptions,
          entries: {
            ...defaultOptions.entries,
            userId: false,
          },
        },
      },
      {
        input: {
          entries: {
            userId: false,
            userTraits: false,
          },
        },
        expected: {
          ...defaultOptions,
          entries: {
            ...defaultOptions.entries,
            userId: false,
            userTraits: false,
          },
        },
      },
      {
        input: {
          entries: {},
        },
        expected: defaultOptions,
      },
      {
        input: {},
        expected: defaultOptions,
      },
      {
        input: null,
        expected: defaultOptions,
      },
      {
        input: false,
        expected: defaultOptions,
      },
      {
        input: 'xyz',
        expected: defaultOptions,
      },
      {
        input: 123,
        expected: defaultOptions,
      },
      {
        input: {
          entries: null,
        },
        expected: defaultOptions,
      },
      {
        input: {
          entries: undefined,
        },
        expected: defaultOptions,
      },
      {
        input: {
          entries: {
            userId: 'xyz',
            abc: false,
            anonymousId: {},
          },
        },
        expected: {
          ...defaultOptions,
          entries: {
            ...defaultOptions.entries,
            userId: 'xyz',
            abc: false,
            anonymousId: {},
          },
        },
      },
    ];

    testCases.forEach(testCase => {
      it(`should return the correct reset options for ${JSON.stringify(testCase.input)}`, () => {
        const outcome = getFinalResetOptions(testCase.input);
        expect(outcome).toEqual(testCase.expected);
      });
    });
  });
});
