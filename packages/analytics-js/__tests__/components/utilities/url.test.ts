import {
  extractUTMParameters,
  getUrlWithoutHash,
  getReferringDomain,
  removeTrailingSlashes,
} from '../../../src/components/utilities/url';

describe('utilities - url', () => {
  describe('getUrlWithoutHash', () => {
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
  });

  describe('getReferringDomain', () => {
    it('should get referring domain if referrer is a valid URL', () => {
      expect(getReferringDomain('https://rudderlabs.com:8080/')).toBe('rudderlabs.com:8080');
    });

    it('should get empty string if referrer is not a valid URL', () => {
      expect(getReferringDomain('abcd')).toBe('');
    });
  });

  describe('extractUTMParameters', () => {
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
  });

  describe('removeTrailingSlashes', () => {
    const testCases = [
      // expected, input
      ['https://rudderlabs.com', 'https://rudderlabs.com/'],
      ['https://rudderlabs.com', 'https://rudderlabs.com//'],
      ['https://rudderlabs.com', 'https://rudderlabs.com'],
      ['/rudderlabs.com', '/rudderlabs.com/'],
      ['https://rudderlabs.com/sub/path', 'https://rudderlabs.com/sub/path/'],
      ['asdf', 'asdf/'],
      [undefined, undefined],
      [null, null],
    ];

    it.each(testCases)('should return %p if input is %p', (expected, input) => {
      expect(removeTrailingSlashes(input)).toBe(expected);
    });
  });
});
