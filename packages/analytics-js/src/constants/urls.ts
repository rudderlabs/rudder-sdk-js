import { APP_VERSION, MODULE_TYPE } from "@rudderstack/analytics-js/constants/app";

export const CONFIG_URL =
  `https://api.rudderlabs.com/sourceConfig/?p=${MODULE_TYPE}&v=${APP_VERSION}`;
export const SDK_CDN_BASE_URL = 'https://cdn.rudderlabs.com';
export const CDN_ARCH_VERSION_DIR = 'v3';
export const CDN_INT_DIR = 'js-integrations';
export const CDN_PLUGINS_DIR = 'plugins';
export const DEST_SDK_BASE_URL = `${SDK_CDN_BASE_URL}/${CDN_ARCH_VERSION_DIR}/${CDN_INT_DIR}`;
export const PLUGINS_BASE_URL = `${SDK_CDN_BASE_URL}/${CDN_ARCH_VERSION_DIR}/${DEST_SDK_BASE_URL}`;
