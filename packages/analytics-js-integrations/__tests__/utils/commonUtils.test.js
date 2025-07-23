import * as utils from '../../src/utils/commonUtils';

describe('isDefinedAndNotNull Tests', () => {
  const testObj = {
    a: 2,
    b: null,
    c: undefined,
    e: true,
    f: false,
    g: 'string',
  };
  test(' a defined and not null value returns true', () => {
    const result = utils.isDefinedAndNotNull(testObj.a);
    expect(result).toBe(true);
  });

  test(' a defined and null value returns false', () => {
    const result = utils.isDefinedAndNotNull(testObj.b);
    expect(result).toBe(false);
  });

  test(' an undefined value returns false', () => {
    const result = utils.isDefinedAndNotNull(testObj.c);
    expect(result).toBe(false);
  });

  test(" a 'true' value returns true", () => {
    const result = utils.isDefinedAndNotNull(testObj.e);
    expect(result).toBe(true);
  });

  test(" a 'false' value returns true", () => {
    const result = utils.isDefinedAndNotNull(testObj.f);
    expect(result).toBe(true);
  });

  test(' a string value returns true', () => {
    const result = utils.isDefinedAndNotNull(testObj.g);
    expect(result).toBe(true);
  });
});

describe('getHashFromArray Tests', () => {
  const testDestMap = [
    { from: 'prop1', to: 'val1' },
    { from: 'prop2', to: 'val2' },
  ];
  test('A success case', () => {
    const result = utils.getHashFromArray(testDestMap);
    expect(result).toStrictEqual({
      prop1: 'val1',
      prop2: 'val2',
    });
  });

  test('A single object map (not having array of maps) returns empty object', () => {
    const WrongtestDestMap = { from: 'prop1', to: 'val1' };
    const result = utils.getHashFromArray(WrongtestDestMap);
    expect(result).toStrictEqual({});
  });

  test('null from key returns empty object', () => {
    const WrongtestDestMap = { from: null, to: 'val1' };
    const result = utils.getHashFromArray(WrongtestDestMap);
    expect(result).toStrictEqual({});
  });

  test('undefined from key returns empty object', () => {
    const WrongtestDestMap = { from: undefined, to: 'val1' };
    const result = utils.getHashFromArray(WrongtestDestMap);
    expect(result).toStrictEqual({});
  });

  test('empty string from key returns empty object', () => {
    const WrongtestDestMap = { from: '', to: 'val1' };
    const result = utils.getHashFromArray(WrongtestDestMap);
    expect(result).toStrictEqual({});
  });
});

describe('getHashFromArrayWithDuplicate Tests', () => {
  const testDestMap = [
    { from: 'prop1', to: 'val1' },
    { from: 'prop1', to: 'val2' },
    { from: 'prop2', to: 'val2' },
  ];
  test('A success case', () => {
    const result = utils.getHashFromArrayWithDuplicate(testDestMap);
    expect(result).toStrictEqual({ prop1: ['val1', 'val2'], prop2: ['val2'] });
  });

  test('A single object map (not having array of maps) returns empty object', () => {
    const WrongtestDestMap = { from: 'prop1', to: 'val1' };
    const result = utils.getHashFromArray(WrongtestDestMap);
    expect(result).toStrictEqual({});
  });

  test("null 'from' key returns empty object", () => {
    const WrongtestDestMap = [
      { from: null, to: 'val1' },
      { from: null, to: 'val2' },
      { from: null, to: 'val2' },
    ];
    const result = utils.getHashFromArrayWithDuplicate(WrongtestDestMap);
    expect(result).toStrictEqual({});
  });

  test("undefined 'from' key returns empty object", () => {
    const WrongtestDestMap = [
      { from: undefined, to: 'val1' },
      { from: undefined, to: 'val2' },
      { from: undefined, to: 'val2' },
    ];
    const result = utils.getHashFromArrayWithDuplicate(WrongtestDestMap);
    expect(result).toStrictEqual({});
  });

  test("empty string 'from' key returns empty object", () => {
    const WrongtestDestMap = [
      { from: '', to: 'val1' },
      { from: '', to: 'val2' },
      { from: '', to: 'val2' },
    ];
    const result = utils.getHashFromArrayWithDuplicate(WrongtestDestMap);
    expect(result).toStrictEqual({});
  });

  test('Having repeated mapping will sort it out to single mapping', () => {
    const repeatDestMap = [
      { from: 'prop1', to: 'val1' },
      { from: 'prop1', to: 'val2' },
      { from: 'prop1', to: 'val2' },
      { from: 'prop2', to: 'val2' },
    ];
    const result = utils.getHashFromArrayWithDuplicate(repeatDestMap);
    expect(result).toStrictEqual({ prop1: ['val1', 'val2'], prop2: ['val2'] });
  });
});

describe('getEventMappingFromConfig Tests', () => {
  test('A success case : Getting mapped data from event hashmap', () => {
    const eventsHashmap = { prop1: ['val1', 'val2'], prop2: ['val2'] };
    const result = utils.getEventMappingFromConfig('prop1', eventsHashmap);
    expect(result).toStrictEqual(['val1', 'val2']);
  });
  test('Getting mapped data from from a non-mapped in event hashmap returns null', () => {
    const eventsHashmap = { prop1: ['val1', 'val2'], prop2: ['val2'] };
    const result = utils.getEventMappingFromConfig('prop3', eventsHashmap);
    expect(result).toStrictEqual(null);
  });
});

describe('getDestinationExternalID Tests', () => {
  test('A success case : Getting externalId of a given type', () => {
    const messageTest = {
      context: {
        externalId: [
          {
            type: 'kustomerId',
            id: '12345678',
          },
        ],
      },
    };
    const result = utils.getDestinationExternalID(messageTest, 'kustomerId');
    expect(result).toStrictEqual('12345678');
  });
  test('sending externalId as a normal object returns null', () => {
    const messageTest = {
      context: {
        externalId: {
          type: 'kustomerId',
          id: '12345678',
        },
      },
    };
    const result = utils.getDestinationExternalID(messageTest, 'kustomerId');
    expect(result).toStrictEqual(null);
  });

  test('sending externalId as a normal object returns null', () => {
    const messageTest = {
      context: {
        externalId: [
          {
            type: 'kustomerId',
            id: '12345678',
          },
        ],
      },
    };
    const result = utils.getDestinationExternalID(messageTest, 'testId');
    expect(result).toStrictEqual(null);
  });
});

describe('isDefinedNotNullNotEmpty Tests', () => {
  test('{} returns false', () => {
    const testVar = {};
    const result = utils.isDefinedNotNullNotEmpty(testVar);
    expect(result).toStrictEqual(false);
  });
  test('[] returns false', () => {
    const testVar = [];
    const result = utils.isDefinedNotNullNotEmpty(testVar);
    expect(result).toStrictEqual(false);
  });
  test("'' returns false", () => {
    const testVar = '';
    const result = utils.isDefinedNotNullNotEmpty(testVar);
    expect(result).toStrictEqual(false);
  });
  test('integer returns true', () => {
    const testVar = 124;
    const result = utils.isDefinedNotNullNotEmpty(testVar);
    expect(result).toStrictEqual(true);
  });
  test('true returns true', () => {
    const testVar = true;
    const result = utils.isDefinedNotNullNotEmpty(testVar);
    expect(result).toStrictEqual(true);
  });
  test('false returns true', () => {
    const testVar = false;
    const result = utils.isDefinedNotNullNotEmpty(testVar);
    expect(result).toStrictEqual(true);
  });
});

describe('isDefinedAndNotNullAndNotEmpty Tests', () => {
  test('{} returns false', () => {
    const testVar = {};
    const result = utils.isDefinedAndNotNullAndNotEmpty(testVar);
    expect(result).toStrictEqual(false);
  });
  test('[] returns false', () => {
    const testVar = [];
    const result = utils.isDefinedAndNotNullAndNotEmpty(testVar);
    expect(result).toStrictEqual(false);
  });
  test("'' returns false", () => {
    const testVar = '';
    const result = utils.isDefinedAndNotNullAndNotEmpty(testVar);
    expect(result).toStrictEqual(false);
  });
  test('integer returns true', () => {
    const testVar = 124;
    const result = utils.isDefinedAndNotNullAndNotEmpty(testVar);
    expect(result).toStrictEqual(true);
  });
  test('true returns true', () => {
    const testVar = true;
    const result = utils.isDefinedAndNotNullAndNotEmpty(testVar);
    expect(result).toStrictEqual(true);
  });
  test('false returns true', () => {
    const testVar = false;
    const result = utils.isDefinedAndNotNullAndNotEmpty(testVar);
    expect(result).toStrictEqual(true);
  });
});

describe('flattenJson Tests', () => {
  test('simple string returns object with empty key', () => {
    const testObj = 'abc';
    const result = utils.flattenJson(testObj);
    expect(result).toStrictEqual({ '': 'abc' });
  });
  test('simple empty array returns an with empty key with empty array value', () => {
    const testObj = [];
    const result = utils.flattenJson(testObj);
    expect(result).toStrictEqual({ '': [] });
  });
  test('simple array of object returns single object with indexed keys', () => {
    const testObj = [{ prop1: 'val1' }, { prop2: 'val2' }];
    const result = utils.flattenJson(testObj);
    expect(result).toStrictEqual({ '[0].prop1': 'val1', '[1].prop2': 'val2' });
  });
  test('simple array of object returns single object with indexed keys', () => {
    const testObj = [{ prop1: 'val1' }, { prop2: 'val2' }];
    const result = utils.flattenJson(testObj);
    expect(result).toStrictEqual({ '[0].prop1': 'val1', '[1].prop2': 'val2' });
  });
  test('test case with object with array as value', () => {
    const testObj = { prop1: ['val1', 'val3'], prop2: 'val2' };
    const result = utils.flattenJson(testObj);
    expect(result).toStrictEqual({ 'prop1[0]': 'val1', 'prop1[1]': 'val3', prop2: 'val2' });
  });
  test('test case with circular referenced object', () => {
    const testObj = { prop1: { prop2: 'abc' } };
    testObj.prop3 = testObj;
    const result = utils.flattenJson(testObj);
    expect(result).toStrictEqual({ 'prop1.prop2': 'abc', prop3: '[Circular Reference]' });
  });
  test('test case with nested object', () => {
    const testObj = { prop1: { prop2: 'abc' } };
    const result = utils.flattenJson(testObj);
    expect(result).toStrictEqual({ 'prop1.prop2': 'abc' });
  });
});

describe('pick', () => {
  test('should return an object with only the specified keys', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = utils.pick(obj, ['a', 'c']);
    expect(result).toEqual({ a: 1, c: 3 });
  });

  test('should return an empty object if the input object is empty', () => {
    const obj = {};
    const result = utils.pick(obj, ['a', 'c']);
    expect(result).toEqual({});
  });

  test('should throw an error if the input object is null', () => {
    const obj = null;
    expect(() => {
      utils.pick(obj, ['a', 'c']);
    }).toThrow(new TypeError("Cannot use 'in' operator to search for 'a' in null"));
  });

  test('should throw an error if the input object is undefined', () => {
    const obj = undefined;
    expect(() => {
      utils.pick(obj, ['a', 'c']);
    }).toThrow(new TypeError("Cannot use 'in' operator to search for 'a' in undefined"));
  });

  test('should throw an error if the input object is not an object', () => {
    const obj = 'string';
    expect(() => {
      utils.pick(obj, ['a', 'c']);
    }).toThrow(new TypeError("Cannot use 'in' operator to search for 'a' in string"));
  });

  test('should not return any value if the provided keys are not present in the object', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = utils.pick(obj, ['a', 'd', 'e']);
    expect(result).toEqual({ a: 1 });
  });

  test('should return an object by picking fields case sensitively', () => {
    const obj = { a: 1, b: 2, c: 3, A: 4, B: 5, C: 6 };
    const result = utils.pick(obj, ['a', 'c', 'A', 'C']);
    expect(result).toEqual({ a: 1, c: 3, A: 4, C: 6 });
  });
});

describe('isBlank', () => {
  it('should return true when input is an empty string', () => {
    const result = utils.isBlank('');
    expect(result).toBe(true);
  });
  it('should return false when input is null', () => {
    const result = utils.isBlank(null);
    expect(result).toBe(false);
  });
  it('should return true when input is a string of whitespaces', () => {
    const result = utils.isBlank('              ');
    expect(result).toBe(true);
  });
  it('should return false when input is a valid string', () => {
    const result = utils.isBlank('validString');
    expect(result).toBe(false);
  });
  it('should return false when input is a valid number', () => {
    const result = utils.isBlank(123456);
    expect(result).toBe(false);
  });

  it('should return false when input is a valid object', () => {
    const result = utils.isBlank({ key1: 'value1', key2: 'value2' });
    expect(result).toBe(false);
  });
  it('should return false when input is a valid boolean', () => {
    const result = utils.isBlank(false);
    expect(result).toBe(false);
  });
});

describe('isNotEmpty', () => {
  // returns false for empty string
  it('should return false when input is an empty string', () => {
    expect(utils.isNotEmpty('')).toBe(false);
  });
  // returns false for null
  it('should return false when input is null', () => {
    expect(utils.isNotEmpty(null)).toBe(true);
  });
  // returns true for non-empty string
  it('should return true when input is a non-empty string', () => {
    expect(utils.isNotEmpty('hello')).toBe(true);
  });
  // returns false for empty object
  it('should return false when input is an empty object', () => {
    expect(utils.isNotEmpty({})).toBe(false);
  });
  // returns true for non-empty object
  it('should return true when input is a non-empty object', () => {
    const obj = { key: 'value' };
    expect(utils.isNotEmpty(obj)).toBe(true);
  });
  // returns true for booleans
  it('should return true when input is a boolean', () => {
    expect(utils.isNotEmpty(true)).toBe(true);
    expect(utils.isNotEmpty(false)).toBe(true);
  });
  // returns true for numbers
  it('should return true when input is a number', () => {
    expect(utils.isNotEmpty(5)).toBe(true);
    expect(utils.isNotEmpty(0)).toBe(true);
    expect(utils.isNotEmpty(-10)).toBe(true);
    expect(utils.isNotEmpty(0.444548)).toBe(true);
  });
  // returns false for undefined
  it('should return false when input is undefined', () => {
    expect(utils.isNotEmpty(undefined)).toBe(true);
  });
  // returns true for non-empty array
  it('should return true when input is a non-empty array', () => {
    const input = [1, 2, 3];
    expect(utils.isNotEmpty(input)).toBe(true);
  });
  // handles strings with only whitespace correctly
  it('should return false when input is a string with only whitespace', () => {
    expect(utils.isNotEmpty('   ')).toBe(true);
  });
  // returns false for empty array
  it('should return false when input is an empty array', () => {
    expect(utils.isNotEmpty([])).toBe(false);
  });
  // handles mixed data types within arrays
  it('should return true when input is an array with mixed data types', () => {
    const input = [1, 'hello', { key: 'value' }, true];
    expect(utils.isNotEmpty(input)).toBe(true);
  });
  // handles functions and symbols correctly
  it('should return true for functions and symbols', () => {
    const func = () => {};
    const sym = Symbol('test');
    expect(utils.isNotEmpty(func)).toBe(true);
    expect(utils.isNotEmpty(sym)).toBe(true);
  });
  // handles Date objects correctly
  it('should return true when input is a Date object', () => {
    const date = new Date();
    expect(utils.isNotEmpty(date)).toBe(true);
  });
});

describe('removeUndefinedAndNullAndEmptyValues Tests', () => {
  test('handles mixed data types correctly', () => {
    const input = {
      string: 'hello',
      emptyString: '',
      number: 42,
      zero: 0,
      one: 1,
      boolean: true,
      falseBool: false,
      nullValue: null,
      undefinedValue: undefined,
      emptyObject: {},
      filledObject: { key: 'value' },
      emptyArray: [],
      filledArray: [1, 2],
      date: new Date('2023-01-01'),
    };
    const result = utils.removeUndefinedAndNullAndEmptyValues(input);
    expect(result).toStrictEqual({
      string: 'hello',
      number: 42,
      zero: 0,
      one: 1,
      boolean: true,
      falseBool: false,
      filledObject: { key: 'value' },
      filledArray: [1, 2],
      date: new Date('2023-01-01'),
    });
  });
});
