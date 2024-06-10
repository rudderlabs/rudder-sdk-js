import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { isLegacyJSEngine } from '../../../src/components/capabilitiesManager/detection';
import type { ICapabilitiesManager } from '../../../src/components/capabilitiesManager/types';
import { defaultErrorHandler } from '../../../src/services/ErrorHandler';
import { CapabilitiesManager } from '../../../src/components/capabilitiesManager';
import { state, resetState } from '../../../src/state';
import { POLYFILL_URL } from '../../../src/components/capabilitiesManager/polyfill';

// mock isLegacyJSEngine function
jest.mock('../../../src/components/capabilitiesManager/detection', () => {
  const originalModule = jest.requireActual(
    '../../../src/components/capabilitiesManager/detection',
  );

  return {
    __esModule: true,
    ...originalModule,
    isLegacyJSEngine: jest.fn(),
  };
});

// mock POLYFILL_URL
jest.mock('../../../src/components/capabilitiesManager/polyfill', () => {
  const originalModule = jest.requireActual('../../../src/components/capabilitiesManager/polyfill');

  return {
    __esModule: true,
    ...originalModule,
    POLYFILL_URL: 'https://somevalid.polyfill.url',
  };
});

describe('CapabilitiesManager', () => {
  let capabilitiesManager: ICapabilitiesManager;
  const mockLogger = {
    warn: jest.fn(),
    error: jest.fn(),
  } as unknown as ILogger;

  describe('prepareBrowserCapabilities', () => {
    beforeEach(() => {
      capabilitiesManager = new CapabilitiesManager(defaultErrorHandler, mockLogger);
    });

    afterEach(() => {
      jest.clearAllMocks();
      resetState();
    });

    it('should load polyfills if URL provided is valid', () => {
      state.loadOptions.value.polyfillURL = 'https://www.dummy.url';
      state.lifecycle.writeKey.value = 'sample-write-key';
      state.loadOptions.value.polyfillIfRequired = true;

      isLegacyJSEngine.mockReturnValue(true);
      capabilitiesManager.externalSrcLoader = {
        loadJSFile: jest.fn(),
      } as any;

      capabilitiesManager.prepareBrowserCapabilities();

      expect(capabilitiesManager.externalSrcLoader.loadJSFile).toHaveBeenCalledWith({
        url: 'https://www.dummy.url',
        id: 'rudderstackPolyfill',
        async: true,
        timeout: 10000,
        callback: expect.any(Function),
      });
    });

    it('should use default polyfill URL if custom URL is invalid', () => {
      state.loadOptions.value.polyfillURL = 'invalid-url';
      state.lifecycle.writeKey.value = 'sample-write-key';
      state.loadOptions.value.polyfillIfRequired = true;

      isLegacyJSEngine.mockReturnValue(true);
      capabilitiesManager.externalSrcLoader = {
        loadJSFile: jest.fn(),
      } as any;

      capabilitiesManager.prepareBrowserCapabilities();

      expect(capabilitiesManager.externalSrcLoader.loadJSFile).toHaveBeenCalledWith({
        url: 'https://somevalid.polyfill.url&callback=RS_polyfillCallback_sample-write-key',
        id: 'rudderstackPolyfill',
        async: true,
        timeout: 10000,
        callback: expect.any(Function),
      });

      expect(mockLogger.warn).toHaveBeenCalledWith(
        'CapabilitiesManager:: The provided polyfill URL "invalid-url" is invalid. The default polyfill URL will be used instead.',
      );
    });

    it('should use default polyfill URL but not log any warning if custom URL and logger are not provided', () => {
      state.loadOptions.value.polyfillURL = 'invalid-url';
      state.lifecycle.writeKey.value = 'sample-write-key';
      state.loadOptions.value.polyfillIfRequired = true;

      const tempCapabilitiesManager = new CapabilitiesManager(defaultErrorHandler);

      isLegacyJSEngine.mockReturnValue(true);
      tempCapabilitiesManager.externalSrcLoader = {
        loadJSFile: jest.fn(),
      } as any;

      tempCapabilitiesManager.prepareBrowserCapabilities();

      expect(tempCapabilitiesManager.externalSrcLoader.loadJSFile).toHaveBeenCalledWith({
        url: 'https://somevalid.polyfill.url&callback=RS_polyfillCallback_sample-write-key',
        id: 'rudderstackPolyfill',
        async: true,
        timeout: 10000,
        callback: expect.any(Function),
      });

      // mock console.warn
      const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});

      expect(consoleWarn).not.toHaveBeenCalled();
    });

    it('should not load polyfills if default polyfill URL is invalid', () => {
      state.loadOptions.value.polyfillURL = 'invalid-url';
      state.lifecycle.writeKey.value = 'sample-write-key';
      state.loadOptions.value.polyfillIfRequired = true;

      POLYFILL_URL = 'invalid-url';

      isLegacyJSEngine.mockReturnValue(true);
      capabilitiesManager.externalSrcLoader = {
        loadJSFile: jest.fn(),
      } as any;
      capabilitiesManager.onReady = jest.fn();

      capabilitiesManager.prepareBrowserCapabilities();

      expect(capabilitiesManager.externalSrcLoader.loadJSFile).not.toHaveBeenCalled();
      expect(capabilitiesManager.onReady).toHaveBeenCalled();
    });
  });
});
