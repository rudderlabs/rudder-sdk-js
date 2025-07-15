import { ScriptLoader } from '@rudderstack/analytics-js-legacy-utilities/ScriptLoader';
import SpotifyPixel from '../../../src/integrations/SpotifyPixel/browser';

// Mock ScriptLoader
jest.mock('@rudderstack/analytics-js-legacy-utilities/ScriptLoader', () => ({
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
      eventsToSpotifyPixelEvents: [
        { from: 'event1', to: 'lead' },
        { from: 'Multi Map', to: 'purchase' },
        { from: 'Multi Map', to: 'checkout' },
      ],
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
      expect(ScriptLoader).toHaveBeenCalledWith(
        'spdt-capture',
        'https://pixel.byspotify.com/ping.min.js',
      );
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
      expect(window.spdt).toHaveBeenCalledWith(
        'view',
        expect.objectContaining({
          url: 'https://example.com',
          referrer: 'https://referrer.com',
          key1: 'value1',
        }),
      );
    });

    it('should send a view event with only properties if page context is not available', () => {
      const rudderElement = {
        message: {
          context: {
            page: {
              url: 'https://example.com',
              referrer: 'https://referrer.com',
            },
          },
        },
      };
      spotifyPixel.page(rudderElement);
      expect(window.spdt).toHaveBeenCalledWith(
        'view',
        expect.objectContaining({ referrer: 'https://referrer.com', url: 'https://example.com' }),
      );
    });
  });
  describe('track', () => {
    // Track a standard event with valid properties
    it('should track order completed event with product array event with valid properties', () => {
      // Mock the necessary dependencies
      const rudderElement = {
        message: {
          event: 'Order Completed',
          properties: {
            total: 100,
            currency: 'USD',
            discount_code: 'DISCOUNT',
            products: [
              {
                product_id: '123',
                name: 'Product A',
                product_type: 'Type A',
                brand: 'Brand A',
              },
              {
                product_id: '456',
                name: 'Product B',
                product_type: 'Type B',
                brand: 'Brand B',
              },
            ],
            order_id: '123456',
            is_new_customer: true,
            quantity: 2,
          },
        },
      };

      // Initialize the SpotifyPixel class object
      const config = {
        pixelId: 'your_pixel_id',
        eventsToSpotifyPixelEvents: [],
        enableAliasCall: true,
      };

      const analytics = {
        logLevel: 'debug',
      };

      const destinationInfo = {
        shouldApplyDeviceModeTransformation: true,
        propagateEventsUntransformedOnError: false,
        destinationId: 'spotify_pixel_destination',
      };

      const spotifyPixel = new SpotifyPixel(config, analytics, destinationInfo);

      // Mock the necessary methods
      spotifyPixel.init = jest.fn();
      spotifyPixel.loadAliasEvent = jest.fn();

      // Invoke the track method
      spotifyPixel.track(rudderElement);

      // Assertions
      expect(spotifyPixel.loadAliasEvent).toHaveBeenCalled();
      expect(window.spdt).toHaveBeenCalledWith('purchase', {
        value: 100,
        currency: 'USD',
        discount_code: 'DISCOUNT',
        line_items: [
          {
            product_id: '123',
            product_name: 'Product A',
            product_type: 'Type A',
            product_vendor: 'Brand A',
            quantity: 2,
          },
          {
            product_id: '456',
            product_name: 'Product B',
            product_type: 'Type B',
            product_vendor: 'Brand B',
            quantity: 2,
          },
        ],
        order_id: '123456',
        is_new_customer: true,
        quantity: 2,
      });
    });

    // Track a custom event with valid properties
    it('should track a custom event with valid properties', () => {
      // Mock the necessary dependencies
      const rudderElement = {
        message: {
          event: 'event1',
          properties: {
            price: 'val',
            type: 'typeVal',
          },
        },
      };

      // Invoke the track method
      spotifyPixel.track(rudderElement);

      // Assertions
      expect(window.spdt).toHaveBeenCalledWith('lead', {
        type: 'typeVal',
        value: 'val',
      });
    });

    // Track multi mapped event with valid properties
    it('should track a custom event with valid properties is mapped with multiple events', () => {
      // Mock the necessary dependencies
      const rudderElement = {
        message: {
          event: 'Multi Map',
          properties: {
            price: 'val',
            type: 'typeVal',
          },
        },
      };

      // Invoke the track method
      spotifyPixel.track(rudderElement);

      // Assertions
      expect(window.spdt).toHaveBeenCalledWith('purchase', {
        line_items: [
          {
            value: 'val',
          },
        ],
      });
      expect(window.spdt).toHaveBeenCalledWith('checkout', {
        line_items: [
          {
            value: 'val',
          },
        ],
      });
    });

    it('should track order completed event with product array and line_items with valid properties', () => {
      // Mock the necessary dependencies
      const rudderElement = {
        message: {
          event: 'Order Completed',
          properties: {
            total: 100,
            currency: 'USD',
            discount_code: 'DISCOUNT',
            products: [
              {
                product_id: '123',
                name: 'Product A',
                product_type: 'Type A',
                brand: 'Brand A',
              },
              {
                product_id: '456',
                name: 'Product B',
                product_type: 'Type B',
                brand: 'Brand B',
              },
            ],
            line_items: [{ product_id: 1, name: 'lineItem' }],
            order_id: '123456',
            is_new_customer: true,
            quantity: 2,
          },
        },
      };

      // Initialize the SpotifyPixel class object
      const config = {
        pixelId: 'your_pixel_id',
        eventsToSpotifyPixelEvents: [],
        enableAliasCall: true,
      };

      const analytics = {
        logLevel: 'debug',
      };

      const destinationInfo = {
        shouldApplyDeviceModeTransformation: true,
        propagateEventsUntransformedOnError: false,
        destinationId: 'spotify_pixel_destination',
      };

      const spotifyPixel = new SpotifyPixel(config, analytics, destinationInfo);

      // Mock the necessary methods
      spotifyPixel.init = jest.fn();
      spotifyPixel.loadAliasEvent = jest.fn();

      // Invoke the track method
      spotifyPixel.track(rudderElement);

      // Assertions
      expect(spotifyPixel.loadAliasEvent).toHaveBeenCalled();
      expect(window.spdt).toHaveBeenCalledWith('purchase', {
        value: 100,
        currency: 'USD',
        discount_code: 'DISCOUNT',
        line_items: [
          {
            name: 'lineItem',
            product_id: 1,
          },
        ],
        order_id: '123456',
        is_new_customer: true,
        quantity: 2,
      });
    });

    it('should track order completed event with only line_items with valid properties', () => {
      // Mock the necessary dependencies
      const rudderElement = {
        message: {
          event: 'Order Completed',
          properties: {
            total: 100,
            currency: 'USD',
            discount_code: 'DISCOUNT',
            line_items: [{ product_id: 1, name: 'lineItem' }],
            order_id: '123456',
            is_new_customer: true,
            quantity: 2,
          },
        },
      };

      // Initialize the SpotifyPixel class object
      const config = {
        pixelId: 'your_pixel_id',
        eventsToSpotifyPixelEvents: [],
        enableAliasCall: true,
      };

      const analytics = {
        logLevel: 'debug',
      };

      const destinationInfo = {
        shouldApplyDeviceModeTransformation: true,
        propagateEventsUntransformedOnError: false,
        destinationId: 'spotify_pixel_destination',
      };

      const spotifyPixel = new SpotifyPixel(config, analytics, destinationInfo);

      // Mock the necessary methods
      spotifyPixel.init = jest.fn();
      spotifyPixel.loadAliasEvent = jest.fn();

      // Invoke the track method
      spotifyPixel.track(rudderElement);

      // Assertions
      expect(spotifyPixel.loadAliasEvent).toHaveBeenCalled();
      expect(window.spdt).toHaveBeenCalledWith('purchase', {
        value: 100,
        currency: 'USD',
        discount_code: 'DISCOUNT',
        line_items: [
          {
            name: 'lineItem',
            product_id: 1,
          },
        ],
        order_id: '123456',
        is_new_customer: true,
        quantity: 2,
      });
    });

    it('should track order completed event without line_items or product array with valid properties', () => {
      // Mock the necessary dependencies
      const rudderElement = {
        message: {
          event: 'Order Completed',
          properties: {
            total: 100,
            currency: 'USD',
            discount_code: 'DISCOUNT',
            order_id: '123456',
            is_new_customer: true,
            quantity: 2,
          },
        },
      };

      // Initialize the SpotifyPixel class object
      const config = {
        pixelId: 'your_pixel_id',
        eventsToSpotifyPixelEvents: [],
        enableAliasCall: true,
      };

      const analytics = {
        logLevel: 'debug',
      };

      const destinationInfo = {
        shouldApplyDeviceModeTransformation: true,
        propagateEventsUntransformedOnError: false,
        destinationId: 'spotify_pixel_destination',
      };

      const spotifyPixel = new SpotifyPixel(config, analytics, destinationInfo);

      // Mock the necessary methods
      spotifyPixel.init = jest.fn();
      spotifyPixel.loadAliasEvent = jest.fn();

      // Invoke the track method
      spotifyPixel.track(rudderElement);

      // Assertions
      expect(spotifyPixel.loadAliasEvent).toHaveBeenCalled();
      expect(window.spdt).toHaveBeenCalledWith('purchase', {
        value: 100,
        currency: 'USD',
        discount_code: 'DISCOUNT',
        line_items: [
          {
            quantity: 2,
          },
        ],
        order_id: '123456',
        is_new_customer: true,
        quantity: 2,
      });
    });

    it('should track a Product Viewed event with valid properties', () => {
      // Mock the necessary dependencies
      const rudderElement = {
        message: {
          event: 'Product Viewed',
          properties: { price: 20, currency: 'USD', brand: 'test', product_id: 1 },
        },
      };

      // Invoke the track method
      spotifyPixel.track(rudderElement);

      // Assertions
      expect(window.spdt).toHaveBeenCalledWith('product', {
        value: 20,
        currency: 'USD',
        product_id: 1,
        product_vendor: 'test',
      });
    });

    it('should track a Product Viewed event with valid properties', () => {
      // Mock the necessary dependencies
      const rudderElement = {
        message: {
          event: 'Checkout Started',
          properties: { price: 20, currency: 'USD', brand: 'test', product_id: 1 },
        },
      };

      // Invoke the track method
      spotifyPixel.track(rudderElement);

      // Assertions
      expect(window.spdt).toHaveBeenCalledWith('checkout', {
        currency: 'USD',
        line_items: [{ value: 20, product_id: 1, product_vendor: 'test' }],
      });
    });

    it('should track checkout started event with product array event with valid properties', () => {
      // Mock the necessary dependencies
      const rudderElement = {
        message: {
          event: 'Checkout Started',
          properties: {
            value: 100,
            currency: 'USD',
            discount_code: 'DISCOUNT',
            products: [
              {
                product_id: '123',
                name: 'Product A',
                product_type: 'Type A',
                brand: 'Brand A',
              },
              {
                product_id: '456',
                name: 'Product B',
                product_type: 'Type B',
                brand: 'Brand B',
              },
            ],
            order_id: '123456',
            is_new_customer: true,
            quantity: 2,
          },
        },
      };

      // Initialize the SpotifyPixel class object
      const config = {
        pixelId: 'your_pixel_id',
        eventsToSpotifyPixelEvents: [],
        enableAliasCall: true,
      };

      const analytics = {
        logLevel: 'debug',
      };

      const destinationInfo = {
        shouldApplyDeviceModeTransformation: true,
        propagateEventsUntransformedOnError: false,
        destinationId: 'spotify_pixel_destination',
      };

      const spotifyPixel = new SpotifyPixel(config, analytics, destinationInfo);

      // Mock the necessary methods
      spotifyPixel.init = jest.fn();
      spotifyPixel.loadAliasEvent = jest.fn();

      // Invoke the track method
      spotifyPixel.track(rudderElement);

      // Assertions
      expect(spotifyPixel.loadAliasEvent).toHaveBeenCalled();
      expect(window.spdt).toHaveBeenCalledWith('checkout', {
        value: 100,
        currency: 'USD',
        discount_code: 'DISCOUNT',
        line_items: [
          {
            product_id: '123',
            product_name: 'Product A',
            product_type: 'Type A',
            product_vendor: 'Brand A',
            quantity: 2,
          },
          {
            product_id: '456',
            product_name: 'Product B',
            product_type: 'Type B',
            product_vendor: 'Brand B',
            quantity: 2,
          },
        ],
        quantity: 2,
      });
    });

    it('should track checkout started event without product array event with valid properties', () => {
      // Mock the necessary dependencies
      const rudderElement = {
        message: {
          event: 'Checkout Started',
          properties: {
            value: 100,
            currency: 'USD',
            discount_code: 'DISCOUNT',
            order_id: '123456',
            is_new_customer: true,
            quantity: 2,
          },
        },
      };

      // Initialize the SpotifyPixel class object
      const config = {
        pixelId: 'your_pixel_id',
        eventsToSpotifyPixelEvents: [],
        enableAliasCall: true,
      };

      const analytics = {
        logLevel: 'debug',
      };

      const destinationInfo = {
        shouldApplyDeviceModeTransformation: true,
        propagateEventsUntransformedOnError: false,
        destinationId: 'spotify_pixel_destination',
      };

      const spotifyPixel = new SpotifyPixel(config, analytics, destinationInfo);

      // Mock the necessary methods
      spotifyPixel.init = jest.fn();
      spotifyPixel.loadAliasEvent = jest.fn();

      // Invoke the track method
      spotifyPixel.track(rudderElement);

      // Assertions
      expect(spotifyPixel.loadAliasEvent).toHaveBeenCalled();
      expect(window.spdt).toHaveBeenCalledWith('checkout', {
        value: 100,
        currency: 'USD',
        discount_code: 'DISCOUNT',
        line_items: [
          {
            quantity: 2,
          },
        ],
        quantity: 2,
      });
    });

    it('should track a Product Added event with valid properties', () => {
      // Mock the necessary dependencies
      const rudderElement = {
        message: {
          event: 'Product Added',
          properties: {
            price: 20,
            currency: 'USD',
            brand: 'test',
            product_id: 1,
            name: 'name of product',
            quantity: 2,
          },
        },
      };

      // Invoke the track method
      spotifyPixel.track(rudderElement);

      // Assertions
      expect(window.spdt).toHaveBeenCalledWith('addtocart', {
        value: 20,
        currency: 'USD',
        product_id: 1,
        product_vendor: 'test',
        product_name: 'name of product',
        quantity: 2,
      });
    });
  });
});
