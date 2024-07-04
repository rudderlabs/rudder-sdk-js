import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { cookie } from '../../src/component-cookie';

class MockLogger implements ILogger {
  error = jest.fn();
}

const mockLoggerInstance = new MockLogger();

beforeEach(() => {
  const allCookies = cookie();
  Object.keys(allCookies).forEach(cookieName => {
    cookie(cookieName, null);
  });
});

// TODO: clean up structure here, clean up cookie before each test
describe('cookies', () => {
  it('should set a cookie', () => {
    cookie('name', 'tobi');
    expect('tobi').toEqual(cookie('name'));

    cookie('species', 'ferret');
    expect('ferret').toEqual(cookie('species'));
  });

  it('should escape', () => {
    cookie('name', 'tobi ferret');
    expect(document.cookie.includes('name=tobi%20ferret')).toBeTruthy();
  });

  it('should unescape', () => {
    cookie('full name', 'tobi ferret');
    expect('tobi ferret').toEqual(cookie('full name'));
  });

  it('should ignore URIError', () => {
    cookie('bad', '%');
    cookie('bad', null);

    cookie('bad', '\ud83d', undefined, mockLoggerInstance);
    expect(mockLoggerInstance.error).toHaveBeenCalledTimes(1);
    expect(mockLoggerInstance.error).toHaveBeenNthCalledWith(
      1,
      'Failed to encode the cookie data.',
      expect.any(Error),
    );

    expect(cookie('bad')).toEqual('undefined');
  });

  it('should return undefined if the cookies are not encoded properly', () => {
    document.cookie = 'name=tobi%ferret';
    expect(cookie('name')).toEqual(undefined);

    // delete cookie
    document.cookie = 'name=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
  });

  it('should set cookie as per the options', () => {
    cookie('name', 'tobi', { domain: '.test-host.com', path: '/', secure: true, samesite: 'None' });
    expect(document.cookie.includes('name=tobi')).toBeTruthy();
  });
});

describe('when undefined', () => {
  it('should return undefined', () => {
    expect(undefined).toEqual(cookie('whatever'));
  });
});

describe('cookie(name, null)', () => {
  it('should clear the cookie', () => {
    cookie('type', 'ferret');
    cookie('type', null);
    expect(undefined).toEqual(cookie('type'));
  });

  it('should not be returned in the cookie() object', () => {
    cookie('full name', null);
    cookie('mydb', null);
    cookie('species', null);
    cookie('name', '0');
    const obj = cookie();

    expect(1).toEqual(Object.keys(obj).length);
    expect('0').toEqual(obj.name);
  });
});

describe('cookie()', () => {
  it('should return all cookies', () => {
    cookie('name', 'loki');
    cookie('species', 'ferret');
    const obj = cookie();

    expect(2).toEqual(Object.keys(obj).length);
    expect('loki').toEqual(obj.name);
    expect('ferret').toEqual(obj.species);
  });

  it('should return all cookies if the first argument is not a valid string', () => {
    cookie('name', 'loki');
    cookie('species', 'ferret');
    const obj = cookie(false);

    expect(2).toEqual(Object.keys(obj).length);
    expect('loki').toEqual(obj.name);
    expect('ferret').toEqual(obj.species);
  });
});
