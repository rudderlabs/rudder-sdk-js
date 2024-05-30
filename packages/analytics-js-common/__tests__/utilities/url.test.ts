import { isValidURL } from '../../src/utilities/url';

describe('utilities - url', () => {
  describe('isValidURL', () => {
    const testCases = [
      [true, 'https://rudderlabs.com'],
      [false, 'abcd'],
      [false, ''],
      [false, 'https://'],
      [false, 'https://.com'],
      [true, 'https://rudderlabs.com?abc=def'],
      [true, 'https://rudderlabs.com?abc=def#blog'],
      [false, 'https://rudderlabs.com?abc=def#blog?abc=def'],
      [false, 'ttp://testdomain.com'],
      [true, 'http://192.168.0.1'],
      [false, 'http://999.999.999.999'],
      [true, 'http://localhost'],
      [false, 'http://-domain.com'],
      [true, 'https://sub.domain.co.uk'],
      [true, 'http://sub.domain.com:8080/path?query=param#fragment'],
      [false, 'ftp://invalidprotocol.com'],
      [false, 'http://invalid-.com'],
      [false, 'http://.invalid.com'],
      [true, 'https://example.com/path/to/resource.html'],
      [true, 'https://example.com?query=string&another=value'],
      [true, 'https://example.com#fragment'],
      [false, undefined],
    ];

    it.each(testCases)('should return %p if URL is %p', (expected, url) => {
      expect(isValidURL(url as string)).toBe(expected);
    });
  });
});
