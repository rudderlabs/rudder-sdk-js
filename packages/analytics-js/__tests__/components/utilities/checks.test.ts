import { isFunction } from '@rudderstack/analytics-js/components/utilities/checks';

describe('Common Utils - Checks', () => {
  it('should check if value is function', () => {
    expect(isFunction(() => {})).toBeTruthy();
    expect(isFunction('')).toBeFalsy();
  });
});
