import { UserSessionManager } from '@rudderstack/analytics-js/components/userSessionManager';
import { userSessionStorageKeys } from '@rudderstack/analytics-js/components/userSessionManager/userSessionStorageKeys';
import { defaultStoreManager } from '@rudderstack/analytics-js/services/StoreManager';
import { Store } from '@rudderstack/analytics-js/services/StoreManager/Store';
import { state, resetState } from '@rudderstack/analytics-js/state';

jest.mock('@rudderstack/analytics-js/components/utilities/uuId', () => ({
  generateUUID: jest.fn().mockReturnValue('test_uuid'),
}));

describe('User session manager', () => {
  let userSessionManager: UserSessionManager;

  defaultStoreManager.init();
  const clientDataStore = defaultStoreManager.getStore('clientData') as Store;

  const setCustomValuesInStorage = (data: any) => {
    Object.entries(data).forEach(([key, value]) => {
      clientDataStore.set(key, value);
    });
  };

  const clearStorage = () => {
    Object.values(userSessionStorageKeys).forEach(key => {
      clientDataStore.remove(key);
    });
  };

  beforeEach(() => {
    clearStorage();
    resetState();
    userSessionManager = new UserSessionManager();
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
    };
    setCustomValuesInStorage(customData);
    userSessionManager.init(clientDataStore);
    expect(state.session.userId.value).toBe(customData.rl_user_id);
    expect(state.session.userTraits.value).toStrictEqual(customData.rl_trait);
    expect(state.session.anonymousUserId.value).toBe(customData.rl_anonymous_id);
    expect(state.session.groupId.value).toBe(customData.rl_group_id);
    expect(state.session.groupTraits.value).toStrictEqual(customData.rl_group_trait);
    expect(state.session.initialReferrer.value).toBe(customData.rl_page_init_referrer);
    expect(state.session.initialReferringDomain.value).toBe(
      customData.rl_page_init_referring_domain,
    );
  });
  it('should initialize user details when storage is empty to state', () => {
    const customData = {
      rl_user_id: '',
      rl_trait: {},
      rl_group_id: '',
      rl_group_trait: {},
      rl_page_init_referrer: '$direct',
      rl_page_init_referring_domain: '',
    };
    userSessionManager.init(clientDataStore);
    expect(state.session.userId.value).toBe(customData.rl_user_id);
    expect(state.session.userTraits.value).toStrictEqual(customData.rl_trait);
    expect(typeof state.session.anonymousUserId.value).toBe('string');
    expect(state.session.anonymousUserId.value).toBe('test_uuid');
    expect(state.session.groupId.value).toBe(customData.rl_group_id);
    expect(state.session.groupTraits.value).toStrictEqual(customData.rl_group_trait);
    expect(state.session.initialReferrer.value).toBe(customData.rl_page_init_referrer);
    expect(state.session.initialReferringDomain.value).toBe(
      customData.rl_page_init_referring_domain,
    );
  });
  // TODO: mode test cases need to be covered
  it('setAnonymousId', () => {
    clientDataStore.set = jest.fn();
    const newAnonymousId = 'new-dummy-anonymous-id';
    userSessionManager.init(clientDataStore);
    userSessionManager.setAnonymousId(newAnonymousId);
    expect(state.session.anonymousUserId.value).toBe(newAnonymousId);
    expect(clientDataStore.set).toHaveBeenCalled();
  });
  it('setUserId', () => {
    clientDataStore.set = jest.fn();
    const newUserId = 'new-dummy-user-id';
    userSessionManager.init(clientDataStore);
    userSessionManager.setUserId(newUserId);
    expect(state.session.userId.value).toBe(newUserId);
    expect(clientDataStore.set).toHaveBeenCalled();
  });
  it('setUserTraits', () => {
    clientDataStore.set = jest.fn();
    const newUserTraits = { key1: 'value1', key2: 'value2' };
    userSessionManager.init(clientDataStore);
    userSessionManager.setUserTraits(newUserTraits);
    expect(state.session.userTraits.value).toStrictEqual(newUserTraits);
    expect(clientDataStore.set).toHaveBeenCalled();
  });
  it('setGroupId', () => {
    clientDataStore.set = jest.fn();
    const newGroupId = 'new-dummy-group-id';
    userSessionManager.init(clientDataStore);
    userSessionManager.setGroupId(newGroupId);
    expect(state.session.groupId.value).toBe(newGroupId);
    expect(clientDataStore.set).toHaveBeenCalled();
  });
  it('setGroupTraits', () => {
    clientDataStore.set = jest.fn();
    const newGroupTraits = { key1: 'value1', key2: 'value2' };
    userSessionManager.init(clientDataStore);
    userSessionManager.setGroupTraits(newGroupTraits);
    expect(state.session.groupTraits.value).toStrictEqual(newGroupTraits);
    expect(clientDataStore.set).toHaveBeenCalled();
  });
  it('setInitialReferrer', () => {
    clientDataStore.set = jest.fn();
    const newReferrer = 'new-dummy-referrer-1';
    userSessionManager.init(clientDataStore);
    userSessionManager.setInitialReferrer(newReferrer);
    expect(state.session.initialReferrer.value).toBe(newReferrer);
    expect(clientDataStore.set).toHaveBeenCalled();
  });
  it('setInitialReferringDomain', () => {
    clientDataStore.set = jest.fn();
    const newReferrer = 'new-dummy-referrer-2';
    userSessionManager.init(clientDataStore);
    userSessionManager.setInitialReferringDomain(newReferrer);
    expect(state.session.initialReferringDomain.value).toBe(newReferrer);
    expect(clientDataStore.set).toHaveBeenCalled();
  });
  it.skip('getAnonymousId', () => {
    const customData = {
      rl_anonymous_id: 'dummy-anonymousId-12345678',
    };
    setCustomValuesInStorage(customData);
    userSessionManager.init(clientDataStore);
    const actualAnonymousId = userSessionManager.getAnonymousId();
    expect(actualAnonymousId).toBe(customData.rl_anonymous_id);
  });
  it.skip('getAnonymousId with option to fetch from external source', () => {
    const customData = {
      ajs_anonymous_id: 'dummy-anonymousId-12345678',
    };
    const option = {
      autoCapture: {
        source: 'segment',
        enabled: true,
      },
    };
    setCustomValuesInStorage(customData);
    userSessionManager.init(clientDataStore);
    const actualAnonymousId = userSessionManager.getAnonymousId(option);
    expect(actualAnonymousId).toBe(customData.ajs_anonymous_id);
  });
  it.skip('getUserId', () => {
    const customData = {
      rl_user_id: 'dummy-userId-12345678',
    };
    setCustomValuesInStorage(customData);
    userSessionManager.init(clientDataStore);
    const actualUserId = userSessionManager.getUserId();
    expect(actualUserId).toBe(customData.rl_user_id);
  });
  it.skip('getUserTraits', () => {
    const customData = {
      rl_trait: { key1: 'value1', random: '123456789' },
    };
    setCustomValuesInStorage(customData);
    userSessionManager.init(clientDataStore);
    const actualUserTraits = userSessionManager.getUserTraits();
    expect(actualUserTraits).toStrictEqual(customData.rl_trait);
  });
  it.skip('getGroupId', () => {
    const customData = {
      rl_group_id: 'dummy-groupId-12345678',
    };
    setCustomValuesInStorage(customData);
    userSessionManager.init(clientDataStore);
    const actualGroupId = userSessionManager.getGroupId();
    expect(actualGroupId).toBe(customData.rl_group_id);
  });
  it.skip('getGroupTraits', () => {
    const customData = {
      rl_group_trait: { key1: 'value1', random: '123456789' },
    };
    setCustomValuesInStorage(customData);
    userSessionManager.init(clientDataStore);
    const actualGroupTraits = userSessionManager.getGroupTraits();
    expect(actualGroupTraits).toStrictEqual(customData.rl_group_trait);
  });
  it.skip('getInitialReferrer', () => {
    const customData = {
      rl_page_init_referrer: 'dummy-url-1234',
    };
    setCustomValuesInStorage(customData);
    userSessionManager.init(clientDataStore);
    const actualInitialReferrer = userSessionManager.getInitialReferrer();
    expect(actualInitialReferrer).toBe(customData.rl_page_init_referrer);
  });
  it.skip('getInitialReferringDomain', () => {
    const customData = {
      rl_page_init_referring_domain: 'dummy-url-287654',
    };
    setCustomValuesInStorage(customData);
    userSessionManager.init(clientDataStore);
    const actualInitialReferringDomain = userSessionManager.getInitialReferringDomain();
    expect(actualInitialReferringDomain).toBe(customData.rl_page_init_referring_domain);
  });
});
