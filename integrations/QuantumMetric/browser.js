/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";

class QuantumMetric {
  constructor(config) {
    this.siteId = "rudderstack"; // 1549611
    this.name = "QUANTUMMETRIC";
    this._ready = false;
  }

  init() {
    if (window.QuantumMetricAPI) {
      return;
    }

    ScriptLoader(
      "Quantum Metric",
      `https://cdn.quantummetric.com/qscripts/quantum-${this.siteId}.js`
    );
    if (window.QuantumMetricAPI) {
      this._ready = true;
    }

    logger.debug("===in init Quantum Metric===");
  }

  identify() {
    logger.debug("[QuantumMetric] track:: method not supported");
  }

  track() {
    logger.debug("[QuantumMetric] track:: method not supported");
  }

  page() {
    logger.debug("[QuantumMetric] page:: method not supported");
  }

  isLoaded() {
    return this._ready;
  }

  isReady() {
    return this._ready;
  }
}

export default QuantumMetric;
