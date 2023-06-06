import { cookie } from '@rudderstack/analytics-js/services/StoreManager/component-cookie';

// TODO: clean up structure here, clean up cookie before each test
describe('cookie(name, value)', () => {
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
    expect(undefined).toEqual(cookie('bad'));
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

  it('should ignore URIError and return null', () => {
    window.document.cookie = 'bad=%';
    expect(cookie('bad')).toBeNull();
    cookie('bad', null);
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

  it('should return all cookies and ignore URIErrors', () => {
    cookie('name', 'loki');
    cookie('species', 'ferret');
    window.document.cookie = 'bad=%';
    const obj = cookie();

    expect('loki').toEqual(obj.name);
    expect('ferret').toEqual(obj.species);
    expect(obj.bad).toBeNull();
    cookie('bad', null);
  });
});
