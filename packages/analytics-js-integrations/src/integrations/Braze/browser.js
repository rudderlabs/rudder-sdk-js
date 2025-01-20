/* eslint-disable class-methods-use-this */
import { equals } from 'ramda';
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/Braze/constants';
import { Storage } from '@rudderstack/analytics-js-common/v1.1/utils/storage';
import { stringifyWithoutCircularV1 } from '@rudderstack/analytics-js-common/v1.1/utils/ObjectUtils';
import Logger from '../../utils/logger';
import { isObject } from '../../utils/utils';
import { isNotEmpty } from '../../utils/commonUtils';
import { handlePurchase, formatGender, handleReservedProperties } from './utils';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(DISPLAY_NAME);

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
    this.allowUserSuppliedJavascript = config.allowUserSuppliedJavascript || false;
    this.enablePushNotification = config.enablePushNotification || false;
    if (!config.appKey) this.appKey = '';
    this.endPoint = '';
    this.isHybridModeEnabled = config.connectionMode === 'hybrid';
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
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    loadNativeSdk();
    window.braze.initialize(this.appKey, {
      enableLogging: this.enableBrazeLogging,
      baseUrl: this.endPoint,
      allowUserSuppliedJavascript: this.allowUserSuppliedJavascript,
    });
    window.braze.addSdkMetadata([window.braze.BrazeSdkMetadata.CDN, 'rud']);
    window.braze.automaticallyShowInAppMessages();
    const { userId } = this.analytics;
    // send userId if you have it https://js.appboycdn.com/web-sdk/latest/doc/module-appboy.html#.changeUser
    if (userId) {
      window.braze.changeUser(userId);
    }
    if (this.enablePushNotification) {
      window.braze.requestPushPermission();
    }
    window.braze.openSession();
  }

  isLoaded() {
    return window.brazeQueue === null;
  }

  isReady() {
    if (this.isLoaded()) {
      try {
        const anonymousId = this.analytics.getAnonymousId();
        window.braze.getUser().addAlias(anonymousId, 'rudder_id');
        return true;
      } catch (error) {
        logger.error(`Error in isReady - ${stringifyWithoutCircularV1(error, true)}`);
        return false;
      }
    }
    return false;
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
    const { message } = rudderElement;
    const { userId } = message;

    if (this.isHybridModeEnabled) {
      if (userId) {
        window.braze.changeUser(userId);
      }
      return;
    }

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
        logger.error(`Error in setting birthday - ${stringifyWithoutCircularV1(error, true)}`);
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

    // eslint-disable-next-line unicorn/consistent-destructuring
    const traits = message?.context?.traits;

    const previousPayload = Storage.getItem('rs_braze_dedup_attributes') || {};
    if (this.supportDedup && isNotEmpty(previousPayload) && userId === previousPayload?.userId) {
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
      if (birthday && !equals(birthday, prevBirthday)) setBirthday();
      if (firstName && firstName !== prevFirstname) setFirstName();
      if (lastName && lastName !== prevLastname) setLastName();
      if (gender && formatGender(gender) !== formatGender(prevGender))
        setGender(formatGender(gender));
      if (address && !equals(address, prevAddress)) setAddress();
      if (isObject(traits)) {
        Object.keys(traits)
          .filter(key => reserved.indexOf(key) === -1)
          .forEach(key => {
            if (!prevTraits[key] || !equals(prevTraits[key], traits[key])) {
              window.braze.getUser().setCustomUserAttribute(key, traits[key]);
            }
          });
      }
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

      if (isObject(traits)) {
        Object.keys(traits)
          .filter(key => reserved.indexOf(key) === -1)
          .forEach(key => {
            window.braze.getUser().setCustomUserAttribute(key, traits[key]);
          });
      }
    }
    if (
      this.supportDedup &&
      isObject(previousPayload) &&
      isNotEmpty(previousPayload) &&
      userId === previousPayload?.userId
    ) {
      Storage.setItem('rs_braze_dedup_attributes', { ...previousPayload, ...message });
    } else if (this.supportDedup) {
      Storage.setItem('rs_braze_dedup_attributes', message);
    }
  }

  track(rudderElement) {
    if (this.isHybridModeEnabled) {
      return;
    }
    const eventName = rudderElement.message.event;
    let { properties } = rudderElement.message;

    const { userId } = rudderElement.message;
    let canSendCustomEvent = false;
    if (userId || this.trackAnonymousUser) {
      canSendCustomEvent = true;
    }
    if (eventName && canSendCustomEvent) {
      if (eventName.toLowerCase() === 'order completed') {
        handlePurchase(properties);
      } else {
        properties = handleReservedProperties(properties);
        window.braze.logCustomEvent(eventName, properties);
      }
    }
  }

  page(rudderElement) {
    if (this.isHybridModeEnabled) {
      return;
    }
    const eventName = rudderElement.message.name;
    let { properties } = rudderElement.message;
    properties = handleReservedProperties(properties);
    if (eventName) {
      window.braze.logCustomEvent(eventName, properties);
    } else {
      window.braze.logCustomEvent('Page View', properties);
    }
  }
}

export default Braze;
