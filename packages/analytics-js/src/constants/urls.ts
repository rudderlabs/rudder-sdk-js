import { CDN_INT_DIR, CDN_PLUGINS_DIR } from '@rudderstack/analytics-js-common/constants/urls';
import { IS_LEGACY_BUILD } from './app';

const BUILD_TYPE = IS_LEGACY_BUILD ? 'legacy' : 'modern';
const SDK_CDN_BASE_URL = __BASE_CDN_URL__;
const CDN_ARCH_VERSION_DIR = 'v3';
const DEFAULT_INTEGRATION_SDKS_URL = `${SDK_CDN_BASE_URL}/${CDN_ARCH_VERSION_DIR}/${BUILD_TYPE}/${CDN_INT_DIR}`;
const DEFAULT_PLUGINS_URL = `${SDK_CDN_BASE_URL}/${CDN_ARCH_VERSION_DIR}/${BUILD_TYPE}/${CDN_PLUGINS_DIR}`;
const DEFAULT_CONFIG_BE_URL = 'https://api.rudderstack.com';
// Remote entry of the plugins remote (remotePluginsExportsFilename in
// analytics-js-plugins/rollup.config.mjs). The SDK imports the plugin modules directly, this file
// is the compatibility container for older SDK versions; it is still the grouping key of the
// plugins load errors.
const REMOTE_PLUGINS_ENTRY_FILE = 'rsa-plugins.js';
// Plugin modules of the plugins remote: rsa-plugins-remote-<Plugin>.min.js
// (getRemotePluginFileName in analytics-js-plugins/rollup.config.mjs)
const REMOTE_PLUGIN_FILE_PREFIX = 'rsa-plugins-remote-';
const REMOTE_PLUGIN_FILE_SUFFIX = '.min.js';

export {
  BUILD_TYPE,
  SDK_CDN_BASE_URL,
  CDN_ARCH_VERSION_DIR,
  DEFAULT_INTEGRATION_SDKS_URL,
  DEFAULT_PLUGINS_URL,
  DEFAULT_CONFIG_BE_URL,
  REMOTE_PLUGINS_ENTRY_FILE,
  REMOTE_PLUGIN_FILE_PREFIX,
  REMOTE_PLUGIN_FILE_SUFFIX,
};
