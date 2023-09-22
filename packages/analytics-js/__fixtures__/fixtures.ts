import { SourceConfigResponse } from '@rudderstack/analytics-js/components/configManager/types';
import { userSessionStorageKeys } from '@rudderstack/analytics-js/components/userSessionManager/userSessionStorageKeys';

const identifyRequestPayload = {
  userId: '123456',
  traits: {
    name: 'Name Username',
    email: 'name@website.com',
    plan: 'Free',
    friends: 21,
  },
};

const trackRequestPayload = {
  userId: '123456',
  event: 'Item Viewed',
  properties: {
    revenue: 19.95,
    shippingMethod: 'Premium',
  },
};

const pageRequestPayload = {
  userId: '12345',
  category: 'Food',
  name: 'Pizza',
  properties: {
    url: 'https://dominos.com',
    title: 'Pizza',
    referrer: 'https://google.com',
  },
};

const screenRequestPayload = {
  userId: '12345',
  category: 'Food',
  name: 'Pizza',
  properties: {
    screenSize: 10,
    title: 'Pizza',
    referrer: 'https://google.com',
  },
};

const groupRequestPayload = {
  userId: '12345',
  groupId: '1',
  traits: {
    name: 'Company',
    description: 'Google',
  },
};

const aliasRequestPayload = {
  previousId: 'old_id',
  userId: 'new_id',
};

const dummyWriteKey = 'dummyWriteKey';

const dummyDataplaneHost = 'https://dummy.dataplane.host.com';

const dummyInitOptions = {
  timeout: false,
  flushAt: 1,
  flushInterval: 200000,
  maxInternalQueueSize: 1,
  logLevel: 'off',
  enable: true,
};

const dummySourceConfigResponse: SourceConfigResponse = {
  isHosted: true,
  source: {
    config: {
      statsCollection: {
        errors: {
          enabled: false,
        },
        metrics: {
          enabled: false,
        },
      },
    },
    id: 'validSourceId',
    name: 'JS SDK Prod',
    writeKey: 'dummyWriteKey',
    enabled: true,
    workspaceId: 'dummyWorkspaceId',
    updatedAt: '2023-02-03T13:53:35.731Z',
    dataplanes: {
      US: '',
    },
    destinations: [
      {
        config: {
          connectionMode: 'hybrid',
          measurementId: 'G-SC6JGS1234',
          capturePageView: 'rs',
          whitelistedEvents: [
            {
              eventName: '',
            },
          ],
          blacklistedEvents: [
            {
              eventName: '',
            },
          ],
          useNativeSDKToSend: false,
          eventFilteringOption: 'disable',
          extendPageViewParams: false,
          oneTrustCookieCategories: [],
        },
        id: 'dummyDestinationId',
        name: 'GA4 for JS SDK Hybrid',
        updatedAt: '2023-03-14T11:34:29.216Z',
        enabled: true,
        deleted: false,
        destinationDefinition: {
          name: 'GA4',
          displayName: 'Google Analytics 4 (GA4)',
          updatedAt: '2023-03-14T11:21:29.656Z',
        },
        shouldApplyDeviceModeTransformation: false,
        propagateEventsUntransformedOnError: false,
      },
      {
        config: {
          connectionMode: 'device',
          measurementId: 'G-SC6JGS1234',
          capturePageView: 'rs',
          whitelistedEvents: [
            {
              eventName: '',
            },
          ],
          blacklistedEvents: [
            {
              eventName: '',
            },
          ],
          useNativeSDK: true,
          eventFilteringOption: 'disable',
          extendPageViewParams: false,
          oneTrustCookieCategories: [],
        },
        id: 'dummyDestinationId2',
        name: 'GA4 for JS SDK Device',
        updatedAt: '2023-03-14T11:34:29.216Z',
        enabled: true,
        deleted: false,
        destinationDefinition: {
          name: 'GA4',
          displayName: 'Google Analytics 4 (GA4)',
          updatedAt: '2023-03-14T11:21:29.656Z',
        },
        shouldApplyDeviceModeTransformation: false,
        propagateEventsUntransformedOnError: false,
      },
      {
        config: {
          connectionMode: 'cloud',
          measurementId: 'G-SC6JGS1234',
          capturePageView: 'rs',
          whitelistedEvents: [
            {
              eventName: '',
            },
          ],
          blacklistedEvents: [
            {
              eventName: '',
            },
          ],
          useNativeSDKToSend: false,
          eventFilteringOption: 'disable',
          extendPageViewParams: false,
          oneTrustCookieCategories: [],
        },
        id: 'dummyDestinationId3',
        name: 'GA4 for JS SDK Cloud',
        updatedAt: '2023-03-14T11:34:29.216Z',
        enabled: true,
        deleted: false,
        destinationDefinition: {
          name: 'GA4',
          displayName: 'Google Analytics 4 (GA4)',
          updatedAt: '2023-03-14T11:21:29.656Z',
        },
        shouldApplyDeviceModeTransformation: false,
        propagateEventsUntransformedOnError: false,
      },
      {
        config: {
          measurementId: 'G-SC6JGS1234',
          capturePageView: 'rs',
          whitelistedEvents: [
            {
              eventName: '',
            },
          ],
          blacklistedEvents: [
            {
              eventName: '',
            },
          ],
          useNativeSDKToSend: true,
          eventFilteringOption: 'disable',
          extendPageViewParams: false,
          oneTrustCookieCategories: [],
        },
        id: 'dummyDestinationId4',
        name: 'GA4 for JS SDK Cloud',
        updatedAt: '2023-03-14T11:34:29.216Z',
        enabled: true,
        deleted: false,
        destinationDefinition: {
          name: 'GA4',
          displayName: 'Google Analytics 4 (GA4)',
          updatedAt: '2023-03-14T11:21:29.656Z',
        },
        shouldApplyDeviceModeTransformation: false,
        propagateEventsUntransformedOnError: false,
      },
    ],
  },
};

const entriesWithOnlyCookieStorage = {
  userId: {
    type: 'cookieStorage',
    key: userSessionStorageKeys.userId,
  },
  userTraits: {
    type: 'cookieStorage',
    key: userSessionStorageKeys.userTraits,
  },
  anonymousId: {
    type: 'cookieStorage',
    key: userSessionStorageKeys.anonymousId,
  },
  groupId: {
    type: 'cookieStorage',
    key: userSessionStorageKeys.groupId,
  },
  groupTraits: {
    type: 'cookieStorage',
    key: userSessionStorageKeys.groupTraits,
  },
  initialReferrer: {
    type: 'cookieStorage',
    key: userSessionStorageKeys.initialReferrer,
  },
  initialReferringDomain: {
    type: 'cookieStorage',
    key: userSessionStorageKeys.initialReferringDomain,
  },
  sessionInfo: {
    type: 'cookieStorage',
    key: userSessionStorageKeys.sessionInfo,
  },
};

const entriesWithOnlyLocalStorage = {
  userId: {
    type: 'localStorage',
    key: userSessionStorageKeys.userId,
  },
  userTraits: {
    type: 'localStorage',
    key: userSessionStorageKeys.userTraits,
  },
  anonymousId: {
    type: 'localStorage',
    key: userSessionStorageKeys.anonymousId,
  },
  groupId: {
    type: 'localStorage',
    key: userSessionStorageKeys.groupId,
  },
  groupTraits: {
    type: 'localStorage',
    key: userSessionStorageKeys.groupTraits,
  },
  initialReferrer: {
    type: 'localStorage',
    key: userSessionStorageKeys.initialReferrer,
  },
  initialReferringDomain: {
    type: 'localStorage',
    key: userSessionStorageKeys.initialReferringDomain,
  },
  sessionInfo: {
    type: 'localStorage',
    key: userSessionStorageKeys.sessionInfo,
  },
};

const entriesWithOnlyNoStorage = {
  userId: {
    type: 'none',
    key: userSessionStorageKeys.userId,
  },
  userTraits: {
    type: 'none',
    key: userSessionStorageKeys.userTraits,
  },
  anonymousId: {
    type: 'none',
    key: userSessionStorageKeys.anonymousId,
  },
  groupId: {
    type: 'none',
    key: userSessionStorageKeys.groupId,
  },
  groupTraits: {
    type: 'none',
    key: userSessionStorageKeys.groupTraits,
  },
  initialReferrer: {
    type: 'none',
    key: userSessionStorageKeys.initialReferrer,
  },
  initialReferringDomain: {
    type: 'none',
    key: userSessionStorageKeys.initialReferringDomain,
  },
  sessionInfo: {
    type: 'none',
    key: userSessionStorageKeys.sessionInfo,
  },
};

const entriesWithMixStorage = {
  userId: {
    type: 'cookieStorage',
    key: userSessionStorageKeys.userId,
  },
  userTraits: {
    type: 'localStorage',
    key: userSessionStorageKeys.userTraits,
  },
  anonymousId: {
    type: 'cookieStorage',
    key: userSessionStorageKeys.anonymousId,
  },
  groupId: {
    type: 'memoryStorage',
    key: userSessionStorageKeys.groupId,
  },
  groupTraits: {
    type: 'memoryStorage',
    key: userSessionStorageKeys.groupTraits,
  },
  initialReferrer: {
    type: 'memoryStorage',
    key: userSessionStorageKeys.initialReferrer,
  },
  initialReferringDomain: {
    type: 'memoryStorage',
    key: userSessionStorageKeys.initialReferringDomain,
  },
  sessionInfo: {
    type: 'none',
    key: userSessionStorageKeys.sessionInfo,
  },
};

const loadOptionWithEntry = {
  userId: {
    type: 'cookieStorage',
  },
  userTraits: {
    type: 'localStorage',
  },
  anonymousId: {
    type: 'cookieStorage',
  },
  sessionInfo: {
    type: 'none',
  },
};

const loadOptionWithInvalidEntry = {
  userId: {
    type: 'test',
  },
  userTraits: {
    type: 'sample',
  },
  anonymousId: {
    type: 'cookieStorage',
  },
};

export {
  identifyRequestPayload,
  trackRequestPayload,
  pageRequestPayload,
  screenRequestPayload,
  aliasRequestPayload,
  dummyWriteKey,
  dummyInitOptions,
  dummyDataplaneHost,
  dummySourceConfigResponse,
  entriesWithOnlyCookieStorage,
  entriesWithOnlyLocalStorage,
  entriesWithOnlyNoStorage,
  entriesWithMixStorage,
  loadOptionWithEntry,
  loadOptionWithInvalidEntry,
};
