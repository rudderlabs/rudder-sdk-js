/* eslint-disable class-methods-use-this */
import { state } from '@rudderstack/analytics-js/state';
import { generateUUID } from '@rudderstack/analytics-js/components/utilities/uuId';
import { Nullable } from '@rudderstack/analytics-js/types';
import { defaultSessionInfo } from '@rudderstack/analytics-js/state/slices/session';
import { IStore } from '@rudderstack/analytics-js/services/StoreManager/types';
import { batch, effect } from '@preact/signals-core';
import { AnonymousIdOptions, ApiObject, SessionInfo } from '@rudderstack/analytics-js/state/types';
import {
  isNonEmptyObject,
  mergeDeepRight,
} from '@rudderstack/analytics-js/components/utilities/object';
import { IPluginsManager } from '@rudderstack/analytics-js/components/pluginsManager/types';
import {
  DEFAULT_SESSION_TIMEOUT,
  MIN_SESSION_TIMEOUT,
} from '@rudderstack/analytics-js/constants/timeouts';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { IErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler/types';
import { isString } from '@rudderstack/analytics-js/components/utilities/checks';
import { getStorageEngine } from '@rudderstack/analytics-js/services/StoreManager/storages';
import { IUserSessionManager } from './types';
import { userSessionStorageKeys } from './userSessionStorageKeys';
import { getReferrer } from '../utilities/page';
import { getReferringDomain } from '../utilities/url';
import {
  generateAutoTrackingSession,
  generateManualTrackingSession,
  hasSessionExpired,
} from './utils';
import { isPositiveInteger } from '../utilities/number';

class UserSessionManager implements IUserSessionManager {
  storage?: IStore;
  pluginManager?: IPluginsManager;
  logger?: ILogger;
  errorHandler?: IErrorHandler;

  constructor(
    errorHandler?: IErrorHandler,
    logger?: ILogger,
    pluginManager?: IPluginsManager,
    storage?: IStore,
  ) {
    this.storage = storage;
    this.pluginManager = pluginManager;
    this.logger = logger;
    this.errorHandler = errorHandler;
    this.onError = this.onError.bind(this);
  }

  /**
   * Initialize User session with values from storage
   * @param storage Selected storage
   */
  init(storage: IStore) {
    this.storage = storage;

    // get the values from storage and set it again
    this.setUserId(this.getUserId() ?? '');
    this.setUserTraits(this.getUserTraits() ?? {});
    this.setGroupId(this.getGroupId() ?? '');
    this.setGroupTraits(this.getGroupTraits() ?? {});
    this.setAnonymousId(this.getAnonymousId());

    const initialReferrer = this.getInitialReferrer();
    const initialReferringDomain = this.getInitialReferringDomain();

    if (initialReferrer && initialReferringDomain) {
      this.setInitialReferrer(initialReferrer);
      this.setInitialReferringDomain(initialReferringDomain);
    } else {
      if (initialReferrer) {
        this.setInitialReferrer(initialReferrer);
        this.setInitialReferringDomain(getReferringDomain(initialReferrer));
      }
      const referrer = getReferrer();
      this.setInitialReferrer(referrer);
      this.setInitialReferringDomain(getReferringDomain(referrer));
    }
    // Initialize session tracking
    this.initializeSessionTracking();
    // Register the effect to sync with storage
    this.registerEffects();
  }

  /**
   * A function to initialize sessionTracking
   */
  initializeSessionTracking() {
    const sessionInfo: SessionInfo = this.getSessionFromStorage() || defaultSessionInfo;

    let finalAutoTrackingStatus = !(
      state.loadOptions.value.sessions.autoTrack === false || sessionInfo.manualTrack === true
    );

    let sessionTimeout: number;
    if (!isPositiveInteger(state.loadOptions.value.sessions.timeout)) {
      this.logger?.warn(
        '[SessionTracking]:: Default session timeout will be used as the provided input is not a number',
      );
      sessionTimeout = DEFAULT_SESSION_TIMEOUT;
    } else {
      sessionTimeout = state.loadOptions.value.sessions.timeout as number;
    }

    if (sessionTimeout === 0) {
      this.logger?.warn(
        '[SessionTracking]:: Provided timeout value 0 will disable the auto session tracking feature.',
      );
      finalAutoTrackingStatus = false;
    }
    // In case user provides a setTimeout value greater than 0 but less than 10 seconds SDK will show a warning
    // and will proceed with it
    if (sessionTimeout > 0 && sessionTimeout < MIN_SESSION_TIMEOUT) {
      this.logger?.warn(
        `[SessionTracking]:: It is not advised to set "timeout" less than ${MIN_SESSION_TIMEOUT} milliseconds`,
      );
    }
    state.session.sessionInfo.value = {
      ...sessionInfo,
      timeout: sessionTimeout,
      autoTrack: finalAutoTrackingStatus,
    };
    // If auto session tracking is enabled start the session tracking
    if (state.session.sessionInfo.value.autoTrack) {
      this.startOrRenewAutoTracking();
    }
  }

  /**
   * Handles error
   * @param error The error object
   */
  onError(error: Error | unknown): void {
    if (this.errorHandler) {
      this.errorHandler.onError(error, 'UserSessionManager');
    } else {
      throw error;
    }
  }

  /**
   * A function to sync values in storage
   * @param key
   * @param value
   */
  syncValueToStorage(key: string, value: Nullable<ApiObject> | Nullable<string> | undefined) {
    if ((value && isString(value)) || isNonEmptyObject(value)) {
      this.storage?.set(key, value);
    } else {
      this.storage?.remove(key);
    }
  }

  /**
   * Function to update storage whenever state value changes
   */
  registerEffects() {
    /**
     * Update userId in storage automatically when userId is updated in state
     */
    effect(() => {
      this.syncValueToStorage(userSessionStorageKeys.userId, state.session.userId.value);
    });
    /**
     * Update user traits in storage automatically when it is updated in state
     */
    effect(() => {
      this.syncValueToStorage(userSessionStorageKeys.userTraits, state.session.userTraits.value);
    });
    /**
     * Update group id in storage automatically when it is updated in state
     */
    effect(() => {
      this.syncValueToStorage(userSessionStorageKeys.groupId, state.session.groupId.value);
    });
    /**
     * Update group traits in storage automatically when it is updated in state
     */
    effect(() => {
      this.syncValueToStorage(userSessionStorageKeys.groupTraits, state.session.groupTraits.value);
    });
    /**
     * Update anonymous user id in storage automatically when it is updated in state
     */
    effect(() => {
      this.syncValueToStorage(
        userSessionStorageKeys.anonymousUserId,
        state.session.anonymousUserId.value,
      );
    });
    /**
     * Update initial referrer in storage automatically when it is updated in state
     */
    effect(() => {
      this.syncValueToStorage(
        userSessionStorageKeys.initialReferrer,
        state.session.initialReferrer.value,
      );
    });
    /**
     * Update initial referring domain in storage automatically when it is updated in state
     */
    effect(() => {
      this.syncValueToStorage(
        userSessionStorageKeys.initialReferringDomain,
        state.session.initialReferringDomain.value,
      );
    });
    /**
     * Update session tracking info in storage automatically when it is updated in state
     */
    effect(() => {
      this.syncValueToStorage(userSessionStorageKeys.sessionInfo, state.session.sessionInfo.value);
    });
  }

  /**
   * Sets anonymous id in the following precedence:
   *
   * 1. anonymousId: Id directly provided to the function.
   * 2. rudderAmpLinkerParam: value generated from linker query parm (rudderstack)
   *    using parseLinker util.
   * 3. generateUUID: A new unique id is generated and assigned.
   */
  setAnonymousId(anonymousId?: string, rudderAmpLinkerParam?: string) {
    let finalAnonymousId: string | undefined | null = anonymousId;
    if (!finalAnonymousId && rudderAmpLinkerParam) {
      const linkerPluginsResult = this.pluginManager?.invokeMultiple<Nullable<string>>(
        'userSession.anonymousIdGoogleLinker',
        rudderAmpLinkerParam,
      );
      finalAnonymousId = linkerPluginsResult?.[0];
    }
    state.session.anonymousUserId.value = finalAnonymousId || this.generateAnonymousId();
  }

  /**
   * Generate a new anonymousId
   * @returns string anonymousID
   */
  generateAnonymousId(): string {
    return generateUUID();
  }

  /**
   * Fetches anonymousId
   * @param options option to fetch it from external source
   * @returns anonymousId
   */
  getAnonymousId(options?: AnonymousIdOptions): string {
    // fetch the anonymousUserId from storage
    let persistedAnonymousId = this.storage?.get(userSessionStorageKeys.anonymousUserId);

    if (!persistedAnonymousId && options) {
      // fetch anonymousId from external source
      const autoCapturedAnonymousId = this.pluginManager?.invokeMultiple<string | undefined>(
        'storage.getAnonymousId',
        getStorageEngine,
        options,
      );
      persistedAnonymousId = autoCapturedAnonymousId?.[0];
    }
    state.session.anonymousUserId.value = persistedAnonymousId || this.generateAnonymousId();
    return state.session.anonymousUserId.value as string;
  }

  /**
   * Fetches User Id
   * @returns
   */
  getUserId(): Nullable<string> {
    return this.storage?.get(userSessionStorageKeys.userId) || null;
  }

  /**
   * Fetches User Traits
   * @returns
   */
  getUserTraits(): Nullable<ApiObject> {
    return this.storage?.get(userSessionStorageKeys.userTraits) || null;
  }

  /**
   * Fetches Group Id
   * @returns
   */
  getGroupId(): Nullable<string> {
    return this.storage?.get(userSessionStorageKeys.groupId) || null;
  }

  /**
   * Fetches Group Traits
   * @returns
   */
  getGroupTraits(): Nullable<ApiObject> {
    return this.storage?.get(userSessionStorageKeys.groupTraits) || null;
  }

  /**
   * Fetches Initial Referrer
   * @returns
   */
  getInitialReferrer(): Nullable<string> {
    return this.storage?.get(userSessionStorageKeys.initialReferrer) || null;
  }

  /**
   * Fetches Initial Referring domain
   * @returns
   */
  getInitialReferringDomain(): Nullable<string> {
    return this.storage?.get(userSessionStorageKeys.initialReferringDomain) || null;
  }

  /**
   * Fetches session tracking information from storage
   * @returns
   */
  getSessionFromStorage(): Nullable<SessionInfo> {
    return this.storage?.get(userSessionStorageKeys.sessionInfo) || null;
  }

  /**
   * A function to update current session info after each event call
   */
  refreshSession(): void {
    if (state.session.sessionInfo.value.autoTrack || state.session.sessionInfo.value.manualTrack) {
      if (state.session.sessionInfo.value.autoTrack) {
        this.startOrRenewAutoTracking();
      }
      if (state.session.sessionInfo.value.sessionStart === undefined) {
        state.session.sessionInfo.value = {
          ...state.session.sessionInfo.value,
          sessionStart: true,
        };
      } else if (state.session.sessionInfo.value.sessionStart) {
        state.session.sessionInfo.value = {
          ...state.session.sessionInfo.value,
          sessionStart: false,
        };
      }
    }
  }

  /**
   * Reset state values
   * @param resetAnonymousId
   * @param noNewSessionStart
   * @returns
   */
  reset(resetAnonymousId?: boolean, noNewSessionStart?: boolean) {
    const { manualTrack, autoTrack } = state.session.sessionInfo.value;

    batch(() => {
      state.session.userId.value = '';
      state.session.userTraits.value = {};
      state.session.groupId.value = '';
      state.session.groupTraits.value = {};

      if (resetAnonymousId) {
        state.session.anonymousUserId.value = '';
      }

      if (noNewSessionStart) {
        return;
      }

      if (autoTrack) {
        state.session.sessionInfo.value = {};
        this.startOrRenewAutoTracking();
      } else if (manualTrack) {
        this.startManualTrackingInternal();
      }
    });
  }

  /**
   * Set user Id
   * @param userId
   */
  setUserId(userId?: Nullable<string>) {
    state.session.userId.value = userId;
  }

  /**
   * Set user traits
   * @param traits
   */
  setUserTraits(traits?: Nullable<ApiObject>) {
    if (traits) {
      state.session.userTraits.value = mergeDeepRight(state.session.userTraits.value ?? {}, traits);
    }
  }

  /**
   * Set group Id
   * @param groupId
   */
  setGroupId(groupId?: Nullable<string>) {
    state.session.groupId.value = groupId;
  }

  /**
   * Set group traits
   * @param traits
   */
  setGroupTraits(traits?: Nullable<ApiObject>) {
    if (traits) {
      state.session.groupTraits.value = mergeDeepRight(
        state.session.groupTraits.value ?? {},
        traits,
      );
    }
  }

  /**
   * Set initial referrer
   * @param referrer
   */
  setInitialReferrer(referrer?: string) {
    state.session.initialReferrer.value = referrer;
  }

  /**
   * Set initial referring domain
   * @param referrer
   */
  setInitialReferringDomain(referrer?: string) {
    state.session.initialReferringDomain.value = referrer;
  }

  /**
   * A function to check for existing session details and depending on that create a new session.
   */
  startOrRenewAutoTracking() {
    if (hasSessionExpired(state.session.sessionInfo.value.expiresAt)) {
      state.session.sessionInfo.value = generateAutoTrackingSession(
        state.session.sessionInfo.value.timeout,
      );
    } else {
      const timestamp = Date.now();
      const timeout = state.session.sessionInfo.value.timeout as number;
      state.session.sessionInfo.value = mergeDeepRight(state.session.sessionInfo.value, {
        expiresAt: timestamp + timeout, // set the expiry time of the session
      });
    }
  }

  /**
   * A function method to start a manual session
   * @param {number} id     session identifier
   * @returns
   */
  start(id?: number) {
    state.session.sessionInfo.value = generateManualTrackingSession(id, this.logger);
  }

  /**
   * An internal function to start manual session
   */
  startManualTrackingInternal() {
    this.start(Date.now());
  }

  /**
   * A public method to end an ongoing session.
   */
  end() {
    state.session.sessionInfo.value = {};
  }

  /**
   * Clear storage
   * @param resetAnonymousId
   */
  clearUserSessionStorage(resetAnonymousId?: boolean) {
    this.storage?.remove(userSessionStorageKeys.userId);
    this.storage?.remove(userSessionStorageKeys.userTraits);
    this.storage?.remove(userSessionStorageKeys.groupId);
    this.storage?.remove(userSessionStorageKeys.groupTraits);

    if (resetAnonymousId) {
      this.storage?.remove(userSessionStorageKeys.anonymousUserId);
    }
  }
}

export { UserSessionManager };
