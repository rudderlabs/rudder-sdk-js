import Gainsight_PX from '../../../src/integrations/Gainsight_PX/browser';
import { loadNativeSdk } from '../../../src/integrations/Gainsight_PX/nativeSdkLoader';
import { getDestinationOptions } from '../../../src/integrations/Gainsight_PX/utils';

// Mock the external dependencies
jest.mock('../../../src/integrations/Gainsight_PX/nativeSdkLoader');
jest.mock('../../../src/integrations/Gainsight_PX/utils');

describe('Gainsight_PX', () => {
  let gainsightPX;
  let mockAnalytics;
  let mockConfig;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock window.aptrinsic
    window.aptrinsic = jest.fn();

    // Mock analytics object
    mockAnalytics = {
      logLevel: 'debug',
      getUserId: jest.fn(),
      getUserTraits: jest.fn(),
      getGroupId: jest.fn(),
      getGroupTraits: jest.fn(),
      loadOnlyIntegrations: {},
    };

    // Mock config
    mockConfig = {
      productTagKey: 'test-product-key',
      dataCenter: 'US',
    };

    gainsightPX = new Gainsight_PX(mockConfig, mockAnalytics);
  });

  describe('init', () => {
    it('should load native SDK and initialize', () => {
      getDestinationOptions.mockReturnValue({ someOption: 'value' });
      mockAnalytics.getUserId.mockReturnValue('test-user-id');
      mockAnalytics.getUserTraits.mockReturnValue({ name: 'Test User' });
      mockAnalytics.getGroupId.mockReturnValue('test-group-id');
      mockAnalytics.getGroupTraits.mockReturnValue({ plan: 'premium' });

      gainsightPX.init();

      expect(loadNativeSdk).toHaveBeenCalledWith('test-product-key', 'US', { someOption: 'value' });
      expect(window.aptrinsic).toHaveBeenCalledWith(
        'identify',
        { id: 'test-user-id', name: 'Test User' },
        { id: 'test-group-id', plan: 'premium' },
      );
    });

    it('should not call identify if user ID is not present', () => {
      mockAnalytics.getUserId.mockReturnValue(null);

      gainsightPX.init();

      expect(loadNativeSdk).toHaveBeenCalled();
      expect(window.aptrinsic).not.toHaveBeenCalled();
    });
  });

  describe('isLoaded', () => {
    it('should return true when window.aptrinsic and window.aptrinsic.init exist', () => {
      window.aptrinsic = { init: jest.fn() };
      expect(gainsightPX.isLoaded()).toBe(true);
    });

    it('should return false when window.aptrinsic does not exist', () => {
      delete window.aptrinsic;
      expect(gainsightPX.isLoaded()).toBe(false);
    });

    it('should return false when window.aptrinsic exists but init is missing', () => {
      window.aptrinsic = {};
      expect(gainsightPX.isLoaded()).toBe(false);
    });
  });

  describe('isReady', () => {
    it('should return the same value as isLoaded', () => {
      window.aptrinsic = { init: jest.fn() };
      expect(gainsightPX.isReady()).toBe(gainsightPX.isLoaded());

      delete window.aptrinsic;
      expect(gainsightPX.isReady()).toBe(gainsightPX.isLoaded());
    });
  });

  describe('identify', () => {
    it('should call aptrinsic identify with user data', () => {
      const rudderElement = {
        message: {
          userId: 'test-user-id',
          context: {
            traits: { name: 'Test User', email: 'test@example.com' },
          },
        },
      };

      gainsightPX.identify(rudderElement);

      expect(window.aptrinsic).toHaveBeenCalledWith(
        'identify',
        { id: 'test-user-id', name: 'Test User', email: 'test@example.com' },
        {},
      );
    });

    it('should not call aptrinsic identify if userId is missing', () => {
      const rudderElement = {
        message: {
          context: {
            traits: { name: 'Test User' },
          },
        },
      };

      gainsightPX.identify(rudderElement);

      expect(window.aptrinsic).not.toHaveBeenCalled();
    });

    test('Testing identify call with ID only', () => {
      // call RudderStack function
      gainsightPX.identify({
        message: {
          userId: 'rudder01',
          context: {},
        },
      });

      // Confirm that it was translated to the appropriate PX call
      expect(window.aptrinsic.mock.calls[0]).toEqual([
        'identify',
        {
          id: 'rudder01',
        },
        {},
      ]);
    });
  });

  describe('group', () => {
    it('should call aptrinsic identify with group data', () => {
      const rudderElement = {
        message: {
          userId: 'test-user-id',
          groupId: 'test-group-id',
          traits: { plan: 'premium' },
          context: {
            traits: { name: 'Test User' },
          },
        },
      };

      gainsightPX.group(rudderElement);

      expect(window.aptrinsic).toHaveBeenCalledWith(
        'identify',
        { id: 'test-user-id', name: 'Test User' },
        { id: 'test-group-id', plan: 'premium' },
      );
    });

    it('should use anonymousId if groupId is not present', () => {
      const rudderElement = {
        message: {
          anonymousId: 'anon-id',
          traits: { plan: 'basic' },
        },
      };

      gainsightPX.group(rudderElement);

      expect(window.aptrinsic).toHaveBeenCalledWith(
        'identify',
        {},
        { id: 'anon-id', plan: 'basic' },
      );
    });
  });

  describe('track', () => {
    it('should call aptrinsic track with event data', () => {
      const rudderElement = {
        message: {
          event: 'Test Event',
          properties: { category: 'test', value: 10 },
        },
      };

      gainsightPX.track(rudderElement);

      expect(window.aptrinsic).toHaveBeenCalledWith('track', 'Test Event', {
        category: 'test',
        value: 10,
      });
    });

    it('should not call aptrinsic track if event name is missing', () => {
      const rudderElement = {
        message: {
          properties: { category: 'test' },
        },
      };

      gainsightPX.track(rudderElement);

      expect(window.aptrinsic).not.toHaveBeenCalled();
    });

    test('Test for empty properties', () => {
      // call RudderStack function
      gainsightPX.track({
        message: {
          context: {},
          event: 'event-name',
          properties: {},
        },
      });

      // Confirm that it was translated to the appropriate PX call
      expect(window.aptrinsic.mock.calls[0]).toEqual(['track', 'event-name', {}]);
    });
  });
});
