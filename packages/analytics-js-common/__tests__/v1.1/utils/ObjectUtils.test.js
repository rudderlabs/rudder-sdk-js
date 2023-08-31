import { clone } from 'ramda';
import { isInstanceOfEvent, stringifyWithoutCircularV1 } from '../../../src/v1.1/utils/ObjectUtils';

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

const circularReferenceNotice = '[Circular Reference]';

describe('Object utilities', () => {
  it('should stringify json with circular references', () => {
    const objWithCircular = clone(identifyTraitsPayloadMock);
    objWithCircular.myself = objWithCircular;

    const json = stringifyWithoutCircularV1(objWithCircular);
    expect(json).toContain(circularReferenceNotice);
  });

  it('should stringify json with circular references and exclude null values', () => {
    const objWithCircular = clone(identifyTraitsPayloadMock);
    objWithCircular.myself = objWithCircular;
    objWithCircular.keyToExclude = null;
    objWithCircular.keyToNotExclude = '';

    const json = stringifyWithoutCircularV1(objWithCircular, true);
    expect(json).toContain(circularReferenceNotice);
    expect(json).not.toContain('keyToExclude');
    expect(json).toContain('keyToNotExclude');
  });

  it('should stringify json with out circular references', () => {
    const objWithoutCircular = clone(identifyTraitsPayloadMock);
    objWithoutCircular.myself = {};

    const json = stringifyWithoutCircularV1(objWithoutCircular);
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

    const json = stringifyWithoutCircularV1(objWithoutCircular);
    expect(json).not.toContain(circularReferenceNotice);
  });

  it('should stringify json with circular references for nested circular objects', () => {
    const objWithoutCircular = clone(identifyTraitsPayloadMock);
    const reusableObject = { dummy: 'val' };
    const objWithCircular = clone(reusableObject);
    objWithCircular.myself = objWithCircular;
    objWithoutCircular.reusedObjAgainWithItself = { reused: reusableObject };
    objWithoutCircular.objWithCircular = objWithCircular;

    const json = stringifyWithoutCircularV1(objWithoutCircular);
    expect(json).toContain(circularReferenceNotice);
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
