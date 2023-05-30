import { STORAGE_TEST_TOP_LEVEL_DOMAIN } from '@rudderstack/analytics-js/constants/storageKeyNames';
import { cookie } from '../component-cookie';

const legacyGetHostname = (href: string): string => {
  const l = document.createElement('a');
  l.href = href;
  return l.hostname;
};

/**
 * Levels returns all levels of the given url
 *
 * The method returns an empty array when the hostname is an ip.
 */
const levelsFunc = (url: string): string[] => {
  // This is called before the polyfills load thus new URL cannot be used
  const host = typeof window.URL !== 'function' ? legacyGetHostname(url) : new URL(url).hostname;
  const parts = host?.split('.') ?? [];
  const last = parts[parts.length - 1];
  const levels: string[] = [];

  // Ip address.
  if (parts.length === 4 && last === parseInt(last, 10).toString()) {
    return levels;
  }

  // Localhost.
  if (parts.length <= 1) {
    // Fix to support localhost
    if (parts[0].indexOf('localhost') !== -1) {
      return ['localhost'];
    }
    return levels;
  }

  // Create levels.
  for (let i = parts.length - 2; i >= 0; i -= 1) {
    levels.push(parts.slice(i).join('.'));
  }

  return levels;
};

/**
 * Get the top domain.
 *
 * The function constructs the levels of domain and attempts to set a global
 * cookie on each one when it succeeds it returns the top level domain.
 *
 * The method returns an empty string when the hostname is an ip.
 */
const domain = (url: string): string => {
  const levels = levelsFunc(url);

  // Lookup the real top level one.
  // eslint-disable-next-line unicorn/no-for-loop
  for (let i = 0; i < levels.length; i += 1) {
    const domain = levels[i];
    const cname = STORAGE_TEST_TOP_LEVEL_DOMAIN;
    const opts = {
      domain: `${domain.indexOf('localhost') !== -1 ? '' : '.'}${domain}`,
    };

    // Set cookie on domain
    cookie(cname, 1, opts);

    // If successful
    if (cookie(cname)) {
      // Remove cookie from domain
      cookie(cname, null, opts);
      return domain;
    }
  }

  return '';
};

/*
 * Exports.
 */

export { domain };
