// import { FAILED_REQUEST_ERR_MSG_PREFIX } from '@rudderstack/analytics-js-common/constants/errors';
// import type { IXHRRequestOptions } from '@rudderstack/analytics-js-common/types/HttpClient';
// import { clone } from 'ramda';
// import { DELIVERY_ERROR, REQUEST_ERROR, XHR_SEND_ERROR } from '../../../constants/logMessages';
// import { HttpClientError } from '../utils';

// const makeXHRRequest = (url: string | URL, options: IXHRRequestOptions): Promise<Response> =>
//   new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest();
//     const xhrError = (e?: ProgressEvent) => {
//       reject(
//         new HttpClientError(
//           REQUEST_ERROR(FAILED_REQUEST_ERR_MSG_PREFIX, url, options.timeout as number, e),
//           xhr.status,
//           xhr.statusText,
//           xhr.responseText,
//         ),
//       );
//     };

//     try {
//       xhr.open(options.method, url, true);
//     } catch (err: any) {
//       // clone the error object and add the status, statusText, and responseBody properties
//       const clonedErr: HttpClientError = clone(err);
//       clonedErr.message = `${XHR_SEND_ERROR(FAILED_REQUEST_ERR_MSG_PREFIX, url)}: ${err.message}`;
//       clonedErr.status = xhr.status;
//       clonedErr.statusText = xhr.statusText;
//       clonedErr.responseBody = xhr.responseText;

//       reject(clonedErr);
//       return;
//     }

//     if (options.withCredentials === true) {
//       xhr.withCredentials = true;
//     }
//     // The timeout property may be set only in the time interval between a call to the open method
//     // and the first call to the send method in legacy browsers
//     xhr.timeout = options.timeout as number;

//     if (options.headers) {
//       Object.entries(options.headers).forEach(([headerName, headerValue]) => {
//         xhr.setRequestHeader(headerName, headerValue);
//       });
//     }

//     xhr.onload = () => {
//       // This is same as fetch API
//       if (xhr.status >= 200 && xhr.status < 300) {
//         resolve(
//           new Response(xhr.responseText, {
//             status: xhr.status,
//             statusText: xhr.statusText,
//           }),
//         );
//       } else {
//         reject(
//           new HttpClientError(
//             DELIVERY_ERROR(FAILED_REQUEST_ERR_MSG_PREFIX, xhr.status, xhr.statusText, url),
//             xhr.status,
//             xhr.statusText,
//             xhr.responseText,
//           ),
//         );
//       }
//     };

//     xhr.ontimeout = xhrError;
//     xhr.onerror = xhrError;
//     xhr.onabort = xhrError;

//     try {
//       xhr.send(options.body);
//     } catch (err: any) {
//       // clone the error object and add the status, statusText, and responseBody properties
//       const clonedErr: HttpClientError = clone(err);
//       clonedErr.message = `${XHR_SEND_ERROR(FAILED_REQUEST_ERR_MSG_PREFIX, url)}: ${err.message}`;
//       clonedErr.status = xhr.status;
//       clonedErr.statusText = xhr.statusText;
//       clonedErr.responseBody = xhr.responseText;

//       reject(clonedErr);
//     }
//   });

// export { makeXHRRequest };
