import { clone } from 'ramda';
import { stringifyWithoutCircular } from '@rudderstack/analytics-js-common/utilities/json';

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
});
