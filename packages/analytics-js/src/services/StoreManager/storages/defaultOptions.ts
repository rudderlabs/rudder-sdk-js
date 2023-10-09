import {
  ICookieStorageOptions,
  IInMemoryStorageOptions,
  ILocalStorageOptions,
} from '@rudderstack/analytics-js-common/types/Store';
import { DEFAULT_COOKIE_MAX_AGE_MS } from '../../../constants/timeouts';
import { domain } from '../top-domain';

const getDefaultCookieOptions = (): ICookieStorageOptions => {
  const topDomain = domain(globalThis.location.href);

  return {
    maxage: DEFAULT_COOKIE_MAX_AGE_MS,
    path: '/',
    domain: !topDomain || topDomain === '.' ? undefined : topDomain,
    samesite: 'Lax',
    enabled: true,
  };
};

const getDefaultLocalStorageOptions = (): ILocalStorageOptions => ({
  enabled: true,
});

const getDefaultSessionStorageOptions = (): ILocalStorageOptions => ({
  enabled: true,
});

const getDefaultInMemoryStorageOptions = (): IInMemoryStorageOptions => ({
  enabled: true,
});

export {
  getDefaultCookieOptions,
  getDefaultLocalStorageOptions,
  getDefaultInMemoryStorageOptions,
  getDefaultSessionStorageOptions,
};
