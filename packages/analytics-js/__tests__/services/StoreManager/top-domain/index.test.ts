import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import type { CookieOptions } from '@rudderstack/analytics-js-common/types/Storage';
import { cookie } from '@rudderstack/analytics-js-common/src/component-cookie';
import { domain } from '../../../../src/services/StoreManager/top-domain';

let cookies: Record<string, any> = {};

jest.mock('@rudderstack/analytics-js-common/component-cookie', () => {
  const originalModule = jest.requireActual('@rudderstack/analytics-js-common/component-cookie');

  return {
    __esModule: true,
    ...originalModule,
    cookie: jest.fn(
      (name: string, value: Nullable<string | number>, options: CookieOptions): void | any => {
        if (value || options) {
          const parts = options.domain?.split('.') || [];

          if (parts[1] === 'co') {
            return undefined;
          }

          cookies[name] = value;
          return cookies[name];
        }

        if (name) {
          return cookies[name];
        }

        return cookies;
      },
    ),
  };
});

describe('topDomain', () => {
  beforeEach(() => {
    cookies = {};
  });

  it('should match the following urls', () => {
    expect(jest.isMockFunction(cookie)).toBeTruthy();
    cookie('test', 1, { domain: window.location.hostname });
    expect(domain('http://www.google.com')).toEqual('google.com');
    expect(domain('http://www.google.co.uk')).toEqual('google.co.uk');
    expect(domain('http://google.co.uk')).toEqual('google.co.uk');
    expect(domain('http://google.co.il')).toEqual('google.co.il');
    expect(domain('http://gist.github.com/calvinfo/some_file')).toEqual('github.com');
    expect(domain('http://localhost:3000')).toEqual('localhost');
    expect(domain('https://google.com:443/stuff')).toEqual('google.com');
    expect(domain('http://dev:3000')).toEqual('');
    expect(domain('http://0.0.0.0')).toEqual('');
    expect(domain('http://127.0.0.1')).toEqual('');
    expect(domain('http://86.77.65.90')).toEqual('');
    expect(domain('http://app.rudderstack.com')).toEqual('rudderstack.com');
  });
});
