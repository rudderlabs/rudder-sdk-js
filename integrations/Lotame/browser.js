import logger from "../../utils/logUtil";
class Lotame {
  constructor(config) {
    this.clientId = config.clientId;
    this.clientIdSpace = config.clientIdSpace;
    this.name = "LOTAME";
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

  identify(rudderElement) {
    // ga("set", "userId", rudderElement.message.anonymous_id);
    logger.debug("in Lotame identify");
    let userId = rudderElement.message.userId;
    let lotameDspSource = `http://sync.crwdcntrl.net/map/c=${clientId}/tp=${clientIdSpace}/tpid=${userId}`; 
    
    let googleDspSource = `https://cm.g.doubleclick.net/pixel?google_nid=lotameddp&google_cm`; 
    let tubeMogulDspSource = `https://sync-tm.everesttech.net/upi/pid/bsTd8NdE?redir=https%3A%2F%2Fsync.crwdcntrl.net%2Fmap%2Fc%3D1811%2Ftp%3DTBMG%2Ftpid%3D%24%7BTM_USER_ID%7D`; 
    let appNexusDspSource = `http://ib.adnxs.com/getuid?http%3A%2F%2Fsync.crwdcntrl.net%2Fmap%2Fc=281%2Frand=${random}%2Ftpid%3D%24UID%2Ftp%3DANXS`; 
    let tradeDeskDspSource = `http://ib.adnxs.com/getuid?http%3A%2F%2Fsync.crwdcntrl.net%2Fmap%2Fc=281%2Frand=${random}%2Ftpid%3D%24UID%2Ftp%3DANXS`; 

    addPixel(lotameDspSource, "1", "1");
    addPixel(googleDspSource, "1", "1");
    addPixel(tubeMogulDspSource, "1", "1");
    addPixel(appNexusDspSource, "1", "1");
    addPixel(tradeDeskDspSource, "1", "1");
  }

  track(rudderElement) {
    logger.debug("track not supported for lotame");
  }

  page(rudderElement) {
    logger.debug("in Lotame page");
    let lotameBcpSource = `https://bcp.crwdcntrl.net/5/c=14830/b=77419654`; 
    addPixel(lotameBcpSource, "1", "1"); 
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
