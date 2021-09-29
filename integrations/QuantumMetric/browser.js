import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";

class QuantumMetric {
  constructor(config) {
    this.siteId = config.siteID; // 1549611
    this.name = "QUANTUMMETRIC";
    this._ready = false;
  }

  init() {
    if (window.QuantumMetricAPI) {
      return
    }

    ScriptLoader(
      'Quantum Metric',
      `https://cdn.quantummetric.com/qscripts/quantum-${this.siteId}.js`
    )

    this._ready = true;

    logger.debug("===in init Quantum Metric===");
  }

  identify(rudderElement) {
    logger.debug("[QuantumMetric] track:: method not supported");
  }

  track(rudderElement) {
    logger.debug("[QuantumMetric] track:: method not supported");
  }

  page(rudderElement) {
    logger.debug("[QuantumMetric] page:: method not supported");
  }

  isLoaded() {
    return this._ready;
  }

  isReady() {
    return this._ready;
  }
}

export { QuantumMetric };
