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
    ScriptLoader("Awin", `https://www.dwin1.com/${this.advertiserId}.js`);
    window.AWIN = {};
    window.AWIN.Tracking = {};
    window.AWIN.Tracking.Sale = {};
    window.image = document.createElement("img");
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
    window.image.src = url;
    window.image.setAttribute("border",0);
    window.image.setAttribute("width", 0);
    window.image.setAttribute("height", 0);

    logger.debug(`Image Pixel :: ${window.image}`);
    document.getElementsByTagName("body")[0].appendChild(window.image);
  }

  propertiesValidator(properties){
    if(!properties.amount ){
      properties.amount= null;
    }
    if(!properties.orderRef){
      properties.orderRef=null;
    }
    if(!properties.parts){
      properties.parts=null;
    }
    if(!properties.voucher){
      properties.voucher=null;
    }
    if(!properties.currency){
      properties.currency=null;
    }
    if(!properties.test){
      properties.test=null;
    }
    if(!properties.channel){
      properties.channel=null;
    }
    return properties;
  }

  track(rudderElement) {
    logger.debug("===in track Awin===");

    const { properties } = rudderElement.message;
    properties = propertiesValidator(properties);
    const url = `https://www.awin1.com/sread.img?tt=ns&tv=2&merchant=${this.advertiserId}&amount=${properties.amount}&cr=${properties.currency}&ref=${properties.orderRef}&parts=${properties.parts}&vc=${properties.voucher}&ch=${properties.channel}&testmode=${properties.test}`
    this.addPixel(url);
    window.AWIN.Tracking.Sale.amount = properties.amount || "";
    window.AWIN.Tracking.Sale.orderRef = properties.orderRef || "";
    window.AWIN.Tracking.Sale.parts = properties.parts || "";
    window.AWIN.Tracking.Sale.voucher = properties.voucher || "";
    window.AWIN.Tracking.Sale.currency = properties.currency || "";
    window.AWIN.Tracking.Sale.test = properties.test || "";
    window.AWIN.Tracking.Sale.channel = properties.channel || "";

    logger.debug("track completed");
  }
}

export default Awin;
