import is from "is";
import extend from "@ndhoule/extend";
import { del } from "obj-case";
import each from "component-each";
import { getRevenue } from "../../utils/utils";
import logger from "../../utils/logUtil";

class Kissmetrics {
  constructor(config) {
    this.apiKey = config.apiKey;
    this.prefixProperties = config.prefixProperties;
    this.name = "KISSMETRICS";
  }

  init() {
    logger.debug("===in init Kissmetrics===");
    window._kmq = window._kmq || [];

    const _kmk = window._kmk || this.apiKey;
    function _kms(u) {
      setTimeout(function () {
        const d = document;
        const f = d.getElementsByTagName("script")[0];
        const s = d.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = u;
        f.parentNode.insertBefore(s, f);
      }, 1);
    }
    _kms("//i.kissmetrics.com/i.js");
    _kms(`//scripts.kissmetrics.com/${_kmk}.2.js`);

    if (this.isEnvMobile()) {
      window._kmq.push(["set", { "Mobile Session": "Yes" }]);
    }
  }

  isEnvMobile() {
    return (
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/IEMobile/i) ||
      navigator.userAgent.match(/Opera Mini/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPhone|iPod/i)
    );
  }

  // source : https://github.com/segment-integrations/analytics.js-integration-kissmetrics/blob/master/lib/index.js
  toUnixTimestamp(date) {
    date = new Date(date);
    return Math.floor(date.getTime() / 1000);
  }

  // source : https://github.com/segment-integrations/analytics.js-integration-kissmetrics/blob/master/lib/index.js
  clean(obj) {
    let ret = {};

    for (const k in obj) {
      if (obj.hasOwnProperty(k)) {
        const value = obj[k];
        if (value === null || typeof value === "undefined") continue;

        // convert date to unix
        if (is.date(value)) {
          ret[k] = this.toUnixTimestamp(value);
          continue;
        }

        // leave boolean as is
        if (is.bool(value)) {
          ret[k] = value;
          continue;
        }

        // leave  numbers as is
        if (is.number(value)) {
          ret[k] = value;
          continue;
        }

        // convert non objects to strings
        logger.debug(value.toString());
        if (value.toString() !== "[object Object]") {
          ret[k] = value.toString();
          continue;
        }

        // json
        // must flatten including the name of the original trait/property
        const nestedObj = {};
        nestedObj[k] = value;
        const flattenedObj = this.flatten(nestedObj, { safe: true });

        // stringify arrays inside nested object to be consistent with top level behavior of arrays
        for (const key in flattenedObj) {
          if (is.array(flattenedObj[key])) {
            flattenedObj[key] = flattenedObj[key].toString();
          }
        }

        ret = extend(ret, flattenedObj);
        delete ret[k];
      }
    }
    return ret;
  }

  // source : https://github.com/segment-integrations/analytics.js-integration-kissmetrics/blob/master/lib/index.js
  flatten(target, opts) {
    opts = opts || {};

    const delimiter = opts.delimiter || ".";
    let { maxDepth } = opts;
    let currentDepth = 1;
    const output = {};

    function step(object, prev) {
      for (const key in object) {
        if (object.hasOwnProperty(key)) {
          const value = object[key];
          const isarray = opts.safe && is.array(value);
          const type = Object.prototype.toString.call(value);
          const isobject =
            type === "[object Object]" || type === "[object Array]";
          const arr = [];

          const newKey = prev ? prev + delimiter + key : key;

          if (!opts.maxDepth) {
            maxDepth = currentDepth + 1;
          }

          for (const keys in value) {
            if (value.hasOwnProperty(keys)) {
              arr.push(keys);
            }
          }

          if (!isarray && isobject && arr.length && currentDepth < maxDepth) {
            ++currentDepth;
            return step(value, newKey);
          }

          output[newKey] = value;
        }
      }
    }

    step(target);

    return output;
  }

  //  source : https://github.com/segment-integrations/analytics.js-integration-kissmetrics/blob/master/lib/index.js
  prefix(event, properties) {
    const prefixed = {};
    each(properties, function (key, val) {
      if (key === "Billing Amount") {
        prefixed[key] = val;
      } else if (key === "revenue") {
        prefixed[`${event} - ${key}`] = val;
        prefixed["Billing Amount"] = val;
      } else {
        prefixed[`${event} - ${key}`] = val;
      }
    });
    return prefixed;
  }

  identify(rudderElement) {
    logger.debug("in Kissmetrics identify");
    const traits = this.clean(rudderElement.message.context.traits);
    const userId =
      rudderElement.message.userId && rudderElement.message.userId != ""
        ? rudderElement.message.userId
        : undefined;

    if (userId) {
      window._kmq.push(["identify", userId]);
    }
    if (traits) {
      window._kmq.push(["set", traits]);
    }
  }

  track(rudderElement) {
    logger.debug("in Kissmetrics track");

    const { event } = rudderElement.message;
    let properties = JSON.parse(
      JSON.stringify(rudderElement.message.properties)
    );
    const timestamp = this.toUnixTimestamp(new Date());

    const revenue = getRevenue(properties);
    if (revenue) {
      properties.revenue = revenue;
    }

    const { products } = properties;
    if (products) {
      delete properties.products;
    }

    properties = this.clean(properties);
    logger.debug(JSON.stringify(properties));

    if (this.prefixProperties) {
      properties = this.prefix(event, properties);
    }
    window._kmq.push(["record", event, properties]);

    const iterator = function pushItem(product, i) {
      let item = product;
      if (this.prefixProperties) item = this.prefix(event, item);
      item._t = timestamp + i;
      item._d = 1;
      window.KM.set(item);
    }.bind(this);

    if (products) {
      window._kmq.push(() => {
        each(products, iterator);
      });
    }
  }

  page(rudderElement) {
    logger.debug("in Kissmetrics page");
    const pageName = rudderElement.message.name;
    const pageCategory = rudderElement.message.properties
      ? rudderElement.message.properties.category
      : undefined;
    let name = "Loaded a Page";
    if (pageName) {
      name = `Viewed ${pageName} page`;
    }
    if (pageCategory && pageName) {
      name = `Viewed ${pageCategory} ${pageName} page`;
    }

    let { properties } = rudderElement.message;
    if (this.prefixProperties) {
      properties = this.prefix("Page", properties);
    }

    window._kmq.push(["record", name, properties]);
  }

  alias(rudderElement) {
    const prev = rudderElement.message.previousId;
    const { userId } = rudderElement.message;
    window._kmq.push(["alias", userId, prev]);
  }

  group(rudderElement) {
    const { groupId } = rudderElement.message;
    let groupTraits = rudderElement.message.traits;
    groupTraits = this.prefix("Group", groupTraits);
    if (groupId) {
      groupTraits["Group - id"] = groupId;
    }
    window._kmq.push(["set", groupTraits]);
    logger.debug("in Kissmetrics group");
  }

  isLoaded() {
    return is.object(window.KM);
  }

  isReady() {
    return is.object(window.KM);
  }
}

export { Kissmetrics };
