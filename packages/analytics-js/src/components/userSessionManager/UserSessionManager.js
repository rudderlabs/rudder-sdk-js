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
import { USER_SESSION_MANAGER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import {
  COOKIE_STORAGE,
  LOCAL_STORAGE,
  SESSION_STORAGE,
} from '@rudderstack/analytics-js-common/constants/storages';
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
import { defaultUserSessionValues, userSessionStorageKeys } from './userSessionStorageKeys';
import { isPositiveInteger } from '../utilities/number';
class UserSessionManager {
  constructor(errorHandler, logger, pluginsManager, storeManager) {
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
    const authToken = this.getAuthToken();
    if (authToken) {
      this.setAuthToken(authToken);
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
    if (this.isPersistenceEnabledForStorageEntry('sessionInfo')) {
      this.initializeSessionTracking();
    }
    // Register the effect to sync with storage
    this.registerEffects();
  }
  isPersistenceEnabledForStorageEntry(entryName) {
    var _a;
    const entries = state.storage.entries.value;
    return isStorageTypeValidForStoringData(
      (_a = entries[entryName]) === null || _a === void 0 ? void 0 : _a.type,
    );
  }
  migrateDataFromPreviousStorage() {
    const entries = state.storage.entries.value;
    Object.keys(entries).forEach(entry => {
      var _a, _b;
      const key = entry;
      const currentStorage = (_a = entries[key]) === null || _a === void 0 ? void 0 : _a.type;
      const curStore =
        (_b = this.storeManager) === null || _b === void 0
          ? void 0
          : _b.getStore(storageClientDataStoreNameMap[currentStorage]);
      const storages = [COOKIE_STORAGE, LOCAL_STORAGE, SESSION_STORAGE];
      storages.forEach(storage => {
        var _a;
        const store =
          (_a = this.storeManager) === null || _a === void 0
            ? void 0
            : _a.getStore(storageClientDataStoreNameMap[storage]);
        if (storage !== currentStorage && store) {
          if (curStore) {
            const value =
              store === null || store === void 0 ? void 0 : store.get(userSessionStorageKeys[key]);
            if (isDefinedNotNullAndNotEmptyString(value)) {
              curStore === null || curStore === void 0
                ? void 0
                : curStore.set(userSessionStorageKeys[key], value);
            }
          }
          store === null || store === void 0 ? void 0 : store.remove(userSessionStorageKeys[key]);
        }
      });
    });
  }
  migrateStorageIfNeeded() {
    var _a, _b, _c;
    if (!state.storage.migrate.value) {
      return;
    }
    const cookieStorage =
      (_a = this.storeManager) === null || _a === void 0
        ? void 0
        : _a.getStore(CLIENT_DATA_STORE_COOKIE);
    const localStorage =
      (_b = this.storeManager) === null || _b === void 0
        ? void 0
        : _b.getStore(CLIENT_DATA_STORE_LS);
    const sessionStorage =
      (_c = this.storeManager) === null || _c === void 0
        ? void 0
        : _c.getStore(CLIENT_DATA_STORE_SESSION);
    const stores = [];
    if (cookieStorage) {
      stores.push(cookieStorage);
    }
    if (localStorage) {
      stores.push(localStorage);
    }
    if (sessionStorage) {
      stores.push(sessionStorage);
    }
    Object.keys(userSessionStorageKeys).forEach(storageEntryKey => {
      const key = storageEntryKey;
      const storageEntry = userSessionStorageKeys[key];
      stores.forEach(store => {
        var _a;
        const migratedVal =
          (_a = this.pluginsManager) === null || _a === void 0
            ? void 0
            : _a.invokeSingle(
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
    var _a, _b, _c, _d;
    const sessionInfo =
      (_a = this.getSessionFromStorage()) !== null && _a !== void 0 ? _a : defaultSessionInfo;
    let finalAutoTrackingStatus = !(
      state.loadOptions.value.sessions.autoTrack === false || sessionInfo.manualTrack === true
    );
    let sessionTimeout;
    const configuredSessionTimeout = state.loadOptions.value.sessions.timeout;
    if (!isPositiveInteger(configuredSessionTimeout)) {
      (_b = this.logger) === null || _b === void 0
        ? void 0
        : _b.warn(
            TIMEOUT_NOT_NUMBER_WARNING(
              USER_SESSION_MANAGER,
              configuredSessionTimeout,
              DEFAULT_SESSION_TIMEOUT_MS,
            ),
          );
      sessionTimeout = DEFAULT_SESSION_TIMEOUT_MS;
    } else {
      sessionTimeout = configuredSessionTimeout;
    }
    if (sessionTimeout === 0) {
      (_c = this.logger) === null || _c === void 0
        ? void 0
        : _c.warn(TIMEOUT_ZERO_WARNING(USER_SESSION_MANAGER));
      finalAutoTrackingStatus = false;
    }
    // In case user provides a timeout value greater than 0 but less than 10 seconds SDK will show a warning
    // and will proceed with it
    if (sessionTimeout > 0 && sessionTimeout < MIN_SESSION_TIMEOUT_MS) {
      (_d = this.logger) === null || _d === void 0
        ? void 0
        : _d.warn(
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
  onError(error) {
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
  syncValueToStorage(sessionKey, value) {
    var _a, _b, _c;
    const entries = state.storage.entries.value;
    const storage = (_a = entries[sessionKey]) === null || _a === void 0 ? void 0 : _a.type;
    const key = (_b = entries[sessionKey]) === null || _b === void 0 ? void 0 : _b.key;
    if (isStorageTypeValidForStoringData(storage)) {
      const curStore =
        (_c = this.storeManager) === null || _c === void 0
          ? void 0
          : _c.getStore(storageClientDataStoreNameMap[storage]);
      if ((value && isString(value)) || isNonEmptyObject(value)) {
        curStore === null || curStore === void 0 ? void 0 : curStore.set(key, value);
      } else {
        curStore === null || curStore === void 0 ? void 0 : curStore.remove(key);
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
  setAnonymousId(anonymousId, rudderAmpLinkerParam) {
    var _a;
    let finalAnonymousId = anonymousId;
    if (this.isPersistenceEnabledForStorageEntry('anonymousId')) {
      if (!finalAnonymousId && rudderAmpLinkerParam) {
        const linkerPluginsResult =
          (_a = this.pluginsManager) === null || _a === void 0
            ? void 0
            : _a.invokeMultiple('userSession.anonymousIdGoogleLinker', rudderAmpLinkerParam);
        finalAnonymousId =
          linkerPluginsResult === null || linkerPluginsResult === void 0
            ? void 0
            : linkerPluginsResult[0];
      }
      state.session.anonymousId.value = finalAnonymousId || this.generateAnonymousId();
    }
  }
  /**
   * Generate a new anonymousId
   * @returns string anonymousID
   */
  generateAnonymousId() {
    return generateUUID();
  }
  /**
   * Fetches anonymousId
   * @param options option to fetch it from external source
   * @returns anonymousId
   */
  getAnonymousId(options) {
    var _a, _b, _c, _d;
    const storage =
      (_a = state.storage.entries.value.anonymousId) === null || _a === void 0 ? void 0 : _a.type;
    const key =
      (_b = state.storage.entries.value.anonymousId) === null || _b === void 0 ? void 0 : _b.key;
    let persistedAnonymousId;
    // fetch the anonymousId from storage
    if (isStorageTypeValidForStoringData(storage)) {
      const store =
        (_c = this.storeManager) === null || _c === void 0
          ? void 0
          : _c.getStore(storageClientDataStoreNameMap[storage]);
      persistedAnonymousId = store === null || store === void 0 ? void 0 : store.get(key);
      if (!persistedAnonymousId && options) {
        // fetch anonymousId from external source
        const autoCapturedAnonymousId =
          (_d = this.pluginsManager) === null || _d === void 0
            ? void 0
            : _d.invokeSingle('storage.getAnonymousId', getStorageEngine, options);
        persistedAnonymousId = autoCapturedAnonymousId;
      }
      state.session.anonymousId.value = persistedAnonymousId || this.generateAnonymousId();
    }
    return state.session.anonymousId.value;
  }
  getItem(sessionKey) {
    var _a, _b, _c, _d;
    const entries = state.storage.entries.value;
    const storage = (_a = entries[sessionKey]) === null || _a === void 0 ? void 0 : _a.type;
    const key = (_b = entries[sessionKey]) === null || _b === void 0 ? void 0 : _b.key;
    if (isStorageTypeValidForStoringData(storage)) {
      const store =
        (_c = this.storeManager) === null || _c === void 0
          ? void 0
          : _c.getStore(storageClientDataStoreNameMap[storage]);
      return (_d = store === null || store === void 0 ? void 0 : store.get(key)) !== null &&
        _d !== void 0
        ? _d
        : null;
    }
    return null;
  }
  /**
   * Fetches User Id
   * @returns
   */
  getUserId() {
    return this.getItem('userId');
  }
  /**
   * Fetches User Traits
   * @returns
   */
  getUserTraits() {
    return this.getItem('userTraits');
  }
  /**
   * Fetches Group Id
   * @returns
   */
  getGroupId() {
    return this.getItem('groupId');
  }
  /**
   * Fetches Group Traits
   * @returns
   */
  getGroupTraits() {
    return this.getItem('groupTraits');
  }
  /**
   * Fetches Initial Referrer
   * @returns
   */
  getInitialReferrer() {
    return this.getItem('initialReferrer');
  }
  /**
   * Fetches Initial Referring domain
   * @returns
   */
  getInitialReferringDomain() {
    return this.getItem('initialReferringDomain');
  }
  /**
   * Fetches session tracking information from storage
   * @returns
   */
  getSessionFromStorage() {
    return this.getItem('sessionInfo');
  }
  /**
   * Fetches auth token from storage
   * @returns
   */
  getAuthToken() {
    return this.getItem('authToken');
  }
  /**
   * If session is active it returns the sessionId
   * @returns
   */
  getSessionId() {
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
  refreshSession() {
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
  reset(resetAnonymousId, noNewSessionStart) {
    const { manualTrack, autoTrack } = state.session.sessionInfo.value;
    batch(() => {
      state.session.userId.value = defaultUserSessionValues.userId;
      state.session.userTraits.value = defaultUserSessionValues.userTraits;
      state.session.groupId.value = defaultUserSessionValues.groupId;
      state.session.groupTraits.value = defaultUserSessionValues.groupTraits;
      state.session.authToken.value = defaultUserSessionValues.authToken;
      if (resetAnonymousId) {
        // This will generate a new anonymous ID
        this.setAnonymousId();
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
  setUserId(userId) {
    if (this.isPersistenceEnabledForStorageEntry('userId')) {
      state.session.userId.value = userId;
    }
  }
  /**
   * Set user traits
   * @param traits
   */
  setUserTraits(traits) {
    var _a;
    if (this.isPersistenceEnabledForStorageEntry('userTraits') && traits) {
      state.session.userTraits.value = mergeDeepRight(
        (_a = state.session.userTraits.value) !== null && _a !== void 0 ? _a : {},
        traits,
      );
    }
  }
  /**
   * Set group Id
   * @param groupId
   */
  setGroupId(groupId) {
    if (this.isPersistenceEnabledForStorageEntry('groupId')) {
      state.session.groupId.value = groupId;
    }
  }
  /**
   * Set group traits
   * @param traits
   */
  setGroupTraits(traits) {
    var _a;
    if (this.isPersistenceEnabledForStorageEntry('groupTraits') && traits) {
      state.session.groupTraits.value = mergeDeepRight(
        (_a = state.session.groupTraits.value) !== null && _a !== void 0 ? _a : {},
        traits,
      );
    }
  }
  /**
   * Set initial referrer
   * @param referrer
   */
  setInitialReferrer(referrer) {
    if (this.isPersistenceEnabledForStorageEntry('initialReferrer')) {
      state.session.initialReferrer.value = referrer;
    }
  }
  /**
   * Set initial referring domain
   * @param {String} referringDomain
   */
  setInitialReferringDomain(referringDomain) {
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
      const timeout = state.session.sessionInfo.value.timeout;
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
  start(id) {
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
  setAuthToken(token) {
    if (this.isPersistenceEnabledForStorageEntry('authToken')) {
      state.session.authToken.value = token;
    }
  }
}
export { UserSessionManager };
