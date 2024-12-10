/* eslint-disable class-methods-use-this */
import { batch, effect } from '@preact/signals-core';
import {
  isNonEmptyObject,
  isObjectLiteralAndNotNull,
  mergeDeepRight,
} from '@rudderstack/analytics-js-common/utilities/object';
import {
  isDefinedAndNotNull,
  isDefinedNotNullAndNotEmptyString,
  isNullOrUndefined,
  isString,
} from '@rudderstack/analytics-js-common/utilities/checks';
import type { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import type { IStore, IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { SessionInfo } from '@rudderstack/analytics-js-common/types/Session';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import type { ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
import type { AnonymousIdOptions } from '@rudderstack/analytics-js-common/types/LoadOptions';
import { USER_SESSION_MANAGER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import type { StorageType } from '@rudderstack/analytics-js-common/types/Storage';
import {
  COOKIE_STORAGE,
  LOCAL_STORAGE,
  SESSION_STORAGE,
} from '@rudderstack/analytics-js-common/constants/storages';
import type { UserSessionKey } from '@rudderstack/analytics-js-common/types/UserSessionStorage';
import type { StorageEntries } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type {
  AsyncRequestCallback,
  IHttpClient,
} from '@rudderstack/analytics-js-common/types/HttpClient';
import { stringifyWithoutCircular } from '@rudderstack/analytics-js-common/utilities/json';
import { COOKIE_KEYS } from '@rudderstack/analytics-js-cookies/constants/cookies';
import {
  CLIENT_DATA_STORE_COOKIE,
  CLIENT_DATA_STORE_LS,
  CLIENT_DATA_STORE_SESSION,
  USER_SESSION_KEYS,
} from '../../constants/storage';
import { storageClientDataStoreNameMap } from '../../services/StoreManager/types';
import { DEFAULT_SESSION_TIMEOUT_MS, MIN_SESSION_TIMEOUT_MS } from '../../constants/timeouts';
import { defaultSessionConfiguration } from '../../state/slices/session';
import { state } from '../../state';
import { getStorageEngine } from '../../services/StoreManager/storages';
import {
  DATA_SERVER_REQUEST_FAIL_ERROR,
  FAILED_SETTING_COOKIE_FROM_SERVER_ERROR,
  FAILED_SETTING_COOKIE_FROM_SERVER_GLOBAL_ERROR,
  TIMEOUT_NOT_NUMBER_WARNING,
  TIMEOUT_NOT_RECOMMENDED_WARNING,
  TIMEOUT_ZERO_WARNING,
} from '../../constants/logMessages';
import {
  generateAnonymousId,
  generateAutoTrackingSession,
  generateManualTrackingSession,
  hasSessionExpired,
  isStorageTypeValidForStoringData,
} from './utils';
import { getReferringDomain } from '../utilities/url';
import { getReferrer } from '../utilities/page';
import { DEFAULT_USER_SESSION_VALUES, SERVER_SIDE_COOKIES_DEBOUNCE_TIME } from './constants';
import type {
  CallbackFunction,
  CookieData,
  EncryptedCookieData,
  IUserSessionManager,
  UserSessionStorageKeysType,
} from './types';
import { isPositiveInteger } from '../utilities/number';

class UserSessionManager implements IUserSessionManager {
  storeManager?: IStoreManager;
  pluginsManager?: IPluginsManager;
  errorHandler?: IErrorHandler;
  httpClient?: IHttpClient;
  logger?: ILogger;
  serverSideCookieDebounceFuncs: Record<UserSessionKey, number>;

  constructor(
    errorHandler?: IErrorHandler,
    logger?: ILogger,
    pluginsManager?: IPluginsManager,
    storeManager?: IStoreManager,
    httpClient?: IHttpClient,
  ) {
    this.storeManager = storeManager;
    this.pluginsManager = pluginsManager;
    this.logger = logger;
    this.errorHandler = errorHandler;
    this.httpClient = httpClient;
    this.onError = this.onError.bind(this);
    this.serverSideCookieDebounceFuncs = {} as Record<UserSessionKey, number>;
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
    this.setUserId(this.getUserId());
    this.setUserTraits(this.getUserTraits());
    this.setGroupId(this.getGroupId());
    this.setGroupTraits(this.getGroupTraits());
    const { externalAnonymousIdCookieName, anonymousIdOptions } = state.loadOptions.value;
    let externalAnonymousId;
    if (
      isDefinedAndNotNull(externalAnonymousIdCookieName) &&
      typeof externalAnonymousIdCookieName === 'string'
    ) {
      externalAnonymousId = this.getExternalAnonymousIdByCookieName(externalAnonymousIdCookieName);
    }
    this.setAnonymousId(externalAnonymousId ?? this.getAnonymousId(anonymousIdOptions));
    this.setAuthToken(this.getAuthToken());
    this.setInitialReferrerInfo();
    this.configureSessionTracking();
  }

  configureSessionTracking() {
    let sessionInfo = this.getSessionInfo();
    if (this.isPersistenceEnabledForStorageEntry('sessionInfo')) {
      const configuredSessionTrackingInfo = this.getConfiguredSessionTrackingInfo();
      const initialSessionInfo = sessionInfo ?? defaultSessionConfiguration;
      sessionInfo = {
        ...initialSessionInfo,
        ...configuredSessionTrackingInfo,
        // If manualTrack is set to true in the storage, then autoTrack should be false
        autoTrack:
          configuredSessionTrackingInfo.autoTrack && initialSessionInfo.manualTrack !== true,
      };
      // If both autoTrack and manualTrack are disabled, reset the session info to default values
      if (!sessionInfo.autoTrack && sessionInfo.manualTrack !== true) {
        sessionInfo = DEFAULT_USER_SESSION_VALUES.sessionInfo;
      }
    } else {
      sessionInfo = DEFAULT_USER_SESSION_VALUES.sessionInfo;
    }

    state.session.sessionInfo.value = sessionInfo as SessionInfo;

    // If auto session tracking is enabled start the session tracking
    if (state.session.sessionInfo.value.autoTrack) {
      this.startOrRenewAutoTracking(state.session.sessionInfo.value);
    }
  }

  setInitialReferrerInfo() {
    const persistedInitialReferrer = this.getInitialReferrer();
    const persistedInitialReferringDomain = this.getInitialReferringDomain();

    if (persistedInitialReferrer && persistedInitialReferringDomain) {
      this.setInitialReferrer(persistedInitialReferrer);
      this.setInitialReferringDomain(persistedInitialReferringDomain);
    } else {
      // eslint-disable-next-line sonarjs/prefer-nullish-coalescing
      const initialReferrer = persistedInitialReferrer || getReferrer();
      this.setInitialReferrer(initialReferrer);
      this.setInitialReferringDomain(getReferringDomain(initialReferrer));
    }
  }

  isPersistenceEnabledForStorageEntry(entryName: UserSessionKey): boolean {
    return isStorageTypeValidForStoringData(
      state.storage.entries.value[entryName]?.type as StorageType,
    );
  }

  migrateDataFromPreviousStorage() {
    const entries = state.storage.entries.value as StorageEntries;
    const storageTypesForMigration = [COOKIE_STORAGE, LOCAL_STORAGE, SESSION_STORAGE];
    Object.keys(entries).forEach(entry => {
      const key = entry as UserSessionStorageKeysType;
      const currentStorage = entries[key]?.type as StorageType;
      const curStore = this.storeManager?.getStore(
        storageClientDataStoreNameMap[currentStorage] as string,
      );
      if (curStore) {
        storageTypesForMigration.forEach(storage => {
          const store = this.storeManager?.getStore(
            storageClientDataStoreNameMap[storage] as string,
          );
          if (store && storage !== currentStorage) {
            const value = store.get(COOKIE_KEYS[key]);
            if (isDefinedNotNullAndNotEmptyString(value)) {
              curStore.set(COOKIE_KEYS[key], value);
            }

            store.remove(COOKIE_KEYS[key]);
          }
        });
      }
    });
  }

  migrateStorageIfNeeded() {
    if (!state.storage.migrate.value) {
      return;
    }

    const persistentStoreNames = [
      CLIENT_DATA_STORE_COOKIE,
      CLIENT_DATA_STORE_LS,
      CLIENT_DATA_STORE_SESSION,
    ];

    const stores: IStore[] = [];
    persistentStoreNames.forEach(storeName => {
      const store = this.storeManager?.getStore(storeName);
      if (store) {
        stores.push(store);
      }
    });

    Object.keys(COOKIE_KEYS).forEach(storageKey => {
      const storageEntry = COOKIE_KEYS[storageKey as UserSessionStorageKeysType];
      stores.forEach(store => {
        const migratedVal = this.pluginsManager?.invokeSingle(
          'storage.migrate',
          storageEntry,
          store.getOriginalEngine(),
          this.errorHandler,
          this.logger,
        );

        // Skip setting the value if it is null or undefined
        // as those values indicate there is no need for migration or
        // migration failed
        if (!isNullOrUndefined(migratedVal)) {
          store.set(storageEntry, migratedVal);
        }
      });
    });
  }

  getConfiguredSessionTrackingInfo(): SessionInfo {
    let autoTrack = state.loadOptions.value.sessions?.autoTrack !== false;

    // Do not validate any further if autoTrack is disabled
    if (!autoTrack) {
      return {
        autoTrack,
      };
    }

    let timeout: number;
    const configuredSessionTimeout = state.loadOptions.value.sessions?.timeout;
    if (!isPositiveInteger(configuredSessionTimeout)) {
      this.logger?.warn(
        TIMEOUT_NOT_NUMBER_WARNING(
          USER_SESSION_MANAGER,
          configuredSessionTimeout,
          DEFAULT_SESSION_TIMEOUT_MS,
        ),
      );
      timeout = DEFAULT_SESSION_TIMEOUT_MS;
    } else {
      timeout = configuredSessionTimeout as number;
    }

    if (timeout === 0) {
      this.logger?.warn(TIMEOUT_ZERO_WARNING(USER_SESSION_MANAGER));
      autoTrack = false;
    }
    // In case user provides a timeout value greater than 0 but less than 10 seconds SDK will show a warning
    // and will proceed with it
    if (timeout > 0 && timeout < MIN_SESSION_TIMEOUT_MS) {
      this.logger?.warn(
        TIMEOUT_NOT_RECOMMENDED_WARNING(USER_SESSION_MANAGER, timeout, MIN_SESSION_TIMEOUT_MS),
      );
    }
    return { timeout, autoTrack };
  }

  /**
   * Handles error
   * @param error The error object
   */
  onError(error: any, customMessage?: string): void {
    if (this.errorHandler) {
      this.errorHandler.onError(error, USER_SESSION_MANAGER, customMessage);
    } else {
      throw error;
    }
  }

  /**
   * A function to encrypt the cookie value and return the encrypted data
   * @param cookiesData
   * @param store
   * @returns
   */
  getEncryptedCookieData(cookiesData: CookieData[], store?: IStore): EncryptedCookieData[] {
    const encryptedCookieData: EncryptedCookieData[] = [];
    cookiesData.forEach(cData => {
      const encryptedValue = store?.encrypt(
        stringifyWithoutCircular(cData.value, false, [], this.logger),
      );
      if (isDefinedAndNotNull(encryptedValue)) {
        encryptedCookieData.push({
          name: cData.name,
          value: encryptedValue,
        });
      }
    });
    return encryptedCookieData;
  }

  /**
   * A function that makes request to data service to set the cookie
   * @param encryptedCookieData
   * @param callback
   */
  makeRequestToSetCookie(
    encryptedCookieData: EncryptedCookieData[],
    callback: AsyncRequestCallback<any>,
  ) {
    this.httpClient?.request({
      url: state.serverCookies.dataServiceUrl.value as string,
      options: {
        method: 'POST',
        body: stringifyWithoutCircular({
          reqType: 'setCookies',
          workspaceId: state.source.value?.workspaceId,
          data: {
            options: {
              maxAge: state.storage.cookie.value?.maxage,
              path: state.storage.cookie.value?.path,
              domain: state.storage.cookie.value?.domain,
              sameSite: state.storage.cookie.value?.samesite,
              secure: state.storage.cookie.value?.secure,
              expires: state.storage.cookie.value?.expires,
            },
            cookies: encryptedCookieData,
          },
        }),
        useAuth: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
      },
      isRawResponse: true,
      callback,
    });
  }

  /**
   * A function to make an external request to set the cookie from server side
   * @param key       cookie name
   * @param value     encrypted cookie value
   */
  setServerSideCookies(cookiesData: CookieData[], cb?: CallbackFunction, store?: IStore): void {
    try {
      // encrypt cookies values
      const encryptedCookieData = this.getEncryptedCookieData(cookiesData, store);
      if (encryptedCookieData.length > 0) {
        // make request to data service to set the cookie from server side
        this.makeRequestToSetCookie(encryptedCookieData, (res, details) => {
          if (details.error) {
            this.logger?.error(DATA_SERVER_REQUEST_FAIL_ERROR(details.error.status));
            cookiesData.forEach(each => {
              if (cb) {
                cb(each.name, each.value);
              }
            });
          } else {
            cookiesData.forEach(cData => {
              const cookieValue = store?.get(cData.name);
              const before = stringifyWithoutCircular(cData.value, false, []);
              const after = stringifyWithoutCircular(cookieValue, false, []);
              if (after !== before) {
                this.logger?.error(FAILED_SETTING_COOKIE_FROM_SERVER_ERROR(cData.name));
                if (cb) {
                  cb(cData.name, cData.value);
                }
              }
            });
          }
        });
      }
    } catch (e) {
      this.onError(e, FAILED_SETTING_COOKIE_FROM_SERVER_GLOBAL_ERROR);
      cookiesData.forEach(each => {
        if (cb) {
          cb(each.name, each.value);
        }
      });
    }
  }

  /**
   * A function to sync values in storage
   * @param sessionKey
   * @param value
   */
  syncValueToStorage(
    sessionKey: UserSessionKey,
    value: Nullable<ApiObject> | Nullable<string> | undefined,
  ) {
    const entries = state.storage.entries.value;
    const storageType = entries[sessionKey]?.type as StorageType;
    if (isStorageTypeValidForStoringData(storageType)) {
      const curStore = this.storeManager?.getStore(
        storageClientDataStoreNameMap[storageType] as string,
      );
      const key = entries[sessionKey]?.key as string;
      if (value && (isString(value) || isNonEmptyObject(value))) {
        // if useServerSideCookies load option is set to true
        // set the cookie from server side
        if (
          state.serverCookies.isEnabledServerSideCookies.value &&
          storageType === COOKIE_STORAGE
        ) {
          if (this.serverSideCookieDebounceFuncs[sessionKey]) {
            (globalThis as typeof window).clearTimeout(
              this.serverSideCookieDebounceFuncs[sessionKey],
            );
          }

          this.serverSideCookieDebounceFuncs[sessionKey] = (globalThis as typeof window).setTimeout(
            () => {
              this.setServerSideCookies(
                [{ name: key, value }],
                (cookieName, cookieValue) => {
                  curStore?.set(cookieName, cookieValue);
                },
                curStore,
              );
            },
            SERVER_SIDE_COOKIES_DEBOUNCE_TIME,
          );
        } else {
          curStore?.set(key, value);
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
    // This will work as long as the user session entry key names are same as the state keys
    USER_SESSION_KEYS.forEach(sessionKey => {
      effect(() => {
        this.syncValueToStorage(sessionKey, state.session[sessionKey].value);
      });
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
    let finalAnonymousId: string | undefined = anonymousId;
    if (!isString(anonymousId) || !finalAnonymousId) {
      finalAnonymousId = undefined;
    }

    if (this.isPersistenceEnabledForStorageEntry('anonymousId')) {
      if (!finalAnonymousId && rudderAmpLinkerParam) {
        const linkerPluginsResult = this.pluginsManager?.invokeSingle(
          'userSession.anonymousIdGoogleLinker',
          rudderAmpLinkerParam,
        );
        finalAnonymousId = linkerPluginsResult;
      }
      // finalAnonymousId can also be an empty string
      // eslint-disable-next-line sonarjs/prefer-nullish-coalescing
      finalAnonymousId = finalAnonymousId || generateAnonymousId();
    } else {
      finalAnonymousId = DEFAULT_USER_SESSION_VALUES.anonymousId;
    }

    state.session.anonymousId.value = finalAnonymousId;
  }

  /**
   * Fetches anonymousId
   * @param options option to fetch it from external source
   * @returns anonymousId
   */
  getAnonymousId(options?: AnonymousIdOptions): string {
    const storage: StorageType = state.storage.entries.value.anonymousId?.type as StorageType;
    // fetch the anonymousId from storage
    if (isStorageTypeValidForStoringData(storage)) {
      let persistedAnonymousId = this.getEntryValue('anonymousId');
      if (!persistedAnonymousId && options) {
        // fetch anonymousId from external source
        const autoCapturedAnonymousId = this.pluginsManager?.invokeSingle<string | undefined>(
          'storage.getAnonymousId',
          getStorageEngine,
          options,
        );
        persistedAnonymousId = autoCapturedAnonymousId;
      }
      state.session.anonymousId.value = persistedAnonymousId || generateAnonymousId();
    }
    return state.session.anonymousId.value as string;
  }

  getEntryValue(sessionKey: UserSessionKey) {
    const entries = state.storage.entries.value;
    const storageType = entries[sessionKey]?.type as StorageType;
    if (isStorageTypeValidForStoringData(storageType)) {
      const store = this.storeManager?.getStore(
        storageClientDataStoreNameMap[storageType] as string,
      );
      const storageKey = entries[sessionKey]?.key as string;
      return store?.get(storageKey) ?? null;
    }
    return null;
  }

  getExternalAnonymousIdByCookieName(key: string) {
    const storageEngine = getStorageEngine(COOKIE_STORAGE);
    if (storageEngine?.isEnabled) {
      return storageEngine.getItem(key) ?? null;
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
  getSessionInfo(): Nullable<SessionInfo> {
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
    const sessionInfo = this.getSessionInfo() ?? DEFAULT_USER_SESSION_VALUES.sessionInfo;
    if (
      (sessionInfo.autoTrack && !hasSessionExpired(sessionInfo.expiresAt)) ||
      sessionInfo.manualTrack
    ) {
      return sessionInfo.id ?? null;
    }
    return null;
  }

  /**
   * A function to keep the session information up to date in the state
   * before using it for building event payloads.
   */
  refreshSession(): void {
    let sessionInfo = this.getSessionInfo() ?? DEFAULT_USER_SESSION_VALUES.sessionInfo;
    if (sessionInfo.autoTrack || sessionInfo.manualTrack) {
      if (sessionInfo.autoTrack) {
        this.startOrRenewAutoTracking(sessionInfo);
        sessionInfo = state.session.sessionInfo.value;
      }

      // Note that if sessionStart is false, then it's an active session.
      // So, we needn't update the session info.
      //
      // For other scenarios,
      // 1. If sessionStart is undefined, then it's a new session.
      //   Mark it as sessionStart.
      // 2. If sessionStart is true, then need to flip it for the future events.
      if (sessionInfo.sessionStart === undefined) {
        sessionInfo = {
          ...sessionInfo,
          sessionStart: true,
        };
      } else if (sessionInfo.sessionStart) {
        sessionInfo = {
          ...sessionInfo,
          sessionStart: false,
        };
      }
    }

    // Always write to state (in-turn to storage) to keep the session info up to date.
    state.session.sessionInfo.value = sessionInfo;

    if (state.lifecycle.status.value !== 'readyExecuted') {
      // Force update the storage as the 'effect' blocks are not getting triggered
      // when processing preload buffered requests
      this.syncValueToStorage('sessionInfo', sessionInfo);
    }
  }

  /**
   * Reset state values
   * @param resetAnonymousId
   * @param noNewSessionStart
   * @returns
   */
  reset(resetAnonymousId?: boolean, noNewSessionStart?: boolean) {
    const { session } = state;
    const { manualTrack, autoTrack } = session.sessionInfo.value;

    batch(() => {
      session.userId.value = DEFAULT_USER_SESSION_VALUES.userId;
      session.userTraits.value = DEFAULT_USER_SESSION_VALUES.userTraits;
      session.groupId.value = DEFAULT_USER_SESSION_VALUES.groupId;
      session.groupTraits.value = DEFAULT_USER_SESSION_VALUES.groupTraits;
      session.authToken.value = DEFAULT_USER_SESSION_VALUES.authToken;

      if (resetAnonymousId === true) {
        // This will generate a new anonymous ID
        this.setAnonymousId();
      }

      if (noNewSessionStart) {
        return;
      }

      if (autoTrack) {
        session.sessionInfo.value = DEFAULT_USER_SESSION_VALUES.sessionInfo;
        this.startOrRenewAutoTracking(session.sessionInfo.value);
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
    state.session.userId.value =
      this.isPersistenceEnabledForStorageEntry('userId') && userId
        ? userId
        : DEFAULT_USER_SESSION_VALUES.userId;
  }

  /**
   * Set user traits
   * @param traits
   */
  setUserTraits(traits?: Nullable<ApiObject>) {
    state.session.userTraits.value =
      this.isPersistenceEnabledForStorageEntry('userTraits') && isObjectLiteralAndNotNull(traits)
        ? mergeDeepRight(
            state.session.userTraits.value ?? DEFAULT_USER_SESSION_VALUES.userTraits,
            traits as ApiObject,
          )
        : DEFAULT_USER_SESSION_VALUES.userTraits;
  }

  /**
   * Set group Id
   * @param groupId
   */
  setGroupId(groupId?: Nullable<string>) {
    state.session.groupId.value =
      this.isPersistenceEnabledForStorageEntry('groupId') && groupId
        ? groupId
        : DEFAULT_USER_SESSION_VALUES.groupId;
  }

  /**
   * Set group traits
   * @param traits
   */
  setGroupTraits(traits?: Nullable<ApiObject>) {
    state.session.groupTraits.value =
      this.isPersistenceEnabledForStorageEntry('groupTraits') && isObjectLiteralAndNotNull(traits)
        ? mergeDeepRight(
            state.session.groupTraits.value ?? DEFAULT_USER_SESSION_VALUES.groupTraits,
            traits as ApiObject,
          )
        : DEFAULT_USER_SESSION_VALUES.groupTraits;
  }

  /**
   * Set initial referrer
   * @param referrer
   */
  setInitialReferrer(referrer?: string) {
    state.session.initialReferrer.value =
      this.isPersistenceEnabledForStorageEntry('initialReferrer') && referrer
        ? referrer
        : DEFAULT_USER_SESSION_VALUES.initialReferrer;
  }

  /**
   * Set initial referring domain
   * @param {String} referringDomain
   */
  setInitialReferringDomain(referringDomain?: string) {
    state.session.initialReferringDomain.value =
      this.isPersistenceEnabledForStorageEntry('initialReferringDomain') && referringDomain
        ? referringDomain
        : DEFAULT_USER_SESSION_VALUES.initialReferringDomain;
  }

  /**
   * A function to check for existing session details and depending on that create a new session
   */
  startOrRenewAutoTracking(sessionInfo: SessionInfo) {
    if (hasSessionExpired(sessionInfo.expiresAt)) {
      state.session.sessionInfo.value = generateAutoTrackingSession(sessionInfo.timeout);
    } else {
      const timestamp = Date.now();
      const timeout = sessionInfo.timeout as number;
      state.session.sessionInfo.value = mergeDeepRight(sessionInfo, {
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
    state.session.sessionInfo.value = DEFAULT_USER_SESSION_VALUES.sessionInfo;
  }

  /**
   * Set auth token
   * @param userId
   */
  setAuthToken(token: Nullable<string>) {
    state.session.authToken.value =
      this.isPersistenceEnabledForStorageEntry('authToken') && token
        ? token
        : DEFAULT_USER_SESSION_VALUES.authToken;
  }
}

export { UserSessionManager };
