import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { SessionInfo } from '@rudderstack/analytics-js-common/types/Session';
import { USER_SESSION_MANAGER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import { StorageType } from '@rudderstack/analytics-js-common/types/Storage';
import {
  COOKIE_STORAGE,
  LOCAL_STORAGE,
  MEMORY_STORAGE,
} from '@rudderstack/analytics-js-common/constants/storages';
import { DEFAULT_SESSION_TIMEOUT_MS } from '../../constants/timeouts';
import { INVALID_SESSION_ID_WARNING } from '../../constants/logMessages';
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
 * @param logger logger
 * @returns
 */
const isManualSessionIdValid = (sessionId?: number, logger?: ILogger): boolean => {
  if (
    !sessionId ||
    !isPositiveInteger(sessionId) ||
    !hasMinLength(MIN_SESSION_ID_LENGTH, sessionId)
  ) {
    logger?.warn(
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
const generateAutoTrackingSession = (sessionTimeout?: number): SessionInfo => {
  const timestamp = Date.now();
  const timeout: number = sessionTimeout || DEFAULT_SESSION_TIMEOUT_MS;
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

const isStorageTypeValidForStoringData = (storageType: StorageType): boolean =>
  Boolean(
    storageType === COOKIE_STORAGE ||
      storageType === LOCAL_STORAGE ||
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
