import {
  CDN_ARCH_VERSION_DIR,
  CDN_INT_DIR,
  DEST_SDK_BASE_URL,
} from '@rudderstack/analytics-js/constants/urls';
import { getSDKUrlInfo, removeTrailingSlashes } from './commonUtil';

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
  customIntegrationsCDNPath: string | undefined,
): string => {
  let integrationsCDNPath = '';

  // Get the CDN base URL from the user provided URL if any
  if (customIntegrationsCDNPath) {
    integrationsCDNPath = removeTrailingSlashes(customIntegrationsCDNPath) as string;

    // TODO: add proper url validation
    if (!integrationsCDNPath) {
      const errorMsg = 'CDN base URL for integrations is not valid';

      throw Error(`Failed to load Rudder SDK: ${errorMsg}`);
    }

    return integrationsCDNPath;
  }

  // Get the base path from the SDK script tag src attribute or use the default path
  const { sdkURL } = getSDKUrlInfo();
  integrationsCDNPath = sdkURL
    ? sdkURL.split('/').slice(0, -1).concat(CDN_INT_DIR).join('/')
    : DEST_SDK_BASE_URL;

  // If version is not locked it will always get the latest version of the integrations
  if (lockIntegrationsVersion) {
    integrationsCDNPath = integrationsCDNPath.replace(CDN_ARCH_VERSION_DIR, currentVersion);
  }

  return integrationsCDNPath;
};

export { getIntegrationsCDNPath };
