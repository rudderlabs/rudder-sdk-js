/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import logger from '../../utils/logUtil';
import ScriptLoader from '../../utils/ScriptLoader';
import { NAME } from './constants';

class QuantumMetric {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.siteId = config.siteID; // 1549611
    this.name = NAME;
    this._ready = false;
    this.shouldApplyDeviceModeTransformation =
      destinationInfo && destinationInfo.shouldApplyDeviceModeTransformation;
    this.propagateEventsUntransformedOnError =
      destinationInfo && destinationInfo.propagateEventsUntransformedOnError;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  init() {
    if (window.QuantumMetricAPI) {
      return;
    }

    ScriptLoader(
      'Quantum Metric',
      `https://cdn.quantummetric.com/qscripts/quantum-${this.siteId}.js`,
    );
    if (window.QuantumMetricAPI) {
      this._ready = true;
    }

    logger.debug('===in init Quantum Metric===');
  }

  identify() {
    logger.debug('[QuantumMetric] track:: method not supported');
  }

  track() {
    logger.debug('[QuantumMetric] track:: method not supported');
  }

  page() {
    logger.debug('[QuantumMetric] page:: method not supported');
  }

  isLoaded() {
    if (!this._ready && window.QuantumMetricAPI) {
      this._ready = true;
    }
    return this._ready;
  }

  isReady() {
    return this.isLoaded();
  }
}

export default QuantumMetric;
