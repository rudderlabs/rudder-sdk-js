import logger from "../../utils/logUtil";

/*
E-commerce support required for logPurchase support & other e-commerce events as track with productId changed
*/
class Braze {
  constructor(config,analytics) {

    this.analytics = analytics;
    this.appKey = config.appKey;
    if(!config.appKey)
      this.appKey = '' 
    this.endPoint = ''
    if(config.dataCenter)
    {
      let dataCenterArr = config.dataCenter.trim().split('-');
      if(dataCenterArr[0].toLowerCase() === 'eu')
      {
        this.endPoint = 'sdk.fra-01.braze.eu';
      }
      else
      {
        this.endPoint = 'sdk.iad-'+dataCenterArr[1]+'.braze.com'
      }
      
    }
    
    this.name = "BRAZE";
 
    logger.debug("Config ", config);
  }

/** https://js.appboycdn.com/web-sdk/latest/doc/ab.User.html#toc4
 */

 formatGender(gender) {
  if (!gender) return;
  if (typeof gender !== 'string') return;

  var femaleGenders = ['woman', 'female', 'w', 'f'];
  var maleGenders = ['man', 'male', 'm'];
  var otherGenders = ['other', 'o'];

  if (femaleGenders.indexOf(gender.toLowerCase()) > -1) return window.appboy.ab.User.Genders.FEMALE;
  if (maleGenders.indexOf(gender.toLowerCase()) > -1) return window.appboy.ab.User.Genders.MALE;
  if (otherGenders.indexOf(gender.toLowerCase()) > -1) return window.appboy.ab.User.Genders.OTHER;
}

  init() {
    logger.debug("===in init Braze==="); 
    
    //load appboy
    +function(a,p,P,b,y){a.appboy={};a.appboyQueue=[];for(var s="initialize destroy getDeviceId toggleAppboyLogging setLogger openSession changeUser requestImmediateDataFlush requestFeedRefresh subscribeToFeedUpdates requestContentCardsRefresh subscribeToContentCardsUpdates logCardImpressions logCardClick logCardDismissal logFeedDisplayed logContentCardsDisplayed logInAppMessageImpression logInAppMessageClick logInAppMessageButtonClick logInAppMessageHtmlClick subscribeToNewInAppMessages subscribeToInAppMessage removeSubscription removeAllSubscriptions logCustomEvent logPurchase isPushSupported isPushBlocked isPushGranted isPushPermissionGranted registerAppboyPushMessages unregisterAppboyPushMessages trackLocation stopWebTracking resumeWebTracking wipeData ab ab.DeviceProperties ab.User ab.User.Genders ab.User.NotificationSubscriptionTypes ab.User.prototype.getUserId ab.User.prototype.setFirstName ab.User.prototype.setLastName ab.User.prototype.setEmail ab.User.prototype.setGender ab.User.prototype.setDateOfBirth ab.User.prototype.setCountry ab.User.prototype.setHomeCity ab.User.prototype.setLanguage ab.User.prototype.setEmailNotificationSubscriptionType ab.User.prototype.setPushNotificationSubscriptionType ab.User.prototype.setPhoneNumber ab.User.prototype.setAvatarImageUrl ab.User.prototype.setLastKnownLocation ab.User.prototype.setUserAttribute ab.User.prototype.setCustomUserAttribute ab.User.prototype.addToCustomAttributeArray ab.User.prototype.removeFromCustomAttributeArray ab.User.prototype.incrementCustomUserAttribute ab.User.prototype.addAlias ab.User.prototype.setCustomLocationAttribute ab.InAppMessage ab.InAppMessage.SlideFrom ab.InAppMessage.ClickAction ab.InAppMessage.DismissType ab.InAppMessage.OpenTarget ab.InAppMessage.ImageStyle ab.InAppMessage.TextAlignment ab.InAppMessage.Orientation ab.InAppMessage.CropType ab.InAppMessage.prototype.subscribeToClickedEvent ab.InAppMessage.prototype.subscribeToDismissedEvent ab.InAppMessage.prototype.removeSubscription ab.InAppMessage.prototype.removeAllSubscriptions ab.InAppMessage.prototype.closeMessage ab.InAppMessage.Button ab.InAppMessage.Button.prototype.subscribeToClickedEvent ab.InAppMessage.Button.prototype.removeSubscription ab.InAppMessage.Button.prototype.removeAllSubscriptions ab.SlideUpMessage ab.ModalMessage ab.FullScreenMessage ab.HtmlMessage ab.ControlMessage ab.Feed ab.Feed.prototype.getUnreadCardCount ab.ContentCards ab.ContentCards.prototype.getUnviewedCardCount ab.Card ab.Card.prototype.dismissCard ab.ClassicCard ab.CaptionedImage ab.Banner ab.ControlCard ab.WindowUtils display display.automaticallyShowNewInAppMessages display.showInAppMessage display.showFeed display.destroyFeed display.toggleFeed display.showContentCards display.hideContentCards display.toggleContentCards sharedLib".split(" "),i=0;i<s.length;i++){for(var m=s[i],k=a.appboy,l=m.split("."),j=0;j<l.length-1;j++)k=k[l[j]];k[l[j]]=(new Function("return function "+m.replace(/\./g,"_")+"(){window.appboyQueue.push(arguments); return true}"))()}window.appboy.getUser=function(){return new window.appboy.ab.User};window.appboy.getCachedFeed=function(){return new window.appboy.ab.Feed};window.appboy.getCachedContentCards=function(){return new window.appboy.ab.ContentCards};(y=p.createElement(P)).type='text/javascript';
    y.src='https://js.appboycdn.com/web-sdk/2.4/appboy.min.js';
    y.async=1;(b=p.getElementsByTagName(P)[0]).parentNode.insertBefore(y,b)
  }(window,document,'script');
 
    window.appboy.initialize(this.appKey, {
      enableLogging: true,
      baseUrl:  this.endPoint
    });
    window.appboy.display.automaticallyShowNewInAppMessages();

    var userId = this.analytics.userId;
    //send userId if you have it https://js.appboycdn.com/web-sdk/latest/doc/module-appboy.html#.changeUser 
    if(userId)
      appboy.changeUser(userId);

    window.appboy.openSession();

  }

  handleReservedProperties(props){ 
    // remove reserved keys from custom event properties
    // https://www.appboy.com/documentation/Platform_Wide/#reserved-keys
    var reserved = ['time', 'product_id', 'quantity', 'event_name', 'price', 'currency'];
 
    reserved.forEach(element => {
      delete props[element]; 
    });  
    return props; 
  }

  identify(rudderElement) { 

    var userId = rudderElement.message.userId;
    var address = rudderElement.message.context.traits.address;
    var avatar = rudderElement.message.context.traits.avatar;
    var birthday = rudderElement.message.context.traits.birthday;
    var email = rudderElement.message.context.traits.email;
    var firstname = rudderElement.message.context.traits.firstname;
    var gender = rudderElement.message.context.traits.gender;
    var lastname = rudderElement.message.context.traits.lastname;
    var phone = rudderElement.message.context.traits.phone;
    
    // This is a hack to make a deep copy that is not recommended because it will often fail:
    var traits = JSON.parse(JSON.stringify(rudderElement.message.context.traits))

    window.appboy.changeUser(userId);
    window.appboy.getUser().setAvatarImageUrl(avatar);
    if(email)
     window.appboy.getUser().setEmail(email);
    if(firstname)
    window.appboy.getUser().setFirstName(firstname);
    if(gender)
      window.appboy.getUser().setGender(this.formatGender(gender));
    if(lastname)
      window.appboy.getUser().setLastName(lastname);
    if(phone)
      window.appboy.getUser().setPhoneNumber(phone);
    if (address) {
      window.appboy.getUser().setCountry(address.country);
      window.appboy.getUser().setHomeCity(address.city);
    }
    if (birthday) {
      window.appboy.getUser().setDateOfBirth(birthday.getUTCFullYear(), birthday.getUTCMonth() + 1, birthday.getUTCDate());
    }
  
    // remove reserved keys https://www.appboy.com/documentation/Platform_Wide/#reserved-keys
    var reserved = ['avatar', 'address', 'birthday', 'email', 'id', 'firstname', 'gender', 'lastname', 'phone', 'facebook', 'twitter', 'first_name', 'last_name', 'dob', 'external_id', 'country', 'home_city', 'bio', 'gender', 'phone', 'email_subscribe', 'push_subscribe'];
   
    reserved.forEach(element => {
      delete traits[element];; 
    });   
 
    Object.keys(traits).forEach( key => {
      window.appboy.getUser().setCustomUserAttribute(key, traits[key]); 
    });
  }


  handlePurchase(properties,userId){ 
    var products = properties.products ;
    var currencyCode = properties.currency; 
  
    window.appboy.changeUser(userId);
  
    // del used properties
    del(properties, 'products');
    del(properties, 'currency');
  
    // we have to make a separate call to appboy for each product
    products .forEach(product => {    
      var productId = product.product_id;
      var price = product.price;
      var quantity = product.quantity;
      if(quantity && price && productId)
        window.appboy.logPurchase(productId, price, currencyCode, quantity, properties);
    }); 

  }

  track(rudderElement) { 
   var userId = rudderElement.message.userId;
   var eventName = rudderElement.message.event;
   var properties = rudderElement.message.properties;

   window.appboy.changeUser(userId);

   if(eventName.toLowerCase() === 'order completed')
   {
     this.handlePurchase(properties,userId);
   }
   else
   {
    properties = this.handleReservedProperties(properties); 
    window.appboy.logCustomEvent(eventName, properties);  
   }
  }


  page(rudderElement) {  
    var userId = rudderElement.message.userId;
    var eventName = rudderElement.message.name;
    var properties = rudderElement.message.properties;   
    
    properties = this.handleReservedProperties(properties); 

    window.appboy.changeUser(userId);
    window.appboy.logCustomEvent(eventName, properties);  
  }

  isLoaded() {
    return window.appboyQueue === null;
  }
}

export { Braze };
