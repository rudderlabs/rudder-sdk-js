/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
/* eslint-disable camelcase */
import logger from '../../utils/logUtil';
import { NAME } from './constants';
import { loader } from './loader';

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
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
    logger.debug('Config ', config);
  }

  init() {
    logger.debug('===In init VWO===');
    if (this.analytics.loadOnlyIntegrations?.VWO?.loadIntegration) {
      const account_id = this.accountId;
      const settings_tolerance = this.settingsTolerance;
      const library_tolerance = this.libraryTolerance;
      const use_existing_jquery = this.useExistingJquery;
      const { isSPA } = this;
      window._vwo_code = loader(
        account_id,
        settings_tolerance,
        library_tolerance,
        use_existing_jquery,
        isSPA,
      );
      window._vwo_settings_timer = window._vwo_code.init();
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
      (data) => {
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
