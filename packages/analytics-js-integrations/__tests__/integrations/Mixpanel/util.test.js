import {
  parseConfigArray,
  extractTraits,
  unionArrays,
  inverseObjectArrays,
  extendTraits,
  mapTraits,
} from '../../../src/integrations/Mixpanel/util';

describe('parseConfigArray', () => {
  it('should return an array of values extracted from objects in the input array using the provided key', () => {
    const arr = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 3, name: 'Bob' },
      { id: 4, key: 'value' },
    ];
    const key = 'name';
    const result = parseConfigArray(arr, key);
    expect(result).toEqual(['John', 'Jane', 'Bob']);
  });

  it('should return an empty array when input array is empty', () => {
    const arr = [];
    const key = 'key';
    const result = parseConfigArray(arr, key);
    expect(result).toEqual([]);
  });

  it('should return undefined when input array is not an array', () => {
    const arr = null;
    const key = 'key';
    const result = parseConfigArray(arr, key);
    expect(result).toBeUndefined();
  });
});

describe('extractTraits', () => {
  it('should extract traits object as is when no trait aliases are provided', () => {
    const traits = {
      name: 'John Doe',
      age: 30,
      email: 'johndoe@example.com',
    };
    const traitAliasesParam = {};

    const result = extractTraits(traits, traitAliasesParam);

    expect(result).toEqual(traits);
  });

  it('should extract traits object with trait aliases when trait aliases are provided', () => {
    const traits = {
      name: 'John Doe',
      age: 30,
      email: 'johndoe@example.com',
    };
    const traitAliasesParam = {
      name: 'fullName',
      age: 'years',
      email: 'contactEmail',
    };
    const expectedTraits = {
      fullName: 'John Doe',
      years: 30,
      contactEmail: 'johndoe@example.com',
    };

    const result = extractTraits(traits, traitAliasesParam);

    expect(result).toEqual(expectedTraits);
  });

  it('should extract traits object with empty trait aliases object', () => {
    const traits = {
      name: 'John Doe',
      age: 30,
      email: 'johndoe@example.com',
    };
    const traitAliasesParam = {};

    const result = extractTraits(traits, traitAliasesParam);

    expect(result).toEqual(traits);
  });

  it('should extract empty traits object when given empty traits object', () => {
    const traits = {};
    const traitAliasesParam = {};

    const result = extractTraits(traits, traitAliasesParam);

    expect(result).toEqual({});
  });
});

describe('unionArrays', () => {
  it('should return an empty array when both input arrays are empty', () => {
    const x = [];
    const y = [];
    const result = unionArrays(x, y);
    expect(result).toEqual([]);
  });

  it('should return the first array when the second array is empty', () => {
    const x = [1, 2, 3];
    const y = [];
    const result = unionArrays(x, y);
    expect(result).toEqual(x);
  });

  it('should return the second array when the first array is empty', () => {
    const x = [];
    const y = [1, 2, 3];
    const result = unionArrays(x, y);
    expect(result).toEqual(y);
  });

  it('should return the union of two arrays when both are non empty', () => {
    const x = [1, 'two', true];
    const y = ['three', false, 4];
    const result = unionArrays(x, y);
    expect(result).toEqual([1, 'two', true, 'three', false, 4]);
  });
});

describe('inverseObjectArrays', () => {
  it('should return the same input object when there are no array values', () => {
    const input = {
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
    };
    const result = inverseObjectArrays(input);
    expect(result).toEqual(input);
  });

  it('should return the same input object when there are no objects in the array values', () => {
    const input = {
      key1: [1, 2, 3],
      key2: [4, 5, 6],
      key3: [7, 8, 9],
    };
    const result = inverseObjectArrays(input);
    expect(result).toEqual(input);
  });

  it('should return an empty object when the input object is empty', () => {
    const input = {};
    const result = inverseObjectArrays(input);
    expect(result).toEqual({});
  });

  it('should transform the array values into separate properties with each key as suffix', () => {
    const input = {
      key1: [
        { prop1: 'value1', 1: 'value2' },
        { prop1: 'value3', 1: 'value4' },
      ],
      key2: [
        { prop2: 'value5', 2: 'value6' },
        { prop2: 'value7', 2: 'value8' },
      ],
      key3: [
        { prop3: 'value9', 3: 'value10' },
        { prop3: 'value11', 3: 'value12' },
      ],
    };

    const result = inverseObjectArrays(input);
    expect(result).toEqual({
      key1_prop1s: ['value1', 'value3'],
      key1_1s: ['value2', 'value4'],
      key2_prop2s: ['value5', 'value7'],
      key2_2s: ['value6', 'value8'],
      key3_prop3s: ['value9', 'value11'],
      key3_3s: ['value10', 'value12'],
    });
  });
});

describe('extendTraits', () => {
  it('should add only the missing keys in traitAliases to the input array', () => {
    const inputArray = ['created', 'email', 'firstName', 'key'];
    const expected = [
      'created',
      'email',
      'firstName',
      'key',
      'lastName',
      'lastSeen',
      'name',
      'username',
      'phone',
    ];
    const result = extendTraits(inputArray);
    expect(result).toEqual(expected);
  });
});

describe('mapTraits', () => {
  it('should return an empty array when given an empty array', () => {
    const input = [];
    const expectedOutput = [];
    const result = mapTraits(input);
    expect(result).toEqual(expectedOutput);
  });

  it('should map trait mix of aliases/non-aliases correctly', () => {
    const input = ['key1', 'created', 'email', 'firstName'];
    const expectedOutput = ['key1', '$created', '$email', '$first_name'];
    const result = mapTraits(input);
    expect(result).toEqual(expectedOutput);
  });
});
