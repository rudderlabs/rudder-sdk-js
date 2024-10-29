import { stringifyData, getSanitizedValue } from '../../src/utilities/json';

const circularReferenceNotice = '[Circular Reference]';
const bigIntNotice = '[BigInt]';

describe('Common Utils - JSON', () => {
  describe('stringifyData', () => {
    it('should stringify json excluding null values', () => {
      // Define an object with null values in multiple levels along with other data types
      const obj = {
        key1: 'value1',
        key2: null,
        key3: {
          key4: null,
          key5: 'value5',
          key10: undefined,
          key6: {
            key7: null,
            key8: 'value8',
            key9: undefined,
            key11: [1, 2, null, 3],
          },
        },
      };

      expect(stringifyData(obj)).toBe(
        '{"key1":"value1","key3":{"key5":"value5","key6":{"key8":"value8","key11":[1,2,null,3]}}}',
      );
    });

    it('should stringify json without excluding null values', () => {
      // Define an object with null values in multiple levels along with other data types
      const obj = {
        key1: 'value1',
        key2: null,
        key3: {
          key4: null,
          key5: 'value5',
          key6: {
            key7: null,
            key8: 'value8',
          },
        },
      };

      expect(stringifyData(obj, false)).toBe(
        '{"key1":"value1","key2":null,"key3":{"key4":null,"key5":"value5","key6":{"key7":null,"key8":"value8"}}}',
      );
    });

    it('should stringify json after excluding certain keys', () => {
      // Define an object with null values in multiple levels along with other data types
      const obj = {
        key1: 'value1',
        key2: null,
        key3: {
          key4: null,
          key5: 'value5',
          key6: {
            key7: null,
            key8: 'value8',
          },
        },
      };

      const keysToExclude = ['key1', 'key7'];

      expect(stringifyData(obj, true, keysToExclude)).toBe(
        '{"key3":{"key5":"value5","key6":{"key8":"value8"}}}',
      );

      expect(stringifyData(obj, false, keysToExclude)).toBe(
        '{"key2":null,"key3":{"key4":null,"key5":"value5","key6":{"key8":"value8"}}}',
      );
    });
  });

  describe('getSanitizedValue', () => {
    const mockLogger = {
      warn: jest.fn(),
    };

    it('should sanitize json without excluding null and undefined values', () => {
      const obj = {
        a: 1,
        b: null,
        c: 'value',
        d: undefined,
        i: () => {},
        e: {
          f: 2,
          g: null,
          h: 'value',
          i: undefined,
          j: {
            k: 3,
            l: null,
            m: 'value',
            n: [1, 2, 3],
            o: [1, 2, 3, new Date()],
            s: () => {},
          },
        },
      };

      expect(getSanitizedValue(obj)).toEqual(obj);
    });

    it('should sanitize json after replacing BigInt and circular references', () => {
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

      obj.myself = obj;
      obj.d.myself2 = obj.d;
      obj.d.h.myself3 = obj.d;

      expect(getSanitizedValue(obj, mockLogger)).toEqual({
        a: bigIntNotice,
        c: 'value',
        b: undefined,
        myself: circularReferenceNotice,
        d: {
          e: bigIntNotice,
          g: 'value',
          f: undefined,
          myself2: circularReferenceNotice,
          h: {
            i: bigIntNotice,
            k: 'value',
            j: undefined,
            myself3: circularReferenceNotice,
          },
        },
      });

      expect(mockLogger.warn).toHaveBeenCalledTimes(6);

      expect(mockLogger.warn).toHaveBeenNthCalledWith(
        1,
        'JSON:: A bad data (like circular reference, BigInt) has been detected in the object and the property "a" has been dropped from the output.',
      );

      expect(mockLogger.warn).toHaveBeenNthCalledWith(
        2,
        'JSON:: A bad data (like circular reference, BigInt) has been detected in the object and the property "e" has been dropped from the output.',
      );

      expect(mockLogger.warn).toHaveBeenNthCalledWith(
        3,
        'JSON:: A bad data (like circular reference, BigInt) has been detected in the object and the property "i" has been dropped from the output.',
      );

      expect(mockLogger.warn).toHaveBeenNthCalledWith(
        4,
        'JSON:: A bad data (like circular reference, BigInt) has been detected in the object and the property "myself3" has been dropped from the output.',
      );

      expect(mockLogger.warn).toHaveBeenNthCalledWith(
        5,
        'JSON:: A bad data (like circular reference, BigInt) has been detected in the object and the property "myself2" has been dropped from the output.',
      );

      expect(mockLogger.warn).toHaveBeenNthCalledWith(
        6,
        'JSON:: A bad data (like circular reference, BigInt) has been detected in the object and the property "myself" has been dropped from the output.',
      );
    });

    it('should sanitize json even if it contains reused objects', () => {
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

      const reusableArray = [1, 2, 3];
      const reusableObject = { dummy: 'val' };
      obj.reused = reusableArray;
      obj.reusedAgain = [1, 2, reusableArray];
      obj.reusedObj = reusableObject;
      obj.reusedObjAgain = { reused: reusableObject };

      obj.d.reused = reusableArray;
      obj.d.h.reused = reusableObject;
      obj.d.h.reusedAgain = [1, 2, reusableArray];

      expect(getSanitizedValue(obj)).toEqual({
        a: bigIntNotice,
        c: 'value',
        b: undefined,
        reused: [1, 2, 3],
        reusedAgain: [1, 2, [1, 2, 3]],
        reusedObj: { dummy: 'val' },
        reusedObjAgain: { reused: { dummy: 'val' } },
        d: {
          e: bigIntNotice,
          g: 'value',
          f: undefined,
          reused: [1, 2, 3],
          h: {
            i: bigIntNotice,
            k: 'value',
            j: undefined,
            reused: { dummy: 'val' },
            reusedAgain: [1, 2, [1, 2, 3]],
          },
        },
      });
    });

    it('should sanitize all data types', () => {
      const array = [1, 2, 3];
      const number = 1;
      const string = '';
      const object = {};
      const date = new Date(2023, 1, 20, 0, 0, 0);

      expect(getSanitizedValue(array)).toEqual(array);
      expect(getSanitizedValue(number)).toEqual(number);
      expect(getSanitizedValue(string)).toEqual(string);
      expect(getSanitizedValue(object)).toEqual(object);
      expect(getSanitizedValue(date)).toEqual(date);
      expect(getSanitizedValue(null)).toEqual(null);
      expect(getSanitizedValue(undefined)).toEqual(undefined);
    });
  });
});
