import clone from "@ndhoule/clone";
import cookie from "component-cookie";
import defaults from "@ndhoule/defaults";
import json from "json3";
import topDomain from "@segment/top-domain";

/**
 * An object utility to persist values in cookies
 */
class CookieLocal {
  constructor(options) {
    this._options = {};
    this.options(options);
  }

  /**
   *
   * @param {*} options
   */
  options(options = {}) {
    if (arguments.length === 0) return this._options;

    let domain = "." + topDomain(window.location.href);
    if (domain === ".") domain = null;

    // the default maxage and path
    this._options = defaults(options, {
      maxage: 31536000000,
      path: "/",
      domain: domain
    });

    //try setting a cookie first
    this.set("test_rudder", true);
    if (!this.get("test_rudder")) {
      this._options.domain = null;
    }
    this.remove("test_rudder");
  }

  /**
   *
   * @param {*} key
   * @param {*} value
   */
  set(key, value) {
    try {
      value = json.stringify(value);
      cookie(key, value, clone(this._options));
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   *
   * @param {*} key
   */
  get(key) {
    try {
      let value = cookie(key);
      value = value ? json.parse(value) : null;
      return value;
    } catch (e) {
      return null;
    }
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
}

// Exporting only the instance
let Cookie = new CookieLocal({});

export { Cookie };
