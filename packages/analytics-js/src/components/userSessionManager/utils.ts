import { state } from '@rudderstack/analytics-js/state';
import { ApiObject, SessionInfo } from '@rudderstack/analytics-js/state/types';
import { Nullable } from '@rudderstack/analytics-js/types';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { DEFAULT_SESSION_TIMEOUT } from '@rudderstack/analytics-js/constants/timeouts';
import { countDigits } from '../utilities/number';

const MIN_SESSION_ID_LENGTH = 10;

/**
 * A function to check the input object is not empty, undefined or null
 * @param obj input object
 * @returns boolean
 */
const hasValidValue = (obj?: Nullable<ApiObject>) =>
  obj !== undefined && obj !== null && Object.keys(obj).length > 0;

/**
 * A function to validate current session and return true/false depending on that
 * @param {number} timestamp
 * @returns boolean
 */
const isValidSession = (timestamp: number): boolean =>
  Boolean(
    state.session.sessionInfo.value.expiresAt &&
      timestamp <= state.session.sessionInfo.value.expiresAt,
  );

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
const isValidManualSessionId = (sessionId?: number, logger?: ILogger): boolean => {
  if (!sessionId) return false;
  if (typeof sessionId !== 'number' || sessionId % 1 !== 0) {
    logger?.error(`[Session]:: "sessionId" should only be a positive integer`);
    return false;
  }
  if (countDigits(sessionId) < MIN_SESSION_ID_LENGTH) {
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
const generateAutoTrackingSession = (timestamp: number): SessionInfo => {
  const timeout: number = state.session.sessionInfo.value.timeout || DEFAULT_SESSION_TIMEOUT;
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
  const sessionId: number = isValidManualSessionId(id, logger)
    ? (id as number)
    : generateSessionId();
  return {
    id: sessionId,
    sessionStart: true,
    manualTrack: true,
  };
};

export {
  hasValidValue,
  isValidSession,
  generateSessionId,
  generateAutoTrackingSession,
  generateManualTrackingSession,
};
