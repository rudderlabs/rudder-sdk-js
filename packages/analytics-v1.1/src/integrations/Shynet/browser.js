import logger from '../../utils/logUtil';
import { NAME } from './constants';
import { generateUUID } from '../../utils/utils';

class Shynet {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    const { heartBeatFrequencyInMs } = config;
    const { shynetServiceUrl } = config;
    this.scriptCheck = false;
    this.name = NAME;
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;

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
            loadTime:
              window.performance.timing.domContentLoadedEventEnd -
              window.performance.timing.navigationStart,
          });
          xhr.send(payloadBody);
        } catch (exp) {
          logger.info(`Error Sending ${NAME} Event`, exp.message);
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
          parseInt(heartBeatFrequencyInMs || 5000),
        );
        this.sendHeartBeat(referrer, url);
      },
    };
    this.scriptCheck = true;
  }

  init() {
    logger.debug('=== in init Shynet ===');
    return this.scriptCheck;
  }

  isLoaded() {
    logger.debug('=== in Shynet isLoaded= ==');
    return this.scriptCheck;
  }

  isReady() {
    logger.debug('=== in Shynet is Ready===');
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
