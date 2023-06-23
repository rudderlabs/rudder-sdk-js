import { setupServer } from 'msw/node';
import { dummyDataplaneHost } from './fixtures';
import { rest } from 'msw';

const server = setupServer(
  rest.post(`${dummyDataplaneHost}/v1/batch`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
);

//   {
//   url: `${dummyDataplaneHost}/v1/batch`,
//   response: () => null,
//   status: 200,
//   method: 'post',
//   responseHeaders: { Environment: 'local' },
// }

export { server };
