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
        { id: 'test-group-id', plan: 'premium' }
      );
    });

    it('should not call identify if user ID is not present', () => {
      mockAnalytics.getUserId.mockReturnValue(null);

      gainsightPX.init();

      expect(loadNativeSdk).toHaveBeenCalled();
      expect(window.aptrinsic).not.toHaveBeenCalled();
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
        {}
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
        { id: 'test-group-id', plan: 'premium' }
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
        { id: 'anon-id', plan: 'basic' }
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

      expect(window.aptrinsic).toHaveBeenCalledWith(
        'track',
        'Test Event',
        { category: 'test', value: 10 }
      );
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
  });
});