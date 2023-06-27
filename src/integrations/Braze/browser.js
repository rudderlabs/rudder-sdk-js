import isEqual from 'lodash.isequal';
import * as R from 'ramda';
import Logger from '../../utils/logger';

import { NAME } from './constants';
import Storage from '../../utils/storage/index';
import { isObject } from '../../utils/utils';
import { handlePurchase, formatGender, handleReservedProperties, loadBraze } from './utils';

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
    const { areTransformationsConnected, destinationId } = destinationInfo || {};
    this.areTransformationsConnected = areTransformationsConnected;
    this.destinationId = destinationId;
    logger.debug('Config ', config);
  }

  init() {
    logger.debug('===in init Braze===');
    loadBraze();
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

  // eslint-disable-next-line sonarjs/cognitive-complexity
  identify(rudderElement) {
    logger.debug('in Braze identify');
    const { message } = rudderElement;
    const { userId } = message;
    const { context } = message;
    const email = context?.traits?.email;
    const firstName = context?.traits?.firstName || context?.traits?.firstname;
    const lastName = context?.traits?.lastName || context?.traits?.lastname;
    const gender = context?.traits?.gender;
    const phone = context?.traits?.phone;
    const address = context?.traits?.address;
    const birthday = context?.traits?.birthday || context?.traits?.dob;
    const reserved = [
      'address',
      'birthday',
      'email',
      'id',
      'firstname',
      'firstName',
      'gender',
      'lastname',
      'lastName',
      'phone',
      'dob',
      'birthday',
      'external_id',
      'country',
      'home_city',
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
      try {
        const date = new Date(birthday);
        if (date.toString() === 'Invalid Date') {
          logger.error('Invalid Date for birthday');
          return;
        }
        window.braze
          .getUser()
          .setDateOfBirth(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
      } catch (error) {
        logger.error('Error in setting birthday', error);
      }
    }
    // function set Email
    function setEmail() {
      window.braze.getUser().setEmail(email);
    }
    // function set firstName
    function setFirstName() {
      window.braze.getUser().setFirstName(firstName);
    }
    // function set gender
    function setGender(genderName) {
      window.braze.getUser().setGender(genderName);
    }
    // function set lastName
    function setLastName() {
      window.braze.getUser().setLastName(lastName);
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

    const previousPayload = Storage.getItem('rs_braze_dedup_attributes') || null;
    if (this.supportDedup && !R.isEmpty(previousPayload) && userId === previousPayload?.userId) {
      const prevTraits = previousPayload?.context?.traits;
      const prevAddress = prevTraits?.address;
      const prevBirthday = prevTraits?.birthday || prevTraits?.dob;
      const prevEmail = prevTraits?.email;
      const prevFirstname = prevTraits?.firstname || prevTraits?.firstName;
      const prevGender = prevTraits?.gender;
      const prevLastname = prevTraits?.lastname || prevTraits?.lastName;
      const prevPhone = prevTraits?.phone;

      if (email && email !== prevEmail) setEmail();
      if (phone && phone !== prevPhone) setPhone();
      if (birthday && !isEqual(birthday, prevBirthday)) setBirthday();
      if (firstName && firstName !== prevFirstname) setFirstName();
      if (lastName && lastName !== prevLastname) setLastName();
      if (gender && formatGender(gender) !== formatGender(prevGender))
        setGender(formatGender(gender));
      if (address && !isEqual(address, prevAddress)) setAddress();
      Object.keys(traits)
        .filter((key) => reserved.indexOf(key) === -1)
        .forEach((key) => {
          if (!prevTraits[key] || !isEqual(prevTraits[key], traits[key])) {
            window.braze.getUser().setCustomUserAttribute(key, traits[key]);
          }
        });
    } else {
      window.braze.changeUser(userId);
      // method removed from v4 https://www.braze.com/docs/api/objects_filters/user_attributes_object#braze-user-profile-fields
      // window.braze.getUser().setAvatarImageUrl(avatar);
      if (email) setEmail();
      if (firstName) setFirstName();
      if (lastName) setLastName();
      if (gender) setGender(formatGender(gender));
      if (phone) setPhone();
      if (address) setAddress();
      if (birthday) setBirthday();
      Object.keys(traits)
        .filter((key) => reserved.indexOf(key) === -1)
        .forEach((key) => {
          window.braze.getUser().setCustomUserAttribute(key, traits[key]);
        });
    }
    if (
      this.supportDedup &&
      isObject(previousPayload) &&
      !R.isEmpty(previousPayload) &&
      userId === previousPayload?.userId
    ) {
      Storage.setItem('rs_braze_dedup_attributes', { ...previousPayload, ...message });
    } else if (this.supportDedup) {
      Storage.setItem('rs_braze_dedup_attributes', message);
    }
  }

  track(rudderElement) {
    const { userId } = rudderElement.message;
    const eventName = rudderElement.message.event;
    let { properties } = rudderElement.message;
    const { anonymousId } = rudderElement.message;
    let canSendCustomEvent = false;
    if (userId) {
      window.braze.changeUser(userId);
      canSendCustomEvent = true;
    } else if (this.trackAnonymousUser) {
      window.braze.changeUser(anonymousId);
      canSendCustomEvent = true;
    }
    if (eventName && canSendCustomEvent) {
      if (eventName.toLowerCase() === 'order completed') {
        handlePurchase(properties, userId);
      } else {
        properties = handleReservedProperties(properties);
        window.braze.logCustomEvent(eventName, properties);
      }
    }
  }

  page(rudderElement) {
    const { userId } = rudderElement.message;
    const eventName = rudderElement.message.name;
    let { properties } = rudderElement.message;
    const { anonymousId } = rudderElement.message;
    if (userId) {
      window.braze.changeUser(userId);
    } else if (this.trackAnonymousUser) {
      window.braze.changeUser(anonymousId);
    }
    properties = handleReservedProperties(properties);
    if (eventName) {
      window.braze.logCustomEvent(eventName, properties);
    } else {
      window.braze.logCustomEvent('Page View', properties);
    }
  }

  isLoaded() {
    return this.appKey && window.brazeQueue === null;
  }

  isReady() {
    return this.appKey && window.brazeQueue === null;
  }
}

export { Braze };
