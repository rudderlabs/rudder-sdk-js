import { GenericObject } from "@rudderstack/analytics-js/types";
import { cookie } from '../../../src/npmPackages/component-cookie';
import { domain } from "../../../src/npmPackages/top-domain";

let cookies: GenericObject = {};

jest.mock('../../../src/npmPackages/component-cookie', () => ({
  cookie: jest.fn((name, val, opts) => {
    if(val || opts) {
      const parts = opts.domain.split('.');

      if (parts[1] === 'co') {
        return undefined;
      }

      cookies[name] = val;
      return cookies[name];
    }

    if (name) {
      return cookies[name];
    }

    return cookies;
  })
}));

describe('topDomain', () => {

  beforeEach(() => {
    cookies = {};
  });

  it('should match the following urls', () => {
    expect(jest.isMockFunction(cookie)).toBeTruthy();
    expect(domain('http://www.google.com')).toEqual('google.com');
    expect(domain('http://www.google.co.uk')).toEqual('google.co.uk');
    expect(domain('http://google.co.uk')).toEqual('google.co.uk');
    expect(domain('http://google.co.il')).toEqual('google.co.il');
    expect(domain('http://gist.github.com/calvinfo/some_file')).toEqual('github.com');
    expect(domain('http://localhost:3000')).toEqual('');
    expect(domain('https://google.com:443/stuff')).toEqual('google.com');
    expect(domain('http://dev:3000')).toEqual('');
    expect(domain('http://0.0.0.0')).toEqual('');
    expect(domain('http://127.0.0.1')).toEqual('');
    expect(domain('http://86.77.65.90')).toEqual('');
    expect(domain('http://app.rudderstack.com')).toEqual('rudderstack.com');
  });
});
