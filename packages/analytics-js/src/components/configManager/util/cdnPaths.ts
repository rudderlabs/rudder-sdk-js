import { CDN_INT_DIR, CDN_PLUGINS_DIR } from '@rudderstack/analytics-js-common/constants/urls';
import { isValidURL } from '@rudderstack/analytics-js-common/utilities/url';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { CONFIG_MANAGER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import {
  BUILD_TYPE,
  CDN_ARCH_VERSION_DIR,
  DEFAULT_INTEGRATION_SDKS_URL,
  DEFAULT_PLUGINS_URL,
} from '../../../constants/urls';
import { COMPONENT_BASE_URL_ERROR } from '../../../constants/logMessages';
import { removeTrailingSlashes } from '../../utilities/url';
import { getSDKUrl } from './commonUtil';
import { state } from '../../../state';

/**
 * A function that determines the base URL for the integrations or plugins SDK
 * @param componentType The type of the component (integrations or plugins)
 * @param pathSuffix The path suffix to be appended to the base URL (js-integrations or plugins)
 * @param defaultComponentUrl The default URL to be used if the user has not provided a custom URL
 * @param currentSdkVersion The current version of the SDK
 * @param lockVersion Flag to lock the version of the component
 * @param urlFromLoadOptions The URL provided by the user in the load options
 * @param logger Logger instance
 * @returns The base URL for the integrations or plugins SDK
 */
const getSDKComponentBaseURL = (
  componentType: string,
  pathSuffix: string,
  defaultComponentUrl: string,
  currentSdkVersion: string,
  lockVersion: boolean,
  urlFromLoadOptions: string | undefined,
  logger: ILogger,
): Nullable<string> => {
  let sdkComponentBaseURL;
  // If the user has provided a custom URL, then validate, clean up and use it
  if (urlFromLoadOptions) {
    if (!isValidURL(urlFromLoadOptions)) {
      logger.error(COMPONENT_BASE_URL_ERROR(CONFIG_MANAGER, componentType, urlFromLoadOptions));
      return null;
    }

    sdkComponentBaseURL = removeTrailingSlashes(urlFromLoadOptions) as string;
  } else {
    sdkComponentBaseURL = defaultComponentUrl;

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
      `/${currentSdkVersion}/${BUILD_TYPE}/${pathSuffix}`,
    );
  }

  return sdkComponentBaseURL;
};

/**
 * A function that determines integration SDK loading path
 * @param currentSdkVersion Current SDK version
 * @param lockIntegrationsVersion Flag to lock the integrations version
 * @param integrationsUrlFromLoadOptions URL to load the integrations from as provided by the user
 * @param logger Logger instance
 * @returns
 */
const getIntegrationsCDNPath = (
  currentSdkVersion: string,
  lockIntegrationsVersion: boolean,
  integrationsUrlFromLoadOptions: string | undefined,
  logger: ILogger,
): Nullable<string> =>
  getSDKComponentBaseURL(
    'integrations',
    CDN_INT_DIR,
    DEFAULT_INTEGRATION_SDKS_URL,
    currentSdkVersion,
    lockIntegrationsVersion,
    integrationsUrlFromLoadOptions,
    logger,
  );

/**
 * A function that determines plugins SDK loading path
 * @param currentSdkVersion Current SDK version
 * @param lockPluginsVersion Flag to lock the plugins version
 * @param pluginsUrlFromLoadOptions URL to load the plugins from as provided by the user
 * @param logger Logger instance
 * @returns Final plugins CDN path
 */
const getPluginsCDNPath = (
  currentSdkVersion: string,
  lockPluginsVersion: boolean,
  pluginsUrlFromLoadOptions: string | undefined,
  logger: ILogger,
): Nullable<string> =>
  getSDKComponentBaseURL(
    'plugins',
    CDN_PLUGINS_DIR,
    DEFAULT_PLUGINS_URL,
    currentSdkVersion,
    lockPluginsVersion,
    pluginsUrlFromLoadOptions,
    logger,
  );

export { getIntegrationsCDNPath, getPluginsCDNPath };
