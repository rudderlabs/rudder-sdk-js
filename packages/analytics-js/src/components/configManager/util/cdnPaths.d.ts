/**
 * A function that determines integration SDK loading path
 * @param requiredVersion
 * @param lockIntegrationsVersion
 * @param customIntegrationsCDNPath
 * @returns
 */
declare const getIntegrationsCDNPath: (
  requiredVersion: string,
  lockIntegrationsVersion: boolean,
  customIntegrationsCDNPath?: string,
) => string;
/**
 * A function that determines plugins SDK loading path
 * @param customPluginsCDNPath
 * @returns
 */
declare const getPluginsCDNPath: (customPluginsCDNPath?: string) => string;
export { getIntegrationsCDNPath, getPluginsCDNPath };
