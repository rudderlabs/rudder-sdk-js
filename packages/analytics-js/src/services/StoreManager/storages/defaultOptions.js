import { DEFAULT_COOKIE_MAX_AGE_MS } from '../../../constants/timeouts';
import { domain } from '../top-domain';
const getDefaultCookieOptions = () => {
  const topDomain = domain(globalThis.location.href);
  return {
    maxage: DEFAULT_COOKIE_MAX_AGE_MS,
    path: '/',
    domain: !topDomain || topDomain === '.' ? undefined : topDomain,
    samesite: 'Lax',
    enabled: true,
  };
};
const getDefaultLocalStorageOptions = () => ({
  enabled: true,
});
const getDefaultSessionStorageOptions = () => ({
  enabled: true,
});
const getDefaultInMemoryStorageOptions = () => ({
  enabled: true,
});
export {
  getDefaultCookieOptions,
  getDefaultLocalStorageOptions,
  getDefaultInMemoryStorageOptions,
  getDefaultSessionStorageOptions,
};
