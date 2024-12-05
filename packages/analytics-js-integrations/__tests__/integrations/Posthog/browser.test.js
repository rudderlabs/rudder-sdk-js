import Posthog from '../../../src/integrations/Posthog/browser';

let errMock;

// In each of the mocked method implementation, invoke the corresponding above mock functions
jest.mock('../../../src/utils/logger', () => {
  const originalModule = jest.requireActual('../../../src/utils/logger');
  return {
    ...originalModule,
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      setLogLevel: jest.fn(),
      error: jest.fn().mockImplementation((...args) => errMock(...args)),
    })),
  };
});

afterAll(() => {
  jest.restoreAllMocks();
});

let config = {
  teamApiKey: 'YOUR_TEAM_API_KEY',
  yourInstance: 'https://app.posthog.com',
  autocapture: true,
  capturePageView: true,
  disableSessionRecording: false,
  disableCookie: false,
  propertyBlackList: ['name'],
  personProfiles: 'always',
};

let posthogInstance;

beforeEach(() => {
  // Reset the logger method mocks
  errMock = jest.fn();
  window.posthog = {
    register: jest.fn(),
    register_once: jest.fn(),
    unregister: jest.fn(),
    capture: jest.fn(),
    group: jest.fn(),
    identify: jest.fn(),
  };
  posthogInstance = new Posthog(config, analytics, destinationInfo);
  // Add a dummy script as it is required by the init script
  const scriptElement = document.createElement('script');
  scriptElement.type = 'text/javascript';
  scriptElement.id = 'dummyScript';
  const headElements = document.getElementsByTagName('head');
  headElements[0].insertBefore(scriptElement, headElements[0].firstChild);
});
const destinationInfo = {
  areTransformationsConnected: false,
  destinationId: 'sample-destination-id',
};

const analytics = {
  logLevel: 'INFO',
};
describe('Posthog Test', () => {
  describe('Init', () => {
    // Posthog instance is created successfully with valid config and analytics objects
    it('should create a Posthog instance with valid config and analytics objects', () => {
      expect(posthogInstance.name).toBe('POSTHOG');
      expect(posthogInstance.analytics).toBe(analytics);
      expect(posthogInstance.teamApiKey).toBe(config.teamApiKey);
      expect(posthogInstance.yourInstance).toBe(config.yourInstance);
      expect(posthogInstance.autocapture).toBe(config.autocapture);
      expect(posthogInstance.capturePageView).toBe(config.capturePageView);
      expect(posthogInstance.disableSessionRecording).toBe(config.disableSessionRecording);
      expect(posthogInstance.disableCookie).toBe(config.disableCookie);
      expect(posthogInstance.propertyBlackList).toEqual([]);
      expect(posthogInstance.xhrHeaders).toEqual({});
      expect(posthogInstance.enableLocalStoragePersistence).toBeUndefined();
      expect(posthogInstance.destinationId).toBe(destinationInfo.destinationId);
      expect(posthogInstance.personProfiles).toEqual('always');
    });

    // init() method initializes the Posthog SDK with valid config
    it('should initialize the Posthog SDK with valid config', () => {
      posthogInstance.init();
      expect(typeof window.posthog).toEqual('object');
    });

    // isLoaded() method returns true if Posthog SDK is loaded
    it('should return true if Posthog SDK is loaded', () => {
      // Mock the Posthog SDK being loaded
      window.posthog = {
        __loaded: true,
      };

      const isLoaded = posthogInstance.isLoaded();

      expect(isLoaded).toBe(true);
    });

    it('should include featureFlags in bootstrap when featureFlags is non-empty', () => {
      const testConfig = {
        ...config,
        flags: [
          { flag: 'flag-1', value: 'true' },
          { flag: 'flag-2', value: 'false' },
          { flag: 'flag-3', value: 'abcd' },
        ],
      };
      posthogInstance = new Posthog(testConfig, analytics, destinationInfo);
      posthogInstance.init();
      expect(posthogInstance.name).toBe('POSTHOG');
      expect(posthogInstance.analytics).toBe(analytics);
      expect(window.posthog._i[0][1].bootstrap).toStrictEqual({
        featureFlags: { 'flag-1': true, 'flag-2': false, 'flag-3': 'abcd' },
      });
    });

    it('should not include featureFlags in bootstrap when featureFlags is empty', () => {
      const testConfig = {
        ...config,
        flags: [],
      };

      posthogInstance = new Posthog(testConfig, analytics, destinationInfo);
      posthogInstance.init();

      expect(posthogInstance.name).toBe('POSTHOG');
      expect(posthogInstance.analytics).toBe(analytics);

      // Validate no featureFlags are included
      expect(window.posthog._i[0][1].bootstrap).toStrictEqual(undefined);
    });

    it('should exclude invalid featureFlags values', () => {
      const testConfig = {
        ...config,
        flags: [
          { flag: 'flag-1', value: 'true' },
          { flag: 'flag-2', value: undefined },
          { flag: 'flag-3' },
          { value: 'val' },
          { flag: 'flag-5', value: 'control' },
        ],
      };

      posthogInstance = new Posthog(testConfig, analytics, destinationInfo);
      posthogInstance.init();

      expect(posthogInstance.name).toBe('POSTHOG');
      expect(posthogInstance.analytics).toBe(analytics);

      // Validate only valid flags are included
      expect(window.posthog._i[0][1].bootstrap).toStrictEqual({
        featureFlags: {
          'flag-1': true,
          'flag-5': 'control',
        },
      });
    });
  });
  describe('processSuperProperties', () => {
    it('should call posthog.register when superProperties is present', () => {
      const rudderElement = {
        message: {
          integrations: {
            POSTHOG: {
              superProperties: {
                property1: 'value1',
                property2: 'value2',
              },
              setOnceProperties: {
                property3: 'value3',
              },
              unsetProperties: ['property4'],
            },
          },
        },
      };
      posthogInstance.processSuperProperties(rudderElement);

      expect(window.posthog.register).toHaveBeenCalledWith({
        property1: 'value1',
        property2: 'value2',
      });
    });
  });
  describe('track', () => {
    // Track a basic event with event name and properties
    it('should track a basic event with event name and properties', () => {
      const rudderElement = {
        message: {
          event: 'Example Event',
          properties: {
            key1: 'value1',
            key2: 'value2',
          },
          context: {
            traits: {
              trait1: 'value1',
              trait2: 'value2',
            },
          },
        },
      };
      posthogInstance.track(rudderElement);

      // Assertion
      expect(window.posthog.capture).toHaveBeenCalledWith('Example Event', {
        key1: 'value1',
        key2: 'value2',
      });
    });

    // Track an event with empty properties
    it('should track an event with empty properties', () => {
      const rudderElement = {
        message: {
          event: 'Example Event',
          properties: {},
          context: {
            traits: {
              trait1: 'value1',
              trait2: 'value2',
            },
          },
        },
      };

      posthogInstance.track(rudderElement);

      // Assertion
      expect(window.posthog.capture).toHaveBeenCalledWith('Example Event', {});
    });

    // Track an event with properties containing only string values
    it('should track an event with properties containing only string values', () => {
      const rudderElement = {
        message: {
          event: 'Example Event',
          properties: {
            key1: 'value1',
            key2: 'value2',
          },
          context: {
            traits: {
              trait1: 'value1',
              trait2: 'value2',
            },
          },
        },
      };
      posthogInstance.track(rudderElement);

      // Assertion
      expect(window.posthog.capture).toHaveBeenCalledWith('Example Event', {
        key1: 'value1',
        key2: 'value2',
      });
    });

    // Track an event with empty event name
    it('should track an event with empty event name', () => {
      const rudderElement = {
        message: {
          event: '',
          properties: {
            key1: 'value1',
            key2: 'value2',
          },
          context: {
            traits: {
              trait1: 'value1',
              trait2: 'value2',
            },
          },
        },
      };
      posthogInstance.track(rudderElement);

      // Assertion
      expect(window.posthog.capture).toHaveBeenCalledWith('', {
        key1: 'value1',
        key2: 'value2',
      });
    });

    // Track an event with properties containing circular references
    it('should track an event with properties containing circular references', () => {
      const circularObject = {};
      circularObject.circularRef = circularObject;

      const rudderElement = {
        message: {
          event: 'Example Event',
          properties: {
            key1: 'value1',
            key2: circularObject,
          },
          context: {
            traits: {
              trait1: 'value1',
              trait2: 'value2',
            },
          },
        },
      };
      posthogInstance.track(rudderElement);

      // Assertion
      expect(window.posthog.capture).toHaveBeenCalledWith('Example Event', {
        key1: 'value1',
        key2: circularObject,
      });
    });
  });
  // Generated by CodiumAI

  describe('group', () => {
    // Successfully group users based on groupType and groupId
    it('should successfully group users based on groupType and groupId', () => {
      const rudderElement = {
        message: {
          traits: {
            groupType: 'organization',
            name: 'ACME Corp',
            industry: 'Technology',
          },
          groupId: '1234567890',
        },
      };
      posthogInstance.group(rudderElement);
      // Assert that posthog.group is called with the correct arguments
      expect(window.posthog.group).toHaveBeenCalledWith('organization', '1234567890', {
        name: 'ACME Corp',
        industry: 'Technology',
      });
    });
    it('should not group users as groupId is not present', () => {
      const rudderElement = {
        message: {
          traits: {
            groupType: 'organization',
            name: 'ACME Corp',
            industry: 'Technology',
          },
        },
      };
      posthogInstance.group(rudderElement);
      expect(errMock).toHaveBeenCalledWith('groupType and groupKey is required for group call');
    });
  });
  // Generated by CodiumAI

  describe('identify', () => {
    // Identify user with userId and traits
    it('should identify user with userId and traits', () => {
      const rudderElement = {
        message: {
          context: {
            traits: {
              name: 'John Doe',
              email: 'john.doe@example.com',
            },
          },
          userId: '1234567890',
        },
      };
      posthogInstance.identify(rudderElement);
      expect(window.posthog.identify).toHaveBeenCalledWith('1234567890', {
        name: 'John Doe',
        email: 'john.doe@example.com',
      });
      expect(window.posthog.identify).toHaveBeenCalledTimes(1);
    });

    // Identify user with only userId
    it('should identify user with only userId', () => {
      const rudderElement = {
        message: {
          context: { traits: {} },

          userId: '1234567890',
        },
      };
      posthogInstance.identify(rudderElement);
      expect(window.posthog.identify).toHaveBeenCalledWith('1234567890', {});
    });
    // Do not identify user if userId is not present
    it('should not identify user if userId is not present', () => {
      const rudderElement = {
        message: {
          context: {
            traits: {
              name: 'John Doe',
              email: 'john.doe@example.com',
            },
          },
          userId: null,
        },
      };

      posthogInstance.identify(rudderElement);
      expect(window.posthog.identify).not.toHaveBeenCalled();
    });

    // Identify user with empty userId
    it('should identify user with empty userId', () => {
      const rudderElement = {
        message: {
          context: {
            traits: {
              name: 'John Doe',
              email: 'john.doe@example.com',
            },
          },
          userId: '',
        },
      };
      posthogInstance.identify(rudderElement);
      expect(window.posthog.identify).not.toHaveBeenCalledWith();
    });

    // Identify user with empty traits
    it('should identify user with empty traits', () => {
      const rudderElement = {
        message: {
          context: {
            traits: {},
          },
          userId: '1234567890',
        },
      };

      posthogInstance.identify(rudderElement);

      expect(window.posthog.identify).toHaveBeenCalledWith('1234567890', {});
      expect(window.posthog.identify).toHaveBeenCalledTimes(1);
    });

    // Identify user with null userId
    it('should identify user with null userId', () => {
      const rudderElement = {
        message: {
          context: {
            traits: {
              name: 'John Doe',
              email: 'john.doe@example.com',
            },
          },
          userId: null,
        },
      };
      posthogInstance.identify(rudderElement);

      expect(window.posthog.identify).not.toHaveBeenCalledWith();
      expect(window.posthog.identify).toHaveBeenCalledTimes(0);
    });
  });
  describe('page', () => {
    it('should call posthog.capture', () => {
      const rudderElement = {
        message: {
          integrations: {
            POSTHOG: {
              superProperties: {
                property1: 'value1',
                property2: 'value2',
              },
              setOnceProperties: {
                property3: 'value3',
              },
              unsetProperties: ['property4'],
            },
          },
        },
      };
      posthogInstance.page(rudderElement);

      expect(window.posthog.register).toHaveBeenCalledWith({
        property1: 'value1',
        property2: 'value2',
      });
      expect(window.posthog.capture).toHaveBeenCalledWith('$pageview');
    });
  });
});
