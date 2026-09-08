import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { StorageOpts, StorageType } from '@rudderstack/analytics-js-common/types/Storage';
import type { PreConsentOptions } from '@rudderstack/analytics-js-common/types/LoadOptions';
import type { ConsentOptions } from '@rudderstack/analytics-js-common/types/Consent';
import type { UserSessionKey } from '@rudderstack/analytics-js-common/types/UserSessionStorage';
import { COOKIE_KEYS } from '@rudderstack/analytics-js-cookies/constants/cookies';
import { getStorageEngine } from '../../../src/services/StoreManager/storages/storageEngine';
import { state, resetState } from '../../../src/state';
import { StoreManager } from '../../../src/services/StoreManager';
import { PluginsManager } from '../../../src/components/pluginsManager';
import { defaultPluginEngine } from '../../../src/services/PluginEngine';
import { defaultErrorHandler } from '../../../src/services/ErrorHandler';
import { defaultLogger } from '../../../src/services/Logger';
import { USER_SESSION_KEYS } from '../../../src/constants/storage';
import {
  updateConsentsStateFromLoadOptions,
  updateStorageStateFromLoadOptions,
} from '../../../src/components/configManager/util/commonUtil';
import { normalizeLoadOptions } from '../../../src/components/utilities/loadOptions';
import { getValidPostConsentOptions } from '../../../src/components/utilities/consent';

jest.mock('../../../src/services/StoreManager/storages/storageEngine', () => ({
  __esModule: true,
  configureStorageEngines: jest.fn(),
  getStorageEngine: jest.fn().mockReturnValue({
    isEnabled: true,
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  }),
}));

/**
 * Builds the expected `state.storage.entries` value: every user session key resolves to
 * `defaultType` unless it is named in `overrides`.
 */
const buildExpectedEntries = (
  defaultType: StorageType,
  overrides: Partial<Record<UserSessionKey, StorageType>> = {},
) =>
  USER_SESSION_KEYS.reduce(
    (entries, sessionKey) => ({
      ...entries,
      [sessionKey]: {
        type: overrides[sessionKey] ?? defaultType,
        key: COOKIE_KEYS[sessionKey],
      },
    }),
    {},
  );

type TestCase = {
  description: string;
  storage?: StorageOpts;
  preConsent: PreConsentOptions;
  expectedEntries: ReturnType<typeof buildExpectedEntries>;
  expectedTrulyAnonymousTracking: boolean;
};

/**
 * Locks in the storage resolution behaviour of every supported `preConsent.storage.strategy`
 * value against the load API storage options, across the full pipeline:
 * load options -> config manager -> store manager -> `state.storage.entries`.
 *
 * These expectations must not change now that `strategy` is deprecated in favour of the storage
 * load API option, so they are asserted against explicitly constructed values rather than shared
 * fixtures.
 */
describe('Pre-consent storage resolution', () => {
  let logger: ILogger;
  let storeManager: StoreManager;
  const defaultPluginsManager = new PluginsManager(
    defaultPluginEngine,
    defaultErrorHandler,
    defaultLogger,
  );

  beforeEach(() => {
    resetState();
    // Every storage type is available, so the availability fallbacks never kick in
    (getStorageEngine as jest.Mock).mockImplementation(() => ({
      isEnabled: true,
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    }));
    logger = { error: jest.fn(), warn: jest.fn() } as unknown as ILogger;
    storeManager = new StoreManager(defaultPluginsManager, { onError: jest.fn() } as any, logger);
    // Pre-consent is only active when consent management is enabled and not already initialized
    state.loadOptions.value.consentManagement = {
      enabled: true,
      provider: 'oneTrust',
    };
  });

  afterEach(() => {
    storeManager.isInitialized = false;
    jest.resetAllMocks();
  });

  /**
   * Runs the load options through the whole resolution pipeline:
   * config manager -> store manager -> `state.storage.entries`
   */
  const resolveStorageEntries = (
    storage: StorageOpts | undefined,
    preConsent: PreConsentOptions,
  ) => {
    state.loadOptions.value.storage = { ...state.loadOptions.value.storage, ...storage };
    state.loadOptions.value.preConsent = preConsent;

    updateStorageStateFromLoadOptions(logger);
    updateConsentsStateFromLoadOptions(logger);
    storeManager.initClientDataStores();
  };

  const testCases: TestCase[] = [
    {
      description: 'no storage options at all persists nothing',
      preConsent: { enabled: true },
      expectedEntries: buildExpectedEntries('none'),
      expectedTrulyAnonymousTracking: true,
    },
    {
      description: 'strategy "none" persists nothing',
      preConsent: { enabled: true, storage: { strategy: 'none' } },
      expectedEntries: buildExpectedEntries('none'),
      expectedTrulyAnonymousTracking: true,
    },
    {
      description: 'strategy "none" persists nothing even with load API storage options',
      storage: { type: 'localStorage', entries: { anonymousId: { type: 'cookieStorage' } } },
      preConsent: { enabled: true, storage: { strategy: 'none' } },
      expectedEntries: buildExpectedEntries('none'),
      expectedTrulyAnonymousTracking: true,
    },
    {
      description: 'strategy "session" persists only sessionInfo in the default storage type',
      preConsent: { enabled: true, storage: { strategy: 'session' } },
      expectedEntries: buildExpectedEntries('none', { sessionInfo: 'cookieStorage' }),
      expectedTrulyAnonymousTracking: false,
    },
    {
      description: 'strategy "session" persists sessionInfo in the load API global storage type',
      storage: { type: 'localStorage' },
      preConsent: { enabled: true, storage: { strategy: 'session' } },
      expectedEntries: buildExpectedEntries('none', { sessionInfo: 'localStorage' }),
      expectedTrulyAnonymousTracking: false,
    },
    {
      description: 'strategy "session" persists sessionInfo in its load API entry storage type',
      storage: {
        type: 'localStorage',
        entries: {
          sessionInfo: { type: 'sessionStorage' },
          anonymousId: { type: 'cookieStorage' },
        },
      },
      preConsent: { enabled: true, storage: { strategy: 'session' } },
      expectedEntries: buildExpectedEntries('none', { sessionInfo: 'sessionStorage' }),
      expectedTrulyAnonymousTracking: false,
    },
    {
      description: 'strategy "session" persists nothing if the load API storage type is none',
      storage: { type: 'none' },
      preConsent: { enabled: true, storage: { strategy: 'session' } },
      expectedEntries: buildExpectedEntries('none'),
      expectedTrulyAnonymousTracking: true,
    },
    {
      description: 'strategy "anonymousId" persists only anonymousId in the default storage type',
      preConsent: { enabled: true, storage: { strategy: 'anonymousId' } },
      expectedEntries: buildExpectedEntries('none', { anonymousId: 'cookieStorage' }),
      expectedTrulyAnonymousTracking: false,
    },
    {
      description:
        'strategy "anonymousId" persists anonymousId in the load API global storage type',
      storage: { type: 'sessionStorage' },
      preConsent: { enabled: true, storage: { strategy: 'anonymousId' } },
      expectedEntries: buildExpectedEntries('none', { anonymousId: 'sessionStorage' }),
      expectedTrulyAnonymousTracking: false,
    },
    {
      description: 'strategy "anonymousId" persists anonymousId in its load API entry storage type',
      storage: {
        type: 'localStorage',
        entries: {
          anonymousId: { type: 'sessionStorage' },
          sessionInfo: { type: 'cookieStorage' },
        },
      },
      preConsent: { enabled: true, storage: { strategy: 'anonymousId' } },
      expectedEntries: buildExpectedEntries('none', { anonymousId: 'sessionStorage' }),
      expectedTrulyAnonymousTracking: false,
    },
    {
      description: 'strategy "anonymousId" persists nothing if its load API entry type is none',
      storage: { type: 'localStorage', entries: { anonymousId: { type: 'none' } } },
      preConsent: { enabled: true, storage: { strategy: 'anonymousId' } },
      expectedEntries: buildExpectedEntries('none'),
      expectedTrulyAnonymousTracking: true,
    },
    {
      description: 'an unsupported strategy falls back to persisting nothing',
      storage: { type: 'localStorage' },
      // @ts-expect-error testing invalid value
      preConsent: { enabled: true, storage: { strategy: 'random-strategy' } },
      expectedEntries: buildExpectedEntries('none'),
      expectedTrulyAnonymousTracking: true,
    },
    {
      description: 'the strategy is ignored when pre-consent is disabled',
      storage: { type: 'localStorage', entries: { sessionInfo: { type: 'sessionStorage' } } },
      preConsent: { enabled: false, storage: { strategy: 'none' } },
      expectedEntries: buildExpectedEntries('localStorage', { sessionInfo: 'sessionStorage' }),
      expectedTrulyAnonymousTracking: false,
    },
  ];

  it.each(testCases)(
    '$description',
    ({ storage, preConsent, expectedEntries, expectedTrulyAnonymousTracking }) => {
      resolveStorageEntries(storage, preConsent);

      expect(state.storage.entries.value).toEqual(expectedEntries);
      expect(state.storage.trulyAnonymousTracking.value).toBe(expectedTrulyAnonymousTracking);
    },
  );

  describe('without the storage strategy', () => {
    it('should persist both the anonymous ID and the session info if they are the only configured entries', () => {
      resolveStorageEntries(
        {
          entries: {
            anonymousId: { type: 'cookieStorage' },
            sessionInfo: { type: 'cookieStorage' },
          },
        },
        { enabled: true, events: { delivery: 'buffer' } },
      );

      expect(state.storage.entries.value).toEqual(
        buildExpectedEntries('none', {
          anonymousId: 'cookieStorage',
          sessionInfo: 'cookieStorage',
        }),
      );
      expect(state.storage.trulyAnonymousTracking.value).toBe(false);
    });

    it('should persist every entry if the storage type is configured', () => {
      resolveStorageEntries({ type: 'localStorage' }, { enabled: true });

      expect(state.storage.entries.value).toEqual(buildExpectedEntries('localStorage'));
      expect(state.storage.trulyAnonymousTracking.value).toBe(false);
    });

    it('should give the entry storage type precedence over the storage type', () => {
      resolveStorageEntries(
        { type: 'localStorage', entries: { anonymousId: { type: 'sessionStorage' } } },
        { enabled: true },
      );

      expect(state.storage.entries.value).toEqual(
        buildExpectedEntries('localStorage', { anonymousId: 'sessionStorage' }),
      );
    });

    it('should not persist an entry that is configured with no storage', () => {
      resolveStorageEntries(
        { type: 'localStorage', entries: { anonymousId: { type: 'none' } } },
        { enabled: true },
      );

      expect(state.storage.entries.value).toEqual(
        buildExpectedEntries('localStorage', { anonymousId: 'none' }),
      );
    });

    it('should not log a deprecation warning', () => {
      resolveStorageEntries({ type: 'localStorage' }, { enabled: true });

      expect(logger.warn).not.toHaveBeenCalled();
    });

    it('should not persist an entry whose storage type is unsupported', () => {
      resolveStorageEntries(
        // @ts-expect-error testing an invalid value
        { entries: { anonymousId: { type: 'localStoarge' } } },
        { enabled: true, events: { delivery: 'buffer' } },
      );

      expect(state.storage.entries.value).toEqual(buildExpectedEntries('none'));
      expect(state.storage.trulyAnonymousTracking.value).toBe(true);
      expect(logger.warn).toHaveBeenCalledWith(
        'ConfigManager:: The storage type "localStoarge" configured for the entry "anonymousId" is not supported. Please choose one of the following supported types: "localStorage,memoryStorage,cookieStorage,sessionStorage,none". The default storage type will be used instead.',
      );
    });

    it('should not persist anything if the storage type is unsupported', () => {
      // @ts-expect-error testing an invalid value
      resolveStorageEntries({ type: 'random-type' }, { enabled: true });

      expect(state.storage.entries.value).toEqual(buildExpectedEntries('none'));
      expect(state.storage.trulyAnonymousTracking.value).toBe(true);
    });

    it('should still resolve an unsupported storage type after consent is given', () => {
      // @ts-expect-error testing an invalid value
      resolveStorageEntries({ type: 'random-type' }, { enabled: false });

      expect(state.storage.entries.value).toEqual(buildExpectedEntries('cookieStorage'));
    });

    it('should still resolve an unsupported entry storage type after consent is given', () => {
      // @ts-expect-error testing an invalid value
      resolveStorageEntries(
        { entries: { anonymousId: { type: 'localStoarge' } } },
        { enabled: false },
      );

      expect(state.storage.entries.value).toEqual(buildExpectedEntries('cookieStorage'));
    });
  });

  describe('with the deprecated storage strategy', () => {
    it('should take precedence over the storage options', () => {
      resolveStorageEntries(
        { type: 'localStorage', entries: { anonymousId: { type: 'cookieStorage' } } },
        { enabled: true, storage: { strategy: 'session' } },
      );

      expect(state.storage.entries.value).toEqual(
        buildExpectedEntries('none', { sessionInfo: 'localStorage' }),
      );
    });

    it('should log a deprecation warning', () => {
      resolveStorageEntries(undefined, { enabled: true, storage: { strategy: 'session' } });

      expect(logger.warn).toHaveBeenCalledWith(
        'ConfigManager:: The pre-consent storage strategy option is deprecated. Please use the "storage" load API option instead.',
      );
    });
  });

  describe('with no storage options supplied to the load API', () => {
    /**
     * Runs the load options through `normalizeLoadOptions` first, exactly as the load API does,
     * so that any default it fills in is included in the resolution.
     */
    const loadWithoutStorageOptions = (preConsent: PreConsentOptions) => {
      state.loadOptions.value = normalizeLoadOptions(state.loadOptions.value, {
        consentManagement: { enabled: true, provider: 'oneTrust' },
        preConsent,
      });

      updateStorageStateFromLoadOptions(logger);
      updateConsentsStateFromLoadOptions(logger);
      storeManager.initClientDataStores();
    };

    it('should not default the storage type or the entries', () => {
      loadWithoutStorageOptions({ enabled: true });

      expect(state.loadOptions.value.storage?.type).toBeUndefined();
      expect(state.loadOptions.value.storage?.entries).toBeUndefined();
    });

    it('should not persist anything before consent', () => {
      loadWithoutStorageOptions({ enabled: true, events: { delivery: 'buffer' } });

      expect(state.storage.entries.value).toEqual(buildExpectedEntries('none'));
      expect(state.storage.trulyAnonymousTracking.value).toBe(true);
    });

    it('should persist everything in the default storage type if pre-consent is not enabled', () => {
      loadWithoutStorageOptions({ enabled: false });

      expect(state.storage.entries.value).toEqual(buildExpectedEntries('cookieStorage'));
      expect(state.storage.trulyAnonymousTracking.value).toBe(false);
    });
  });

  describe('across consent API invocations', () => {
    /**
     * Mirrors what the consent API does with the storage options
     */
    const giveConsent = (options?: ConsentOptions) => {
      state.consents.preConsent.value = { ...state.consents.preConsent.value, enabled: false };
      state.consents.postConsent.value = getValidPostConsentOptions(options, logger);
      storeManager.initializeStorageState();
    };

    it('should leave the storage as it is if an invocation provides no storage options', () => {
      resolveStorageEntries({ type: 'localStorage' }, { enabled: true });

      expect(state.storage.entries.value).toEqual(buildExpectedEntries('localStorage'));

      giveConsent({
        storage: { type: 'cookieStorage', entries: { anonymousId: { type: 'sessionStorage' } } },
      });

      const afterFirstConsent = buildExpectedEntries('cookieStorage', {
        anonymousId: 'sessionStorage',
      });
      expect(state.storage.entries.value).toEqual(afterFirstConsent);

      giveConsent();

      expect(state.storage.entries.value).toEqual(afterFirstConsent);
    });

    it('should replace the storage options if a later invocation provides them', () => {
      resolveStorageEntries({ type: 'localStorage' }, { enabled: true });
      giveConsent({
        storage: { type: 'cookieStorage', entries: { anonymousId: { type: 'sessionStorage' } } },
      });

      giveConsent({ storage: { type: 'sessionStorage' } });

      expect(state.storage.entries.value).toEqual(buildExpectedEntries('sessionStorage'));
    });
  });
});
