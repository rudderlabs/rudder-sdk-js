import clone from "@ndhoule/clone";
import cookie from "rudder-component-cookie";
import defaults from "@ndhoule/defaults";
import topDomain from "@segment/top-domain";
import logger from "../logUtil";

/**
 * An object utility to persist values in cookies
 */
class CookieLocal {
  constructor(options) {
    this._options = {};
    this.options(options);
    this.isSupportAvailable = this.checkSupportAvailability();
  }

  /**
   *
   * @param {*} options
   */
  options(options = {}) {
    if (arguments.length === 0) return this._options;

    let domain = `.${topDomain(window.location.href)}`;
    if (domain === ".") domain = null;

    // the default maxage and path
    this._options = defaults(options, {
      maxage: 31536000000,
      path: "/",
      domain,
      samesite: "Lax",
    });
  }

  /**
   *
   * @param {*} key
   * @param {*} value
   */
  set(key, value) {
    try {
      cookie(key, value, clone(this._options));
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
      cookie(key, null, clone(this._options));
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
    const name = "test_rudder_cookie";
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
