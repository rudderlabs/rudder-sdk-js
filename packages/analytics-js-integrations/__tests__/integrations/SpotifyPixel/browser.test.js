import SpotifyPixel from '../../../src/integrations/SpotifyPixel/browser';
import { ScriptLoader } from '@rudderstack/analytics-js-common/v1.1/utils/ScriptLoader';

// Mock ScriptLoader
jest.mock('@rudderstack/analytics-js-common/v1.1/utils/ScriptLoader', () => ({
  ScriptLoader: jest.fn(),
}));

describe('SpotifyPixel', () => {
  let spotifyPixel;

  beforeEach(() => {
    // Mock window.spdt
    window.spdt = jest.fn();
    // Reset ScriptLoader mock implementation
    ScriptLoader.mockReset();
    // Initialize SpotifyPixel instance
    const config = {
      pixelId: 'your-pixel-id',
      eventsToSpotifyPixelEvents: [{ from: 'event1', to: 'customEvent1' }],
      enableAliasCall: true,
    };
    const analytics = {};
    const destinationInfo = {
          areTransformationsConnected: false,
          destinationId: 'sample-destination-id',
        };
    spotifyPixel = new SpotifyPixel(config, analytics, destinationInfo);
  });

  describe('init', () => {
    it('should initialize SpotifyPixel and load script', () => {
      spotifyPixel.init();
      expect(ScriptLoader).toHaveBeenCalledWith('spdt-capture', 'https://pixel.byspotify.com/ping.min.js');
      expect(window.spdt).toHaveBeenCalledWith('conf', { key: 'your-pixel-id' });
    });
  });

  describe('isLoaded', () => {
    it('should return true if window.spdt is a function', () => {
      expect(spotifyPixel.isLoaded()).toBe(true);
    });

    it('should return false if window.spdt is not a function', () => {
      window.spdt = null;
      expect(spotifyPixel.isLoaded()).toBe(false);
    });
  });

  describe('isReady', () => {
    it('should return true if SpotifyPixel is loaded', () => {
      expect(spotifyPixel.isReady()).toBe(true);
    });
  });

  describe('loadAliasEvent', () => {
    it('should call window.spdt with alias event if enableAliasCall is true and externalId is provided', () => {
      spotifyPixel.loadAliasEvent('someExternalId');
      expect(window.spdt).toHaveBeenCalledWith('alias', { id: expect.any(String) });
    });

    it('should not call window.spdt if enableAliasCall is false', () => {
      spotifyPixel.enableAliasCall = false;
      spotifyPixel.loadAliasEvent('someExternalId');
      expect(window.spdt).not.toHaveBeenCalled();
    });

    it('should not call window.spdt if externalId is not provided', () => {
      spotifyPixel.loadAliasEvent(null);
      expect(window.spdt).not.toHaveBeenCalled();
    });
  });
  describe('page', () => {
    it('should send a view event with page properties', () => {
      const rudderElement = {
        message: {
          context: {
            page: {
              url: 'https://example.com',
              referrer: 'https://referrer.com',
            },
          },
          properties: { key1: 'value1' },
        },
      };
      spotifyPixel.page(rudderElement);
      expect(window.spdt).toHaveBeenCalledWith('view', expect.objectContaining({
        url: 'https://example.com',
        referrer: 'https://referrer.com',
        key1: 'value1',
      }));
    });

    it('should send a view event with only properties if page context is not available', () => {
      const rudderElement = {
        message: {
            context: {
              page: {
                url: 'https://example.com',
                referrer: 'https://referrer.com',
              },
            }
          },
      };
      spotifyPixel.page(rudderElement);
      expect(window.spdt).toHaveBeenCalledWith('view', expect.objectContaining({"referrer": "https://referrer.com", "url": "https://example.com"}));
    });
  });

});
