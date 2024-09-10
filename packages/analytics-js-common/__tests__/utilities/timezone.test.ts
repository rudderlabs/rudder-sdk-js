import { getTimezone } from '../../src/utilities/timezone';

describe('Common Utils - Timezone', () => {
  it('should return timezone of the user', () => {
    const timezone = getTimezone();
    expect(typeof timezone).toBe('string');
    expect(timezone.startsWith('GMT')).toBe(true);
  });

  it('should return NA if timezone is not found', () => {
    jest.spyOn(Date.prototype, 'toString').mockImplementation(() => '');

    const timezone = getTimezone();
    expect(timezone).toBe('NA');

    jest.spyOn(Date.prototype, 'toString').mockRestore();
  });
});
