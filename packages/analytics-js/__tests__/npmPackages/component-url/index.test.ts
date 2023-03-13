import {
  parse,
  isAbsolute,
  isRelative,
  isCrossDomain,
} from '../../../src/npmPackages/component-url/index';

describe('isCrossDomain(str)', () => {
  describe('when everything matches', () => {
    it('should return false', () => {
      expect(isCrossDomain('/hello/world')).toBeFalsy();
      expect(
        isCrossDomain(`${window.location.protocol}//${window.location.host}/hello/world`),
      ).toBeFalsy();
    });
  });

  describe('when hostname mismatches', () => {
    it('should return true', () => {
      expect(
        isCrossDomain(
          `${window.location.protocol}//example.com${
            window.location.port ? `:${window.location.port}` : ''
          }/hello/world`,
        ),
      ).toBeTruthy();
    });
  });

  describe('when protocol mismatches', () => {
    it('should return true', () => {
      expect(isCrossDomain(`https://${window.location.host}/hello/world`)).toBeTruthy();
    });
  });

  describe('when port mismatches', () => {
    it('should return true', () => {
      expect(
        isCrossDomain(
          `${window.location.protocol}//${window.location.hostname}:${
            +window.location.port + 1
          }/hello/world`,
        ),
      ).toBeTruthy();
    });
  });

  describe('when port is missing', () => {
    it('should return true', () => {
      expect(
        isCrossDomain(`${window.location.protocol}//${window.location.port}/hello/world`),
      ).toBeTruthy();
    });
  });
});

describe('isAbsolute(str)', () => {
  it('should support scheme://', () => {
    expect(isAbsolute('http://foo.com')).toBeTruthy();
  });

  it('should support //', () => {
    expect(isAbsolute('//foo.com')).toBeTruthy();
  });

  it('should support relative', () => {
    expect(isAbsolute('foo')).toBeFalsy();
    expect(isAbsolute('foo/bar/baz')).toBeFalsy();
    expect(isAbsolute('/foo/bar/baz')).toBeFalsy();
    expect(isAbsolute('foo.com/something')).toBeFalsy();
  });
});

describe('isRelative(str)', () => {
  it('should support scheme://', () => {
    expect(isRelative('http://foo.com')).toBeFalsy();
  });

  it('should support //', () => {
    expect(isRelative('//foo.com')).toBeFalsy();
  });

  it('should support relative', () => {
    expect(isRelative('foo')).toBeTruthy();
    expect(isRelative('foo/bar/baz')).toBeTruthy();
    expect(isRelative('/foo/bar/baz')).toBeTruthy();
    expect(isRelative('foo.com/something')).toBeTruthy();
  });
});

describe('parse(str)', () => {
  it('should support .href', () => {
    const url = parse('http://google.com/foo/bar');
    expect('http://google.com/foo/bar').toEqual(url.href);
  });

  it('should support .pathname', () => {
    const url = parse('http://google.com/foo/bar');
    expect('/foo/bar').toEqual(url.pathname);
  });

  it('should support .protocol', () => {
    const url = parse('http://google.com/foo/bar');
    expect('http:').toEqual(url.protocol);
  });

  it('should support .hostname', () => {
    const url = parse('http://google.com:3000/foo/bar');
    expect('google.com').toEqual(url.hostname);
  });

  it('should support .host', () => {
    const url = parse('http://google.com:3000/foo/bar');
    expect('google.com:3000').toEqual(url.host);
  });

  it('should support .port', () => {
    const url = parse('http://google.com/foo/bar');
    const ur2 = parse('https://google.com/foo/bar');
    const ur3 = parse('http://google.com:80/foo/bar');
    const ur4 = parse('http://google.com:3000/foo/bar');
    expect((80).toString()).toEqual(url.port);
    expect((443).toString()).toEqual(ur2.port);
    expect((80).toString()).toEqual(ur3.port);
    expect((3000).toString()).toEqual(ur4.port);
  });

  it('should support .search', () => {
    const url = parse('http://google.com:3000/foo/bar?name=tobi');
    expect('?name=tobi').toEqual(url.search);
  });

  it('should support .query', () => {
    const url = parse('http://google.com:3000/foo/bar?name=tobi');
    expect('name=tobi').toEqual(url.query);
  });

  it('should support .hash', () => {
    const url = parse('http://google.com:3000/foo/bar#something');
    expect('#something').toEqual(url.hash);
  });

  it('should match new URL()', () => {
    const url = parse('http://google.com:3000/foo/bar#something');
    const newUrl = new URL('http://google.com:3000/foo/bar#something');
    expect(url.hostname).toStrictEqual(newUrl.hostname);
  });
});
