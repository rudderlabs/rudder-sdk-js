import { removeDoubleSpaces,  trim, tryStringify } from '@rudderstack/analytics-js/components/utilities/string';

describe('Common Utils - String', () => {
  it('should trim string', () => {
    expect(trim('  a a  ')).toBe('a a');
  });

  it('should remove double spaces from string', () => {
    expect(removeDoubleSpaces('  a  a  ')).toBe(' a a ');
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

  it('should return null if value contains circular dependency in the object', () => {
    function Foo() {
      this.abc = 'Hello';
      this.circular = this;
    }

    const foo = new Foo();
    expect(tryStringify(foo)).toBe(null);
  });

  it('should return null if for BigInt values', () => {
    // JSON.stringify fails for BigInt values
    expect(tryStringify(BigInt(9007199254740991))).toBe(null);
  });
});
