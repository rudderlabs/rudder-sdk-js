import {
  hasCrypto,
  isBrowser,
  isNode,
  hasUAClientHints,
} from '../../../../src/components/capabilitiesManager/detection/browser';

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
});
