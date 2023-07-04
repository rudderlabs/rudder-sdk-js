/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import get from 'get-value';
import logger from '@rudderstack/common/v1.1/utils/logUtil';
import ScriptLoader from '@rudderstack/common/v1.1/utils/ScriptLoader';
import { NAME, GTAG } from '@rudderstack/common/constants/integrations/DCMFloodlight/constants';
import { removeUndefinedAndNullValues } from '../../utils/commonUtils';
import {
  transformCustomVariable,
  flattenPayload,
  buildGtagTrackPayload,
  buildIframeTrackPayload,
  isValidCountingMethod,
} from './utils';

class DCMFloodlight {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.advertiserId = config.advertiserId;
    this.activityTag = config.activityTag;
    this.groupTag = config.groupTag;
    this.conversionEvents = config.conversionEvents;
    this.conversionLinker = config.conversionLinker;
    this.allowAdPersonalizationSignals = config.allowAdPersonalizationSignals;
    this.doubleclickId = config.doubleclickId;
    this.googleNetworkId = config.googleNetworkId;
    this.tagFormat = config.tagFormat || GTAG;
    this.name = NAME;
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  /**
   * Ref - https://support.google.com/campaignmanager/answer/7554821
   */
  init() {
    logger.debug('===In init DCMFloodlight===');

    if (this.tagFormat === GTAG) {
      const sourceUrl = `https://www.googletagmanager.com/gtag/js?id=DC-${this.advertiserId}`;
      ScriptLoader('DCMFloodlight-integration', sourceUrl);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };

      // disable ad personalization
      if (!this.allowAdPersonalizationSignals) {
        window.gtag('set', 'allow_ad_personalization_signals', false);
      }

      window.gtag('js', new Date());

      if (this.conversionLinker) {
        window.gtag('config', `DC-${this.advertiserId}`);
      } else {
        window.gtag('config', `DC-${this.advertiserId}`, {
          conversion_linker: false,
        });
      }
    }

    this.loadCookieMatching();
  }

  /**
   * Google's cookie matching functionality
   * Ref - https://developers.google.com/authorized-buyers/rtb/cookie-guide
   */
  loadCookieMatching() {
    logger.debug('===In loadCookieMatching DCMFloodlight===');
    if (this.doubleclickId && this.googleNetworkId) {
      const image = document.createElement('img');
      image.src = `https://cm.g.doubleclick.net/pixel?google_nid=${
        this.googleNetworkId
      }&google_hm=${btoa(this.analytics.getAnonymousId())}`;
      document.getElementsByTagName('head')[0].appendChild(image);
    }
  }

  isLoaded() {
    logger.debug('===In isLoaded DCMFloodlight===');
    if (this.tagFormat === GTAG) {
      return window.dataLayer.push !== Array.prototype.push;
    }
    return true;
  }

  isReady() {
    logger.debug('===In isReady DCMFloodlight===');
    if (this.tagFormat === GTAG) {
      return window.dataLayer.push !== Array.prototype.push;
    }
    return true;
  }

  identify() {
    logger.debug('[DCM Floodlight] identify:: method not supported');
  }

  track(rudderElement) {
    logger.debug('===In DCMFloodlight track===');

    const { message } = rudderElement;
    const { event } = rudderElement.message;
    let customFloodlightVariable;

    if (!event) {
      logger.error('[DCM Floodlight]:: event is required for track call');
      return;
    }

    // Specifies how conversions will be counted for a Floodlight activity
    let countingMethod = get(message, 'properties.countingMethod');
    if (!countingMethod) {
      logger.error('[DCM Floodlight]:: countingMethod is required for track call');
      return;
    }
    countingMethod = countingMethod.trim().toLowerCase().replace(/\s+/g, '_');

    // find conversion event
    // knowing cat (activityTag), type (groupTag), (counter or sales), customVariable from config
    const conversionEvent = this.conversionEvents.find(
      cnEvent =>
        cnEvent &&
        cnEvent.eventName &&
        cnEvent.eventName.trim().toLowerCase() === event.toLowerCase(),
    );

    if (!conversionEvent) {
      logger.error('[DCM Floodlight]:: Conversion event not found');
      return;
    }

    if (conversionEvent.floodlightActivityTag && conversionEvent.floodlightGroupTag) {
      this.activityTag = conversionEvent.floodlightActivityTag.trim();
      this.groupTag = conversionEvent.floodlightGroupTag.trim();
    }

    const { salesTag } = conversionEvent;

    if (!isValidCountingMethod(salesTag, countingMethod)) {
      logger.error(
        `[DCM Floodlight] ${salesTag ? 'Sales' : 'Counter'} Tag:: invalid counting method`,
      );
      return;
    }

    customFloodlightVariable = conversionEvent.customVariables || [];
    customFloodlightVariable = transformCustomVariable(customFloodlightVariable, message);

    customFloodlightVariable = removeUndefinedAndNullValues(customFloodlightVariable);

    if (this.tagFormat === GTAG) {
      this.trackWithGtag(message, salesTag, customFloodlightVariable, countingMethod);
    } else {
      this.trackWithIframe(message, salesTag, customFloodlightVariable, countingMethod);
    }
  }

  trackWithGtag(message, salesTag, customFloodlightVariable, countingMethod) {
    logger.debug('===In DCMFloodlight trackWithGtag===');

    let eventSnippetPayload = buildGtagTrackPayload(
      message,
      salesTag,
      countingMethod,
      this.analytics.loadOnlyIntegrations,
    );

    eventSnippetPayload = {
      allow_custom_scripts: true,
      ...eventSnippetPayload,
      ...customFloodlightVariable,
      send_to: `DC-${this.advertiserId}/${this.groupTag}/${this.activityTag}+${countingMethod}`,
    };

    eventSnippetPayload = removeUndefinedAndNullValues(eventSnippetPayload);
    logger.debug(`[DCM] eventSnippetPayload:: ${JSON.stringify(eventSnippetPayload)}`);

    // event snippet
    // Ref - https://support.google.com/campaignmanager/answer/7554821#zippy=%2Cfields-in-the-event-snippet---overview
    window.gtag('event', 'conversion', eventSnippetPayload);
  }

  trackWithIframe(message, salesTag, customFloodlightVariable, countingMethod) {
    logger.debug('===In DCMFloodlight trackWithIframe===');
    let eventSnippetPayload = buildIframeTrackPayload(
      message,
      salesTag,
      countingMethod,
      this.analytics.loadOnlyIntegrations,
    );

    eventSnippetPayload = {
      ...eventSnippetPayload,
      ...customFloodlightVariable,
    };
    eventSnippetPayload = removeUndefinedAndNullValues(eventSnippetPayload);
    eventSnippetPayload = flattenPayload(eventSnippetPayload);
    const src = `https://${this.advertiserId}.fls.doubleclick.net/activityi;src=${this.advertiserId};type=${this.groupTag};cat=${this.activityTag};${eventSnippetPayload}?`;
    this.addIframe(src);
  }

  addIframe(src) {
    logger.debug('===In DCMFloodlight addIframe===');
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.style.display = 'none';
    iframe.style.border = 0;
    document.getElementsByTagName('body')[0].appendChild(iframe);
  }

  page(rudderElement) {
    logger.debug('===In DCMFloodlight page===');
    const { category } = rudderElement.message.properties;
    const { name } = rudderElement.message || rudderElement.message.properties;

    if (!category && !name) {
      logger.error('[DCM Floodlight]:: category or name is required for page');
      return;
    }

    const categoryVal = category ? `${category} ` : '';
    const nameVal = name ? `${name} ` : '';
    rudderElement.message.event = `Viewed ${categoryVal}${nameVal}Page`;

    rudderElement.message.type = 'track';
    this.track(rudderElement);
  }
}

export default DCMFloodlight;
