/* eslint-disable class-methods-use-this */
import logger from "../../utils/logUtil";
import { LOAD_ORIGIN } from "../ScriptLoader";
import { NAME } from "./constants";
import {del} from "obj-case";

/*
E-commerce support required for logPurchase support & other e-commerce events as track with productId changed
*/
class Braze {
  constructor(config, analytics) {
    this.analytics = analytics;
    this.appKey = config.appKey;
    this.enableHtmlInAppMessages = config.enableHtmlInAppMessages || false;
    this.allowUserSuppliedJavascript =
    config.allowUserSuppliedJavascript || false;
    if (!config.appKey) this.appKey = "";
    this.endPoint = "";
    if (config.dataCenter) {
      // ref: https://www.braze.com/docs/user_guide/administrative/access_braze/braze_instances
      const dataCenterArr = config.dataCenter.trim().split("-");
      if (dataCenterArr[0].toLowerCase() === "eu") {
        this.endPoint = `sdk.fra-${dataCenterArr[1]}.braze.eu`;
      } else {
        this.endPoint = `sdk.iad-${dataCenterArr[1]}.braze.com`;
      }
    }

    this.name = NAME;

    logger.debug("Config ", config);
  }

  /** https://js.appboycdn.com/web-sdk/latest/doc/ab.User.html#toc4
   */

  formatGender(gender) {
    if (!gender) return;
    if (typeof gender !== "string") return;

    const femaleGenders = ["woman", "female", "w", "f"];
    const maleGenders = ["man", "male", "m"];
    const otherGenders = ["other", "o"];

    if (femaleGenders.indexOf(gender.toLowerCase()) > -1)
      return window.braze.User.Genders.FEMALE;
    if (maleGenders.indexOf(gender.toLowerCase()) > -1)
      return window.braze.User.Genders.MALE;
    if (otherGenders.indexOf(gender.toLowerCase()) > -1)
      return window.braze.User.Genders.OTHER;
  }

  init() {
    logger.debug("===init Braze===");

    // load braze
    +function(a,p,P,b,y){a.braze={};a.brazeQueue=[];for(var s="BrazeSdkMetadata DeviceProperties Card Card.prototype.dismissCard Card.prototype.removeAllSubscriptions Card.prototype.removeSubscription Card.prototype.subscribeToClickedEvent Card.prototype.subscribeToDismissedEvent Card.fromContentCardsJson Banner CaptionedImage ClassicCard ControlCard ContentCards ContentCards.prototype.getUnviewedCardCount Feed Feed.prototype.getUnreadCardCount ControlMessage InAppMessage InAppMessage.SlideFrom InAppMessage.ClickAction InAppMessage.DismissType InAppMessage.OpenTarget InAppMessage.ImageStyle InAppMessage.Orientation InAppMessage.TextAlignment InAppMessage.CropType InAppMessage.prototype.closeMessage InAppMessage.prototype.removeAllSubscriptions InAppMessage.prototype.removeSubscription InAppMessage.prototype.subscribeToClickedEvent InAppMessage.prototype.subscribeToDismissedEvent InAppMessage.fromJson FullScreenMessage ModalMessage HtmlMessage SlideUpMessage User User.Genders User.NotificationSubscriptionTypes User.prototype.addAlias User.prototype.addToCustomAttributeArray User.prototype.addToSubscriptionGroup User.prototype.getUserId User.prototype.incrementCustomUserAttribute User.prototype.removeFromCustomAttributeArray User.prototype.removeFromSubscriptionGroup User.prototype.setCountry User.prototype.setCustomLocationAttribute User.prototype.setCustomUserAttribute User.prototype.setDateOfBirth User.prototype.setEmail User.prototype.setEmailNotificationSubscriptionType User.prototype.setFirstName User.prototype.setGender User.prototype.setHomeCity User.prototype.setLanguage User.prototype.setLastKnownLocation User.prototype.setLastName User.prototype.setPhoneNumber User.prototype.setPushNotificationSubscriptionType InAppMessageButton InAppMessageButton.prototype.removeAllSubscriptions InAppMessageButton.prototype.removeSubscription InAppMessageButton.prototype.subscribeToClickedEvent automaticallyShowInAppMessages destroyFeed hideContentCards showContentCards showFeed showInAppMessage toggleContentCards toggleFeed changeUser destroy getDeviceId initialize isPushBlocked isPushPermissionGranted isPushSupported logCardClick logCardDismissal logCardImpressions logContentCardImpressions logContentCardsDisplayed logCustomEvent logFeedDisplayed logInAppMessageButtonClick logInAppMessageClick logInAppMessageHtmlClick logInAppMessageImpression logPurchase openSession requestPushPermission removeAllSubscriptions removeSubscription requestContentCardsRefresh requestFeedRefresh requestImmediateDataFlush enableSDK isDisabled setLogger setSdkAuthenticationSignature addSdkMetadata disableSDK subscribeToContentCardsUpdates subscribeToFeedUpdates subscribeToInAppMessage subscribeToSdkAuthenticationFailures toggleLogging unregisterPush wipeData handleBrazeAction".split(" "),i=0;i<s.length;i++){for(var m=s[i],k=a.braze,l=m.split("."),j=0;j<l.length-1;j++)k=k[l[j]];k[l[j]]=(new Function("return function "+m.replace(/\./g,"_")+"(){window.brazeQueue.push(arguments); return true}"))()}window.braze.getCachedContentCards=function(){return new window.braze.ContentCards};window.braze.getCachedFeed=function(){return new window.braze.Feed};window.braze.getUser=function(){return new window.braze.User};(y=p.createElement(P)).type='text/javascript';
      y.src='https://js.appboycdn.com/web-sdk/4.2/braze.min.js';
      y.async=1;(b=p.getElementsByTagName(P)[0]).parentNode.insertBefore(y,b)
    }(window,document,'script');

    window.braze.initialize(this.appKey, {
      enableLogging: true,
      baseUrl: this.endPoint,
    });
    window.braze.automaticallyShowInAppMessages();

    const { userId } = this.analytics;
    // send userId if you have it https://js.appboycdn.com/web-sdk/latest/doc/module-appboy.html#.changeUser
    if (userId)
      braze.changeUser(userId);
    window.braze.openSession();
  }

  handleReservedProperties(props) {
    // remove reserved keys from custom event properties
    // https://www.appboy.com/documentation/Platform_Wide/#reserved-keys
    const reserved = [
      "time",
      "product_id",
      "quantity",
      "event_name",
      "price",
      "currency",
    ];

    reserved.forEach((element) => {
      delete props[element];
    });
    return props;
  }

  identify(rudderElement) {
    const { userId } = rudderElement.message;
    const { address } = rudderElement.message.context.traits;
    const { birthday } = rudderElement.message.context.traits;
    const { email } = rudderElement.message.context.traits;
    const { firstname } = rudderElement.message.context.traits;
    const { gender } = rudderElement.message.context.traits;
    const { lastname } = rudderElement.message.context.traits;
    const { phone } = rudderElement.message.context.traits;

    // This is a hack to make a deep copy that is not recommended because it will often fail:
    const traits = JSON.parse(
        JSON.stringify(rudderElement.message.context.traits)
    );

    window.braze.changeUser(userId);
    // method removed from v4 https://www.braze.com/docs/api/objects_filters/user_attributes_object#braze-user-profile-fields
    // window.braze.getUser().setAvatarImageUrl(avatar);
    if (email) window.braze.getUser().setEmail(email);
    if (firstname) window.braze.getUser().setFirstName(firstname);
    if (gender) window.braze.getUser().setGender(this.formatGender(gender));
    if (lastname) window.braze.getUser().setLastName(lastname);
    if (phone) window.braze.getUser().setPhoneNumber(phone);
    if (address) {
      window.braze.getUser().setCountry(address.country);
      window.braze.getUser().setHomeCity(address.city);
    }
    if (birthday) {
      window.braze.getUser()
          .setDateOfBirth(
              birthday.getUTCFullYear(),
              birthday.getUTCMonth() + 1,
              birthday.getUTCDate()
          );
    }

    // remove reserved keys https://www.appboy.com/documentation/Platform_Wide/#reserved-keys
    const reserved = [
      "avatar",
      "address",
      "birthday",
      "email",
      "id",
      "firstname",
      "gender",
      "lastname",
      "phone",
      "facebook",
      "twitter",
      "first_name",
      "last_name",
      "dob",
      "external_id",
      "country",
      "home_city",
      "bio",
      "gender",
      "phone",
      "email_subscribe",
      "push_subscribe",
    ];

    reserved.forEach((element) => {
      delete traits[element];
    });

    Object.keys(traits).forEach((key) => {
      window.braze.getUser().setCustomUserAttribute(key, traits[key]);
    });
  }

  handlePurchase(properties, userId) {
    const { products } = properties;
    const currencyCode = properties.currency;

    window.braze.changeUser(userId);

    // del used properties
    del(properties, "products");
    del(properties, "currency");

    // we have to make a separate call to appboy for each product
    products.forEach((product) => {
      const productId = product.product_id;
      const { price } = product;
      const { quantity } = product;
      if (quantity && price && productId)
        window.braze.logPurchase(
            productId,
            price,
            currencyCode,
            quantity,
            properties
        );
    });
  }

  track(rudderElement) {
    const { userId } = rudderElement.message;
    const eventName = rudderElement.message.event;
    let { properties } = rudderElement.message;

    window.braze.changeUser(userId);

    if (eventName.toLowerCase() === "order completed") {
      this.handlePurchase(properties, userId);
    } else {
      properties = this.handleReservedProperties(properties);
      window.braze.logCustomEvent(eventName, properties);
    }
  }

  page(rudderElement) {
    const { userId } = rudderElement.message;
    const eventName = rudderElement.message.name;
    let { properties } = rudderElement.message;
    properties = this.handleReservedProperties(properties);
    window.braze.changeUser(userId);
    window.braze.logCustomEvent(eventName, properties);
  }

  isLoaded() {
    return window.brazeQueue === null;
  }

  isReady() {
    return window.brazeQueue === null;
  }
}

export { Braze };
