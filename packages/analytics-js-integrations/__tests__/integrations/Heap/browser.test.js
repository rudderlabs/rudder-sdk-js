import Heap from '../../../src/integrations/Heap/browser';
import processHeapProperties from '../../../src/integrations/Heap/util';

// Mock the logger to avoid dependency issues
jest.mock('../../../src/utils/logger', () => {
  return jest.fn().mockImplementation(() => ({
    error: jest.fn(),
    setLogLevel: jest.fn(),
  }));
});

// Mock the nativeSdkLoader
jest.mock('../../../src/integrations/Heap/nativeSdkLoader', () => ({
  loadNativeSdk: jest.fn(),
}));

// Mock the util function
jest.mock('../../../src/integrations/Heap/util', () => ({
  __esModule: true,
  default: jest.fn((properties) => properties),
}));

// Setup browser environment
beforeAll(() => {
  // Mock window object
  global.window = {
    heap: undefined,
  };
});

afterAll(() => {
  // Clean up
  delete global.window;
  jest.restoreAllMocks();
});

describe('Heap Integration', () => {
  let heap;
  let mockAnalytics;

  beforeEach(() => {
    // Mock analytics object
    mockAnalytics = {
      logLevel: 'ERROR',
    };

    // Reset window.heap before each test
    window.heap = undefined;

    // Create Heap instance
    heap = new Heap(
      { appId: 'test-app-id' },
      mockAnalytics,
      {
        shouldApplyDeviceModeTransformation: false,
        propagateEventsUntransformedOnError: false,
        destinationId: 'test-destination-id',
      }
    );
  });

  describe('constructor', () => {
    it('should initialize with correct properties', () => {
      expect(heap.analytics).toBe(mockAnalytics);
      expect(heap.appId).toBe('test-app-id');
      expect(heap.name).toBe('HEAP');
      expect(heap.shouldApplyDeviceModeTransformation).toBe(false);
      expect(heap.propagateEventsUntransformedOnError).toBe(false);
      expect(heap.destinationId).toBe('test-destination-id');
    });

    it('should handle missing destinationInfo', () => {
      const heapWithoutDestinationInfo = new Heap(
        { appId: 'test-app-id' },
        mockAnalytics
      );

      expect(heapWithoutDestinationInfo.analytics).toBe(mockAnalytics);
      expect(heapWithoutDestinationInfo.appId).toBe('test-app-id');
      expect(heapWithoutDestinationInfo.name).toBe('HEAP');
      expect(heapWithoutDestinationInfo.shouldApplyDeviceModeTransformation).toBeUndefined();
      expect(heapWithoutDestinationInfo.propagateEventsUntransformedOnError).toBeUndefined();
      expect(heapWithoutDestinationInfo.destinationId).toBeUndefined();
    });

    it('should handle analytics without logLevel', () => {
      const analyticsWithoutLogLevel = {};
      const heapWithoutLogLevel = new Heap(
        { appId: 'test-app-id' },
        analyticsWithoutLogLevel,
        {
          shouldApplyDeviceModeTransformation: false,
          propagateEventsUntransformedOnError: false,
          destinationId: 'test-destination-id',
        }
      );

      expect(heapWithoutLogLevel.analytics).toBe(analyticsWithoutLogLevel);
      expect(heapWithoutLogLevel.appId).toBe('test-app-id');
      expect(heapWithoutLogLevel.name).toBe('HEAP');
    });
  });

  describe('init', () => {
    it('should call loadNativeSdk with appId', () => {
      const { loadNativeSdk } = require('../../../src/integrations/Heap/nativeSdkLoader');
      
      heap.init();
      expect(loadNativeSdk).toHaveBeenCalledWith('test-app-id');
    });
  });

  describe('isLoaded', () => {
    it('should return false when window.heap is not available', () => {
      expect(heap.isLoaded()).toBe(false);
    });

    it('should return false when window.heap.appid is not available', () => {
      window.heap = {};
      expect(heap.isLoaded()).toBe(false);
    });

    it('should return false when required functions are not available', () => {
      window.heap = { appid: 'test-app-id' };
      expect(heap.isLoaded()).toBe(false);
    });

    it('should return false when only some required functions are available', () => {
      window.heap = {
        appid: 'test-app-id',
        track: jest.fn(),
        identify: jest.fn(),
        // Missing addUserProperties
      };
      expect(heap.isLoaded()).toBe(false);
    });

    it('should return true when all required functions are available', () => {
      window.heap = {
        appid: 'test-app-id',
        track: jest.fn(),
        identify: jest.fn(),
        addUserProperties: jest.fn(),
      };
      expect(heap.isLoaded()).toBe(true);
    });
  });

  describe('isReady', () => {
    it('should return the same value as isLoaded', () => {
      // When not loaded
      expect(heap.isReady()).toBe(heap.isLoaded());

      // When loaded
      window.heap = {
        appid: 'test-app-id',
        track: jest.fn(),
        identify: jest.fn(),
        addUserProperties: jest.fn(),
      };
      expect(heap.isReady()).toBe(heap.isLoaded());
    });
  });

  describe('track', () => {
    it('should throw when SDK is not loaded', () => {
      const rudderElement = {
        message: {
          event: 'test_event',
          properties: { test: 'value' },
        },
      };

      expect(() => heap.track(rudderElement)).toThrow('Cannot read properties of undefined (reading \'track\')');
    });

    it('should call window.heap.track when SDK is loaded', () => {
      const mockTrack = jest.fn();
      window.heap = {
        appid: 'test-app-id',
        track: mockTrack,
        identify: jest.fn(),
        addUserProperties: jest.fn(),
      };

      const rudderElement = {
        message: {
          event: 'test_event',
          properties: { test: 'value' },
        },
      };

      heap.track(rudderElement);

      expect(processHeapProperties).toHaveBeenCalledWith({ test: 'value' });
      expect(mockTrack).toHaveBeenCalledWith('test_event', { test: 'value' });
    });

    it('should throw when track call fails', () => {
      const mockTrack = jest.fn().mockImplementation(() => {
        throw new Error('Track failed');
      });

      window.heap = {
        appid: 'test-app-id',
        track: mockTrack,
        identify: jest.fn(),
        addUserProperties: jest.fn(),
      };

      const rudderElement = {
        message: {
          event: 'test_event',
          properties: { test: 'value' },
        },
      };

      expect(() => heap.track(rudderElement)).toThrow('Track failed');
    });

    it('should handle undefined properties', () => {
      const mockTrack = jest.fn();
      window.heap = {
        appid: 'test-app-id',
        track: mockTrack,
        identify: jest.fn(),
        addUserProperties: jest.fn(),
      };

      const rudderElement = {
        message: {
          event: 'test_event',
          // properties is undefined
        },
      };

      heap.track(rudderElement);

      expect(mockTrack).toHaveBeenCalledWith('test_event', undefined);
    });

    it('should handle null properties', () => {
      const mockTrack = jest.fn();
      window.heap = {
        appid: 'test-app-id',
        track: mockTrack,
        identify: jest.fn(),
        addUserProperties: jest.fn(),
      };

      const rudderElement = {
        message: {
          event: 'test_event',
          properties: null,
        },
      };

      heap.track(rudderElement);

      expect(mockTrack).toHaveBeenCalledWith('test_event', null);
    });

    it('should handle empty properties object', () => {
      const mockTrack = jest.fn();
      window.heap = {
        appid: 'test-app-id',
        track: mockTrack,
        identify: jest.fn(),
        addUserProperties: jest.fn(),
      };

      const rudderElement = {
        message: {
          event: 'test_event',
          properties: {},
        },
      };

      heap.track(rudderElement);

      expect(mockTrack).toHaveBeenCalledWith('test_event', {});
    });
  });

  describe('identify', () => {
    it('should throw when SDK is not loaded', () => {
      const rudderElement = {
        message: {
          userId: 'test-user',
          context: { traits: { name: 'Test User' } },
        },
      };

      expect(() => heap.identify(rudderElement)).toThrow('Cannot read properties of undefined (reading \'identify\')');
    });

    it('should call window.heap.identify and addUserProperties when SDK is loaded', () => {
      const mockIdentify = jest.fn();
      const mockAddUserProperties = jest.fn();

      window.heap = {
        appid: 'test-app-id',
        track: jest.fn(),
        identify: mockIdentify,
        addUserProperties: mockAddUserProperties,
      };

      const rudderElement = {
        message: {
          userId: 'test-user',
          context: { traits: { name: 'Test User' } },
        },
      };

      heap.identify(rudderElement);

      expect(mockIdentify).toHaveBeenCalledWith('test-user');
      expect(processHeapProperties).toHaveBeenCalledWith({ name: 'Test User' });
      expect(mockAddUserProperties).toHaveBeenCalledWith({ name: 'Test User' });
    });

    it('should throw when identify call fails', () => {
      const mockIdentify = jest.fn().mockImplementation(() => {
        throw new Error('Identify failed');
      });

      window.heap = {
        appid: 'test-app-id',
        track: jest.fn(),
        identify: mockIdentify,
        addUserProperties: jest.fn(),
      };

      const rudderElement = {
        message: {
          userId: 'test-user',
          context: { traits: { name: 'Test User' } },
        },
      };

      expect(() => heap.identify(rudderElement)).toThrow('Identify failed');
    });

    it('should handle missing userId', () => {
      const mockIdentify = jest.fn();
      const mockAddUserProperties = jest.fn();

      window.heap = {
        appid: 'test-app-id',
        track: jest.fn(),
        identify: mockIdentify,
        addUserProperties: mockAddUserProperties,
      };

      const rudderElement = {
        message: {
          // userId is missing
          context: { traits: { name: 'Test User' } },
        },
      };

      heap.identify(rudderElement);

      expect(mockIdentify).not.toHaveBeenCalled();
      expect(mockAddUserProperties).toHaveBeenCalledWith({ name: 'Test User' });
    });

    it('should handle missing context.traits', () => {
      const mockIdentify = jest.fn();
      const mockAddUserProperties = jest.fn();

      window.heap = {
        appid: 'test-app-id',
        track: jest.fn(),
        identify: mockIdentify,
        addUserProperties: mockAddUserProperties,
      };

      const rudderElement = {
        message: {
          userId: 'test-user',
          context: {}, // traits is missing
        },
      };

      heap.identify(rudderElement);

      expect(mockIdentify).toHaveBeenCalledWith('test-user');
      expect(mockAddUserProperties).toHaveBeenCalledWith(undefined);
    });

    it('should not call identify with empty userId', () => {
      const mockIdentify = jest.fn();
      const mockAddUserProperties = jest.fn();

      window.heap = {
        appid: 'test-app-id',
        track: jest.fn(),
        identify: mockIdentify,
        addUserProperties: mockAddUserProperties,
      };

      const rudderElement = {
        message: {
          userId: '',
          context: { traits: { name: 'Test User' } },
        },
      };

      heap.identify(rudderElement);

      expect(mockIdentify).not.toHaveBeenCalled();
      expect(mockAddUserProperties).toHaveBeenCalledWith({ name: 'Test User' });
    });

    it('should not call identify with null userId', () => {
      const mockIdentify = jest.fn();
      const mockAddUserProperties = jest.fn();

      window.heap = {
        appid: 'test-app-id',
        track: jest.fn(),
        identify: mockIdentify,
        addUserProperties: mockAddUserProperties,
      };

      const rudderElement = {
        message: {
          userId: null,
          context: { traits: { name: 'Test User' } },
        },
      };

      heap.identify(rudderElement);

      expect(mockIdentify).not.toHaveBeenCalled();
      expect(mockAddUserProperties).toHaveBeenCalledWith({ name: 'Test User' });
    });

    it('should not call identify with undefined userId', () => {
      const mockIdentify = jest.fn();
      const mockAddUserProperties = jest.fn();

      window.heap = {
        appid: 'test-app-id',
        track: jest.fn(),
        identify: mockIdentify,
        addUserProperties: mockAddUserProperties,
      };

      const rudderElement = {
        message: {
          // userId is undefined
          context: { traits: { name: 'Test User' } },
        },
      };

      heap.identify(rudderElement);

      expect(mockIdentify).not.toHaveBeenCalled();
      expect(mockAddUserProperties).toHaveBeenCalledWith({ name: 'Test User' });
    });

    it('should handle empty traits object', () => {
      const mockIdentify = jest.fn();
      const mockAddUserProperties = jest.fn();

      window.heap = {
        appid: 'test-app-id',
        track: jest.fn(),
        identify: mockIdentify,
        addUserProperties: mockAddUserProperties,
      };

      const rudderElement = {
        message: {
          userId: 'test-user',
          context: { traits: {} },
        },
      };

      heap.identify(rudderElement);

      expect(mockIdentify).toHaveBeenCalledWith('test-user');
      expect(mockAddUserProperties).toHaveBeenCalledWith({});
    });

    it('should handle null traits', () => {
      const mockIdentify = jest.fn();
      const mockAddUserProperties = jest.fn();

      window.heap = {
        appid: 'test-app-id',
        track: jest.fn(),
        identify: mockIdentify,
        addUserProperties: mockAddUserProperties,
      };

      const rudderElement = {
        message: {
          userId: 'test-user',
          context: { traits: null },
        },
      };

      heap.identify(rudderElement);

      expect(mockIdentify).toHaveBeenCalledWith('test-user');
      expect(mockAddUserProperties).toHaveBeenCalledWith(null);
    });
  });
});