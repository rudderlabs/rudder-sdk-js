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
import { isValidURL } from '@rudderstack/analytics-js-common/utilities/url';
import { isDefinedAndNotNull } from '@rudderstack/analytics-js-common/utilities/checks';
import type { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import { getTimezone } from '@rudderstack/analytics-js-common/utilities/time';
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
  private_logger?: ILogger;
  private_errorHandler?: IErrorHandler;
  private_externalSrcLoader: IExternalSrcLoader;
  private_httpClient: IHttpClient;

  constructor(httpClient: IHttpClient, errorHandler?: IErrorHandler, logger?: ILogger) {
    this.private_logger = logger;
    this.private_errorHandler = errorHandler;
    this.private_externalSrcLoader = new ExternalSrcLoader();
    this.private_httpClient = httpClient;
    this.private_onError = this.private_onError.bind(this);
    this.private_onReady = this.private_onReady.bind(this);
  }

  init() {
    this.private_prepareBrowserCapabilities();
    this.private_attachWindowListeners();
  }

  /**
   * Detect supported capabilities and set values in state
   */
  // eslint-disable-next-line class-methods-use-this
  private_detectBrowserCapabilities() {
    batch(() => {
      // Storage related details
      state.capabilities.storage.isCookieStorageAvailable.value = isStorageAvailable(
        COOKIE_STORAGE,
        getStorageEngine(COOKIE_STORAGE),
        this.private_logger,
      );
      state.capabilities.storage.isLocalStorageAvailable.value = isStorageAvailable(
        LOCAL_STORAGE,
        undefined,
        this.private_logger,
      );
      state.capabilities.storage.isSessionStorageAvailable.value = isStorageAvailable(
        SESSION_STORAGE,
        undefined,
        this.private_logger,
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
        detectAdBlockers(this.private_httpClient);
      }
    });
  }

  /**
   * Detect if polyfills are required and then load script from polyfill URL
   */
  private_prepareBrowserCapabilities() {
    state.capabilities.isLegacyDOM.value = isLegacyJSEngine();
    const customPolyfillUrl = state.loadOptions.value.polyfillURL;
    let polyfillUrl = POLYFILL_URL;
    if (isDefinedAndNotNull(customPolyfillUrl)) {
      if (isValidURL(customPolyfillUrl)) {
        polyfillUrl = customPolyfillUrl;
      } else {
        this.private_logger?.warn(
          INVALID_POLYFILL_URL_WARNING(CAPABILITIES_MANAGER, customPolyfillUrl),
        );
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
          this.private_onReady();

          // Remove the entry from window so we don't leave room for calling it again
          delete (globalThis as any)[polyfillCallbackName];
        };

        (globalThis as any)[polyfillCallbackName] = polyfillCallback;

        polyfillUrl = `${polyfillUrl}&callback=${polyfillCallbackName}`;
      }

      this.private_externalSrcLoader.loadJSFile({
        url: polyfillUrl,
        id: POLYFILL_SCRIPT_ID,
        async: true,
        timeout: POLYFILL_LOAD_TIMEOUT,
        callback: (scriptId?: string, error?: Error) => {
          if (error) {
            this.private_onError(
              new Error(POLYFILL_SCRIPT_LOAD_ERROR(CAPABILITIES_MANAGER, error.message)),
            );
            // The default polyfill service would automatically invoke the callback
            // which will invoke the onReady method
          } else if (!isDefaultPolyfillService) {
            this.private_onReady();
          }
        },
      });
    } else {
      this.private_onReady();
    }
  }

  /**
   * Attach listeners to window to observe event that update capabilities state values
   */
  private_attachWindowListeners() {
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
  private_onReady() {
    this.private_detectBrowserCapabilities();
    state.lifecycle.status.value = 'browserCapabilitiesReady';
  }

  /**
   * Handles error
   * @param error The error object
   */
  private_onError(error: any): void {
    if (this.private_errorHandler) {
      this.private_errorHandler.onError(error, CAPABILITIES_MANAGER);
    } else {
      throw error;
    }
  }
}

export { CapabilitiesManager };
