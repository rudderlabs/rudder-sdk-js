/* eslint-disable class-methods-use-this */
import get from 'get-value';
import Logger from '../../utils/logger';
import { formPurchaseEventPayload, existsInMapping } from './utils';

import {
  isDefinedAndNotNull,
  removeUndefinedAndNullValues,
  isNotEmpty,
} from '../../utils/commonUtils';
import { NAME } from './constants';
import ScriptLoader from '../../utils/ScriptLoader';

const logger = new Logger(NAME);

class Iterable {
  constructor(config, analytics, destinationInfo) {
    this.apiKey = config.apiKey;
    this.initialisationIdentifier = config.initialisationIdentifier;
    this.fetchAppEvents = undefined;
    this.name = NAME;
    this.analytics = analytics;
    if (analytics.logLevel) logger.setLogLevel(analytics.logLevel);
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

    this.areTransformationsConnected = destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo.destinationId;
  }

  init() {
    logger.debug('===In init Iterable===');
    ScriptLoader('iterable-web', 'https://unpkg.com/@iterable/web-sdk/index.js');
  }

  isLoaded() {
    logger.debug('===In isLoaded Iterable===');
    return !!window['@iterable/web-sdk'];
  }

  isReady() {
    logger.debug('===In isReady Iterable===');
    return !!window['@iterable/web-sdk'];
  }

  identify(rudderElement) {
    logger.debug('===In identify Iterable');

    const { message } = rudderElement;
    const { integrations } = message;
    const userEmail = message.traits?.email || message.context?.traits?.email;
    const userId = message.userId;

    async function extractJWT(message) {
      if (integrations && integrations.ITERABLE) {
        const { jwt_token } = integrations.ITERABLE;
        if (isDefinedAndNotNull(jwt_token)) return jwt_token;
      } else {
        logger.error('The JWT token was not passed, The SDK could not be initialised.');
        return;
      }
    }

    // Initialize the iterable SDK with the proper apiKey and the passed JWT
    let wd = window['@iterable/web-sdk'].initialize(this.apiKey, extractJWT);
    switch (this.initialisationIdentifier) {
      case 'email':
        wd.setEmail(userEmail).then(() => {
          logger.debug('userEmail set');
        });
        break;
      case 'userId':
        wd.setUserID(userId).then(() => {
          logger.debug('userId set');
        });
        break;
      default:
        wd.setEmail(userEmail).then(() => {
          logger.debug('userEmail set');
        });
        break;
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
    let getInAppMessagesPayload = {
      count: 20,
      animationDuration: Number(this.animationDuration) || 400,
      displayInterval: Number(this.displayInterval) || 30000,
      onOpenScreenReaderMessage: this.onOpenScreenReaderMessage || undefined,
      onOpenNodeToTakeFocus: this.onOpenNodeToTakeFocus || undefined,
      packageName: this.packageName || undefined,
      rightOffset: this.rightOffset || undefined,
      topOffset: this.topOffset || undefined,
      bottomOffset: this.bottomOffset || undefined,
      handleLinks: this.handleLinks || undefined,
      closeButton: {
        color: this.closeButtonColor || 'red',
        size: this.closeButtonSize || '16px',
        topOffset: this.closeButtonColorTopOffset || '4%',
        sideOffset: this.closeButtonColorSideOffset || '4%',
        iconPath: this.iconPath || undefined,
        isRequiredToDismissMessage: this.isRequiredToDismissMessage || undefined,
        position: this.closeButtonPosition || 'top-right',
      },
    };
    getInAppMessagesPayload = removeUndefinedAndNullValues(getInAppMessagesPayload);

    const { request } = window['@iterable/web-sdk'].getInAppMessages(getInAppMessagesPayload, {
      display: 'immediate',
    });
    // fetchAppEvents is a class function now available throughout
    // we will trigger getInAppMessages when event name matches from the ui mapping in config.
    this.fetchAppEvents = request;
  }

  track(rudderElement) {
    logger.debug('===In track Iterable===');

    const { message } = rudderElement;
    const { event } = message;
    const eventPayload = removeUndefinedAndNullValues(message.properties);
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
        window['@iterable/web-sdk']
          .track({
            email: userEmail,
            userId,
            eventName: 'Track getInAppMessages',
            dataFields: eventPayload,
          })
          .then(logger.debug('Web in-app push triggered'));
      }
    } else if (
      isNotEmpty(this.purchaseEventMapping) &&
      existsInMapping(this.purchaseEventMapping, event)
    ) {
      // purchase events
      const purchaseEventPayload = formPurchaseEventPayload(message);
      window['@iterable/web-sdk'].trackPurchase(purchaseEventPayload);
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
      logger.debug(`The event ${event} is not mapped in the dashboard, firing a custom event`);
      window['@iterable/web-sdk']
        .track({ email: userEmail, userId, eventName: event, dataFields: eventPayload })
        .then(logger.debug('Track a custom event.'));
    }
  }
}

export default Iterable;
