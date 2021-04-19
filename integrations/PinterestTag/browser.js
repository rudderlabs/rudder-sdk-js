/* eslint-disable class-methods-use-this */
import logger from "../../utils/logUtil";

export default class PinterestTag {
  constructor(config, analytics) {
    this.analytics = analytics;
    this.tagId = !config.tagId ? "" : config.tagId;
    this.enhancedMatch = config.enhancedMatch || false;
    this.customProperties = config.customProperties || [];
    this.eventsMapping = config.eventsMapping || [];
    this.name = "PINTEREST_TAG";
    logger.debug("config", config);
  }

  loadScript() {
    !(function (e) {
      if (!window.pintrk) {
        window.pintrk = function () {
          window.pintrk.queue.push(Array.prototype.slice.call(arguments));
        };
        var n = window.pintrk;
        (n.queue = []), (n.version = "3.0");
        var t = document.createElement("script");
        (t.async = !0), (t.src = e);
        var r = document.getElementsByTagName("script")[0];
        r.parentNode.insertBefore(t, r);
      }
    })("https://s.pinimg.com/ct/core.js");
  }

  handleEnhancedMatch() {
    const email = this.analytics.userTraits && this.analytics.userTraits.email;
    if (email && this.enhancedMatch) {
      window.pintrk("load", this.tagId, {
        em: email,
      });
    } else {
      window.pintrk("load", this.tagId);
    }
    window.pintrk("page");
  }

  init() {
    logger.debug("===in init Pinterest Tag===");
    this.loadScript();
    this.handleEnhancedMatch();
  }

  /* utility functions ---Start here ---  */
  isLoaded() {
    logger.debug("===in isLoaded Pinterest Tag===");

    return !!(window.pintrk && window.pintrk.push !== Array.prototype.push);
  }

  isReady() {
    logger.debug("===in isReady Pinterest Tag===");

    return !!(window.pintrk && window.pintrk.push !== Array.prototype.push);
  }
  /* utility functions --- Ends here ---  */

  sendPinterestTrack(eventName, pinterestObject) {
    window.pintrk("track", eventName, pinterestObject);
  }

  generatePinterestObject() {
    // Get custom property mapping array list
    // Now loop over this array list and generate new property to be sent to pinterest
  }

  track(rudderElement) {
    const { event } = rudderElement.message;
    const { properties } = rudderElement.message;
    const pinterestObject = this.generatePinterestObject(properties);
    this.sendPinterestTrack(event, pinterestObject);
  }

  page(rudderElement) {
    const { category, name } = rudderElement.message;
    const pageObject = { name: name || "" };
    let event = "PageVisit";
    if (category) {
      pageObject.category = category;
      event = "ViewCategory";
    }
    window.pintrk("track", event, pageObject);
  }

  identify() {
    const email = this.analytics.userTraits && this.analytics.userTraits.email;
    if (email) {
      window.pintrk("set", { np: "rudderstack", em: email });
    }
  }
}
