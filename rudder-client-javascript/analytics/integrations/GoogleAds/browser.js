class GoogleAds {
  constructor(config) {
    //this.accountId = config.accountId;//AW-696901813
    this.conversionId = config.conversionId;
    this.pageLoadConversions = config.pageLoadConversions;
    this.clickEventConversions = config.clickEventConversions;

    this.name = "GOOGLEADS";
  }

  init() {
    let sourceUrl = "https://www.googletagmanager.com/gtag/js?id="+this.conversionId;
    (function (id, src, document) {
      console.log("in script loader=== " + id);
      let js = document.createElement("script");
      js.src = src;
      js.async = 1;
      js.type = "text/javascript";
      js.id = id;
      let e = document.getElementsByTagName("head")[0];
      console.log("==script==", e);
      e.appendChild(js);
    })('googleAds-integration', sourceUrl, document);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', this.conversionId);

    console.log("===in init Google Ads===");
  }

  identify(rudderElement) {
    console.log("method not supported");
  }

  //https://developers.google.com/gtagjs/reference/event
  track(rudderElement) {
    console.log("in GoogleAdsAnalyticsManager track");
    let conversionData = this.getConversionData(this.clickEventConversions, rudderElement.message.event);
    if(conversionData['conversionLabel']){
      let conversionLabel = conversionData['conversionLabel']
      let eventName = conversionData['eventName'];
      let sendToValue = this.conversionId + "/" + conversionLabel;
      let properties = {};
      if(rudderElement.properties){
        properties['value'] = rudderElement.properties['revenue']
        properties['currency'] = rudderElement.properties['currency']
        properties['transaction_id'] = rudderElement.properties['order_id']
      }
      properties['send_to'] = sendToValue;
      window.gtag('event', eventName, properties);
    }
    
  }

  page(rudderElement) {
    console.log("in GoogleAdsAnalyticsManager page");
    let conversionData = this.getConversionData(this.pageLoadConversions, rudderElement.message.name);
    if(conversionData['conversionLabel']){
      let conversionLabel = conversionData['conversionLabel']
      let eventName = conversionData['eventName'];
      window.gtag('event', eventName, {'send_to': this.conversionId + "/" + conversionLabel});
    }
    
  }

  getConversionData(eventTypeConversions, eventName){
    let conversionData = {}
    if(eventTypeConversions){
      eventTypeConversions.forEach(eventTypeConversion => {
        if(eventTypeConversion.name.toLowerCase() === eventName.toLowerCase()){
          //rudderElement["message"]["name"]
          conversionData['conversionLabel'] = eventTypeConversion.conversionLabel;
          conversionData['eventName'] = eventTypeConversion.name;
          return;
        }
      });
    }
    return conversionData;
  }

  isLoaded() {
    return window.dataLayer.push !== Array.prototype.push;
  }
}

export { GoogleAds };
