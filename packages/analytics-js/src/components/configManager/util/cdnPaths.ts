import { CDN_INT_DIR, CDN_PLUGINS_DIR } from '@rudderstack/analytics-js-common/constants/urls';
import { isValidURL } from '@rudderstack/analytics-js-common/utilities/url';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { CONFIG_MANAGER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
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
  customURL: string | undefined,
  logger: ILogger,
): Nullable<string> => {
  let sdkComponentURL = '';

  if (customURL) {
    if (!isValidURL(customURL)) {
      logger.error(COMPONENT_BASE_URL_ERROR(CONFIG_MANAGER, componentType, customURL));
      return null;
    }

    return removeTrailingSlashes(customURL) as string;
  }

  const sdkURL = getSDKUrl();
  sdkComponentURL = sdkURL ? sdkURL.split('/').slice(0, -1).concat(pathSuffix).join('/') : baseURL;

  if (lockVersion) {
    sdkComponentURL = sdkComponentURL.replace(
      `/${CDN_ARCH_VERSION_DIR}/${BUILD_TYPE}/${pathSuffix}`,
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
 * @param logger Logger instance
 * @returns
 */
const getIntegrationsCDNPath = (
  currentVersion: string,
  lockIntegrationsVersion: boolean,
  customIntegrationsCDNPath: string | undefined,
  logger: ILogger,
): Nullable<string> =>
  getSDKComponentBaseURL(
    'integrations',
    CDN_INT_DIR,
    DEST_SDK_BASE_URL,
    currentVersion,
    lockIntegrationsVersion,
    customIntegrationsCDNPath,
    logger,
  );

/**
 * A function that determines plugins SDK loading path
 * @param currentVersion Current SDK version
 * @param lockPluginsVersion Flag to lock the plugins version
 * @param customPluginsCDNPath URL to load the plugins from
 * @param logger Logger instance
 * @returns Final plugins CDN path
 */
const getPluginsCDNPath = (
  currentVersion: string,
  lockPluginsVersion: boolean,
  customPluginsCDNPath: string | undefined,
  logger: ILogger,
): Nullable<string> =>
  getSDKComponentBaseURL(
    'plugins',
    CDN_PLUGINS_DIR,
    PLUGINS_BASE_URL,
    currentVersion,
    lockPluginsVersion,
    customPluginsCDNPath,
    logger,
  );

export { getIntegrationsCDNPath, getPluginsCDNPath };
