/* eslint-disable compat/compat */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable consistent-return */
import { removeTrailingSlashes } from '../../../utils/utils';
import { createPayload } from './util';
import { handleError } from '../../../utils/errorHandler';
import { stringifyWithoutCircular } from '../../../utils/ObjectUtils';

const timeout = 10 * 1000;
const EVENT_CHECK_INTERVAL = 100;
const RETRY_INTERVAL = 500;
const backoffFactor = 2;

class TransformationsHandler {
  constructor() {
    this.retryAttempt = 3; // default value for retry
    this.queue = [];
    this.isTransformationProcessing = false;
    this.authToken = null;
  }

  init(writeKey, dataPlaneUrl, authToken) {
    this.dataPlaneUrl = removeTrailingSlashes(dataPlaneUrl);
    this.writeKey = writeKey;
    this.authToken = authToken || this.authToken;
    this.start();
  }

  // Enqueue the events and callbacks
  enqueue(event, cb) {
    this.queue.push({
      event,
      cb,
    });
  }

  /**
   * A helper function that will take one payload at a time and send it to transformation server
   * and return the response
   *
   */
  sendEventForTransformation(payload, retryAttempt) {
    return new Promise((resolve, reject) => {
      const url = `${this.dataPlaneUrl}/transform`;
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${this.writeKey}:`)}`,
      };

      try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        Object.keys(headers).forEach((k) => xhr.setRequestHeader(k, headers[k]));
        xhr.timeout = timeout;

        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            try {
              const { status } = xhr;
              let { response } = xhr;

              switch (status) {
                case 200: {
                  if (response && typeof response === 'string') {
                    response = JSON.parse(response);
                  }
                  /**
                   * Sample Response format:
                   * {
                      "transformedBatch" :[
                        {
                          "id": "destination-id",
                          "payload": [
                            {
                              "orderNo":1,
                              "status": "200",
                              "event": {
                                "message": { ...}
                            }]
                        }]
                      } 
                  */
                  resolve({
                    status,
                    transformedPayload: response.transformedBatch,
                    transformationServerAccess: true,
                  });
                  return;
                }
                case 400: {
                  const errorMessage = response
                    ? `[Transformation]:: ${response}`
                    : `[Transformation]:: Invalid request payload`;
                  resolve({
                    status,
                    transformationServerAccess: true,
                    errorMessage,
                  });
                  return;
                }
                case 404: {
                  resolve({
                    status,
                    transformationServerAccess: false,
                  });
                  return;
                }
                default: {
                  // If the request is not successful
                  // retry till the retryAttempt is exhausted
                  if (retryAttempt > 0) {
                    const newRetryAttempt = retryAttempt - 1;
                    setTimeout(
                      () =>
                        this.sendEventForTransformation(payload, newRetryAttempt)
                          .then(resolve)
                          .catch(reject),
                      RETRY_INTERVAL * backoffFactor ** (this.retryAttempt - newRetryAttempt),
                    );
                  } else {
                    // Even after all the retries event transformation
                    // is not successful, return the response with a flag retryExhausted
                    resolve({
                      status,
                      transformationServerAccess: true,
                      retryExhausted: true,
                    });
                    return;
                  }
                }
              }
            } catch (err) {
              reject(err);
            }
          }
        };
        xhr.send(stringifyWithoutCircular(payload, true));
      } catch (error) {
        reject(error);
      }
    });
  }

  checkQueueLengthAndProcess() {
    if (this.queue.length > 0) {
      this.process();
    }
  }

  /**
   * A helper function that will process the transformation
   * and return the transformed event payload
   *
   */
  process() {
    this.isTransformationProcessing = true;
    const firstElement = this.queue.shift();
    const payload = createPayload(firstElement.event, this.authToken);

    // Send event for transformation with payload, writekey and retryAttempt
    this.sendEventForTransformation(payload, this.retryAttempt)
      .then((outcome) => {
        this.isTransformationProcessing = false;
        firstElement.cb(outcome);
        this.checkQueueLengthAndProcess();
      })
      .catch((err) => {
        if (typeof err === 'string') {
          handleError(err);
        } else {
          handleError(err.message);
        }
        this.isTransformationProcessing = false;
        // send null as response in case of error or retry fail
        firstElement.cb({ transformedPayload: null });
        this.checkQueueLengthAndProcess();
      });
  }

  start() {
    setInterval(() => {
      if (!this.isTransformationProcessing) {
        this.checkQueueLengthAndProcess();
      }
    }, EVENT_CHECK_INTERVAL);
  }

  setAuthToken(token) {
    this.authToken = token;
  }
}

const DeviceModeTransformations = new TransformationsHandler();

export { DeviceModeTransformations };
