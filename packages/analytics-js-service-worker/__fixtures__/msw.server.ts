import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { dummyDataplaneHost } from './fixtures';

const server = setupServer(
  http.post(`${dummyDataplaneHost}/v1/batch`, () => {
    return new HttpResponse(null, {
      status: 200,
    });
  }),
);

export { server };
