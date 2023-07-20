/* eslint-disable sonarjs/no-duplicate-string */
import * as utils from '../../src/utils/utils';

describe('Utilities for cookie consent management', () => {
  it('should return false when cookie consent is not enabled for OneTrust', () => {
    const cookieConsentOptions = {
      oneTrust: {
        enabled: false,
      },
    };
    const actualState = utils.fetchCookieConsentState(cookieConsentOptions);
    expect(actualState).toEqual(false);
  });
  it('should return false when cookie consent is not enabled for OneTrust', () => {
    const cookieConsentOptions = {
      oneTrust: {
        test: false,
      },
    };
    const actualState = utils.fetchCookieConsentState(cookieConsentOptions);
    expect(actualState).toEqual(false);
  });
  it('should return false when cookie consent load option is set as number', () => {
    const cookieConsentOptions = 1234567;
    const actualState = utils.fetchCookieConsentState(cookieConsentOptions);
    expect(actualState).toEqual(false);
  });
  it('should return false when cookie consent load option is set as string', () => {
    const cookieConsentOptions = 'test';
    const actualState = utils.fetchCookieConsentState(cookieConsentOptions);
    expect(actualState).toEqual(false);
  });
  it('should return false when cookie consent load option is empty object', () => {
    const actualState = utils.fetchCookieConsentState({});
    expect(actualState).toEqual(false);
  });
  it('should return true when cookie consent is enabled for OneTrust', () => {
    const cookieConsentOptions = {
      oneTrust: {
        enabled: true,
      },
    };
    const actualState = utils.fetchCookieConsentState(cookieConsentOptions);
    expect(actualState).toEqual(true);
  });
});
