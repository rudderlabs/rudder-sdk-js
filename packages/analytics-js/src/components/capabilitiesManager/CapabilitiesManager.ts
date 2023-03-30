import { state } from '@rudderstack/analytics-js/state';

class CapabilitiesManager {
  loadPolyfill() {
    if (state.loadOptions.value.polyfillIfRequired) {
      this.onReady();
    }

    // TODO: load polyfill and only call onReady after polyfill has been fetched and evaluated in DOM
  }

  onReady() {
    state.lifecycle.status.value = 'polyfillLoaded';
  }
}

const defaultCapabilitiesManager = new CapabilitiesManager();

export { CapabilitiesManager, defaultCapabilitiesManager };
