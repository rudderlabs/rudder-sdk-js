import { setupServer } from 'msw/node';
import { dummyDataplaneHost } from './fixtures';

const server = setupServer({
  url: `${dummyDataplaneHost}/v1/batch`,
  response: () => null,
  status: 200,
  method: 'post',
  responseHeaders: { Environment: 'local' },
});

export { server };
