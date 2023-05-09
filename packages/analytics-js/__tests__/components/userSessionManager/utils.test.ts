import {
  hasValidValue,
  isValidSession,
  generateSessionId,
  generateAutoTrackingSession,
  generateManualTrackingSession,
} from '@rudderstack/analytics-js/components/userSessionManager/utils';
import { DEFAULT_SESSION_TIMEOUT } from '@rudderstack/analytics-js/constants/timeouts';
import { state, resetState } from '@rudderstack/analytics-js/state';

describe('Utility: User session manager', () => {
  const validObj = {
    key1: 'value',
    key2: 1234567,
  };

  beforeEach(() => {
    resetState();
  });

  it('hasValidValue: should return true for valid object with data', () => {
    const outcome = hasValidValue(validObj);
    expect(outcome).toEqual(true);
  });
  it('hasValidValue: should return false for undefined/null or empty object', () => {
    const outcome1 = hasValidValue(undefined);
    const outcome2 = hasValidValue(null);
    const outcome3 = hasValidValue({});
    expect(outcome1).toEqual(false);
    expect(outcome2).toEqual(false);
    expect(outcome3).toEqual(false);
  });
  it('isValidSession: should return true for valid session', () => {
    state.session.sessionInfo.value = {
      autoTrack: true,
      timeout: 10 * 60 * 1000,
      expiresAt: Date.now() + 30 * 1000,
      id: 1683613729115,
      sessionStart: false,
    };
    const outcome = isValidSession(Date.now());
    expect(outcome).toEqual(true);
  });
  it('isValidSession: should return false for valid session', () => {
    state.session.sessionInfo.value = {
      autoTrack: true,
      timeout: 10 * 60 * 1000,
      expiresAt: Date.now() - 1000,
      id: 1683613729115,
      sessionStart: false,
    };
    const outcome = isValidSession(Date.now());
    expect(outcome).toEqual(false);
  });
  it('generateSessionId: should return newly generated session id', () => {
    const outcome = generateSessionId();
    expect(typeof outcome).toBe('number');
    expect(outcome.toString().length).toEqual(13);
  });
  it('generateAutoTrackingSession: should return newly generated auto tracking session', () => {
    const timestamp = Date.now();
    const outcome = generateAutoTrackingSession(timestamp);
    expect(outcome).toEqual({
      autoTrack: true,
      timeout: DEFAULT_SESSION_TIMEOUT,
      expiresAt: timestamp + DEFAULT_SESSION_TIMEOUT,
      id: expect.any(Number),
      sessionStart: true,
    });
  });
  it('generateManualTrackingSession: should return newly generated manual session', () => {
    const sessionId = 1234567890;
    const outcome = generateManualTrackingSession(sessionId);
    expect(outcome).toEqual({
      manualTrack: true,
      id: sessionId,
      sessionStart: true,
    });
  });
  it('generateManualTrackingSession: should return newly generated manual session if session id is not provided', () => {
    const outcome = generateManualTrackingSession();
    expect(outcome).toEqual({
      manualTrack: true,
      id: expect.any(Number),
      sessionStart: true,
    });
  });
});
