import { http, HttpResponse } from 'msw';
import {
  dummyDataplaneHost,
  dmtSuccessResponse,
  dmtPartialSuccessResponse,
  errorMessage,
} from './fixtures';

const handlers = [
  http.post(`${dummyDataplaneHost}/success/transform`, () => {
    return new HttpResponse(JSON.stringify(dmtSuccessResponse), {
      status: 200,
    });
  }),
  http.post(`${dummyDataplaneHost}/partialSuccess/transform`, () => {
    return new HttpResponse(JSON.stringify(dmtPartialSuccessResponse), {
      status: 200,
    });
  }),
  http.post(`${dummyDataplaneHost}/invalidResponse/transform`, () => {
    return new HttpResponse(dmtSuccessResponse, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  }),
  http.post(`${dummyDataplaneHost}/badRequest/transform`, () => {
    return new HttpResponse(errorMessage, {
      status: 400,
    });
  }),
  http.post(`${dummyDataplaneHost}/accessDenied/transform`, () => {
    return new HttpResponse(errorMessage, {
      status: 404,
    });
  }),
  http.post(`${dummyDataplaneHost}/serverDown/transform`, () => {
    return new HttpResponse(errorMessage, {
      status: 500,
    });
  }),
  http.get(`https://asdf.com/bugsnag.min.js`, () => {
    return new HttpResponse(errorMessage, {
      status: 404,
    });
  }),
];

export { handlers };
