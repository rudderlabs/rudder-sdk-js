import { APP_VERSION, MODULE_TYPE } from '@rudderstack/analytics-js/constants/app';

const CONFIG_URL = `https://api.rudderstack.com/sourceConfig/?p=${MODULE_TYPE}&v=${APP_VERSION}`;
const SDK_CDN_BASE_URL = 'https://cdn.rudderlabs.com';
const CDN_ARCH_VERSION_DIR = 'v3';
const CDN_INT_DIR = 'js-integrations';
const CDN_PLUGINS_DIR = 'plugins';
const DEST_SDK_BASE_URL = `${SDK_CDN_BASE_URL}/${CDN_ARCH_VERSION_DIR}/${CDN_INT_DIR}`;
const PLUGINS_BASE_URL = `${SDK_CDN_BASE_URL}/${CDN_ARCH_VERSION_DIR}/${DEST_SDK_BASE_URL}`;

export {
  CONFIG_URL,
  SDK_CDN_BASE_URL,
  CDN_ARCH_VERSION_DIR,
  CDN_INT_DIR,
  CDN_PLUGINS_DIR,
  DEST_SDK_BASE_URL,
  PLUGINS_BASE_URL,
};
