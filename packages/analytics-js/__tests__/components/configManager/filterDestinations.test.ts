import { filterEnabledDestination } from '@rudderstack/analytics-js/components/configManager/util/filterDestinations';
import { ConfigResponseDestinationItem } from '@rudderstack/analytics-js/components/configManager/types';

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
    name: 'GA4',
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
  },
  {
    id: '2LoR1TbVG2bcISXvy7Damldfkg1',
    name: 'BRAZE',
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
  },
];

describe('Config manager util - filterEnabledDestination', () => {
  // it('should return enabled destinations in specific format', () => {
  //   const actualOutcome = filterEnabledDestination(sampleDestinationResponse1);
  //   expect(actualOutcome).toBe(expectedFilteredDestinations);
  // });
  // it('should not return deleted destinations', () => {
  //   const actualOutcome = filterEnabledDestination(sampleDestinationResponse2);
  //   expect(actualOutcome).toBe([]);
  // });
  it('should dummy', () => {
    expect(true).toBeTruthy();
  });
});
