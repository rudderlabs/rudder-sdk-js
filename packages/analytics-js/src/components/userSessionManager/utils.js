import { USER_SESSION_MANAGER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import {
  COOKIE_STORAGE,
  LOCAL_STORAGE,
  MEMORY_STORAGE,
  SESSION_STORAGE,
} from '@rudderstack/analytics-js-common/constants/storages';
import { DEFAULT_SESSION_TIMEOUT_MS } from '../../constants/timeouts';
import { INVALID_SESSION_ID_WARNING } from '../../constants/logMessages';
import { hasMinLength, isPositiveInteger } from '../utilities/number';
const MIN_SESSION_ID_LENGTH = 10;
/**
 * A function to validate current session and return true/false depending on that
 * @returns boolean
 */
const hasSessionExpired = expiresAt => {
  const timestamp = Date.now();
  return Boolean(!expiresAt || timestamp > expiresAt);
};
/**
 * A function to generate session id
 * @returns number
 */
const generateSessionId = () => Date.now();
/**
 * Function to validate user provided sessionId
 * @param {number} sessionId
 * @param logger logger
 * @returns
 */
const isManualSessionIdValid = (sessionId, logger) => {
  if (
    !sessionId ||
    !isPositiveInteger(sessionId) ||
    !hasMinLength(MIN_SESSION_ID_LENGTH, sessionId)
  ) {
    logger === null || logger === void 0
      ? void 0
      : logger.warn(
          INVALID_SESSION_ID_WARNING(USER_SESSION_MANAGER, sessionId, MIN_SESSION_ID_LENGTH),
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
const generateAutoTrackingSession = sessionTimeout => {
  const timestamp = Date.now();
  const timeout = sessionTimeout || DEFAULT_SESSION_TIMEOUT_MS;
  return {
    id: timestamp,
    expiresAt: timestamp + timeout,
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
const generateManualTrackingSession = (id, logger) => {
  const sessionId = isManualSessionIdValid(id, logger) ? id : generateSessionId();
  return {
    id: sessionId,
    sessionStart: undefined,
    manualTrack: true,
  };
};
const isStorageTypeValidForStoringData = storageType =>
  Boolean(
    storageType === COOKIE_STORAGE ||
      storageType === LOCAL_STORAGE ||
      storageType === SESSION_STORAGE ||
      storageType === MEMORY_STORAGE,
  );
export {
  hasSessionExpired,
  generateSessionId,
  generateAutoTrackingSession,
  generateManualTrackingSession,
  MIN_SESSION_ID_LENGTH,
  isStorageTypeValidForStoringData,
};
