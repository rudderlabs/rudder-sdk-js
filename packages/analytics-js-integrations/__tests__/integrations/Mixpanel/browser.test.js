/* eslint-disable no-underscore-dangle */
import { Mixpanel } from '../../../src/integrations/Mixpanel';

beforeEach(() => {
  window.mixpanel = {};

  // Add a dummy script as it is required by the init script
  const scriptElement = document.createElement('script');
  scriptElement.type = 'text/javascript';
  scriptElement.id = 'dummyScript';
  const headElements = document.getElementsByTagName('head');
  headElements[0].insertBefore(scriptElement, headElements[0].firstChild);
});

afterEach(() => {
  // Reset DOM to original state
  document.getElementById('dummyScript')?.remove();
});

describe('Init tests', () => {
  beforeEach(() => {
    window.mixpanel = [];
  });
  let mixpanel;

  test('Persistence type is missing', () => {
    mixpanel = new Mixpanel({ persistence: 'none' }, { logLevel: 'debug' });
    mixpanel.init();
    expect(window.mixpanel._i[0][1]).toEqual({
      cross_subdomain_cookie: false,
      secure_cookie: false,
      persistence: 'cookie',
      loaded: expect.any(Function),
    });
  });

  test('Persistence type is cookie', () => {
    mixpanel = new Mixpanel(
      { persistenceType: 'cookie', persistenceName: '' },
      { logLevel: 'debug' },
    );
    mixpanel.init();
    expect(window.mixpanel._i[0][1]).toEqual({
      cross_subdomain_cookie: false,
      secure_cookie: false,
      persistence: 'cookie',
      loaded: expect.any(Function),
    });
  });

  test('Persistence type is localStorage and Persistence name is non empty', () => {
    mixpanel = new Mixpanel(
      { persistenceType: 'localStorage', persistenceName: 'abc' },
      { logLevel: 'debug' },
    );
    mixpanel.init();
    expect(window.mixpanel._i[0][1]).toEqual({
      cross_subdomain_cookie: false,
      secure_cookie: false,
      persistence: 'localStorage',
      persistence_name: 'abc',
      loaded: expect.any(Function),
    });
  });

  test('Persistence type is none', () => {
    mixpanel = new Mixpanel(
      { persistenceType: 'none', persistenceName: '' },
      { logLevel: 'debug' },
    );
    mixpanel.init();
    expect(window.mixpanel._i[0][1]).toEqual({
      cross_subdomain_cookie: false,
      secure_cookie: false,
      disable_persistence: true,
      loaded: expect.any(Function),
    });
  });
});

describe('isLoaded and isReady tests', () => {
  let mixpanel;

  const loadSDK = () => {
    setTimeout(() => {
      mixpanel.isNativeSDKLoaded = true; // Change to true after 5 seconds
    }, 5000); // 5 seconds
  };

  test('isLoaded test', () => {
    mixpanel = new Mixpanel({ persistence: 'none' }, { logLevel: 'debug' });

    loadSDK(); // Call loadSDK to set isNativeSDKLoaded after 5 seconds

    return new Promise(resolve => {
      const interval = setInterval(() => {
        if (mixpanel.isLoaded()) {
          clearInterval(interval);
          expect(mixpanel.isLoaded()).toBe(true);
          resolve(); // Resolve the promise once the expectation is met
        }
      }, 1000);
    });
  });

  test('isReady test', () => {
    mixpanel = new Mixpanel({ persistence: 'none' }, { logLevel: 'debug' });

    loadSDK(); // Call loadSDK to set isNativeSDKLoaded after 5 seconds

    return new Promise(resolve => {
      const interval = setInterval(() => {
        if (mixpanel.isReady()) {
          clearInterval(interval);
          expect(mixpanel.isReady()).toBe(true);
          resolve(); // Resolve the promise once the expectation is met
        }
      }, 1000);
    });
  });
});

describe('Page tests', () => {
  beforeEach(() => {
    window.mixpanel = [];
  });
  let mixpanel;
  test('should return a custom generated event name when useUserDefinedPageEventName setting is enabled and event template is provided', () => {
    mixpanel = new Mixpanel(
      {
        useUserDefinedPageEventName: true,
        userDefinedPageEventTemplate: 'Viewed {{ category }} {{ name }} page',
      },
      { logLevel: 'debug' },
    );
    mixpanel.init();
    window.mixpanel.track = jest.fn();
    mixpanel.page({
      message: {
        name: 'Doc',
        properties: { category: 'Integration' },
      },
    });
    expect(window.mixpanel.track.mock.calls[0][0]).toEqual('Viewed Integration Doc page');
  });

  test('should throw an error when useUserDefinedPageEventName setting is enabled and event template is not provided', () => {
    mixpanel = new Mixpanel(
      {
        useUserDefinedPageEventName: true,
      },
      { logLevel: 'debug' },
    );
    mixpanel.init();
    window.mixpanel.track = jest.fn();
    try {
      mixpanel.page({
        message: {
          name: 'Doc',
          properties: { category: 'Integration' },
        },
      });
    } catch (error) {
      expect(error).toEqual(
        'Event name template is not configured. Please provide a valid value for the `Page Event Name Template` in the destination dashboard.',
      );
    }
  });
});
