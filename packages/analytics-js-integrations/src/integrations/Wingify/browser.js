/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
/* eslint-disable camelcase */
import { NAME, DISPLAY_NAME } from './constants';
import Logger from '../../utils/logger';
import { getDestinationOptions, sanitizeName, sanitizeAttributes } from './utils';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(DISPLAY_NAME);

class Wingify {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.accountId = config.accountId;
    this.settingsTolerance = config.settingsTolerance;
    this.isSPA = config.isSPA;
    this.libraryTolerance = config.libraryTolerance;
    this.useExistingJquery = config.useExistingJquery;
    this.sendExperimentTrack = config.sendExperimentTrack;
    this.sendExperimentIdentify = config.sendExperimentIdentify;
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    const wingifyIntgConfig = getDestinationOptions(this.analytics.loadOnlyIntegrations);
    if (wingifyIntgConfig?.loadIntegration) {
      const account_id = this.accountId;
      const settings_tolerance = this.settingsTolerance;
      loadNativeSdk(account_id, settings_tolerance);
    } else {
      logger.info('loadIntegration flag is disabled');
    }

    window.WINGIFY = window.WINGIFY || [];
    window.WINGIFY.event =
      window.WINGIFY.event ||
      function (...args) {
        window.WINGIFY.push(['event', ...args]);
      };

    window.WINGIFY.visitor =
      window.WINGIFY.visitor ||
      function (...args) {
        window.WINGIFY.push(['visitor', ...args]);
      };

    if (this.sendExperimentTrack || this.sendExperimentIdentify) {
      this.experimentViewed();
    }
  }

  isLoaded() {
    return !!window._wingify_code;
  }

  isReady() {
    return this.isLoaded();
  }

  experimentViewed() {
    window.WINGIFY = window.WINGIFY || [];
    window.WINGIFY.push([
      'onVariationApplied',
      data => {
        if (!data) {
          return;
        }
        const expId = data[1];
        const variationId = data[2];
        logger.info(
          'experiment id:',
          expId,
          'Variation Name:',
          _wingify_exp[expId].comb_n[variationId],
        );
        if (
          typeof _wingify_exp[expId].comb_n[variationId] !== 'undefined' &&
          ['VISUAL_AB', 'VISUAL', 'SPLIT_URL', 'SURVEY'].indexOf(_wingify_exp[expId].type) > -1
        ) {
          try {
            if (this.sendExperimentTrack) {
              this.analytics.track('Experiment Viewed', {
                experimentId: expId,
                variationName: _wingify_exp[expId].comb_n[variationId],
                CampaignName: _wingify_exp[expId].name,
                VariationId: variationId,
              });
            }
          } catch (error) {
            logger.error('experimentViewed', error);
          }
          try {
            if (this.sendExperimentIdentify) {
              this.analytics.identify({
                [`Experiment: ${expId}`]: _wingify_exp[expId].comb_n[variationId],
              });
            }
          } catch (error) {
            logger.error('experimentViewed', error);
          }
        }
      },
    ]);
  }

  identify(rudderElement) {
    const { message } = rudderElement;
    const { traits } = message.context || message;
    const payload = traits || {};
    const formattedAttributes = sanitizeAttributes(payload);

    window.WINGIFY.visitor(formattedAttributes, { source: 'rudderstack' });
  }

  track(rudderElement) {
    const eventName = rudderElement.message.event;
    if (!eventName) {
      logger.error('[WINGIFY] track:: event name is required');
      return;
    }
    const properties = rudderElement.message?.properties || {};
    window.WINGIFY = window.WINGIFY || [];
    if (eventName === 'Order Completed') {
      const total = rudderElement.message.properties
        ? rudderElement.message.properties.total || rudderElement.message.properties.revenue
        : 0;
      window.WINGIFY = window.WINGIFY || [];
      window.WINGIFY.push(['track.revenueConversion', total]);
    }
    const sanitizedEventName = sanitizeName(eventName);
    logger.debug(`[WINGIFY] eventName: ${sanitizedEventName}`);
    window.WINGIFY.event(sanitizedEventName, properties, { source: 'rudderstack', ogName: eventName });
  }
}

export default Wingify;
