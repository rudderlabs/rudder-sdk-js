import { isLegacyJSEngine } from '../../../src/components/capabilitiesManager/detection';
import type { ICapabilitiesManager } from '../../../src/components/capabilitiesManager/types';
import { defaultErrorHandler } from '../../../src/services/ErrorHandler';
import { CapabilitiesManager } from '../../../src/components/capabilitiesManager';
import { state, resetState } from '../../../src/state';
import { POLYFILL_URL } from '../../../src/components/capabilitiesManager/polyfill';
import { HttpClient } from '../../../src/services/HttpClient';
import { defaultLogger } from '../../../__mocks__/Logger';

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
  const defaultHttpClient = new HttpClient(defaultLogger);

  describe('init', () => {
    beforeEach(() => {
      capabilitiesManager = new CapabilitiesManager(
        defaultHttpClient,
        defaultErrorHandler,
        defaultLogger,
      );
    });

    afterEach(() => {
      POLYFILL_URL = 'https://somevalid.polyfill.url';
      jest.clearAllMocks();
      resetState();
    });

    it('should load polyfills if URL provided is valid', () => {
      state.loadOptions.value.polyfillURL = 'https://www.dummy.url';
      state.lifecycle.writeKey.value = 'sample-write-key';
      state.loadOptions.value.polyfillIfRequired = true;

      isLegacyJSEngine.mockReturnValue(true);
      capabilitiesManager.private_externalSrcLoader = {
        loadJSFile: jest.fn(),
      } as any;

      capabilitiesManager.init();

      expect(capabilitiesManager.private_externalSrcLoader.loadJSFile).toHaveBeenCalledWith({
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
      capabilitiesManager.private_externalSrcLoader = {
        loadJSFile: jest.fn(),
      } as any;

      capabilitiesManager.init();

      expect(capabilitiesManager.private_externalSrcLoader.loadJSFile).toHaveBeenCalledWith({
        url: 'https://somevalid.polyfill.url&callback=RS_polyfillCallback_sample-write-key',
        id: 'rudderstackPolyfill',
        async: true,
        timeout: 10000,
        callback: expect.any(Function),
      });

      expect(defaultLogger.warn).toHaveBeenCalledWith(
        'CapabilitiesManager:: The provided polyfill URL "invalid-url" is invalid. The default polyfill URL will be used instead.',
      );
    });

    it('should use default polyfill URL but not log any warning if custom URL and logger are not provided', () => {
      state.loadOptions.value.polyfillURL = 'invalid-url';
      state.lifecycle.writeKey.value = 'sample-write-key';
      state.loadOptions.value.polyfillIfRequired = true;

      const tempCapabilitiesManager = new CapabilitiesManager(defaultErrorHandler);

      isLegacyJSEngine.mockReturnValue(true);

      tempCapabilitiesManager.private_externalSrcLoader = {
        loadJSFile: jest.fn(),
      } as any;

      tempCapabilitiesManager.init();

      expect(tempCapabilitiesManager.private_externalSrcLoader.loadJSFile).toHaveBeenCalledWith({
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
      capabilitiesManager.private_externalSrcLoader = {
        loadJSFile: jest.fn(),
      } as any;
      capabilitiesManager.private_onReady = jest.fn();

      capabilitiesManager.init();

      expect(capabilitiesManager.private_externalSrcLoader.loadJSFile).not.toHaveBeenCalled();
      expect(capabilitiesManager.private_onReady).toHaveBeenCalled();
    });

    it('should log an error if polyfill script fails to load', () => {
      POLYFILL_URL = 'https://somevalid.polyfill.url';
      state.lifecycle.writeKey.value = 'sample-write-key';
      state.loadOptions.value.polyfillIfRequired = true;

      isLegacyJSEngine.mockReturnValue(true);

      capabilitiesManager.private_externalSrcLoader = {
        loadJSFile: (options: any) => {
          options.callback(undefined, new Error('Failed to load polyfill script'));
        },
      } as any;

      const onErrorSpy = jest.spyOn(capabilitiesManager, 'private_onError');

      capabilitiesManager.init();

      expect(onErrorSpy).toHaveBeenCalledWith(
        new Error('CapabilitiesManager:: Polyfill script: Failed to load polyfill script.'),
      );
    });

    it('should call onReady if polyfill script loads successfully', () => {
      state.loadOptions.value.polyfillURL = 'https://www.dummy.url';
      state.lifecycle.writeKey.value = 'sample-write-key';
      state.loadOptions.value.polyfillIfRequired = true;

      isLegacyJSEngine.mockReturnValue(true);

      capabilitiesManager.private_externalSrcLoader = {
        loadJSFile: (options: any) => {
          options.callback('rudderstackPolyfill');
        },
      } as any;

      const onReadySpy = jest.spyOn(capabilitiesManager, 'private_onReady');

      capabilitiesManager.init();

      expect(onReadySpy).toHaveBeenCalled();
    });

    it('should attach event listeners', done => {
      capabilitiesManager.init();

      // Raise offline event
      globalThis.dispatchEvent(new Event('offline'));

      expect(state.capabilities.isOnline.value).toBe(false);

      // Raise online event
      globalThis.dispatchEvent(new Event('online'));

      expect(state.capabilities.isOnline.value).toBe(true);

      const curScreenDetails = {
        width: globalThis.screen.width,
        height: globalThis.screen.height,
        density: globalThis.devicePixelRatio,
        innerWidth: globalThis.innerWidth,
        innerHeight: globalThis.innerHeight,
      };

      // Save the original screen object so it can be restored later
      const originalScreen = globalThis.screen;

      // Mock the screen object
      Object.defineProperty(globalThis, 'screen', {
        writable: true,
        configurable: true,
        value: { width: 100, height: 200 },
      });

      // Raise resize event
      globalThis.dispatchEvent(new Event('resize'));

      // resize event is debounced, so wait for some time before checking the state
      setTimeout(() => {
        expect(state.context.screen.value).toEqual({
          ...curScreenDetails,
          width: 100,
          height: 200,
        });

        // Restore the original screen object
        Object.defineProperty(globalThis, 'screen', {
          writable: true,
          configurable: true,
          value: originalScreen,
        });

        done();
      }, 500);
    });
  });
});
