import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { SessionInfo } from '@rudderstack/analytics-js-common/types/Session';
import { USER_SESSION_MANAGER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import type { StorageType } from '@rudderstack/analytics-js-common/types/Storage';
import {
  COOKIE_STORAGE,
  LOCAL_STORAGE,
  MEMORY_STORAGE,
  SESSION_STORAGE,
} from '@rudderstack/analytics-js-common/constants/storages';
import { generateUUID } from '@rudderstack/analytics-js-common/utilities/uuId';
import { INVALID_SESSION_ID_WARNING } from '../../constants/logMessages';
import { hasMinLength, isPositiveInteger } from '../utilities/number';

const MIN_SESSION_ID_LENGTH = 10;

const isCutOffTimeExceeded = (sessionInfo: SessionInfo): boolean => {
  const { cutOff } = sessionInfo;
  const timestamp = Date.now();
  return Boolean(cutOff?.enabled && cutOff.expiresAt && timestamp > cutOff.expiresAt);
};

/**
 * A function to validate whether the current auto tracking session has expired or not.
 * It checks for the current session expiry and the cut off time expiry.
 * @param sessionInfo session info
 * @returns boolean
 */
const hasSessionExpired = (sessionInfo: SessionInfo): boolean => {
  const isCurrentSessionExpired = Boolean(
    !sessionInfo.expiresAt || Date.now() > sessionInfo.expiresAt,
  );
  return isCurrentSessionExpired || isCutOffTimeExceeded(sessionInfo);
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
const isManualSessionIdValid = (sessionId: number | undefined, logger: ILogger): boolean => {
  if (
    !sessionId ||
    !isPositiveInteger(sessionId) ||
    !hasMinLength(MIN_SESSION_ID_LENGTH, sessionId)
  ) {
    logger.warn(INVALID_SESSION_ID_WARNING(USER_SESSION_MANAGER, sessionId, MIN_SESSION_ID_LENGTH));
    return false;
  }
  return true;
};

const getCutOffExpirationTimestamp = (cutOff: SessionInfo['cutOff']): number | undefined => {
  if (!cutOff?.enabled) {
    return undefined;
  }

  return (
    cutOff.expiresAt ??
    (isPositiveInteger(cutOff.duration) ? Date.now() + cutOff.duration : undefined)
  );
};

/**
 * A function to generate new auto tracking session
 * @param sessionInfo session info
 * @returns SessionInfo
 */
const generateAutoTrackingSession = (sessionInfo: SessionInfo): SessionInfo => {
  const { timeout, cutOff } = sessionInfo;
  const timestamp = Date.now();

  return {
    id: timestamp, // set the current timestamp
    expiresAt: timestamp + (timeout as number), // set the expiry time of the session
    timeout,
    autoTrack: true,
    ...(cutOff && { cutOff }),
  };
};

/**
 * A function to generate new manual tracking session
 * @param id Provided sessionId
 * @param logger Logger module
 * @returns SessionInfo
 */
const generateManualTrackingSession = (id: number | undefined, logger: ILogger): SessionInfo => {
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
      storageType === SESSION_STORAGE ||
      storageType === MEMORY_STORAGE,
  );

/**
 * Generate a new anonymousId
 * @returns string anonymousID
 */
const generateAnonymousId = (): string => generateUUID();

export {
  hasSessionExpired,
  generateSessionId,
  generateAutoTrackingSession,
  generateManualTrackingSession,
  MIN_SESSION_ID_LENGTH,
  isStorageTypeValidForStoringData,
  generateAnonymousId,
  isCutOffTimeExceeded,
  getCutOffExpirationTimestamp,
};
