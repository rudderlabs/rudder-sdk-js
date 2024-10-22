import { GoogleAds } from '.';

describe('Google Ads', () => {
  describe('isLoaded', () => {
    it('should return false if when init is not called', () => {
      const googleAds = new GoogleAds({}, {}, {});
      expect(googleAds.isLoaded()).toBe(false);
    });
  });
  describe('isReady', () => {
    it('should return false if when init is not called', () => {
      const googleAds = new GoogleAds({}, {}, {});
      expect(googleAds.isReady()).toBe(false);
    });
  });
});
