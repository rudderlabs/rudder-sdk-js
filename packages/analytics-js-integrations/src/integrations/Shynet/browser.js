/* eslint-disable func-names */
/* eslint-disable compat/compat */
import { NAME, DISPLAY_NAME } from '@rudderstack/analytics-js-common/constants/integrations/Shynet/constants';
import Logger from '../../utils/logger';
import { generateUUID } from '../../utils/utils';

const logger = new Logger(NAME);

class Shynet {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    const { heartBeatFrequencyInMs } = config;
    const { shynetServiceUrl } = config;
    this.scriptCheck = false;
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});

    this.shynetScript = {
      idempotency: null,
      heartBeatTaskId: null,
      skipHeartBeat: false,
      sendHeartBeat(referrerName, url) {
        try {
          if (this.skipHeartbeat) {
            return;
          }

          this.skipHeartbeat = true;
          const xhr = new XMLHttpRequest();
          xhr.open('POST', `${shynetServiceUrl}`, true);
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.onload = function () {
            this.skipHeartBeat = false;
          };
          xhr.onerror = function () {
            this.skipHeartBeat = false;
          };
          const payloadBody = JSON.stringify({
            idempotency: this.idempotency,
            referrer: referrerName,
            location: url,
            loadTime: window.performance.now(),
          });
          xhr.send(payloadBody);
        } catch (exp) {
          logger.info(`${DISPLAY_NAME} : Error Sending ${NAME} Event`, exp.message);
        }
      },
      newPageLoad(referrer, url) {
        if (this.heartBeatTaskId != null) {
          clearInterval(this.heartBeatTaskId);
        }
        this.idempotency = generateUUID();
        this.skipHeartbeat = false;
        // taking default as 5 sec as used in shynet doc
        this.heartBeatTaskId = setInterval(
          this.sendHeartBeat,
          parseInt(heartBeatFrequencyInMs || 5000, 10),
        );
        this.sendHeartBeat(referrer, url);
      },
    };
    this.scriptCheck = true;
  }

  init() {
    return this.scriptCheck;
  }

  isLoaded() {
    logger.debug(`In isLoaded ${DISPLAY_NAME}`);
    return this.scriptCheck;
  }

  isReady() {
    logger.debug(`In isReady ${DISPLAY_NAME}`);
    return this.scriptCheck;
  }

  page(rudderElement) {
    try {
      this.shynetScript.newPageLoad(
        rudderElement?.message?.properties?.referrer,
        rudderElement?.message?.properties?.url,
      );
    } catch (exp) {
      logger.info(exp.message);
    }
  }
}
export default Shynet;
