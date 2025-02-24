import GoogleTagManager from '../../../src/integrations/GoogleTagManager/browser';
import { loadNativeSdk } from '../../../src/integrations/GoogleTagManager/nativeSdkLoader';

jest.mock('../../../src/integrations/GoogleTagManager/nativeSdkLoader', () => ({
  loadNativeSdk: jest.fn(),
}));

const commonTraits = {
  name: 'John Doe',
  email: 'john@example.com',
};

describe('GoogleTagManager', () => {
  let googleTagManager;
  const config = {
    containerID: 'DUMMY_CONTAINER_ID',
    serverUrl: 'DUMMY_SERVER_URL',
    environmentID: 'env-2',
    authorizationToken: 'random',
  };
  const analytics = {
    logLevel: 'debug',
  };
  const destinationInfo = {
    shouldApplyDeviceModeTransformation: true,
    propagateEventsUntransformedOnError: false,
    destinationId: 'DUMMY_DESTINATION_ID',
  };

  beforeEach(() => {
    googleTagManager = new GoogleTagManager(config, analytics, destinationInfo);
    window.dataLayer = [];
  });

  describe('constructor', () => {
    it('should set instance properties correctly', () => {
      expect(googleTagManager.analytics).toEqual(analytics);
      expect(googleTagManager.containerID).toEqual(config.containerID);
      expect(googleTagManager.serverUrl).toEqual(config.serverUrl);
      expect(googleTagManager.environmentID).toEqual(config.environmentID);
      expect(googleTagManager.authorizationToken).toEqual(config.authorizationToken);
      expect(googleTagManager.shouldApplyDeviceModeTransformation).toEqual(true);
      expect(googleTagManager.propagateEventsUntransformedOnError).toEqual(false);
      expect(googleTagManager.destinationId).toEqual(destinationInfo.destinationId);
    });
  });

  describe('init', () => {
    it('should call loadNativeSdk with containerID and serverUrl', () => {
      googleTagManager.init();
      expect(loadNativeSdk).toHaveBeenCalledWith(
        config.containerID,
        config.serverUrl,
        config.environmentID,
        config.authorizationToken,
      );
    });
  });

  describe('isLoaded', () => {
    it('should return true if dataLayer is loaded', () => {
      // Mock the push method to simulate that dataLayer is loaded
      window.dataLayer = [];
      window.dataLayer.push = function () {}; // Replace native push with a dummy function
      expect(googleTagManager.isLoaded()).toBe(true);
    });

    it('should return false if dataLayer is not loaded', () => {
      delete window.dataLayer;
      expect(googleTagManager.isLoaded()).toBe(false);
    });
  });

  describe('isReady', () => {
    it('should return the same result as isLoaded', () => {
      const isLoadedSpy = jest.spyOn(googleTagManager, 'isLoaded').mockReturnValue(true);
      expect(googleTagManager.isReady()).toBe(true);
      isLoadedSpy.mockReturnValue(false);
      expect(googleTagManager.isReady()).toBe(false);
    });
  });

  describe('identify', () => {
    it('should send traits to dataLayer', () => {
      const rudderElement = {
        message: {
          context: {
            traits: commonTraits,
          },
        },
      };
      googleTagManager.identify(rudderElement);
      expect(window.dataLayer[0]).toEqual({ traits: rudderElement.message.context.traits });
    });
  });

  describe('track', () => {
    it('should send track event to dataLayer', () => {
      const rudderElement = {
        message: {
          event: 'Clicked Button',
          userId: 'user123',
          anonymousId: 'anon456',
          context: {
            traits: commonTraits,
          },
          properties: {
            buttonType: 'primary',
          },
          messageId: '123456789',
        },
      };
      googleTagManager.track(rudderElement);
      const expectedProps = {
        event: rudderElement.message.event,
        userId: rudderElement.message.userId,
        anonymousId: rudderElement.message.anonymousId,
        traits: rudderElement.message.context.traits,
        buttonType: 'primary',
        messageId: rudderElement.message.messageId,
      };
      expect(window.dataLayer[0]).toEqual(expectedProps);
    });
  });

  describe('page', () => {
    it('should send page view event to dataLayer', () => {
      const rudderElement = {
        message: {
          name: 'Homepage',
          userId: 'user123',
          anonymousId: 'anon456',
          context: {
            traits: commonTraits,
          },
          properties: {
            category: 'landing',
          },
          messageId: '987654321',
        },
      };
      googleTagManager.page(rudderElement);
      const expectedProps = {
        event: 'Viewed landing Homepage page',
        userId: rudderElement.message.userId,
        anonymousId: rudderElement.message.anonymousId,
        traits: rudderElement.message.context.traits,
        category: 'landing',
        messageId: rudderElement.message.messageId,
      };
      expect(window.dataLayer[0]).toEqual(expectedProps);
    });

    it('should default to "Viewed a Page" event if no page name or category provided', () => {
      const rudderElement = {
        message: {
          userId: 'user123',
          anonymousId: 'anon456',
          context: {
            traits: commonTraits,
          },
          messageId: '987654321',
        },
      };
      googleTagManager.page(rudderElement);
      const expectedProps = {
        event: 'Viewed a Page',
        userId: rudderElement.message.userId,
        anonymousId: rudderElement.message.anonymousId,
        traits: rudderElement.message.context.traits,
        messageId: rudderElement.message.messageId,
      };
      expect(window.dataLayer[0]).toEqual(expectedProps);
    });
  });
});
