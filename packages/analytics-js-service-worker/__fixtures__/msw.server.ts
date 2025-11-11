import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { dummyDataplaneHost } from './fixtures';

let capturedRequestBody: any = null;

const server = setupServer(
  http.post(`${dummyDataplaneHost}/v1/batch`, async ({ request }) => {
    capturedRequestBody = await request.json();
    return new HttpResponse(null, {
      status: 200,
    });
  }),
);

const resetCapturedRequestBody = () => {
  capturedRequestBody = null;
};

const getCapturedRequestBody = () => capturedRequestBody;

export { server, capturedRequestBody, resetCapturedRequestBody, getCapturedRequestBody };
