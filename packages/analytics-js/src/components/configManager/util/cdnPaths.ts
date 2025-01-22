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
import { state } from '../../../state';

const getSDKComponentBaseURL = (
  componentType: string,
  pathSuffix: string,
  baseURL: string,
  currentVersion: string,
  lockVersion: boolean,
  customURL?: string,
) => {
  let sdkComponentBaseURL;
  // If the user has provided a custom URL, then validate, clean up and use it
  if (customURL) {
    if (!isValidURL(customURL)) {
      throw new Error(COMPONENT_BASE_URL_ERROR(componentType, customURL));
    }

    sdkComponentBaseURL = removeTrailingSlashes(customURL) as string;
  } else {
    sdkComponentBaseURL = baseURL;

    // We can automatically determine the base URL only for CDN installations
    if (state.context.app.value.installType === 'cdn') {
      const sdkURL = getSDKUrl();

      if (sdkURL) {
        // Extract the base URL from the core SDK file URL
        // and append the path suffix to it
        sdkComponentBaseURL = sdkURL.split('/').slice(0, -1).concat(pathSuffix).join('/');
      }
    }
  }

  // If the version needs to be locked, then replace the major version in the URL
  // with the current version of the SDK
  if (lockVersion) {
    sdkComponentBaseURL = sdkComponentBaseURL.replace(
      new RegExp(`/${CDN_ARCH_VERSION_DIR}/${BUILD_TYPE}/${pathSuffix}$`),
      `/${currentVersion}/${BUILD_TYPE}/${pathSuffix}`,
    );
  }

  return sdkComponentBaseURL;
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
