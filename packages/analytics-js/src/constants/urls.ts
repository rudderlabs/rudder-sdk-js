import { CDN_INT_DIR, CDN_PLUGINS_DIR } from '@rudderstack/analytics-js-common/constants/urls';
import { IS_LEGACY_BUILD } from './app';

const BUILD_TYPE = IS_LEGACY_BUILD ? 'legacy' : 'modern';
const SDK_CDN_BASE_URL = __BASE_CDN_URL__;
const CDN_ARCH_VERSION_DIR = 'v3';
const DEFAULT_INTEGRATION_SDKS_URL = `${SDK_CDN_BASE_URL}/${CDN_ARCH_VERSION_DIR}/${BUILD_TYPE}/${CDN_INT_DIR}`;
const DEFAULT_PLUGINS_URL = `${SDK_CDN_BASE_URL}/${CDN_ARCH_VERSION_DIR}/${BUILD_TYPE}/${CDN_PLUGINS_DIR}`;
const DEFAULT_CONFIG_BE_URL = 'https://api.rudderstack.com';
// Mirrors remotePluginsExportsFilename in rollup.config.mjs, which builds the URL
// the generated federation code requests at runtime.
const REMOTE_PLUGINS_ENTRY_FILE = 'rsa-plugins.js';

export {
  BUILD_TYPE,
  SDK_CDN_BASE_URL,
  CDN_ARCH_VERSION_DIR,
  DEFAULT_INTEGRATION_SDKS_URL,
  DEFAULT_PLUGINS_URL,
  DEFAULT_CONFIG_BE_URL,
  REMOTE_PLUGINS_ENTRY_FILE,
};
