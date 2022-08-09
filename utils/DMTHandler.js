/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable consistent-return */
import { replacer } from './utils';
import logger from './logUtil';

/**
 * A helper function that will take rudderEelement as an event and generate
 * a batch payload that will be sent to transformation server
 *
 */
const createPayload = (event) => {
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
};

/**
 * A helper function that will take one payload at a time and send it to transformation server
 * and return the response
 *
 */
const sendEventForTransformation = (payload, writeKey, dataPlaneUrl, retryCount) => {
  return new Promise((resolve, reject) => {
    const url = `${dataPlaneUrl}/transform`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`${writeKey}:`)}`,
    };
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      Object.keys(headers).forEach((k) => xhr.setRequestHeader(k, headers[k]));

      const retryFailMsg = 'Retry failed. Dropping the event';
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          try {
            if (xhr.status === 200) {
              let { response } = xhr;
              if (response && typeof response === 'string') {
                response = JSON.parse(response);
              } else {
                return reject('Not a valid response');
              }
              /**
               * Sample Response format:
               * {
                  "transformedBatch" :[
                    {
                      "id": "destination-id",
                      "status": "200",
                      "payload": [
                        {
                          "orderNo":1,
                          "event": {
                            "message": { ...}
                        }]
                    }]
                  } 
               */
              /**
               * If event transformation is successful for all the destination
               * send the response back
               */
              if (
                response.transformedBatch.every((dest) =>
                  dest.payload.every((tEvent) => tEvent.status === '200'),
                )
              )
                return resolve({
                  transformedBatch: response.transformedBatch,
                  transformationServerAccess: true,
                });
            }
            if (xhr.status === 404) {
              return resolve({
                transformedBatch: payload.batch,
                transformationServerAccess: false,
              });
            }

            // If the request is not successful
            // one or more transformation is unsuccessfull
            // retry till the retryCount is exhausted
            if (retryCount > 0) {
              const newRetryCount = retryCount - 1;
              setTimeout(() => {
                return sendEventForTransformation(payload, writeKey, dataPlaneUrl, newRetryCount)
                  .then(resolve)
                  .catch(reject);
              }, 1000 * (Math.floor(Math.random() * 3) + 1));
            } else {
              // Even after all the retries event transformation
              // is not successful, ignore the event
              return reject(retryFailMsg);
            }
          } catch (err) {
            return reject(err);
          }
        }
      };

      xhr.send(JSON.stringify(payload, replacer));
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * A helper function that will process the transformation
 * and return the transformed event payload
 *
 */
const processTransformation = (event, writeKey, dataPlaneUrl, cb) => {
  // createPayload
  const payload = createPayload(event);

  // default values for retry
  const retryCount = 3;

  // Send event for transformation with payload, writekey and retryCount
  sendEventForTransformation(payload, writeKey, dataPlaneUrl, retryCount)
    .then((outcome) => {
      return cb(outcome.transformedBatch, outcome.transformationServerAccess);
    })
    .catch((err) => {
      if (typeof err === 'string') {
        logger.error(err);
      } else {
        logger.error(err.message);
      }
      // send null as response in case of error or retry fail
      return cb(null);
    });
};

export { createPayload, sendEventForTransformation, processTransformation };
