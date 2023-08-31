import {
  hasSessionExpired,
  generateSessionId,
  generateAutoTrackingSession,
  generateManualTrackingSession,
  MIN_SESSION_ID_LENGTH,
  isStorageTypeValidForStoringData,
} from '../../../src/components/userSessionManager/utils';
import { defaultLogger } from '../../../src/services/Logger';

describe('Utility: User session manager', () => {
  describe('hasSessionExpired:', () => {
    it('should return true for valid session', () => {
      const outcome = hasSessionExpired(Date.now() + 1000);
      expect(outcome).toEqual(false);
    });
    it('hasSessionExpired: should return false for valid session', () => {
      const outcome = hasSessionExpired(Date.now() - 1000);
      expect(outcome).toEqual(true);
    });
  });

  describe('generateSessionId:', () => {
    it('should return newly generated session id', () => {
      const outcome = generateSessionId();
      expect(typeof outcome).toBe('number');
      expect(outcome.toString().length).toEqual(13);
    });
  });
  describe('generateAutoTrackingSession:', () => {
    it('should return newly generated auto tracking session', () => {
      const timeout = 10 * 60 * 1000;
      const outcome = generateAutoTrackingSession(timeout);
      expect(outcome).toEqual({
        autoTrack: true,
        timeout,
        expiresAt: expect.any(Number),
        id: expect.any(Number),
        sessionStart: undefined,
      });
    });
  });

  describe('generateManualTrackingSession:', () => {
    it('should return newly generated manual session', () => {
      const sessionId = 1234567890;
      const outcome = generateManualTrackingSession(sessionId);
      expect(outcome).toEqual({
        manualTrack: true,
        id: sessionId,
        sessionStart: undefined,
      });
    });
    it('should return newly generated manual session if session id is not provided', () => {
      const outcome = generateManualTrackingSession();
      expect(outcome).toEqual({
        manualTrack: true,
        id: expect.any(Number),
        sessionStart: undefined,
      });
    });
    it('should print a error message if the provided session id is not a number', () => {
      const sessionId = '1234567890';
      defaultLogger.warn = jest.fn();
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
  describe('isStorageTypeValidForStoringData:', () => {
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
      expect(outcome4).toEqual(false);
      expect(outcome5).toEqual(false);
      expect(outcome6).toEqual(false);
    });
  });
});
