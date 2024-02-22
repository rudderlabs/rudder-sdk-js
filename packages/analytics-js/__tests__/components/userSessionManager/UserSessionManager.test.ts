import type { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { UserSessionManager } from '../../../src/components/userSessionManager';
import {
  DEFAULT_USER_SESSION_VALUES,
  USER_SESSION_STORAGE_KEYS,
} from '../../../src/components/userSessionManager/constants';
import { StoreManager } from '../../../src/services/StoreManager';
import type { Store } from '../../../src/services/StoreManager/Store';
import { state, resetState } from '../../../src/state';
import { DEFAULT_SESSION_TIMEOUT_MS } from '../../../src/constants/timeouts';
import { defaultLogger } from '../../../src/services/Logger';
import { defaultErrorHandler } from '../../../src/services/ErrorHandler';
import { PluginsManager } from '../../../src/components/pluginsManager';
import { defaultPluginEngine } from '../../../src/services/PluginEngine';
import {
  anonymousIdWithNoStorageEntries,
  entriesWithMixStorageButWithoutNone,
  entriesWithOnlyCookieStorage,
  entriesWithOnlyLocalStorage,
  entriesWithOnlyNoStorage,
  entriesWithStorageOnlyForAnonymousId,
} from '../../../__fixtures__/fixtures';

jest.mock('@rudderstack/analytics-js-common/utilities/uuId', () => ({
  generateUUID: jest.fn().mockReturnValue('test_uuid'),
}));

describe('User session manager', () => {
  const dummyAnonymousId = 'dummy-anonymousId-12345678';
  defaultLogger.warn = jest.fn();
  defaultLogger.error = jest.fn();

  const defaultPluginsManager = new PluginsManager(
    defaultPluginEngine,
    defaultErrorHandler,
    defaultLogger,
  );
  const defaultStoreManager = new StoreManager(
    defaultPluginsManager,
    defaultErrorHandler,
    defaultLogger,
  );

  let userSessionManager: UserSessionManager;

  defaultStoreManager.init();
  const clientDataStoreCookie = defaultStoreManager.getStore('clientDataInCookie') as Store;
  const clientDataStoreLS = defaultStoreManager.getStore('clientDataInLocalStorage') as Store;
  const clientDataStoreSession = defaultStoreManager.getStore(
    'clientDataInSessionStorage',
  ) as Store;

  const setDataInLocalStorage = (data: any) => {
    Object.entries(data).forEach(([key, value]) => {
      clientDataStoreLS.set(key, value);
    });
  };

  const setDataInCookieStorage = (data: any) => {
    Object.entries(data).forEach(([key, value]) => {
      clientDataStoreCookie.set(key, value);
    });
  };

  const setDataInCookieStorageEngine = (data: any) => {
    Object.entries(data).forEach(([key, value]) => {
      clientDataStoreCookie.engine.setItem(key, value);
    });
  };

  const clearStorage = () => {
    Object.values(USER_SESSION_STORAGE_KEYS).forEach(key => {
      clientDataStoreCookie.remove(key);
      clientDataStoreLS.remove(key);
      clientDataStoreSession.remove(key);
    });
  };

  beforeEach(() => {
    clearStorage();
    resetState();
    userSessionManager = new UserSessionManager(
      defaultErrorHandler,
      defaultLogger,
      defaultPluginsManager,
      defaultStoreManager,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('syncStorageDataToState', () => {
    it('should modify the state and storage appropriately once storage options are modified after initialization', () => {
      const customData = {
        rl_anonymous_id: 'dummy-anonymousId',
      };
      setDataInCookieStorage(customData);

      state.loadOptions.value.sessions = {
        autoTrack: true,
        timeout: 10000,
      };
      state.storage.entries.value = entriesWithStorageOnlyForAnonymousId;
      userSessionManager.init();

      // Modify the storage options and re-align state and storage
      state.storage.entries.value = entriesWithMixStorageButWithoutNone;
      userSessionManager.syncStorageDataToState();

      expect(state.session.userId.value).toBe(DEFAULT_USER_SESSION_VALUES.userId);
      expect(state.session.userTraits.value).toStrictEqual(DEFAULT_USER_SESSION_VALUES.userTraits);
      expect(state.session.groupId.value).toBe(DEFAULT_USER_SESSION_VALUES.groupId);
      expect(state.session.groupTraits.value).toStrictEqual(
        DEFAULT_USER_SESSION_VALUES.groupTraits,
      );
      expect(state.session.initialReferrer.value).toBe('$direct');
      expect(state.session.initialReferringDomain.value).toBe('');
      // Auto-tracking should resume post consent
      expect(state.session.sessionInfo.value).toStrictEqual({
        autoTrack: true,
        expiresAt: expect.any(Number),
        id: expect.any(Number),
        sessionStart: undefined,
        timeout: 10000, // TODO: fix this after this entry is removed from state
      });
      // This also covers the data migration from previous storage to current
      expect(state.session.anonymousId.value).toBe(customData.rl_anonymous_id);
      expect(state.session.authToken.value).toBe(DEFAULT_USER_SESSION_VALUES.authToken);
    });
    it('should set anonymousId from external name if externalAnonymousIdCookieName load option is provided', () => {
      const customData = {
        rl_anonymous_id: 'dummy-anonymousId',
      };
      setDataInCookieStorage(customData);
      state.loadOptions.value.externalAnonymousIdCookieName = 'anonId';
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      const spy = jest.spyOn(userSessionManager, 'getExternalAnonymousIdByCookieName');
      userSessionManager.syncStorageDataToState();
      expect(spy).toHaveBeenCalledWith('anonId');
    });
    it('should set anonymousId with existing logic if external name is not string', () => {
      const customData = {
        rl_anonymous_id: 'dummy-anonymousId',
      };
      setDataInCookieStorage(customData);
      state.loadOptions.value.externalAnonymousIdCookieName = 12345;
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      const spy = jest.spyOn(userSessionManager, 'getExternalAnonymousIdByCookieName');

      userSessionManager.syncStorageDataToState();

      expect(spy).not.toHaveBeenCalled();
      expect(state.session.anonymousId.value).toBe('dummy-anonymousId');
    });
    it('should set anonymousId with existing logic if external name is null', () => {
      const customData = {
        rl_anonymous_id: 'dummy-anonymousId',
      };
      setDataInCookieStorage(customData);
      state.loadOptions.value.externalAnonymousIdCookieName = null;
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      const spy = jest.spyOn(userSessionManager, 'getExternalAnonymousIdByCookieName');

      userSessionManager.syncStorageDataToState();

      expect(spy).not.toHaveBeenCalled();
      expect(state.session.anonymousId.value).toBe('dummy-anonymousId');
    });
    it('should set anonymousId with existing logic if external name is undefined', () => {
      const customData = {
        rl_anonymous_id: 'dummy-anonymousId',
      };
      setDataInCookieStorage(customData);
      state.loadOptions.value.externalAnonymousIdCookieName = undefined;
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      const spy = jest.spyOn(userSessionManager, 'getExternalAnonymousIdByCookieName');

      userSessionManager.syncStorageDataToState();

      expect(spy).not.toHaveBeenCalled();
      expect(state.session.anonymousId.value).toBe('dummy-anonymousId');
    });
    it('should set anonymousId with existing logic if anonymousId fetch by the external name is null', () => {
      const customData = {
        rl_anonymous_id: 'dummy-anonymousId',
      };
      setDataInCookieStorage(customData);
      state.loadOptions.value.externalAnonymousIdCookieName = 'anonId';
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.getExternalAnonymousIdByCookieName = jest.fn(() => null);
      userSessionManager.syncStorageDataToState();
      expect(state.session.anonymousId.value).toBe('dummy-anonymousId');
    });
  });

  describe('init', () => {
    it('should migrate legacy storage data if migration is enabled', () => {
      const customData = {
        rl_user_id:
          'RudderEncrypt%3AU2FsdGVkX1%2FSIc%2F%2FsRy9t3CPVe54IHncEARgbMhX7xkKDtO%2BVtg%2BW1mjeAF1v%2Fp5', // '"1wefk7M3Y1D6EDX4ZpIE00LpKAE"'
        rl_trait:
          'RudderEncrypt%3AU2FsdGVkX19T0ItDzfT%2FZwWZ8wg4za9jcxyhSM4ZvWvkZCGeDekKc1%2B6l6i19bw8xv4YrtR8IBMp0SJBw76cbg%3D%3D', // '{email: 'saibattinoju@rudderstack.com'}'
        rl_anonymous_id:
          'RudderEncrypt%3AU2FsdGVkX19GLIcQTLgTdMu3NH14EwwTTK0ih%2BouACRQVDSrmYeVNe3vzF6W9oh0UzjgEf8N%2Fvxy%2BE%2F2BzIHuA%3D%3D', // '"bc9597ae-117e-4857-9d85-f02719b73239"'
        // V3 encrypted
        rl_page_init_referrer:
          'RS_ENC_v3_Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMS9jZG4vbW9kZXJuL2lpZmUvaW5kZXguaHRtbCI%3D', // '"$direct"
        // empty string
        rl_group_id: 'RudderEncrypt%3AU2FsdGVkX19AHpnwm%2FJMyd%2Bu1Vq88KBjUYM0AsZnu8Q%3D', // '""'
      };

      class MockPluginsManager implements IPluginsManager {
        invokeSingle = jest.fn(() => ''); // always return empty string
      }

      const mockPluginsManager = new MockPluginsManager();

      const storeManager = new StoreManager(
        defaultPluginsManager,
        defaultErrorHandler,
        defaultLogger,
      );

      storeManager.init();

      userSessionManager = new UserSessionManager(
        defaultErrorHandler,
        defaultLogger,
        mockPluginsManager,
        storeManager,
      );

      setDataInCookieStorageEngine(customData);

      // Enable migration
      state.storage.migrate.value = true;
      state.storage.entries.value = entriesWithOnlyCookieStorage;

      defaultPluginsManager.init();

      const invokeSpy = mockPluginsManager.invokeSingle;
      const extensionPoint = 'storage.migrate';

      userSessionManager.init();

      expect(invokeSpy).toHaveBeenCalledWith(
        extensionPoint,
        'rl_user_id',
        clientDataStoreCookie.engine,
        defaultErrorHandler,
        defaultLogger,
      );
      expect(invokeSpy).toHaveBeenCalledWith(
        extensionPoint,
        'rl_trait',
        clientDataStoreCookie.engine,
        defaultErrorHandler,
        defaultLogger,
      );
      expect(invokeSpy).toHaveBeenCalledWith(
        extensionPoint,
        'rl_anonymous_id',
        clientDataStoreCookie.engine,
        defaultErrorHandler,
        defaultLogger,
      );
      expect(invokeSpy).toHaveBeenCalledWith(
        extensionPoint,
        'rl_group_id',
        clientDataStoreCookie.engine,
        defaultErrorHandler,
        defaultLogger,
      );
      expect(invokeSpy).toHaveBeenCalledWith(
        extensionPoint,
        'rl_group_trait',
        clientDataStoreCookie.engine,
        defaultErrorHandler,
        defaultLogger,
      );
      expect(invokeSpy).toHaveBeenCalledWith(
        extensionPoint,
        'rl_page_init_referrer',
        clientDataStoreCookie.engine,
        defaultErrorHandler,
        defaultLogger,
      );
      expect(invokeSpy).toHaveBeenCalledWith(
        extensionPoint,
        'rl_page_init_referring_domain',
        clientDataStoreCookie.engine,
        defaultErrorHandler,
        defaultLogger,
      );
      expect(invokeSpy).toHaveBeenCalledWith(
        extensionPoint,
        'rl_session',
        clientDataStoreCookie.engine,
        defaultErrorHandler,
        defaultLogger,
      );
      expect(invokeSpy).toHaveBeenCalledWith(
        extensionPoint,
        'rl_user_id',
        clientDataStoreLS.engine,
        defaultErrorHandler,
        defaultLogger,
      );
      expect(invokeSpy).toHaveBeenCalledWith(
        extensionPoint,
        'rl_trait',
        clientDataStoreLS.engine,
        defaultErrorHandler,
        defaultLogger,
      );
      expect(invokeSpy).toHaveBeenCalledWith(
        extensionPoint,
        'rl_anonymous_id',
        clientDataStoreLS.engine,
        defaultErrorHandler,
        defaultLogger,
      );
      expect(invokeSpy).toHaveBeenCalledWith(
        extensionPoint,
        'rl_group_id',
        clientDataStoreLS.engine,
        defaultErrorHandler,
        defaultLogger,
      );
      expect(invokeSpy).toHaveBeenCalledWith(
        extensionPoint,
        'rl_group_trait',
        clientDataStoreLS.engine,
        defaultErrorHandler,
        defaultLogger,
      );
      expect(invokeSpy).toHaveBeenCalledWith(
        extensionPoint,
        'rl_page_init_referrer',
        clientDataStoreLS.engine,
        defaultErrorHandler,
        defaultLogger,
      );
      expect(invokeSpy).toHaveBeenCalledWith(
        extensionPoint,
        'rl_page_init_referring_domain',
        clientDataStoreLS.engine,
        defaultErrorHandler,
        defaultLogger,
      );
      expect(invokeSpy).toHaveBeenCalledWith(
        extensionPoint,
        'rl_session',
        clientDataStoreLS.engine,
        defaultErrorHandler,
        defaultLogger,
      );

      // All the values will be deleted from storage as plugin invocation fails
      // Eventually, default values will be assigned during initialization
      expect(state.session.userId.value).toBe('');
      expect(state.session.userTraits.value).toStrictEqual({});
      expect(state.session.anonymousId.value).toBe('test_uuid');
      expect(state.session.groupId.value).toBe('');
      expect(state.session.groupTraits.value).toStrictEqual({});
      expect(state.session.initialReferrer.value).toBe('$direct');
      expect(state.session.initialReferringDomain.value).toBe('');
      expect(state.session.sessionInfo.value).not.toBeUndefined();

      expect(defaultLogger.error).not.toHaveBeenCalled();
    });

    it('should auto-migrate data from previous storage', () => {
      const customData = {
        rl_user_id: 'dummy-userId-12345678',
      };
      setDataInCookieStorage(customData);
      // persisted data with local storage
      state.storage.entries.value = entriesWithOnlyLocalStorage;

      userSessionManager.init();

      expect(userSessionManager.getUserId()).toBe(customData.rl_user_id);

      // clears entries from cookie storage
      expect(clientDataStoreCookie.engine.length).toBe(0);
    });

    it('should not remove entries from previous storage if the data is not migrated', () => {
      const customData = {
        rl_anonymous_id: 'myanonymousid',
        rl_user_id: 'myuserid',
      };
      setDataInLocalStorage(customData);
      // persisted data with local storage
      state.storage.entries.value = entriesWithStorageOnlyForAnonymousId;

      userSessionManager.init();

      expect(userSessionManager.getAnonymousId()).toBe(customData.rl_anonymous_id);

      // only the anonymous ID entry should have been cleared from the previous storage
      expect(clientDataStoreLS.engine.length).toBe(1);
    });

    it('should set default values for all the user session state fields if storage type is set to none for all', () => {
      state.storage.entries.value = entriesWithOnlyNoStorage;
      userSessionManager.init();

      expect(state.session.userId.value).toBe(DEFAULT_USER_SESSION_VALUES.userId);
      expect(state.session.userTraits.value).toStrictEqual(DEFAULT_USER_SESSION_VALUES.userTraits);
      expect(state.session.anonymousId.value).toBe(DEFAULT_USER_SESSION_VALUES.anonymousId);
      expect(state.session.groupId.value).toBe(DEFAULT_USER_SESSION_VALUES.groupId);
      expect(state.session.groupTraits.value).toStrictEqual(
        DEFAULT_USER_SESSION_VALUES.groupTraits,
      );
      expect(state.session.initialReferrer.value).toBe(DEFAULT_USER_SESSION_VALUES.initialReferrer);
      expect(state.session.initialReferringDomain.value).toBe(
        DEFAULT_USER_SESSION_VALUES.initialReferringDomain,
      );
      expect(state.session.sessionInfo.value).toStrictEqual(
        DEFAULT_USER_SESSION_VALUES.sessionInfo,
      );
      expect(state.session.authToken.value).toBe(DEFAULT_USER_SESSION_VALUES.authToken);
    });

    it('should initialize user details from storage to state', () => {
      const customData = {
        rl_user_id: 'sample-user-id-1234567',
        rl_trait: { key1: 'value1' },
        rl_anonymous_id: 'dummy-anonymousId',
        rl_group_id: 'sample-group-id-7654321',
        rl_group_trait: { key2: 'value2' },
        rl_page_init_referrer: 'dummy-url-1',
        rl_page_init_referring_domain: 'dummy-url-2',
        rl_session: {
          autoTrack: false,
          manualTrack: true,
          id: 'someId',
        },
        rl_auth_token: 'dummy-auth-token',
      };
      setDataInCookieStorage(customData);
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();
      expect(state.session.userId.value).toBe(customData.rl_user_id);
      expect(state.session.userTraits.value).toStrictEqual(customData.rl_trait);
      expect(state.session.anonymousId.value).toBe(customData.rl_anonymous_id);
      expect(state.session.groupId.value).toBe(customData.rl_group_id);
      expect(state.session.groupTraits.value).toStrictEqual(customData.rl_group_trait);
      expect(state.session.initialReferrer.value).toBe(customData.rl_page_init_referrer);
      expect(state.session.initialReferringDomain.value).toBe(
        customData.rl_page_init_referring_domain,
      );
      expect(state.session.sessionInfo.value).toStrictEqual({
        ...customData.rl_session,
        timeout: expect.any(Number), // TODO: fix this after this entry is removed from state
      });
      expect(state.session.authToken.value).toBe(customData.rl_auth_token);
    });

    it('should constantly sync state with storage', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();

      // Now update the state values
      state.session.userId.value = 'new-user-id';
      state.session.userTraits.value = { key3: 'value3' };
      state.session.anonymousId.value = 'new-anonymous-id';
      state.session.groupId.value = 'new-group-id';
      state.session.groupTraits.value = { key4: 'value4' };
      state.session.initialReferrer.value = 'new-referrer';
      state.session.initialReferringDomain.value = 'new-referring-domain';
      state.session.sessionInfo.value = {
        autoTrack: true,
        manualTrack: false,
        id: 'new-session-id',
      };
      state.session.authToken.value = 'new-auth-token';

      expect(clientDataStoreCookie.get('rl_user_id')).toBe('new-user-id');
      expect(clientDataStoreCookie.get('rl_trait')).toStrictEqual({ key3: 'value3' });
      expect(clientDataStoreCookie.get('rl_anonymous_id')).toBe('new-anonymous-id');
      expect(clientDataStoreCookie.get('rl_group_id')).toBe('new-group-id');
      expect(clientDataStoreCookie.get('rl_group_trait')).toStrictEqual({ key4: 'value4' });
      expect(clientDataStoreCookie.get('rl_page_init_referrer')).toBe('new-referrer');
      expect(clientDataStoreCookie.get('rl_page_init_referring_domain')).toBe(
        'new-referring-domain',
      );
      expect(clientDataStoreCookie.get('rl_session')).toStrictEqual({
        autoTrack: true,
        manualTrack: false,
        id: 'new-session-id',
      });
      expect(clientDataStoreCookie.get('rl_auth_token')).toBe('new-auth-token');
    });

    it('should initialize user session state fields appropriately when storage is empty', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();

      expect(state.session.userId.value).toBe(DEFAULT_USER_SESSION_VALUES.userId);
      expect(state.session.userTraits.value).toStrictEqual(DEFAULT_USER_SESSION_VALUES.userTraits);
      expect(state.session.anonymousId.value).toBe('test_uuid'); // a new anonymous ID is generated
      expect(state.session.groupId.value).toBe(DEFAULT_USER_SESSION_VALUES.groupId);
      expect(state.session.groupTraits.value).toStrictEqual(
        DEFAULT_USER_SESSION_VALUES.groupTraits,
      );
      expect(state.session.initialReferrer.value).toBe('$direct'); // referrer is recomputed
      expect(state.session.initialReferringDomain.value).toBe('');
      expect(state.session.sessionInfo.value).toStrictEqual({
        autoTrack: true,
        expiresAt: expect.any(Number),
        id: expect.any(Number),
        sessionStart: undefined,
        timeout: expect.any(Number), // TODO: fix this after this entry is removed from state
      });
      expect(state.session.authToken.value).toBe(DEFAULT_USER_SESSION_VALUES.authToken);
    });

    it('should initialize session tracking with configured parameters in load options', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      state.loadOptions.value.sessions = {
        autoTrack: false,
        timeout: 10000,
      };
      userSessionManager.init();
      expect(state.session.sessionInfo.value).toStrictEqual({
        autoTrack: false,
        timeout: DEFAULT_SESSION_TIMEOUT_MS,
      });
    });

    it('should log a warning and use default timeout if provided timeout is not in number format', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      state.loadOptions.value.sessions.timeout = '100000';
      userSessionManager.init();
      expect(defaultLogger.warn).toHaveBeenCalledWith(
        'UserSessionManager:: The session timeout value "100000" is not a number. The default timeout of 1800000 ms will be used instead.',
      );
      expect(state.session.sessionInfo.value.timeout).toBe(DEFAULT_SESSION_TIMEOUT_MS);
    });

    it('should log a warning and disable auto tracking if provided timeout is 0', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      state.loadOptions.value.sessions.timeout = 0;
      userSessionManager.init();
      expect(defaultLogger.warn).toHaveBeenCalledWith(
        'UserSessionManager:: The session timeout value is 0, which disables the automatic session tracking feature. If you want to enable session tracking, please provide a positive integer value for the timeout.',
      );
      expect(state.session.sessionInfo.value.autoTrack).toBe(false);
    });

    it('should log a warning if provided timeout is less than 10 seconds', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      state.loadOptions.value.sessions.timeout = 5000; // provided timeout as 5 second
      userSessionManager.init();
      expect(defaultLogger.warn).toHaveBeenCalledWith(
        `UserSessionManager:: The session timeout value 5000 ms is less than the recommended minimum of 10000 ms. Please consider increasing the timeout value to ensure optimal performance and reliability.`,
      );
    });
  });

  describe('getAnonymousId', () => {
    it('should return the persisted anonymous ID', () => {
      const customData = {
        rl_anonymous_id: dummyAnonymousId,
      };
      setDataInCookieStorage(customData);
      state.storage.entries.value = entriesWithOnlyCookieStorage;

      userSessionManager.init();

      const actualAnonymousId = userSessionManager.getAnonymousId();
      expect(actualAnonymousId).toBe(customData.rl_anonymous_id);
    });

    it('should return a fresh anonymous ID if the persisted anonymous ID is not available', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();
      const actualAnonymousId = userSessionManager.getAnonymousId();
      expect(actualAnonymousId).toBe('test_uuid');
    });

    it('should return default value if persistence is disabled for anonymous ID', () => {
      state.storage.entries.value = {
        ...entriesWithOnlyCookieStorage,
        anonymousId: {
          type: 'none',
          key: USER_SESSION_STORAGE_KEYS.anonymousId,
        },
      };
      userSessionManager.init();
      const actualAnonymousId = userSessionManager.getAnonymousId();
      expect(actualAnonymousId).toBe(DEFAULT_USER_SESSION_VALUES.anonymousId);
    });

    it.skip('should return anonymous ID from external source', () => {
      const customData = {
        ajs_anonymous_id: 'dummy-anonymousId-12345678',
      };
      const option = {
        autoCapture: {
          source: 'segment',
          enabled: true,
        },
      };
      setDataInCookieStorage(customData);
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();
      const actualAnonymousId = userSessionManager.getAnonymousId(option);
      expect(actualAnonymousId).toBe(customData.ajs_anonymous_id);
    });
  });

  describe('getUserId', () => {
    it('should return the persisted user ID', () => {
      const customData = {
        rl_user_id: 'dummy-userId-12345678',
      };
      setDataInCookieStorage(customData);
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();
      const actualUserId = userSessionManager.getUserId();
      expect(actualUserId).toBe(customData.rl_user_id);
    });

    it('should return null if the persisted user ID is not available', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();
      const actualUserId = userSessionManager.getUserId();
      expect(actualUserId).toBe(null);
    });

    it('should return null if persistence is disabled for user ID', () => {
      state.storage.entries.value = {
        ...entriesWithOnlyCookieStorage,
        userId: {
          type: 'none',
          key: USER_SESSION_STORAGE_KEYS.userId,
        },
      };
      userSessionManager.init();
      const actualUserId = userSessionManager.getUserId();
      expect(actualUserId).toBe(null);
    });
  });

  describe('getUserTraits', () => {
    it('should return persisted user traits', () => {
      const customData = {
        rl_trait: { key1: 'value1', random: '123456789' },
      };
      setDataInCookieStorage(customData);
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();
      const actualUserTraits = userSessionManager.getUserTraits();
      expect(actualUserTraits).toStrictEqual(customData.rl_trait);
    });

    it('should return null if persisted user traits are not available', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();
      const actualUserTraits = userSessionManager.getUserTraits();
      expect(actualUserTraits).toStrictEqual(null);
    });

    it('should return null if persistence is disabled for user traits', () => {
      state.storage.entries.value = {
        ...entriesWithOnlyCookieStorage,
        userTraits: {
          type: 'none',
          key: USER_SESSION_STORAGE_KEYS.userTraits,
        },
      };
      userSessionManager.init();
      const actualUserTraits = userSessionManager.getUserTraits();
      expect(actualUserTraits).toStrictEqual(null);
    });
  });

  describe('getGroupId', () => {
    it('should return persisted group ID', () => {
      const customData = {
        rl_group_id: 'dummy-groupId-12345678',
      };
      setDataInCookieStorage(customData);
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();
      const actualGroupId = userSessionManager.getGroupId();
      expect(actualGroupId).toBe(customData.rl_group_id);
    });

    it('should return null if persisted group ID is not available', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();
      const actualGroupId = userSessionManager.getGroupId();
      expect(actualGroupId).toBe(null);
    });

    it('should return null if persistence is disabled for group ID', () => {
      state.storage.entries.value = {
        ...entriesWithOnlyCookieStorage,
        groupId: {
          type: 'none',
          key: USER_SESSION_STORAGE_KEYS.groupId,
        },
      };
      userSessionManager.init();
      const actualGroupId = userSessionManager.getGroupId();
      expect(actualGroupId).toStrictEqual(null);
    });
  });

  describe('getGroupTraits', () => {
    it('should return persisted group traits', () => {
      const customData = {
        rl_group_trait: { key1: 'value1', random: '123456789' },
      };
      setDataInCookieStorage(customData);
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();
      const actualGroupTraits = userSessionManager.getGroupTraits();
      expect(actualGroupTraits).toStrictEqual(customData.rl_group_trait);
    });

    it('should return null if persisted group traits are not available', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();
      const actualGroupTraits = userSessionManager.getGroupTraits();
      expect(actualGroupTraits).toStrictEqual(null);
    });

    it('should return null if persistence is disabled for group traits', () => {
      state.storage.entries.value = {
        ...entriesWithOnlyCookieStorage,
        groupTraits: {
          type: 'none',
          key: USER_SESSION_STORAGE_KEYS.groupTraits,
        },
      };
      userSessionManager.init();
      const actualGroupTraits = userSessionManager.getGroupTraits();
      expect(actualGroupTraits).toStrictEqual(null);
    });
  });

  describe('getInitialReferrer', () => {
    it('should return persisted initial referrer', () => {
      const customData = {
        rl_page_init_referrer: 'dummy-url-1234',
      };
      setDataInCookieStorage(customData);
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();
      const actualInitialReferrer = userSessionManager.getInitialReferrer();
      expect(actualInitialReferrer).toBe(customData.rl_page_init_referrer);
    });

    it('should return null if persisted initial referrer is not available', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();

      // We have to clear the storage as
      // the 'init' method would've set '$direct' as the value when no persisted value is found
      clearStorage();

      const actualInitialReferrer = userSessionManager.getInitialReferrer();
      expect(actualInitialReferrer).toBe(null);
    });

    it('should return null if persistence is disabled for initial referrer', () => {
      state.storage.entries.value = {
        ...entriesWithOnlyCookieStorage,
        initialReferrer: {
          type: 'none',
          key: USER_SESSION_STORAGE_KEYS.initialReferrer,
        },
      };
      userSessionManager.init();
      const actualInitialReferrer = userSessionManager.getInitialReferrer();
      expect(actualInitialReferrer).toStrictEqual(null);
    });
  });

  describe('getInitialReferringDomain', () => {
    it('should return persisted initial referring domain', () => {
      const customData = {
        rl_page_init_referrer: 'dummy-url-1234',
        rl_page_init_referring_domain: 'dummy-url-287654',
      };
      setDataInCookieStorage(customData);
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();
      const actualInitialReferringDomain = userSessionManager.getInitialReferringDomain();
      expect(actualInitialReferringDomain).toBe(customData.rl_page_init_referring_domain);
    });

    it('should return null if persisted initial referring domain is not available', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();
      const actualInitialReferringDomain = userSessionManager.getInitialReferringDomain();
      expect(actualInitialReferringDomain).toBe(null);
    });

    it('should return null if persistence is disabled for initial referring domain', () => {
      state.storage.entries.value = {
        ...entriesWithOnlyCookieStorage,
        initialReferringDomain: {
          type: 'none',
          key: USER_SESSION_STORAGE_KEYS.initialReferringDomain,
        },
      };
      userSessionManager.init();
      const actualInitialReferringDomain = userSessionManager.getInitialReferringDomain();
      expect(actualInitialReferringDomain).toStrictEqual(null);
    });
  });

  describe('getAuthToken', () => {
    it('should return persisted auth token', () => {
      const customData = {
        rl_auth_token: 'dummy-auth-token-12345678',
      };
      setDataInCookieStorage(customData);
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();
      const actualAuthToken = userSessionManager.getAuthToken();
      expect(actualAuthToken).toBe(customData.rl_auth_token);
    });

    it('should return null if persisted auth token is not available', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();
      const actualAuthToken = userSessionManager.getAuthToken();
      expect(actualAuthToken).toBe(null);
    });

    it('should return null if persistence is disabled for auth token', () => {
      state.storage.entries.value = {
        ...entriesWithOnlyCookieStorage,
        authToken: {
          type: 'none',
          key: USER_SESSION_STORAGE_KEYS.authToken,
        },
      };
      userSessionManager.init();
      const actualAuthToken = userSessionManager.getAuthToken();
      expect(actualAuthToken).toStrictEqual(null);
    });
  });

  describe('getSessionInfo', () => {
    it('should return persisted session info', () => {
      const customData = {
        rl_session: { key1: 'value1', random: '123456789' },
      };
      setDataInCookieStorage(customData);
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      // Not calling init here
      const actualSessionInfo = userSessionManager.getSessionInfo();
      expect(actualSessionInfo).toStrictEqual(customData.rl_session);
    });

    it('should return null if persisted session info is not available', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();

      // We have to clear the storage as
      // the 'init' method would've set default value when no persisted value is found
      clearStorage();

      const actualSessionInfo = userSessionManager.getSessionInfo();
      expect(actualSessionInfo).toStrictEqual(null);
    });

    it('should return null if persistence is disabled for session info', () => {
      state.storage.entries.value = {
        ...entriesWithOnlyCookieStorage,
        sessionInfo: {
          type: 'none',
          key: USER_SESSION_STORAGE_KEYS.sessionInfo,
        },
      };
      userSessionManager.init();
      const actualSessionInfo = userSessionManager.getSessionInfo();
      expect(actualSessionInfo).toStrictEqual(null);
    });
  });

  describe('setAnonymousId', () => {
    it('should set the provided anonymous ID', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      const newAnonymousId = 'new-dummy-anonymous-id';
      userSessionManager.init();
      userSessionManager.setAnonymousId(newAnonymousId);
      expect(state.session.anonymousId.value).toBe(newAnonymousId);
    });

    it('should reset the value to default value if persistence is not enabled for anonymous ID', () => {
      state.storage.entries.value = {
        ...entriesWithOnlyCookieStorage,
        anonymousId: {
          type: 'none',
          key: USER_SESSION_STORAGE_KEYS.anonymousId,
        },
      };
      userSessionManager.init();
      userSessionManager.setAnonymousId(dummyAnonymousId);
      expect(state.session.anonymousId.value).toBe(DEFAULT_USER_SESSION_VALUES.anonymousId);
    });

    it('should generate a new anonymous ID if the value is not provided', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();
      userSessionManager.setAnonymousId();
      expect(state.session.anonymousId.value).toBe('test_uuid');
    });

    // TODO: Add a new TC for Google Linker parameters
  });

  describe('setUserId', () => {
    it('should set the provided user ID', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      clientDataStoreCookie.set = jest.fn();
      const newUserId = 'new-dummy-user-id';
      userSessionManager.init();
      userSessionManager.setUserId(newUserId);
      expect(state.session.userId.value).toBe(newUserId);
    });

    it('should reset the value to default value if persistence is not enabled for user ID', () => {
      state.storage.entries.value = {
        ...entriesWithOnlyCookieStorage,
        userId: {
          type: 'none',
          key: USER_SESSION_STORAGE_KEYS.userId,
        },
      };
      userSessionManager.init();
      userSessionManager.setUserId('dummy-user-id');
      expect(state.session.userId.value).toBe(DEFAULT_USER_SESSION_VALUES.userId);
    });

    it('should reset the value to default value if the value is not provided', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();
      userSessionManager.setUserId();
      expect(state.session.userId.value).toBe(DEFAULT_USER_SESSION_VALUES.userId);
    });
  });

  describe('setUserTraits', () => {
    it('should set the provided user traits', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      clientDataStoreCookie.set = jest.fn();
      const newUserTraits = { key1: 'value1', key2: 'value2' };
      userSessionManager.init();
      userSessionManager.setUserTraits(newUserTraits);
      expect(state.session.userTraits.value).toStrictEqual(newUserTraits);
    });

    it('should reset the value to default value if persistence is not enabled for user traits', () => {
      state.storage.entries.value = {
        ...entriesWithOnlyCookieStorage,
        userTraits: {
          type: 'none',
          key: USER_SESSION_STORAGE_KEYS.userTraits,
        },
      };
      userSessionManager.init();
      userSessionManager.setUserTraits({ key1: 'value1', key2: 'value2' });
      expect(state.session.userTraits.value).toStrictEqual(DEFAULT_USER_SESSION_VALUES.userTraits);
    });

    it('should reset the value to default value if the value is not provided', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();
      userSessionManager.setUserTraits();
      expect(state.session.userTraits.value).toStrictEqual(DEFAULT_USER_SESSION_VALUES.userTraits);
    });
  });

  describe('setGroupId', () => {
    it('should set the provided group id', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      clientDataStoreCookie.set = jest.fn();
      const newGroupId = 'new-dummy-group-id';
      userSessionManager.init();
      userSessionManager.setGroupId(newGroupId);
      expect(state.session.groupId.value).toBe(newGroupId);
      expect(clientDataStoreCookie.set).toHaveBeenCalled();
    });

    it('should reset the value to default value if persistence is not enabled for group id', () => {
      state.storage.entries.value = {
        ...entriesWithOnlyCookieStorage,
        groupId: {
          type: 'none',
          key: USER_SESSION_STORAGE_KEYS.groupId,
        },
      };
      userSessionManager.init();
      userSessionManager.setGroupId('dummy-group-id');
      expect(state.session.groupId.value).toBe(DEFAULT_USER_SESSION_VALUES.groupId);
    });

    it('should reset the value to default value if the value is not provided', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();
      userSessionManager.setGroupId();
      expect(state.session.groupId.value).toBe(DEFAULT_USER_SESSION_VALUES.groupId);
    });
  });

  describe('setGroupTraits', () => {
    it('should set the provided group traits', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      clientDataStoreCookie.set = jest.fn();
      const newGroupTraits = { key1: 'value1', key2: 'value2' };
      userSessionManager.init();
      userSessionManager.setGroupTraits(newGroupTraits);
      expect(state.session.groupTraits.value).toStrictEqual(newGroupTraits);
    });

    it('should reset the value to default value if persistence is not enabled for group traits', () => {
      state.storage.entries.value = {
        ...entriesWithOnlyCookieStorage,
        groupTraits: {
          type: 'none',
          key: USER_SESSION_STORAGE_KEYS.groupTraits,
        },
      };
      userSessionManager.init();
      userSessionManager.setGroupTraits({ key1: 'value1', key2: 'value2' });
      expect(state.session.groupTraits.value).toStrictEqual(
        DEFAULT_USER_SESSION_VALUES.groupTraits,
      );
    });

    it('should reset the value to default value if the value is not provided', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();
      userSessionManager.setGroupTraits();
      expect(state.session.groupTraits.value).toStrictEqual(
        DEFAULT_USER_SESSION_VALUES.groupTraits,
      );
    });
  });

  describe('setInitialReferrer', () => {
    it('should set the provided initial referrer', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      clientDataStoreCookie.set = jest.fn();
      const newReferrer = 'new-dummy-referrer-1';
      userSessionManager.init();
      userSessionManager.setInitialReferrer(newReferrer);
      expect(state.session.initialReferrer.value).toBe(newReferrer);
    });

    it('should reset the value to default value if persistence is not enabled for initial referrer', () => {
      state.storage.entries.value = {
        ...entriesWithOnlyCookieStorage,
        initialReferrer: {
          type: 'none',
          key: USER_SESSION_STORAGE_KEYS.initialReferrer,
        },
      };
      userSessionManager.init();
      userSessionManager.setInitialReferrer('dummy-url');
      expect(state.session.initialReferrer.value).toBe(DEFAULT_USER_SESSION_VALUES.initialReferrer);
    });

    it('should reset the value to default value if the value is not provided', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();
      userSessionManager.setInitialReferrer();
      expect(state.session.initialReferrer.value).toBe(DEFAULT_USER_SESSION_VALUES.initialReferrer);
    });
  });

  describe('setInitialReferringDomain', () => {
    it('should set the provided initial referring domain', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      clientDataStoreCookie.set = jest.fn();
      const newReferrer = 'new-dummy-referrer-2';
      userSessionManager.init();
      userSessionManager.setInitialReferringDomain(newReferrer);
      expect(state.session.initialReferringDomain.value).toBe(newReferrer);
      expect(clientDataStoreCookie.set).toHaveBeenCalled();
    });

    it('should reset the value to default value if persistence is not enabled for initial referring domain', () => {
      state.storage.entries.value = {
        ...entriesWithOnlyCookieStorage,
        initialReferringDomain: {
          type: 'none',
          key: USER_SESSION_STORAGE_KEYS.initialReferringDomain,
        },
      };
      userSessionManager.init();
      userSessionManager.setInitialReferringDomain('dummy-url');
      expect(state.session.initialReferringDomain.value).toBe(
        DEFAULT_USER_SESSION_VALUES.initialReferringDomain,
      );
    });

    it('should reset the value to default value if the value is not provided', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();
      userSessionManager.setInitialReferringDomain();
      expect(state.session.initialReferringDomain.value).toBe(
        DEFAULT_USER_SESSION_VALUES.initialReferringDomain,
      );
    });
  });

  describe('setAuthToken', () => {
    it('should set the provided auth token', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      clientDataStoreCookie.set = jest.fn();
      const newAuthToken = 'new-dummy-auth-token';
      userSessionManager.init();
      userSessionManager.setAuthToken(newAuthToken);
      expect(state.session.authToken.value).toBe(newAuthToken);
    });

    it('should reset the value to default value if persistence is not enabled for auth token', () => {
      state.storage.entries.value = {
        ...entriesWithOnlyCookieStorage,
        authToken: {
          type: 'none',
          key: USER_SESSION_STORAGE_KEYS.authToken,
        },
      };
      userSessionManager.init();
      userSessionManager.setAuthToken('dummy-auth-token');
      expect(state.session.authToken.value).toBe(DEFAULT_USER_SESSION_VALUES.authToken);
    });

    it('should reset the value to default value if the value is not provided', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();
      userSessionManager.setAuthToken();
      expect(state.session.authToken.value).toBe(DEFAULT_USER_SESSION_VALUES.authToken);
    });
  });

  describe('refreshSession', () => {
    it('refreshSession: should return empty object if any type of tracking is not enabled', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();
      state.session.sessionInfo.value = {};
      userSessionManager.refreshSession();
      expect(state.session.sessionInfo.value).toStrictEqual({});
    });

    it('refreshSession: should return session id and sessionStart when auto tracking is enabled', () => {
      const futureTimestamp = Date.now() + 5000;
      state.session.sessionInfo.value = {
        autoTrack: true,
        timeout: 10 * 60 * 1000,
        expiresAt: futureTimestamp,
        id: 1683613729115,
        sessionStart: true,
      };
      userSessionManager.refreshSession();
      expect(state.session.sessionInfo.value).toEqual({
        autoTrack: true,
        timeout: 10 * 60 * 1000,
        expiresAt: expect.any(Number),
        id: 1683613729115,
        sessionStart: false,
      });
    });

    it('refreshSession: should return session id and sessionStart when manual tracking is enabled', () => {
      const manualTrackingSessionId = 1029384756;
      userSessionManager.init();
      userSessionManager.start(manualTrackingSessionId);
      userSessionManager.refreshSession();
      expect(state.session.sessionInfo.value).toEqual({
        id: manualTrackingSessionId,
        sessionStart: true,
        manualTrack: true,
      });
    });

    it('refreshSession: should generate new session id and sessionStart and return when auto tracking session is expired', () => {
      userSessionManager.init();
      const pastTimestamp = Date.now() - 5000;
      state.session.sessionInfo.value = {
        autoTrack: true,
        timeout: 10 * 60 * 1000,
        expiresAt: pastTimestamp,
        id: 1683613729115,
        sessionStart: false,
      };
      userSessionManager.refreshSession();
      expect(state.session.sessionInfo.value).toEqual({
        autoTrack: true,
        timeout: 10 * 60 * 1000,
        id: expect.any(Number),
        expiresAt: expect.any(Number),
        sessionStart: true,
      });
    });

    it('refreshSession: should return only session id from the second event of the auto session tracking', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();
      userSessionManager.refreshSession(); // sessionInfo For First Event
      userSessionManager.refreshSession();
      expect(state.session.sessionInfo.value.sessionStart).toBe(false);
    });

    it('refreshSession: should return only session id from the second event of the manual session tracking', () => {
      const manualTrackingSessionId = 1029384756;
      userSessionManager.start(manualTrackingSessionId);
      userSessionManager.refreshSession(); // sessionInfo For First Event
      userSessionManager.refreshSession();
      expect(state.session.sessionInfo.value.sessionStart).toBe(false);
    });
  });

  describe('getSessionId', () => {
    it('getSessionId: should return session id for active session', () => {
      const futureTimestamp = Date.now() + 10000;
      state.session.sessionInfo.value = {
        autoTrack: true,
        timeout: 10 * 60 * 1000,
        expiresAt: futureTimestamp,
        id: 1683613729115,
        sessionStart: false,
      };
      const sessionId = userSessionManager.getSessionId();
      expect(typeof sessionId).toBe('number');
      expect(sessionId.toString().length).toBeGreaterThan(0);
    });

    it('getSessionId: should return session id for active session', () => {
      const pastTimestamp = Date.now() - 5000;
      state.session.sessionInfo.value = {
        autoTrack: true,
        timeout: 10 * 60 * 1000,
        expiresAt: pastTimestamp,
        id: 1683613729115,
        sessionStart: false,
      };
      const sessionId = userSessionManager.getSessionId();
      expect(typeof sessionId).toBe('object');
      expect(sessionId).toBe(null);
    });
  });

  describe('auto tracking', () => {
    it('startAutoTracking: should create a new session in case of invalid session', () => {
      userSessionManager.init();
      state.session.sessionInfo.value = {
        autoTrack: true,
        timeout: 10 * 60 * 1000,
        expiresAt: Date.now() - 1000,
        id: 1683613729115,
        sessionStart: false,
      };
      userSessionManager.startOrRenewAutoTracking();
      expect(state.session.sessionInfo.value).toEqual({
        autoTrack: true,
        timeout: 10 * 60 * 1000,
        expiresAt: expect.any(Number),
        id: expect.any(Number),
        sessionStart: undefined,
      });
    });

    it('startAutoTracking: should not create a new session in case of valid session', () => {
      userSessionManager.init();
      state.session.sessionInfo.value = {
        autoTrack: true,
        timeout: 10 * 60 * 1000,
        expiresAt: Date.now() + 30 * 1000,
        id: 1683613729115,
        sessionStart: false,
      };
      userSessionManager.startOrRenewAutoTracking();
      expect(state.session.sessionInfo.value).toEqual({
        autoTrack: true,
        timeout: 10 * 60 * 1000,
        expiresAt: expect.any(Number),
        id: 1683613729115,
        sessionStart: false,
      });
    });
  });

  describe('manual tracking', () => {
    it('startManualTracking: should create a new manual session', () => {
      const manualTrackingSessionId = 1029384756;
      userSessionManager.init();
      userSessionManager.start(manualTrackingSessionId);
      expect(state.session.sessionInfo.value).toEqual({
        manualTrack: true,
        id: manualTrackingSessionId,
        sessionStart: undefined,
      });
    });

    it('startManualTracking: should create a new manual session even id session id is not provided', () => {
      userSessionManager.init();
      userSessionManager.start();
      expect(state.session.sessionInfo.value).toEqual({
        manualTrack: true,
        id: expect.any(Number),
        sessionStart: undefined,
      });
    });

    it('endSessionTracking: should clear session info', () => {
      userSessionManager.init();
      userSessionManager.end();
      expect(state.session.sessionInfo.value).toEqual({});
    });
  });

  describe('reset', () => {
    it('should reset user session to the initial value except anonymousId', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();
      userSessionManager.setAnonymousId(dummyAnonymousId);
      const sessionInfoBeforeReset = JSON.parse(JSON.stringify(state.session.sessionInfo.value));
      userSessionManager.reset();
      expect(state.session.userId.value).toEqual('');
      expect(state.session.userTraits.value).toEqual({});
      expect(state.session.groupId.value).toEqual('');
      expect(state.session.groupTraits.value).toEqual({});
      expect(state.session.anonymousId.value).toEqual(dummyAnonymousId);
      // new session will be generated
      expect(state.session.sessionInfo.value.autoTrack).toBe(sessionInfoBeforeReset.autoTrack);
      expect(state.session.sessionInfo.value.timeout).toBe(sessionInfoBeforeReset.timeout);
      expect(state.session.sessionInfo.value.expiresAt).not.toBe(sessionInfoBeforeReset.expiresAt);
      expect(state.session.sessionInfo.value.id).not.toBe(sessionInfoBeforeReset.id);
      expect(state.session.sessionInfo.value.sessionStart).toBe(undefined);
    });

    it('should clear the existing anonymousId and set a new anonymousId with first parameter set to true', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();
      userSessionManager.setAnonymousId(dummyAnonymousId);
      userSessionManager.reset(true);
      expect(state.session.anonymousId.value).toEqual('test_uuid');
    });

    it('should clear anonymousId and set default value in case of storage type is no_storage', () => {
      state.storage.entries.value = anonymousIdWithNoStorageEntries;
      userSessionManager.init();
      userSessionManager.setAnonymousId(dummyAnonymousId);
      userSessionManager.reset(true);
      expect(state.session.anonymousId.value).toEqual('');
    });

    it('should not start a new session with second parameter set to true', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      userSessionManager.init();
      const sessionInfoBeforeReset = JSON.parse(JSON.stringify(state.session.sessionInfo.value));
      userSessionManager.reset(true, true);
      expect(state.session.sessionInfo.value).toEqual(sessionInfoBeforeReset);
    });
  });

  describe('getExternalAnonymousIdByCookieName', () => {
    it('Should return null if the cookie value does not exists', () => {
      const externalAnonymousId =
        userSessionManager.getExternalAnonymousIdByCookieName('anonId_cookie');
      expect(externalAnonymousId).toEqual(null);
    });
    it('Should return the cookie value if exists', () => {
      document.cookie = 'anonId_cookie=sampleAnonymousId12345';
      const externalAnonymousId =
        userSessionManager.getExternalAnonymousIdByCookieName('anonId_cookie');
      expect(externalAnonymousId).toEqual('sampleAnonymousId12345');
    });
  });
});
