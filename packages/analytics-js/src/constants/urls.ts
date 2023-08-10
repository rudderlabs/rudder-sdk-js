import { IS_LEGACY_BUILD } from './app';

const BUILD_TYPE = IS_LEGACY_BUILD ? 'legacy' : 'modern';
const SDK_CDN_BASE_URL = 'https://cdn.rudderlabs.com';
const CDN_ARCH_VERSION_DIR = 'v3';
const CDN_INT_DIR = 'js-integrations';
const CDN_PLUGINS_DIR = 'plugins';
const DEST_SDK_BASE_URL = `${SDK_CDN_BASE_URL}/beta/3.0.0-beta/${BUILD_TYPE}/${CDN_INT_DIR}`;
const PLUGINS_BASE_URL = `${SDK_CDN_BASE_URL}/beta/3.0.0-beta/${BUILD_TYPE}/${CDN_PLUGINS_DIR}`;
// TODO: change the above to production URLs when beta phase is done
// const DEST_SDK_BASE_URL = `${SDK_CDN_BASE_URL}/latest/${CDN_ARCH_VERSION_DIR}/${BUILD_TYPE}/${CDN_INT_DIR}`;
// const PLUGINS_BASE_URL = `${SDK_CDN_BASE_URL}/latest/${CDN_ARCH_VERSION_DIR}/${BUILD_TYPE}/${CDN_PLUGINS_DIR}`;
const DEFAULT_CONFIG_BE_URL = 'https://api.rudderstack.com';

export {
  BUILD_TYPE,
  SDK_CDN_BASE_URL,
  CDN_ARCH_VERSION_DIR,
  CDN_INT_DIR,
  CDN_PLUGINS_DIR,
  DEST_SDK_BASE_URL,
  PLUGINS_BASE_URL,
  DEFAULT_CONFIG_BE_URL,
};
