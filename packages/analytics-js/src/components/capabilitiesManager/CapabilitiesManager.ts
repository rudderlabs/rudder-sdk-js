import { state } from '@rudderstack/analytics-js/state';
import { LifecycleStatus } from '@rudderstack/analytics-js/state/types';
import { ICapabilitiesManager } from './types';

class CapabilitiesManager implements ICapabilitiesManager {
  loadPolyfill() {
    if (state.loadOptions.value.polyfillIfRequired) {
      this.onReady();
    }

    // TODO: load polyfill and only call onReady after polyfill has been fetched and evaluated in DOM
  }

  onReady() {
    state.lifecycle.status.value = LifecycleStatus.PolyfillLoaded;
  }
}

const defaultCapabilitiesManager = new CapabilitiesManager();

export { CapabilitiesManager, defaultCapabilitiesManager };
