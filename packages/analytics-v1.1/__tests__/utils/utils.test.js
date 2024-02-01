/* eslint-disable sonarjs/no-duplicate-string */
import { fetchCookieConsentState, getConfigUrl } from '../../src/utils/utils';

describe('Utilities for cookie consent management', () => {
  it('should return false when cookie consent is not enabled for OneTrust', () => {
    const cookieConsentOptions = {
      oneTrust: {
        enabled: false,
      },
    };
    const actualState = fetchCookieConsentState(cookieConsentOptions);
    expect(actualState).toEqual(false);
  });
  it('should return false when cookie consent is not enabled for OneTrust', () => {
    const cookieConsentOptions = {
      oneTrust: {
        test: false,
      },
    };
    const actualState = fetchCookieConsentState(cookieConsentOptions);
    expect(actualState).toEqual(false);
  });
  it('should return false when cookie consent load option is set as number', () => {
    const cookieConsentOptions = 1234567;
    const actualState = fetchCookieConsentState(cookieConsentOptions);
    expect(actualState).toEqual(false);
  });
  it('should return false when cookie consent load option is set as string', () => {
    const cookieConsentOptions = 'test';
    const actualState = fetchCookieConsentState(cookieConsentOptions);
    expect(actualState).toEqual(false);
  });
  it('should return false when cookie consent load option is empty object', () => {
    const actualState = fetchCookieConsentState({});
    expect(actualState).toEqual(false);
  });
  it('should return true when cookie consent is enabled for OneTrust', () => {
    const cookieConsentOptions = {
      oneTrust: {
        enabled: true,
      },
    };
    const actualState = fetchCookieConsentState(cookieConsentOptions);
    expect(actualState).toEqual(true);
  });
});

describe('getConfigUrl', () => {
  const DEF_CONFIG_URL =
    'https://api.rudderstack.com/sourceConfig/?p=__MODULE_TYPE__&v=__PACKAGE_VERSION__';
  it('should return default config URL if no parameters are provided', () => {
    const configUrl = getConfigUrl();
    expect(configUrl).toEqual(DEF_CONFIG_URL);
  });
  it('should return config url with provided arguments as query parameters', () => {
    const configUrl = getConfigUrl('test', 'test');
    expect(configUrl).toEqual(`${DEF_CONFIG_URL}&writeKey=test&lockIntegrationsVersion=test`);
  });

  it('should return config url if only write key is provided', () => {
    const configUrl = getConfigUrl('test');
    expect(configUrl).toEqual(`${DEF_CONFIG_URL}&writeKey=test`);
  });

  it('should return config url if only lockIntegrationsVersion is provided', () => {
    const configUrl = getConfigUrl(undefined, 'test');
    expect(configUrl).toEqual(`${DEF_CONFIG_URL}&lockIntegrationsVersion=test`);
  });
});
