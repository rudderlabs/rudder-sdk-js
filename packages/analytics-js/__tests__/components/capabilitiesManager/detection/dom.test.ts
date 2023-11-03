import {
  isDatasetAvailable,
  isLegacyJSEngine,
} from '../../../../src/components/capabilitiesManager/detection/dom';

describe('Capabilities Detection - DOM', () => {
  it('should detect dataset', () => {
    expect(isDatasetAvailable()).toBeTruthy();
  });
  it('should detect not supported javascript features', () => {
    navigator.sendBeacon = jest.fn();
    expect(isLegacyJSEngine()).toBeFalsy();
  });
});
