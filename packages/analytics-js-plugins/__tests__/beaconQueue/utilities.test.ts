import { getDeliveryUrl } from '../../src/beaconQueue/utilities';

describe('beaconQueue Plugin Utilities', () => {
  describe('getDeliveryUrl', () => {
    it('should return delivery url if valid dataplane url and write key are provided', () => {
      const deliveryUrl = getDeliveryUrl('https://test.com/some/path', '1a2b3c');

      expect(deliveryUrl).toEqual('https://test.com/some/path/beacon/v1/batch?writeKey=1a2b3c');
    });

    it('should percent encode a write key that carries url reserved characters', () => {
      // Constructing the url by hand means nothing normalises the query string any
      // more, so a reserved character would otherwise end the writeKey parameter
      // early: '#' starts a fragment and '&' starts the next parameter.
      const deliveryUrl = getDeliveryUrl('https://test.com/some/path', 'a#b&c=d e');

      expect(deliveryUrl).toEqual(
        'https://test.com/some/path/beacon/v1/batch?writeKey=a%23b%26c%3Dd%20e',
      );
    });

    it('should return delivery url if the page has replaced the global URL constructor', () => {
      const originalURL = globalThis.URL;
      // Pages can define a global URL of their own, which shadows window.URL long
      // after the capability detection determined that the constructor is usable.
      (globalThis as any).URL = '/Acquisto/ShoppingCart';

      try {
        const deliveryUrl = getDeliveryUrl('https://test.com/some/path', '1a2b3c');

        expect(deliveryUrl).toEqual('https://test.com/some/path/beacon/v1/batch?writeKey=1a2b3c');
      } finally {
        globalThis.URL = originalURL;
      }
    });

    it('should return delivery url if the page has replaced the global URL constructor with a callable', () => {
      const originalURL = globalThis.URL;
      // A callable replacement passes the isFunction guard, but what it constructs
      // carries neither an origin nor a pathname.
      (globalThis as any).URL = function URLStub() {
        return { toString: () => '/Acquisto/ShoppingCart' };
      };

      try {
        const deliveryUrl = getDeliveryUrl('https://test.com/some/path', '1a2b3c');

        expect(deliveryUrl).toEqual('https://test.com/some/path/beacon/v1/batch?writeKey=1a2b3c');
      } finally {
        globalThis.URL = originalURL;
      }
    });

    it('should return delivery url if the global URL constructor throws', () => {
      const originalURL = globalThis.URL;
      (globalThis as any).URL = class {
        constructor() {
          throw new TypeError('URL is not a constructor');
        }
      };

      try {
        const deliveryUrl = getDeliveryUrl('https://test.com/some/path', '1a2b3c');

        expect(deliveryUrl).toEqual('https://test.com/some/path/beacon/v1/batch?writeKey=1a2b3c');
      } finally {
        globalThis.URL = originalURL;
      }
    });
  });
});
