import { rest } from 'msw';
import { dummyDataplaneHost, dummySourceConfigResponse } from './fixtures';

// TODO: Why on data plane we allow-origin the domain but in sourceConfig is wildcard?
const handlers = [
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
  rest.get(`${dummyDataplaneHost}/noConnectionSample`, (req, res, ctx) => {
    return res.networkError('Failed to connect');
  }),
  rest.get(`${dummyDataplaneHost}/jsFileSample`, (req, res, ctx) => {
    const fileContents = 'console.log("jsFileSample script executed")';
    return res(
      ctx.status(200),
      ctx.set('Content-Length', fileContents.length.toString()),
      ctx.set('Content-Type', 'text/javascript'),
      ctx.body(fileContents),
    );
  }),
  rest.get(`${dummyDataplaneHost}/jsFileEmpty`, (req, res, ctx) => {
    const fileContents = '';
    return res(
      ctx.status(200),
      ctx.set('Content-Length', fileContents.length.toString()),
      ctx.set('Content-Type', 'text/javascript'),
      ctx.body(fileContents),
    );
  }),
  rest.get(`${dummyDataplaneHost}/sourceConfig`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(dummySourceConfigResponse));
  }),
];

export { handlers };
