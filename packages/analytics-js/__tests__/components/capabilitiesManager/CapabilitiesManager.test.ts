import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { defaultHttpClient } from '../../../src/services/HttpClient';
import {
  isLegacyJSEngine,
  hasBeacon,
  hasCrypto,
  hasUAClientHints,
  isIE11,
  getScreenDetails,
  isStorageAvailable,
} from '../../../src/components/capabilitiesManager/detection';
import type { ICapabilitiesManager } from '../../../src/components/capabilitiesManager/types';
import { defaultErrorHandler } from '../../../src/services/ErrorHandler';
import { CapabilitiesManager } from '../../../src/components/capabilitiesManager';
import { state, resetState } from '../../../src/state';
import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';

// Mock detection functions
jest.mock('../../../src/components/capabilitiesManager/detection', () => {
  const originalModule = jest.requireActual(
    '../../../src/components/capabilitiesManager/detection',
  );

  return {
    __esModule: true,
    ...originalModule,
    isLegacyJSEngine: jest.fn(),
    hasBeacon: jest.fn(() => true),
    hasCrypto: jest.fn(() => true),
    hasUAClientHints: jest.fn(() => false),
    isIE11: jest.fn(() => false),
    getScreenDetails: jest.fn(() => ({
      width: 1920,
      height: 1080,
      density: 1,
      innerWidth: 1920,
      innerHeight: 1080,
    })),
    isStorageAvailable: jest.fn(() => true),
  };
});

jest.mock('../../../src/components/capabilitiesManager/detection/adBlockers', () => ({
  detectAdBlockers: jest.fn(),
}));

jest.mock('../../../src/components/utilities/page', () => ({
  getUserAgent: jest.fn(() => 'test-user-agent'),
  getLanguage: jest.fn(() => 'en-US'),
}));

jest.mock('@rudderstack/analytics-js-common/utilities/timezone', () => ({
  getTimezone: jest.fn(() => 'America/New_York'),
}));

jest.mock('../../../src/components/capabilitiesManager/polyfill', () => {
  const originalModule = jest.requireActual('../../../src/components/capabilitiesManager/polyfill');

  return {
    __esModule: true,
    ...originalModule,
    POLYFILL_URL: 'https://somevalid.polyfill.url',
  };
});

import { detectAdBlockers } from '../../../src/components/capabilitiesManager/detection/adBlockers';
import { getUserAgent, getLanguage } from '../../../src/components/utilities/page';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { POLYFILL_URL } from '../../../src/components/capabilitiesManager/polyfill';
import { getTimezone } from '@rudderstack/analytics-js-common/utilities/timezone';

// Mock function references
const mockHasBeacon = hasBeacon as jest.MockedFunction<typeof hasBeacon>;
const mockHasCrypto = hasCrypto as jest.MockedFunction<typeof hasCrypto>;
const mockHasUAClientHints = hasUAClientHints as jest.MockedFunction<typeof hasUAClientHints>;
const mockIsIE11 = isIE11 as jest.MockedFunction<typeof isIE11>;
const mockIsLegacyJSEngine = isLegacyJSEngine as jest.MockedFunction<typeof isLegacyJSEngine>;
const mockGetScreenDetails = getScreenDetails as jest.MockedFunction<typeof getScreenDetails>;
const mockIsStorageAvailable = isStorageAvailable as jest.MockedFunction<typeof isStorageAvailable>;
const mockDetectAdBlockers = detectAdBlockers as jest.MockedFunction<typeof detectAdBlockers>;
const mockGetUserAgent = getUserAgent as jest.MockedFunction<typeof getUserAgent>;
const mockGetLanguage = getLanguage as jest.MockedFunction<typeof getLanguage>;
const mockGetTimezone = getTimezone as jest.MockedFunction<typeof getTimezone>;

describe('CapabilitiesManager', () => {
  let capabilitiesManager: ICapabilitiesManager;
  let mockHttpClient: jest.Mocked<IHttpClient>;
  let mockErrorHandler: IErrorHandler;
  let mockLogger: ILogger;

  beforeEach(() => {
    resetState();

    mockHttpClient = {
      getData: jest.fn(),
      getAsyncData: jest.fn(),
      init: jest.fn(),
    } as any;

    mockErrorHandler = defaultErrorHandler;
    mockLogger = defaultLogger;

    capabilitiesManager = new CapabilitiesManager(mockHttpClient, mockErrorHandler, mockLogger);

    // Reset mocks
    jest.clearAllMocks();

    // Set default mock return values
    mockHasBeacon.mockReturnValue(true);
    mockHasCrypto.mockReturnValue(true);
    mockHasUAClientHints.mockReturnValue(false);
    mockIsIE11.mockReturnValue(false);
    mockIsLegacyJSEngine.mockReturnValue(false);
    mockGetScreenDetails.mockReturnValue({
      width: 1920,
      height: 1080,
      density: 1,
      innerWidth: 1920,
      innerHeight: 1080,
    });
    mockIsStorageAvailable.mockReturnValue(true);
    mockGetUserAgent.mockReturnValue('test-user-agent');
    mockGetLanguage.mockReturnValue('en-US');
    mockGetTimezone.mockReturnValue('America/New_York');
    // @ts-expect-error needed for the test
    POLYFILL_URL = 'https://somevalid.polyfill.url';
  });

  describe('Initialization', () => {
    it('should initialize with correct dependencies', () => {
      expect(capabilitiesManager.httpClient).toBe(mockHttpClient);
      expect(capabilitiesManager.errorHandler).toBe(mockErrorHandler);
      expect(capabilitiesManager.logger).toBe(mockLogger);
      expect(capabilitiesManager.externalSrcLoader).toBeDefined();
    });

    it('should call prepareBrowserCapabilities and attachWindowListeners on init', () => {
      const prepareSpy = jest.spyOn(capabilitiesManager, 'prepareBrowserCapabilities');
      const attachSpy = jest.spyOn(capabilitiesManager, 'attachWindowListeners');

      capabilitiesManager.init();

      expect(prepareSpy).toHaveBeenCalled();
      expect(attachSpy).toHaveBeenCalled();
    });
  });

  describe('Browser Capability Detection', () => {
    it('should detect all browser capabilities and set state values', () => {
      capabilitiesManager.detectBrowserCapabilities();

      expect(state.capabilities.isBeaconAvailable.value).toBe(true);
      expect(state.capabilities.isCryptoAvailable.value).toBe(true);
      expect(state.capabilities.isUaCHAvailable.value).toBe(false);
      expect(state.capabilities.isIE11.value).toBe(false);
      expect(state.capabilities.storage.isCookieStorageAvailable.value).toBe(true);
      expect(state.capabilities.storage.isLocalStorageAvailable.value).toBe(true);
      expect(state.capabilities.storage.isSessionStorageAvailable.value).toBe(true);
    });

    it('should set context values correctly', () => {
      capabilitiesManager.detectBrowserCapabilities();

      expect(state.context.userAgent.value).toBe('test-user-agent');
      expect(state.context.locale.value).toBe('en-US');
      expect(state.context.timezone.value).toBe('America/New_York');
      expect(state.context.screen.value).toEqual({
        width: 1920,
        height: 1080,
        density: 1,
        innerWidth: 1920,
        innerHeight: 1080,
      });
    });

    it('should handle different capability combinations', () => {
      mockHasBeacon.mockReturnValueOnce(false);
      mockHasCrypto.mockReturnValueOnce(false);
      mockIsStorageAvailable.mockReturnValueOnce(false);

      capabilitiesManager.detectBrowserCapabilities();

      expect(state.capabilities.isBeaconAvailable.value).toBe(false);
      expect(state.capabilities.isCryptoAvailable.value).toBe(false);
      expect(state.capabilities.storage.isCookieStorageAvailable.value).toBe(false);
    });

    it('should detect ad blockers when configured', () => {
      state.loadOptions.value.sendAdblockPage = true;
      state.lifecycle.sourceConfigUrl.value = 'https://api.rudderstack.com';

      capabilitiesManager.detectBrowserCapabilities();

      expect(mockDetectAdBlockers).toHaveBeenCalledWith(mockHttpClient);
    });

    it('should not detect ad blockers when not configured', () => {
      state.loadOptions.value.sendAdblockPage = false;

      capabilitiesManager.detectBrowserCapabilities();

      expect(mockDetectAdBlockers).not.toHaveBeenCalled();
    });

    it('should initiate adblockers detection if configured', () => {
      state.loadOptions.value.sendAdblockPage = true;
      state.lifecycle.sourceConfigUrl.value = 'https://www.dummy.url';

      capabilitiesManager.init();

      expect(mockDetectAdBlockers).toHaveBeenCalledTimes(1);
      expect(mockDetectAdBlockers).toHaveBeenCalledWith(mockHttpClient);
    });
  });

  describe('prepareBrowserCapabilities', () => {
    beforeEach(() => {
      capabilitiesManager = new CapabilitiesManager(
        defaultHttpClient,
        defaultErrorHandler,
        mockLogger,
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
      resetState();
    });

    it('should load polyfills if URL provided is valid', () => {
      state.loadOptions.value.polyfillURL = 'https://www.dummy.url';
      state.lifecycle.writeKey.value = 'sample-write-key';
      state.loadOptions.value.polyfillIfRequired = true;

      mockIsLegacyJSEngine.mockReturnValueOnce(true);
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

      mockIsLegacyJSEngine.mockReturnValueOnce(true);
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

    it('should not load polyfills if default polyfill URL is invalid', () => {
      state.loadOptions.value.polyfillURL = 'invalid-url';
      state.lifecycle.writeKey.value = 'sample-write-key';
      state.loadOptions.value.polyfillIfRequired = true;

      // @ts-expect-error needed for the test
      POLYFILL_URL = 'invalid-url';

      mockIsLegacyJSEngine.mockReturnValueOnce(true);
      capabilitiesManager.externalSrcLoader = {
        loadJSFile: jest.fn(),
      } as any;
      capabilitiesManager.onReady = jest.fn();

      capabilitiesManager.prepareBrowserCapabilities();

      expect(capabilitiesManager.externalSrcLoader.loadJSFile).not.toHaveBeenCalled();
      expect(capabilitiesManager.onReady).toHaveBeenCalled();
    });
  });

  describe('Polyfill Handling', () => {
    it('should proceed without polyfill when not required', () => {
      const onReadySpy = jest.spyOn(capabilitiesManager, 'onReady');
      mockIsLegacyJSEngine.mockReturnValueOnce(false);

      capabilitiesManager.prepareBrowserCapabilities();

      expect(onReadySpy).toHaveBeenCalled();
    });

    it('should load polyfill when required and enabled', () => {
      const loadJSFileSpy = jest.spyOn(capabilitiesManager.externalSrcLoader, 'loadJSFile');
      mockIsLegacyJSEngine.mockReturnValueOnce(true);
      state.loadOptions.value.polyfillIfRequired = true;

      capabilitiesManager.prepareBrowserCapabilities();

      expect(loadJSFileSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('polyfill'),
          id: expect.any(String),
          async: true,
          timeout: expect.any(Number),
          callback: expect.any(Function),
        }),
      );
    });

    it('should use custom polyfill URL when provided', () => {
      const loadJSFileSpy = jest.spyOn(capabilitiesManager.externalSrcLoader, 'loadJSFile');
      const customUrl = 'https://custom.polyfill.com/v3/polyfill.min.js';

      mockIsLegacyJSEngine.mockReturnValueOnce(true);
      state.loadOptions.value.polyfillIfRequired = true;
      state.loadOptions.value.polyfillURL = customUrl;

      capabilitiesManager.prepareBrowserCapabilities();

      expect(loadJSFileSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          url: customUrl,
        }),
      );
    });

    it('should warn about invalid custom polyfill URL', () => {
      const warnSpy = jest.spyOn(mockLogger, 'warn');
      const invalidUrl = 'not-a-valid-url';

      mockIsLegacyJSEngine.mockReturnValueOnce(true);
      state.loadOptions.value.polyfillIfRequired = true;
      state.loadOptions.value.polyfillURL = invalidUrl;

      capabilitiesManager.prepareBrowserCapabilities();

      expect(warnSpy).toHaveBeenCalledWith(
        'CapabilitiesManager:: The provided polyfill URL "not-a-valid-url" is invalid. The default polyfill URL will be used instead.',
      );
    });
  });

  describe('Window Event Listeners', () => {
    it('should attach online/offline listeners', () => {
      const addEventListenerSpy = jest.spyOn(globalThis, 'addEventListener');

      capabilitiesManager.attachWindowListeners();

      expect(addEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    });

    it('should update online status when offline event fires', () => {
      capabilitiesManager.attachWindowListeners();

      // Simulate offline event
      const offlineEvent = new Event('offline');
      globalThis.dispatchEvent(offlineEvent);

      expect(state.capabilities.isOnline.value).toBe(false);
    });

    it('should update online status when online event fires', () => {
      state.capabilities.isOnline.value = false;
      capabilitiesManager.attachWindowListeners();

      // Simulate online event
      const onlineEvent = new Event('online');
      globalThis.dispatchEvent(onlineEvent);

      expect(state.capabilities.isOnline.value).toBe(true);
    });
  });

  describe('Lifecycle Management', () => {
    it('should set status to browserCapabilitiesReady on ready', () => {
      const detectSpy = jest.spyOn(capabilitiesManager, 'detectBrowserCapabilities');

      capabilitiesManager.onReady();

      expect(detectSpy).toHaveBeenCalled();
      expect(state.lifecycle.status.value).toBe('browserCapabilitiesReady');
    });
  });
});
