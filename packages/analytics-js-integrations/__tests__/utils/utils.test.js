/* eslint-disable sonarjs/no-duplicate-string */
import * as utils from '../../src/utils/utils';

describe('extractCustomFields Tests', () => {
  test('A success case', () => {
    const testMessageObj = {
      context: {
        traits: {
          name: 'rudder',
          city: 'kolkata',
          locality: 'test',
        },
      },
      properties: {
        category: 'test cat',
        path: '/test',
        url: 'http://localhost',
        referrer: '',
        title: 'test page',
        organization: 'Rudderstack',
      },
    };
    const testPayload = {};
    const testKeys = ['traits', 'context.traits', 'properties'];
    const exclusionFields = [
      'firstName',
      'lastName',
      'phone',
      'title',
      'organization',
      'city',
      'region',
      'country',
      'zip',
      'image',
      'timezone',
    ];
    const result = utils.extractCustomFields(
      testMessageObj,
      testPayload,
      testKeys,
      exclusionFields,
    );
    expect(result).toStrictEqual({
      category: 'test cat',
      locality: 'test',
      name: 'rudder',
      path: '/test',
      referrer: '',
      url: 'http://localhost',
    });
  });
  test('If a key of message for extraction is absent, returns the destination payload as it is', () => {
    const testMessageObj = {
      context: {},
      properties: {
        category: 'test cat',
        path: '/test',
        url: 'http://localhost',
        referrer: '',
        title: 'test page',
        organization: 'Rudderstack',
      },
    };
    const testPayload = {
      testKey: 'testVal',
    };
    const testKeys = ['context.traits'];
    const exclusionFields = [
      'firstName',
      'lastName',
      'phone',
      'title',
      'organization',
      'city',
      'region',
      'country',
      'zip',
      'image',
      'timezone',
    ];
    const result = utils.extractCustomFields(
      testMessageObj,
      testPayload,
      testKeys,
      exclusionFields,
    );
    expect(result).toStrictEqual({
      testKey: 'testVal',
    });
  });
});

describe('getDefinedTraits Tests', () => {
  test('A success case', () => {
    const testMessageObj = {
      userId: 'user123',
      context: {
        traits: {
          firstname: 'rudder',
          lastname: 'stack',
          city: 'kolkata',
          locality: 'test',
          email: 'abc@gmail.com',
          address: {
            country: 'India',
          },
        },
      },
      properties: {
        category: 'test cat',
        path: '/test',
        url: 'http://localhost',
        referrer: '',
        title: 'test page',
        organization: 'Rudderstack',
      },
    };

    const result = utils.getDefinedTraits(testMessageObj);
    expect(result).toStrictEqual({
      city: 'kolkata',
      country: 'India',
      email: 'abc@gmail.com',
      firstName: 'rudder',
      lastName: 'stack',
      name: 'rudder stack',
      phone: undefined,
      state: undefined,
      postalCode: undefined,
      userId: 'user123',
      userIdOnly: 'user123',
    });
  });
});

describe('constructPayload Tests', () => {
  test('A success case', () => {
    const testMessageObj = {
      locality: 'test',
      email: 'abc@gmail.com',
      address: {
        country: 'India',
      },
    };

    const testMapper = [
      {
        destKey: 'newLocality',
        sourceKeys: 'locality',
      },
      {
        destKey: 'newEmail',
        sourceKeys: 'email',
      },
      {
        destKey: 'country',
        sourceKeys: 'address.country',
      },
    ];

    const result = utils.constructPayload(testMessageObj, testMapper);
    expect(result).toStrictEqual({
      country: 'India',
      newEmail: 'abc@gmail.com',
      newLocality: 'test',
    });
  });
  test('with array of source keys, only first available value should be mapped', () => {
    const testMessageObj = {
      country: 'India',
      locality: 'test',
      email: 'abc@gmail.com',
      address: {
        country: 'USA',
      },
    };

    const testMapper = [
      {
        destKey: 'newLocality',
        sourceKeys: 'locality',
      },
      {
        destKey: 'newEmail',
        sourceKeys: 'email',
      },
      {
        destKey: 'country',
        sourceKeys: ['country', 'address.country'],
      },
    ];

    const result = utils.constructPayload(testMessageObj, testMapper);
    expect(result).toStrictEqual({
      country: 'India',
      newEmail: 'abc@gmail.com',
      newLocality: 'test',
    });
  });
});

describe('getDataFromSource Tests', () => {
  test('A success case', () => {
    let itemsObject;
    const testMessageObj = {
      locality: 'test',
    };

    const testMapper = [
      {
        destKey: 'newLocality',
        sourceKeys: 'locality',
      },
    ];

    testMapper.forEach(mapping => {
      itemsObject = {
        ...utils.getDataFromSource(mapping.sourceKeys, mapping.destKey, testMessageObj),
      };
    });
    expect(itemsObject).toStrictEqual({ newLocality: 'test' });
  });
  test('If an array of source keys is provided, maps from the first available value, ', () => {
    let itemsObject;
    const testMessageObj = {
      locality: 'test',
      email: 'abc@gmail.com',
      country: 'India',
      COUNTRY: 'Bharat',
    };

    const testMapper = [
      {
        destKey: 'country',
        sourceKeys: ['COUNTRY', 'country'],
      },
    ];

    testMapper.forEach(mapping => {
      itemsObject = {
        ...utils.getDataFromSource(mapping.sourceKeys, mapping.destKey, testMessageObj),
      };
    });
    expect(itemsObject).toStrictEqual({ country: 'Bharat' });
  });
  test('If nested object source mapping is provided, returns {}', () => {
    let itemsObject;
    const testMessageObj = {
      address: {
        country: 'India',
      },
    };

    const testMapper = [
      {
        destKey: 'country',
        sourceKeys: 'address.country',
      },
    ];

    testMapper.forEach(mapping => {
      itemsObject = {
        ...utils.getDataFromSource(mapping.sourceKeys, mapping.destKey, testMessageObj),
      };
    });
    expect(itemsObject).toStrictEqual({});
  });
  test('Even though test mapper contains key mapping object for multiple keys, only one of the mapped key is returned', () => {
    let itemsObject;
    const testMessageObj = {
      locality: 'test',
      country: 'India',
    };

    const testMapper = [
      {
        destKey: 'newLocality',
        sourceKeys: 'locality',
      },
      {
        destKey: 'newCountry',
        sourceKeys: 'country',
      },
    ];

    testMapper.forEach(mapping => {
      itemsObject = {
        ...utils.getDataFromSource(mapping.sourceKeys, mapping.destKey, testMessageObj),
      };
    });
    expect(itemsObject).toStrictEqual({ newCountry: 'India' });
  });
});

describe('flattenJsonPayload Tests', () => {
  test('simple string returns object with empty key', () => {
    const testObj = 'abc';
    const result = utils.flattenJsonPayload(testObj);
    expect(result).toStrictEqual({ '': 'abc' });
  });
  test('simple empty array returns an with empty key with empty array value', () => {
    const testObj = [];
    const result = utils.flattenJsonPayload(testObj);
    expect(result).toStrictEqual({ '': [] });
  });
  test('simple array of object returns single object with indexed keys', () => {
    const testObj = [{ prop1: 'val1' }, { prop2: 'val2' }];
    const result = utils.flattenJsonPayload(testObj);
    expect(result).toStrictEqual({ '0.prop1': 'val1', '1.prop2': 'val2' });
  });
  test('simple array of object returns single object with indexed keys', () => {
    const testObj = [{ prop1: 'val1' }, { prop2: 'val2' }];
    const result = utils.flattenJsonPayload(testObj);
    expect(result).toStrictEqual({ '0.prop1': 'val1', '1.prop2': 'val2' });
  });
  test('test case with object with array as value', () => {
    const testObj = { prop1: ['val1', 'val3'], prop2: 'val2' };
    const result = utils.flattenJsonPayload(testObj);
    expect(result).toStrictEqual({ 'prop1.0': 'val1', 'prop1.1': 'val3', prop2: 'val2' });
  });
  test('test case with nested object', () => {
    const testObj = { prop1: { prop2: 'abc' } };
    const result = utils.flattenJsonPayload(testObj);
    expect(result).toStrictEqual({ 'prop1.prop2': 'abc' });
  });
  test('test case with circular referenced object', () => {
    const testObj = { prop1: { prop2: 'abc' } };
    testObj.prop3 = testObj;
    const result = utils.flattenJsonPayload(testObj);
    expect(result).toStrictEqual({ 'prop1.prop2': 'abc', prop3: '[Circular Reference]' });
  });
  test('test case with specified delimeter', () => {
    const testObj = { prop1: { prop2: 'abc' } };
    const result = utils.flattenJsonPayload(testObj, '-');
    expect(result).toStrictEqual({ '-.prop1.prop2': 'abc' });
  });
});
