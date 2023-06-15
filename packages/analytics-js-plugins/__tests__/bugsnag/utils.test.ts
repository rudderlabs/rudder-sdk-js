import { isApiKeyValid, getGlobalBugsnagLibInstance, getReleaseStage, isValidVersion } from '@rudderstack/analytics-js-plugins/bugsnag/utils';

describe('Bugsnag utilities', () => {
  describe('isApiKeyValid', () => {
    it('should return true for a valid API key', () => {
      const apiKey = '1234567890abcdef';
      expect(isApiKeyValid(apiKey)).toBe(true);
    });

    it('should return false for an invalid API key', () => {
      const apiKey = '{{invalid-api-key}}';
      expect(isApiKeyValid(apiKey)).toBe(false);
    });

    it('should return false for an invalid API key', () => {
      const apiKey = '';
      expect(isApiKeyValid(apiKey)).toBe(false);
    });
  });

  describe('getGlobalBugsnagLibInstance', () => {
    it('should return the global Bugsnag instance if defined on the window object', () => {
      const bsObj = {
        version: "1.2.3",
      };
      (window as any).bugsnag = bsObj;

      expect(getGlobalBugsnagLibInstance()).toBe(bsObj);

      delete (window as any).bugsnag;
    });

    it('should return undefined if the global Bugsnag instance is not defined on the window object', () => {
      expect(getGlobalBugsnagLibInstance()).toBe(undefined);
    });
  });

  describe('getReleaseStage', () => {
    let windowSpy: any;
    let documentSpy: any;
    let navigatorSpy: any;
    let locationSpy: any;
  
    beforeEach(() => {
      windowSpy = jest.spyOn(window, 'window', 'get');
      locationSpy = jest.spyOn(globalThis, 'location', 'get');
    });
  
    afterEach(() => {
      windowSpy.mockRestore();
      locationSpy.mockRestore();
    });

    const testCaseData = [
      ['localhost', 'development'],
      ['127.0.0.1', 'development'],
      ['www.test-host.com', 'development'],
      ['[::1]', 'development'],
      ['', '__RS_BUGSNAG_RELEASE_STAGE__'],
      ['www.validhost.com', '__RS_BUGSNAG_RELEASE_STAGE__'],
    ];

    it.each(testCaseData)('if window host name is "%s" then it should return the release stage as "%s" ', (hostName, expectedReleaseStage) => {
      locationSpy.mockImplementation(() => ({
        hostname: hostName,
      }));

      expect(getReleaseStage()).toBe(expectedReleaseStage);
    });
  });

  describe('isValidVersion', () => {
    it('should return true if bugsnag version 6 is present in window scope', () => {
      (window as any).bugsnag = jest.fn(() => ({ notifier: { version: '6.0.0' } }));

      expect(isValidVersion((window as any).bugsnag)).toBe(true);

      delete (window as any).bugsnag;
    });

    it('should return false if bugsnag version 7 is present in window scope', () => {
      (window as any).bugsnag = { _client: { _notifier: { version: '7.0.0' } } };

      expect(isValidVersion((window as any).bugsnag)).toBe(false);

      delete (window as any).bugsnag;
    });

    it('should return false if bugsnag version 4 is present in window scope', () => {
      (window as any).bugsnag = jest.fn(() => ({ notifier: { version: '4.0.0' } }));

      expect(isValidVersion((window as any).bugsnag)).toBe(false);

      delete (window as any).bugsnag;
    });
  });
});
