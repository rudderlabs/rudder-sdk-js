/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
/* eslint-disable camelcase */
import logger from '../../utils/logUtil';
import { LOAD_ORIGIN } from '../../utils/ScriptLoader';
import { NAME } from './constants';

class VWO {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.accountId = config.accountId; // 1549611
    this.settingsTolerance = config.settingsTolerance;
    this.isSPA = config.isSPA;
    this.libraryTolerance = config.libraryTolerance;
    this.useExistingJquery = config.useExistingJquery;
    this.sendExperimentTrack = config.sendExperimentTrack;
    this.sendExperimentIdentify = config.sendExperimentIdentify;
    this.name = NAME;
    this.analytics = analytics;
    this.areTransformationsConnected = destinationInfo && destinationInfo.areTransformationsConnected;
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
      window._vwo_code = (function () {
        let f = false;
        const d = document;
        return {
          use_existing_jquery() {
            return use_existing_jquery;
          },
          library_tolerance() {
            return library_tolerance;
          },
          finish() {
            if (!f) {
              f = true;
              const a = d.getElementById('_vis_opt_path_hides');
              if (a) a.parentNode.removeChild(a);
            }
          },
          finished() {
            return f;
          },
          load(a) {
            const b = d.createElement('script');
            b.src = a;
            b.type = 'text/javascript';
            b.setAttribute('data-loader', LOAD_ORIGIN);
            b.innerText;
            b.onerror = function () {
              _vwo_code.finish();
            };
            d.getElementsByTagName('head')[0].appendChild(b);
          },
          init() {
            const settings_timer = setTimeout('_vwo_code.finish()', settings_tolerance);
            const a = d.createElement('style');
            const b =
              'body{opacity:0 !important;filter:alpha(opacity=0) !important;background:none !important;}';
            const h = d.getElementsByTagName('head')[0];
            a.setAttribute('id', '_vis_opt_path_hides');
            a.setAttribute('type', 'text/css');
            if (a.styleSheet) a.styleSheet.cssText = b;
            else a.appendChild(d.createTextNode(b));
            h.appendChild(a);
            this.load(
              `//dev.visualwebsiteoptimizer.com/j.php?a=${account_id}&u=${encodeURIComponent(
                d.URL,
              )}&r=${Math.random()}&f=${+isSPA}`,
            );
            return settings_timer;
          },
        };
      })();
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
