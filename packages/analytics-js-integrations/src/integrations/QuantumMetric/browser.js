/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import { ScriptLoader } from '@rudderstack/analytics-js-common/v1.1/utils/ScriptLoader';
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/QuantumMetric/constants';
import Logger from '../../utils/logger';

const logger = new Logger(NAME);

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
    logger.debug(`In isLoaded ${DISPLAY_NAME}`);
    if (!this._ready && window.QuantumMetricAPI) {
      this._ready = true;
    }
    return this._ready;
  }

  isReady() {
    logger.debug(`In isReady ${DISPLAY_NAME}`);
    return this.isLoaded();
  }
}

export default QuantumMetric;
