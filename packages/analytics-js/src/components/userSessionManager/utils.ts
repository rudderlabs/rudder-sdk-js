import { SessionInfo } from '@rudderstack/analytics-js/state/types';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { DEFAULT_SESSION_TIMEOUT } from '@rudderstack/analytics-js/constants/timeouts';
import { hasMinLength, isNumber, isPositiveInteger } from '../utilities/number';

const MIN_SESSION_ID_LENGTH = 10;

/**
 * A function to validate current session and return true/false depending on that
 * @returns boolean
 */
const hasSessionExpired = (expiresAt?: number): boolean => {
  const timestamp = Date.now();
  return Boolean(!expiresAt || timestamp > expiresAt);
};

/**
 * A function to generate session id
 * @returns number
 */
const generateSessionId = (): number => Date.now();

/**
 * Function to validate user provided sessionId
 * @param {number} sessionId
 * @returns
 */
const isManualSessionIdValid = (sessionId?: number, logger?: ILogger): boolean => {
  if (!sessionId) {
    return false;
  }
  if (!isNumber(sessionId) || !isPositiveInteger(sessionId)) {
    logger?.error(`[Session]:: "sessionId" should only be a positive integer`);
    return false;
  }
  if (!hasMinLength(MIN_SESSION_ID_LENGTH, sessionId)) {
    logger?.error(
      `[Session]:: "sessionId" should at least be "${MIN_SESSION_ID_LENGTH}" digits long`,
    );
    return false;
  }
  return true;
};

/**
 * A function to generate new auto tracking session
 * @param timestamp current timestamp
 * @returns SessionInfo
 */
const generateAutoTrackingSession = (sessionTimeout?: number): SessionInfo => {
  const timestamp = Date.now();
  const timeout: number = sessionTimeout || DEFAULT_SESSION_TIMEOUT;
  return {
    id: timestamp, // set the current timestamp
    expiresAt: timestamp + timeout, // set the expiry time of the session
    timeout,
    sessionStart: true,
    autoTrack: true,
  };
};

/**
 * A function to generate new manual tracking session
 * @param id Provided sessionId
 * @param logger Logger module
 * @returns SessionInfo
 */
const generateManualTrackingSession = (id?: number, logger?: ILogger): SessionInfo => {
  const sessionId: number = isManualSessionIdValid(id, logger)
    ? (id as number)
    : generateSessionId();
  return {
    id: sessionId,
    sessionStart: true,
    manualTrack: true,
  };
};

export {
  hasSessionExpired,
  generateSessionId,
  generateAutoTrackingSession,
  generateManualTrackingSession,
  MIN_SESSION_ID_LENGTH,
};
