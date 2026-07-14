import * as R from 'ramda';
import { Storage } from '@rudderstack/analytics-js-legacy-utilities/storage';
import { warnMock } from '../../../__mocks__/logger';
import Braze from '../../../src/integrations/Braze/browser';

jest.mock('@rudderstack/analytics-js-legacy-utilities/storage', () => ({
  Storage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

const mockBrazeSDK = () => {
  window.braze = {
    initialize: jest.fn(),
    automaticallyShowInAppMessages: jest.fn(),
    changeUser: jest.fn(value => {
      if (R.isNil(value) || R.isEmpty(value)) {
        throw new Error('Braze SDK Error: changeUser requires a non-empty userId. (v4.2.1)');
      }
    }),
    addAlias: jest.fn(),
    addSdkMetadata: jest.fn(),
    openSession: jest.fn(),
    getUser: jest.fn().mockReturnThis(),
    setCountry: jest.fn(),
    setHomeCity: jest.fn(),
    setDateOfBirth: jest.fn(),
    setEmail: jest.fn(),
    setFirstName: jest.fn(),
    setGender: jest.fn(),
    setLastName: jest.fn(),
    setPhoneNumber: jest.fn(),
    setCustomUserAttribute: jest.fn(),
    logCustomEvent: jest.fn(),
    logPurchase: jest.fn(),
    getCachedContentCards: jest.fn(),
    getCachedFeed: jest.fn(),
    requestImmediateDataFlush: jest.fn(),
    BrazeSdkMetadata: {
      CDN: 'wcd',
      GOOGLE_TAG_MANAGER: 'gg',
      MANUAL: 'manu',
      MPARTICLE: 'mp',
      NPM: 'npm',
      SEGMENT: 'sg',
      SHOPIFY: 'shp',
      TEALIUM: 'tl',
    },
    User: {
      Genders: {
        OTHER: 'o',
        MALE: 'm',
        FEMALE: 'f',
      },
    },
  };
  // Mock brazeQueue as null to simulate loaded state by default
  window.brazeQueue = null;
};

beforeEach(() => {
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

afterAll(() => {
  jest.restoreAllMocks();
});

describe('constructor', () => {
  it('should set the log level if provided', () => {
    const config = { appKey: 'APP_KEY', logLevel: 'debug' };
    const analytics = {
      logLevel: '0',
    };
    const destinationInfo = {};
    const braze = new Braze(config, analytics, destinationInfo);
    expect(braze.trackAnonymousUser).toEqual(undefined);
    expect(braze.enableBrazeLogging).toEqual(false);
    expect(braze.allowUserSuppliedJavascript).toEqual(false);
    expect(braze.appIdentifierKey).toEqual('APP_KEY');
  });
  it('should set the log level if provided', () => {
    const config = { logLevel: 'debug', dataCenter: 'eu' };
    const analytics = {
      logLevel: '0',
    };
    const destinationInfo = {};
    const braze = new Braze(config, analytics, destinationInfo);
    expect(braze.trackAnonymousUser).toEqual(undefined);
    expect(braze.enableBrazeLogging).toEqual(false);
    expect(braze.allowUserSuppliedJavascript).toEqual(false);
    expect(braze.appIdentifierKey).toEqual('');
  });
  // Add more tests for the constructor if needed

  describe('dataCenter configuration', () => {
    it('should set EU endpoint correctly', () => {
      const config = {
        appKey: 'APP_KEY',
        dataCenter: 'EU-01',
      };
      const analytics = {};
      const destinationInfo = {};

      const braze = new Braze(config, analytics, destinationInfo);
      expect(braze.endPoint).toBe('sdk.fra-01.braze.eu');
    });

    it('should set US endpoint correctly', () => {
      const config = {
        appKey: 'APP_KEY',
        dataCenter: 'US-02',
      };
      const analytics = {};
      const destinationInfo = {};

      const braze = new Braze(config, analytics, destinationInfo);
      expect(braze.endPoint).toBe('sdk.iad-02.braze.com');
    });

    it('should set AU endpoint correctly', () => {
      const config = {
        appKey: 'APP_KEY',
        dataCenter: 'AU-01',
      };
      const analytics = {};
      const destinationInfo = {};

      const braze = new Braze(config, analytics, destinationInfo);
      expect(braze.endPoint).toBe('sdk.au-01.braze.com');
    });

    it('should default to US endpoint for unknown regions', () => {
      const config = {
        appKey: 'APP_KEY',
        dataCenter: 'UNKNOWN-01',
      };
      const analytics = {};
      const destinationInfo = {};

      const braze = new Braze(config, analytics, destinationInfo);
      expect(braze.endPoint).toBe('sdk.iad-01.braze.com');
    });

    it('should handle lowercase datacenter values', () => {
      const config = {
        appKey: 'APP_KEY',
        dataCenter: 'eu-01',
      };
      const analytics = {};
      const destinationInfo = {};

      const braze = new Braze(config, analytics, destinationInfo);
      expect(braze.endPoint).toBe('sdk.fra-01.braze.eu');
    });

    it('should handle whitespace in datacenter values', () => {
      const config = {
        appKey: 'APP_KEY',
        dataCenter: ' EU-01 ',
      };
      const analytics = {};
      const destinationInfo = {};

      const braze = new Braze(config, analytics, destinationInfo);
      expect(braze.endPoint).toBe('sdk.fra-01.braze.eu');
    });
  });

  it('should use web app key when platform specific app keys are enabled', () => {
    const config = {
      appKey: 'APP_KEY',
      webApiKey: 'WEB_KEY',
      usePlatformSpecificApiKeys: true,
    };
    const analytics = {};
    const destinationInfo = {};

    const braze = new Braze(config, analytics, destinationInfo);

    expect(braze.usePlatformSpecificApiKeys).toBe(true);
    expect(warnMock).not.toHaveBeenCalled();
    expect(braze.appIdentifierKey).toBe('WEB_KEY');
  });

  it('should log warn and fallback to configured app key when web app key is invalid', () => {
    const config = {
      appKey: 'APP_KEY',
      webApiKey: 12345,
      usePlatformSpecificApiKeys: true,
    };
    const analytics = {};
    const destinationInfo = {};

    const braze = new Braze(config, analytics, destinationInfo);

    expect(warnMock).toHaveBeenCalledWith(
      'Configured to use platform-specific app identifier key but the web app identifier key (12345) is not valid. Using the default app identifier key instead.',
    );
    expect(braze.appIdentifierKey).toBe('APP_KEY');
  });
});

describe('init', () => {
  it('should initialize Braze', () => {
    const config = {
      appKey: 'APP_KEY',
      trackAnonymousUser: true,
      enableBrazeLogging: false,
      dataCenter: 'US-03',
      allowUserSuppliedJavascript: false,
      enablePushNotification: true,
    };
    const analytics = {
      userId: '1234',
    };
    const destinationInfo = {};

    const braze = new Braze(config, analytics, destinationInfo);
    braze.init();
    const apiKeyObj = window.brazeQueue.find(obj => obj[0] === 'APP_KEY');

    expect(apiKeyObj[0]).toEqual('APP_KEY');
    expect(apiKeyObj[1]).toEqual({
      enableLogging: false,
      baseUrl: 'sdk.iad-03.braze.com',
      allowUserSuppliedJavascript: false,
    });
  });

  // Add more tests for the init method if needed
});

describe('isLoaded', () => {
  it('should get false value with isLoaded', () => {
    const config = {};
    const analytics = {};
    const destinationInfo = {};

    const braze = new Braze(config, analytics, destinationInfo);
    const isLoaded = braze.isLoaded();
    expect(isLoaded).toBe(false);
  });
});

describe('setUserAlias', () => {
  let braze;
  let config;
  let analytics;

  beforeEach(() => {
    config = {
      appKey: 'APP_KEY',
    };
    analytics = {
      getAnonymousId: jest.fn(),
    };
    braze = new Braze(config, analytics, {});
    braze.init();
    mockBrazeSDK();
  });

  it('should successfully set user alias', () => {
    analytics.getAnonymousId.mockReturnValue('anon123');
    window.braze.getUser().addAlias.mockReturnValue(true);

    const result = braze.setUserAlias();
    expect(result).toBe(true);
    expect(window.braze.getUser().addAlias).toHaveBeenCalledWith('anon123', 'rudder_id');
  });

  it('should fail when anonymous ID is missing', () => {
    analytics.getAnonymousId.mockReturnValue(null);

    const result = braze.setUserAlias();
    expect(result).toBe(false);
  });

  it('should fail when user object is not available', () => {
    analytics.getAnonymousId.mockReturnValue('anon123');
    window.braze.getUser = jest.fn().mockReturnValue(null);

    const result = braze.setUserAlias();
    expect(result).toBe(false);
  });

  it('should fail when addAlias returns false', () => {
    analytics.getAnonymousId.mockReturnValue('anon123');
    window.braze.getUser().addAlias.mockReturnValue(false);

    const result = braze.setUserAlias();
    expect(result).toBe(false);
  });

  it('should handle errors gracefully', () => {
    analytics.getAnonymousId.mockImplementation(() => {
      throw new Error('Test error');
    });

    const result = braze.setUserAlias();
    expect(result).toBe(false);
  });

  it('should handle missing requestImmediateDataFlush method gracefully', () => {
    analytics.getAnonymousId.mockReturnValue('anon123');
    window.braze.getUser().addAlias.mockReturnValue(true);
    // Remove the flush method to test defensive behavior
    delete window.braze.requestImmediateDataFlush;

    const result = braze.setUserAlias();
    expect(result).toBe(true);
    expect(window.braze.getUser().addAlias).toHaveBeenCalledWith('anon123', 'rudder_id');
  });
});

describe('isReady', () => {
  let braze;
  let config;
  let analytics;

  beforeEach(() => {
    config = { appKey: 'APP_KEY' };
    analytics = { getAnonymousId: jest.fn() };
    braze = new Braze(config, analytics, {});
  });

  it('should return false when not loaded', () => {
    jest.spyOn(braze, 'isLoaded').mockReturnValue(false);

    const result = braze.isReady();
    expect(result).toBe(false);
    expect(braze.isLoaded).toHaveBeenCalled();
  });

  it('should return true when loaded and alias set successfully', () => {
    mockBrazeSDK();
    jest.spyOn(braze, 'isLoaded').mockReturnValue(true);
    jest.spyOn(braze, 'setUserAlias').mockReturnValue(true);
    jest.spyOn(braze, 'addSdkMetadata');

    const result = braze.isReady();
    expect(result).toBe(true);
    expect(braze.addSdkMetadata).toHaveBeenCalledTimes(1);
    expect(braze.sdkMetadataAdded).toBe(true);
  });

  it('should return false when loaded but alias setting fails', () => {
    mockBrazeSDK();
    jest.spyOn(braze, 'isLoaded').mockReturnValue(true);
    jest.spyOn(braze, 'setUserAlias').mockReturnValue(false);
    jest.spyOn(braze, 'addSdkMetadata');

    const result = braze.isReady();
    expect(result).toBe(false);
    expect(braze.addSdkMetadata).toHaveBeenCalledTimes(1);
    expect(braze.sdkMetadataAdded).toBe(true);
  });

  it('should only add SDK metadata once even when called multiple times', () => {
    mockBrazeSDK();
    jest.spyOn(braze, 'isLoaded').mockReturnValue(true);
    jest.spyOn(braze, 'setUserAlias').mockReturnValue(true);
    jest.spyOn(braze, 'addSdkMetadata');

    // Call isReady multiple times
    braze.isReady();
    braze.isReady();
    braze.isReady();

    // SDK metadata should only be added once
    expect(braze.addSdkMetadata).toHaveBeenCalledTimes(1);
    expect(braze.sdkMetadataAdded).toBe(true);
  });
});

describe('addSdkMetadata', () => {
  let braze;
  let config;
  let analytics;

  beforeEach(() => {
    config = { appKey: 'APP_KEY' };
    analytics = { getAnonymousId: jest.fn() };
    braze = new Braze(config, analytics, {});
    mockBrazeSDK();
  });

  it('should call window.braze.addSdkMetadata with CDN metadata', () => {
    braze.addSdkMetadata();

    expect(window.braze.addSdkMetadata).toHaveBeenCalledWith([window.braze.BrazeSdkMetadata.CDN]);
    expect(braze.sdkMetadataAdded).toBe(true);
  });

  it('should handle errors gracefully when addSdkMetadata fails', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    window.braze.addSdkMetadata.mockImplementation(() => {
      throw new Error('SDK metadata error');
    });

    // Should not throw an error
    expect(() => braze.addSdkMetadata()).not.toThrow();

    // Flag should not be set when there's an error
    expect(braze.sdkMetadataAdded).toBe(false);

    consoleSpy.mockRestore();
  });

  it('should log debug message on successful metadata addition', () => {
    const consoleSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});

    braze.addSdkMetadata();

    expect(window.braze.addSdkMetadata).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

describe('identify', () => {
  it('should call the necessary Braze methods to set user attributes', () => {
    const config = {
      appKey: 'APP_KEY',
      trackAnonymousUser: true,
      enableBrazeLogging: false,
      dataCenter: 'US-03',
      allowUserSuppliedJavascript: false,
    };
    const analytics = {};
    const destinationInfo = {};

    const braze = new Braze(config, analytics, destinationInfo);
    braze.init();
    // mock the window.braze
    mockBrazeSDK();

    // Create a mock rudderElement with necessary properties
    const rudderElement = {
      message: {
        userId: 'user123',
        context: {
          traits: {
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            gender: 1,
            phone: '1234567890',
            address: {
              country: 'USA',
              city: 'New York',
            },
            birthday: '1990-01-01',
          },
        },
      },
    };

    jest.spyOn(window.braze, 'changeUser');
    jest.spyOn(window.braze.getUser(), 'setEmail');
    jest.spyOn(window.braze.getUser(), 'setFirstName');
    jest.spyOn(window.braze.getUser(), 'setLastName');
    jest.spyOn(window.braze.getUser(), 'setGender');
    jest.spyOn(window.braze.getUser(), 'setPhoneNumber');
    jest.spyOn(window.braze.getUser(), 'setCountry');
    jest.spyOn(window.braze.getUser(), 'setHomeCity');
    jest.spyOn(window.braze.getUser(), 'setDateOfBirth');

    // Call the identify method
    braze.identify(rudderElement);

    // Expect the necessary Braze methods to be called with the correct values
    expect(window.braze.changeUser).toHaveBeenCalledWith('user123');
    expect(window.braze.getUser().setEmail).toHaveBeenCalledWith('test@example.com');
    expect(window.braze.getUser().setFirstName).toHaveBeenCalledWith('John');
    expect(window.braze.getUser().setLastName).toHaveBeenCalledWith('Doe');
    expect(window.braze.getUser().setGender).toHaveBeenCalledWith(undefined);
    expect(window.braze.getUser().setPhoneNumber).toHaveBeenCalledWith('1234567890');
    expect(window.braze.getUser().setCountry).toHaveBeenCalledWith('USA');
    expect(window.braze.getUser().setHomeCity).toHaveBeenCalledWith('New York');
    expect(window.braze.getUser().setDateOfBirth).toHaveBeenCalledWith(1990, 1, 1);
    // Expect any other necessary Braze methods to be called
  });

  it('should handle supportDedup and update user attributes when traits have changed', () => {
    jest.clearAllMocks();
    const config = {
      appKey: 'APP_KEY',
      trackAnonymousUser: true,
      enableBrazeLogging: false,
      supportDedup: true,
      dataCenter: 'US-03',
      allowUserSuppliedJavascript: false,
    };
    const analytics = {};
    const destinationInfo = {};

    const braze = new Braze(config, analytics, destinationInfo);
    braze.init();
    // mock the window.braze
    mockBrazeSDK();

    // Create a mock rudderElement with necessary properties
    const rudderElement = {
      message: {
        userId: 'user123',
        context: {
          traits: {
            customTrait: 'random data',
            email: 'updated@example.com',
            firstName: 'David',
            lastName: 'Doe',
            gender: 'female',
            phone: '1234567890',
            address: {
              country: 'USA',
              city: 'Austin',
            },
            birthday: '1990-01-01',
          },
        },
      },
    };

    // Mock previous payload in Storage
    Storage.getItem.mockReturnValueOnce({
      userId: 'user123',
      context: {
        traits: {
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          gender: 'male',
          phone: '1234567890',
          address: {
            country: 'USA',
            city: 'New York',
          },
          birthday: '1990-01-01',
        },
      },
    });

    jest.spyOn(window.braze, 'changeUser');
    jest.spyOn(window.braze.getUser(), 'setEmail');
    jest.spyOn(window.braze.getUser(), 'setFirstName');
    jest.spyOn(window.braze.getUser(), 'setLastName');
    jest.spyOn(window.braze.getUser(), 'setGender');
    jest.spyOn(window.braze.getUser(), 'setPhoneNumber');
    jest.spyOn(window.braze.getUser(), 'setCountry');
    jest.spyOn(window.braze.getUser(), 'setHomeCity');
    jest.spyOn(window.braze.getUser(), 'setDateOfBirth');
    jest.spyOn(window.braze.getUser(), 'setCustomUserAttribute');

    // Call the identify method
    braze.identify(rudderElement);

    // Expect the necessary Braze methods to be called with the updated values
    expect(window.braze.getUser().setEmail).toHaveBeenCalledWith('updated@example.com');
    expect(window.braze.getUser().setFirstName).toHaveBeenCalledWith('David');
    expect(window.braze.getUser().setGender).toHaveBeenCalledWith('f');
    expect(window.braze.getUser().setPhoneNumber).not.toHaveBeenCalled();
    expect(window.braze.getUser().setCountry).toHaveBeenCalledWith('USA');
    expect(window.braze.getUser().setHomeCity).toHaveBeenCalledWith('Austin');
    expect(window.braze.getUser().setDateOfBirth).not.toHaveBeenCalled();
    expect(window.braze.getUser().setCustomUserAttribute).toHaveBeenCalledWith(
      'customTrait',
      'random data',
    );
    // Expect any other necessary Braze methods to be called

    // Expect Storage.setItem to be called with the updated payload
    expect(Storage.setItem).toHaveBeenCalledWith('rs_braze_dedup_attributes', {
      userId: 'user123',
      context: {
        traits: {
          email: 'updated@example.com',
          firstName: 'David',
          lastName: 'Doe',
          gender: 'female',
          phone: '1234567890',
          address: {
            country: 'USA',
            city: 'Austin',
          },
          birthday: '1990-01-01',
          customTrait: 'random data',
        },
      },
    });
  });

  it('should not update user attributes if supportDedup is disabled', () => {
    jest.clearAllMocks();
    const config = {
      appKey: 'APP_KEY',
      trackAnonymousUser: true,
      enableBrazeLogging: false,
      supportDedup: false, // Disable supportDedup by setting the value in the configuration
      dataCenter: 'US-03',
      allowUserSuppliedJavascript: false,
    };
    const analytics = {};
    const destinationInfo = {};

    const braze = new Braze(config, analytics, destinationInfo);
    braze.init();
    // mock the window.braze
    mockBrazeSDK();

    // Create a mock rudderElement with necessary properties
    const rudderElement = {
      message: {
        userId: 'user123',
        context: {
          traits: {
            email: 'new@example.com',
            firstName: 'John',
            lastName: 'Doe',
          },
        },
      },
    };

    // Call the identify method
    braze.identify(rudderElement);

    // Expect the necessary Braze methods to be called with the initial values
    expect(window.braze.changeUser).toHaveBeenCalledWith('user123');
    expect(window.braze.getUser().setEmail).toHaveBeenCalledWith('new@example.com');
    expect(window.braze.getUser().setFirstName).toHaveBeenCalledWith('John');
    expect(window.braze.getUser().setLastName).toHaveBeenCalledWith('Doe');
    // Expect any other necessary Braze methods to be called

    // Expect Storage.setItem to be called with the updated payload
    expect(Storage.setItem).not.toHaveBeenCalled();
  });

  it('should handle braze sdk error for empty userId', () => {
    jest.clearAllMocks();
    const config = {
      appKey: 'APP_KEY',
      trackAnonymousUser: true,
      enableBrazeLogging: false,
      supportDedup: true, // Disable supportDedup by setting the value in the configuration
      dataCenter: 'US-03',
      allowUserSuppliedJavascript: false,
    };
    const analytics = {};
    const destinationInfo = {};

    const braze = new Braze(config, analytics, destinationInfo);
    braze.init();

    // mock the window.braze
    mockBrazeSDK();

    // Create a mock rudderElement without userId
    const rudderElement = {
      message: {
        context: {
          traits: {
            email: 'new@example.com',
            firstName: 'John',
            lastName: 'Doe',
          },
        },
      },
    };

    // Call the identify method and mimic the try catch of core sdk
    try {
      braze.identify(rudderElement);
    } catch (e) {
      expect(e.message).toEqual(
        'Braze SDK Error: changeUser requires a non-empty userId. (v4.2.1)',
      );
    }
    // Expect Storage.setItem not been called with the updated payload
    expect(Storage.setItem).not.toHaveBeenCalled();
  });

  it('should handle braze sdk error for empty context', () => {
    jest.clearAllMocks();
    const config = {
      appKey: 'APP_KEY',
      trackAnonymousUser: true,
      enableBrazeLogging: false,
      supportDedup: false, // Disable supportDedup by setting the value in the configuration
      dataCenter: 'US-03',
      allowUserSuppliedJavascript: false,
    };
    const analytics = {};
    const destinationInfo = {};

    const braze = new Braze(config, analytics, destinationInfo);
    braze.init();

    // mock the window.braze
    mockBrazeSDK();

    // Create a mock rudderElement without context
    const rudderElement = {
      message: {
        userId: 'user123',
      },
    };

    // Call the identify method and mimic the try catch of core sdk
    braze.identify(rudderElement);

    // Expect the necessary Braze methods to be called with the initial values
    expect(window.braze.changeUser).toHaveBeenCalledWith('user123');
    expect(window.braze.getUser().setEmail).not.toHaveBeenCalled();
    expect(window.braze.getUser().setFirstName).not.toHaveBeenCalled();
    expect(window.braze.getUser().setLastName).not.toHaveBeenCalled();
    expect(window.braze.getUser().setGender).not.toHaveBeenCalled();
    expect(window.braze.getUser().setPhoneNumber).not.toHaveBeenCalled();
    expect(window.braze.getUser().setCountry).not.toHaveBeenCalled();
    expect(window.braze.getUser().setHomeCity).not.toHaveBeenCalled();
    expect(window.braze.getUser().setDateOfBirth).not.toHaveBeenCalled();

    // Expect any other necessary Braze methods to be called

    // Expect Storage.setItem not been called with the updated payload
    expect(Storage.setItem).not.toHaveBeenCalled();
  });

  it('should handle invalid birthday', () => {
    jest.clearAllMocks();
    const config = {
      appKey: 'APP_KEY',
      trackAnonymousUser: true,
      enableBrazeLogging: false,
      supportDedup: false, // Disable supportDedup by setting the value in the configuration
      dataCenter: 'US-03',
      allowUserSuppliedJavascript: false,
    };
    const analytics = {};
    const destinationInfo = {};

    const braze = new Braze(config, analytics, destinationInfo);
    braze.init();

    // mock the window.braze
    mockBrazeSDK();

    // Create a mock rudderElement without userId
    const rudderElement = {
      message: {
        userId: 'user123',
        context: {
          traits: {
            email: 'new@example.com',
            firstName: 'John',
            lastName: 'Doe',
            birthday: 'invalid date',
          },
        },
      },
    };

    // Call the identify method and mimic the try catch of core sdk
    braze.identify(rudderElement);

    // Expect the necessary Braze methods to be called with the initial values
    expect(window.braze.changeUser).toHaveBeenCalledWith('user123');
    expect(window.braze.getUser().setEmail).toHaveBeenCalledWith('new@example.com');
    expect(window.braze.getUser().setFirstName).toHaveBeenCalledWith('John');
    expect(window.braze.getUser().setLastName).toHaveBeenCalledWith('Doe');
    expect(window.braze.getUser().setGender).not.toHaveBeenCalled();
    expect(window.braze.getUser().setPhoneNumber).not.toHaveBeenCalled();
    expect(window.braze.getUser().setCountry).not.toHaveBeenCalled();
    expect(window.braze.getUser().setHomeCity).not.toHaveBeenCalled();
    expect(window.braze.getUser().setDateOfBirth).not.toHaveBeenCalled();

    // Expect any other necessary Braze methods to be called

    // Expect Storage.setItem not been called with the updated payload
    expect(Storage.setItem).not.toHaveBeenCalled();
  });
});

describe('track', () => {
  it('should call the necessary Braze methods to set user properties', () => {
    const config = {
      appKey: 'APP_KEY',
      trackAnonymousUser: true,
      enableBrazeLogging: false,
      dataCenter: 'US-03',
      allowUserSuppliedJavascript: false,
    };
    const analytics = {};
    const destinationInfo = {};

    const braze = new Braze(config, analytics, destinationInfo);
    braze.init();
    // mock the window.braze
    mockBrazeSDK();

    // Create a mock rudderElement with necessary properties
    const rudderElement = {
      message: {
        userId: 'user123',
        context: {
          traits: {
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            gender: 'male',
            phone: '1234567890',
            address: {
              country: 'USA',
              city: 'New York',
            },
            birthday: '1990-01-01',
          },
        },
        event: 'Product Reviewed',
        properties: {
          review_id: '12345',
          product_id: '123',
          rating: 3.0,
          review_body: 'Good product.',
        },
      },
    };

    braze.track(rudderElement);

    // Expect the necessary Braze methods to be called with the correct values
    expect(window.braze.logCustomEvent).toHaveBeenCalledTimes(1);
    expect(window.braze.logCustomEvent).toHaveBeenCalledWith('Product Reviewed', {
      rating: 3,
      review_body: 'Good product.',
      review_id: '12345',
    });
  });

  it('should call the necessary Braze methods for order completed event', () => {
    const config = {
      appKey: 'APP_KEY',
      trackAnonymousUser: true,
      enableBrazeLogging: false,
      dataCenter: 'US-03',
      allowUserSuppliedJavascript: false,
    };
    const analytics = {};
    const destinationInfo = {};

    const braze = new Braze(config, analytics, destinationInfo);
    braze.init();
    // mock the window.braze
    mockBrazeSDK();

    // Create a mock rudderElement with necessary properties
    const rudderElement = {
      message: {
        userId: 'user123',
        context: {
          traits: {
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            gender: 'male',
            phone: '1234567890',
            address: {
              country: 'USA',
              city: 'New York',
            },
            birthday: '1990-01-01',
          },
        },
        event: 'order completed',
        properties: {
          currency: 'USD',
          products: [
            {
              product_id: '123454387',
              name: 'Game',
              price: 15.99,
              quantity: 1,
            },
          ],
        },
      },
    };

    braze.track(rudderElement);

    // Expect the necessary Braze methods to be called with the correct values
    expect(window.braze.logPurchase).toHaveBeenCalledTimes(1);
    expect(window.braze.logPurchase).toHaveBeenCalledWith('123454387', 15.99, 'USD', 1, {});
  });

  it('should call the necessary Braze methods for order completed event with extra properties', () => {
    const config = {
      appKey: 'APP_KEY',
      trackAnonymousUser: true,
      enableBrazeLogging: false,
      dataCenter: 'US-03',
      allowUserSuppliedJavascript: false,
    };
    const analytics = {};
    const destinationInfo = {};

    const braze = new Braze(config, analytics, destinationInfo);
    braze.init();
    // mock the window.braze
    mockBrazeSDK();

    // Create a mock rudderElement with necessary properties
    const rudderElement = {
      message: {
        userId: 'user123',
        context: {
          traits: {
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            gender: 'male',
            phone: '1234567890',
            address: {
              country: 'USA',
              city: 'New York',
            },
            birthday: '1990-01-01',
          },
        },
        event: 'order completed',
        properties: {
          currency: 'USD',
          products: [
            {
              product_id: '123454387',
              name: 'Game',
              price: 15.99,
              quantity: 1,
            },
          ],
          rating: 5,
        },
      },
    };

    braze.track(rudderElement);

    // Expect the necessary Braze methods to be called with the correct values
    expect(window.braze.logPurchase).toHaveBeenCalledTimes(1);
    expect(window.braze.logPurchase).toHaveBeenCalledWith('123454387', 15.99, 'USD', 1, {
      rating: 5,
    });
  });

  it('should call the necessary Braze methods for anonymous user', () => {
    const config = {
      appKey: 'APP_KEY',
      trackAnonymousUser: true,
      enableBrazeLogging: false,
      dataCenter: 'US-03',
      allowUserSuppliedJavascript: false,
    };
    const analytics = {};
    const destinationInfo = {};

    const braze = new Braze(config, analytics, destinationInfo);
    braze.init();
    // mock the window.braze
    mockBrazeSDK();

    // Create a mock rudderElement with necessary properties
    const rudderElement = {
      message: {
        anonymousId: 'anon123',
        context: {
          traits: {
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            gender: 'male',
            phone: '1234567890',
            address: {
              country: 'USA',
              city: 'New York',
            },
            birthday: '1990-01-01',
          },
        },
        event: 'Product Reviewed',
        properties: {
          review_id: '12345',
          product_id: '123',
          rating: 3.0,
          review_body: 'Good product.',
        },
      },
    };

    braze.track(rudderElement);

    // Expect the necessary Braze methods to be called with the correct values
    expect(window.braze.logCustomEvent).toHaveBeenCalledTimes(1);
    expect(window.braze.logCustomEvent).toHaveBeenCalledWith('Product Reviewed', {
      rating: 3,
      review_body: 'Good product.',
      review_id: '12345',
    });
  });

  it('should call the necessary Braze methods for order completed event wit hreserved properties', () => {
    const config = {
      appKey: 'APP_KEY',
      trackAnonymousUser: true,
      enableBrazeLogging: false,
      dataCenter: 'US-03',
      allowUserSuppliedJavascript: false,
    };
    const analytics = {};
    const destinationInfo = {};

    const braze = new Braze(config, analytics, destinationInfo);
    braze.init();
    // mock the window.braze
    mockBrazeSDK();

    // Create a mock rudderElement with necessary properties
    const rudderElement = {
      message: {
        userId: 'user123',
        context: {
          traits: {
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            gender: 'male',
            phone: '1234567890',
            address: {
              country: 'USA',
              city: 'New York',
            },
            birthday: '1990-01-01',
          },
        },
        event: 'Product Reviewed',
        properties: {
          time: '164545454545',
          currency: 'USD',
          products: [
            {
              product_id: '123454387',
              name: 'Game',
              price: 15.99,
              quantity: 1,
            },
          ],
        },
      },
    };

    braze.track(rudderElement);

    // Expect the necessary Braze methods to be called with the correct values
    expect(window.braze.logCustomEvent).toHaveBeenCalledTimes(1);
    expect(window.braze.logCustomEvent).toHaveBeenCalledWith('Product Reviewed', {
      products: [{ name: 'Game', price: 15.99, product_id: '123454387', quantity: 1 }],
    });
  });
});

describe('track - recommended ecommerce events', () => {
  const baseConfig = {
    appKey: 'APP_KEY',
    trackAnonymousUser: true,
    enableBrazeLogging: false,
    dataCenter: 'US-03',
    allowUserSuppliedJavascript: false,
    useEcommerceRecommendedEvents: true,
  };

  const buildBraze = (configOverrides = {}) => {
    const braze = new Braze({ ...baseConfig, ...configOverrides }, {}, {});
    mockBrazeSDK();
    return braze;
  };

  const trackEvent = (braze, event, properties) => {
    braze.track({ message: { userId: 'user123', event, properties } });
  };

  it('maps Product Viewed to ecommerce.product_viewed (flat, no products array)', () => {
    const braze = buildBraze();
    trackEvent(braze, 'Product Viewed', {
      product_id: 'p1',
      name: 'Game',
      variant: 'v1',
      price: 15.99,
      currency: 'USD',
      image_url: 'https://img/p1.png',
      url: 'https://shop/p1',
      type: ['price_drop'],
      campaign: 'summer',
    });

    expect(globalThis.braze.logCustomEvent).toHaveBeenCalledTimes(1);
    expect(globalThis.braze.logCustomEvent).toHaveBeenCalledWith('ecommerce.product_viewed', {
      product_id: 'p1',
      product_name: 'Game',
      variant_id: 'v1',
      price: 15.99,
      currency: 'USD',
      image_url: 'https://img/p1.png',
      product_url: 'https://shop/p1',
      type: ['price_drop'],
      source: 'web',
      metadata: { campaign: 'summer' },
    });
    expect(warnMock).not.toHaveBeenCalled();
  });

  it('maps Product Added to ecommerce.cart_updated with action add (single-product wrap)', () => {
    const braze = buildBraze();
    trackEvent(braze, 'Product Added', {
      cart_id: 'c1',
      currency: 'USD',
      product_id: 'p1',
      name: 'Game',
      variant: 'v1',
      quantity: 2,
      price: 15.99,
      url: 'https://shop/p1',
      list_id: 'wishlist',
    });

    expect(globalThis.braze.logCustomEvent).toHaveBeenCalledWith('ecommerce.cart_updated', {
      cart_id: 'c1',
      currency: 'USD',
      source: 'web',
      action: 'add',
      products: [
        {
          product_id: 'p1',
          product_name: 'Game',
          variant_id: 'v1',
          quantity: 2,
          price: 15.99,
          product_url: 'https://shop/p1',
        },
      ],
      metadata: { list_id: 'wishlist' },
    });
    expect(warnMock).not.toHaveBeenCalled();
  });

  it('maps Product Removed to ecommerce.cart_updated with action remove', () => {
    const braze = buildBraze();
    trackEvent(braze, 'Product Removed', {
      cart_id: 'c1',
      currency: 'USD',
      product_id: 'p1',
      name: 'Game',
      variant: 'v1',
      quantity: 1,
      price: 15.99,
    });

    const [eventName, props] = globalThis.braze.logCustomEvent.mock.calls[0];
    expect(eventName).toBe('ecommerce.cart_updated');
    expect(props.action).toBe('remove');
  });

  it('cart_updated with an explicit products[] maps the array and keeps top-level fields in metadata', () => {
    const braze = buildBraze();
    trackEvent(braze, 'Product Added', {
      cart_id: 'c1',
      currency: 'USD',
      // top-level product-like fields coexisting with an explicit products[] array
      product_id: 'top-level-pid',
      name: 'top-level-name',
      products: [{ product_id: 'p1', name: 'Game', variant: 'v1', quantity: 2, price: 15.99 }],
    });

    const props = globalThis.braze.logCustomEvent.mock.calls[0][1];
    // array is mapped, not the top-level wrap
    expect(props.products).toEqual([
      { product_id: 'p1', product_name: 'Game', variant_id: 'v1', quantity: 2, price: 15.99 },
    ]);
    // top-level product-like fields were NOT consumed, so they flow to metadata
    expect(props.metadata).toEqual({ product_id: 'top-level-pid', name: 'top-level-name' });
  });

  it('does not leak a caller-provided properties.action into metadata', () => {
    const braze = buildBraze();
    trackEvent(braze, 'Product Added', {
      cart_id: 'c1',
      currency: 'USD',
      product_id: 'p1',
      name: 'Game',
      variant: 'v1',
      quantity: 1,
      price: 15.99,
      action: 'caller-supplied',
    });

    const props = globalThis.braze.logCustomEvent.mock.calls[0][1];
    expect(props.action).toBe('add');
    expect(props.metadata).toBeUndefined();
  });

  it('accepts total_discounts under either properties.discount or properties.total_discounts', () => {
    const braze = buildBraze();
    trackEvent(braze, 'Order Refunded', {
      order_id: 'o1',
      total: 10,
      currency: 'USD',
      total_discounts: 3,
      products: [{ product_id: 'p1', name: 'Game', variant: 'v1', quantity: 1, price: 15.99 }],
    });

    expect(globalThis.braze.logCustomEvent.mock.calls[0][1].total_discounts).toBe(3);
  });

  it('does not emit an empty product object when cart_updated has no product fields', () => {
    const braze = buildBraze();
    // `Product Added` maps to ecommerce.cart_updated; with no product fields the
    // single-product wrap must not emit a degenerate `[{}]`.
    trackEvent(braze, 'Product Added', { cart_id: 'c1' });

    const [eventName, props] = globalThis.braze.logCustomEvent.mock.calls[0];
    expect(eventName).toBe('ecommerce.cart_updated');
    // no degenerate `[{}]` — the empty products array is scrubbed off entirely
    expect(props.products).toBeUndefined();
  });

  it('scrubs null/empty values out of event-level and per-product metadata', () => {
    const braze = buildBraze();
    trackEvent(braze, 'Order Completed', {
      order_id: 'o1',
      total: 31.98,
      currency: 'USD',
      coupon: '',
      note: null,
      campaign: 'spring',
      products: [
        {
          product_id: 'p1',
          name: 'Game',
          variant: 'v1',
          quantity: 2,
          price: 15.99,
          color: '',
          shade: null,
          finish: 'matte',
        },
      ],
    });

    const props = globalThis.braze.logCustomEvent.mock.calls[0][1];
    expect(props.metadata).toEqual({ campaign: 'spring' });
    expect(props.products[0].metadata).toEqual({ finish: 'matte' });
  });

  it('maps Checkout Started to ecommerce.checkout_started with products array', () => {
    const braze = buildBraze();
    trackEvent(braze, 'Checkout Started', {
      checkout_id: 'ck1',
      cart_id: 'c1',
      total: 31.98,
      currency: 'USD',
      products: [{ product_id: 'p1', name: 'Game', variant: 'v1', quantity: 2, price: 15.99 }],
    });

    expect(globalThis.braze.logCustomEvent).toHaveBeenCalledWith('ecommerce.checkout_started', {
      checkout_id: 'ck1',
      cart_id: 'c1',
      total_value: 31.98,
      currency: 'USD',
      source: 'web',
      products: [
        { product_id: 'p1', product_name: 'Game', variant_id: 'v1', quantity: 2, price: 15.99 },
      ],
    });
    expect(warnMock).not.toHaveBeenCalled();
  });

  it('maps Order Completed to ecommerce.order_placed (precedence over legacy purchases)', () => {
    const braze = buildBraze();
    trackEvent(braze, 'order completed', {
      order_id: 'o1',
      total: 31.98,
      currency: 'USD',
      coupon: 'SAVE10',
      products: [
        { product_id: 'p1', name: 'Game', variant: 'v1', quantity: 2, price: 15.99, color: 'red' },
      ],
    });

    expect(globalThis.braze.logPurchase).not.toHaveBeenCalled();
    expect(globalThis.braze.logCustomEvent).toHaveBeenCalledWith('ecommerce.order_placed', {
      order_id: 'o1',
      total_value: 31.98,
      currency: 'USD',
      source: 'web',
      products: [
        {
          product_id: 'p1',
          product_name: 'Game',
          variant_id: 'v1',
          quantity: 2,
          price: 15.99,
          metadata: { color: 'red' },
        },
      ],
      metadata: { coupon: 'SAVE10' },
    });
  });

  it('maps Order Refunded with optional total_discounts and discounts passthrough', () => {
    const braze = buildBraze();
    trackEvent(braze, 'Order Refunded', {
      order_id: 'o1',
      total: 31.98,
      currency: 'USD',
      total_discounts: 5,
      discounts: [{ code: 'SAVE10', amount: 5 }],
      products: [{ product_id: 'p1', name: 'Game', variant: 'v1', quantity: 2, price: 15.99 }],
    });

    expect(globalThis.braze.logCustomEvent).toHaveBeenCalledWith('ecommerce.order_refunded', {
      order_id: 'o1',
      total_value: 31.98,
      currency: 'USD',
      total_discounts: 5,
      discounts: [{ code: 'SAVE10', amount: 5 }],
      source: 'web',
      products: [
        { product_id: 'p1', product_name: 'Game', variant_id: 'v1', quantity: 2, price: 15.99 },
      ],
    });
    expect(warnMock).not.toHaveBeenCalled();
  });

  it('maps Order Cancelled with cancel_reason fallback to reason', () => {
    const braze = buildBraze();
    trackEvent(braze, 'Order Cancelled', {
      order_id: 'o1',
      total: 31.98,
      currency: 'USD',
      reason: 'changed mind',
      products: [{ product_id: 'p1', name: 'Game', variant: 'v1', quantity: 2, price: 15.99 }],
    });

    const [eventName, props] = globalThis.braze.logCustomEvent.mock.calls[0];
    expect(eventName).toBe('ecommerce.order_cancelled');
    expect(props.cancel_reason).toBe('changed mind');
    expect(warnMock).not.toHaveBeenCalled();
  });

  it('warns with the missing required field names but still sends the event', () => {
    const braze = buildBraze();
    // Product Added missing required `currency`, and product missing `quantity`/`price`.
    trackEvent(braze, 'Product Added', {
      cart_id: 'c1',
      product_id: 'p1',
      name: 'Game',
      variant: 'v1',
    });

    expect(globalThis.braze.logCustomEvent).toHaveBeenCalledTimes(1);
    expect(warnMock).toHaveBeenCalledTimes(1);
    const warnMessage = warnMock.mock.calls[0][0];
    expect(warnMessage).toContain('ecommerce.cart_updated');
    expect(warnMessage).toContain('currency');
    expect(warnMessage).toContain('products.quantity');
    expect(warnMessage).toContain('products.price');
  });

  it('reports empty products array as a missing field and strips it from the payload', () => {
    const braze = buildBraze();
    trackEvent(braze, 'Order Completed', {
      order_id: 'o1',
      total: 10,
      currency: 'USD',
      products: [],
    });

    expect(globalThis.braze.logCustomEvent).toHaveBeenCalledTimes(1);
    expect(warnMock.mock.calls[0][0]).toContain('products');
    // empty products[] is scrubbed before send
    expect(globalThis.braze.logCustomEvent.mock.calls[0][1]).not.toHaveProperty('products');
  });

  it('always reports source as web, ignoring a caller-supplied properties.source', () => {
    const braze = buildBraze();
    trackEvent(braze, 'Product Viewed', {
      product_id: 'p1',
      name: 'Game',
      variant: 'v1',
      price: 15.99,
      currency: 'USD',
      source: 'ios', // this is the web SDK — the override must be ignored
    });

    const props = globalThis.braze.logCustomEvent.mock.calls[0][1];
    expect(props.source).toBe('web');
    // the ignored value must not leak into metadata either
    expect(props.metadata).toBeUndefined();
  });

  it('warns and scrubs a required field provided as an empty object', () => {
    const braze = buildBraze();
    trackEvent(braze, 'Product Viewed', {
      product_id: 'p1',
      name: 'Game',
      variant: 'v1',
      price: 15.99,
      currency: {},
    });

    expect(globalThis.braze.logCustomEvent).toHaveBeenCalledTimes(1);
    // empty-object required value is reported as missing...
    expect(warnMock).toHaveBeenCalledTimes(1);
    expect(warnMock.mock.calls[0][0]).toContain('currency');
    // ...and never reaches the sent payload.
    expect(globalThis.braze.logCustomEvent.mock.calls[0][1]).not.toHaveProperty('currency');
  });

  it('coerces safe/lossless type mismatches and does not warn', () => {
    const braze = buildBraze();
    trackEvent(braze, 'Order Completed', {
      order_id: 12345, // number -> string
      total: '99.99', // numeric string -> float
      currency: 'USD',
      products: [{ product_id: 'p1', name: 'Game', variant: 'v1', quantity: '2', price: '15.99' }],
    });

    const props = globalThis.braze.logCustomEvent.mock.calls[0][1];
    expect(props.order_id).toBe('12345');
    expect(props.total_value).toBe(99.99);
    expect(props.products[0].quantity).toBe(2);
    expect(props.products[0].price).toBe(15.99);
    expect(warnMock).not.toHaveBeenCalled();
  });

  it('sends un-coercible type mismatches as-is and warns (event-level and per-product)', () => {
    const braze = buildBraze();
    trackEvent(braze, 'Order Completed', {
      order_id: 'o1',
      total: 'free', // non-numeric string -> stays, float mismatch
      currency: 'USD',
      products: [
        { product_id: 'p1', name: 'Game', variant: 'v1', quantity: 2.5, price: 15.99 }, // 2.5 not integer
      ],
    });

    const props = globalThis.braze.logCustomEvent.mock.calls[0][1];
    // un-coercible values are sent verbatim
    expect(props.total_value).toBe('free');
    expect(props.products[0].quantity).toBe(2.5);
    // ...and surfaced via the type-mismatch warning
    expect(warnMock).toHaveBeenCalledTimes(1);
    const warnMessage = warnMock.mock.calls[0][0];
    expect(warnMessage).toContain('type-mismatched');
    expect(warnMessage).toContain('total_value (expected float)');
    expect(warnMessage).toContain('products.quantity (expected integer)');
  });

  it('leaves an integer-valued string with a fractional part un-coerced for an integer field', () => {
    const braze = buildBraze();
    trackEvent(braze, 'Product Added', {
      cart_id: 'c1',
      currency: 'USD',
      product_id: 'p1',
      name: 'Game',
      variant: 'v1',
      quantity: '2.5', // not a pure integer literal -> stays "2.5"
      price: '15.99', // numeric string -> 15.99
    });

    const props = globalThis.braze.logCustomEvent.mock.calls[0][1];
    expect(props.products[0].quantity).toBe('2.5');
    expect(props.products[0].price).toBe(15.99);
    expect(warnMock).toHaveBeenCalledTimes(1);
    expect(warnMock.mock.calls[0][0]).toContain('products.quantity (expected integer)');
  });

  it('warns when product_viewed type is not an array of strings', () => {
    const braze = buildBraze();
    trackEvent(braze, 'Product Viewed', {
      product_id: 'p1',
      name: 'Game',
      variant: 'v1',
      price: 15.99,
      currency: 'USD',
      type: 'price_drop', // bare string, expected array of strings
    });

    const props = globalThis.braze.logCustomEvent.mock.calls[0][1];
    expect(props.type).toBe('price_drop'); // sent as-is
    expect(warnMock).toHaveBeenCalledTimes(1);
    expect(warnMock.mock.calls[0][0]).toContain('type (expected stringArray)');
  });

  it('flags Infinity as a float type mismatch', () => {
    const braze = buildBraze();
    trackEvent(braze, 'Product Viewed', {
      product_id: 'p1',
      name: 'Game',
      variant: 'v1',
      price: Infinity, // not JSON-serializable — must not pass as a valid float
      currency: 'USD',
    });

    expect(warnMock).toHaveBeenCalledTimes(1);
    expect(warnMock.mock.calls[0][0]).toContain('price (expected float)');
  });

  it('does not coerce an overflowing numeric string to Infinity', () => {
    const braze = buildBraze();
    const hugeNumber = new Array(401).join('9'); // 400 digits — Number(...) overflows to Infinity
    trackEvent(braze, 'Product Viewed', {
      product_id: 'p1',
      name: 'Game',
      variant: 'v1',
      price: hugeNumber,
      currency: 'USD',
    });

    const props = globalThis.braze.logCustomEvent.mock.calls[0][1];
    expect(props.price).toBe(hugeNumber); // left verbatim, not Infinity
    expect(warnMock).toHaveBeenCalledTimes(1);
    expect(warnMock.mock.calls[0][0]).toContain('price (expected float)');
  });

  it('does not coerce a boolean to string; sends it as-is and warns', () => {
    const braze = buildBraze();
    trackEvent(braze, 'Product Viewed', {
      product_id: 'p1',
      name: 'Game',
      variant: 'v1',
      price: 15.99,
      currency: true, // boolean on a string field — not coerced
    });

    const props = globalThis.braze.logCustomEvent.mock.calls[0][1];
    expect(props.currency).toBe(true); // sent verbatim, not "true"
    expect(warnMock).toHaveBeenCalledTimes(1);
    expect(warnMock.mock.calls[0][0]).toContain('currency (expected string)');
  });

  it('falls through to legacy custom-event path for unmapped events (Cart Updated)', () => {
    const braze = buildBraze();
    trackEvent(braze, 'Cart Updated', { cart_id: 'c1', value: 10 });

    expect(globalThis.braze.logCustomEvent).toHaveBeenCalledWith('Cart Updated', {
      cart_id: 'c1',
      value: 10,
    });
  });

  it('falls through to legacy purchase path when the flag is off', () => {
    const braze = buildBraze({ useEcommerceRecommendedEvents: false });
    trackEvent(braze, 'order completed', {
      currency: 'USD',
      products: [{ product_id: 'p1', price: 15.99, quantity: 1 }],
    });

    expect(globalThis.braze.logPurchase).toHaveBeenCalledTimes(1);
    expect(globalThis.braze.logCustomEvent).not.toHaveBeenCalled();
  });
});

describe('page', () => {
  it('should call the necessary Braze methods to custom event', () => {
    const config = {
      appKey: 'APP_KEY',
      trackAnonymousUser: true,
      enableBrazeLogging: false,
      dataCenter: 'US-03',
      allowUserSuppliedJavascript: false,
    };
    const analytics = {};
    const destinationInfo = {};

    const braze = new Braze(config, analytics, destinationInfo);
    braze.init();
    // mock the window.braze
    mockBrazeSDK();

    // Create a mock rudderElement with necessary properties
    const rudderElement = {
      message: {
        userId: 'user123',
        type: 'page',
        name: 'Home',
        properties: {
          title: 'Home | RudderStack',
          url: 'https://www.rudderstack.com',
        },
      },
    };

    braze.page(rudderElement);

    // Expect the necessary Braze methods to be called with the correct values
    expect(window.braze.logCustomEvent).toHaveBeenCalledTimes(1);
    expect(window.braze.logCustomEvent).toHaveBeenCalledWith('Home', {
      title: 'Home | RudderStack',
      url: 'https://www.rudderstack.com',
    });
  });

  it('should call the necessary Braze methods to custom event without event name', () => {
    const config = {
      appKey: 'APP_KEY',
      trackAnonymousUser: true,
      enableBrazeLogging: false,
      dataCenter: 'US-03',
      allowUserSuppliedJavascript: false,
    };
    const analytics = {};
    const destinationInfo = {};

    const braze = new Braze(config, analytics, destinationInfo);
    braze.init();
    // mock the window.braze
    mockBrazeSDK();

    // Create a mock rudderElement with necessary properties
    const rudderElement = {
      message: {
        userId: 'user123',
        type: 'page',
        properties: {
          title: 'Home | RudderStack',
          url: 'https://www.rudderstack.com',
        },
      },
    };

    braze.page(rudderElement);

    // Expect the necessary Braze methods to be called with the correct values
    expect(window.braze.logCustomEvent).toHaveBeenCalledTimes(1);
    expect(window.braze.logCustomEvent).toHaveBeenCalledWith('Page View', {
      title: 'Home | RudderStack',
      url: 'https://www.rudderstack.com',
    });
  });

  it('should call the necessary Braze methods to custom event with anonymousUser', () => {
    const config = {
      appKey: 'APP_KEY',
      trackAnonymousUser: false,
      enableBrazeLogging: false,
      dataCenter: 'US-03',
      allowUserSuppliedJavascript: false,
    };
    const analytics = {};
    const destinationInfo = {};

    const braze = new Braze(config, analytics, destinationInfo);
    braze.init();
    // mock the window.braze
    mockBrazeSDK();

    // Create a mock rudderElement with necessary properties
    const rudderElement = {
      message: {
        anonymousId: 'anon123',
        type: 'page',
        properties: {
          title: 'Home | RudderStack',
          url: 'https://www.rudderstack.com',
        },
      },
    };

    braze.page(rudderElement);

    // Expect the necessary Braze methods to be called with the correct values
    expect(window.braze.logCustomEvent).toHaveBeenCalledTimes(1);
    expect(window.braze.logCustomEvent).toHaveBeenCalledWith('Page View', {
      title: 'Home | RudderStack',
      url: 'https://www.rudderstack.com',
    });
  });

  it('should call the necessary Braze methods to custom event with anonymousUser and tracking anonymous user', () => {
    const config = {
      appKey: 'APP_KEY',
      trackAnonymousUser: true,
      enableBrazeLogging: false,
      dataCenter: 'US-03',
      allowUserSuppliedJavascript: false,
    };
    const analytics = {};
    const destinationInfo = {};

    const braze = new Braze(config, analytics, destinationInfo);
    braze.init();
    // mock the window.braze
    mockBrazeSDK();

    // Create a mock rudderElement with necessary properties
    const rudderElement = {
      message: {
        anonymousId: 'anon123',
        type: 'page',
        properties: {
          title: 'Home | RudderStack',
          url: 'https://www.rudderstack.com',
        },
      },
    };

    braze.page(rudderElement);

    // Expect the necessary Braze methods to be called with the correct values
    expect(window.braze.logCustomEvent).toHaveBeenCalledTimes(1);
    expect(window.braze.logCustomEvent).toHaveBeenCalledWith('Page View', {
      title: 'Home | RudderStack',
      url: 'https://www.rudderstack.com',
    });
  });

  it('should call the necessary Braze methods to custom event with reserved properties', () => {
    const config = {
      appKey: 'APP_KEY',
      trackAnonymousUser: true,
      enableBrazeLogging: false,
      dataCenter: 'US-03',
      allowUserSuppliedJavascript: false,
    };
    const analytics = {};
    const destinationInfo = {};

    const braze = new Braze(config, analytics, destinationInfo);
    braze.init();
    // mock the window.braze
    mockBrazeSDK();

    // Create a mock rudderElement with necessary properties
    const rudderElement = {
      message: {
        anonymousId: 'anon123',
        type: 'page',
        properties: {
          title: 'Home | RudderStack',
          url: 'https://www.rudderstack.com',
          event_name: 'ABC',
          referer: 'index',
          currency: 'usd',
        },
      },
    };

    braze.page(rudderElement);

    // Expect the necessary Braze methods to be called with the correct values
    expect(window.braze.logCustomEvent).toHaveBeenCalledTimes(1);
    expect(window.braze.logCustomEvent).toHaveBeenCalledWith('Page View', {
      title: 'Home | RudderStack',
      url: 'https://www.rudderstack.com',
      referer: 'index',
    });
  });
});

describe('hybrid mode', () => {
  it('should not call the necessary Braze methods for page call', () => {
    const config = {
      appKey: 'APP_KEY',
      trackAnonymousUser: true,
      enableBrazeLogging: false,
      dataCenter: 'US-03',
      enableHtmlInAppMessages: false,
      allowUserSuppliedJavascript: false,
      connectionMode: 'hybrid',
    };
    const analytics = {};
    const destinationInfo = {};

    const braze = new Braze(config, analytics, destinationInfo);
    braze.init();
    // mock the window.braze
    mockBrazeSDK();

    // Create a mock rudderElement with necessary properties
    const rudderElement = {
      message: {
        userId: 'user123',
        type: 'page',
        name: 'Home',
        properties: {
          title: 'Home | RudderStack',
          url: 'https://www.rudderstack.com',
        },
      },
    };

    jest.spyOn(window.braze, 'changeUser');
    braze.page(rudderElement);

    // Expect the necessary Braze methods to be called with the correct values
    expect(window.braze.changeUser).toHaveBeenCalledTimes(0);
  });

  it('should not call the necessary Braze methods for track call', () => {
    const config = {
      appKey: 'APP_KEY',
      trackAnonymousUser: true,
      enableBrazeLogging: false,
      dataCenter: 'US-03',
      enableHtmlInAppMessages: false,
      allowUserSuppliedJavascript: false,
      connectionMode: 'hybrid',
    };
    const analytics = {};
    const destinationInfo = {};

    const braze = new Braze(config, analytics, destinationInfo);
    braze.init();
    // mock the window.braze
    mockBrazeSDK();

    // Create a mock rudderElement with necessary properties
    const rudderElement = {
      message: {
        userId: 'user123',
        type: 'page',
        name: 'Home',
        properties: {
          title: 'Home | RudderStack',
          url: 'https://www.rudderstack.com',
        },
      },
    };

    jest.spyOn(window.braze, 'changeUser');
    braze.track(rudderElement);

    // Expect the necessary Braze methods to be called with the correct values
    expect(window.braze.changeUser).toHaveBeenCalledTimes(0);
  });

  it('should call the necessary Braze methods for identify call', () => {
    const config = {
      appKey: 'APP_KEY',
      trackAnonymousUser: true,
      enableBrazeLogging: false,
      dataCenter: 'US-03',
      enableHtmlInAppMessages: false,
      allowUserSuppliedJavascript: false,
      connectionMode: 'hybrid',
    };
    const analytics = {};
    const destinationInfo = {};

    const braze = new Braze(config, analytics, destinationInfo);
    braze.init();
    // mock the window.braze
    mockBrazeSDK();

    // Create a mock rudderElement with necessary properties
    const rudderElement = {
      message: {
        userId: 'user123',
        type: 'page',
        name: 'Home',
        properties: {
          title: 'Home | RudderStack',
          url: 'https://www.rudderstack.com',
        },
      },
    };

    jest.spyOn(window.braze, 'changeUser');
    braze.identify(rudderElement);

    // Expect the necessary Braze methods to be called with the correct values
    expect(window.braze.changeUser).toHaveBeenCalledTimes(1);
  });
});
