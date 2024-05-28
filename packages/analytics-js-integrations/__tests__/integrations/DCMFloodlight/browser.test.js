import { DCMFloodlight } from '../../../src/integrations/DCMFloodlight';

const config = {
  advertiserId: '00000000',
  activityTag: '',
  groupTag: '',
  conversionEvents: [
    {
      eventName: 'testEvent',
      floodlightActivityTag: 'signu01',
      floodlightGroupTag: 'conv01',
      floodlightCountingMethod: 'standard',
      salesTag: false,
      customVariables: [
        {
          from: 'RudderstackProperty1',
          to: '1',
        },
        {
          from: 'RudderstackProperty2',
          to: '2',
        },
      ],
    },
    {
      eventName: 'Order Complete',
      floodlightActivityTag: 'signu01',
      floodlightGroupTag: 'conv02',
      floodlightCountingMethod: 'unique',
      salesTag: false,
      customVariables: [
        {
          from: '',
          to: '',
        },
      ],
    },
  ],
  useNativeSDK: { web: true },
};

const destinationInfo = {
  areTransformationsConnected: false,
  destinationId: 'sample-destination-id',
};

beforeEach(() => {
  // Add a dummy script as it is required by the init script
  const scriptElement = document.createElement('script');
  scriptElement.type = 'text/javascript';
  scriptElement.id = 'dummyScript';
  const headElements = document.getElementsByTagName('head');
  headElements[0].insertBefore(scriptElement, headElements[0].firstChild);
});

describe('init', () => {
  let dcmFloodlight;

  it('should initialize with gtag on init', () => {
    dcmFloodlight = new DCMFloodlight(config, { loglevel: 'debug' }, destinationInfo);
    dcmFloodlight.init();
    expect(typeof config).toBe('object');
  });

  it('should initialize with iframe on init', () => {
    dcmFloodlight = new DCMFloodlight(
      { ...config, tagFormat: 'iframeTag' },
      { loglevel: 'debug' },
      destinationInfo,
    );
    dcmFloodlight.init();
    expect(typeof config).toBe('object');
  });
});

describe('track', () => {
  beforeEach(() => {
    window.gtag = [];
  });
  let dcmFloodlight;

  it('should use the fallback counting method from config for matching conversion event', () => {
    dcmFloodlight = new DCMFloodlight(config, { loglevel: 'debug' });
    dcmFloodlight.init();
    window.gtag = jest.fn();
    dcmFloodlight.track({
      message: {
        type: 'track',
        event: 'testEvent',
        properties: {
          name: 'test',
        },
      },
    });
    expect(window.gtag.mock.calls[0][2]).toEqual({
      allow_custom_scripts: true,
      send_to: 'DC-00000000/conv01/signu01+standard',
    });
  });

  it('should use the counting method from properties for given conversion event', () => {
    dcmFloodlight = new DCMFloodlight(config, { loglevel: 'debug' });
    dcmFloodlight.init();
    window.gtag = jest.fn();
    dcmFloodlight.track({
      message: {
        type: 'track',
        event: 'testEvent',
        properties: {
          name: 'test',
          countingMethod: 'unique',
        },
      },
    });
    expect(window.gtag.mock.calls[0][2]).toEqual({
      allow_custom_scripts: true,
      send_to: 'DC-00000000/conv01/signu01+unique',
    });
  });

  it('should throw an error for invalid counting method for given tag', () => {
    dcmFloodlight = new DCMFloodlight(config, { loglevel: 'debug' });
    dcmFloodlight.init();
    window.gtag = jest.fn();
    try {
      dcmFloodlight.track({
        message: {
          type: 'track',
          event: 'testEvent',
          properties: {
            name: 'test',
            countingMethod: 'test',
          },
        },
      });
    } catch (error) {
      expect(error).toEqual('Counter Tag:: invalid counting method');
    }
  });

  it('should throw an error when counting method is missing from properties and config for given conversion event', () => {
    dcmFloodlight = new DCMFloodlight(config, { loglevel: 'debug' });
    dcmFloodlight.init();
    window.gtag = jest.fn();
    try {
      dcmFloodlight.track({
        message: {
          type: 'track',
          event: 'testEvent2',
          properties: {
            name: 'test',
          },
        },
      });
    } catch (error) {
      expect(error).toEqual('countingMethod is required for track call');
    }
  });
});
