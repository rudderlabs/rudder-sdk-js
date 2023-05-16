import { state } from '@rudderstack/analytics-js/state';
import { LifecycleStatus } from '@rudderstack/analytics-js/state/types';
import { ExternalSrcLoader } from '@rudderstack/analytics-js/services/ExternalSrcLoader';
import { defaultErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { IErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler/types';
import { IExternalSrcLoader } from '@rudderstack/analytics-js/services/ExternalSrcLoader/types';
import { batch } from '@preact/signals-core';
import { defaultCookieStorage } from '@rudderstack/analytics-js/services/StoreManager/storages';
import { ICapabilitiesManager } from './types';
import { POLYFILL_LOAD_TIMEOUT, POLYFILL_URL } from './polyfill';
import {
  hasBeacon,
  hasCrypto,
  hasUAClientHints,
  isIE11,
  isLegacyJSEngine,
  isStorageAvailable,
} from './detection';

// TODO: replace direct calls to detection methods with state values when possible
class CapabilitiesManager implements ICapabilitiesManager {
  logger?: ILogger;
  errorHandler?: IErrorHandler;
  externalSrcLoader?: IExternalSrcLoader;

  constructor(errorHandler?: IErrorHandler, logger?: ILogger) {
    this.logger = logger;
    this.errorHandler = errorHandler;
    this.externalSrcLoader = new ExternalSrcLoader(this.errorHandler, this.logger);
    this.onError = this.onError.bind(this);
    this.onReady = this.onReady.bind(this);
  }

  init() {
    try {
      this.detectBrowserCapabilities();
      this.prepareBrowserCapabilities();
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
      state.capabilities.storage.isCookieStorageAvailable.value = isStorageAvailable(
        'cookieStorage',
        defaultCookieStorage,
      );
      state.capabilities.storage.isLocalStorageAvailable.value = isStorageAvailable('localStorage');
      state.capabilities.storage.isSessionStorageAvailable.value =
        isStorageAvailable('sessionStorage');
      state.capabilities.isBeaconAvailable.value = hasBeacon();
      state.capabilities.isLegacyDOM.value = isLegacyJSEngine();
      state.capabilities.isUaCHAvailable.value = hasUAClientHints();
      state.capabilities.isCryptoAvailable.value = hasCrypto();
      state.capabilities.isIE11.value = isIE11();
      // TODO: implement this detection logic as part of relevant sprint task
      state.capabilities.isAdBlocked.value = false;
    });
    // TODO: add listener for window.onResize event and update state.context.screen.value
  }

  /**
   * Detect if polyfills are required and then load script from polyfill URL
   */
  prepareBrowserCapabilities() {
    const polyfillUrl = state.loadOptions.value.polyfillURL ?? POLYFILL_URL;
    const shouldLoadPolyfill =
      state.loadOptions.value.polyfillIfRequired &&
      state.capabilities.isLegacyDOM.value &&
      Boolean(polyfillUrl);

    if (shouldLoadPolyfill) {
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
   * Set the lifecycle status to next phase
   */
  // eslint-disable-next-line class-methods-use-this
  onReady() {
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

const defaultCapabilitiesManager = new CapabilitiesManager(defaultErrorHandler, defaultLogger);

export { CapabilitiesManager, defaultCapabilitiesManager };
