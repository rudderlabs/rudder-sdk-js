/* eslint-disable class-methods-use-this */
import { generateUUID } from '@rudderstack/analytics-js-common/utilities/uuId';
import { batch, effect } from '@preact/signals-core';
import {
  isNonEmptyObject,
  mergeDeepRight,
} from '@rudderstack/analytics-js-common/utilities/object';
import {
  isDefinedNotNullAndNotEmptyString,
  isString,
} from '@rudderstack/analytics-js-common/utilities/checks';
import { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { IStore, IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { SessionInfo } from '@rudderstack/analytics-js-common/types/Session';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
import { AnonymousIdOptions } from '@rudderstack/analytics-js-common/types/LoadOptions';
import { USER_SESSION_MANAGER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import { StorageType } from '@rudderstack/analytics-js-common/types/Storage';
import {
  COOKIE_STORAGE,
  LOCAL_STORAGE,
  SESSION_STORAGE,
} from '@rudderstack/analytics-js-common/constants/storages';
import { UserSessionKeys } from '@rudderstack/analytics-js-common/types/UserSessionStorage';
import { StorageEntries } from '@rudderstack/analytics-js-common/types/ApplicationState';
import {
  CLIENT_DATA_STORE_COOKIE,
  CLIENT_DATA_STORE_LS,
  CLIENT_DATA_STORE_SESSION,
} from '../../constants/storage';
import { storageClientDataStoreNameMap } from '../../services/StoreManager/types';
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
  isStorageTypeValidForStoringData,
} from './utils';
import { getReferringDomain } from '../utilities/url';
import { getReferrer } from '../utilities/page';
import { DEFAULT_USER_SESSION_VALUES, USER_SESSION_STORAGE_KEYS } from './constants';
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
   */
  init() {
    this.syncStorageDataToState();

    // Register the effect to sync with storage
    this.registerEffects();
  }

  syncStorageDataToState() {
    this.migrateStorageIfNeeded();
    this.migrateDataFromPreviousStorage();

    // get the values from storage and set it again
    const userId = this.getUserId();
    this.setUserId(userId || DEFAULT_USER_SESSION_VALUES.userId);

    const userTraits = this.getUserTraits();
    this.setUserTraits(userTraits ?? DEFAULT_USER_SESSION_VALUES.userTraits);

    const groupId = this.getGroupId();
    this.setGroupId(groupId || DEFAULT_USER_SESSION_VALUES.groupId);

    const groupTraits = this.getGroupTraits();
    this.setGroupTraits(groupTraits ?? DEFAULT_USER_SESSION_VALUES.groupTraits);

    const anonymousId = this.getAnonymousId(state.loadOptions.value.anonymousIdOptions);
    this.setAnonymousId(anonymousId || DEFAULT_USER_SESSION_VALUES.anonymousId);

    const authToken = this.getAuthToken();
    this.setAuthToken(authToken || DEFAULT_USER_SESSION_VALUES.authToken);

    const persistedInitialReferrer = this.getInitialReferrer();
    const persistedInitialReferringDomain = this.getInitialReferringDomain();

    if (persistedInitialReferrer && persistedInitialReferringDomain) {
      this.setInitialReferrer(persistedInitialReferrer);
      this.setInitialReferringDomain(persistedInitialReferringDomain);
    } else {
      const initialReferrer = persistedInitialReferrer || getReferrer();
      this.setInitialReferrer(initialReferrer);
      this.setInitialReferringDomain(getReferringDomain(initialReferrer));
    }
    // Initialize session tracking
    if (this.isPersistenceEnabledForStorageEntry('sessionInfo')) {
      this.initializeSessionTracking();
    } else {
      // Setting the default value to delete the entry from storage
      state.session.sessionInfo.value = DEFAULT_USER_SESSION_VALUES.sessionInfo;
    }
  }

  isPersistenceEnabledForStorageEntry(entryName: UserSessionKeys): boolean {
    const entries = state.storage.entries.value;
    return isStorageTypeValidForStoringData(entries[entryName]?.type as StorageType);
  }

  migrateDataFromPreviousStorage() {
    const entries = state.storage.entries.value as StorageEntries;
    const storagesForMigration = [COOKIE_STORAGE, LOCAL_STORAGE, SESSION_STORAGE];
    Object.keys(entries).forEach(entry => {
      const key = entry as UserSessionStorageKeysType;
      const currentStorage = entries[key]?.type as StorageType;
      const curStore = this.storeManager?.getStore(storageClientDataStoreNameMap[currentStorage]);
      if (curStore) {
        storagesForMigration.forEach(storage => {
          const store = this.storeManager?.getStore(storageClientDataStoreNameMap[storage]);
          if (store && storage !== currentStorage) {
            const value = store.get(USER_SESSION_STORAGE_KEYS[key]);
            if (isDefinedNotNullAndNotEmptyString(value)) {
              curStore.set(USER_SESSION_STORAGE_KEYS[key], value);
            }

            store.remove(USER_SESSION_STORAGE_KEYS[key]);
          }
        });
      }
    });
  }

  migrateStorageIfNeeded() {
    if (!state.storage.migrate.value) {
      return;
    }
    const cookieStorage = this.storeManager?.getStore(CLIENT_DATA_STORE_COOKIE);
    const localStorage = this.storeManager?.getStore(CLIENT_DATA_STORE_LS);
    const sessionStorage = this.storeManager?.getStore(CLIENT_DATA_STORE_SESSION);
    const stores: IStore[] = [];
    if (cookieStorage) {
      stores.push(cookieStorage);
    }
    if (localStorage) {
      stores.push(localStorage);
    }
    if (sessionStorage) {
      stores.push(sessionStorage);
    }
    Object.keys(USER_SESSION_STORAGE_KEYS).forEach(storageKey => {
      const key = storageKey as UserSessionStorageKeysType;
      const storageEntry = USER_SESSION_STORAGE_KEYS[key];
      stores.forEach(store => {
        const migratedVal = this.pluginsManager?.invokeSingle(
          'storage.migrate',
          storageEntry,
          store.engine,
          this.errorHandler,
          this.logger,
        );
        if (migratedVal) {
          store.set(storageEntry, migratedVal);
        }
      });
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
   * @param sessionKey
   * @param value
   */
  syncValueToStorage(
    sessionKey: UserSessionKeys,
    value: Nullable<ApiObject> | Nullable<string> | undefined,
  ) {
    const entries = state.storage.entries.value;
    const storage = entries[sessionKey]?.type as StorageType;
    const key = entries[sessionKey]?.key as string;
    if (isStorageTypeValidForStoringData(storage)) {
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
      this.syncValueToStorage('userId', state.session.userId.value);
    });
    /**
     * Update user traits in storage automatically when it is updated in state
     */
    effect(() => {
      this.syncValueToStorage('userTraits', state.session.userTraits.value);
    });
    /**
     * Update group id in storage automatically when it is updated in state
     */
    effect(() => {
      this.syncValueToStorage('groupId', state.session.groupId.value);
    });
    /**
     * Update group traits in storage automatically when it is updated in state
     */
    effect(() => {
      this.syncValueToStorage('groupTraits', state.session.groupTraits.value);
    });
    /**
     * Update anonymous user id in storage automatically when it is updated in state
     */
    effect(() => {
      this.syncValueToStorage('anonymousId', state.session.anonymousId.value);
    });
    /**
     * Update initial referrer in storage automatically when it is updated in state
     */
    effect(() => {
      this.syncValueToStorage('initialReferrer', state.session.initialReferrer.value);
    });
    /**
     * Update initial referring domain in storage automatically when it is updated in state
     */
    effect(() => {
      this.syncValueToStorage('initialReferringDomain', state.session.initialReferringDomain.value);
    });
    /**
     * Update session tracking info in storage automatically when it is updated in state
     */
    effect(() => {
      this.syncValueToStorage('sessionInfo', state.session.sessionInfo.value);
    });
    /**
     * Update session tracking info in storage automatically when it is updated in state
     */
    effect(() => {
      this.syncValueToStorage('authToken', state.session.authToken.value);
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
    if (this.isPersistenceEnabledForStorageEntry('anonymousId')) {
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
    if (isStorageTypeValidForStoringData(storage)) {
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

  getEntryValue(sessionKey: UserSessionKeys) {
    const entries = state.storage.entries.value;
    const storage = entries[sessionKey]?.type as StorageType;
    const key = entries[sessionKey]?.key as string;
    if (isStorageTypeValidForStoringData(storage)) {
      const store = this.storeManager?.getStore(storageClientDataStoreNameMap[storage]);
      return store?.get(key) ?? null;
    }
    return null;
  }

  /**
   * Fetches User Id
   * @returns
   */
  getUserId(): Nullable<string> {
    return this.getEntryValue('userId');
  }

  /**
   * Fetches User Traits
   * @returns
   */
  getUserTraits(): Nullable<ApiObject> {
    return this.getEntryValue('userTraits');
  }

  /**
   * Fetches Group Id
   * @returns
   */
  getGroupId(): Nullable<string> {
    return this.getEntryValue('groupId');
  }

  /**
   * Fetches Group Traits
   * @returns
   */
  getGroupTraits(): Nullable<ApiObject> {
    return this.getEntryValue('groupTraits');
  }

  /**
   * Fetches Initial Referrer
   * @returns
   */
  getInitialReferrer(): Nullable<string> {
    return this.getEntryValue('initialReferrer');
  }

  /**
   * Fetches Initial Referring domain
   * @returns
   */
  getInitialReferringDomain(): Nullable<string> {
    return this.getEntryValue('initialReferringDomain');
  }

  /**
   * Fetches session tracking information from storage
   * @returns
   */
  getSessionFromStorage(): Nullable<SessionInfo> {
    return this.getEntryValue('sessionInfo');
  }

  /**
   * Fetches auth token from storage
   * @returns
   */
  getAuthToken(): Nullable<string> {
    return this.getEntryValue('authToken');
  }

  /**
   * If session is active it returns the sessionId
   * @returns
   */
  getSessionId(): Nullable<number> {
    if (
      (state.session.sessionInfo.value.autoTrack &&
        !hasSessionExpired(state.session.sessionInfo.value.expiresAt)) ||
      state.session.sessionInfo.value.manualTrack
    ) {
      return state.session.sessionInfo.value.id || null;
    }
    return null;
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
      state.session.userId.value = DEFAULT_USER_SESSION_VALUES.userId;
      state.session.userTraits.value = DEFAULT_USER_SESSION_VALUES.userTraits;
      state.session.groupId.value = DEFAULT_USER_SESSION_VALUES.groupId;
      state.session.groupTraits.value = DEFAULT_USER_SESSION_VALUES.groupTraits;
      state.session.authToken.value = DEFAULT_USER_SESSION_VALUES.authToken;

      if (resetAnonymousId) {
        // This will generate a new anonymous ID
        this.setAnonymousId();
      }

      if (noNewSessionStart) {
        return;
      }

      if (autoTrack) {
        state.session.sessionInfo.value = DEFAULT_USER_SESSION_VALUES.sessionInfo;
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
    if (this.isPersistenceEnabledForStorageEntry('userId')) {
      state.session.userId.value = userId;
    }
  }

  /**
   * Set user traits
   * @param traits
   */
  setUserTraits(traits?: Nullable<ApiObject>) {
    if (this.isPersistenceEnabledForStorageEntry('userTraits') && traits) {
      state.session.userTraits.value = mergeDeepRight(state.session.userTraits.value ?? {}, traits);
    }
  }

  /**
   * Set group Id
   * @param groupId
   */
  setGroupId(groupId?: Nullable<string>) {
    if (this.isPersistenceEnabledForStorageEntry('groupId')) {
      state.session.groupId.value = groupId;
    }
  }

  /**
   * Set group traits
   * @param traits
   */
  setGroupTraits(traits?: Nullable<ApiObject>) {
    if (this.isPersistenceEnabledForStorageEntry('groupTraits') && traits) {
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
    if (this.isPersistenceEnabledForStorageEntry('initialReferrer')) {
      state.session.initialReferrer.value = referrer;
    }
  }

  /**
   * Set initial referring domain
   * @param {String} referringDomain
   */
  setInitialReferringDomain(referringDomain?: string) {
    if (this.isPersistenceEnabledForStorageEntry('initialReferringDomain')) {
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

  /**
   * Set auth token
   * @param userId
   */
  setAuthToken(token: string) {
    if (this.isPersistenceEnabledForStorageEntry('authToken')) {
      state.session.authToken.value = token;
    }
  }
}

export { UserSessionManager };
