import { ScriptLoader } from "../ScriptLoader";
import logger from "../../utils/logUtil";
import is from "is";
import each from "@ndhoule/each";
//var each = require('@ndhoule/each');


class FbPixel {
  constructor(config) {
    (this.blacklistPiiProperties = config.blacklistPiiProperties), //present
      (this.categoryToContent = config.categoryToContent), //map contentTypes
      (this.pixelId = config.pixelId),//present
      (this.eventsToEvents = config.eventsToEvents), //map  standardEvents
      (this.eventCustomProperties = config.eventCustomProperties), //present
      (this.valueFieldIdentifier = config.valueFieldIdentifier), //present
      (this.advancedMapping = config.advancedMapping),
      (this.traitKeyToExternalId = config.traitKeyToExternalId), //present
      (this.legacyConversionPixelId = config.legacyConversionPixelId), //map legacyevents
      (this.userIdAsPixelId = config.userIdAsPixelId), //present
      (this.whitelistPiiProperties = config.whitelistPiiProperties); //present
      this.name = "FB_PIXEL";
    console.log(config)
  }
 
  init() {
    logger.debug("===in init FbPixelRuchira===");
    console.log("===in init FbPixel Ruchira===");
    console.log(this.pixelId);
     window._fbq = function () {
      if (window.fbq.callMethod) {
        window.fbq.callMethod.apply(window.fbq, arguments);
      } else {
        window.fbq.queue.push(arguments);
      }
    };

    window.fbq = window.fbq || window._fbq;
    window.fbq.push = window.fbq;
    window.fbq.loaded = true;
    window.fbq.disablePushState = true; // disables automatic pageview tracking
    window.fbq.allowDuplicatePageViews = true; // enables fb
    window.fbq.version = "2.0";
    window.fbq.queue = [];
    window.fbq("init", this.pixelId);
    console.log(window.fbq);
    ScriptLoader(
      "fbpixel-integration",
      "//connect.facebook.net/en_US/fbevents.js"
    );
    console.log("script loaded");
 
    
   
  }

  isLoaded() {
    logger.debug("in FbPixel isLoaded");
    console.log("in FbPixel isLoaded");
    console.log(!!(window.fbq && window.fbq.callMethod))
    return !!(window.fbq && window.fbq.callMethod);
   
  }
  isReady() {
    logger.debug("in FbPixel isReady");
    console.log("in FbPixel isReady");
    console.log(!!(window.fbq && window.fbq.callMethod))
    return !!(window.fbq && window.fbq.callMethod);
  }
   page(rudderElement) {
    console.log("in page call");
    window.fbq("track", "PageView");
   }
  identify(rudderElement) {
    console.log("in identify call");
     this.page();
   }
  track(rudderElement) {
    console.log("in track call")
    var event = rudderElement.message.event;
    var revenue = this.formatRevenue(rudderElement.message.properties.revenue);
    var payload = this.buildPayLoad(rudderElement,true);
  
    payload.value = revenue;
    var standard = this.eventsToEvents;
    var legacy = this.legacyConversionPixelId;

    console.log(payload);
    window.fbq('trackSingleCustom',this.pixelId,event,payload,{
      eventID: rudderElement.message.messageId
   })

  }
  formatRevenue(revenue) {
    return Number(revenue || 0).toFixed(2);
  }

  buildPayLoad(rudderElement,isStandardEvent){
    var dateFields = [
      'checkinDate',
      'checkoutDate',
      'departingArrivalDate',
      'departingDepartureDate',
      'returningArrivalDate',
      'returningDepartureDate',
      'travelEnd',
      'travelStart'
    ];
    var defaultPiiProperties = [
      'email',
      'firstName',
      'lastName',
      'gender',
      'city',
      'country',
      'phone',
      'state',
      'zip',
      'birthday'
    ];
    var whitelistPiiProperties = this.whitelistPiiProperties || [];
    var blacklistPiiProperties = this.blacklistPiiProperties || [];
    var eventCustomProperties = this.eventCustomProperties || [];
    var customPiiProperties = {};
    for(var i = 0; i<blacklistPiiProperties[i];i++){
      var configuration = blacklistPiiProperties[i];
      customPiiProperties[configuration.blacklistPiiProperties] = true; //configuration.hashProperty
    }
    var payload = {};
    var properties = rudderElement.message.properties;

    console.log("properties")
    console.log(properties)

    for(var property in properties ){
   if(!properties.hasOwnProperty(property)){
     continue;
   }
   
   if(isStandardEvent && eventCustomProperties.indexOf(property) < 0){
     continue;
   }
  var value = properties[property];

  if(dateFields.indexOf(properties)>=0){
    if(is.date(value)){
      payload[property] = value.toISOTring().split('T')[0];
      continue;
    }
  }
  if(customPiiProperties.hasOwnProperty(property)){
    if(customPiiProperties[property] && typeof value == 'string'){
      payload[property] = sha256(value);
    }
    continue;
  }
  var isPropertyPii = defaultPiiProperties.indexOf(property) >= 0;
  var isProperyWhiteListed = whitelistPiiProperties.indexOf(property) >= 0;
  if(!isPropertyPii || isProperyWhiteListed){
    payload[property] = value;
  }
    }
  console.log("payload");
  console.log(payload);
    return payload;

  }
}

export { FbPixel };
