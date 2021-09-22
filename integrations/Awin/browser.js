/* eslint-disable class-methods-use-this */
import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";

class Awin {
  constructor(config) {
    this.name = "AWIN";
    this.advertiserId = config.advertiserId;
  }

  init() {
    logger.debug("===in init  Awin===");
    if (!this.advertiserId) {
      logger.debug("advertiserId missing");
      return;
    }
    ScriptLoader("Awin", `https://www.dwin1.com/12270.js`);
    // window.AWIN = {};
    // window.AWIN.Tracking = {};
    // window.AWIN.Tracking.Sale = {};
  }

  isLoaded() {
    logger.debug("===in isLoaded Awin===");
    return !!window.AWIN;
  }

  isReady() {
    return !!window.AWIN;
  }

  addPixel(url) {
    logger.debug("Adding image pixel");
    const image = document.createElement("img");
    image.src = url;
    image.setAttribute("border", 0);
    image.setAttribute("width", 0);
    image.setAttribute("height", 0);

    logger.debug(`Image Pixel :: ${image}`);
    document.getElementsByTagName("body")[0].appendChild(image);
  }

  propertiesValidator(properties) {
    const finalProperties = properties;
    if (!properties.amount) {
      finalProperties.amount = null;
    }
    if (!properties.orderRef) {
      finalProperties.orderRef = null;
    }
    if (!properties.parts) {
      finalProperties.parts = null;
    }
    if (!properties.voucher) {
      finalProperties.voucher = null;
    }
    if (!properties.currency) {
      finalProperties.currency = null;
    }
    if (!properties.test) {
      finalProperties.test = null;
    }
    if (!properties.channel) {
      finalProperties.channel = null;
    }
    return finalProperties;
  }

  track(rudderElement) {
    logger.debug("===in track Awin===");
    window.AWIN = {};
    window.AWIN.Tracking = {};
    window.AWIN.Tracking.Sale = {};
    let { properties } = rudderElement.message;
    if (!properties) {
      logger.debug("properties are mandatory");
      return;
    }
    properties = this.propertiesValidator(properties);
    const url = `https://www.awin1.com/sread.img?tt=ns&tv=2&merchant=${this.advertiserId}&amount=${properties.amount}&cr=${properties.currency}&ref=${properties.orderRef}&parts=${properties.parts}&vc=${properties.voucher}&ch=${properties.channel}&testmode=${properties.test}`;
    // const url =
    //   "https://www.awin1.com/sread.img?tt=ns&tv=2&merchant=12270&amount=340.44&cr=GBP&ref=4-801279246&parts=DEFAULT:340.44&vc=HALFPRICE&ch=aw&testmode=0";
    this.addPixel(url);
    window.AWIN.Tracking.Sale.amount = properties.amount || "";
    window.AWIN.Tracking.Sale.orderRef = properties.amount || "";
    window.AWIN.Tracking.Sale.parts = properties.amount || "";
    window.AWIN.Tracking.Sale.voucher = properties.amount || "";
    window.AWIN.Tracking.Sale.currency = properties.amount || "";
    window.AWIN.Tracking.Sale.test = properties.amount || "";
    window.AWIN.Tracking.Sale.channel = properties.amount || "";
    // window.AWIN.Tracking.Sale.amount = "340.44";
    // window.AWIN.Tracking.Sale.orderRef = "4-801279246";
    // window.AWIN.Tracking.Sale.parts = "DEFAULT:340.44";
    // window.AWIN.Tracking.Sale.voucher = "HALFPRICE";
    // window.AWIN.Tracking.Sale.currency = "GBP";
    // window.AWIN.Tracking.Sale.test = "0";
    // window.AWIN.Tracking.Sale.channel = "aw";

    logger.debug("track completed");
  }
}

export default Awin;
