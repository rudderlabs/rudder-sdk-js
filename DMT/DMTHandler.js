/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable consistent-return */
import { replacer, removeTrailingSlashes } from '../utils/utils';
import logger from '../utils/logUtil';

class TransformationsHandler {
  constructor() {
    this.retryAttempt = 3; // default value for retry
    this.queue = [];
    this.isTransformationProcessing = false;
  }

  init(writeKey, dataPlaneUrl) {
    this.dataPlaneUrl = removeTrailingSlashes(dataPlaneUrl);
    this.writeKey = writeKey;
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
   * A helper function that will take rudderEelement as an event and generate
   * a batch payload that will be sent to transformation server
   *
   */
  createPayload(event) {
    const orderNo = Date.now();
    const payload = {
      batch: [
        {
          orderNo,
          event,
        },
      ],
    };

    return payload;
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

        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            try {
              const { status } = xhr;
              let { response } = xhr;

              if (status === 200) {
                if (response && typeof response === 'string') {
                  response = JSON.parse(response);
                } else {
                  reject(`[Transformation]:: Transformation failed. Invalid response from server.`);
                  return;
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
                /**
                 * Filter the successful transformed event
                 */
                const transformationResponse = [];
                response.transformedBatch.forEach((dest) => {
                  transformationResponse.push({
                    id: dest.id,
                    payload: dest.payload.filter((tEvent) => tEvent.status === '200'),
                  });
                });

                resolve({
                  transformedPayload: transformationResponse,
                  transformationServerAccess: true,
                });
                return;
              }
              if (status === 400) {
                const errorMessage = response
                  ? `[Transformation]:: ${response}`
                  : `[Transformation]:: Invalid request payload`;
                reject(errorMessage);
                return;
              }
              if (status === 404) {
                resolve({
                  transformedPayload: payload.batch,
                  transformationServerAccess: false,
                });
                return;
              }

              // If the request is not successful
              // one or more transformation is unsuccessfull
              // retry till the retryAttempt is exhausted
              if (retryAttempt > 0) {
                const newretryAttempt = retryAttempt - 1;
                setTimeout(() => {
                  return this.sendEventForTransformation(payload, newretryAttempt)
                    .then(resolve)
                    .catch(reject);
                }, 500);
              } else {
                // Even after all the retries event transformation
                // is not successful, ignore the event
                reject(`[Transformation]:: Transformation failed with status ${status}`);
                return;
              }
            } catch (err) {
              reject(err);
            }
          }
        };

        xhr.send(JSON.stringify(payload, replacer));
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
    const payload = this.createPayload(firstElement.event);

    // Send event for transformation with payload, writekey and retryAttempt
    this.sendEventForTransformation(payload, this.retryAttempt)
      .then((outcome) => {
        this.isTransformationProcessing = false;
        firstElement.cb(outcome);
        this.checkQueueLengthAndProcess();
      })
      .catch((err) => {
        if (typeof err === 'string') {
          logger.error(err);
        } else {
          logger.error(err.message);
        }
        this.isTransformationProcessing = false;
        // send null as response in case of error or retry fail
        firstElement.cb({ transformedPayload: null });
        this.checkQueueLengthAndProcess();
      });
  }

  start() {
    const self = this;
    setInterval(() => {
      if (!self.isTransformationProcessing && self.queue.length > 0) {
        self.process();
      }
    }, 100);
  }
}

const transformationsHandler = new TransformationsHandler();

export { transformationsHandler as TransformationsHandler };
