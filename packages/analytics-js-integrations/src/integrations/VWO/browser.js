/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
/* eslint-disable camelcase */
import { logger } from '@rudderstack/analytics-js-common/v1.1/utils/logUtil';
import { NAME } from '@rudderstack/analytics-js-common/constants/integrations/VWO/constants';
import { getDestinationOptions, sanitizeName, sanitizeAttributes } from './utils';
import { loadNativeSdk } from './nativeSdkLoader';

class VWO {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.accountId = config.accountId; // 1549611
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
    logger.debug('Config ', config);
  }

  init() {
    logger.debug('===In init VWO===');
    const vwoIntgConfig = getDestinationOptions(this.analytics.loadOnlyIntegrations);
    if (vwoIntgConfig?.loadIntegration) {
      const account_id = this.accountId;
      const settings_tolerance = this.settingsTolerance;
      const library_tolerance = this.libraryTolerance;
      const use_existing_jquery = this.useExistingJquery;
      const { isSPA } = this;
      loadNativeSdk(account_id, settings_tolerance, library_tolerance, use_existing_jquery, isSPA);
    } else {
      logger.debug('===[VWO]loadIntegration flag is disabled===');
    }
    // Send track or iddentify when
    if (this.sendExperimentTrack || this.experimentViewedIdentify) {
      this.experimentViewed();
    }
  }

  experimentViewed() {
    window.VWO = window.VWO || [];
    const self = this;
    window.VWO.push([
      'onVariationApplied',
      data => {
        if (!data) {
          return;
        }
        logger.debug('Variation Applied');
        const expId = data[1];
        const variationId = data[2];
        logger.debug(
          'experiment id:',
          expId,
          'Variation Name:',
          _vwo_exp[expId].comb_n[variationId],
        );
        if (
          typeof _vwo_exp[expId].comb_n[variationId] !== 'undefined' &&
          ['VISUAL_AB', 'VISUAL', 'SPLIT_URL', 'SURVEY'].indexOf(_vwo_exp[expId].type) > -1
        ) {
          try {
            if (self.sendExperimentTrack) {
              logger.debug('Tracking...');
              this.analytics.track('Experiment Viewed', {
                experimentId: expId,
                variationName: _vwo_exp[expId].comb_n[variationId],
                CampaignName: _vwo_exp[expId].name,
                VariationId: variationId,
              });
            }
          } catch (error) {
            logger.error('[VWO] experimentViewed:: ', error);
          }
          try {
            if (self.sendExperimentIdentify) {
              logger.debug('Identifying...');
              this.analytics.identify({
                [`Experiment: ${expId}`]: _vwo_exp[expId].comb_n[variationId],
              });
            }
          } catch (error) {
            logger.error('[VWO] experimentViewed:: ', error);
          }
        }
      },
    ]);
  }

  identify(rudderElement) {
    logger.debug('===In VWO Identify===');
    const { message } = rudderElement;
    const { traits } = message.context || message;
    const payload = traits || {};
    const formattedAttributes = sanitizeAttributes(payload);

    window.VWO = window.VWO || [];
    window.VWO.visitor =
      window.VWO.visitor ||
      function () {
        window.VWO.push(['visitor'].concat([].slice.call(arguments)));
      };

    window.VWO.visitor(formattedAttributes, { source: 'rudderstack' });
  }

  track(rudderElement) {
    logger.debug('===In VWO track===');
    const eventName = rudderElement.message.event;
    const properties = (rudderElement.message && rudderElement.message.properties) || {};
    window.VWO = window.VWO || [];
    if (eventName === 'Order Completed') {
      const total = rudderElement.message.properties
        ? rudderElement.message.properties.total || rudderElement.message.properties.revenue
        : 0;
      logger.debug('Revenue', total);
      window.VWO.push(['track.revenueConversion', total]);
    }
    const sanitizedEventName = sanitizeName(eventName);
    logger.debug(`[VWO] eventName: ${sanitizedEventName}`);
    window.VWO.event =
      window.VWO.event ||
      function () {
        window.VWO.push(['event'].concat([].slice.call(arguments)));
      };
    window.VWO.event(sanitizedEventName, properties, { source: 'rudderstack', ogName: eventName });
  }

  page() {
    logger.debug('[VWO] page:: method not supported');
  }

  isLoaded() {
    logger.debug('===In isLoaded VWO===');
    return !!window._vwo_code;
  }

  isReady() {
    logger.debug('===In isReady VWO===');
    return !!window._vwo_code;
  }
}

export { VWO };
