import {
  getCanonicalUrl,
  getLanguage,
  getUserAgent,
  getDefaultPageProperties,
  getReferrer,
  getPageProperties,
} from '@rudderstack/analytics-js/components/utilities/page';
import { batch } from '@preact/signals-core';
import { state } from '@rudderstack/analytics-js/state';

describe('utilities - page', () => {
  let windowSpy: any;
  let documentSpy: any;
  let navigatorSpy: any;
  let locationSpy: any;

  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get');
    documentSpy = jest.spyOn(window, 'document', 'get');
    navigatorSpy = jest.spyOn(globalThis, 'navigator', 'get');
    locationSpy = jest.spyOn(globalThis, 'location', 'get');
  });

  afterEach(() => {
    windowSpy.mockRestore();
    documentSpy.mockRestore();
    navigatorSpy.mockRestore();
    locationSpy.mockRestore();
  });

  describe('getUserAgent', () => {
    it('should get User Agent', () => {
      expect(getUserAgent()).toContain('Mozilla/5.0');
    });

    it('should not get user agent if window navigator is undefined', () => {
      navigatorSpy.mockReturnValue(undefined);
      expect(getUserAgent()).toBe(null);
    });

    it('should get Brave user agent for Brave browser', () => {
      const brave = {};
      Object.setPrototypeOf(brave, { isBrave: true });
      navigatorSpy.mockReturnValue({
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36',
        brave,
      });

      expect(getUserAgent()).toBe(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36 Brave/103.0.5060.114',
      );
    });
  });

  describe('getLanguage', () => {
    it('should get browser language', () => {
      navigatorSpy.mockReturnValue({
        language: 'en-US',
      });
      expect(getLanguage()).toBe('en-US');
    });

    it('should not get browser language if window navigator is undefined', () => {
      navigatorSpy.mockReturnValue(undefined);

      expect(getLanguage()).toBe(null);
    });

    it('should get browser language if navigator.language is undefined', () => {
      navigatorSpy.mockImplementation(() => ({
        language: undefined,
        browserLanguage: 'en-US',
      }));

      expect(getLanguage()).toBe('en-US');
    });
  });

  describe('getCanonicalUrl', () => {
    it('should get canonical URL if present in the DOM', () => {
      const linkScript = document.createElement('link');
      linkScript.rel = 'canonical';
      linkScript.href = 'https://rudderlabs.com/';

      const anotherLinkScript = document.createElement('link');
      anotherLinkScript.rel = 'canonical';
      anotherLinkScript.href = 'https://rudderlabs.com/blog';

      documentSpy.mockImplementation(() => ({
        getElementsByTagName: () => [linkScript, anotherLinkScript],
      }));

      expect(getCanonicalUrl()).toBe('https://rudderlabs.com/');
    });

    it('should get empty string if canonical URL is not present in the DOM', () => {
      expect(getCanonicalUrl()).toBe('');
    });

    it('should get empty canonical URL if no valid canonical tags are present in the DOM', () => {
      const linkScript = document.createElement('link');
      linkScript.href = 'https://rudderlabs.com/';

      documentSpy.mockImplementation(() => ({
        getElementsByTagName: () => [linkScript],
      }));

      expect(getCanonicalUrl()).toBe('');
    });
  });

  describe('getReferrer', () => {
    it('should get referrer if defined', () => {
      documentSpy.mockImplementation(() => ({
        referrer: 'https://rudderlabs.com/',
      }));

      expect(getReferrer()).toBe('https://rudderlabs.com/');
    });

    it('should get default referrer string if referrer is not defined', () => {
      documentSpy.mockImplementation(() => ({
        referrer: '',
      }));

      expect(getReferrer()).toBe('$direct');
    });
  });

  describe('getDefaultPageProperties', () => {
    it('should get default page properties with canonical url', () => {
      // Create a canonical link tag
      const linkScript = document.createElement('link');
      linkScript.rel = 'canonical';
      linkScript.href = 'https://rudderlabs.com/docs/';

      documentSpy.mockImplementation(() => ({
        referrer: 'https://google.com/',
        title: 'RudderStack',
        getElementsByTagName: () => [linkScript],
      }));

      locationSpy.mockImplementation(() => ({
        href: 'https://rudderlabs.com/docs/#some-page?someKey=someVal',
        search: '?someKey=someVal',
        pathname: '/docs/',
        host: 'www.rudderstack.com',
        hostname: 'www.rudderstack.com',
        origin: 'https://www.rudderstack.com',
      }));

      expect(getDefaultPageProperties()).toEqual({
        url: 'https://rudderlabs.com/docs/?someKey=someVal',
        path: '/docs/',
        search: '?someKey=someVal',
        title: 'RudderStack',
        referrer: 'https://google.com/',
        referring_domain: 'google.com',
        tab_url: 'https://rudderlabs.com/docs/#some-page?someKey=someVal',
      });
    });

    it('should get default page properties without canonical url', () => {
      documentSpy.mockImplementation(() => ({
        referrer: 'https://google.com/',
        title: 'RudderStack',
        getElementsByTagName: () => [],
      }));

      locationSpy.mockImplementation(() => ({
        href: 'https://rudderlabs.com/docs/#some-page?someKey=someVal',
        search: '?someKey=someVal',
        pathname: '/docs/',
        host: 'www.rudderstack.com',
        hostname: 'www.rudderstack.com',
        origin: 'https://www.rudderstack.com',
      }));

      expect(getDefaultPageProperties()).toEqual({
        url: 'https://rudderlabs.com/docs/',
        path: '/docs/',
        search: '?someKey=someVal',
        title: 'RudderStack',
        referrer: 'https://google.com/',
        referring_domain: 'google.com',
        tab_url: 'https://rudderlabs.com/docs/#some-page?someKey=someVal',
      });
    });

    it('should get default page properties with canonical url that has query params', () => {
      // Create a canonical link tag
      const linkScript = document.createElement('link');
      linkScript.rel = 'canonical';
      linkScript.href = 'https://rudderlabs.com/docs/?canonicalQueryParam=test';

      documentSpy.mockImplementation(() => ({
        referrer: 'https://google.com/',
        title: 'RudderStack',
        getElementsByTagName: () => [linkScript],
      }));

      locationSpy.mockImplementation(() => ({
        href: 'https://rudderlabs.com/docs/#some-page?someKey=someVal',
        search: '?someKey=someVal',
        pathname: '/docs/',
        host: 'www.rudderstack.com',
        hostname: 'www.rudderstack.com',
        origin: 'https://www.rudderstack.com',
      }));

      expect(getDefaultPageProperties()).toEqual({
        url: 'https://rudderlabs.com/docs/?canonicalQueryParam=test',
        path: '/docs/',
        search: '?someKey=someVal',
        title: 'RudderStack',
        referrer: 'https://google.com/',
        referring_domain: 'google.com',
        tab_url: 'https://rudderlabs.com/docs/#some-page?someKey=someVal',
      });
    });

    describe('getPageProperties', () => {
      it('should get page details and update state values', () => {
        documentSpy.mockRestore();

        batch(() => {
          state.page.referrer.value = 'https://sample.com/Page';
          state.page.referring_domain.value = 'https://sample.com';
          state.page.search.value = '?a=1&b=2&utm_campaign=test&utm_source=test';
          state.page.title.value = 'title';
          state.page.url.value =
            'https://testwebsite.com/Page?a=1&b=2&utm_campaign=test&utm_source=test';
          state.page.path.value = '/Page';
          state.page.tab_url.value =
            'https://testwebsite.com/Page?a=1&b=2&utm_campaign=test&utm_source=test';
        });

        getPageProperties();

        expect(state.page.referrer.value).toBe('$direct');
        expect(state.page.referring_domain.value).toBe('');
        expect(state.page.search.value).toBe('');
        expect(state.page.title.value).toBe('');
        expect(state.page.url.value).toBe('http://www.test-host.com/');
        expect(state.page.path.value).toBe('/');
        expect(state.page.tab_url.value).toBe('http://www.test-host.com/');
      });
    });
  });
});
