import cookie from 'rudder-component-cookie';
import topDomain from '@segment/top-domain';
import { clone } from 'ramda';
import { mergeDeepRight } from '../ObjectUtils';
import { logger } from '../logUtil';

/**
 * An object utility to persist values in cookies
 */
class CookieLocal {
  constructor(options) {
    this.cOpts = {};
    this.options(options);
    this.isSupportAvailable = this.checkSupportAvailability();
  }

  /**
   *
   * @param {*} inOpts
   */
  options(inOpts = {}) {
    if (arguments.length === 0) return this.cOpts;

    let domain = `.${topDomain(window.location.href)}`;
    if (domain === '.') domain = null;

    // Override the default options with the provided options
    this.cOpts = mergeDeepRight(
      {
        maxage: 31536000000,
        path: '/',
        domain,
        samesite: 'Lax',
      },
      inOpts,
    );

    // configure cookies for exactly same domain
    if (inOpts.sameDomainCookiesOnly) {
      delete this.cOpts.domain;
    }

    return this.cOpts;
  }

  /**
   *
   * @param {*} key
   * @param {*} value
   */
  set(key, value) {
    try {
      cookie(key, value, clone(this.cOpts));
      return true;
    } catch (e) {
      logger.error(e);
      return false;
    }
  }

  /**
   *
   * @param {*} key
   */
  // eslint-disable-next-line class-methods-use-this
  get(key) {
    return cookie(key);
  }

  /**
   *
   * @param {*} key
   */
  remove(key) {
    try {
      cookie(key, null, clone(this.cOpts));
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Function to check cookie support exists or not
   * @returns boolean
   */
  checkSupportAvailability() {
    const name = 'test_rudder_cookie';
    this.set(name, true);

    if (this.get(name)) {
      this.remove(name);
      return true;
    }
    return false;
  }
}

// Exporting only the instance
const Cookie = new CookieLocal({});

export { Cookie };
