import { isEvent } from '../../../src/components/utilities/event';

describe('Common Utils - Event', () => {
  it('should check if is Event or Error', () => {
    expect(isEvent(new Event('dummyEvent'))).toBeTruthy();
    expect(isEvent(new Error('dummyEvent'))).toBeFalsy();
  });
});
