import {
  hasCrypto,
  isBrowser,
  isNode,
  getUserAgent,
  hasUAClientHints,
  getLanguage,
} from '@rudderstack/analytics-js/components/capabilitiesManager/detection/browser';

describe('Capabilities Detection - Browser', () => {
  it('should detect browser', () => {
    expect(isBrowser()).toBeTruthy();
  });
  it('should detect node', () => {
    expect(isNode()).toBeTruthy();
  });
  it('should detect hasCrypto', () => {
    expect(hasCrypto()).toBeTruthy();
  });
  it('should detect Client Hints', () => {
    expect(hasUAClientHints()).toBeFalsy();
  });
  it('should get User Agent', () => {
    expect(getUserAgent()).toBe(
      'Mozilla/5.0 (darwin) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/20.0.3',
    );
  });
  it('should get browser language', () => {
    expect(getLanguage()).toBe('en-US');
  });
});
