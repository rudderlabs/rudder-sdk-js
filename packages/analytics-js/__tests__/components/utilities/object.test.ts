import {
  mergeDeepRight,
  mergeDeepRightObjectArrays,
  isNonEmptyObject,
} from '@rudderstack/analytics-js/components/utilities/object';

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
  const validObj = {
    key1: 'value',
    key2: 1234567,
  };

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

  it('isNonEmptyObject: should return true for valid object with data', () => {
    const outcome = isNonEmptyObject(validObj);
    expect(outcome).toEqual(true);
  });
  it('isNonEmptyObject: should return false for undefined/null or empty object', () => {
    const outcome1 = isNonEmptyObject(undefined);
    const outcome2 = isNonEmptyObject(null);
    const outcome3 = isNonEmptyObject({});
    expect(outcome1).toEqual(false);
    expect(outcome2).toEqual(false);
    expect(outcome3).toEqual(false);
  });

  // This has been proved so no need to have lodash dependency and this test case anymore
  // it('should merge right nested object properties like lodash merge', () => {
  //   const mergedArray = mergeDeepRight(identifyTraitsPayloadMock, trackTraitsOverridePayloadMock);
  //   expect(mergedArray).toEqual(merge(identifyTraitsPayloadMock, trackTraitsOverridePayloadMock));
  // });
});
