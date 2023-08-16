/* eslint-disable sonarjs/no-duplicate-string */
import * as R from 'ramda';
import { Storage } from '@rudderstack/analytics-js-common/utilsV1/storage';
import { Braze } from '../../../src/integrations/Braze/browser';

// Mock dependencies
jest.mock('../../../src/utils/logger', () =>
  jest.fn().mockImplementation(() => ({
    setLogLevel: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
  })),
);

jest.mock('@rudderstack/analytics-js-common/utilsV1/storage', () => ({
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
    getCachedContentCards: jest.fn(),
    getCachedFeed: jest.fn(),
    User: {
      Genders: {
        OTHER: 'o',
        MALE: 'm',
        FEMALE: 'f',
      },
    },
  };
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
    const analytics = {};
    const destinationInfo = {};
    const braze = new Braze(config, analytics, destinationInfo);
    expect(braze.trackAnonymousUser).toEqual(undefined);
    expect(braze.enableBrazeLogging).toEqual(false);
    expect(braze.enableHtmlInAppMessages).toEqual(false);
    expect(braze.allowUserSuppliedJavascript).toEqual(false);
    expect(braze.appKey).toEqual('APP_KEY');
  });

  // Add more tests for the constructor if needed
});

describe('init', () => {
  it('should initialize Braze', () => {
    const config = {
      appKey: 'APP_KEY',
      trackAnonymousUser: true,
      enableBrazeLogging: false,
      dataCenter: 'US-03',
      enableHtmlInAppMessages: false,
      allowUserSuppliedJavascript: false,
    };
    const analytics = {};
    const destinationInfo = {};

    const braze = new Braze(config, analytics, destinationInfo);
    braze.init();
    const apiKeyObj = window.brazeQueue.find(obj => obj[0] === 'APP_KEY');

    expect(apiKeyObj[0]).toEqual('APP_KEY');
    expect(apiKeyObj[1]).toEqual({
      enableLogging: false,
      baseUrl: 'sdk.iad-03.braze.com',
      enableHtmlInAppMessages: false,
      allowUserSuppliedJavascript: false,
    });
  });

  // Add more tests for the init method if needed
});

describe('identify', () => {
  it('should call the necessary Braze methods to set user attributes', () => {
    const config = {
      appKey: 'APP_KEY',
      trackAnonymousUser: true,
      enableBrazeLogging: false,
      dataCenter: 'US-03',
      enableHtmlInAppMessages: false,
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
    expect(window.braze.getUser().setGender).toHaveBeenCalledWith('m');
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
      enableHtmlInAppMessages: false,
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
      enableHtmlInAppMessages: false,
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
      enableHtmlInAppMessages: false,
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
      enableHtmlInAppMessages: false,
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
      enableHtmlInAppMessages: false,
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
