import { isIE11, isSDKRunningInChromeExtension } from '../../src/utilities/detect';

describe('Detect env/feature/capabilities', () => {
  const reset = () => {
    (window as any).chrome = undefined;
  };
  afterEach(reset);

  describe('isSDKRunningInChromeExtension', () => {
    it('should return true if SDK is running inside chrome extension', () => {
      (window as any).chrome = {
        runtime: { id: 'sample-id' },
      };
      expect(isSDKRunningInChromeExtension()).toBeTruthy();
    });
    it('should return false if SDK is not running inside chrome extension', () => {
      (window as any).chrome = {
        runtime: { id: undefined },
      };
      expect(isSDKRunningInChromeExtension()).toBeFalsy();
    });
  });

  describe('isIE11', () => {
    const testCases = [
      {
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
        expected: false,
      },
      {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko',
        expected: true,
      },
    ];

    it.each(testCases)('should return $expected for $userAgent', ({ userAgent, expected }) => {
      (globalThis.navigator as any).userAgent = userAgent;
      expect(isIE11()).toBe(expected);
    });
  });
});
