/* eslint-disable consistent-return */
import { replacer } from './utils';

/**
 * A helper function that will take rudderEelement as an event and generate
 * a batch payload that will be sent to transformation server
 *
 */
const createPayload = (event, destinationIds) => {
  const orderNo = Date.now();
  const payload = {
    batch: [
      {
        orderNo,
        event,
        destinationIds,
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
const sendEventForTransformation = (payload, writeKey) => {
  const url = 'https://hosted.rudderlabs.com/v1/batch';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${btoa(`${writeKey}:`)}`,
  };
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    // for (const k in headers) {
    Object.keys(headers).forEach((k) => xhr.setRequestHeader(k, headers[k]));

    xhr.responseType = 'json';
    // xhr.timeout = timeout;
    // xhr.ontimeout = queueFn;
    // xhr.onerror = queueFn;
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        return xhr.response;
      }
    };

    xhr.send(JSON.stringify(payload, replacer));
  } catch (error) {
    return 400;
  }
};

/**
 * A helper function that will take one payload at a time and send it to transformation server
 * and return the response
 *
 */
const processTransformation = (event, destinationIds, writeKey) => {
  // TODO
  // createPayload
  const payload = createPayload(event, destinationIds);
  // sendEventForTransformation
  sendEventForTransformation(payload, writeKey);

  // Get the response if required retry
  // formatting the response
};

export { createPayload, sendEventForTransformation, processTransformation };
