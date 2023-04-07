import { state } from '@rudderstack/analytics-js/state';

class ConfigManager {
  init() {
    // TODO: get writekey, dataplaneUrl and loadOptions from state to use
    this.getConfig();
  }

  getConfig() {
    // Once done call all ready
    window.setTimeout(() => {
      this.onReady();
    }, 500);
  }

  onReady() {
    state.lifecycle.status.value = 'configured';
  }
}

const defaultConfigManager = new ConfigManager();

export { ConfigManager, defaultConfigManager };
