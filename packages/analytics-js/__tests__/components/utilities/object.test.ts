import {
  mergeDeepRight,
  mergeDeepRightObjectArrays,
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
};

describe('Common Utils - Object', () => {
  it('should merge right object array items', () => {
    const mergedArray = mergeDeepRightObjectArrays(
      identifyTraitsPayloadMock.address,
      trackTraitsOverridePayloadMock.address,
    );
    expect(mergedArray).toEqual(expectedMergedTraitsPayload.address);
  });

  it('should merge right nested object properties', () => {
    const mergedArray = mergeDeepRight(identifyTraitsPayloadMock, trackTraitsOverridePayloadMock);
    expect(mergedArray).toEqual(expectedMergedTraitsPayload);
  });

  // This has been proved so no need to have lodash dependency and this test case anymore
  // it('should merge right nested object properties like lodash merge', () => {
  //   const mergedArray = mergeDeepRight(identifyTraitsPayloadMock, trackTraitsOverridePayloadMock);
  //   expect(mergedArray).toEqual(merge(identifyTraitsPayloadMock, trackTraitsOverridePayloadMock));
  // });
});
