/* eslint-disable sonarjs/no-duplicate-string */
import { getUserAgentClientHint } from '@rudderstack/analytics-js/components/capabilitiesManager/detection/clientHint';

describe('User Agent Client Hint Utilities', () => {
  const chromeDefaultUACH = {
    brands: [
      { brand: 'Chromium', version: '110' },
      { brand: 'Not A(Brand', version: '24' },
      { brand: 'Google Chrome', version: '110' },
    ],
    mobile: false,
    platform: 'macOS',
  };

  const chromeFullUACH = {
    architecture: 'x86',
    bitness: '64',
    brands: [
      {
        brand: 'Chromium',
        version: '110',
      },
      {
        brand: 'Not A(Brand',
        version: '24',
      },
      {
        brand: 'Google Chrome',
        version: '110',
      },
    ],
    fullVersionList: [
      {
        brand: 'Chromium',
        version: '110.0.5481.100',
      },
      {
        brand: 'Not A(Brand',
        version: '24.0.0.0',
      },
      {
        brand: 'Google Chrome',
        version: '110.0.5481.100',
      },
    ],
    mobile: false,
    model: '',
    platform: 'macOS',
    platformVersion: '13.2.1',
    uaFullVersion: '110.0.5481.100',
    wow64: false,
  };

  afterEach(() => {
    // Reset global.window.navigator mocks
    global.navigator.userAgentData = undefined;
  });

  it('Should return undefined when none is passed as the level', () => {
    const callback = jest.fn(userAgentClientHint => {
      expect(userAgentClientHint).toBe(undefined);
    });
    getUserAgentClientHint(callback, 'none');
  });
  it('Should return undefined if no argument is passed as the level', () => {
    const callback = jest.fn(userAgentClientHint => {
      expect(userAgentClientHint).toBe(undefined);
    });
    getUserAgentClientHint(callback);
  });
  it('Should return default client-hint object if default is passed as the level', () => {
    global.navigator.userAgentData = chromeDefaultUACH;
    const callback = jest.fn(userAgentClientHint => {
      expect(userAgentClientHint).toBe(chromeDefaultUACH);
    });
    getUserAgentClientHint(callback, 'default');
  });
  it('Should return default client-hint object if full is passed as the level', () => {
    navigator.userAgentData = {
      getHighEntropyValues: jest.fn().mockResolvedValue(chromeFullUACH),
    };
    const callback = jest.fn(userAgentClientHint => {
      expect(userAgentClientHint).toBe(chromeFullUACH);
    });
    getUserAgentClientHint(callback, 'full');
  });
});
