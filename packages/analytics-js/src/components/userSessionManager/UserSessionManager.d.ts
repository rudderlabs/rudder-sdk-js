import { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { SessionInfo } from '@rudderstack/analytics-js-common/types/Session';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
import { AnonymousIdOptions } from '@rudderstack/analytics-js-common/types/LoadOptions';
import { UserSessionKeys } from '@rudderstack/analytics-js-common/types/userSessionStorageKeys';
import { IUserSessionManager } from './types';
declare class UserSessionManager implements IUserSessionManager {
  storeManager?: IStoreManager;
  pluginsManager?: IPluginsManager;
  logger?: ILogger;
  errorHandler?: IErrorHandler;
  constructor(
    errorHandler?: IErrorHandler,
    logger?: ILogger,
    pluginsManager?: IPluginsManager,
    storeManager?: IStoreManager,
  );
  /**
   * Initialize User session with values from storage
   */
  init(): void;
  isPersistenceEnabledForStorageEntry(entryName: UserSessionKeys): boolean;
  migrateDataFromPreviousStorage(): void;
  migrateStorageIfNeeded(): void;
  /**
   * A function to initialize sessionTracking
   */
  initializeSessionTracking(): void;
  /**
   * Handles error
   * @param error The error object
   */
  onError(error: unknown): void;
  /**
   * A function to sync values in storage
   * @param sessionKey
   * @param value
   */
  syncValueToStorage(
    sessionKey: UserSessionKeys,
    value: Nullable<ApiObject> | Nullable<string> | undefined,
  ): void;
  /**
   * Function to update storage whenever state value changes
   */
  registerEffects(): void;
  /**
   * Sets anonymous id in the following precedence:
   *
   * 1. anonymousId: Id directly provided to the function.
   * 2. rudderAmpLinkerParam: value generated from linker query parm (rudderstack)
   *    using parseLinker util.
   * 3. generateUUID: A new unique id is generated and assigned.
   */
  setAnonymousId(anonymousId?: string, rudderAmpLinkerParam?: string): void;
  /**
   * Generate a new anonymousId
   * @returns string anonymousID
   */
  generateAnonymousId(): string;
  /**
   * Fetches anonymousId
   * @param options option to fetch it from external source
   * @returns anonymousId
   */
  getAnonymousId(options?: AnonymousIdOptions): string;
  getItem(sessionKey: UserSessionKeys): any;
  /**
   * Fetches User Id
   * @returns
   */
  getUserId(): Nullable<string>;
  /**
   * Fetches User Traits
   * @returns
   */
  getUserTraits(): Nullable<ApiObject>;
  /**
   * Fetches Group Id
   * @returns
   */
  getGroupId(): Nullable<string>;
  /**
   * Fetches Group Traits
   * @returns
   */
  getGroupTraits(): Nullable<ApiObject>;
  /**
   * Fetches Initial Referrer
   * @returns
   */
  getInitialReferrer(): Nullable<string>;
  /**
   * Fetches Initial Referring domain
   * @returns
   */
  getInitialReferringDomain(): Nullable<string>;
  /**
   * Fetches session tracking information from storage
   * @returns
   */
  getSessionFromStorage(): Nullable<SessionInfo>;
  /**
   * Fetches auth token from storage
   * @returns
   */
  getAuthToken(): Nullable<string>;
  /**
   * If session is active it returns the sessionId
   * @returns
   */
  getSessionId(): Nullable<number>;
  /**
   * A function to update current session info after each event call
   */
  refreshSession(): void;
  /**
   * Reset state values
   * @param resetAnonymousId
   * @param noNewSessionStart
   * @returns
   */
  reset(resetAnonymousId?: boolean, noNewSessionStart?: boolean): void;
  /**
   * Set user Id
   * @param userId
   */
  setUserId(userId?: Nullable<string>): void;
  /**
   * Set user traits
   * @param traits
   */
  setUserTraits(traits?: Nullable<ApiObject>): void;
  /**
   * Set group Id
   * @param groupId
   */
  setGroupId(groupId?: Nullable<string>): void;
  /**
   * Set group traits
   * @param traits
   */
  setGroupTraits(traits?: Nullable<ApiObject>): void;
  /**
   * Set initial referrer
   * @param referrer
   */
  setInitialReferrer(referrer?: string): void;
  /**
   * Set initial referring domain
   * @param {String} referringDomain
   */
  setInitialReferringDomain(referringDomain?: string): void;
  /**
   * A function to check for existing session details and depending on that create a new session.
   */
  startOrRenewAutoTracking(): void;
  /**
   * A function method to start a manual session
   * @param {number} id     session identifier
   * @returns
   */
  start(id?: number): void;
  /**
   * An internal function to start manual session
   */
  startManualTrackingInternal(): void;
  /**
   * A public method to end an ongoing session.
   */
  end(): void;
  /**
   * Set auth token
   * @param userId
   */
  setAuthToken(token: string): void;
}
export { UserSessionManager };
