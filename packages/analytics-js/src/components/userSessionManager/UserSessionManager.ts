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
  CLIENT_DATA_STORE_MEMORY,
} from '@rudderstack/analytics-js/constants/storage';
import {
  MigrationStorageType,
  StorageType,
  StorageTypeWithStore,
  UserSessionKeysType,
} from '@rudderstack/analytics-js-common/types/Storage';
import {
  COOKIE_STORAGE,
  LOCAL_STORAGE,
  MEMORY_STORAGE,
} from '@rudderstack/analytics-js-common/constants/storages';
import { UserSessionKeys } from '@rudderstack/analytics-js-common/types/userSessionStorageKeys';
import { UserSessionEntries } from '@rudderstack/analytics-js-common/types/ApplicationState';
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
  // cookieStorage?: IStore;
  // localStorage?: IStore;
  // memoryStorage?: IStore;

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
    const sessionTrackingStorage: StorageType = state.storage.entries.value.sessionInfo.storage;
    this.storeManager = storeManager;
    this.logger?.debug(state.storage.entries.value);

    if (state.storage.migrate.value === true) {
      this.migrateStorageIfNeeded();
    } else {
      this.migrateDataFromPreviousStorage();
    }

    // get the values from storage and set it again
    this.setUserId(this.getUserId() ?? defaultUserSessionValues.userId);
    this.setUserTraits(this.getUserTraits() ?? defaultUserSessionValues.userTraits);
    this.setGroupId(this.getGroupId() ?? defaultUserSessionValues.groupId);
    this.setGroupTraits(this.getGroupTraits() ?? defaultUserSessionValues.groupTraits);
    this.setAnonymousId(this.getAnonymousId(state.loadOptions.value.anonymousIdOptions));

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
    if (this.isStorageTypeValidForStoringData(sessionTrackingStorage)) {
      this.initializeSessionTracking();
    } else {
      state.session.sessionInfo.value = defaultUserSessionValues.sessionInfo;
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

  migrateDataFromPreviousStorage() {
    const entries: UserSessionEntries = state.storage.entries.value as UserSessionEntries;
    Object.keys(entries).forEach(entry => {
      const key = entry as UserSessionStorageKeysType;
      const currentStorage = entries[key].storage;
      const storages: MigrationStorageType[] = [COOKIE_STORAGE, LOCAL_STORAGE];

      storages.forEach(storage => {
        const store = this.storeManager?.getStore(storageClientDataStoreNameMap[storage]);
        const curStore = this.storeManager?.getStore(storageClientDataStoreNameMap[currentStorage]);
        if (
          storage !== currentStorage &&
          store &&
          this.isStorageTypeValidForStoringData(currentStorage)
        ) {
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
    const cookieStorage = this.storeManager?.getStore(CLIENT_DATA_STORE_COOKIE);
    const localStorage = this.storeManager?.getStore(CLIENT_DATA_STORE_LS);
    if (cookieStorage) {
      Object.keys(userSessionStorageKeys).forEach(storageEntryKey => {
        const key = storageEntryKey as UserSessionStorageKeysType;
        const storageEntry = userSessionStorageKeys[key];
        const migratedVal = this.pluginsManager?.invokeSingle(
          'storage.migrate',
          storageEntry,
          cookieStorage?.engine,
          this.errorHandler,
          this.logger,
        );
        if (migratedVal) {
          this.syncValueToStorage(UserSessionKeys[key], migratedVal, COOKIE_STORAGE);
        }
      });
    }

    if (localStorage) {
      Object.keys(userSessionStorageKeys).forEach(storageEntryKey => {
        const key = storageEntryKey as UserSessionStorageKeysType;
        const storageEntry = userSessionStorageKeys[key];
        const migratedVal = this.pluginsManager?.invokeSingle(
          'storage.migrate',
          storageEntry,
          localStorage?.engine,
          this.errorHandler,
          this.logger,
        );
        if (migratedVal) {
          this.syncValueToStorage(UserSessionKeys[key], migratedVal, LOCAL_STORAGE);
        }
      });
    }
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
    previousStorageType?: MigrationStorageType,
  ) {
    const entries = state.storage.entries?.value;
    const { storage, key } = entries[sessionKey];
    if (this.isStorageTypeValidForStoringData(storage)) {
      const curStorageType = storage as StorageTypeWithStore;
      const curStore = this.storeManager?.getStore(storageClientDataStoreNameMap[curStorageType]);
      if ((value && isString(value)) || isNonEmptyObject(value)) {
        curStore?.set(key, value);
        if (previousStorageType && curStorageType !== previousStorageType) {
          const previousStore = this.storeManager?.getStore(
            storageClientDataStoreNameMap[previousStorageType],
          );
          previousStore?.remove(key);
        }
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
    const storage: StorageType = state.storage.entries?.value.anonymousId.storage;
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
    const storage: StorageType = state.storage.entries?.value.anonymousId.storage;
    const key: string = state.storage.entries?.value.anonymousId.key;
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
    } else {
      state.session.anonymousId.value = defaultUserSessionValues.anonymousId;
    }
    return state.session.anonymousId.value as string;
  }

  getItem(sessionKey: UserSessionKeysType) {
    const entries = state.storage.entries?.value;
    const { storage, key } = entries[sessionKey];
    if (this.isStorageTypeValidForStoringData(storage)) {
      const store = this.storeManager?.getStore(storageClientDataStoreNameMap[storage]);
      return store?.get(key) ?? null;
    }
    return defaultUserSessionValues[sessionKey];
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
      state.session.userId.value = '';
      state.session.userTraits.value = {};
      state.session.groupId.value = '';
      state.session.groupTraits.value = {};

      if (resetAnonymousId) {
        state.session.anonymousId.value = '';
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
    const storage: StorageType = state.storage.entries?.value.userId.storage;
    if (this.isStorageTypeValidForStoringData(storage)) {
      state.session.userId.value = userId;
    }
  }

  /**
   * Set user traits
   * @param traits
   */
  setUserTraits(traits?: Nullable<ApiObject>) {
    const storage: StorageType = state.storage.entries?.value.userTraits.storage;
    if (this.isStorageTypeValidForStoringData(storage) && traits) {
      state.session.userTraits.value = mergeDeepRight(state.session.userTraits.value ?? {}, traits);
    }
  }

  /**
   * Set group Id
   * @param groupId
   */
  setGroupId(groupId?: Nullable<string>) {
    const storage: StorageType = state.storage.entries?.value.groupId.storage;
    if (this.isStorageTypeValidForStoringData(storage)) {
      state.session.groupId.value = groupId;
    }
  }

  /**
   * Set group traits
   * @param traits
   */
  setGroupTraits(traits?: Nullable<ApiObject>) {
    const storage: StorageType = state.storage.entries?.value.groupTraits.storage;
    if (this.isStorageTypeValidForStoringData(storage) && traits) {
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
    const storage: StorageType = state.storage.entries?.value.initialReferrer.storage;
    if (this.isStorageTypeValidForStoringData(storage)) {
      state.session.initialReferrer.value = referrer;
    }
  }

  /**
   * Set initial referring domain
   * @param referrer
   */
  setInitialReferringDomain(referringDomain?: string) {
    const storage: StorageType = state.storage.entries?.value.initialReferringDomain.storage;
    if (this.isStorageTypeValidForStoringData(storage)) {
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

  removeItem(sessionKey: UserSessionKeysType) {
    const entries = state.storage.entries?.value;
    const { storage, key } = entries[sessionKey];
    if (this.isStorageTypeValidForStoringData(storage)) {
      const store = this.storeManager?.getStore(storageClientDataStoreNameMap[storage]);
      store?.remove(key);
    }
  }

  /**
   * Clear storage
   * @param resetAnonymousId
   */
  clearUserSessionStorage(resetAnonymousId?: boolean) {
    this.removeItem(UserSessionKeys.userId);
    this.removeItem(UserSessionKeys.userTraits);
    this.removeItem(UserSessionKeys.groupId);
    this.removeItem(UserSessionKeys.groupTraits);

    if (resetAnonymousId) {
      this.removeItem(UserSessionKeys.anonymousId);
    }
  }
}

export { UserSessionManager };
