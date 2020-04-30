import logger from "../../utils/logUtil";
import { LotameStorage } from "./LotameStorage";
class Lotame {
  constructor(config, analytics) {
    this.name = "LOTAME";
    this.analytics = analytics;
    this.storage = LotameStorage;
    this.bcpUrlSettings = config.bcpUrlSettings;
    this.dspUrlSettings = config.dspUrlSettings;
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
    let image = document.createElement("img");
    image.src = source;
    image.setAttribute("width", width);
    image.setAttribute("height", height);
    document.getElementsByTagName("body")[0].appendChild(image);
  }

  syncPixel(userId) {
    logger.debug("===== in syncPixel ======");

    if (this.dspUrlSettings && this.dspUrlSettings.length > 0) {
      this.dspUrlSettings.forEach(urlSettings => {
        let dspUrl = this.compileUrl(
          { ...this.mappings, userId: userId },
          urlSettings.dspUrlTemplate
        );
        this.addPixel(dspUrl, "1", "1");
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

    if (this.bcpUrlSettings && this.bcpUrlSettings.length > 0) {
      this.bcpUrlSettings.forEach(urlSettings => {
        let bcpUrl = this.compileUrl(
          { ...this.mappings },
          urlSettings.bcpUrlTemplate
        );
        this.addPixel(bcpUrl, "1", "1");
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
