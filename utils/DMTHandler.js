/* eslint-disable consistent-return */
import retry from 'retry';
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
        // destinationIds,
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
const sendEventForTransformation = (payload, writeKey, cb) => {
  const url = 'https://1939f7f9-dbec-4189-9c94-4603cf391d42.mock1.pstmn.io/v1/transform';
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
        if (xhr.status === 200) {
          return cb(null, xhr.response);
        }
        return cb(
          new Error(`request failed with status: ${xhr.status}${xhr.statusText} for url: ${url}`),
        );
      }
    };
    xhr.send(JSON.stringify(payload, replacer));
  } catch (error) {
    return cb(error);
  }
};

/**
 * A helper function that will process the transformation
 * and return the transformed event payload
 *
 */
const processTransformation = (event, cb, writeKey) => {
  // createPayload
  const payload = createPayload(event);

  // default values for retry
  const retryCount = 3;
  const operation = retry.operation({
    retries: retryCount + 1,
    factor: 2,
    minTimeout: 1 * 1000,
    maxTimeout: 3 * 1000,
  });
  operation.attempt((currentAttempt) => {
    // Even after all the retries event transformation
    // is not successful, ignore the event
    // send null as response
    if (currentAttempt === retryCount + 2) {
      logger.error(`Retry also failed. Dropping the event`);
      operation.stop();
      return cb(null);
    }
    // Send event for transformation with payload, writekey and a callback fn.
    sendEventForTransformation(payload, writeKey, (err, res) => {
      if (err) {
        operation.retry(err);
      } else {
        let response;
        if (typeof res === 'string') {
          response = JSON.parse(res);
        }
        // If event transformation is successful for all the destination
        // send the response back
        // else retry
        if (response.transformedBatch.every((tEvent) => tEvent.status === 200))
          return cb(response.transformedBatch);
        operation.retry(new Error(`One or more event transformation is unsuccessful`));
      }
    });
  });
};

export { createPayload, sendEventForTransformation, processTransformation };
