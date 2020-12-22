/* eslint-disable class-methods-use-this */
/* eslint-disable lines-between-class-members */
import logger from "../../utils/logUtil";

class Pendo {
  constructor(config, analytics) {
    this.analytics = analytics;
    this.apiKey = !config.apiKey ? "" : config.apiKey;
    this.name = "PENDO";
    logger.debug("Config ", config);
  }

  init() {
    (function (apiKey) {
      (function (p, e, n, d, o) {
        var v, w, x, y, z;
        o = p[d] = p[d] || {};
        o._q = [];
        v = ["initialize", "identify", "updateOptions", "pageLoad", "track"];
        for (w = 0, x = v.length; w < x; ++w)
          (function (m) {
            o[m] =
              o[m] ||
              function () {
                o._q[m === v[0] ? "unshift" : "push"](
                  [m].concat([].slice.call(arguments, 0))
                );
              };
          })(v[w]);
        y = e.createElement(n);
        y.async = !0;
        y.src = `https://cdn.pendo.io/agent/static/${apiKey}/pendo.js`;
        z = e.getElementsByTagName(n)[0];
        z.parentNode.insertBefore(y, z);
      })(window, document, "script", "pendo");
    })(this.apiKey);
    this.initializeMe();
    logger.debug("===in init Pendo===");
  }

  initializeMe() {
    const userId =
      this.analytics.userId ||
      this.constructPendoAnonymousId(this.analytics.anonymousId);

    const accountObj = {
      id: this.analytics.groupId,
      ...this.analytics.groupTraits,
    };
    const visitorObj = { id: userId, ...this.analytics.userTraits };

    window.pendo.initialize({ account: accountObj, visitor: visitorObj });
  }

  /* utility functions ---Start here ---  */
  isLoaded() {
    return !!(window.pendo && window.pendo.push !== Array.prototype.push);
  }

  isReady() {
    return !!(window.pendo && window.pendo.push !== Array.prototype.push);
  }

  constructPendoAnonymousId(id) {
    return `_PENDO_T_${id}`;
  }
  /* utility functions --- Ends here ---  */

  /*
   * PENDO MAPPED FUNCTIONS :: identify, track, group
   */

  /* Pendo's identify call works intelligently, once u have identified a visitor/user,
   *or associated a visitor to a group/account then Pendo save this data in local storage and
   *any further upcoming calls are done taking user info from local.
   * To track user perndo maps user to Visitor in Pendo.
   */
  identify(rudderElement) {
    let visitorObj = {};
    let accountObj = {};
    const { groupId } = this.analytics;
    const id =
      this.analytics.userId ||
      this.constructPendoAnonymousId(this.analytics.anonymousId);
    visitorObj = {
      id,
      ...this.analytics.userTraits,
    };

    if (groupId) {
      accountObj = { id: groupId, ...this.analytics.groupTraits };
    }

    window.pendo.identify({ visitor: visitorObj, account: accountObj });
  }
  /*
   *Group call maps to an account for which visitor belongs.
   *It is same as identify call but here we send account object.
   */
  group(rudderElement) {
    let accountObj = {};
    let visitorObj = {};
    const { userId, traits } = rudderElement.message;
    accountObj.id = this.analytics.groupId || this.analytics.anonymousId;
    accountObj = {
      ...accountObj,
      ...traits,
    };

    if (userId) {
      visitorObj = {
        id: userId,
        ...(rudderElement.message.context &&
          rudderElement.message.context.traits),
      };
    }

    window.pendo.identify({ account: accountObj, visitor: visitorObj });
  }

  /* Once user is identified Pendo makes Track call to track user activity.
   */
  track(rudderElement) {
    const { event } = rudderElement.message;
    if (!event) {
      throw Error("Cannot call un-named track event");
    }
    const props = rudderElement.message.properties;
    window.pendo.track(event, props);
  }
}

export { Pendo };
