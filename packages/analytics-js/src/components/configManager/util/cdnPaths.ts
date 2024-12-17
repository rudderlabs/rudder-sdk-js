import { CDN_INT_DIR, CDN_PLUGINS_DIR } from '@rudderstack/analytics-js-common/constants/urls';
import { isValidURL } from '@rudderstack/analytics-js-common/utilities/url';
import {
  BUILD_TYPE,
  CDN_ARCH_VERSION_DIR,
  DEST_SDK_BASE_URL,
  PLUGINS_BASE_URL,
} from '../../../constants/urls';
import { COMPONENT_BASE_URL_ERROR } from '../../../constants/logMessages';
import { removeTrailingSlashes } from '../../utilities/url';
import { getSDKUrl } from './commonUtil';

const getSDKComponentBaseURL = (
  componentType: string,
  pathSuffix: string,
  baseURL: string,
  currentVersion: string,
  lockVersion: boolean,
  customURL?: string,
) => {
  if (customURL) {
    if (!isValidURL(customURL)) {
      throw new Error(COMPONENT_BASE_URL_ERROR(componentType, customURL));
    }

    return removeTrailingSlashes(customURL) as string;
  }

  const sdkURL = getSDKUrl();
  let sdkComponentURL = sdkURL
    ? sdkURL.split('/').slice(0, -1).concat(pathSuffix).join('/')
    : baseURL;

  if (lockVersion) {
    sdkComponentURL = sdkComponentURL.replace(
      new RegExp(`/${CDN_ARCH_VERSION_DIR}/${BUILD_TYPE}/${pathSuffix}$`),
      `/${currentVersion}/${BUILD_TYPE}/${pathSuffix}`,
    );
  }

  return sdkComponentURL;
};

/**
 * A function that determines integration SDK loading path
 * @param currentVersion
 * @param lockIntegrationsVersion
 * @param customIntegrationsCDNPath
 * @returns
 */
const getIntegrationsCDNPath = (
  currentVersion: string,
  lockIntegrationsVersion: boolean,
  customIntegrationsCDNPath?: string,
): string =>
  getSDKComponentBaseURL(
    'integrations',
    CDN_INT_DIR,
    DEST_SDK_BASE_URL,
    currentVersion,
    lockIntegrationsVersion,
    customIntegrationsCDNPath,
  );

/**
 * A function that determines plugins SDK loading path
 * @param currentVersion Current SDK version
 * @param lockPluginsVersion Flag to lock the plugins version
 * @param customPluginsCDNPath URL to load the plugins from
 * @returns Final plugins CDN path
 */
const getPluginsCDNPath = (
  currentVersion: string,
  lockPluginsVersion: boolean,
  customPluginsCDNPath?: string,
): string =>
  getSDKComponentBaseURL(
    'plugins',
    CDN_PLUGINS_DIR,
    PLUGINS_BASE_URL,
    currentVersion,
    lockPluginsVersion,
    customPluginsCDNPath,
  );

export { getIntegrationsCDNPath, getPluginsCDNPath };
