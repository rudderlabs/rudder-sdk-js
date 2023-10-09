/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
/* eslint-disable camelcase */
import { NAME, DISPLAY_NAME } from '@rudderstack/analytics-js-common/constants/integrations/VWO/constants';
import Logger from '../../utils/logger';
import { getDestinationOptions } from './utils';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(NAME);

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
    logger.debug(`${DISPLAY_NAME} : Config`, config);
  }

  init() {
    const vwoIntgConfig = getDestinationOptions(this.analytics.loadOnlyIntegrations);
    if (vwoIntgConfig?.loadIntegration) {
      const account_id = this.accountId;
      const settings_tolerance = this.settingsTolerance;
      const library_tolerance = this.libraryTolerance;
      const use_existing_jquery = this.useExistingJquery;
      const { isSPA } = this;
      loadNativeSdk(account_id, settings_tolerance, library_tolerance, use_existing_jquery, isSPA);
    } else {
      logger.debug(`${DISPLAY_NAME} : loadIntegration flag is disabled`);
    }
    // Send track or iddentify when
    if (this.sendExperimentTrack || this.experimentViewedIdentify) {
      this.experimentViewed();
    }
  }

  experimentViewed() {
    window.VWO = window.VWO || [];
    window.VWO.push([
      'onVariationApplied',
      data => {
        if (!data) {
          return;
        }
        logger.debug(`${DISPLAY_NAME} : Variation Applied`);
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
            if (this.sendExperimentTrack) {
              logger.debug(`${DISPLAY_NAME} : Tracking...`);
              this.analytics.track('Experiment Viewed', {
                experimentId: expId,
                variationName: _vwo_exp[expId].comb_n[variationId],
                CampaignName: _vwo_exp[expId].name,
                VariationId: variationId,
              });
            }
          } catch (error) {
            logger.error(`${DISPLAY_NAME} : experimentViewed`, error);
          }
          try {
            if (this.sendExperimentIdentify) {
              logger.debug(`${DISPLAY_NAME} : Identifying...`);
              this.analytics.identify({
                [`Experiment: ${expId}`]: _vwo_exp[expId].comb_n[variationId],
              });
            }
          } catch (error) {
            logger.error(`${DISPLAY_NAME} : experimentViewed`, error);
          }
        }
      },
    ]);
  }

  identify() {
    logger.debug('[VWO] identify:: method not supported');
  }

  track(rudderElement) {
    logger.debug('===In VWO track===');
    const eventName = rudderElement.message.event;
    if (eventName === 'Order Completed') {
      const total = rudderElement.message.properties
        ? rudderElement.message.properties.total || rudderElement.message.properties.revenue
        : 0;
      logger.debug('Revenue', total);
      window.VWO = window.VWO || [];
      window.VWO.push(['track.revenueConversion', total]);
    }
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
