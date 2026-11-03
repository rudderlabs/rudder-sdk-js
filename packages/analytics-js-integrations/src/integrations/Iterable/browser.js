/* eslint-disable class-methods-use-this */
import get from 'get-value';
import { ScriptLoader } from '@rudderstack/analytics-js-legacy-utilities/ScriptLoader';
import {
  NAME,
  DISPLAY_NAME,
  VENDOR_SDK_PINNED_URL,
  VENDOR_SDK_INTEGRITY,
  VENDOR_SDK_FLOATING_URL,
} from './constants';
import { resolveVendorSdkVersionPolicy } from '../../utils/vendorSdkVersionPolicy';
import Logger from '../../utils/logger';
import {
  formPurchaseEventPayload,
  existsInMapping,
  extractJWT,
  prepareInAppMessagesPayload,
} from './utils';
import { isNotEmpty, removeUndefinedAndNullValues } from '../../utils/commonUtils';

const logger = new Logger(DISPLAY_NAME);
const iterableWebSdk = '@iterable/web-sdk';
class Iterable {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.apiKey = config.apiKey;
    this.initialisationIdentifier = config.initialisationIdentifier;
    this.fetchAppEvents = undefined;
    this.sdkCallQueue = Promise.resolve();
    this.name = NAME;
    this.analytics = analytics;
    this.getInAppEventMapping = config.getInAppEventMapping || [];
    this.purchaseEventMapping = config.purchaseEventMapping || [];

    this.sendTrackForInapp = config.sendTrackForInapp;
    this.animationDuration = config.animationDuration;
    this.displayInterval = config.displayInterval;
    this.onOpenScreenReaderMessage = config.onOpenScreenReaderMessage;
    this.onOpenNodeToTakeFocus = config.onOpenNodeToTakeFocus;
    this.packageName = config.packageName;
    this.rightOffset = config.rightOffset;
    this.topOffset = config.topOffset;
    this.bottomOffset = config.bottomOffset;
    this.handleLinks = config.handleLinks;

    this.closeButtonColor = config.closeButtonColor;
    this.closeButtonSize = config.closeButtonSize;
    this.closeButtonColorTopOffset = config.closeButtonColorTopOffset;
    this.closeButtonColorSideOffset = config.closeButtonColorSideOffset;
    this.iconPath = config.iconPath;
    this.isRequiredToDismissMessage = config.isRequiredToDismissMessage;
    this.closeButtonPosition = config.closeButtonPosition;

    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  getVendorSdkPinSupport() {
    return 'full';
  }

  init() {
    const policy = resolveVendorSdkVersionPolicy(this.analytics.vendorSdkVersionPolicy);
    ScriptLoader(
      'iterable-web',
      policy === 'floating' ? VENDOR_SDK_FLOATING_URL : VENDOR_SDK_PINNED_URL,
      policy === 'floating' ? {} : { integrity: VENDOR_SDK_INTEGRITY, crossOrigin: 'anonymous' },
    );
  }

  isLoaded() {
    return !!window[iterableWebSdk];
  }

  isReady() {
    return this.isLoaded();
  }

  enqueueSdkCall(callback) {
    const request = this.sdkCallQueue.then(callback);
    this.sdkCallQueue = request.catch(error => {
      logger.error('Iterable SDK call failed', error);
    });
    return request;
  }

  identify(rudderElement) {
    const { message } = rudderElement;
    const { integrations, traits, context, userId } = message;
    const userEmail = traits?.email || context?.traits?.email;

    const jwtToken = extractJWT(integrations);

    if (!jwtToken) {
      logger.error('The JWT token was not passed, The SDK could not be initialized');
      return;
    }

    return this.enqueueSdkCall(async () => {
      // Reuse the SDK's interceptors and refresh callback with the current identity's JWT.
      this.jwtToken = jwtToken;
      if (!this.webSdk) {
        this.webSdk = window[iterableWebSdk].initialize(this.apiKey, () =>
          Promise.resolve(this.jwtToken),
        );
      }
      if (this.initialisationIdentifier === 'userId') {
        await this.webSdk.setUserID(userId);
        logger.info('userId set');
      } else {
        await this.webSdk.setEmail(userEmail);
        logger.info('userEmail set');
      }
      if (isNotEmpty(this.getInAppEventMapping)) {
        this.prepareInAppMessages();
      }
    });
  }

  prepareInAppMessages() {
    /* Available pop-up push notification settings configurable from UI
        this.animationDuration,
        this.displayInterval,
        this.onOpenScreenReaderMessage,
        this.onOpenNodeToTakeFocus,
        this.packageName,
        this.rightOffset,
        this.topOffset,
        this.bottomOffset,
        this.handleLinks,
        this.closeButtonColor,
        this.closeButtonSize,
        this.closeButtonColorTopOffset,
        this.closeButtonColorSideOffset,
        this.iconPath,
        this.isRequiredToDismissMessage,
        this.closeButtonPosition,
    */
    // Reference : https://github.com/iterable/iterable-web-sdk
    const getInAppMessagesPayload = removeUndefinedAndNullValues(prepareInAppMessagesPayload(this));

    const { request } = window[iterableWebSdk].getInAppMessages(getInAppMessagesPayload, {
      display: 'immediate',
    });
    // fetchAppEvents is a class function now available throughout
    // we will trigger getInAppMessages when event name matches from the ui mapping in config.
    this.fetchAppEvents = request;
  }

  track(rudderElement) {
    return this.enqueueSdkCall(() => this.trackEvent(rudderElement));
  }

  trackEvent(rudderElement) {
    const { message } = rudderElement;
    const { event, properties } = message;
    const eventPayload = removeUndefinedAndNullValues(properties);
    const userEmail = get(message, 'context.traits.email');
    const userId = get(message, 'userId');
    if (!event) {
      logger.error('Event name not present');
      return;
    }
    if (
      isNotEmpty(this.getInAppEventMapping) &&
      existsInMapping(this.getInAppEventMapping, event)
    ) {
      this.fetchAppEvents();
      // send a track call for getinappMessages if option enabled in config
      if (this.sendTrackForInapp) {
        return window[iterableWebSdk]
          .track({
            email: userEmail,
            userId,
            eventName: 'Track getInAppMessages',
            dataFields: eventPayload,
          })
          .then(() => logger.info('Web in-app push triggered'));
      }
    } else if (
      isNotEmpty(this.purchaseEventMapping) &&
      existsInMapping(this.purchaseEventMapping, event)
    ) {
      // purchase events
      const purchaseEventPayload = formPurchaseEventPayload(message);
      return window[iterableWebSdk].trackPurchase(purchaseEventPayload);
    } else {
      // custom events if event is not mapped
      /* fields available for custom track event
        {
            "email": "string",
            "userId": "string",
            "eventName": "string",
            "id": "string",
            "createdAt": 0,
            "dataFields": {},
            "campaignId": 0,
            "templateId": 0
        }
        */
      // Either email or userId must be passed in to identify the user.
      // If both are passed in, email takes precedence.
      return window[iterableWebSdk]
        .track({ email: userEmail, userId, eventName: event, dataFields: eventPayload })
        .then(() => logger.info('Track a custom event'));
    }
  }
}

export default Iterable;
