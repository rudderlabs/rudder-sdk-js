/* eslint-disable no-underscore-dangle */
import Fullstory from '../../../src/integrations/Fullstory/browser';
import { loadNativeSdk } from '../../../src/integrations/Fullstory/nativeSdkLoader';
import { getDestinationOptions } from '../../../src/integrations/Fullstory/utils';

jest.mock('../../../src/integrations/Fullstory/nativeSdkLoader', () => ({
  loadNativeSdk: jest.fn(),
}));

jest.mock('../../../src/integrations/Fullstory/utils', () => ({
  getDestinationOptions: jest.fn().mockReturnValue({}),
}));

const DESTINATION_ID = 'sample-destination-id';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let originalLocalStorage;

beforeEach(() => {
  const scriptElement = document.createElement('script');
  scriptElement.type = 'text/javascript';
  scriptElement.id = 'dummyScript';
  const headElements = document.getElementsByTagName('head');
  headElements[0].insertBefore(scriptElement, headElements[0].firstChild);

  global.logger = {
    info: jest.fn(),
    error: jest.fn(),
    setLogLevel: jest.fn(),
  };
  originalLocalStorage = window.localStorage;
  window.localStorage = {
    getItem: jest.fn(key => {
      if (key === 'tata_customer_hash') return 'hash123';
      return null;
    }),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  };
  window.FS = {
    event: jest.fn(),
    identify: jest.fn(),
    restart: jest.fn(),
    shutdown: jest.fn(),
    setUserVars: jest.fn(),
    log: jest.fn(),
    init: jest.fn(),
  };
  window._fs_namespace = 'FS';
  window._fs_identity = jest.fn().mockImplementation(() => {
    console.log('Mock _fs_identity called');
  });
});

jest.useFakeTimers();

const analyticsInstance = {
  logLevel: 'DEBUG',
  getAnonymousId: () => 'ANONYMOUS_ID',
  loadIntegration: true,
};

const destinationInfo = {
  areTransformationsConnected: false,
  destinationId: DESTINATION_ID,
};

const destinationConfig = { fs_org: '12567839', fs_debug_mode: true, fs_host: 'localhost' };

afterEach(() => {
  document.getElementById('dummyScript')?.remove();
  window.localStorage = originalLocalStorage;
});

afterAll(() => {
  jest.restoreAllMocks();
});
describe('FullStory', () => {

  describe('init', () => {
    let fullstory;
    beforeEach(() => {
      fullstory = new Fullstory(destinationConfig, analyticsInstance, destinationInfo);
    });

    test('should initialize the destination', () => {
      fullstory.init();
      expect(typeof window.FS).toBe('object');
    });

    test('should call loadNativeSdk with correct parameters', () => {
      fullstory.init();
      // Assert that class-level properties exist
      expect(fullstory.fs_org).toBeDefined();
      expect(fullstory.fs_debug_mode).toBeDefined();
      expect(fullstory.fs_host).toBeDefined();
      expect(loadNativeSdk).toHaveBeenCalledWith(
        fullstory.fs_debug_mode,
        fullstory.fs_host,
        fullstory.fs_org,
      );
    });

    test('should handle cross-domain support correctly', () => {
      getDestinationOptions.mockReturnValue({
        crossDomainSupport: true,
        timeout: 3000,
      });
      fullstory.init();
      // eslint-disable-next-line no-underscore-dangle
      expect(window._fs_identity).toBeDefined();
    });

    // Loads the native SDK with correct parameters
    it('should load the native SDK with correct parameters when initialized', () => {
      const fullstory = new Fullstory(destinationConfig, analyticsInstance, destinationInfo);
      fullstory.init();

      expect(loadNativeSdk).toHaveBeenCalledWith(true, 'localhost', '12567839');
    });

    // Handles missing or undefined fullstoryIntgConfig gracefully
    it('should handle missing or undefined fullstoryIntgConfig gracefully', () => {
      const fullstory = new Fullstory(destinationConfig, analyticsInstance, destinationInfo);
      expect(() => fullstory.init()).not.toThrow();
    });

    // Calls fs('shutdown') before setting up identity
    it("should call fs('shutdown') before setting up identity", () => {
      const fullstory = new Fullstory({}, {}, {});
      fullstory.init();

      expect(window.FS.shutdown).toHaveBeenCalled();
    });

    // Returns user identity correctly from localStorage
    it('should return user identity from localStorage', () => {
      const destinationConfig = { fs_org: '12567839', fs_debug_mode: true, fs_host: 'localhost', crossDomainSupport: true };
      // const mockLocalStorage = {
      //   tata_customer_hash: 'user123',
      // };
      // window.localStorage = mockLocalStorage;
      // Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
      window.localStorage = {
        // getItem: jest.fn(key => {
        //   if (key === 'tata_customer_hash') return 'user123';
        //   return null;
        // }),
        // setItem: jest.fn(),
        // removeItem: jest.fn(),
        tata_customer_hash : 'user123'
      };

      fullstory.init();

      expect(window._fs_identity()).toEqual({ uid: 'user123', displayName: 'user123' });
    });
  });
  describe('isLoaded and isReady', () => {
    let fullstory;

    beforeEach(() => {
      fullstory = new Fullstory(destinationConfig, analyticsInstance, destinationInfo);
    });

    test('isLoaded should return true when FS is defined', () => {
      window.FS = {}; // Simulate FS being loaded
      expect(fullstory.isLoaded()).toBe(true);
    });

    test('isLoaded should return false when FS is undefined', () => {
      delete window.FS; // Simulate FS not being loaded
      expect(fullstory.isLoaded()).toBe(false);
    });

    test('isReady should return true when FS is defined', () => {
      window.FS = {}; // Ensure FS is defined
      expect(fullstory.isReady()).toBe(true);
    });

    test('isReady should return false when FS is undefined', () => {
      delete window.FS; // Ensure FS is not defined
      expect(fullstory.isReady()).toBe(false);
    });
  });

  describe('constructor', () => {
    it('should properly initialize with given configuration', () => {
      const fullstoryInstance = new Fullstory(
        destinationConfig,
        analyticsInstance,
        destinationInfo,
      );

      expect(fullstoryInstance.fs_org).toBe('12567839');
      expect(fullstoryInstance.fs_debug_mode).toBe(true);
      expect(fullstoryInstance.fs_host).toBe('localhost');
      expect(fullstoryInstance.name).toBeDefined();
      expect(fullstoryInstance.analytics).toEqual(analyticsInstance);
      expect(fullstoryInstance.destinationId).toBe(DESTINATION_ID);
    });
    it('should properly initialize even when fs_host is not set ', () => {
      const fullstoryInstance = new Fullstory(
        { ...destinationConfig, fs_host: undefined },
        analyticsInstance,
        destinationInfo,
      );

      expect(fullstoryInstance.fs_org).toBe('12567839');
      expect(fullstoryInstance.fs_debug_mode).toBe(true);
      expect(fullstoryInstance.fs_host).toBe('fullstory.com');
      expect(fullstoryInstance.name).toBeDefined();
      expect(fullstoryInstance.analytics).toEqual(analyticsInstance);
      expect(fullstoryInstance.destinationId).toBe(DESTINATION_ID);
    });
  });

  describe('page', () => {
    let fullstory;
    beforeEach(() => {
      fullstory = new Fullstory(destinationConfig, analyticsInstance, destinationInfo);
    });
    test('should send pageview event', () => {
      fullstory.page({
        message: {
          context: {},
          name: 'test page',
          properties: {
            category: 'test cat',
            path: '/test',
            url: 'http://localhost',
            referrer: '',
            title: 'test page',
            testDimension: 'abc',
          },
        },
      });
      expect(window.FS.event.mock.calls[0]).toEqual([
        'Viewed a Page',
        {
          category: 'test cat',
          name: 'test page',
          path: '/test',
          url: 'http://localhost',
          referrer: '',
          title: 'test page',
          testDimension: 'abc',
        },
      ]);
    });
  });

  describe('Track', () => {
    let fullstory;
    beforeEach(() => {
      fullstory = new Fullstory(destinationConfig, analyticsInstance, destinationInfo);
    });
    test('should fire track event', () => {
      const processedProps = Fullstory.getFSProperties({
        message: {
          context: {},
          event: 'Custom',
          properties: {
            email: 'abc@gmail.com',
            customProp: 'testProp',
            checkout_id: '123456',
          },
        },
      });
      fullstory.track(processedProps);
      expect(window.FS.event.mock.calls[0]).toEqual([
        'Custom',
        {
          customProp: 'testProp',
          checkoutId: '123456',
          email: 'abc@gmail.com',
        },
      ]);
    });
  });

  describe('identify', () => {
    let fullstory;
    beforeEach(() => {
      fullstory = new Fullstory(destinationConfig, analyticsInstance, destinationInfo);
      fullstory.analytics.loadOnlyIntegrations = {};
      window.FS.identify = jest.fn();
    });
    test('should call window.FS.identify with userId when traits are empty', () => {
      const processedTraits = {
        message: {
          userId: '123456',
          context: {
            traits: {},
          },
          anonymousId: '789012',
        },
      };
      fullstory.identify(processedTraits);
      expect(window.FS.identify).toHaveBeenCalledWith('123456');
    });

    test('should handle case when rudderElement.message is missing userId and anonymousId and traits are not empty', () => {
      const processedTraits = {
        message: {
          context: {
            traits: {
              // eslint-disable-next-line sonarjs/no-duplicate-string
              email: 'test@example.com',
              displayName: 'John Doe',
            },
          },
        },
      };
      fullstory.identify(processedTraits);
      expect(window.FS.identify).toHaveBeenCalledWith(undefined, {
        email: 'test@example.com',
        displayName: 'John Doe',
      });
    });

    test('should use anonymousId if userId is not provided', () => {
      const processedTraits = {
        message: {
          context: {
            traits: {
              email: 'test@example.com',
              displayName: 'Test User',
            },
          },
          anonymousId: '789012',
        },
      };
      fullstory.identify(processedTraits);
      expect(window.FS.identify).toHaveBeenCalledWith('789012', {
        email: 'test@example.com',
        displayName: 'Test User',
      });
    });

    test('should convert traits keys to Fullstory compatible format using getFSProperties', () => {
      const processedTraits = {
        message: {
          userId: '123456',
          context: {
            traits: {
              user_email: 'test@example.com',
              user_display_name: 'Test User',
              user_name_str: 'johndoe',
              age_int: 30,
              birth_date_date: '1990-01-01',
              score_real: 95.5,
              is_active_bool: true,
              tags_strs: ['tag1', 'tag2'],
              friends_ints: [1, 2, 3],
              events_dates: ['2023-01-01', '2023-01-02'],
              scores_reals: [90.5, 88.0],
              flags_bools: [true, false],
            },
          },
          anonymousId: '789012',
        },
      };
      fullstory.identify(processedTraits);
      expect(window.FS.identify).toHaveBeenCalledWith('123456', {
        userEmail: 'test@example.com',
        userDisplayName: 'Test User',
        age_int: 30,
        birthDate_date: '1990-01-01',
        events_dates: ['2023-01-01', '2023-01-02'],
        flags_bools: [true, false],
        friends_ints: [1, 2, 3],
        isActive_bool: true,
        score_real: 95.5,
        scores_reals: [90.5, 88],
        tags_strs: ['tag1', 'tag2'],
        userName_str: 'johndoe',
      });
    });
  });
});
