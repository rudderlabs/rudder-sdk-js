/**
 * Every environment-specific value is read from the environment, so the same suite runs
 * against a local build, staging and production without edits.
 *
 *   RSA_SDK_URL              URL of the SDK bundle to load (CDN or a local build)
 *   RSA_WRITE_KEY            Source write key
 *   RSA_DATA_PLANE_URL       Data plane the SDK sends events to
 *   RSA_DATA_SERVICE_ORIGIN  Origin that answers POST /rsaRequest, proxied to same-site
 *   RSA_DATA_SERVICE_PATH    Endpoint path, if not the default
 *   RSA_HARNESS_PORT         Port the harness serves the test page on
 *   RSA_STUB_SOURCE_CONFIG   'true' to serve a local sourceConfig instead of the real one
 *   RSA_PLUGINS_URL          Base URL for the plugins bundle
 */
const config = {
  sdkUrl: process.env.RSA_SDK_URL ?? 'https://cdn.rudderlabs.com/v3/modern/rsa.min.js',
  writeKey: process.env.RSA_WRITE_KEY ?? 'dummy-write-key',
  dataPlaneUrl: process.env.RSA_DATA_PLANE_URL ?? 'http://localhost:9091',
  dataServiceOrigin: process.env.RSA_DATA_SERVICE_ORIGIN ?? 'http://localhost:9091',
  dataServicePath: process.env.RSA_DATA_SERVICE_PATH ?? 'rsaRequest',
  harnessPort: Number(process.env.RSA_HARNESS_PORT ?? 8080),
  stubSourceConfig: (process.env.RSA_STUB_SOURCE_CONFIG ?? 'true') === 'true',
  // Plugins are fetched relative to the SDK by default, which a locally served core
  // build does not carry, so they are configurable independently
  pluginsUrl: process.env.RSA_PLUGINS_URL ?? 'https://cdn.rudderlabs.com/v3/modern/plugins',
};

config.pageUrl = `http://localhost:${config.harnessPort}/`;

// The SDK derives the data service URL from the page origin, so the endpoint has to be
// reachable on the same origin as the page. The harness proxies it rather than requiring
// the page to be hosted alongside the data service.
config.dataServiceUrl = `${config.pageUrl}${config.dataServicePath}`;

export const COOKIE_NAMES = {
  anonymousId: 'rl_anonymous_id',
  userId: 'rl_user_id',
  userTraits: 'rl_trait',
  groupId: 'rl_group_id',
  groupTraits: 'rl_group_trait',
  initialReferrer: 'rl_page_init_referrer',
  initialReferringDomain: 'rl_page_init_referring_domain',
  sessionInfo: 'rl_session',
  authToken: 'rl_auth_token',
};

export default config;
