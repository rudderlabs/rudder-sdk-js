import { ConfigResponseDestinationItem } from '@rudderstack/analytics-js/components/configManager/types';
import {
  filterEnabledDestination,
  getNonCloudDestinations,
  isNonCloudDestination,
} from '@rudderstack/analytics-js/components/utilities/destinations';
import { dummySourceConfigResponse } from '../../../__mocks__/fixtures';

const sampleDestinationResponse1: ConfigResponseDestinationItem[] = [
  {
    config: {
      measurementId: 'G-SC6JGSYH6H',
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
    id: '2LoR1TbVG2bcISXvy7DamldfkgO',
    name: 'GA4 for JS SDK',
    updatedAt: '2023-03-14T11:34:29.216Z',
    enabled: true,
    deleted: false,
    destinationDefinition: {
      name: 'GA4',
      displayName: 'Google Analytics 4 (GA4)',
      updatedAt: '2023-03-14T11:21:29.656Z',
    },
    areTransformationsConnected: true,
  },
  {
    config: {
      measurementId: 'G-SC6JGSYH6H',
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
    id: '2LoR1TbVG2bcISXvy7Damldfkg1',
    name: 'Braze for JS SDK',
    updatedAt: '2023-03-14T11:34:29.216Z',
    enabled: true,
    deleted: false,
    destinationDefinition: {
      name: 'BRAZE',
      displayName: 'Braze',
      updatedAt: '2023-03-14T11:21:29.656Z',
    },
    areTransformationsConnected: false,
  },
];

const sampleDestinationResponse2: ConfigResponseDestinationItem[] = [
  {
    config: {
      measurementId: 'G-SC6JGSYH6H',
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
    id: '2LoR1TbVG2bcISXvy7DamldfkgO',
    name: 'GA4 for JS SDK',
    updatedAt: '2023-03-14T11:34:29.216Z',
    enabled: true,
    deleted: true,
    destinationDefinition: {
      name: 'GA4',
      displayName: 'Google Analytics 4 (GA4)',
      updatedAt: '2023-03-14T11:21:29.656Z',
    },
    areTransformationsConnected: true,
  },
  {
    config: {
      measurementId: 'G-SC6JGSYH6H',
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
    id: '2LoR1TbVG2bcISXvy7Damldfkg1',
    name: 'Braze for JS SDK',
    updatedAt: '2023-03-14T11:34:29.216Z',
    enabled: true,
    deleted: true,
    destinationDefinition: {
      name: 'BRAZE',
      displayName: 'Braze',
      updatedAt: '2023-03-14T11:21:29.656Z',
    },
    areTransformationsConnected: false,
  },
];

const expectedFilteredDestinations = [
  {
    id: '2LoR1TbVG2bcISXvy7DamldfkgO',
    displayName: 'Google Analytics 4 (GA4)',
    areTransformationsConnected: true,
    config: {
      measurementId: 'G-SC6JGSYH6H',
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
    userFriendlyId: 'Google_Analytics_4_(GA4)___2LoR1TbVG2bcISXvy7DamldfkgO',
  },
  {
    id: '2LoR1TbVG2bcISXvy7Damldfkg1',
    displayName: 'Braze',
    areTransformationsConnected: false,
    config: {
      measurementId: 'G-SC6JGSYH6H',
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
    userFriendlyId: 'Braze___2LoR1TbVG2bcISXvy7Damldfkg1',
  },
];

describe('Config manager util - filterEnabledDestination', () => {
  it('should return enabled destinations in specific format', () => {
    const actualOutcome = filterEnabledDestination(sampleDestinationResponse1);
    expect(actualOutcome).toStrictEqual(expectedFilteredDestinations);
  });

  it('should not return deleted destinations', () => {
    const actualOutcome = filterEnabledDestination(sampleDestinationResponse2);
    expect(actualOutcome).toStrictEqual([]);
  });

  it('should get non-cloud destinations', () => {
    const actualOutcome = getNonCloudDestinations(dummySourceConfigResponse.source.destinations);
    expect(actualOutcome.length).toBe(2);
  });

  it('should detect if destination is non-cloud', () => {
    const nativeDest = isNonCloudDestination(dummySourceConfigResponse.source.destinations[0]);
    expect(nativeDest).toBeTruthy();

    const cloudDest = isNonCloudDestination(dummySourceConfigResponse.source.destinations[2]);
    expect(cloudDest).toBeFalsy();
  });
});
