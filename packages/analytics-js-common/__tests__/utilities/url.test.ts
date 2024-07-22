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
      [
        true,
        'https://polyfill-fastly.io/v3/polyfill.min.js?version=3.111.0&features=URL%2CPromise%2CNumber.isNaN%2CNumber.isInteger%2CArray.from%2CArray.prototype.find%2CArray.prototype.includes%2CString.prototype.endsWith%2CString.prototype.startsWith%2CString.prototype.includes%2CString.prototype.replaceAll%2CString.fromCodePoint%2CObject.entries%2CObject.values%2CObject.assign%2CObject.fromEntries%2CElement.prototype.dataset%2CTextEncoder%2CrequestAnimationFrame%2CCustomEvent%2Cnavigator.sendBeacon%2CArrayBuffer%2CSet',
      ],
    ];

    it.each(testCases)('should return %p if URL is %p', (expected, url) => {
      expect(isValidURL(url as string)).toBe(expected);
    });
  });
});
