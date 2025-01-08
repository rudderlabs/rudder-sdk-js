import { isSDKRunningInChromeExtension } from '../../src/utilities/detect';

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

      (window as any).chrome = undefined;
      expect(isSDKRunningInChromeExtension()).toBeFalsy();

      (window as any).chrome = {};
      expect(isSDKRunningInChromeExtension()).toBeFalsy();

      (window as any).chrome = { runtime: {} };
      expect(isSDKRunningInChromeExtension()).toBeFalsy();

      (window as any).chrome = { runtime: undefined };
      expect(isSDKRunningInChromeExtension()).toBeFalsy();
    });
  });
});
