import merge from 'lodash.merge';
import { clone } from 'ramda';
import {
  isInstanceOfEvent,
  mergeDeepRight,
  mergeDeepRightObjectArrays,
  stringifyWithoutCircular,
} from '../../src/utils/ObjectUtils';

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

const circularReferenceNotice = '[Circular Reference]';

describe('Object utilities', () => {
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

  it('should merge right nested object properties like lodash merge', () => {
    const mergedArray = mergeDeepRight(identifyTraitsPayloadMock, trackTraitsOverridePayloadMock);
    expect(mergedArray).toEqual(merge(identifyTraitsPayloadMock, trackTraitsOverridePayloadMock));
  });

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

  it('should detect if value is an Event', () => {
    const check = isInstanceOfEvent(new Event('Error'));
    expect(check).toBeTruthy();
  });

  it('should detect if value is not an Event', () => {
    const check = isInstanceOfEvent(new Error('Error'));
    expect(check).not.toBeTruthy();
  });
});
