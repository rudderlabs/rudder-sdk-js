import type { ConfigResponseDestinationItem } from '@rudderstack/analytics-js-common/types/LoadOptions';
import { filterEnabledDestination } from '../../../src/components/utilities/destinations';

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
    destinationDefinition: {
      name: 'GA4',
      displayName: 'Google Analytics 4 (GA4)',
    },
    destinationDefinitionId: 'some-destination-definition-id',
    shouldApplyDeviceModeTransformation: true,
    propagateEventsUntransformedOnError: false,
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
    destinationDefinition: {
      name: 'BRAZE',
      displayName: 'Braze',
    },
    destinationDefinitionId: 'some-destination-definition-id',
    shouldApplyDeviceModeTransformation: false,
    propagateEventsUntransformedOnError: false,
  },
];

const expectedFilteredDestinations = [
  {
    id: '2LoR1TbVG2bcISXvy7DamldfkgO',
    displayName: 'Google Analytics 4 (GA4)',
    shouldApplyDeviceModeTransformation: true,
    propagateEventsUntransformedOnError: false,
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
    userFriendlyId: 'Google-Analytics-4-(GA4)___2LoR1TbVG2bcISXvy7DamldfkgO',
  },
  {
    id: '2LoR1TbVG2bcISXvy7Damldfkg1',
    displayName: 'Braze',
    shouldApplyDeviceModeTransformation: false,
    propagateEventsUntransformedOnError: false,
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
});
