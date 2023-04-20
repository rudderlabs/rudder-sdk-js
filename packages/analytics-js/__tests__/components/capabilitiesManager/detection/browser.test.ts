import {
  hasCrypto,
  isBrowser,
  isNode,
  getUserAgent,
  hasUAClientHints,
  getLanguage,
  getCanonicalUrl,
  getUrlWithoutHash,
  getReferrer,
  getReferringDomain,
  extractUTMParameters,
  getDefaultPageProperties,
} from '@rudderstack/analytics-js/components/capabilitiesManager/detection/browser';

describe('Capabilities Detection - Browser', () => {
  let windowSpy;
  let documentSpy;

  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get');
    documentSpy = jest.spyOn(window, 'document', 'get');
  });

  afterEach(() => {
    windowSpy.mockRestore();
    documentSpy.mockRestore();
  });

  it('should detect browser', () => {
    expect(isBrowser()).toBeTruthy();
  });

  it('should detect node', () => {
    expect(isNode()).toBeTruthy();
  });

  it('should detect hasCrypto', () => {
    expect(hasCrypto()).toBeTruthy();
  });

  it('should detect Client Hints', () => {
    expect(hasUAClientHints()).toBeFalsy();
  });

  it('should get User Agent', () => {
    expect(getUserAgent()).toContain('Mozilla/5.0');
  });

  it('should not get user agent if window navigator is undefined', () => {
    windowSpy.mockImplementation(() => ({
      navigator: undefined,
    }));

    expect(getUserAgent()).toBe(null);
  });

  it('should get Brave user agent for Brave browser', () => {
    windowSpy.mockImplementation(() => {
      const brave = {};
      Object.setPrototypeOf(brave, { isBrave: true });
      return {
        navigator: {
          userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36',
          brave,
        },
      };
    });

    expect(getUserAgent()).toBe(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36 Brave/103.0.5060.114',
    );
  });

  it('should get browser language', () => {
    expect(getLanguage()).toBe('en-US');
  });

  it('should not get browser language if window navigator is undefined', () => {
    windowSpy.mockImplementation(() => ({
      navigator: undefined,
    }));

    expect(getLanguage()).toBe(null);
  });

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

  it('should get URL without hash', () => {
    expect(getUrlWithoutHash('https://rudderlabs.com/?abc=def#blog')).toBe(
      'https://rudderlabs.com/?abc=def',
    );
  });

  it('should get URL same as the input if it does not contain any hash', () => {
    expect(getUrlWithoutHash('https://rudderlabs.com/blog')).toBe('https://rudderlabs.com/blog');
  });

  it('should get URL same as the input if it is not a valid URL', () => {
    expect(getUrlWithoutHash('abcdotcom')).toBe('abcdotcom');
  });

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

  it('should get referring domain if referrer is a valid URL', () => {
    expect(getReferringDomain('https://rudderlabs.com:8080/')).toBe('rudderlabs.com:8080');
  });

  it('should get empty string if referrer is not a valid URL', () => {
    expect(getReferringDomain('abcd')).toBe('');
  });

  it('should get UTM parameters if present in the URL', () => {
    expect(
      extractUTMParameters(
        'https://rudderlabs.com/?utm_source=google&utm_medium=cpc&utm_campaign=brand&utm_term=rudderstack&utm_content=homepage&non_utm=value',
      ),
    ).toEqual({
      source: 'google',
      medium: 'cpc',
      name: 'brand',
      term: 'rudderstack',
      content: 'homepage',
    });
  });

  it('should get empty object if UTM parameters are not present in the URL', () => {
    expect(extractUTMParameters('https://rudderlabs.com/')).toEqual({});
  });

  it('should get empty object as UTM parameters if the URL is not valid', () => {
    expect(extractUTMParameters('abcd')).toEqual({});
  });

  it('should get default page properties', () => {
    // Create a script tag
    const linkScript = document.createElement('link');
    linkScript.rel = 'canonical';
    linkScript.href = 'https://rudderlabs.com/';

    documentSpy.mockImplementation(() => ({
      referrer: 'https://google.com/',
      title: 'RudderStack',
      getElementsByTagName: () => [linkScript],
    }));

    windowSpy.mockImplementation(() => ({
      location: {
        href: 'https://rudderlabs.com/docs/#some-page?someKey=someVal',
        search: '?someKey=someVal',
      },
    }));

    expect(getDefaultPageProperties()).toEqual({
      url: 'https://rudderlabs.com/?someKey=someVal',
      path: '/',
      search: '?someKey=someVal',
      title: 'RudderStack',
      referrer: 'https://google.com/',
      referring_domain: 'google.com',
      tab_url: 'https://rudderlabs.com/docs/#some-page?someKey=someVal',
    });

    // Reset the mutated properties
    // document.head.removeChild(linkScript);
  });
});
