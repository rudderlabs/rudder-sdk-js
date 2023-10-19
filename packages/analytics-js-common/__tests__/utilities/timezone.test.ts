import { getTimezone } from '../../src/utilities/timezone';

describe('Common Utils - Timezone', () => {
  it('should return timezone of the user', () => {
    const timezone = getTimezone();
    expect(typeof timezone).toBe('string');
    expect(timezone.startsWith('GMT')).toBe(true);
  });
});
