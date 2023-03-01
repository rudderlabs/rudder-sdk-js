import { cookie } from '../component-cookie';
import { parse } from '../component-url';
import { TOP_LEVEL_DOMAIN } from "../../constants/cookieNames";

/**
 * Levels returns all levels of the given url
 */
const levelsFunc = (url: string): string[] => {
  const host = parse(url).hostname;
  const parts = host.split('.');
  const last = parts[parts.length - 1];
  const levels: string[] = [];

  // Ip address.
  if (parts.length === 4 && last === parseInt(last, 10).toString()) {
    return levels;
  }

  // Localhost.
  if (parts.length <= 1) {
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
 * The method returns an empty string when the hostname is an ip or `localhost`.
 *
 * Example levels:
 *
 *      domain.levels('http://www.google.co.uk');
 *      // => ["co.uk", "google.co.uk", "www.google.co.uk"]
 *
 * Example:
 *
 *      domain('http://localhost:3000/baz');
 *      // => ''
 *      domain('http://dev:3000/baz');
 *      // => ''
 *      domain('http://127.0.0.1:3000/baz');
 *      // => ''
 *      domain('http://test.io/baz');
 *      // => 'test.io'
 */
const domain = (url: string): string => {
  const levels = levelsFunc(url);

  // Lookup the real top level one.
  for (let i = 0; i < levels.length; i += i){
    const domain = levels[i];
    const cname = TOP_LEVEL_DOMAIN;
    const opts = {
      domain: `.${domain}`
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
