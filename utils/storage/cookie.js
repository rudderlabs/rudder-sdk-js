import cookie from "rudder-component-cookie";
import defaults from "@ndhoule/defaults";
import topDomain from "@segment/top-domain";
import cloneDeep from "lodash.clonedeep";
import logger from "../logUtil";

/**
 * An object utility to persist values in cookies
 */
class CookieLocal {
  constructor(opts) {
    this.cOptions = {};
    this.options(opts);
  }

  /**
   *
   * @param {*} inOptions
   */
  options(inOptions = {}) {
    if (arguments.length === 0) return this.cOptions;

    let domain = `.${topDomain(window.location.href)}`;
    if (domain === ".") domain = null;

    // the default maxage and path
    this.cOptions = defaults(inOptions, {
      maxage: 31536000000,
      path: "/",
      domain,
      samesite: "Lax",
    });

    // try setting a cookie first
    this.set("test_rudder", true);
    if (!this.get("test_rudder")) {
      this.cOptions.domain = null;
    }
    this.remove("test_rudder");
    return this.cOptions;
  }

  /**
   *
   * @param {*} key
   * @param {*} value
   */
  set(key, value) {
    try {
      cookie(key, value, cloneDeep(this.cOptions));
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
      cookie(key, null, cloneDeep(this.cOptions));
      return true;
    } catch (e) {
      return false;
    }
  }
}

// Exporting only the instance
const Cookie = new CookieLocal({});

export { Cookie };
