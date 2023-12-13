/* eslint-disable class-methods-use-this */
import get from 'get-value';
import { ScriptLoader } from '@rudderstack/analytics-js-common/v1.1/utils/ScriptLoader';
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/Iterable/constants';
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
    this.name = NAME;
    this.analytics = analytics;
    this.getInAppEventMapping = config.getInAppEventMapping;
    this.purchaseEventMapping = config.purchaseEventMapping;

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

  init() {
    ScriptLoader('iterable-web', 'https://unpkg.com/@iterable/web-sdk/index.js');
  }

  isLoaded() {
    return !!window[iterableWebSdk];
  }

  isReady() {
    return this.isLoaded();
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

    // Initialize the iterable SDK with the proper apiKey and the passed JWT
    const wd = window[iterableWebSdk].initialize(this.apiKey, extractJWT);

    if (this.initialisationIdentifier === 'userId') {
      wd.setUserID(userId).then(() => {
        logger.info('userId set');
      });
    } else {
      wd.setEmail(userEmail).then(() => {
        logger.info('userEmail set');
      });
    }
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
        window[iterableWebSdk]
          .track({
            email: userEmail,
            userId,
            eventName: 'Track getInAppMessages',
            dataFields: eventPayload,
          })
          .then(logger.info('Web in-app push triggered'));
      }
    } else if (
      isNotEmpty(this.purchaseEventMapping) &&
      existsInMapping(this.purchaseEventMapping, event)
    ) {
      // purchase events
      const purchaseEventPayload = formPurchaseEventPayload(message);
      window[iterableWebSdk].trackPurchase(purchaseEventPayload);
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
      window[iterableWebSdk]
        .track({ email: userEmail, userId, eventName: event, dataFields: eventPayload })
        .then(logger.info('Track a custom event'));
    }
  }
}

export default Iterable;
