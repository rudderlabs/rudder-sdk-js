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

    window.Wingify = window.Wingify || [];
    window.Wingify.event =
      window.Wingify.event ||
      function (...args) {
        window.Wingify.push(['event', ...args]);
      };

    window.Wingify.visitor =
      window.Wingify.visitor ||
      function (...args) {
        window.Wingify.push(['visitor', ...args]);
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
    window.Wingify = window.Wingify || [];
    window.Wingify.push([
      'onVariationApplied',
      data => {
        if (!data) {
          return;
        }
        const expId = data[1];
        const variationId = data[2];
        const experiment = window.Wingify?.campaigns?.[expId];
        const variationName = experiment?.comb_n?.[variationId];

        if (
          typeof variationName === 'undefined' ||
          ['VISUAL_AB', 'VISUAL', 'SPLIT_URL', 'SURVEY'].indexOf(experiment?.type) === -1
        ) {
          return;
        }

        logger.info('experiment id:', expId, 'Variation Name:', variationName);
        try {
          if (this.sendExperimentTrack) {
            this.analytics.track('Experiment Viewed', {
              experimentId: expId,
              variationName,
              CampaignName: experiment.name,
              VariationId: variationId,
            });
          }
        } catch (error) {
          logger.error('experimentViewed', error);
        }
        try {
          if (this.sendExperimentIdentify) {
            this.analytics.identify({
              [`Experiment: ${expId}`]: variationName,
            });
          }
        } catch (error) {
          logger.error('experimentViewed', error);
        }
      },
    ]);
  }

  identify(rudderElement) {
    const { message } = rudderElement;
    const payload = message.context?.traits ?? message.traits ?? {};
    const formattedAttributes = sanitizeAttributes(payload);

    window.Wingify.visitor(formattedAttributes, { source: 'rudderstack' });
  }

  track(rudderElement) {
    const eventName = rudderElement.message.event?.trim();
    if (!eventName) {
      logger.error('[WINGIFY] track:: event name is required');
      return;
    }
    const properties = rudderElement.message?.properties || {};
    window.Wingify = window.Wingify || [];
    if (eventName === 'Order Completed') {
      const total = rudderElement.message.properties
        ? rudderElement.message.properties.total || rudderElement.message.properties.revenue
        : 0;
      window.Wingify.push(['track.revenueConversion', total]);
    }
    const sanitizedEventName = sanitizeName(eventName);
    logger.debug(`[WINGIFY] eventName: ${sanitizedEventName}`);
    window.Wingify.event(sanitizedEventName, properties, {
      source: 'rudderstack',
      ogName: eventName,
    });
  }
}

export default Wingify;
