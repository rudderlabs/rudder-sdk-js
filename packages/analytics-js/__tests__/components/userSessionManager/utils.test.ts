import {
  hasSessionExpired,
  generateSessionId,
  generateAutoTrackingSession,
  generateManualTrackingSession,
  MIN_SESSION_ID_LENGTH,
} from '@rudderstack/analytics-js/components/userSessionManager/utils';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';

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
        `[SessionTracking]:: SDK will auto-generate the "sessionId" as the provided input is not a positive integer`,
      );
    });
    it('should print a error message if the provided session id a decimal number', () => {
      const sessionId = 1234.5;
      defaultLogger.warn = jest.fn();
      generateManualTrackingSession(sessionId, defaultLogger);
      expect(defaultLogger.warn).toHaveBeenCalledWith(
        `[SessionTracking]:: SDK will auto-generate the "sessionId" as the provided input is not a positive integer`,
      );
    });
    it('should print a error message if the provided session id is not 10 digits', () => {
      const sessionId = 1234;
      defaultLogger.warn = jest.fn();
      generateManualTrackingSession(sessionId, defaultLogger);
      expect(defaultLogger.warn).toHaveBeenCalledWith(
        `[SessionTracking]:: SDK will auto-generate the "sessionId" as the input is not at least "${MIN_SESSION_ID_LENGTH}" digits long`,
      );
    });
  });
});
