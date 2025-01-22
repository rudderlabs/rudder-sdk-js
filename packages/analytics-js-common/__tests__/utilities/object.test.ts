// eslint-disable-next-line max-classes-per-file
import {
  mergeDeepRight,
  mergeDeepRightObjectArrays,
  isNonEmptyObject,
  isObjectAndNotNull,
  isObjectLiteralAndNotNull,
  removeUndefinedValues,
  removeUndefinedAndNullValues,
  getNormalizedBooleanValue,
  getNormalizedObjectValue,
} from '../../src/utilities/object';

const identifyTraitsPayloadMock = {
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

const trackTraitsOverridePayloadMock = {
  address: [
    {
      label: 'Head office',
      city: 'NYC',
    },
    {
      label: 'home',
      city: 'Kolkata',
      country: 'India',
      nested: {
        type: 'detached house',
        rooms: [
          {
            name: 'bath',
          },
          {
            name: 'living room',
            size: 'extra large',
          },
        ],
      },
    },
  ],
  stringArray: ['newString1', 'newString2'],
  numberArray: [4, 5],
};

const expectedMergedTraitsPayload = {
  firstName: 'Dummy Name',
  phone: '1234567890',
  email: 'dummy@email.com',
  custom_flavor: 'chocolate',
  custom_date: new Date(2022, 1, 21, 0, 0, 0),
  address: [
    {
      label: 'Head office',
      city: 'NYC',
      country: 'Belgium',
    },
    {
      label: 'home',
      city: 'Kolkata',
      country: 'India',
      nested: {
        type: 'detached house',
        rooms: [
          {
            name: 'bath',
            size: 'small',
          },
          {
            name: 'living room',
            size: 'extra large',
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
  stringArray: ['newString1', 'newString2', 'string3'],
  numberArray: [4, 5, 3],
};

describe('Common Utils - Object', () => {
  describe('mergeDeepRight', () => {
    it('should merge right object array items', () => {
      const mergedArray = mergeDeepRightObjectArrays(
        identifyTraitsPayloadMock.address,
        trackTraitsOverridePayloadMock.address,
      );
      expect(mergedArray).toEqual(expectedMergedTraitsPayload.address);
    });

    it('should merge right non object array items', () => {
      const mergedArray = mergeDeepRightObjectArrays(
        identifyTraitsPayloadMock.stringArray,
        trackTraitsOverridePayloadMock.stringArray,
      );
      const mergedNumberArray = mergeDeepRightObjectArrays(
        identifyTraitsPayloadMock.numberArray,
        trackTraitsOverridePayloadMock.numberArray,
      );
      expect(mergedArray).toEqual(expectedMergedTraitsPayload.stringArray);
      expect(mergedNumberArray).toEqual(expectedMergedTraitsPayload.numberArray);
    });

    it('should merge right nested object properties', () => {
      const mergedArray = mergeDeepRight(identifyTraitsPayloadMock, trackTraitsOverridePayloadMock);
      expect(mergedArray).toEqual(expectedMergedTraitsPayload);
    });
  });

  describe('isObjectAndNotNull', () => {
    it('should detect if value is an Object and not null', () => {
      class DummyClass {}
      const nullCheck = isObjectAndNotNull(null);
      const objCheck = isObjectAndNotNull({});
      const classInstanceCheck = isObjectAndNotNull(new DummyClass());
      const arrayCheck = isObjectAndNotNull([]);
      const functionCheck = isObjectAndNotNull(() => {});
      const dateCheck = isObjectAndNotNull(new Date());
      const errorCheck = isObjectAndNotNull(new Error('error'));
      // eslint-disable-next-line prefer-regex-literals
      const regExpCheck = isObjectAndNotNull(new RegExp(/^a/));
      expect(nullCheck).toBeFalsy();
      expect(objCheck).toBeTruthy();
      expect(classInstanceCheck).toBeTruthy();
      expect(arrayCheck).toBeFalsy();
      expect(functionCheck).toBeFalsy();
      expect(dateCheck).toBeTruthy();
      expect(errorCheck).toBeTruthy();
      expect(regExpCheck).toBeTruthy();
    });
  });

  describe('isObjectLiteralAndNotNull', () => {
    it('should detect if value is an Object and not null', () => {
      class DummyClass {}
      const nullCheck = isObjectLiteralAndNotNull(null);
      const objCheck = isObjectLiteralAndNotNull({});
      const classInstanceCheck = isObjectLiteralAndNotNull(new DummyClass());
      const arrayCheck = isObjectLiteralAndNotNull([]);
      const functionCheck = isObjectLiteralAndNotNull(() => {});
      const dateCheck = isObjectLiteralAndNotNull(new Date());
      const errorCheck = isObjectLiteralAndNotNull(new Error('error'));
      // eslint-disable-next-line prefer-regex-literals
      const regExpCheck = isObjectLiteralAndNotNull(new RegExp(/^a/));
      expect(nullCheck).toBeFalsy();
      expect(objCheck).toBeTruthy();
      expect(classInstanceCheck).toBeTruthy();
      expect(arrayCheck).toBeFalsy();
      expect(functionCheck).toBeFalsy();
      expect(dateCheck).toBeFalsy();
      expect(errorCheck).toBeFalsy();
      expect(regExpCheck).toBeFalsy();
    });
  });

  describe('isNonEmptyObject', () => {
    it('should return true for valid object with data', () => {
      const validObj = {
        key1: 'value',
        key2: 1234567,
      };
      const outcome = isNonEmptyObject(validObj);
      expect(outcome).toEqual(true);
    });

    it('should return false for undefined/null or empty object', () => {
      const outcome1 = isNonEmptyObject(undefined);
      const outcome2 = isNonEmptyObject(null);
      const outcome3 = isNonEmptyObject({});
      expect(outcome1).toEqual(false);
      expect(outcome2).toEqual(false);
      expect(outcome3).toEqual(false);
    });
  });

  describe('removeUndefinedValues', () => {
    it('should remove undefined values from deeply nested object', () => {
      const nestedObj = {
        key1: 'value',
        key2: undefined,
        key3: {
          key4: 'value',
          key5: undefined,
          key6: {
            key7: 'value',
            key8: undefined,
          },
        },
        key9: {
          key10: undefined,
        },
      };
      const outcome = removeUndefinedValues(nestedObj);
      expect(outcome).toStrictEqual({
        key1: 'value',
        key3: {
          key4: 'value',
          key6: {
            key7: 'value',
          },
        },
        key9: {},
      });
    });
  });

  describe('removeUndefinedAndNullValues', () => {
    it('should remove undefined and null values from deeply nested object', () => {
      const nestedObj = {
        key1: 'value',
        key2: undefined,
        key3: {
          key4: 'value',
          key5: undefined,
          key6: {
            key7: 'value',
            key8: undefined,
          },
          key11: null,
        },
        key9: null,
        key10: {
          key11: null,
        },
      };
      const outcome = removeUndefinedAndNullValues(nestedObj);
      expect(outcome).toStrictEqual({
        key1: 'value',
        key3: {
          key4: 'value',
          key6: {
            key7: 'value',
          },
        },
        key10: {},
      });
    });
  });

  describe('getNormalizedObjectValue', () => {
    describe('should return undefined if input value is not an object', () => {
      it('should return undefined for non-object values', () => {
        const outcome1 = getNormalizedObjectValue(undefined);
        const outcome2 = getNormalizedObjectValue(null);
        const outcome3 = getNormalizedObjectValue('string');
        const outcome4 = getNormalizedObjectValue(123456);
        const outcome5 = getNormalizedObjectValue([]);
        expect(outcome1).toEqual(undefined);
        expect(outcome2).toEqual(undefined);
        expect(outcome3).toEqual(undefined);
        expect(outcome4).toEqual(undefined);
        expect(outcome5).toEqual(undefined);
      });

      it('should return undefined for empty object', () => {
        const outcome = getNormalizedObjectValue({});
        expect(outcome).toEqual(undefined);
      });

      it('should return normalized object for valid object', () => {
        const nestedObj = {
          someKey: 'someValue',
          nested: {
            key1: 'value1',
            key2: undefined,
            key3: null,
          },
        };

        const outcome = getNormalizedObjectValue(nestedObj);

        expect(outcome).toStrictEqual({
          someKey: 'someValue',
          nested: {
            key1: 'value1',
          },
        });
      });

      it('should return normalized object for object with undefined and null values recursively', () => {
        const nestedObj = {
          key1: 'value',
          key2: undefined,
          key3: {
            key4: 'value',
            key5: undefined,
            key6: {
              key7: 'value',
              key8: undefined,
            },
            key9: null,
          },
          key10: null,
          key11: {
            key12: null,
          },
        };

        const outcome = getNormalizedObjectValue(nestedObj);

        expect(outcome).toStrictEqual({
          key1: 'value',
          key3: {
            key4: 'value',
            key6: {
              key7: 'value',
            },
          },
          key11: {},
        });
      });
    });
  });

  describe('getNormalizedBooleanValue', () => {
    const tcData = [
      {
        input: [true, undefined],
        output: true,
      },
      {
        input: [false, undefined],
        output: false,
      },
      {
        input: [undefined, true],
        output: true,
      },
      {
        input: [undefined, false],
        output: false,
      },
      {
        input: [true, false],
        output: true,
      },
      {
        input: [false, true],
        output: false,
      },
      {
        input: [undefined, undefined],
        output: false,
      },
      {
        input: [{}, false],
        output: false,
      },
      {
        input: [{}, true],
        output: false,
      },
      {
        input: [{}, undefined],
        output: false,
      },
      {
        input: [[], false],
        output: false,
      },
      {
        input: [[], true],
        output: false,
      },
      {
        input: [[], undefined],
        output: false,
      },
      {
        input: ['string', false],
        output: false,
      },
      {
        input: ['string', true],
        output: false,
      },
      {
        input: ['string', undefined],
        output: false,
      },
      {
        input: [123456, false],
        output: false,
      },
      {
        input: [123456, true],
        output: false,
      },
      {
        input: [123456, undefined],
        output: false,
      },
      {
        input: [new Date(), false],
        output: false,
      },
      {
        input: [new Date(), true],
        output: false,
      },
      {
        input: [new Date(), undefined],
        output: false,
      },
    ];

    it.each(tcData)(
      'should return $output for input $input',
      ({ input, output }: { input: any; output: any }) => {
        const outcome = getNormalizedBooleanValue(input[0], input[1]);
        expect(outcome).toEqual(output);
      },
    );
  });
});
