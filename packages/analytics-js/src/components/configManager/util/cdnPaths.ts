import {
  CDN_ARCH_VERSION_DIR,
  CDN_INT_DIR,
  CDN_PLUGINS_DIR,
  DEST_SDK_BASE_URL,
  PLUGINS_BASE_URL,
} from '@rudderstack/analytics-js/constants/urls';
import { isString } from '@rudderstack/analytics-js/components/utilities/checks';
import { isValidUrl, removeTrailingSlashes } from '../../utilities/url';
import { getSDKUrl } from './commonUtil';

/**
 * A function that determines integration SDK loading path
 * @param requiredVersion
 * @param lockIntegrationsVersion
 * @param customIntegrationsCDNPath
 * @returns
 */
const getIntegrationsCDNPath = (
  requiredVersion: string,
  lockIntegrationsVersion: boolean,
  customIntegrationsCDNPath?: string,
): string => {
  let integrationsCDNPath = '';

  // Get the CDN base URL from the user provided URL if any
  if (customIntegrationsCDNPath) {
    integrationsCDNPath = removeTrailingSlashes(customIntegrationsCDNPath) as string;

    if (!integrationsCDNPath || (integrationsCDNPath && !isValidUrl(integrationsCDNPath))) {
      const errorMsg = 'CDN base URL for integrations is not valid';

      throw Error(`Failed to load RudderStack SDK: ${errorMsg}`);
    }

    return integrationsCDNPath;
  }

  // Get the base path from the SDK script tag src attribute or use the default path
  const sdkURL = getSDKUrl();
  integrationsCDNPath =
    sdkURL && isString(sdkURL)
      ? sdkURL.split('/').slice(0, -1).concat(CDN_INT_DIR).join('/')
      : DEST_SDK_BASE_URL;

  // If version is not locked it will always get the latest version of the integrations
  if (lockIntegrationsVersion) {
    integrationsCDNPath = integrationsCDNPath.replace(CDN_ARCH_VERSION_DIR, requiredVersion);
  }

  return integrationsCDNPath;
};

/**
 * A function that determines plugins SDK loading path
 * @param customPluginsCDNPath
 * @returns
 */
const getPluginsCDNPath = (customPluginsCDNPath?: string): string => {
  let pluginsCDNPath = '';

  // Get the CDN base URL from the user provided URL if any
  if (customPluginsCDNPath) {
    pluginsCDNPath = removeTrailingSlashes(customPluginsCDNPath) as string;

    if (!pluginsCDNPath || (pluginsCDNPath && !isValidUrl(pluginsCDNPath))) {
      const errorMsg = 'CDN base URL for plugins is not valid';

      throw Error(`Failed to load RudderStack SDK: ${errorMsg}`);
    }

    return pluginsCDNPath;
  }

  // Get the base path from the SDK script tag src attribute or use the default path
  const sdkURL = getSDKUrl();
  pluginsCDNPath =
    sdkURL && isString(sdkURL)
      ? sdkURL.split('/').slice(0, -1).concat(CDN_PLUGINS_DIR).join('/')
      : PLUGINS_BASE_URL;

  return pluginsCDNPath;
};

export { getIntegrationsCDNPath, getPluginsCDNPath };
