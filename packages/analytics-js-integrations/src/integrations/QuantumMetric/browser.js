/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import { ScriptLoader } from '@rudderstack/analytics-js-legacy-utilities/ScriptLoader';
import { NAME, DISPLAY_NAME } from './constants';
import Logger from '../../utils/logger';

const logger = new Logger(DISPLAY_NAME);

class QuantumMetric {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.siteId = config.siteID; // 1549611
    this.name = NAME;
    this._ready = false;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
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
