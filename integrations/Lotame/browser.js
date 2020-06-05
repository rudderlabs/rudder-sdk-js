import logger from "../../utils/logUtil";
import { LotameStorage } from "./LotameStorage";
class Lotame {
  constructor(config, analytics) {
    this.name = "LOTAME";
    this.analytics = analytics;
    this.storage = LotameStorage;
    this.bcpUrlSettingsPixel = config.bcpUrlSettingsPixel;
    this.bcpUrlSettingsIframe = config.bcpUrlSettingsIframe;
    this.dspUrlSettingsPixel = config.dspUrlSettingsPixel;
    this.dspUrlSettingsIframe = config.dspUrlSettingsIframe;
    this.mappings = {};
    config.mappings.forEach(mapping => {
      let key = mapping.key;
      let value = mapping.value;
      this.mappings[key] = value;
    });
  }

  init() {
    logger.debug("===in init Lotame===");
    window.LOTAME_SYNCH_CALLBACK = () => {};
  }

  addPixel(source, width, height) {
    logger.debug("Adding pixel for :: " + source);

    let image = document.createElement("img");
    image.src = source;
    image.setAttribute("width", width);
    image.setAttribute("height", height);

    logger.debug("Image Pixel :: " + image);
    document.getElementsByTagName("body")[0].appendChild(image);
  }

  addIFrame(source) {
    logger.debug("Adding iframe for :: " + source);

    let iframe = document.createElement("iframe");
    iframe.src = source;
    iframe.title = "empty";
    iframe.setAttribute("id", "LOTCCFrame");
    iframe.setAttribute("tabindex", "-1");
    iframe.setAttribute("role", "presentation");
    iframe.setAttribute("aria-hidden", "true");
    iframe.setAttribute("style", "border: 0px; width: 0px; height: 0px; display: block;");

    logger.debug("IFrame :: " + iframe);
    document.getElementsByTagName("body")[0].appendChild(iframe);
  }

  syncPixel(userId) {
    logger.debug("===== in syncPixel ======");

    logger.debug("Firing DSP Pixel URLs");
    if (this.dspUrlSettingsPixel && this.dspUrlSettingsPixel.length > 0) {
      let currentTime = Date.now();
      this.dspUrlSettingsPixel.forEach(urlSettings => {
        let dspUrl = this.compileUrl(
          { ...this.mappings, userId: userId, random: currentTime },
          urlSettings.dspUrlTemplate
        );
        this.addPixel(dspUrl, "1", "1");
      });
    }

    logger.debug("Firing DSP IFrame URLs");
    if (this.dspUrlSettingsIframe && this.dspUrlSettingsIframe.length > 0) {
      let currentTime = Date.now();
      this.dspUrlSettingsIframe.forEach(urlSettings => {
        let dspUrl = this.compileUrl(
          { ...this.mappings, userId: userId, random: currentTime },
          urlSettings.dspUrlTemplate
        );
        this.addIFrame(dspUrl);
      });
    }

    this.storage.setLotameSynchTime(Date.now());
    // emit on syncPixel
    if (this.analytics.methodToCallbackMapping["syncPixel"]) {
      this.analytics.emit("syncPixel", {
        destination: this.name
      });
    }
  }

  compileUrl(map, url) {
    Object.keys(map).forEach(key => {
      if (map.hasOwnProperty(key)) {
        let replaceKey = "{{" + key + "}}";
        let regex = new RegExp(replaceKey, "gi");
        url = url.replace(regex, map[key]);
      }
    });
    return url;
  }

  identify(rudderElement) {
    logger.debug("in Lotame identify");
    let userId = rudderElement.message.userId;
    this.syncPixel(userId);
  }

  track(rudderElement) {
    logger.debug("track not supported for lotame");
  }

  page(rudderElement) {
    logger.debug("in Lotame page");

    logger.debug("Firing BCP Pixel URLs");
    if (this.bcpUrlSettingsPixel && this.bcpUrlSettingsPixel.length > 0) {
      let currentTime = Date.now();
      this.bcpUrlSettingsPixel.forEach(urlSettings => {
        let bcpUrl = this.compileUrl(
          { ...this.mappings, random: currentTime},
          urlSettings.bcpUrlTemplate
        );
        this.addPixel(bcpUrl, "1", "1");
      });
    }

    logger.debug("Firing BCP IFrame URLs");
    if (this.bcpUrlSettingsIframe && this.bcpUrlSettingsIframe.length > 0) {
      let currentTime = Date.now();
      this.bcpUrlSettingsIframe.forEach(urlSettings => {
        let bcpUrl = this.compileUrl(
          { ...this.mappings, random: currentTime},
          urlSettings.bcpUrlTemplate
        );
        this.addIFrame(bcpUrl);
      });
    }

    if (rudderElement.message.userId && this.isPixelToBeSynched()) {
      this.syncPixel(rudderElement.message.userId);
    }
  }

  isPixelToBeSynched() {
    let lastSynchedTime = this.storage.getLotameSynchTime();
    let currentTime = Date.now();
    if (!lastSynchedTime) {
      return true;
    }

    let difference = Math.floor(
      (currentTime - lastSynchedTime) / (1000 * 3600 * 24)
    );
    return difference >= 7;
  }

  isLoaded() {
    logger.debug("in Lotame isLoaded");
    return true;
  }

  isReady() {
    return true;
  }
}

export { Lotame };
