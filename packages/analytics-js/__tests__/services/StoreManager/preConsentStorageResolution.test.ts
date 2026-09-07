import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { StorageOpts, StorageType } from '@rudderstack/analytics-js-common/types/Storage';
import type { PreConsentOptions } from '@rudderstack/analytics-js-common/types/LoadOptions';
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
 * These expectations must not change when `strategy` is deprecated in favour of the granular
 * `type`/`entries` options, so they are asserted against explicitly constructed values rather
 * than shared fixtures.
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
      state.loadOptions.value.storage = { ...state.loadOptions.value.storage, ...storage };
      state.loadOptions.value.preConsent = preConsent;

      updateStorageStateFromLoadOptions(logger);
      updateConsentsStateFromLoadOptions(logger);
      storeManager.initClientDataStores();

      expect(state.storage.entries.value).toEqual(expectedEntries);
      expect(state.storage.trulyAnonymousTracking.value).toBe(expectedTrulyAnonymousTracking);
    },
  );
});
