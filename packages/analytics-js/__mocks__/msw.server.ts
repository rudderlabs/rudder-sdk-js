import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { dummyDataplaneHost } from './fixtures';

// TODO: Why on data plane we allow-origin the domain but in sourceConfig is wildcard?
const server = setupServer(
  rest.get(`${dummyDataplaneHost}/rawSample`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.text('{"raw": "sample"}'));
  }),
  rest.get(`${dummyDataplaneHost}/brokenJsonSample`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.text('{raw: sample}'),
      ctx.set('Content-Type', 'application/json; charset=utf-8'),
    );
  }),
  rest.get(`${dummyDataplaneHost}/emptyJsonSample`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.text(''),
      ctx.set('Content-Type', 'application/json; charset=utf-8'),
    );
  }),
  rest.get(`${dummyDataplaneHost}/jsonSample`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ json: 'sample' }));
  }),
  rest.get(`${dummyDataplaneHost}/404ErrorSample`, (req, res, ctx) => {
    return res(ctx.status(404));
  }),
  rest.get(`${dummyDataplaneHost}/429ErrorSample`, (req, res, ctx) => {
    return res(ctx.status(429));
  }),
  rest.get(`${dummyDataplaneHost}/500ErrorSample`, (req, res, ctx) => {
    return res(ctx.status(500));
  }),
);

export { server };
