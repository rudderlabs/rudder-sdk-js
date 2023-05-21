import { del } from 'obj-case';
import cloneDeep from 'lodash.clonedeep';
import isEqual from 'lodash.isequal';
import * as R from 'ramda';
import Logger from '../../utils/logger';
import { LOAD_ORIGIN } from '../../utils/ScriptLoader';
import { BrazeOperationString, NAME } from './constants';
import Storage from '../../utils/storage/storage';
import { isObject } from '../../utils/utils';

const logger = new Logger(NAME);

/*
E-commerce support required for logPurchase support & other e-commerce events as track with productId changed
*/
class Braze {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.appKey = config.appKey;
    this.trackAnonymousUser = config.trackAnonymousUser;
    this.enableBrazeLogging = config.enableBrazeLogging || false;
    this.enableHtmlInAppMessages = config.enableHtmlInAppMessages || false;
    this.allowUserSuppliedJavascript = config.allowUserSuppliedJavascript || false;
    if (!config.appKey) this.appKey = '';
    this.endPoint = '';
    if (config.dataCenter) {
      // ref: https://www.braze.com/docs/user_guide/administrative/access_braze/braze_instances
      const dataCenterArr = config.dataCenter.trim().split('-');
      if (dataCenterArr[0].toLowerCase() === 'eu') {
        this.endPoint = `sdk.fra-${dataCenterArr[1]}.braze.eu`;
      } else {
        this.endPoint = `sdk.iad-${dataCenterArr[1]}.braze.com`;
      }
    }

    this.name = NAME;
    this.supportDedup = config.supportDedup || false;
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
    logger.debug('Config ', config);
  }

  /** https://js.appboycdn.com/web-sdk/latest/doc/ab.User.html#toc4
   */
  formatGender(gender) {
    if (!gender) return undefined;
    if (typeof gender !== 'string') return undefined;

    const femaleGenders = ['woman', 'female', 'w', 'f'];
    const maleGenders = ['man', 'male', 'm'];
    const otherGenders = ['other', 'o'];

    if (femaleGenders.includes(gender.toLowerCase())) return window.braze.User.Genders.FEMALE;
    if (maleGenders.includes(gender.toLowerCase())) return window.braze.User.Genders.MALE;
    if (otherGenders.includes(gender.toLowerCase())) return window.braze.User.Genders.OTHER;
  }

  init() {
    logger.debug('===in init Braze===');

    // load braze
    /* eslint-disable */
    +(function (a, p, P, b, y) {
      a.braze = {};
      a.brazeQueue = [];
      for (let s = BrazeOperationString.split(' '), i = 0; i < s.length; i++) {
        for (var m = s[i], k = a.braze, l = m.split('.'), j = 0; j < l.length - 1; j++) k = k[l[j]];
        k[l[j]] = new Function(
          `return function ${m.replace(
            /\./g,
            '_',
          )}(){window.brazeQueue.push(arguments); return true}`,
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
      (y = p.createElement(P)).type = 'text/javascript';
      y.src = 'https://js.appboycdn.com/web-sdk/4.2/braze.min.js';
      y.async = 1;
      y.setAttribute('data-loader', LOAD_ORIGIN);
      (b = p.getElementsByTagName(P)[0]).parentNode.insertBefore(y, b);
    })(window, document, 'script');
    /* eslint-enable */

    window.braze.initialize(this.appKey, {
      enableLogging: this.enableBrazeLogging,
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
    const reserved = ['time', 'product_id', 'quantity', 'event_name', 'price', 'currency'];

    reserved.forEach((element) => {
      // eslint-disable-next-line no-param-reassign
      delete props[element];
    });
    return props;
  }

  /**
   * As each users will have unique session, So if the supportDedup is enabled from config,
   * then we are comparing from the previous payload and tried to reduce the redundant data.
   * If supportDedup is enabled,
   * Examples:
   * - If userId is different from previous call, then it will make new call and store the payload.
   * - It will deeply check all other attributes and pass the unique or changed fields.
   *   1st- payload                                                                                     2nd- payload
   * rudderanalytics.identify("rudderUserId100", {                                                   rudderanalytics.identify("rudderUserId100", {
   *  name: "Rudder Keener",                                                                          name: "Rudder Keener",
   *  email: "rudder100@example.com",                                                                 email: "rudder100@example.com",
   *  primaryEmail: "test350@email.com",                                                              primaryEmail: "test350@email.com",
   *  country: "USA",                                                                                 country: "USA",
   *  subscription: "youtube-prime-6",                                                                subscription: "youtube-prime-6",
   *  channelName: ["b", "d", "e", "f"],                                                              channelName: ["b", "d", "e", "f"],
   *  gender: "male",                                                                                 gender: "male",
   *  facebook: "https://www.facebook.com/rudder.123",                                                facebook: "https://www.facebook.com/rudder.345",
   *  birthday: new Date("2000-10-23"),                                                               birthday: new Date("2000-10-24"),
   *  firstname: "Rudder",                                                                            firstname: "Rudder",
   *  lastname: "Keener",                                                                             lastname: "Usertest",
   *  phone: "9112345631",                                                                            phone: "9112345631",
   *  key1: "value4",                                                                                 key1: "value5",
   *  address: {                                                                                      address: {
   *   city: "Manali",                                                                                 city: "Shimla",
   *   country: "India",                                                                               country: "India",
   *  },                                                                                              },
   * });                                                                                             });
   * As both payload have same userId so it will deeply check all other attributes and pass the unique fields
   * or the updated fields.
   * @param {*} rudderElement
   */
  identify(rudderElement) {
    logger.debug('in Braze identify');
    const { message } = rudderElement;
    const { userId } = message;
    const {
      context: {
        traits: {
          email,
          firstName,
          firstname,
          lastname,
          lastName,
          gender,
          phone,
          address,
          birthday,
          dob,
        },
      },
    } = message;

    const calculatedBirthday = birthday || dob;
    const calculatedFirstName = firstName || firstname;
    const calculatedLastName = lastName || lastname;

    // remove reserved keys https://www.appboy.com/documentation/Platform_Wide/#reserved-keys
    const reserved = [
      'address',
      'birthday',
      'email',
      'id',
      'firstname',
      'gender',
      'lastname',
      'phone',
      'dob',
      'external_id',
      'country',
      'home_city',
      'bio',
      'email_subscribe',
      'push_subscribe',
    ];
    // function set Address
    function setAddress() {
      window.braze.getUser().setCountry(address?.country);
      window.braze.getUser().setHomeCity(address?.city);
    }
    // function set Birthday
    function setBirthday() {
      window.braze
        .getUser()
        .setDateOfBirth(
          calculatedBirthday.getUTCFullYear(),
          calculatedBirthday.getUTCMonth() + 1,
          calculatedBirthday.getUTCDate(),
        );
    }
    // function set Email
    function setEmail() {
      window.braze.getUser().setEmail(email);
    }
    // function set firstName
    function setFirstName() {
      window.braze.getUser().setFirstName(calculatedFirstName);
    }
    // function set gender
    function setGender(genderName) {
      window.braze.getUser().setGender(genderName);
    }
    // function set lastName
    function setLastName() {
      window.braze.getUser().setLastName(calculatedLastName);
    }
    function setPhone() {
      window.braze.getUser().setPhoneNumber(phone);
    }

    // deep clone the traits object
    const {
      message: {
        context: { traits },
      },
    } = rudderElement;
    let clonedTraits = {};
    if (traits) {
      clonedTraits = cloneDeep(rudderElement.message.context.traits);
    }

    reserved.forEach((element) => {
      delete clonedTraits[element];
    });

    const previousPayload = Storage.getItem('rs_braze_dedup_attributes') || null;
    if (
      this.supportDedup &&
      !R.isEmpty(previousPayload) &&
      userId === previousPayload?.message?.userId
    ) {
      const prevMessage = previousPayload?.message;
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
    if (this.supportDedup && isObject(previousPayload) && !R.isEmpty(previousPayload)) {
      Storage.setItem('rs_braze_dedup_attributes', { ...previousPayload, ...rudderElement });
    }
  }

  handlePurchase(properties, userId) {
    const { products } = properties;
    const currencyCode = properties.currency;

    window.braze.changeUser(userId);

    // del used properties
    del(properties, 'products');
    del(properties, 'currency');

    // we have to make a separate call to appboy for each product
    if (products && Array.isArray(products) && products.length > 0) {
      products.forEach((product) => {
        const productId = product.product_id;
        const { price } = product;
        const { quantity } = product;
        if (quantity && price && productId)
          window.braze.logPurchase(productId, price, currencyCode, quantity, properties);
      });
    }
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
      if (eventName.toLowerCase() === 'order completed') {
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
      window.braze.logCustomEvent('Page View', properties);
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
