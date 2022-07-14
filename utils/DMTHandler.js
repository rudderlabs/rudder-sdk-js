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
const sendEventForTransformation = (payload, writeKey, retryCount) => {
  return new Promise((resolve, reject) => {
    const url = 'https://1939f7f9-dbec-4189-9c94-4603cf391d42.mock.pstmn.io/v1/transform';
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`${writeKey}:`)}`,
    };
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      Object.keys(headers).forEach((k) => xhr.setRequestHeader(k, headers[k]));
      xhr.send(JSON.stringify(payload, replacer));

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            let response;
            if (typeof xhr.response === 'string') {
              response = JSON.parse(xhr.response);
            }
            // If event transformation is successful for all the destination
            // send the response back
            if (response.transformedBatch.every((tEvent) => tEvent.destination.status === '200'))
              return resolve(response.transformedBatch);
          }
          if (retryCount > 0) {
            const newRetryCount = retryCount - 1;
            setTimeout(() => {
              return resolve(sendEventForTransformation(payload, writeKey, newRetryCount));
            }, 1000);
          } else {
            // Even after all the retries event transformation
            // is not successful, ignore the event
            return reject(`Retry failed. Dropping the event`);
          }
        }
      };
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
const processTransformation = (event, writeKey, cb) => {
  // createPayload
  const payload = createPayload(event);

  // default values for retry
  const retryCount = 3;

  // Send event for transformation with payload, writekey and retryCount
  sendEventForTransformation(payload, writeKey, retryCount)
    .then((transformedBatch) => {
      return cb(transformedBatch);
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
