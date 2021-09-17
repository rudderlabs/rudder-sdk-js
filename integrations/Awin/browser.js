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
  }

  isLoaded() {
    logger.debug("===in isLoaded Awin===");
    return !!window.AWIN;
  }

  isReady() {
    return !!window.AWIN;
  }

  addPixel(image,url) {
    logger.debug("Adding image pixel");
    image.src = url;
    image.setAttribute("border",0);
    image.setAttribute("width", 0);
    image.setAttribute("height", 0);

    logger.debug(`Image Pixel :: ${window.image}`);
    document.getElementsByTagName("body")[0].appendChild(window.image);
  }

  propertiesValidator(properties){
    let finalProperties =properties;
    if(!properties.amount ){
      finalProperties.amount= null;
    }
    if(!properties.orderRef){
      finalProperties.orderRef=null;
    }
    if(!properties.parts){
      finalProperties.parts=null;
    }
    if(!properties.voucher){
      finalProperties.voucher=null;
    }
    if(!properties.currency){
      finalProperties.currency=null;
    }
    if(!properties.test){
      finalProperties.test=null;
    }
    if(!properties.channel){
      finalProperties.channel=null;
    }
    return finalProperties;
  }

  track(rudderElement) {
    logger.debug("===in track Awin===");
    let image = document.createElement("img");
    const { properties } = rudderElement.message;
    if(!properties){
      logger.debug("properties are mandatory");
      return;
    }
    properties = this.propertiesValidator(properties);
    const url = `https://www.awin1.com/sread.img?tt=ns&tv=2&merchant=${this.advertiserId}&amount=${properties.amount}&cr=${properties.currency}&ref=${properties.orderRef}&parts=${properties.parts}&vc=${properties.voucher}&ch=${properties.channel}&testmode=${properties.test}`
    this.addPixel(image,url);
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
