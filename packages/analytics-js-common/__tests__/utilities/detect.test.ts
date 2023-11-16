import { isSDKRunningInChromeExtension } from '../../src/utilities/detect';

describe('Detect env/feature/capabilities', () => {
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
});
