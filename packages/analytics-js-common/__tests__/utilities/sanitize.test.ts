import { getSanitizedValue } from '../../src/utilities/sanitize';

describe('Common Utils - Sanitize', () => {
  describe('getSanitizedValue', () => {
    const mockLogger = {
      warn: jest.fn(),
    };

    it('should return value without circular references replaced', () => {
      const objWithCircular = { a: 1 };
      objWithCircular.myself = objWithCircular;
      objWithCircular.b = {
        myself2: objWithCircular,
      };

      const sanitizedValue = getSanitizedValue(objWithCircular, mockLogger);
      expect(sanitizedValue).toEqual({
        a: 1,
        myself: '[Circular Reference]',
        b: { myself2: '[Circular Reference]' },
      });

      expect(mockLogger.warn).toHaveBeenNthCalledWith(
        1,
        'JSONStringify:: A circular reference has been detected in the object and the property "myself" has been dropped from the output.',
      );
      expect(mockLogger.warn).toHaveBeenNthCalledWith(
        2,
        'JSONStringify:: A circular reference has been detected in the object and the property "myself2" has been dropped from the output.',
      );
    });

    it('should return value without BigInt and undefined values', () => {
      // Define object with BigInt and undefined values in root and nested levels
      const obj = {
        a: BigInt(1),
        b: undefined,
        c: 'value',
        d: {
          e: BigInt(2),
          f: undefined,
          g: 'value',
          h: {
            i: BigInt(3),
            j: undefined,
            k: 'value',
          },
        },
      };

      const sanitizedValue = getSanitizedValue(obj);
      expect(sanitizedValue).toEqual({
        c: 'value',
        d: {
          g: 'value',
          h: {
            k: 'value',
          },
        },
      });
    });

    it('should not remove null values', () => {
      const obj = {
        a: null,
        b: 'value',
        c: {
          d: null,
          e: 'value',
        },
      };

      const sanitizedValue = getSanitizedValue(obj);
      expect(sanitizedValue).toEqual({
        a: null,
        b: 'value',
        c: {
          d: null,
          e: 'value',
        },
      });
    });
  });
});
