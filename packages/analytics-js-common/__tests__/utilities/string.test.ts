import {
  removeDoubleSpaces,
  tryStringify,
  toBase64,
  fromBase64,
  removeLeadingPeriod,
} from '../../src/utilities/string';

describe('Common Utils - String', () => {
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

  it('should return null if value contains circular dependency in the object or errors', () => {
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

  describe('toBase64', () => {
    it('should convert string to base64', () => {
      expect(toBase64('abc')).toBe('YWJj');
    });

    it('should convert string with special characters to base64', () => {
      expect(toBase64('abc!@#$%^&*()_+')).toBe('YWJjIUAjJCVeJiooKV8r');
    });

    it('should convert string with unicode characters to base64', () => {
      expect(toBase64('你好')).toBe('5L2g5aW9');
    });

    it('should convert string with unicode characters and special characters to base64', () => {
      expect(toBase64('你好!@#$%^&*()_+310')).toBe('5L2g5aW9IUAjJCVeJiooKV8rMzEw');
    });

    it('should convert string with emoji to base64', () => {
      expect(toBase64('👋')).toBe('8J+Riw==');
    });
  });

  describe('fromBase64', () => {
    it('should convert base64 to string', () => {
      expect(fromBase64('YWJj')).toBe('abc');
    });

    it('should convert base64 with special characters to string', () => {
      expect(fromBase64('YWJjIUAjJCVeJiooKV8r')).toBe('abc!@#$%^&*()_+');
    });

    it('should convert base64 with unicode characters to string', () => {
      expect(fromBase64('5L2g5aW9')).toBe('你好');
    });

    it('should convert base64 with unicode characters and special characters to string', () => {
      expect(fromBase64('5L2g5aW9IUAjJCVeJiooKV8rMzEw')).toBe('你好!@#$%^&*()_+310');
    });

    it('should convert base64 with emoji to string', () => {
      expect(fromBase64('8J+Riw==')).toBe('👋');
    });
  });

  describe('removeLeadingPeriod', () => {
    it('should remove leading dot from the string if any', () => {
      expect(removeLeadingPeriod('.sample')).toBe('sample');
      expect(removeLeadingPeriod('sample.')).toBe('sample.');
      expect(removeLeadingPeriod('..sample')).toBe('sample');
      expect(removeLeadingPeriod('sample')).toBe('sample');
      expect(removeLeadingPeriod('sample.com')).toBe('sample.com');
    });
  });
});
