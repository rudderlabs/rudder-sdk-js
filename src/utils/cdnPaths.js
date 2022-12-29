import { getSDKUrlInfo, removeTrailingSlashes } from './utils';
import { handleError } from './errorHandler';
import { CDN_ARCH_VERSION_DIR, CDN_INT_DIR, DEST_SDK_BASE_URL } from './constants';

const getIntegrationsCDNPath = (
  currentVersion,
  lockIntegrationsVersion,
  customIntegrationsCDNPath,
) => {
  let integrationsCDNPath = '';
  const { sdkURL } = getSDKUrlInfo();

  // Get the CDN base URL from the user provided URL if any
  if (customIntegrationsCDNPath) {
    integrationsCDNPath = removeTrailingSlashes(customIntegrationsCDNPath);

    // TODO: add proper url validation
    if (!integrationsCDNPath) {
      handleError({
        message: '[Analytics] load:: CDN base URL is not valid',
      });
      throw Error('Failed to load Rudder SDK from provided URL');
    }

    return integrationsCDNPath;
  }

  // Get the base path from the SDK script tag src attribute or use the default path
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
