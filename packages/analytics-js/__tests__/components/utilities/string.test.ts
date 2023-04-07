import { trim } from '@rudderstack/analytics-js/components/utilities/string';

describe('Common Utils - String', () => {
  it('should trim string', () => {
    expect(trim('  a a  ')).toBe('a a');
  });
});
