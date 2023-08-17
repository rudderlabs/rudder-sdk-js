/* eslint-disable class-methods-use-this */
import logger from '../../utils/logUtil';
import {
  getHashFromArrayWithDuplicate,
  removeUndefinedAndNullValues,
  getEventMappingFromConfig,
} from '../../utils/commonUtils';
import {
  shouldSendConversionEvent,
  shouldSendDynamicRemarketingEvent,
  getConversionData,
} from './utils';
import { NAME } from './constants';
import { loadNativeSdk } from './nativeSdkLoader';

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

    logger.debug('===in init Google Ads===');
  }

  isLoaded() {
    return window.dataLayer.push !== Array.prototype.push;
  }

  isReady() {
    return this.isLoaded();
  }

  identify() {
    logger.debug('[GoogleAds] identify:: method not supported');
  }

  // https://developers.google.com/gtagjs/reference/event
  track(rudderElement) {
    logger.debug('in GoogleAdsAnalyticsManager track');

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
      properties = removeUndefinedAndNullValues(properties);

      const eventLabel = this.enableConversionLabel ? 'conversion' : eventName;
      window.gtag('event', eventLabel, properties);
    }

    if (!event) {
      logger.error('Event name not present');
      return;
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

      const { properties } = rudderElement.message;
      const payload = properties || {};
      const sendToValue = this.conversionId;

      payload.send_to = sendToValue;
      const events = getEventMappingFromConfig(event, eventsHashmap);
      if (events) {
        events.forEach((ev) => {
          window.gtag('event', ev, payload);
        });
      } else {
        window.gtag('event', event, payload);
      }
    }
  }

  page(rudderElement) {
    logger.debug('in GoogleAdsAnalyticsManager page');

    const { name } = rudderElement.message;
    const conversionData = getConversionData(
      this.clickEventConversions,
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

    if (!name) {
      logger.error('Event name not present');
      return;
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
