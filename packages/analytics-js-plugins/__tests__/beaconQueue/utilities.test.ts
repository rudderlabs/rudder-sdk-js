import { getDeliveryUrl } from '../../src/beaconQueue/utilities';

describe('beaconQueue Plugin Utilities', () => {
  describe('getDeliveryUrl', () => {
    it('should return delivery url if valid dataplane url and write key are provided', () => {
      const deliveryUrl = getDeliveryUrl('https://test.com/some/path', '1a2b3c');

      expect(deliveryUrl).toEqual('https://test.com/some/path/beacon/v1/batch?writeKey=1a2b3c');
    });

    it('should percent encode a write key that carries url reserved characters', () => {
      // Unencoded, '#' starts a fragment and '&' the next parameter, so the key is truncated.
      const deliveryUrl = getDeliveryUrl('https://test.com/some/path', 'a#b&c=d e');

      expect(deliveryUrl).toEqual(
        'https://test.com/some/path/beacon/v1/batch?writeKey=a%23b%26c%3Dd%20e',
      );
    });

    it('should not throw for a write key that encodeURIComponent cannot encode', () => {
      // Write key validation only checks for a non-empty string, so a lone surrogate gets here.
      let deliveryUrl;
      expect(() => {
        deliveryUrl = getDeliveryUrl('https://test.com/some/path', '\uD800');
      }).not.toThrow();

      expect(deliveryUrl).toEqual('https://test.com/some/path/beacon/v1/batch?writeKey=%EF%BF%BD');
    });

    it('should encode reserved characters in a write key that also carries a lone surrogate', () => {
      let deliveryUrl;
      expect(() => {
        deliveryUrl = getDeliveryUrl('https://test.com/some/path', 'a#b&c\uD800');
      }).not.toThrow();

      expect(deliveryUrl).toEqual(
        'https://test.com/some/path/beacon/v1/batch?writeKey=a%23b%26c%EF%BF%BD',
      );
      // A surviving '#' would make the dataplane see a write key of 'a'.
      expect(deliveryUrl).not.toMatch(/[#&]/);
    });

    it('should preserve a write key that carries a valid surrogate pair', () => {
      const deliveryUrl = getDeliveryUrl('https://test.com/some/path', 'a\uD83D\uDE00');

      expect(deliveryUrl).toEqual(
        'https://test.com/some/path/beacon/v1/batch?writeKey=a%F0%9F%98%80',
      );
    });
  });
});
