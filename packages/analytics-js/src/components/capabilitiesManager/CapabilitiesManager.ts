import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { IExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader/types';
import { ExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader';
import { batch, effect } from '@preact/signals-core';
import {
  COOKIE_STORAGE,
  LOCAL_STORAGE,
  SESSION_STORAGE,
} from '@rudderstack/analytics-js-common/constants/storages';
import { CAPABILITIES_MANAGER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import { getTimezone } from '@rudderstack/analytics-js-common/utilities/timezone';
import { isValidURL } from '@rudderstack/analytics-js-common/utilities/url';
import { isDefinedAndNotNull } from '@rudderstack/analytics-js-common/utilities/checks';
import type { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import {
  INVALID_POLYFILL_URL_WARNING,
  POLYFILL_SCRIPT_LOAD_ERROR,
} from '../../constants/logMessages';
import { getLanguage, getUserAgent } from '../utilities/page';
import { getStorageEngine } from '../../services/StoreManager/storages';
import { state } from '../../state';
import { getUserAgentClientHint } from './detection/clientHint';
import type { ICapabilitiesManager } from './types';
import { POLYFILL_LOAD_TIMEOUT, POLYFILL_SCRIPT_ID, POLYFILL_URL } from './polyfill';
import {
  getScreenDetails,
  hasCrypto,
  hasUAClientHints,
  isIE11,
  isLegacyJSEngine,
  isStorageAvailable,
} from './detection';
import { detectAdBlockers } from './detection/adBlockers';
import { debounce } from '../utilities/globals';

// TODO: replace direct calls to detection methods with state values when possible
class CapabilitiesManager implements ICapabilitiesManager {
  httpClient: IHttpClient;
  errorHandler: IErrorHandler;
  logger: ILogger;
  externalSrcLoader: IExternalSrcLoader;

  constructor(httpClient: IHttpClient, errorHandler: IErrorHandler, logger: ILogger) {
    this.httpClient = httpClient;
    this.errorHandler = errorHandler;
    this.logger = logger;
    this.externalSrcLoader = new ExternalSrcLoader(this.errorHandler, this.logger);
    this.onError = this.onError.bind(this);
    this.onReady = this.onReady.bind(this);
  }

  init() {
    this.prepareBrowserCapabilities();
    this.attachWindowListeners();
  }

  /**
   * Detect supported capabilities and set values in state
   */
  // eslint-disable-next-line class-methods-use-this
  detectBrowserCapabilities() {
    batch(() => {
      // Storage related details
      state.capabilities.storage.isCookieStorageAvailable.value = isStorageAvailable(
        COOKIE_STORAGE,
        getStorageEngine(COOKIE_STORAGE),
        this.logger,
      );
      state.capabilities.storage.isLocalStorageAvailable.value = isStorageAvailable(
        LOCAL_STORAGE,
        undefined,
        this.logger,
      );
      state.capabilities.storage.isSessionStorageAvailable.value = isStorageAvailable(
        SESSION_STORAGE,
        undefined,
        this.logger,
      );

      // Browser feature detection details
      state.capabilities.isUaCHAvailable.value = hasUAClientHints();
      state.capabilities.isCryptoAvailable.value = hasCrypto();
      state.capabilities.isIE11.value = isIE11();
      state.capabilities.isOnline.value = globalThis.navigator.onLine;

      // Get page context details
      state.context.userAgent.value = getUserAgent();
      state.context.locale.value = getLanguage();
      state.context.screen.value = getScreenDetails();
      state.context.timezone.value = getTimezone();

      if (hasUAClientHints()) {
        getUserAgentClientHint((uach?: UADataValues) => {
          state.context['ua-ch'].value = uach;
        }, state.loadOptions.value.uaChTrackLevel);
      }
    });

    // Ad blocker detection
    effect(() => {
      if (
        state.loadOptions.value.sendAdblockPage === true &&
        state.lifecycle.sourceConfigUrl.value !== undefined
      ) {
        detectAdBlockers(this.httpClient);
      }
    });
  }

  /**
   * Detect if polyfills are required and then load script from polyfill URL
   */
  prepareBrowserCapabilities() {
    state.capabilities.isLegacyDOM.value = isLegacyJSEngine();
    const customPolyfillUrl = state.loadOptions.value.polyfillURL;
    let polyfillUrl = POLYFILL_URL;
    if (isDefinedAndNotNull(customPolyfillUrl)) {
      if (isValidURL(customPolyfillUrl)) {
        polyfillUrl = customPolyfillUrl;
      } else {
        this.logger.warn(INVALID_POLYFILL_URL_WARNING(CAPABILITIES_MANAGER, customPolyfillUrl));
      }
    }

    const shouldLoadPolyfill =
      state.loadOptions.value.polyfillIfRequired &&
      state.capabilities.isLegacyDOM.value &&
      isValidURL(polyfillUrl);

    if (shouldLoadPolyfill) {
      const isDefaultPolyfillService = polyfillUrl !== state.loadOptions.value.polyfillURL;
      if (isDefaultPolyfillService) {
        // write key specific callback
        // NOTE: we're not putting this into RudderStackGlobals as providing the property path to the callback function in the polyfill URL is not possible
        const polyfillCallbackName = `RS_polyfillCallback_${state.lifecycle.writeKey.value}`;

        const polyfillCallback = (): void => {
          this.onReady();

          // Remove the entry from window so we don't leave room for calling it again
          delete (globalThis as any)[polyfillCallbackName];
        };

        (globalThis as any)[polyfillCallbackName] = polyfillCallback;

        polyfillUrl = `${polyfillUrl}&callback=${polyfillCallbackName}`;
      }

      this.externalSrcLoader.loadJSFile({
        url: polyfillUrl,
        id: POLYFILL_SCRIPT_ID,
        async: true,
        timeout: POLYFILL_LOAD_TIMEOUT,
        callback: (scriptId?: string) => {
          if (!scriptId) {
            this.onError(new Error(POLYFILL_SCRIPT_LOAD_ERROR(POLYFILL_SCRIPT_ID, polyfillUrl)));
          } else if (!isDefaultPolyfillService) {
            this.onReady();
          }
        },
      });
    } else {
      this.onReady();
    }
  }

  /**
   * Attach listeners to window to observe event that update capabilities state values
   */
  attachWindowListeners() {
    globalThis.addEventListener('offline', () => {
      state.capabilities.isOnline.value = false;
    });

    globalThis.addEventListener('online', () => {
      state.capabilities.isOnline.value = true;
    });

    globalThis.addEventListener(
      'resize',
      debounce(() => {
        state.context.screen.value = getScreenDetails();
      }, this),
    );
  }

  /**
   * Set the lifecycle status to next phase
   */
  // eslint-disable-next-line class-methods-use-this
  onReady() {
    this.detectBrowserCapabilities();
    state.lifecycle.status.value = 'browserCapabilitiesReady';
  }

  /**
   * Handles error
   * @param error The error object
   */
  onError(error: unknown): void {
    this.errorHandler.onError(error, CAPABILITIES_MANAGER);
  }
}

export { CapabilitiesManager };
