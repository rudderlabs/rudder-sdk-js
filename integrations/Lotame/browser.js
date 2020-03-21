import logger from "../../utils/logUtil";
import {LotameStorage} from "./LotameStorage";
import Handlebars from "handlebars"
class Lotame {
  constructor(config) {
    this.name = "LOTAME";
    this.storage = LotameStorage;
    this.bcpUrlSettings = config.bcpUrlSettings;
    this.dspUrlSettings = config.dspUrlSettings;
    this.mappings = {};
    config.mappings.forEach( mapping => {
      let key = mapping.key;
      let value = mapping.value;
      this.mappings[key] = value;
    });
  }

  init() {
    logger.debug("===in init Lotame===");
  }

  addPixel(source, width, height){
    let image = document.createElement('img'); 
    image.src =  source;
    image.setAttribute("width", width);
    image.setAttribute("height", height);
    document.getElementsByTagName('body')[0].appendChild(image);
  }

  synchPixel(userId){
    logger.debug("===== in synchPixel ======");

    if(this.dspUrlSettings && this.dspUrlSettings.length > 0){
      this.dspUrlSettings.forEach(urlSettings => {
        let template = Handlebars.compile(urlSettings.dspUrlTemplate);
        let dspUrl = template({...this.mappings, userId:userId});
        this.addPixel(dspUrl, "1", "1");
      });
    }
    this.storage.setLotameSynchTime(Date.now());

  }

  identify(rudderElement) {
    logger.debug("in Lotame identify");
    let userId = rudderElement.message.userId;
    this.synchPixel(userId); 
  }

  track(rudderElement) {
    logger.debug("track not supported for lotame");
  }

  page(rudderElement) {
    logger.debug("in Lotame page");

    if(this.bcpUrlSettings && this.bcpUrlSettings.length > 0){
      this.bcpUrlSettings.forEach(urlSettings => {
        let template = Handlebars.compile(urlSettings.bcpUrlTemplate);
        let bcpUrl = template({...this.mappings});
        this.addPixel(bcpUrl, "1", "1");
      });
      
    }

    if(rudderElement.message.userId && this.isPixelToBeSynched()){
      this.synchPixel(rudderElement.message.userId);
    }
  }

  isPixelToBeSynched(){
    let lastSynchedTime = this.storage.getLotameSynchTime();
    let currentTime = Date.now();
    if(!lastSynchedTime){
      return true;
    }

    let difference = Math.floor((currentTime - lastSynchedTime) / (1000 * 3600 * 24));
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
