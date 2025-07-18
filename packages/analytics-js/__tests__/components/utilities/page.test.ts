import {
  getCanonicalUrl,
  getLanguage,
  getUserAgent,
  getDefaultPageProperties,
  getReferrer,
} from '../../../src/components/utilities/page';

describe('utilities - page', () => {
  beforeEach(() => {});

  afterEach(() => {});

  describe('getUserAgent', () => {
    it('should get User Agent', () => {
      expect(getUserAgent()).toContain('Mozilla/5.0');
    });

    it('should not get user agent if window navigator is undefined', () => {
      // @ts-expect-error - needed for testing
      expect(getUserAgent(() => undefined)).toBe(null);
    });

    it('should get Brave user agent for Brave browser', () => {
      const brave = {};
      Object.setPrototypeOf(brave, { isBrave: true });
      // @ts-expect-error - needed for testing
      expect(
        getUserAgent(() => ({
          userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36',
          brave,
        })),
      ).toBe(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36 Brave/103.0.5060.114',
      );
    });
  });

  describe('getLanguage', () => {
    it('should get browser language', () => {
      // @ts-expect-error - needed for testing
      expect(
        getLanguage(() => ({
          language: 'en-US',
        })),
      ).toBe('en-US');
    });

    it('should not get browser language if window navigator is undefined', () => {
      // @ts-expect-error - needed for testing
      expect(getLanguage(() => undefined)).toBe(null);
    });

    it('should get browser language if navigator.language is undefined', () => {
      // @ts-expect-error - needed for testing
      expect(
        getLanguage(() => ({
          language: undefined,
          browserLanguage: 'en-US',
        })),
      ).toBe('en-US');
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

      // @ts-expect-error - needed for testing
      expect(
        getCanonicalUrl(() => ({
          getElementsByTagName: () => [linkScript, anotherLinkScript],
        })),
      ).toBe('https://rudderlabs.com/');
    });

    it('should get empty string if canonical URL is not present in the DOM', () => {
      // @ts-expect-error - needed for testing
      expect(
        getCanonicalUrl(() => ({
          getElementsByTagName: () => [],
        })),
      ).toBe('');
    });

    it('should get empty canonical URL if no valid canonical tags are present in the DOM', () => {
      const linkScript = document.createElement('link');
      linkScript.href = 'https://rudderlabs.com/';

      // @ts-expect-error - needed for testing
      expect(
        getCanonicalUrl(() => ({
          getElementsByTagName: () => [linkScript],
        })),
      ).toBe('');
    });
  });

  describe('getReferrer', () => {
    it('should get referrer if defined', () => {
      // @ts-expect-error - needed for testing
      expect(
        getReferrer(() => ({
          referrer: 'https://rudderlabs.com/',
        })),
      ).toBe('https://rudderlabs.com/');
    });

    it('should get default referrer string if referrer is not defined', () => {
      // @ts-expect-error - needed for testing
      expect(
        getReferrer(() => ({
          referrer: '',
        })),
      ).toBe('$direct');
    });
  });

  describe('getDefaultPageProperties', () => {
    it('should get default page properties with canonical url', () => {
      // Create a canonical link tag
      const linkScript = document.createElement('link');
      linkScript.rel = 'canonical';
      linkScript.href = 'https://rudderlabs.com/docs/';

      const locationMock: any = () => ({
        href: 'https://rudderlabs.com/docs/?someKey=someVal#some-page',
        search: '?someKey=someVal',
        pathname: '/docs/',
        host: 'www.rudderstack.com',
        hostname: 'www.rudderstack.com',
        origin: 'https://www.rudderstack.com',
      });

      const documentMock: any = () => ({
        getElementsByTagName: () => [linkScript],
        title: 'RudderStack',
        referrer: 'https://google.com/',
      });

      const actual = getDefaultPageProperties(locationMock, documentMock);

      const expected = {
        url: 'https://rudderlabs.com/docs/?someKey=someVal',
        path: '/docs/',
        search: '?someKey=someVal',
        title: 'RudderStack',
        referrer: 'https://google.com/',
        referring_domain: 'google.com',
        tab_url: 'https://rudderlabs.com/docs/?someKey=someVal#some-page',
      };

      expect(actual).toEqual(expected);
    });

    it('should get default page properties without canonical url', () => {
      const locationMock: any = () => ({
        href: 'https://rudderlabs.com/docs/?someKey=someVal#some-page',
        search: '?someKey=someVal',
        pathname: '/docs/',
        host: 'www.rudderstack.com',
        hostname: 'www.rudderstack.com',
        origin: 'https://www.rudderstack.com',
      });

      const documentMock: any = () => ({
        getElementsByTagName: () => [],
        title: 'RudderStack',
        referrer: 'https://google.com/',
      });

      const actual = getDefaultPageProperties(locationMock, documentMock);

      const expected = {
        url: 'https://rudderlabs.com/docs/?someKey=someVal',
        path: '/docs/',
        search: '?someKey=someVal',
        title: 'RudderStack',
        referrer: 'https://google.com/',
        referring_domain: 'google.com',
        tab_url: 'https://rudderlabs.com/docs/?someKey=someVal#some-page',
      };

      expect(actual).toEqual(expected);
    });

    it('should get default page properties with canonical url that has query params', () => {
      // Create a canonical link tag
      const linkScript = document.createElement('link');
      linkScript.rel = 'canonical';
      linkScript.href = 'https://rudderlabs.com/docs/?canonicalQueryParam=test';

      const locationMock: any = () => ({
        href: 'https://rudderlabs.com/docs/?someKey=someVal#some-page',
        search: '?someKey=someVal',
        pathname: '/docs/',
        host: 'www.rudderstack.com',
        hostname: 'www.rudderstack.com',
        origin: 'https://www.rudderstack.com',
      });

      const documentMock: any = () => ({
        getElementsByTagName: () => [linkScript],
        title: 'RudderStack',
        referrer: 'https://google.com/',
      });

      const actual = getDefaultPageProperties(locationMock, documentMock);

      const expected = {
        url: 'https://rudderlabs.com/docs/?canonicalQueryParam=test',
        path: '/docs/',
        search: '?someKey=someVal',
        title: 'RudderStack',
        referrer: 'https://google.com/',
        referring_domain: 'google.com',
        tab_url: 'https://rudderlabs.com/docs/?someKey=someVal#some-page',
      };

      expect(actual).toEqual(expected);
    });

    it('should get current page details', () => {
      expect(getDefaultPageProperties()).toEqual({
        url: 'https://www.test-host.com/',
        path: '/',
        search: '',
        title: '',
        referrer: '$direct',
        referring_domain: '',
        tab_url: 'https://www.test-host.com/',
      });
    });
  });
});
