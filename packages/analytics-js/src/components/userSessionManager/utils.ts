import { SessionInfo } from '@rudderstack/analytics-js/state/types';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { DEFAULT_SESSION_TIMEOUT } from '@rudderstack/analytics-js/constants/timeouts';
import { hasMinLength, isPositiveInteger } from '../utilities/number';

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
  if (
    !sessionId ||
    !isPositiveInteger(sessionId) ||
    !hasMinLength(MIN_SESSION_ID_LENGTH, sessionId)
  ) {
    logger?.warn(
      `UserSessionManager:: The session ID will be auto-generated as the provided value (${sessionId}) is either invalid, not a positive integer or not at least "${MIN_SESSION_ID_LENGTH}" digits long.`,
    );
    return false;
  }
  return true;
};

/**
 * A function to generate new auto tracking session
 * @param sessionTimeout current timestamp
 * @returns SessionInfo
 */
const generateAutoTrackingSession = (sessionTimeout?: number): SessionInfo => {
  const timestamp = Date.now();
  const timeout: number = sessionTimeout || DEFAULT_SESSION_TIMEOUT;
  return {
    id: timestamp, // set the current timestamp
    expiresAt: timestamp + timeout, // set the expiry time of the session
    timeout,
    sessionStart: undefined,
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
    sessionStart: undefined,
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
