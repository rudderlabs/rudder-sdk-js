/* eslint-disable no-param-reassign */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable consistent-return */
import { replacer } from './utils';
import logger from './logUtil';

// default values for retry
const retryCount = 3;

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
    // const url = `${dataPlaneUrl}/transform`;
    const url = 'https://shadowfax-dataplane.dev-rudder.rudderlabs.com/transform';
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`${writeKey}:`)}`,
    };
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      Object.keys(headers).forEach((k) => xhr.setRequestHeader(k, headers[k]));

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          try {
            const { status } = xhr;
            if (status === 200) {
              let { response } = xhr;
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
            if (status === 404) {
              resolve({
                transformedPayload: payload.batch,
                transformationServerAccess: false,
              });
              return;
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
};

/**
 * A helper function that will process the transformation
 * and return the transformed event payload
 *
 */
const processTransformation = (event, writeKey, dataPlaneUrl, cb) => {
  // createPayload
  const payload = createPayload(event);

  // Send event for transformation with payload, writekey and retryCount
  sendEventForTransformation(payload, writeKey, dataPlaneUrl, retryCount)
    .then((outcome) => {
      return cb(outcome);
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
