import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { SessionInfo } from '@rudderstack/analytics-js-common/types/Session';
import { StorageType } from '@rudderstack/analytics-js-common/types/Storage';
declare const MIN_SESSION_ID_LENGTH = 10;
/**
 * A function to validate current session and return true/false depending on that
 * @returns boolean
 */
declare const hasSessionExpired: (expiresAt?: number) => boolean;
/**
 * A function to generate session id
 * @returns number
 */
declare const generateSessionId: () => number;
/**
 * A function to generate new auto tracking session
 * @param sessionTimeout current timestamp
 * @returns SessionInfo
 */
declare const generateAutoTrackingSession: (sessionTimeout?: number) => SessionInfo;
/**
 * A function to generate new manual tracking session
 * @param id Provided sessionId
 * @param logger Logger module
 * @returns SessionInfo
 */
declare const generateManualTrackingSession: (id?: number, logger?: ILogger) => SessionInfo;
declare const isStorageTypeValidForStoringData: (storageType: StorageType) => boolean;
export {
  hasSessionExpired,
  generateSessionId,
  generateAutoTrackingSession,
  generateManualTrackingSession,
  MIN_SESSION_ID_LENGTH,
  isStorageTypeValidForStoringData,
};
