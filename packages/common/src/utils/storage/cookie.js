import cookie from 'rudder-component-cookie';
import defaults from '@ndhoule/defaults';
import topDomain from '@segment/top-domain';
import * as R from 'ramda';
import logger from '../logUtil';

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

    // the default maxage and path
    this.cOpts = defaults(inOpts, {
      maxage: 31536000000,
      path: '/',
      domain,
      samesite: 'Lax',
    });

    return this.cOpts;
  }

  /**
   *
   * @param {*} key
   * @param {*} value
   */
  set(key, value) {
    try {
      cookie(key, value, R.clone(this.cOpts));
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
  get(key) {
    return cookie(key);
  }

  /**
   *
   * @param {*} key
   */
  remove(key) {
    try {
      cookie(key, null, R.clone(this.cOpts));
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
