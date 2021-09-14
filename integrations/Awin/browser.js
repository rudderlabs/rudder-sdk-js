import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";

class Awin {
  constructor(config) {
    this.name = "AWIN";
    this.advertiserId = config.advertiserId;
  }

  init() {
    logger.debug("===in init  Awin===");
    ScriptLoader("Awin", `https://www.dwin1.com/${this.advertiserId}`);
    if (!this.advertiserId) {
      logger.debug("advertiserId missing");
      return;
    }
    window.AWIN = {};
    AWIN.Tracking = {};
    AWIN.Tracking.Sale = {};
    window.image = document.createElement("img");
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
  track(rudderElement) {
    logger.debug("===in track Awin===");

    const { properties } = rudderElement.message;
    const url = `https://www.awin1.com/sread.img?tt=ns&tv=2&merchant=${this.advertiserId}&amount=${properties.amount}&cr=${properties.currency}&ref=${properties.orderRef}&parts=${properties.parts}&vc=${properties.voucher}&ch=${properties.channel}&testmode=${properties.test}`
    addPixel(url);
    window.AWIN.Tracking.Sale.amount = properties.amount ? properties.amount: "";
    window.AWIN.Tracking.Sale.orderRef = properties.orderRef ? properties.orderRef: "";
    window.AWIN.Tracking.Sale.parts = properties.parts ? properties.parts: "";
    window.AWIN.Tracking.Sale.voucher = properties.voucher ? properties.voucher: "";
    window.AWIN.Tracking.Sale.currency = properties.currency ? properties.currency: "";
    window.AWIN.Tracking.Sale.test = properties.test ? properties.test: "";
    window.AWIN.Tracking.Sale.channel = properties.channel ? properties.channel: "";

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.innerText = window.AWIN;
    document.getElementsByTagName("body")[0].appendChild(script);
  }
}

export default Awin;