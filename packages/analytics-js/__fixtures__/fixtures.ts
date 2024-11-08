import { COOKIE_KEYS } from '@rudderstack/analytics-js-cookies/constants/cookies';
import type { StorageEntries } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { SourceConfigResponse } from '@rudderstack/analytics-js-common/types/LoadOptions';

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
    key: COOKIE_KEYS.userId,
  },
  userTraits: {
    type: 'cookieStorage',
    key: COOKIE_KEYS.userTraits,
  },
  anonymousId: {
    type: 'cookieStorage',
    key: COOKIE_KEYS.anonymousId,
  },
  groupId: {
    type: 'cookieStorage',
    key: COOKIE_KEYS.groupId,
  },
  groupTraits: {
    type: 'cookieStorage',
    key: COOKIE_KEYS.groupTraits,
  },
  initialReferrer: {
    type: 'cookieStorage',
    key: COOKIE_KEYS.initialReferrer,
  },
  initialReferringDomain: {
    type: 'cookieStorage',
    key: COOKIE_KEYS.initialReferringDomain,
  },
  sessionInfo: {
    type: 'cookieStorage',
    key: COOKIE_KEYS.sessionInfo,
  },
  authToken: {
    type: 'cookieStorage',
    key: COOKIE_KEYS.authToken,
  },
} satisfies StorageEntries;

const entriesWithOnlyLocalStorage = {
  userId: {
    type: 'localStorage',
    key: COOKIE_KEYS.userId,
  },
  userTraits: {
    type: 'localStorage',
    key: COOKIE_KEYS.userTraits,
  },
  anonymousId: {
    type: 'localStorage',
    key: COOKIE_KEYS.anonymousId,
  },
  groupId: {
    type: 'localStorage',
    key: COOKIE_KEYS.groupId,
  },
  groupTraits: {
    type: 'localStorage',
    key: COOKIE_KEYS.groupTraits,
  },
  initialReferrer: {
    type: 'localStorage',
    key: COOKIE_KEYS.initialReferrer,
  },
  initialReferringDomain: {
    type: 'localStorage',
    key: COOKIE_KEYS.initialReferringDomain,
  },
  sessionInfo: {
    type: 'localStorage',
    key: COOKIE_KEYS.sessionInfo,
  },
  authToken: {
    type: 'localStorage',
    key: COOKIE_KEYS.authToken,
  },
} satisfies StorageEntries;

const entriesWithoutCookieStorage = {
  userId: {
    type: 'localStorage',
    key: COOKIE_KEYS.userId,
  },
  userTraits: {
    type: 'localStorage',
    key: COOKIE_KEYS.userTraits,
  },
  anonymousId: {
    type: 'sessionStorage',
    key: COOKIE_KEYS.anonymousId,
  },
  groupId: {
    type: 'localStorage',
    key: COOKIE_KEYS.groupId,
  },
  groupTraits: {
    type: 'localStorage',
    key: COOKIE_KEYS.groupTraits,
  },
  initialReferrer: {
    type: 'localStorage',
    key: COOKIE_KEYS.initialReferrer,
  },
  initialReferringDomain: {
    type: 'localStorage',
    key: COOKIE_KEYS.initialReferringDomain,
  },
  sessionInfo: {
    type: 'none',
    key: COOKIE_KEYS.sessionInfo,
  },
  authToken: {
    type: 'localStorage',
    key: COOKIE_KEYS.authToken,
  },
} satisfies StorageEntries;

const entriesWithoutCookieAndLocalStorage = {
  userId: {
    type: 'sessionStorage',
    key: COOKIE_KEYS.userId,
  },
  userTraits: {
    type: 'memoryStorage',
    key: COOKIE_KEYS.userTraits,
  },
  anonymousId: {
    type: 'sessionStorage',
    key: COOKIE_KEYS.anonymousId,
  },
  groupId: {
    type: 'sessionStorage',
    key: COOKIE_KEYS.groupId,
  },
  groupTraits: {
    type: 'sessionStorage',
    key: COOKIE_KEYS.groupTraits,
  },
  initialReferrer: {
    type: 'sessionStorage',
    key: COOKIE_KEYS.initialReferrer,
  },
  initialReferringDomain: {
    type: 'sessionStorage',
    key: COOKIE_KEYS.initialReferringDomain,
  },
  sessionInfo: {
    type: 'none',
    key: COOKIE_KEYS.sessionInfo,
  },
  authToken: {
    type: 'sessionStorage',
    key: COOKIE_KEYS.authToken,
  },
} satisfies StorageEntries;

const entriesWithOnlyNoStorage = {
  userId: {
    type: 'none',
    key: COOKIE_KEYS.userId,
  },
  userTraits: {
    type: 'none',
    key: COOKIE_KEYS.userTraits,
  },
  anonymousId: {
    type: 'none',
    key: COOKIE_KEYS.anonymousId,
  },
  groupId: {
    type: 'none',
    key: COOKIE_KEYS.groupId,
  },
  groupTraits: {
    type: 'none',
    key: COOKIE_KEYS.groupTraits,
  },
  initialReferrer: {
    type: 'none',
    key: COOKIE_KEYS.initialReferrer,
  },
  initialReferringDomain: {
    type: 'none',
    key: COOKIE_KEYS.initialReferringDomain,
  },
  sessionInfo: {
    type: 'none',
    key: COOKIE_KEYS.sessionInfo,
  },
  authToken: {
    type: 'none',
    key: COOKIE_KEYS.authToken,
  },
} satisfies StorageEntries;

const entriesWithOnlySessionStorage = {
  userId: {
    type: 'sessionStorage',
    key: COOKIE_KEYS.userId,
  },
  userTraits: {
    type: 'sessionStorage',
    key: COOKIE_KEYS.userTraits,
  },
  anonymousId: {
    type: 'sessionStorage',
    key: COOKIE_KEYS.anonymousId,
  },
  groupId: {
    type: 'sessionStorage',
    key: COOKIE_KEYS.groupId,
  },
  groupTraits: {
    type: 'sessionStorage',
    key: COOKIE_KEYS.groupTraits,
  },
  initialReferrer: {
    type: 'sessionStorage',
    key: COOKIE_KEYS.initialReferrer,
  },
  initialReferringDomain: {
    type: 'sessionStorage',
    key: COOKIE_KEYS.initialReferringDomain,
  },
  sessionInfo: {
    type: 'sessionStorage',
    key: COOKIE_KEYS.sessionInfo,
  },
  authToken: {
    type: 'sessionStorage',
    key: COOKIE_KEYS.authToken,
  },
} satisfies StorageEntries;

const entriesWithMixStorage = {
  userId: {
    type: 'cookieStorage',
    key: COOKIE_KEYS.userId,
  },
  userTraits: {
    type: 'localStorage',
    key: COOKIE_KEYS.userTraits,
  },
  anonymousId: {
    type: 'sessionStorage',
    key: COOKIE_KEYS.anonymousId,
  },
  groupId: {
    type: 'memoryStorage',
    key: COOKIE_KEYS.groupId,
  },
  groupTraits: {
    type: 'memoryStorage',
    key: COOKIE_KEYS.groupTraits,
  },
  initialReferrer: {
    type: 'memoryStorage',
    key: COOKIE_KEYS.initialReferrer,
  },
  initialReferringDomain: {
    type: 'memoryStorage',
    key: COOKIE_KEYS.initialReferringDomain,
  },
  sessionInfo: {
    type: 'none',
    key: COOKIE_KEYS.sessionInfo,
  },
  authToken: {
    type: 'memoryStorage',
    key: COOKIE_KEYS.authToken,
  },
} satisfies StorageEntries;

const entriesWithMixStorageButWithoutNone = {
  userId: {
    type: 'cookieStorage',
    key: COOKIE_KEYS.userId,
  },
  userTraits: {
    type: 'localStorage',
    key: COOKIE_KEYS.userTraits,
  },
  anonymousId: {
    type: 'sessionStorage',
    key: COOKIE_KEYS.anonymousId,
  },
  groupId: {
    type: 'memoryStorage',
    key: COOKIE_KEYS.groupId,
  },
  groupTraits: {
    type: 'memoryStorage',
    key: COOKIE_KEYS.groupTraits,
  },
  initialReferrer: {
    type: 'memoryStorage',
    key: COOKIE_KEYS.initialReferrer,
  },
  initialReferringDomain: {
    type: 'memoryStorage',
    key: COOKIE_KEYS.initialReferringDomain,
  },
  sessionInfo: {
    type: 'localStorage',
    key: COOKIE_KEYS.sessionInfo,
  },
  authToken: {
    type: 'memoryStorage',
    key: COOKIE_KEYS.authToken,
  },
} satisfies StorageEntries;

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
    key: COOKIE_KEYS.userId,
  },
  userTraits: {
    type: 'memoryStorage',
    key: COOKIE_KEYS.userTraits,
  },
  anonymousId: {
    type: 'memoryStorage',
    key: COOKIE_KEYS.anonymousId,
  },
  groupId: {
    type: 'memoryStorage',
    key: COOKIE_KEYS.groupId,
  },
  groupTraits: {
    type: 'memoryStorage',
    key: COOKIE_KEYS.groupTraits,
  },
  initialReferrer: {
    type: 'memoryStorage',
    key: COOKIE_KEYS.initialReferrer,
  },
  initialReferringDomain: {
    type: 'memoryStorage',
    key: COOKIE_KEYS.initialReferringDomain,
  },
  sessionInfo: {
    type: 'none',
    key: COOKIE_KEYS.sessionInfo,
  },
  authToken: {
    type: 'memoryStorage',
    key: COOKIE_KEYS.authToken,
  },
} satisfies StorageEntries;

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
    key: COOKIE_KEYS.userId,
  },
  userTraits: {
    type: 'none',
    key: COOKIE_KEYS.userTraits,
  },
  anonymousId: {
    type: 'none',
    key: COOKIE_KEYS.anonymousId,
  },
  groupId: {
    type: 'none',
    key: COOKIE_KEYS.groupId,
  },
  groupTraits: {
    type: 'none',
    key: COOKIE_KEYS.groupTraits,
  },
  initialReferrer: {
    type: 'none',
    key: COOKIE_KEYS.initialReferrer,
  },
  initialReferringDomain: {
    type: 'none',
    key: COOKIE_KEYS.initialReferringDomain,
  },
  sessionInfo: {
    type: 'cookieStorage',
    key: COOKIE_KEYS.sessionInfo,
  },
  authToken: {
    type: 'none',
    key: COOKIE_KEYS.authToken,
  },
} satisfies StorageEntries;

const anonymousIdWithNoStorageEntries = {
  userId: {
    type: 'cookieStorage',
    key: COOKIE_KEYS.userId,
  },
  userTraits: {
    type: 'cookieStorage',
    key: COOKIE_KEYS.userTraits,
  },
  anonymousId: {
    type: 'none',
    key: COOKIE_KEYS.anonymousId,
  },
  groupId: {
    type: 'cookieStorage',
    key: COOKIE_KEYS.groupId,
  },
  groupTraits: {
    type: 'cookieStorage',
    key: COOKIE_KEYS.groupTraits,
  },
  initialReferrer: {
    type: 'cookieStorage',
    key: COOKIE_KEYS.initialReferrer,
  },
  initialReferringDomain: {
    type: 'cookieStorage',
    key: COOKIE_KEYS.initialReferringDomain,
  },
  sessionInfo: {
    type: 'cookieStorage',
    key: COOKIE_KEYS.sessionInfo,
  },
  authToken: {
    type: 'cookieStorage',
    key: COOKIE_KEYS.authToken,
  },
} satisfies StorageEntries;

const entriesWithStorageOnlyForAnonymousId = {
  userId: {
    type: 'none',
    key: COOKIE_KEYS.userId,
  },
  userTraits: {
    type: 'none',
    key: COOKIE_KEYS.userTraits,
  },
  anonymousId: {
    type: 'cookieStorage',
    key: COOKIE_KEYS.anonymousId,
  },
  groupId: {
    type: 'none',
    key: COOKIE_KEYS.groupId,
  },
  groupTraits: {
    type: 'none',
    key: COOKIE_KEYS.groupTraits,
  },
  initialReferrer: {
    type: 'none',
    key: COOKIE_KEYS.initialReferrer,
  },
  initialReferringDomain: {
    type: 'none',
    key: COOKIE_KEYS.initialReferringDomain,
  },
  sessionInfo: {
    type: 'none',
    key: COOKIE_KEYS.sessionInfo,
  },
  authToken: {
    type: 'none',
    key: COOKIE_KEYS.authToken,
  },
} satisfies StorageEntries;

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
