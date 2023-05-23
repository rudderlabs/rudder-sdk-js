import { APP_VERSION, MODULE_TYPE, IS_LEGACY_BUILD } from '@rudderstack/analytics-js/constants/app';

const BUILD_TYPE = IS_LEGACY_BUILD ? 'legacy' : 'modern';
const CONFIG_URL = (configUrlHost = 'https://api.rudderstack.com') =>
  `${configUrlHost}/sourceConfig/?p=${MODULE_TYPE}&v=${APP_VERSION}&build=${BUILD_TYPE}`;
const SDK_CDN_BASE_URL = 'https://cdn.rudderlabs.com';
const CDN_ARCH_VERSION_DIR = 'v3';
const CDN_INT_DIR = 'js-integrations';
const CDN_PLUGINS_DIR = 'plugins';
const DEST_SDK_BASE_URL = `${SDK_CDN_BASE_URL}/${CDN_ARCH_VERSION_DIR}/latest/${BUILD_TYPE}/${CDN_INT_DIR}`;
const PLUGINS_BASE_URL = `${SDK_CDN_BASE_URL}/${CDN_ARCH_VERSION_DIR}/latest/${BUILD_TYPE}/${CDN_PLUGINS_DIR}`;

export {
  CONFIG_URL,
  SDK_CDN_BASE_URL,
  CDN_ARCH_VERSION_DIR,
  CDN_INT_DIR,
  CDN_PLUGINS_DIR,
  DEST_SDK_BASE_URL,
  PLUGINS_BASE_URL,
};
