import { trim, tryStringify } from '@rudderstack/analytics-js/components/utilities/string';

describe('Common Utils - String', () => {
  it('should trim string', () => {
    expect(trim('  a a  ')).toBe('a a');
  });

  it('should stringify object', () => {
    expect(tryStringify({ a: 1 })).toBe('{"a":1}');
  });

  it('should not stringify string', () => {
    expect(tryStringify('a')).toBe('a');
  });

  it('should not stringify undefined', () => {
    expect(tryStringify(undefined)).toBe(undefined);
  });

  it('should not stringify null', () => {
    expect(tryStringify(null)).toBe(null);
  });

  it('should stringify number', () => {
    expect(tryStringify(1)).toBe('1');
  });

  it('should stringify boolean', () => {
    expect(tryStringify(true)).toBe('true');
  });

  it('should stringify array', () => {
    expect(tryStringify([1, 2, 3])).toBe('[1,2,3]');
  });
});
