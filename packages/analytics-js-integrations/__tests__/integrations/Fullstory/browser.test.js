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

  delete global.window; // Ensure we start clean on each test
  global.window = {
    localStorage: {
      getItem: jest.fn((key) => {
        if (key === 'tata_customer_hash') return 'hash123';
        return null;
      }),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    },
    FS: {
      event: jest.fn(),
      identify: jest.fn(),
      restart: jest.fn(),
      shutdown: jest.fn(),
      setUserVars: jest.fn(),
      log: jest.fn(),
      init: jest.fn(),
    },
    _fs_namespace: 'FS',
    _fs_identity: jest.fn().mockImplementation(() => {
      console.log("Mock _fs_identity called");
    }),
  };
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

const destinationConfig = { fs_org: '12567839', fs_debug_mode: true, fs_host: 'localhost' }

afterEach(() => {
  document.getElementById('dummyScript')?.remove();
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

    test('init call of FullStory', () => {
      fullstory.init();
      expect(typeof window.FS).toBe('object');
    });

    test('should call loadNativeSdk with correct parameters', () => {
      fullstory.init();
      expect(loadNativeSdk).toHaveBeenCalledWith(fullstory.fs_debug_mode, fullstory.fs_host, fullstory.fs_org);
    });

    test('should handle cross-domain support correctly', () => {
      getDestinationOptions.mockReturnValue({
        crossDomainSupport: true,
        timeout: 3000
      });
      fullstory.init();
      // eslint-disable-next-line no-underscore-dangle
      expect(window._fs_identity).toBeDefined();
    });

    test('should initialize with crossDomainSupport and execute identity logic', () => {
      fullstory.init();
      jest.advanceTimersByTime(5000);
      // eslint-disable-next-line no-underscore-dangle
      expect(window._fs_identity).toHaveBeenCalled();
      expect(window.localStorage.getItem).toHaveBeenCalledWith('dummy');
      expect(window.FS.setUserVars).toHaveBeenCalledWith({
        uid: 'hash123',
        displayName: 'hash123'
      });
      expect(window.FS.restart).toHaveBeenCalled();
      expect(window.FS.shutdown).toHaveBeenCalled();
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
      const fullstoryInstance = new Fullstory(destinationConfig, analyticsInstance, destinationInfo);

      expect(fullstoryInstance.fs_org).toBe('12567839');
      expect(fullstoryInstance.fs_debug_mode).toBe(true);
      expect(fullstoryInstance.fs_host).toBe('localhost');
      expect(fullstoryInstance.name).toBeDefined();
      expect(fullstoryInstance.analytics).toEqual(analyticsInstance);
      expect(fullstoryInstance.destinationId).toBe(DESTINATION_ID);
    });
    it('should properly initialize even when fs_host is not set ', () => {
      const fullstoryInstance = new Fullstory({ ...destinationConfig, fs_host: undefined },
        analyticsInstance,
        destinationInfo);

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
      fullstory = new Fullstory(
        destinationConfig,
        analyticsInstance,
        destinationInfo
      );
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
      fullstory.track({
        message: {
          context: {},
          event: 'Custom',
          properties: {
            customProp: 'testProp',
            checkout_id: '123456',
          },
        },
      });
      expect(window.FS.event.mock.calls[0]).toEqual([
        'Custom',
        {
          customProp: 'testProp',
          checkoutId: '123456',
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
    test('should send identify call', () => {
      fullstory.identify({
        message: {
          userId: 'rudder01',
          context: {
            traits: {
              email: 'abc@ruddertack.com',
            },
          },
        },
      });
      expect(window.FS.identify.mock.calls[0][0]).toEqual('rudder01');
      expect(window.FS.identify.mock.calls[0][1]).toEqual({
        email: 'abc@ruddertack.com',
      });
    })
  });
});
