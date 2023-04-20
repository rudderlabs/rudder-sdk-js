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
  it('should get browser language', () => {
    expect(getLanguage()).toBe('en-US');
  });

  it('should get canonical URL if present in the DOM', () => {
    const linkScript = document.createElement('link');
    linkScript.rel = 'canonical';
    linkScript.href = 'https://rudderlabs.com/';
    document.head.appendChild(linkScript);

    const anotherLinkScript = document.createElement('link');
    anotherLinkScript.rel = 'canonical';
    anotherLinkScript.href = 'https://rudderlabs.com/blog';
    document.head.appendChild(anotherLinkScript);

    expect(getCanonicalUrl()).toBe('https://rudderlabs.com/');

    document.head.removeChild(linkScript);
    document.head.removeChild(anotherLinkScript);
  });

  it('should get empty string if canonical URL is not present in the DOM', () => {
    expect(getCanonicalUrl()).toBe('');
  });

  it('should get URL without hash', () => {
    expect(getUrlWithoutHash('https://rudderlabs.com/?abc=def#blog')).toBe('https://rudderlabs.com/?abc=def');
  });

  it('should get URL same as the input if it does not contain any hash', () => {
    expect(getUrlWithoutHash('https://rudderlabs.com/blog')).toBe('https://rudderlabs.com/blog');
  });

  it('should get URL same as the input if it is not a valid URL', () => {
    expect(getUrlWithoutHash('abcdotcom')).toBe('abcdotcom');
  });

  it('should get referrer if defined', () => {
    const originalReferrer = document.referrer;
    Object.defineProperty(document, 'referrer', { value: 'https://rudderlabs.com/', configurable: true });

    expect(getReferrer()).toBe('https://rudderlabs.com/');

    Object.defineProperty(document, 'referrer', { value: originalReferrer });
  });

  it('should get default referrer string if referrer is not defined', () => {
    const originalReferrer = document.referrer;
    Object.defineProperty(document, 'referrer', { value: '', configurable: true });

    expect(getReferrer()).toBe('$direct');

    Object.defineProperty(document, 'referrer', { value: originalReferrer });
  });

  it('should get referring domain if referrer is a valid URL', () => {
    expect(getReferringDomain('https://rudderlabs.com:8080/')).toBe('rudderlabs.com:8080');
  });

  it('should get empty string if referrer is not a valid URL', () => {
    expect(getReferringDomain('abcd')).toBe('');
  });

  it('should get UTM parameters if present in the URL', () => {
    expect(extractUTMParameters('https://rudderlabs.com/?utm_source=google&utm_medium=cpc&utm_campaign=brand&utm_term=rudderstack&utm_content=homepage&non_utm=value')).toEqual({
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
    // Set DOM properties
    const linkScript = document.createElement('link');
    linkScript.rel = 'canonical';
    linkScript.href = 'https://rudderlabs.com/';
    document.head.appendChild(linkScript);

    const originalReferrer = document.referrer;
    Object.defineProperty(document, 'referrer', { value: 'https://google.com/', configurable: true });
    const originalTitle = document.title;
    document.title = 'RudderStack';

    const originalLocationHref = window.location.href;
    const originalLocationSearch = window.location.search;
    Object.defineProperty(window, 'location', { value: { href: 'https://rudderlabs.com/docs/#some-page?someKey=someVal', search: '?someKey=someVal' }, configurable: true });
    // Object.defineProperties(window.location, {
    //   href: { value: 'https://rudderlabs.com/docs/#some-page?someKey=someVal', configurable: true },
    //   search: { value: '?someKey=someVal', configurable: true },
    // });

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
    window.location.search = originalLocationSearch;
    window.location.href = originalLocationHref;
    Object.defineProperty(document, 'referrer', { value: originalReferrer });
    document.title = originalTitle;
    document.head.removeChild(linkScript);
  });
});
