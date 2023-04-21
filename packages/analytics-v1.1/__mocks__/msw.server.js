import { setupServer } from 'msw/node';
import { handlers } from './msw.handlers';

const server = setupServer(...handlers);

export { server };
