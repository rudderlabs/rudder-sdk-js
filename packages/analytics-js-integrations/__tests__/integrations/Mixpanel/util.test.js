import {
  parseConfigArray,
  extractTraits,
  unionArrays,
  inverseObjectArrays,
  extendTraits,
  mapTraits,
  filterSetOnceTraits,
  unset,
  formatTraits,
  generatePageCustomEventName,
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

describe('filterSetOnceTraits', () => {
  // Should return an object with setTraits, setOnce, email, and username keys when given valid outgoingTraits and setOnceProperties inputs
  it('should return an object with setTraits, setOnce, email, and username keys', () => {
    const outgoingTraits = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      name: 'John Doe',
      username: 'johndoe',
    };
    const setOnceProperties = ['email', 'username'];

    const result = filterSetOnceTraits(outgoingTraits, setOnceProperties);

    expect(result).toHaveProperty('setTraits');
    expect(result).toHaveProperty('setOnce');
    expect(result).toHaveProperty('email');
    expect(result).toHaveProperty('username');
  });

  // Should correctly extract and remove setOnceProperties from the outgoingTraits object
  it('should correctly extract and remove setOnceProperties', () => {
    const outgoingTraits = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      name: 'John Doe',
      username: 'johndoe',
    };
    const setOnceProperties = ['email', 'username'];

    const result = filterSetOnceTraits(outgoingTraits, setOnceProperties);

    expect(result.setTraits).not.toHaveProperty('email');
    expect(result.setTraits).not.toHaveProperty('username');
    expect(result.setOnce).toHaveProperty('email', 'test@example.com');
    expect(result.setOnce).toHaveProperty('username', 'johndoe');
  });

  // Should correctly handle cases where setOnceProperties are not present in the outgoingTraits object
  it('should correctly handle cases where setOnceProperties are not present', () => {
    const outgoingTraits = {
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      name: 'John Doe',
    };
    const setOnceProperties = ['email', 'username'];

    const result = filterSetOnceTraits(outgoingTraits, setOnceProperties);
    console.log(result);

    expect(result).toHaveProperty('setTraits');
    expect(result).toHaveProperty('setOnce');
    expect(result).toHaveProperty('email');
    expect(result).toHaveProperty('username');
  });

  // Should correctly handle cases where the outgoingTraits object is empty
  it('should return an object with empty setTraits and setOnce properties when given an empty outgoingTraits object', () => {
    const outgoingTraits = {};
    const setOnceProperties = ['email', 'username'];

    const result = filterSetOnceTraits(outgoingTraits, setOnceProperties);

    expect(result.setTraits).toEqual({});
    expect(result.setOnce).toEqual({});
  });

  // Should correctly handle cases where setOnceProperties are present in the outgoingTraits object but have non-string values
  it('should exclude non-string setOnceProperties from the setOnce property in the result object', () => {
    const outgoingTraits = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      name: 'John Doe',
      username: 'johndoe',
      age: 25,
      gender: 'male',
    };
    const setOnceProperties = ['email', 'username', 'age', 'gender'];

    const result = filterSetOnceTraits(outgoingTraits, setOnceProperties);

    expect(result.setOnce).toEqual({
      age: 25,
      gender: 'male',
      email: 'test@example.com',
      username: 'johndoe',
    });

    expect(result.setTraits).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      name: 'John Doe',
    });
  });

  // Should not modify the original outgoingTraits object
  it('should not modify the original outgoingTraits object', () => {
    const outgoingTraits = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      name: 'John Doe',
      username: 'johndoe',
    };
    const setOnceProperties = ['email', 'username'];

    filterSetOnceTraits(outgoingTraits, setOnceProperties);

    expect(outgoingTraits).toEqual({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      name: 'John Doe',
      username: 'johndoe',
    });
  });

  // Should correctly handle cases where setOnceProperties contain nested properties
  it('should correctly handle cases where setOnceProperties contain nested properties', () => {
    const outgoingTraits = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      name: 'John Doe',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
      },
    };
    const setOnceProperties = ['address.street', 'address.city'];

    const result = filterSetOnceTraits(outgoingTraits, setOnceProperties);

    expect(result.setTraits).toEqual({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      name: 'John Doe',
      address: {
        state: 'NY',
        zip: '10001',
      },
    });
    expect(result.setOnce).toEqual({
      street: '123 Main St',
      city: 'New York',
    });
    expect(result.email).toBe('test@example.com');
    expect(result.username).toBeUndefined();
  });
});

describe('unset', () => {
  // Can unset a property at the top level of an object
  it('should unset a property at the top level of an object', () => {
    const obj = { name: 'John', age: 30 };
    unset(obj, 'name');
    expect(obj).toEqual({ age: 30 });
  });

  // Can unset a property at a nested level of an object
  it('should unset a property at a nested level of an object', () => {
    const obj = { person: { name: 'John', age: 30 } };
    unset(obj, 'person.name');
    expect(obj).toEqual({ person: { age: 30 } });
  });

  // Can unset a property that has a value of null
  it('should unset a property that has a value of null', () => {
    const obj = { name: null, age: 30 };
    unset(obj, 'name');
    expect(obj).toEqual({ age: 30 });
  });

  // Does not throw an error when trying to unset a property that does not exist
  it('should not throw an error when trying to unset a property that does not exist', () => {
    const obj = { name: 'John', age: 30 };
    expect(() => unset(obj, 'address')).not.toThrow();
    expect(obj).toEqual({ name: 'John', age: 30 });
  });

  it('should not throw an error when trying to unset a property that does not exist', () => {
    const obj = { name: 'John', age: 30, key1: undefined, key2: false, key3: true };
    expect(() => unset(obj, 'key2')).not.toThrow();
    expect(obj).toEqual({ name: 'John', age: 30, key1: undefined, key3: true });
  });
});

describe('formatTraits', () => {
  // Extracts defined traits from message and sets them as outgoing traits
  it('should extract defined traits from message and set them as outgoing traits', () => {
    // Arrange
    const message = {
      context: {
        traits: {
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          phone: '1234567890',
          name: 'John Doe',
          customField1: 'value1',
          customField2: 'value2',
        },
      },
    };
    const setOnceProperties = ['firstName'];

    // Act
    const result = formatTraits(message, setOnceProperties);

    // Assert
    expect(result.setTraits).toEqual({
      lastName: 'Doe',
      phone: '1234567890',
      email: 'test@example.com',
      name: 'John Doe',
      customField1: 'value1',
      customField2: 'value2',
    });
    expect(result.setOnce).toEqual({
      firstName: 'John',
    });
  });
});

describe('generatePageCustomEventName', () => {
  it('should generate a custom event name when userDefinedEventTemplate contains event template and message object is provided', () => {
    let message = { name: 'Doc', properties: { category: 'Integration' } };
    const userDefinedEventTemplate = 'Viewed {{ category }} {{ name }} page';
    let expected = 'Viewed Integration Doc page';
    let result = generatePageCustomEventName(message, userDefinedEventTemplate);
    expect(result).toBe(expected);

    message = { name: true, properties: { category: 0 } };
    expected = 'Viewed 0 true page';
    result = generatePageCustomEventName(message, userDefinedEventTemplate);
    expect(result).toBe(expected);
  });

  it('should generate a custom event name when userDefinedEventTemplate contains event template and category or name is missing in message object', () => {
    const message = { name: 'Doc', properties: { category: undefined } };
    const userDefinedEventTemplate = 'Viewed   {{ category }}   {{ name }} page  someKeyword';
    const expected = 'Viewed     Doc page  someKeyword';
    const result = generatePageCustomEventName(message, userDefinedEventTemplate);
    expect(result).toBe(expected);
  });

  it('should generate a custom event name when userDefinedEventTemplate contains only category or name placeholder and message object is provided', () => {
    const message = { name: 'Doc', properties: { category: 'Integration' } };
    const userDefinedEventTemplate = 'Viewed {{ name }} page';
    const expected = 'Viewed Doc page';
    const result = generatePageCustomEventName(message, userDefinedEventTemplate);
    expect(result).toBe(expected);
  });

  it('should return the userDefinedEventTemplate when it does not contain placeholder {{}}', () => {
    const message = { name: 'Index' };
    const userDefinedEventTemplate = 'Viewed a Home page';
    const expected = 'Viewed a Home page';
    const result = generatePageCustomEventName(message, userDefinedEventTemplate);
    expect(result).toBe(expected);
  });

  it('should return a event name when message object is not provided/empty', () => {
    const message = {};
    const userDefinedEventTemplate = 'Viewed  {{ category }}  {{ name }}  page  someKeyword';
    const expected = 'Viewed    page  someKeyword';
    const result = generatePageCustomEventName(message, userDefinedEventTemplate);
    expect(result).toBe(expected);
  });
});
