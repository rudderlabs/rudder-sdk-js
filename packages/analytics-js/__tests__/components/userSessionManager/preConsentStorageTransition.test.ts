import { COOKIE_KEYS } from '@rudderstack/analytics-js-cookies/constants/cookies';
import type { StorageOpts } from '@rudderstack/analytics-js-common/types/Storage';
import type { PreConsentOptions } from '@rudderstack/analytics-js-common/types/LoadOptions';
import { UserSessionManager } from '../../../src/components/userSessionManager';
import { StoreManager } from '../../../src/services/StoreManager';
import type { Store } from '../../../src/services/StoreManager/Store';
import { state, resetState } from '../../../src/state';
import { defaultLogger } from '../../../src/services/Logger';
import { defaultErrorHandler } from '../../../src/services/ErrorHandler';
import { defaultHttpClient } from '../../../src/services/HttpClient';
import { PluginsManager } from '../../../src/components/pluginsManager';
import { defaultPluginEngine } from '../../../src/services/PluginEngine';
import {
  updateConsentsStateFromLoadOptions,
  updateStorageStateFromLoadOptions,
} from '../../../src/components/configManager/util/commonUtil';

/**
 * Without the deprecated storage strategy, the load API storage options decide what is persisted
 * before consent is given. These cover the transition to the post-consent phase.
 */
describe('Pre-consent to post-consent storage transition', () => {
  const defaultPluginsManager = new PluginsManager(
    defaultPluginEngine,
    defaultErrorHandler,
    defaultLogger,
  );
  const storeManager = new StoreManager(defaultPluginsManager, defaultErrorHandler, defaultLogger);

  let clientDataStoreCookie: Store;
  let clientDataStoreLS: Store;
  let clientDataStoreSession: Store;
  let userSessionManager: UserSessionManager;

  beforeAll(() => {
    storeManager.init();

    clientDataStoreCookie = storeManager.getStore('clientDataInCookie') as Store;
    clientDataStoreLS = storeManager.getStore('clientDataInLocalStorage') as Store;
    clientDataStoreSession = storeManager.getStore('clientDataInSessionStorage') as Store;
  });

  beforeEach(() => {
    Object.values(COOKIE_KEYS).forEach(key => {
      clientDataStoreCookie.remove(key);
      clientDataStoreLS.remove(key);
      clientDataStoreSession.remove(key);
    });

    resetState();
    defaultHttpClient.init(defaultErrorHandler);

    state.loadOptions.value.consentManagement = { enabled: true, provider: 'oneTrust' };

    userSessionManager = new UserSessionManager(
      defaultPluginsManager,
      storeManager,
      defaultHttpClient,
      defaultErrorHandler,
      defaultLogger,
    );
  });

  const loadBeforeConsent = (storage: StorageOpts, preConsent: PreConsentOptions) => {
    state.loadOptions.value.storage = storage;
    state.loadOptions.value.preConsent = preConsent;

    updateStorageStateFromLoadOptions(defaultLogger);
    updateConsentsStateFromLoadOptions(defaultLogger);
    storeManager.initializeStorageState();
    userSessionManager.init();
  };

  /**
   * Mirrors what the consent API does once consent is given
   */
  const giveConsent = (postConsentStorage?: StorageOpts) => {
    if (postConsentStorage) {
      state.consents.postConsent.value = { storage: postConsentStorage };
    }
    state.consents.preConsent.value = { ...state.consents.preConsent.value, enabled: false };
    storeManager.initializeStorageState();
    userSessionManager.syncStorageDataToState();
  };

  it('should not persist anything before consent if no storage type is configured', () => {
    loadBeforeConsent({}, { enabled: true, events: { delivery: 'buffer' } });

    // The anonymous ID is only generated for a storage type that can hold it
    expect(state.session.anonymousId.value).toBe('');
    expect(state.storage.trulyAnonymousTracking.value).toBe(true);

    giveConsent();

    expect(state.session.anonymousId.value).not.toBe('');
    expect(clientDataStoreCookie.get(COOKIE_KEYS.anonymousId)).toBe(
      state.session.anonymousId.value,
    );
  });

  it('should persist only the configured entries before consent', () => {
    loadBeforeConsent(
      { entries: { anonymousId: { type: 'cookieStorage' } } },
      { enabled: true, events: { delivery: 'buffer' } },
    );

    const preConsentAnonymousId = state.session.anonymousId.value;

    expect(preConsentAnonymousId).not.toBe('');
    expect(clientDataStoreCookie.get(COOKIE_KEYS.anonymousId)).toBe(preConsentAnonymousId);
    expect(clientDataStoreCookie.get(COOKIE_KEYS.userTraits)).toBeNull();

    giveConsent();

    expect(state.session.anonymousId.value).toBe(preConsentAnonymousId);
  });

  it('should relocate the persisted data if the post-consent storage type differs', () => {
    loadBeforeConsent(
      { entries: { anonymousId: { type: 'sessionStorage' } } },
      { enabled: true, events: { delivery: 'buffer' } },
    );

    const preConsentAnonymousId = state.session.anonymousId.value;

    expect(clientDataStoreSession.get(COOKIE_KEYS.anonymousId)).toBe(preConsentAnonymousId);
    expect(clientDataStoreCookie.get(COOKIE_KEYS.anonymousId)).toBeNull();

    giveConsent({ type: 'cookieStorage' });

    expect(state.session.anonymousId.value).toBe(preConsentAnonymousId);
    expect(clientDataStoreCookie.get(COOKIE_KEYS.anonymousId)).toBe(preConsentAnonymousId);
    expect(clientDataStoreSession.get(COOKIE_KEYS.anonymousId)).toBeNull();
  });

  it('should retain the session generated before consent when the session info is persisted', () => {
    loadBeforeConsent(
      {
        entries: {
          anonymousId: { type: 'cookieStorage' },
          sessionInfo: { type: 'cookieStorage' },
        },
      },
      { enabled: true, events: { delivery: 'buffer' } },
    );

    const preConsentAnonymousId = state.session.anonymousId.value;
    const preConsentSessionId = state.session.sessionInfo.value.id;

    expect(preConsentSessionId).toBeDefined();

    giveConsent();

    expect(state.session.anonymousId.value).toBe(preConsentAnonymousId);
    expect(state.session.sessionInfo.value.id).toBe(preConsentSessionId);
  });
});
