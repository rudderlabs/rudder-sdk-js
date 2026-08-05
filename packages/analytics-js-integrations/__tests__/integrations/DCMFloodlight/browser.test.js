import { errorMock } from '../../../__mocks__/logger';
import { DCMFloodlight } from '../../../src/integrations/DCMFloodlight';

const config = {
  advertiserId: '00000000',
  activityTag: 'signu00',
  groupTag: 'conv00',
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
      eventName: 'testEvent2',
      floodlightActivityTag: 'signu01',
      floodlightGroupTag: '',
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
      eventName: 'groupOverrideOnlyEvent',
      floodlightActivityTag: '',
      floodlightGroupTag: 'conv01',
      floodlightCountingMethod: 'standard',
      salesTag: false,
      customVariables: [],
    },
    {
      eventName: 'globalFallbackEvent',
      floodlightActivityTag: '',
      floodlightGroupTag: '',
      floodlightCountingMethod: 'standard',
      salesTag: false,
      customVariables: [],
    },
    {
      eventName: 'groupOverrideWithUniqueCountingEvent',
      floodlightActivityTag: '',
      floodlightGroupTag: 'conv01',
      floodlightCountingMethod: 'unique',
      salesTag: false,
      customVariables: [],
    },
    {
      eventName: 'missingCountingMethodEvent',
      floodlightActivityTag: 'signu03',
      floodlightGroupTag: 'conv03',
      salesTag: false,
      customVariables: [],
    },
    {
      eventName: 'Viewed doc home page',
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
    {
      eventName: 'Viewed home page',
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
    {
      eventName: 'Viewed doc page',
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
  errorMock.mockClear();
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

  it('should initialize without loglevel', () => {
    dcmFloodlight = new DCMFloodlight(config, {}, destinationInfo);
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

  const invalidTagCases = [
    {
      description: 'no tags configured anywhere',
      overrides: {
        activityTag: undefined,
        groupTag: undefined,
      },
      expectedError: 'groupTag is required for track call',
    },
    {
      description: 'only the group tag is missing',
      overrides: {
        activityTag: 'signu00',
        groupTag: undefined,
      },
      expectedError: 'groupTag is required for track call',
    },
    {
      description: 'only the activity tag is missing',
      overrides: {
        activityTag: undefined,
        groupTag: 'conv00',
      },
      expectedError: 'activityTag is required for track call',
    },
    {
      description: 'the destination-level group tag is whitespace-only',
      overrides: {
        activityTag: 'signu00',
        groupTag: '   ',
      },
      expectedError: 'groupTag is required for track call',
    },
  ];

  const getInvalidTagConfig = overrides => ({
    ...config,
    ...overrides,
    conversionEvents: [
      {
        eventName: 'tagValidationEvent',
        floodlightActivityTag: '',
        floodlightGroupTag: '',
        floodlightCountingMethod: 'standard',
        salesTag: false,
        customVariables: [],
      },
    ],
  });

  const tagValidationPayload = {
    message: {
      type: 'track',
      event: 'tagValidationEvent',
      properties: {
        name: 'test',
      },
    },
  };

  it('should use the fallback counting method from config for matching conversion event when counting method is missing from properties', () => {
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

  it('should not send an event when counting method is missing from properties and config for given conversion event', () => {
    dcmFloodlight = new DCMFloodlight(config, { loglevel: 'debug' });
    dcmFloodlight.init();
    window.gtag = jest.fn();
    dcmFloodlight.track({
      message: {
        type: 'track',
        event: 'missingCountingMethodEvent',
        properties: {
          name: 'test',
        },
      },
    });
    expect(window.gtag).not.toHaveBeenCalled();
  });

  it('should fall back to the global group tag when the conversion event group tag is missing', () => {
    dcmFloodlight = new DCMFloodlight(config, { loglevel: 'debug' });
    dcmFloodlight.init();
    window.gtag = jest.fn();
    dcmFloodlight.track({
      message: {
        type: 'track',
        event: 'testEvent2',
        properties: {
          name: 'test',
        },
      },
    });
    expect(window.gtag.mock.calls[0][2]).toEqual({
      allow_custom_scripts: true,
      send_to: 'DC-00000000/conv00/signu01+standard',
    });
  });

  it('should fall back to the global activity tag when the conversion event activity tag is missing', () => {
    dcmFloodlight = new DCMFloodlight(config, { loglevel: 'debug' });
    dcmFloodlight.init();
    window.gtag = jest.fn();
    dcmFloodlight.track({
      message: {
        type: 'track',
        event: 'groupOverrideOnlyEvent',
        properties: {
          name: 'test',
        },
      },
    });
    expect(window.gtag.mock.calls[0][2]).toEqual({
      allow_custom_scripts: true,
      send_to: 'DC-00000000/conv01/signu00+standard',
    });
  });

  it('should use global tags when the conversion event tags are missing', () => {
    dcmFloodlight = new DCMFloodlight(config, { loglevel: 'debug' });
    dcmFloodlight.init();
    window.gtag = jest.fn();
    dcmFloodlight.track({
      message: {
        type: 'track',
        event: 'globalFallbackEvent',
        properties: {
          name: 'test',
        },
      },
    });
    expect(window.gtag.mock.calls[0][2]).toEqual({
      allow_custom_scripts: true,
      send_to: 'DC-00000000/conv00/signu00+standard',
    });
  });

  it('should not leak overridden conversion event tags to subsequent events', () => {
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
    dcmFloodlight.track({
      message: {
        type: 'track',
        event: 'globalFallbackEvent',
        properties: {
          name: 'test',
        },
      },
    });
    expect(window.gtag.mock.calls[0][2].send_to).toBe('DC-00000000/conv01/signu01+standard');
    expect(window.gtag.mock.calls[1][2].send_to).toBe('DC-00000000/conv00/signu00+standard');
  });

  it('should use the conversion event counting method when only one conversion event tag is configured', () => {
    dcmFloodlight = new DCMFloodlight(config, { loglevel: 'debug' });
    dcmFloodlight.init();
    window.gtag = jest.fn();
    dcmFloodlight.track({
      message: {
        type: 'track',
        event: 'groupOverrideWithUniqueCountingEvent',
        properties: {
          name: 'test',
        },
      },
    });
    expect(window.gtag.mock.calls[0][2]).toEqual({
      allow_custom_scripts: true,
      send_to: 'DC-00000000/conv01/signu00+unique',
    });
  });

  it.each(invalidTagCases)(
    'should not send a gtag event when $description',
    ({ overrides, expectedError }) => {
      dcmFloodlight = new DCMFloodlight(getInvalidTagConfig(overrides), {
        loglevel: 'debug',
      });
      dcmFloodlight.init();
      window.gtag = jest.fn();
      dcmFloodlight.track(tagValidationPayload);

      expect(errorMock).toHaveBeenCalledWith(expectedError);
      expect(window.gtag).not.toHaveBeenCalled();
    },
  );

  it.each(invalidTagCases)(
    'should not append an iframe when $description',
    ({ overrides, expectedError }) => {
      dcmFloodlight = new DCMFloodlight(
        getInvalidTagConfig({
          ...overrides,
          tagFormat: 'iframeTag',
        }),
        {
          loglevel: 'debug',
        },
      );
      dcmFloodlight.init();
      const initialIframeCount = document.getElementsByTagName('iframe').length;
      dcmFloodlight.track(tagValidationPayload);

      expect(errorMock).toHaveBeenCalledWith(expectedError);
      expect(document.getElementsByTagName('iframe').length).toBe(initialIframeCount);
    },
  );

  it('should use independent tag fallbacks for iframe tags', () => {
    dcmFloodlight = new DCMFloodlight({ ...config, tagFormat: 'iframeTag' }, { loglevel: 'debug' });
    dcmFloodlight.init();
    dcmFloodlight.track({
      message: {
        type: 'track',
        event: 'groupOverrideOnlyEvent',
        properties: {
          name: 'test',
        },
      },
    });
    const iframes = document.getElementsByTagName('iframe');
    expect(iframes[iframes.length - 1].src).toContain(';type=conv01;cat=signu00;');
  });
});

describe('page', () => {
  beforeEach(() => {
    window.gtag = [];
  });
  let dcmFloodlight;

  it('should return the event payload for given page call', () => {
    dcmFloodlight = new DCMFloodlight(config, { loglevel: 'debug' });
    dcmFloodlight.init();
    window.gtag = jest.fn();
    dcmFloodlight.page({
      message: {
        type: 'page',
        properties: {
          name: 'home',
          category: 'doc',
        },
      },
    });
    expect(window.gtag.mock.calls[0][2]).toEqual({
      allow_custom_scripts: true,
      send_to: 'DC-00000000/conv02/signu01+unique',
    });
  });

  it('should return the event payload when name is present in category is missing from properties', () => {
    dcmFloodlight = new DCMFloodlight(config, { loglevel: 'debug' });
    dcmFloodlight.init();
    window.gtag = jest.fn();
    dcmFloodlight.page({
      message: {
        type: 'page',
        properties: {
          name: 'home',
        },
      },
    });
    expect(window.gtag.mock.calls[0][2]).toEqual({
      allow_custom_scripts: true,
      send_to: 'DC-00000000/conv02/signu01+unique',
    });
  });

  it('should return the event payload when category is present in name is missing from properties', () => {
    dcmFloodlight = new DCMFloodlight(config, { loglevel: 'debug' });
    dcmFloodlight.init();
    window.gtag = jest.fn();
    dcmFloodlight.page({
      message: {
        type: 'page',
        properties: {
          category: 'doc',
        },
      },
    });
    expect(window.gtag.mock.calls[0][2]).toEqual({
      allow_custom_scripts: true,
      send_to: 'DC-00000000/conv02/signu01+unique',
    });
  });

  it('should use the name from root level', () => {
    dcmFloodlight = new DCMFloodlight(config, { loglevel: 'debug' });
    dcmFloodlight.init();
    window.gtag = jest.fn();
    dcmFloodlight.page({
      message: {
        type: 'page',
        name: 'home',
        properties: {
          category: 'doc',
        },
      },
    });
    expect(window.gtag.mock.calls[0][2]).toEqual({
      allow_custom_scripts: true,
      send_to: 'DC-00000000/conv02/signu01+unique',
    });
  });

  it('should throw an error for missing page event name in config', () => {
    dcmFloodlight = new DCMFloodlight(config, { loglevel: 'debug' });
    dcmFloodlight.init();
    window.gtag = jest.fn();
    try {
      dcmFloodlight.page({
        message: {
          type: 'page',
          properties: {
            name: 'doc',
          },
        },
      });
    } catch (error) {
      expect(error).toEqual('Conversion event not found');
    }
  });

  it('should throw an error for missing category and name', () => {
    dcmFloodlight = new DCMFloodlight(config, { loglevel: 'debug' });
    dcmFloodlight.init();
    window.gtag = jest.fn();
    try {
      dcmFloodlight.track({
        message: {
          type: 'page',
        },
      });
    } catch (error) {
      expect(error).toEqual('category or name is required for page');
    }
  });
});
