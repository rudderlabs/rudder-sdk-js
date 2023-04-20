import { removeDoubleSpaces, trim } from '@rudderstack/analytics-js/components/utilities/string';

describe('Common Utils - String', () => {
  it('should trim string', () => {
    expect(trim('  a a  ')).toBe('a a');
  });
  it('should remove double spaces from string', () => {
    expect(removeDoubleSpaces('  a  a  ')).toBe(' a a ');
  });
});
