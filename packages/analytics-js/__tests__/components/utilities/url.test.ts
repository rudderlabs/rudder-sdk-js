import {
  extractUTMParameters,
  getUrlWithoutHash,
  getReferringDomain,
} from '../../../src/components/utilities/url';

describe('utilities - url', () => {
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
});
