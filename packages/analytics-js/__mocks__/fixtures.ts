import { SourceConfigResponse } from '@rudderstack/analytics-js/components/configManager/types';
import { DestinationConnectionMode } from '@rudderstack/analytics-js/state/types';

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
          connectionMode: DestinationConnectionMode.Hybrid,
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
        areTransformationsConnected: false,
      },
      {
        config: {
          connectionMode: DestinationConnectionMode.Device,
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
        areTransformationsConnected: false,
      },
      {
        config: {
          connectionMode: DestinationConnectionMode.Cloud,
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
        areTransformationsConnected: false,
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
        areTransformationsConnected: false,
      },
    ],
  },
};

export {
  identifyRequestPayload,
  trackRequestPayload,
  pageRequestPayload,
  screenRequestPayload,
  groupRequestPayload,
  aliasRequestPayload,
  dummyWriteKey,
  dummyInitOptions,
  dummyDataplaneHost,
  dummySourceConfigResponse,
};
