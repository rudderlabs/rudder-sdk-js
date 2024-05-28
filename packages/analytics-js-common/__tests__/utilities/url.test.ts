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
      [true, 'http://testdomain.com'],
      [false, undefined],
      [false, null],
    ];

    it.each(testCases)('should return %p if URL is %p', (expected, url) => {
      expect(isValidURL(url as string)).toBe(expected);
    });
  });
});
