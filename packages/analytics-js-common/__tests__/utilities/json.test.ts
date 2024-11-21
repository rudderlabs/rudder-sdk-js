import { clone } from 'ramda';
import {
  stringifyData,
  stringifyWithoutCircular,
} from '../../src/utilities/json';

const identifyTraitsPayloadMock: Record<string, any> = {
  firstName: 'Dummy Name',
  phone: '1234567890',
  email: 'dummy@email.com',
  custom_flavor: 'chocolate',
  custom_date: new Date(2022, 1, 21, 0, 0, 0),
  address: [
    {
      label: 'office',
      city: 'Brussels',
      country: 'Belgium',
    },
    {
      label: 'home',
      city: 'Kolkata',
      country: 'India',
      nested: {
        type: 'flat',
        rooms: [
          {
            name: 'kitchen',
            size: 'small',
          },
          {
            // eslint-disable-next-line sonarjs/no-duplicate-string
            name: 'living room',
            size: 'large',
          },
          {
            name: 'bedroom',
            size: 'large',
          },
        ],
      },
    },
    {
      label: 'work',
      city: 'Kolkata',
      country: 'India',
    },
  ],
  stringArray: ['string1', 'string2', 'string3'],
  numberArray: [1, 2, 3],
};

const circularReferenceNotice = '[Circular Reference]';
const bigIntNotice = '[BigInt]';

describe('Common Utils - JSON', () => {
  describe('stringifyWithoutCircular', () => {
    it('should stringify json with circular references', () => {
      const objWithCircular = clone(identifyTraitsPayloadMock);
      objWithCircular.myself = objWithCircular;

      const json = stringifyWithoutCircular(objWithCircular);
      expect(json).toContain(circularReferenceNotice);
    });

    it('should stringify json with circular references and exclude null values', () => {
      const objWithCircular = clone(identifyTraitsPayloadMock);
      objWithCircular.myself = objWithCircular;
      objWithCircular.keyToExclude = null;
      objWithCircular.keyToNotExclude = '';

      const json = stringifyWithoutCircular(objWithCircular, true);
      expect(json).toContain(circularReferenceNotice);
      expect(json).not.toContain('keyToExclude');
      expect(json).toContain('keyToNotExclude');
    });

    it('should stringify json with out circular references', () => {
      const objWithoutCircular = clone(identifyTraitsPayloadMock);
      objWithoutCircular.myself = {};

      const json = stringifyWithoutCircular(objWithoutCircular);
      expect(json).not.toContain(circularReferenceNotice);
    });

    it('should stringify json with out circular references and reused objects', () => {
      const objWithoutCircular = clone(identifyTraitsPayloadMock);
      const reusableArray = [1, 2, 3];
      const reusableObject = { dummy: 'val' };
      objWithoutCircular.reused = reusableArray;
      objWithoutCircular.reusedAgain = [1, 2, reusableArray];
      objWithoutCircular.reusedObj = reusableObject;
      objWithoutCircular.reusedObjAgain = { reused: reusableObject };
      objWithoutCircular.reusedObjAgainWithItself = { reused: reusableObject };

      const json = stringifyWithoutCircular(objWithoutCircular);
      expect(json).not.toContain(circularReferenceNotice);
    });

    it('should stringify json with circular references for nested circular objects', () => {
      const objWithoutCircular = clone(identifyTraitsPayloadMock);
      const reusableObject = { dummy: 'val' };
      const objWithCircular = clone(reusableObject);
      objWithCircular.myself = objWithCircular;
      objWithoutCircular.reusedObjAgainWithItself = { reused: reusableObject };
      objWithoutCircular.objWithCircular = objWithCircular;

      const json = stringifyWithoutCircular(objWithoutCircular);
      expect(json).toContain(circularReferenceNotice);
    });

    it('should stringify json for all input types', () => {
      const array = [1, 2, 3];
      const number = 1;
      const string = '';
      const object = {};
      const date = new Date(2023, 1, 20, 0, 0, 0);

      const arrayJson = stringifyWithoutCircular(array);
      const numberJson = stringifyWithoutCircular(number);
      const stringJson = stringifyWithoutCircular(string);
      const objectJson = stringifyWithoutCircular(object);
      const dateJson = stringifyWithoutCircular(date);
      const nullJson = stringifyWithoutCircular(null);
      const undefinedJson = stringifyWithoutCircular(undefined);

      expect(arrayJson).toBe('[1,2,3]');
      expect(numberJson).toBe('1');
      expect(stringJson).toBe('""');
      expect(objectJson).toBe('{}');
      expect(dateJson).toBe('"2023-02-19T18:30:00.000Z"');
      expect(nullJson).toBe('null');
      expect(undefinedJson).toBe(undefined);
    });

    it('should stringify json after removing the exclude keys', () => {
      const objWithoutCircular = clone(identifyTraitsPayloadMock);

      const json = stringifyWithoutCircular(objWithoutCircular, true, ['size', 'city']);
      expect(json).not.toContain('size');
      expect(json).not.toContain('city');
    });

    it('should return null for input containing BigInt values', () => {
      const mockLogger = {
        warn: jest.fn(),
      };

      const objWithBigInt = {
        bigInt: BigInt(9007199254740991),
      };
      const json = stringifyWithoutCircular(objWithBigInt, false, [], mockLogger);
      expect(json).toBe(null);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Failed to convert the value to a JSON string.',
        new TypeError('Do not know how to serialize a BigInt'),
      );
    });
  });

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

  describe.skip('getSanitizedValue', () => {
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

    it.skip('should sanitize json after replacing BigInt and circular references', () => {
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

    it.skip('should sanitize json even if it contains reused objects', () => {
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
