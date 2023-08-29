/* eslint-disable class-methods-use-this */
import { generateUUID } from '@rudderstack/analytics-js-common/utilities/uuId';
import { batch, effect } from '@preact/signals-core';
import {
  isNonEmptyObject,
  mergeDeepRight,
} from '@rudderstack/analytics-js-common/utilities/object';
import { isString } from '@rudderstack/analytics-js-common/utilities/checks';
import { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { SessionInfo } from '@rudderstack/analytics-js-common/types/Session';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
import { AnonymousIdOptions } from '@rudderstack/analytics-js-common/types/LoadOptions';
import { USER_SESSION_MANAGER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import {
  CLIENT_DATA_STORE_COOKIE,
  CLIENT_DATA_STORE_LS,
} from '@rudderstack/analytics-js/constants/storage';
import { StorageType, UserSessionKeysType } from '@rudderstack/analytics-js-common/types/Storage';
import {
  COOKIE_STORAGE,
  LOCAL_STORAGE,
  MEMORY_STORAGE,
} from '@rudderstack/analytics-js-common/constants/storages';
import { UserSessionKeys } from '@rudderstack/analytics-js-common/types/userSessionStorageKeys';
import { StorageEntries } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { storageClientDataStoreNameMap } from '@rudderstack/analytics-js/services/StoreManager/types';
import { DEFAULT_SESSION_TIMEOUT_MS, MIN_SESSION_TIMEOUT_MS } from '../../constants/timeouts';
import { defaultSessionInfo } from '../../state/slices/session';
import { state } from '../../state';
import { getStorageEngine } from '../../services/StoreManager/storages';
import {
  TIMEOUT_NOT_NUMBER_WARNING,
  TIMEOUT_NOT_RECOMMENDED_WARNING,
  TIMEOUT_ZERO_WARNING,
} from '../../constants/logMessages';
import {
  generateAutoTrackingSession,
  generateManualTrackingSession,
  hasSessionExpired,
} from './utils';
import { getReferringDomain } from '../utilities/url';
import { getReferrer } from '../utilities/page';
import { defaultUserSessionValues, userSessionStorageKeys } from './userSessionStorageKeys';
import { IUserSessionManager, UserSessionStorageKeysType } from './types';
import { isPositiveInteger } from '../utilities/number';

class UserSessionManager implements IUserSessionManager {
  storeManager?: IStoreManager;
  pluginsManager?: IPluginsManager;
  logger?: ILogger;
  errorHandler?: IErrorHandler;

  constructor(
    errorHandler?: IErrorHandler,
    logger?: ILogger,
    pluginsManager?: IPluginsManager,
    storeManager?: IStoreManager,
  ) {
    this.storeManager = storeManager;
    this.pluginsManager = pluginsManager;
    this.logger = logger;
    this.errorHandler = errorHandler;
    this.onError = this.onError.bind(this);
  }

  /**
   * Initialize User session with values from storage
   * @param store Selected store
   */
  init(storeManager: IStoreManager) {
    this.storeManager = storeManager;
    this.logger?.debug(state.storage.entries.value);

    this.migrateStorageIfNeeded();
    this.migrateDataFromPreviousStorage();

    // get the values from storage and set it again
    const userId = this.getUserId();
    const userTraits = this.getUserTraits();
    const groupId = this.getGroupId();
    const groupTraits = this.getGroupTraits();
    const anonymousId = this.getAnonymousId();
    if (userId) {
      this.setUserId(userId);
    }
    if (userTraits) {
      this.setUserTraits(userTraits);
    }
    if (groupId) {
      this.setGroupId(groupId);
    }
    if (groupTraits) {
      this.setGroupTraits(groupTraits);
    }
    if (anonymousId) {
      this.setAnonymousId(anonymousId);
    }

    const initialReferrer = this.getInitialReferrer();
    const initialReferringDomain = this.getInitialReferringDomain();

    if (initialReferrer && initialReferringDomain) {
      this.setInitialReferrer(initialReferrer);
      this.setInitialReferringDomain(initialReferringDomain);
    } else if (initialReferrer) {
      this.setInitialReferrer(initialReferrer);
      this.setInitialReferringDomain(getReferringDomain(initialReferrer));
    } else {
      const referrer = getReferrer();
      this.setInitialReferrer(referrer);
      this.setInitialReferringDomain(getReferringDomain(referrer));
    }
    // Initialize session tracking
    if (this.isPersistanceEnabledForStorageEntry(UserSessionKeys.sessionInfo)) {
      this.initializeSessionTracking();
    }
    // Register the effect to sync with storage
    this.registerEffects();
  }

  isStorageTypeValidForStoringData(storage: StorageType): boolean {
    return !!(
      storage === COOKIE_STORAGE ||
      storage === LOCAL_STORAGE ||
      storage === MEMORY_STORAGE
    );
  }

  isPersistanceEnabledForStorageEntry(entryName: UserSessionKeysType): boolean {
    const entries = state.storage.entries.value;
    return this.isStorageTypeValidForStoringData(entries[entryName]?.type as StorageType);
  }

  migrateDataFromPreviousStorage() {
    const entries = state.storage.entries.value as StorageEntries;
    Object.keys(entries).forEach(entry => {
      const key = entry as UserSessionStorageKeysType;
      const currentStorage = entries[key]?.type as StorageType;
      const curStore = this.storeManager?.getStore(storageClientDataStoreNameMap[currentStorage]);
      const storages = [COOKIE_STORAGE, LOCAL_STORAGE];

      storages.forEach(storage => {
        const store = this.storeManager?.getStore(storageClientDataStoreNameMap[storage]);
        if (storage !== currentStorage && store) {
          const value = store?.get(userSessionStorageKeys[key]);
          if (value) {
            if (curStore) {
              curStore?.set(userSessionStorageKeys[key], value);
            }
            store?.remove(userSessionStorageKeys[key]);
          }
        }
      });
    });
  }

  migrateStorageIfNeeded() {
    if (!state.storage.migrate.value) {
      return;
    }
    const cookieStorage = this.storeManager?.getStore(CLIENT_DATA_STORE_COOKIE);
    const localStorage = this.storeManager?.getStore(CLIENT_DATA_STORE_LS);

    Object.keys(userSessionStorageKeys).forEach(storageEntryKey => {
      const key = storageEntryKey as UserSessionStorageKeysType;
      const storageEntry = userSessionStorageKeys[key];
      let migratedVal;
      if (cookieStorage) {
        migratedVal = this.pluginsManager?.invokeSingle(
          'storage.migrate',
          storageEntry,
          cookieStorage?.engine,
          this.errorHandler,
          this.logger,
        );
      }
      if (!migratedVal && localStorage) {
        migratedVal = this.pluginsManager?.invokeSingle(
          'storage.migrate',
          storageEntry,
          localStorage?.engine,
          this.errorHandler,
          this.logger,
        );
      }
      if (migratedVal) {
        this.syncValueToStorage(UserSessionKeys[key], migratedVal);
      }
    });
  }

  /**
   * A function to initialize sessionTracking
   */
  initializeSessionTracking() {
    const sessionInfo: SessionInfo = this.getSessionFromStorage() ?? defaultSessionInfo;

    let finalAutoTrackingStatus = !(
      state.loadOptions.value.sessions.autoTrack === false || sessionInfo.manualTrack === true
    );

    let sessionTimeout: number;
    const configuredSessionTimeout = state.loadOptions.value.sessions.timeout;
    if (!isPositiveInteger(configuredSessionTimeout)) {
      this.logger?.warn(
        TIMEOUT_NOT_NUMBER_WARNING(
          USER_SESSION_MANAGER,
          configuredSessionTimeout,
          DEFAULT_SESSION_TIMEOUT_MS,
        ),
      );
      sessionTimeout = DEFAULT_SESSION_TIMEOUT_MS;
    } else {
      sessionTimeout = configuredSessionTimeout as number;
    }

    if (sessionTimeout === 0) {
      this.logger?.warn(TIMEOUT_ZERO_WARNING(USER_SESSION_MANAGER));
      finalAutoTrackingStatus = false;
    }
    // In case user provides a timeout value greater than 0 but less than 10 seconds SDK will show a warning
    // and will proceed with it
    if (sessionTimeout > 0 && sessionTimeout < MIN_SESSION_TIMEOUT_MS) {
      this.logger?.warn(
        TIMEOUT_NOT_RECOMMENDED_WARNING(
          USER_SESSION_MANAGER,
          sessionTimeout,
          MIN_SESSION_TIMEOUT_MS,
        ),
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
  onError(error: unknown): void {
    if (this.errorHandler) {
      this.errorHandler.onError(error, USER_SESSION_MANAGER);
    } else {
      throw error;
    }
  }

  /**
   * A function to sync values in storage
   * @param key
   * @param value
   */
  syncValueToStorage(
    sessionKey: UserSessionKeysType,
    value: Nullable<ApiObject> | Nullable<string> | undefined,
  ) {
    const entries = state.storage.entries.value;
    const storage = entries[sessionKey]?.type as StorageType;
    const key = entries[sessionKey]?.key as string;
    if (this.isStorageTypeValidForStoringData(storage)) {
      const curStore = this.storeManager?.getStore(storageClientDataStoreNameMap[storage]);
      if ((value && isString(value)) || isNonEmptyObject(value)) {
        curStore?.set(key, value);
      } else {
        curStore?.remove(key);
      }
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
      this.syncValueToStorage(UserSessionKeys.userId, state.session.userId.value);
    });
    /**
     * Update user traits in storage automatically when it is updated in state
     */
    effect(() => {
      this.syncValueToStorage(UserSessionKeys.userTraits, state.session.userTraits.value);
    });
    /**
     * Update group id in storage automatically when it is updated in state
     */
    effect(() => {
      this.syncValueToStorage(UserSessionKeys.groupId, state.session.groupId.value);
    });
    /**
     * Update group traits in storage automatically when it is updated in state
     */
    effect(() => {
      this.syncValueToStorage(UserSessionKeys.groupTraits, state.session.groupTraits.value);
    });
    /**
     * Update anonymous user id in storage automatically when it is updated in state
     */
    effect(() => {
      this.syncValueToStorage(UserSessionKeys.anonymousId, state.session.anonymousId.value);
    });
    /**
     * Update initial referrer in storage automatically when it is updated in state
     */
    effect(() => {
      this.syncValueToStorage(UserSessionKeys.initialReferrer, state.session.initialReferrer.value);
    });
    /**
     * Update initial referring domain in storage automatically when it is updated in state
     */
    effect(() => {
      this.syncValueToStorage(
        UserSessionKeys.initialReferringDomain,
        state.session.initialReferringDomain.value,
      );
    });
    /**
     * Update session tracking info in storage automatically when it is updated in state
     */
    effect(() => {
      this.syncValueToStorage(UserSessionKeys.sessionInfo, state.session.sessionInfo.value);
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
    const storage: StorageType = state.storage.entries.value.anonymousId?.type as StorageType;
    if (this.isStorageTypeValidForStoringData(storage)) {
      if (!finalAnonymousId && rudderAmpLinkerParam) {
        const linkerPluginsResult = this.pluginsManager?.invokeMultiple<Nullable<string>>(
          'userSession.anonymousIdGoogleLinker',
          rudderAmpLinkerParam,
        );
        finalAnonymousId = linkerPluginsResult?.[0];
      }
      state.session.anonymousId.value = finalAnonymousId || this.generateAnonymousId();
    }
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
    const storage: StorageType = state.storage.entries.value.anonymousId?.type as StorageType;
    const key: string = state.storage.entries.value.anonymousId?.key as string;
    let persistedAnonymousId;
    // fetch the anonymousId from storage
    if (this.isStorageTypeValidForStoringData(storage)) {
      const store = this.storeManager?.getStore(storageClientDataStoreNameMap[storage]);
      persistedAnonymousId = store?.get(key);
      if (!persistedAnonymousId && options) {
        // fetch anonymousId from external source
        const autoCapturedAnonymousId = this.pluginsManager?.invokeSingle<string | undefined>(
          'storage.getAnonymousId',
          getStorageEngine,
          options,
        );
        persistedAnonymousId = autoCapturedAnonymousId;
      }
      state.session.anonymousId.value = persistedAnonymousId || this.generateAnonymousId();
    }
    return state.session.anonymousId.value as string;
  }

  getItem(sessionKey: UserSessionKeysType) {
    const entries = state.storage.entries.value;
    const storage = entries[sessionKey]?.type as StorageType;
    const key = entries[sessionKey]?.key as string;
    if (this.isStorageTypeValidForStoringData(storage)) {
      const store = this.storeManager?.getStore(storageClientDataStoreNameMap[storage]);
      return store?.get(key) ?? null;
    }
    return undefined;
  }

  /**
   * Fetches User Id
   * @returns
   */
  getUserId(): Nullable<string> {
    return this.getItem(UserSessionKeys.userId);
  }

  /**
   * Fetches User Traits
   * @returns
   */
  getUserTraits(): Nullable<ApiObject> {
    return this.getItem(UserSessionKeys.userTraits);
  }

  /**
   * Fetches Group Id
   * @returns
   */
  getGroupId(): Nullable<string> {
    return this.getItem(UserSessionKeys.groupId);
  }

  /**
   * Fetches Group Traits
   * @returns
   */
  getGroupTraits(): Nullable<ApiObject> {
    return this.getItem(UserSessionKeys.groupTraits);
  }

  /**
   * Fetches Initial Referrer
   * @returns
   */
  getInitialReferrer(): Nullable<string> {
    return this.getItem(UserSessionKeys.initialReferrer);
  }

  /**
   * Fetches Initial Referring domain
   * @returns
   */
  getInitialReferringDomain(): Nullable<string> {
    return this.getItem(UserSessionKeys.initialReferringDomain);
  }

  /**
   * Fetches session tracking information from storage
   * @returns
   */
  getSessionFromStorage(): Nullable<SessionInfo> {
    return this.getItem(UserSessionKeys.sessionInfo);
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
      state.session.userId.value = defaultUserSessionValues.userId;
      state.session.userTraits.value = defaultUserSessionValues.userTraits;
      state.session.groupId.value = defaultUserSessionValues.groupId;
      state.session.groupTraits.value = defaultUserSessionValues.groupTraits;

      if (resetAnonymousId) {
        state.session.anonymousId.value = defaultUserSessionValues.anonymousId;
      }

      if (noNewSessionStart) {
        return;
      }

      if (autoTrack) {
        state.session.sessionInfo.value = defaultUserSessionValues.sessionInfo;
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
    if (this.isPersistanceEnabledForStorageEntry(UserSessionKeys.userId)) {
      state.session.userId.value = userId;
    }
  }

  /**
   * Set user traits
   * @param traits
   */
  setUserTraits(traits?: Nullable<ApiObject>) {
    if (this.isPersistanceEnabledForStorageEntry(UserSessionKeys.userTraits) && traits) {
      state.session.userTraits.value = mergeDeepRight(state.session.userTraits.value ?? {}, traits);
    }
  }

  /**
   * Set group Id
   * @param groupId
   */
  setGroupId(groupId?: Nullable<string>) {
    if (this.isPersistanceEnabledForStorageEntry(UserSessionKeys.groupId)) {
      state.session.groupId.value = groupId;
    }
  }

  /**
   * Set group traits
   * @param traits
   */
  setGroupTraits(traits?: Nullable<ApiObject>) {
    if (this.isPersistanceEnabledForStorageEntry(UserSessionKeys.groupTraits) && traits) {
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
    if (this.isPersistanceEnabledForStorageEntry(UserSessionKeys.initialReferrer)) {
      state.session.initialReferrer.value = referrer;
    }
  }

  /**
   * Set initial referring domain
   * @param referrer
   */
  setInitialReferringDomain(referringDomain?: string) {
    if (this.isPersistanceEnabledForStorageEntry(UserSessionKeys.initialReferringDomain)) {
      state.session.initialReferringDomain.value = referringDomain;
    }
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
}

export { UserSessionManager };
