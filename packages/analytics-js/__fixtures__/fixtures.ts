import { SourceConfigResponse } from '@rudderstack/analytics-js/components/configManager/types';
import { USER_SESSION_STORAGE_KEYS } from '@rudderstack/analytics-js/components/userSessionManager/constants';

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
    key: USER_SESSION_STORAGE_KEYS.userId,
  },
  userTraits: {
    type: 'cookieStorage',
    key: USER_SESSION_STORAGE_KEYS.userTraits,
  },
  anonymousId: {
    type: 'cookieStorage',
    key: USER_SESSION_STORAGE_KEYS.anonymousId,
  },
  groupId: {
    type: 'cookieStorage',
    key: USER_SESSION_STORAGE_KEYS.groupId,
  },
  groupTraits: {
    type: 'cookieStorage',
    key: USER_SESSION_STORAGE_KEYS.groupTraits,
  },
  initialReferrer: {
    type: 'cookieStorage',
    key: USER_SESSION_STORAGE_KEYS.initialReferrer,
  },
  initialReferringDomain: {
    type: 'cookieStorage',
    key: USER_SESSION_STORAGE_KEYS.initialReferringDomain,
  },
  sessionInfo: {
    type: 'cookieStorage',
    key: USER_SESSION_STORAGE_KEYS.sessionInfo,
  },
  authToken: {
    type: 'cookieStorage',
    key: USER_SESSION_STORAGE_KEYS.authToken,
  },
};

const entriesWithOnlyLocalStorage = {
  userId: {
    type: 'localStorage',
    key: USER_SESSION_STORAGE_KEYS.userId,
  },
  userTraits: {
    type: 'localStorage',
    key: USER_SESSION_STORAGE_KEYS.userTraits,
  },
  anonymousId: {
    type: 'localStorage',
    key: USER_SESSION_STORAGE_KEYS.anonymousId,
  },
  groupId: {
    type: 'localStorage',
    key: USER_SESSION_STORAGE_KEYS.groupId,
  },
  groupTraits: {
    type: 'localStorage',
    key: USER_SESSION_STORAGE_KEYS.groupTraits,
  },
  initialReferrer: {
    type: 'localStorage',
    key: USER_SESSION_STORAGE_KEYS.initialReferrer,
  },
  initialReferringDomain: {
    type: 'localStorage',
    key: USER_SESSION_STORAGE_KEYS.initialReferringDomain,
  },
  sessionInfo: {
    type: 'localStorage',
    key: USER_SESSION_STORAGE_KEYS.sessionInfo,
  },
  authToken: {
    type: 'localStorage',
    key: USER_SESSION_STORAGE_KEYS.authToken,
  },
};

const entriesWithoutCookieStorage = {
  userId: {
    type: 'localStorage',
    key: USER_SESSION_STORAGE_KEYS.userId,
  },
  userTraits: {
    type: 'localStorage',
    key: USER_SESSION_STORAGE_KEYS.userTraits,
  },
  anonymousId: {
    type: 'sessionStorage',
    key: USER_SESSION_STORAGE_KEYS.anonymousId,
  },
  groupId: {
    type: 'localStorage',
    key: USER_SESSION_STORAGE_KEYS.groupId,
  },
  groupTraits: {
    type: 'localStorage',
    key: USER_SESSION_STORAGE_KEYS.groupTraits,
  },
  initialReferrer: {
    type: 'localStorage',
    key: USER_SESSION_STORAGE_KEYS.initialReferrer,
  },
  initialReferringDomain: {
    type: 'localStorage',
    key: USER_SESSION_STORAGE_KEYS.initialReferringDomain,
  },
  sessionInfo: {
    type: 'none',
    key: USER_SESSION_STORAGE_KEYS.sessionInfo,
  },
  authToken: {
    type: 'localStorage',
    key: USER_SESSION_STORAGE_KEYS.authToken,
  },
};

const entriesWithoutCookieAndLocalStorage = {
  userId: {
    type: 'sessionStorage',
    key: USER_SESSION_STORAGE_KEYS.userId,
  },
  userTraits: {
    type: 'memoryStorage',
    key: USER_SESSION_STORAGE_KEYS.userTraits,
  },
  anonymousId: {
    type: 'sessionStorage',
    key: USER_SESSION_STORAGE_KEYS.anonymousId,
  },
  groupId: {
    type: 'sessionStorage',
    key: USER_SESSION_STORAGE_KEYS.groupId,
  },
  groupTraits: {
    type: 'sessionStorage',
    key: USER_SESSION_STORAGE_KEYS.groupTraits,
  },
  initialReferrer: {
    type: 'sessionStorage',
    key: USER_SESSION_STORAGE_KEYS.initialReferrer,
  },
  initialReferringDomain: {
    type: 'sessionStorage',
    key: USER_SESSION_STORAGE_KEYS.initialReferringDomain,
  },
  sessionInfo: {
    type: 'none',
    key: USER_SESSION_STORAGE_KEYS.sessionInfo,
  },
  authToken: {
    type: 'sessionStorage',
    key: USER_SESSION_STORAGE_KEYS.authToken,
  },
};

const entriesWithOnlyNoStorage = {
  userId: {
    type: 'none',
    key: USER_SESSION_STORAGE_KEYS.userId,
  },
  userTraits: {
    type: 'none',
    key: USER_SESSION_STORAGE_KEYS.userTraits,
  },
  anonymousId: {
    type: 'none',
    key: USER_SESSION_STORAGE_KEYS.anonymousId,
  },
  groupId: {
    type: 'none',
    key: USER_SESSION_STORAGE_KEYS.groupId,
  },
  groupTraits: {
    type: 'none',
    key: USER_SESSION_STORAGE_KEYS.groupTraits,
  },
  initialReferrer: {
    type: 'none',
    key: USER_SESSION_STORAGE_KEYS.initialReferrer,
  },
  initialReferringDomain: {
    type: 'none',
    key: USER_SESSION_STORAGE_KEYS.initialReferringDomain,
  },
  sessionInfo: {
    type: 'none',
    key: USER_SESSION_STORAGE_KEYS.sessionInfo,
  },
  authToken: {
    type: 'none',
    key: USER_SESSION_STORAGE_KEYS.authToken,
  },
};

const entriesWithOnlySessionStorage = {
  userId: {
    type: 'sessionStorage',
    key: USER_SESSION_STORAGE_KEYS.userId,
  },
  userTraits: {
    type: 'sessionStorage',
    key: USER_SESSION_STORAGE_KEYS.userTraits,
  },
  anonymousId: {
    type: 'sessionStorage',
    key: USER_SESSION_STORAGE_KEYS.anonymousId,
  },
  groupId: {
    type: 'sessionStorage',
    key: USER_SESSION_STORAGE_KEYS.groupId,
  },
  groupTraits: {
    type: 'sessionStorage',
    key: USER_SESSION_STORAGE_KEYS.groupTraits,
  },
  initialReferrer: {
    type: 'sessionStorage',
    key: USER_SESSION_STORAGE_KEYS.initialReferrer,
  },
  initialReferringDomain: {
    type: 'sessionStorage',
    key: USER_SESSION_STORAGE_KEYS.initialReferringDomain,
  },
  sessionInfo: {
    type: 'sessionStorage',
    key: USER_SESSION_STORAGE_KEYS.sessionInfo,
  },
  authToken: {
    type: 'sessionStorage',
    key: USER_SESSION_STORAGE_KEYS.authToken,
  },
};

const entriesWithMixStorage = {
  userId: {
    type: 'cookieStorage',
    key: USER_SESSION_STORAGE_KEYS.userId,
  },
  userTraits: {
    type: 'localStorage',
    key: USER_SESSION_STORAGE_KEYS.userTraits,
  },
  anonymousId: {
    type: 'sessionStorage',
    key: USER_SESSION_STORAGE_KEYS.anonymousId,
  },
  groupId: {
    type: 'memoryStorage',
    key: USER_SESSION_STORAGE_KEYS.groupId,
  },
  groupTraits: {
    type: 'memoryStorage',
    key: USER_SESSION_STORAGE_KEYS.groupTraits,
  },
  initialReferrer: {
    type: 'memoryStorage',
    key: USER_SESSION_STORAGE_KEYS.initialReferrer,
  },
  initialReferringDomain: {
    type: 'memoryStorage',
    key: USER_SESSION_STORAGE_KEYS.initialReferringDomain,
  },
  sessionInfo: {
    type: 'none',
    key: USER_SESSION_STORAGE_KEYS.sessionInfo,
  },
  authToken: {
    type: 'memoryStorage',
    key: USER_SESSION_STORAGE_KEYS.authToken,
  },
};

const entriesWithMixStorageButWithoutNone = {
  userId: {
    type: 'cookieStorage',
    key: USER_SESSION_STORAGE_KEYS.userId,
  },
  userTraits: {
    type: 'localStorage',
    key: USER_SESSION_STORAGE_KEYS.userTraits,
  },
  anonymousId: {
    type: 'sessionStorage',
    key: USER_SESSION_STORAGE_KEYS.anonymousId,
  },
  groupId: {
    type: 'memoryStorage',
    key: USER_SESSION_STORAGE_KEYS.groupId,
  },
  groupTraits: {
    type: 'memoryStorage',
    key: USER_SESSION_STORAGE_KEYS.groupTraits,
  },
  initialReferrer: {
    type: 'memoryStorage',
    key: USER_SESSION_STORAGE_KEYS.initialReferrer,
  },
  initialReferringDomain: {
    type: 'memoryStorage',
    key: USER_SESSION_STORAGE_KEYS.initialReferringDomain,
  },
  sessionInfo: {
    type: 'localStorage',
    key: USER_SESSION_STORAGE_KEYS.sessionInfo,
  },
  authToken: {
    type: 'memoryStorage',
    key: USER_SESSION_STORAGE_KEYS.authToken,
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
    type: 'sessionStorage',
  },
  sessionInfo: {
    type: 'none',
  },
};

const postConsentStorageEntryOptions = {
  userId: {
    type: 'cookieStorage',
  },
  userTraits: {
    type: 'localStorage',
  },
  anonymousId: {
    type: 'sessionStorage',
  },
  sessionInfo: {
    type: 'none',
  },
};

const entriesWithInMemoryFallback = {
  userId: {
    type: 'memoryStorage',
    key: USER_SESSION_STORAGE_KEYS.userId,
  },
  userTraits: {
    type: 'memoryStorage',
    key: USER_SESSION_STORAGE_KEYS.userTraits,
  },
  anonymousId: {
    type: 'memoryStorage',
    key: USER_SESSION_STORAGE_KEYS.anonymousId,
  },
  groupId: {
    type: 'memoryStorage',
    key: USER_SESSION_STORAGE_KEYS.groupId,
  },
  groupTraits: {
    type: 'memoryStorage',
    key: USER_SESSION_STORAGE_KEYS.groupTraits,
  },
  initialReferrer: {
    type: 'memoryStorage',
    key: USER_SESSION_STORAGE_KEYS.initialReferrer,
  },
  initialReferringDomain: {
    type: 'memoryStorage',
    key: USER_SESSION_STORAGE_KEYS.initialReferringDomain,
  },
  sessionInfo: {
    type: 'none',
    key: USER_SESSION_STORAGE_KEYS.sessionInfo,
  },
  authToken: {
    type: 'memoryStorage',
    key: USER_SESSION_STORAGE_KEYS.authToken,
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

const entriesWithStorageOnlyForSession = {
  userId: {
    type: 'none',
    key: USER_SESSION_STORAGE_KEYS.userId,
  },
  userTraits: {
    type: 'none',
    key: USER_SESSION_STORAGE_KEYS.userTraits,
  },
  anonymousId: {
    type: 'none',
    key: USER_SESSION_STORAGE_KEYS.anonymousId,
  },
  groupId: {
    type: 'none',
    key: USER_SESSION_STORAGE_KEYS.groupId,
  },
  groupTraits: {
    type: 'none',
    key: USER_SESSION_STORAGE_KEYS.groupTraits,
  },
  initialReferrer: {
    type: 'none',
    key: USER_SESSION_STORAGE_KEYS.initialReferrer,
  },
  initialReferringDomain: {
    type: 'none',
    key: USER_SESSION_STORAGE_KEYS.initialReferringDomain,
  },
  sessionInfo: {
    type: 'cookieStorage',
    key: USER_SESSION_STORAGE_KEYS.sessionInfo,
  },
  authToken: {
    type: 'none',
    key: USER_SESSION_STORAGE_KEYS.authToken,
  },
};

const anonymousIdWithNoStorageEntries = {
  userId: {
    type: 'cookieStorage',
    key: USER_SESSION_STORAGE_KEYS.userId,
  },
  userTraits: {
    type: 'cookieStorage',
    key: USER_SESSION_STORAGE_KEYS.userTraits,
  },
  anonymousId: {
    type: 'none',
    key: USER_SESSION_STORAGE_KEYS.anonymousId,
  },
  groupId: {
    type: 'cookieStorage',
    key: USER_SESSION_STORAGE_KEYS.groupId,
  },
  groupTraits: {
    type: 'cookieStorage',
    key: USER_SESSION_STORAGE_KEYS.groupTraits,
  },
  initialReferrer: {
    type: 'cookieStorage',
    key: USER_SESSION_STORAGE_KEYS.initialReferrer,
  },
  initialReferringDomain: {
    type: 'cookieStorage',
    key: USER_SESSION_STORAGE_KEYS.initialReferringDomain,
  },
  sessionInfo: {
    type: 'cookieStorage',
    key: USER_SESSION_STORAGE_KEYS.sessionInfo,
  },
  authToken: {
    type: 'cookieStorage',
    key: USER_SESSION_STORAGE_KEYS.authToken,
  },
};

const entriesWithStorageOnlyForAnonymousId = {
  userId: {
    type: 'none',
    key: USER_SESSION_STORAGE_KEYS.userId,
  },
  userTraits: {
    type: 'none',
    key: USER_SESSION_STORAGE_KEYS.userTraits,
  },
  anonymousId: {
    type: 'cookieStorage',
    key: USER_SESSION_STORAGE_KEYS.anonymousId,
  },
  groupId: {
    type: 'none',
    key: USER_SESSION_STORAGE_KEYS.groupId,
  },
  groupTraits: {
    type: 'none',
    key: USER_SESSION_STORAGE_KEYS.groupTraits,
  },
  initialReferrer: {
    type: 'none',
    key: USER_SESSION_STORAGE_KEYS.initialReferrer,
  },
  initialReferringDomain: {
    type: 'none',
    key: USER_SESSION_STORAGE_KEYS.initialReferringDomain,
  },
  sessionInfo: {
    type: 'none',
    key: USER_SESSION_STORAGE_KEYS.sessionInfo,
  },
  authToken: {
    type: 'none',
    key: USER_SESSION_STORAGE_KEYS.authToken,
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
  entriesWithStorageOnlyForSession,
  entriesWithStorageOnlyForAnonymousId,
  entriesWithOnlySessionStorage,
  anonymousIdWithNoStorageEntries,
  entriesWithInMemoryFallback,
  postConsentStorageEntryOptions,
  entriesWithoutCookieStorage,
  entriesWithoutCookieAndLocalStorage,
  entriesWithMixStorageButWithoutNone,
};
