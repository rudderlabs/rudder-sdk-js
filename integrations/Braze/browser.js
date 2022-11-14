/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import cloneDeep from "lodash.clonedeep";
import isEqual from "lodash.isequal";
import { del } from "obj-case";
import logger from "../../utils/logUtil";
import { LOAD_ORIGIN } from "../ScriptLoader";
import { BrazeOperationString, NAME } from "./constants";

/*
E-commerce support required for logPurchase support & other e-commerce events as track with productId changed
*/
class Braze {
  constructor(config, analytics) {
    this.analytics = analytics;
    this.appKey = config.appKey;
    this.trackAnonymousUser = config.trackAnonymousUser;
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
    this.previousPayload = null;
    this.supportDedup = true;
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
    logger.debug("===in init Braze===");

    // load braze
    // eslint-disable-next-line func-names
    +(function (a, p, P, b, y) {
      a.braze = {};
      a.brazeQueue = [];
      for (let s = BrazeOperationString.split(" "), i = 0; i < s.length; i++) {
        for (
          var m = s[i], k = a.braze, l = m.split("."), j = 0;
          j < l.length - 1;
          j++
        )
          k = k[l[j]];
        k[l[j]] = new Function(
          `return function ${m.replace(
            /\./g,
            "_"
          )}(){window.brazeQueue.push(arguments); return true}`
        )();
      }
      window.braze.getCachedContentCards = function () {
        return new window.braze.ContentCards();
      };
      window.braze.getCachedFeed = function () {
        return new window.braze.Feed();
      };
      window.braze.getUser = function () {
        return new window.braze.User();
      };
      (y = p.createElement(P)).type = "text/javascript";
      y.src = "https://js.appboycdn.com/web-sdk/4.2/braze.min.js";
      y.async = 1;
      y.setAttribute("data-loader", LOAD_ORIGIN);
      (b = p.getElementsByTagName(P)[0]).parentNode.insertBefore(y, b);
    })(window, document, "script");

    window.braze.initialize(this.appKey, {
      enableLogging: true,
      baseUrl: this.endPoint,
      enableHtmlInAppMessages: this.enableHtmlInAppMessages,
      allowUserSuppliedJavascript: this.allowUserSuppliedJavascript,
    });
    window.braze.automaticallyShowInAppMessages();

    const { userId } = this.analytics;
    // send userId if you have it https://js.appboycdn.com/web-sdk/latest/doc/module-appboy.html#.changeUser
    if (userId) {
      window.braze.changeUser(userId);
    }
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
      // eslint-disable-next-line no-param-reassign
      delete props[element];
    });
    return props;
  }

  identify(rudderElement) {
    const { userId } = rudderElement.message;
    const { address } = rudderElement.message.context.traits;
    const birthday =
      rudderElement.message.context.traits?.birthday ||
      rudderElement.message.context.traits?.dob;
    const { email } = rudderElement.message.context.traits;
    const firstname =
      rudderElement.message.context.traits?.firstname ||
      rudderElement.message.context.traits?.firstName;
    const { gender } = rudderElement.message.context.traits;
    const lastname =
      rudderElement.message.context.traits?.lastname ||
      rudderElement.message.context.traits?.lastName;
    const { phone } = rudderElement.message.context.traits;

    // remove reserved keys https://www.appboy.com/documentation/Platform_Wide/#reserved-keys
    const reserved = [
      "address",
      "birthday",
      "email",
      "id",
      "firstname",
      "gender",
      "lastname",
      "phone",
      "dob",
      "external_id",
      "country",
      "home_city",
      "bio",
      "email_subscribe",
      "push_subscribe",
    ];
    // function set Address
    function setAddress() {
      window.braze.getUser().setCountry(address.country);
      window.braze.getUser().setHomeCity(address.city);
    }
    // function set Birthday
    function setBirthday() {
      window.braze
        .getUser()
        .setDateOfBirth(
          birthday.getUTCFullYear(),
          birthday.getUTCMonth() + 1,
          birthday.getUTCDate()
        );
    }
    // function set Email
    function setEmail() {
      window.braze.getUser().setEmail(email);
    }
    // function set firstName
    function setFirstName() {
      window.braze.getUser().setFirstName(firstname);
    }
    // function set gender
    function setGender(genderName) {
      window.braze.getUser().setGender(genderName);
    }
    // function set lastName
    function setLastName() {
      window.braze.getUser().setLastName(lastname);
    }
    function setPhone() {
      window.braze.getUser().setPhoneNumber(phone);
    }

    // deep clone the traits object
    let traits = {};
    if (rudderElement.message?.context?.traits) {
      traits = cloneDeep(rudderElement.message.context.traits);
    }

    reserved.forEach((element) => {
      delete traits[element];
    });

    if (
      this.supportDedup &&
      this.previousPayload !== null &&
      userId &&
      userId === this.previousPayload.rudderElement?.message?.userId
    ) {
      const prevMessage = this.previousPayload.rudderElement?.message;
      const prevTraits = prevMessage?.context?.traits;
      const prevAddress = prevTraits?.address;
      const prevBirthday = prevTraits?.birthday || prevTraits?.dob;
      const prevEmail = prevTraits?.email;
      const prevFirstname = prevTraits?.firstname || prevTraits?.firstName;
      const prevGender = prevTraits?.gender;
      const prevLastname = prevTraits?.lastname || prevTraits?.lastName;
      const prevPhone = prevTraits?.phone;

      if (address && !isEqual(address, prevAddress)) setAddress();
      if (birthday && !isEqual(birthday, prevBirthday)) setBirthday();
      if (email && email !== prevEmail) setEmail();
      if (firstname && firstname !== prevFirstname) setFirstName();
      if (gender && this.formatGender(gender) !== this.formatGender(prevGender))
        setGender(this.formatGender(gender));
      if (lastname && lastname !== prevLastname) setLastName();
      if (phone && phone !== prevPhone) setPhone();

      Object.keys(traits).forEach((key) => {
        if (!prevTraits[key] || !isEqual(prevTraits[key], traits[key])) {
          window.braze.getUser().setCustomUserAttribute(key, traits[key]);
        }
      });
    } else {
      window.braze.changeUser(userId);
      // method removed from v4 https://www.braze.com/docs/api/objects_filters/user_attributes_object#braze-user-profile-fields
      // window.braze.getUser().setAvatarImageUrl(avatar);
      if (email) setEmail();
      if (firstname) setFirstName();
      if (gender) setGender(this.formatGender(gender));
      if (lastname) setLastName();
      if (phone) setPhone();
      if (address) setAddress();
      if (birthday) setBirthday();

      Object.keys(traits).forEach((key) => {
        window.braze.getUser().setCustomUserAttribute(key, traits[key]);
      });
    }
    this.previousPayload = { ...this.previousPayload, rudderElement };
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
    let canSendCustomEvent = false;
    if (userId) {
      window.braze.changeUser(userId);
      canSendCustomEvent = true;
    } else if (this.trackAnonymousUser) {
      window.braze.changeUser(rudderElement.message.anonymousId);
      canSendCustomEvent = true;
    }
    if (eventName && canSendCustomEvent) {
      if (eventName.toLowerCase() === "order completed") {
        this.handlePurchase(properties, userId);
      } else {
        properties = this.handleReservedProperties(properties);
        window.braze.logCustomEvent(eventName, properties);
      }
    }
  }

  page(rudderElement) {
    const { userId } = rudderElement.message;
    const eventName = rudderElement.message.name;
    let { properties } = rudderElement.message;
    if (userId) {
      window.braze.changeUser(userId);
    } else if (this.trackAnonymousUser) {
      window.braze.changeUser(rudderElement.message.anonymousId);
    }
    properties = this.handleReservedProperties(properties);
    if (eventName) {
      window.braze.logCustomEvent(eventName, properties);
    } else {
      window.braze.logCustomEvent("Page View", properties);
    }
  }

  isLoaded() {
    return window.brazeQueue === null;
  }

  isReady() {
    return window.brazeQueue === null;
  }
}

export { Braze };
