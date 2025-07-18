/* eslint-disable eqeqeq */
/* eslint-disable class-methods-use-this */
import { NAME, DISPLAY_NAME } from './constants';
import Logger from '../../utils/logger';
import {
  getHashFromArrayWithDuplicate,
  removeUndefinedAndNullValues,
  getEventMappingFromConfig,
  isDefinedAndNotNullAndNotEmpty,
} from '../../utils/commonUtils';
import {
  shouldSendConversionEvent,
  shouldSendDynamicRemarketingEvent,
  getConversionData,
  newCustomerAcquisitionReporting,
  generateUserDataPayload,
} from './utils';
import { loadNativeSdk } from './nativeSdkLoader';

import { prepareParamsAndEventName } from '../GA4/utils';

const logger = new Logger(DISPLAY_NAME);

class GoogleAds {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.conversionId = config.conversionID;
    this.pageLoadConversions = config.pageLoadConversions;
    this.clickEventConversions = config.clickEventConversions;
    this.defaultPageConversion = config.defaultPageConversion;
    this.sendPageView = config.sendPageView || true;
    this.conversionLinker = config.conversionLinker || true;
    this.disableAdPersonalization = config.disableAdPersonalization || false;
    this.trackConversions = config.trackConversions;
    this.trackDynamicRemarketing = config.trackDynamicRemarketing;
    this.enableConversionEventsFiltering = config.enableConversionEventsFiltering || false;
    this.enableDynamicRemarketingEventsFiltering =
      config.enableDynamicRemarketingEventsFiltering || false;
    this.eventsToTrackConversions = config.eventsToTrackConversions || [];
    this.eventsToTrackDynamicRemarketing = config.eventsToTrackDynamicRemarketing || [];
    this.eventMappingFromConfig = config.eventMappingFromConfig;
    this.enableConversionLabel = config.enableConversionLabel || false;
    // Depreciating: Added to make changes backward compatible
    this.dynamicRemarketing = config.dynamicRemarketing;
    this.allowEnhancedConversions = config.allowEnhancedConversions || false;
    this.v2 = config.v2 || true;
    this.allowIdentify = config.allowIdentify ?? false;
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    const sourceUrl = `https://www.googletagmanager.com/gtag/js?id=${this.conversionId}`;
    loadNativeSdk(sourceUrl);

    // Additional Settings

    const config = {
      send_page_view: this.sendPageView,
      conversion_linker: this.conversionLinker,
    };

    // ref:- https://support.google.com/google-ads/answer/12785474?hl=en-GB#Config&zippy=%2Cconfigure-your-conversion-page-google-tag
    if (this.allowEnhancedConversions) {
      config.allow_enhanced_conversions = this.allowEnhancedConversions;
    }

    if (this.disableAdPersonalization) {
      window.gtag('set', 'allow_ad_personalization_signals', false);
    }

    window.gtag('config', this.conversionId, config);
  }

  isLoaded() {
    return !!(window.dataLayer && window.dataLayer.push !== Array.prototype.push);
  }

  isReady() {
    return this.isLoaded();
  }

  identify(rudderElement) {
    if (this.allowIdentify === false) {
      logger.info(
        'Please enable identify call toggle in your destination settings to send user data to Google Ads.',
      );
      return;
    }
    const { context } = rudderElement.message;
    const { traits } = context;
    if (!isDefinedAndNotNullAndNotEmpty(traits)) {
      logger.error('Traits are mandatory for identify call');
      return;
    }
    if (
      !traits.email ||
      !traits.phone ||
      (!traits.firstName && !traits.lastName && !traits.postalCode && !traits.country)
    ) {
      logger.error(
        'Email, Phone are mandatory fields and either of FirstName, LastName, PostalCode, Country is mandatory for identify call',
      );
      return;
    }
    const payload = generateUserDataPayload(traits);
    window.gtag('set', 'user_data', payload);
  }

  // https://developers.google.com/gtagjs/reference/event
  track(rudderElement) {
    const { event } = rudderElement.message;
    const conversionData = getConversionData(
      this.clickEventConversions,
      event,
      this.defaultPageConversion,
    );
    if (
      conversionData.conversionLabel &&
      shouldSendConversionEvent(
        event,
        this.trackConversions,
        this.enableConversionEventsFiltering,
        this.eventsToTrackConversions,
        this.dynamicRemarketing,
      )
    ) {
      const { conversionLabel } = conversionData;
      const { eventName } = conversionData;
      const sendToValue = `${this.conversionId}/${conversionLabel}`;

      let properties = {
        value: rudderElement.message?.properties?.revenue,
        currency: rudderElement.message?.properties?.currency,
        transaction_id: rudderElement.message?.properties?.order_id,
        send_to: sendToValue,
      };
      if (this.v2) {
        const updatedEventName = eventName.trim().replace(/\s+/g, '_');
        const ecomPayload = prepareParamsAndEventName(rudderElement.message, updatedEventName);
        properties = { ...properties, ...ecomPayload?.params };
      }
      properties = removeUndefinedAndNullValues(properties);
      properties = newCustomerAcquisitionReporting(properties);

      const eventLabel = this.enableConversionLabel ? 'conversion' : eventName;
      window.gtag('event', eventLabel, properties);
    }

    if (
      shouldSendDynamicRemarketingEvent(
        event,
        this.trackDynamicRemarketing,
        this.enableDynamicRemarketingEventsFiltering,
        this.eventsToTrackDynamicRemarketing,
        this.dynamicRemarketing,
      )
    ) {
      // modify the event name to mapped event name from the config
      const eventsHashmap = getHashFromArrayWithDuplicate(
        this.eventMappingFromConfig,
        'from',
        'to',
        false,
      );

      let { properties } = rudderElement.message;
      const { event } = rudderElement.message;

      if (this.v2) {
        const updatedEventName = event.toString().trim().replace(/\s+/g, '_');
        const ecomPayload = prepareParamsAndEventName(rudderElement.message, updatedEventName);
        properties = { ...properties, ...ecomPayload?.params };
      }

      // set new customer acquisition reporting
      // docs: https://support.google.com/google-ads/answer/12077475?hl=en#zippy=%2Cinstall-with-the-global-site-tag%2Cinstall-with-google-tag-manager
      properties = newCustomerAcquisitionReporting(properties);
      const payload = properties || {};
      const sendToValue = this.conversionId;

      payload.send_to = sendToValue;
      const events = getEventMappingFromConfig(event, eventsHashmap);
      if (events) {
        events.forEach(ev => {
          window.gtag('event', ev, payload);
        });
      } else {
        window.gtag('event', event, payload);
      }
    }
  }

  page(rudderElement) {
    const { name } = rudderElement.message;
    const conversionData = getConversionData(
      this.pageLoadConversions,
      name,
      this.defaultPageConversion,
    );
    if (
      conversionData.conversionLabel &&
      shouldSendConversionEvent(
        name,
        this.trackConversions,
        this.enableConversionEventsFiltering,
        this.eventsToTrackConversions,
        this.dynamicRemarketing,
      )
    ) {
      const { conversionLabel } = conversionData;
      const { eventName } = conversionData;

      const eventLabel = this.enableConversionLabel ? 'conversion' : eventName;
      window.gtag('event', eventLabel, {
        send_to: `${this.conversionId}/${conversionLabel}`,
      });
    }

    if (
      shouldSendDynamicRemarketingEvent(
        name,
        this.trackDynamicRemarketing,
        this.enableDynamicRemarketingEventsFiltering,
        this.eventsToTrackDynamicRemarketing,
        this.dynamicRemarketing,
      )
    ) {
      const event = name;
      const { properties } = rudderElement.message;
      const sendToValue = this.conversionId;
      const payload = properties || {};
      payload.send_to = sendToValue;
      window.gtag('event', event, payload);
    }
  }
}

export default GoogleAds;
