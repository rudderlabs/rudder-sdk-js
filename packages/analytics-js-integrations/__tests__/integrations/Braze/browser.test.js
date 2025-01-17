/* eslint-disable sonarjs/no-duplicate-string */
import * as R from 'ramda';
import { Storage } from '@rudderstack/analytics-js-common/v1.1/utils/storage';
import Braze from '../../../src/integrations/Braze/browser';

// Mock dependencies
jest.mock('../../../src/utils/logger', () =>
  jest.fn().mockImplementation(() => ({
    setLogLevel: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
  })),
);

jest.mock('@rudderstack/analytics-js-common/v1.1/utils/storage', () => ({
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
    const analytics = {
      logLevel: '0',
    };
    const destinationInfo = {};
    const braze = new Braze(config, analytics, destinationInfo);
    expect(braze.trackAnonymousUser).toEqual(undefined);
    expect(braze.enableBrazeLogging).toEqual(false);
    expect(braze.allowUserSuppliedJavascript).toEqual(false);
    expect(braze.appKey).toEqual('APP_KEY');
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
    expect(braze.appKey).toEqual('');
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

describe('isLoaded', () => {
  it('should get false value with isReady', () => {
    const config = {};
    const analytics = {};
    const destinationInfo = {};

    const braze = new Braze(config, analytics, destinationInfo);
    const isLoaded = braze.isReady();
    expect(isLoaded).toBe(false);
  });

  it('should call the add alias method', () => {
    const config = {
      appKey: 'APP_KEY',
    };
    const analytics = {
      getAnonymousId: jest.fn().mockReturnValue('anon123'),
    };
    const destinationInfo = {};

    const braze = new Braze(config, analytics, destinationInfo);
    braze.init();
    // mock the window.braze
    mockBrazeSDK();
    
    // mock true for isLoaded
    jest.spyOn(braze, 'isLoaded').mockReturnValue(true);

    jest.spyOn(window.braze, 'addAlias');

    const isReady = braze.isReady();
    expect(window.braze.addAlias).toHaveBeenCalledWith('anon123', 'rudder_id');
    expect(isReady).toBe(true);
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
    expect(window.braze.logCustomEvent).toHaveBeenCalledWith('Product Reviewed', {
      products: [{ name: 'Game', price: 15.99, product_id: '123454387', quantity: 1 }],
    });
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
