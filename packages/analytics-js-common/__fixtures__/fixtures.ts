import type { DestinationConfig } from '../src/types/Destination';

const dummyDataplaneHost = 'https://dummy.dataplane.host.com';

const dummySourceConfigResponse = {
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

const destinations = [
  {
    id: 'dummyDestinationId',
    displayName: 'GA4 for JS SDK Hybrid',
    userFriendlyId: 'dummyDestinationId',
    shouldApplyDeviceModeTransformation: false,
    propagateEventsUntransformedOnError: false,
    config: dummySourceConfigResponse.source.destinations[0]?.config as DestinationConfig,
  },
  {
    id: 'dummyDestinationId2',
    displayName: 'GA4 for JS SDK Device',
    userFriendlyId: 'dummyDestinationId2',
    shouldApplyDeviceModeTransformation: false,
    propagateEventsUntransformedOnError: false,
    config: dummySourceConfigResponse.source.destinations[1]?.config as DestinationConfig,
  },
  {
    id: 'dummyDestinationId3',
    displayName: 'GA4 for JS SDK Cloud',
    userFriendlyId: 'dummyDestinationId3',
    shouldApplyDeviceModeTransformation: false,
    propagateEventsUntransformedOnError: false,
    config: dummySourceConfigResponse.source.destinations[2]?.config as DestinationConfig,
  },
  {
    id: 'dummyDestinationId4',
    displayName: 'GA4 for JS SDK Cloud',
    userFriendlyId: 'dummyDestinationId4',
    shouldApplyDeviceModeTransformation: false,
    propagateEventsUntransformedOnError: false,
    config: dummySourceConfigResponse.source.destinations[3]?.config as DestinationConfig,
  },
];

export { dummyDataplaneHost, dummySourceConfigResponse, destinations };
