import { state } from '@rudderstack/analytics-js/state';
import { LifecycleStatus } from '@rudderstack/analytics-js/state/types';
import { ExternalSrcLoader } from '@rudderstack/analytics-js/services/ExternalSrcLoader';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import {
  IErrorHandler,
  IExternalSrcLoader,
} from '@rudderstack/analytics-js/services/ErrorHandler/types';
import { batch, effect } from '@preact/signals-core';
import { getStorageEngine } from '@rudderstack/analytics-js/services/StoreManager/storages';
import {
  getDefaultPageProperties,
  getLanguage,
  getUserAgent,
} from '@rudderstack/analytics-js/components/utilities/page';
import { extractUTMParameters } from '@rudderstack/analytics-js/components/utilities/url';
import { getUserAgentClientHint } from '@rudderstack/analytics-js/components/capabilitiesManager/detection/clientHint';
import { ICapabilitiesManager } from './types';
import { POLYFILL_LOAD_TIMEOUT, POLYFILL_URL } from './polyfill';
import {
  getScreenDetails,
  hasBeacon,
  hasCrypto,
  hasUAClientHints,
  isIE11,
  isLegacyJSEngine,
  isStorageAvailable,
} from './detection';
import { detectAdBlockers } from './detection/adBlockers';

// TODO: replace direct calls to detection methods with state values when possible
class CapabilitiesManager implements ICapabilitiesManager {
  logger?: ILogger;
  errorHandler?: IErrorHandler;
  externalSrcLoader: IExternalSrcLoader;

  constructor(errorHandler?: IErrorHandler, logger?: ILogger) {
    this.logger = logger;
    this.errorHandler = errorHandler;
    this.externalSrcLoader = new ExternalSrcLoader(this.errorHandler, this.logger);
    this.onError = this.onError.bind(this);
    this.onReady = this.onReady.bind(this);
  }

  init() {
    try {
      this.prepareBrowserCapabilities();
      this.attachWindowListeners();
    } catch (e) {
      this.onError(e);
    }
  }

  /**
   * Detect supported capabilities and set values in state
   */
  // eslint-disable-next-line class-methods-use-this
  detectBrowserCapabilities() {
    batch(() => {
      // Storage related details
      state.capabilities.storage.isCookieStorageAvailable.value = isStorageAvailable(
        'cookieStorage',
        getStorageEngine('cookieStorage'),
      );
      state.capabilities.storage.isLocalStorageAvailable.value = isStorageAvailable('localStorage');
      state.capabilities.storage.isSessionStorageAvailable.value =
        isStorageAvailable('sessionStorage');

      // Browser feature detection details
      state.capabilities.isBeaconAvailable.value = hasBeacon();
      state.capabilities.isUaCHAvailable.value = hasUAClientHints();
      state.capabilities.isCryptoAvailable.value = hasCrypto();
      state.capabilities.isIE11.value = isIE11();
      state.capabilities.isOnline.value = globalThis.navigator.onLine;

      // Get page context details
      state.context.userAgent.value = getUserAgent();
      state.context.locale.value = getLanguage();
      state.context.screen.value = getScreenDetails();
      state.context.campaign.value = extractUTMParameters(globalThis.location.href);

      if (hasUAClientHints()) {
        getUserAgentClientHint((uach?: UADataValues) => {
          state.context['ua-ch'].value = uach;
        }, state.loadOptions.value.uaChTrackLevel);
      }

      // Get page properties details
      const pageProperties = getDefaultPageProperties();
      state.page.path.value = pageProperties.path;
      state.page.referrer.value = pageProperties.referrer;
      state.page.referring_domain.value = pageProperties.referring_domain;
      state.page.search.value = pageProperties.search;
      state.page.title.value = pageProperties.title;
      state.page.url.value = pageProperties.url;
      state.page.tab_url.value = pageProperties.tab_url;
    });

    // Ad blocker detection
    effect(() => {
      if (
        state.loadOptions.value.sendAdblockPage === true &&
        state.lifecycle.sourceConfigUrl.value !== undefined
      ) {
        detectAdBlockers(this.errorHandler, this.logger);
      }
    });
  }

  /**
   * Detect if polyfills are required and then load script from polyfill URL
   */
  prepareBrowserCapabilities() {
    state.capabilities.isLegacyDOM.value = isLegacyJSEngine();
    const polyfillUrl = state.loadOptions.value.polyfillURL ?? POLYFILL_URL;
    const shouldLoadPolyfill =
      state.loadOptions.value.polyfillIfRequired &&
      state.capabilities.isLegacyDOM.value &&
      Boolean(polyfillUrl);

    if (shouldLoadPolyfill) {
      // TODO: check if polyfill has been evaluated via polling or
      //  with the callback param in its url and an exposed function
      const onPolyfillLoad = (scriptId?: string) => Boolean(scriptId) && this.onReady();
      this.externalSrcLoader
        ?.loadJSFile({
          url: state.loadOptions.value.polyfillURL ?? POLYFILL_URL,
          id: 'rudderstackPolyfill',
          async: true,
          timeout: POLYFILL_LOAD_TIMEOUT,
          callback: onPolyfillLoad,
        })
        .catch(e => {
          this.onError(e);
        });
    } else {
      this.onReady();
    }
  }

  /**
   * Attach listeners to window to observe event that update capabilities state values
   */
  // eslint-disable-next-line class-methods-use-this
  attachWindowListeners() {
    globalThis.addEventListener('offline', () => {
      state.capabilities.isOnline.value = false;
    });

    globalThis.addEventListener('online', () => {
      state.capabilities.isOnline.value = true;
    });

    // TODO: add debounched listener for globalThis.onResize event and update state.context.screen.value
  }

  /**
   * Set the lifecycle status to next phase
   */
  // eslint-disable-next-line class-methods-use-this
  onReady() {
    this.detectBrowserCapabilities();
    state.lifecycle.status.value = LifecycleStatus.BrowserCapabilitiesReady;
  }

  /**
   * Handles error
   * @param error The error object
   */
  onError(error: Error | unknown): void {
    if (this.errorHandler) {
      this.errorHandler.onError(error, 'CapabilitiesManager');
    } else {
      throw error;
    }
  }
}

export { CapabilitiesManager };
