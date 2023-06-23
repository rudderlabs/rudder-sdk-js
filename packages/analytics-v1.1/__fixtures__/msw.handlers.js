import { rest } from 'msw';
import {
  dummyDataplaneHost,
  samplePayloadSuccess,
  samplePayloadPartialSuccess,
  errorMessage,
} from './fixtures';

const handlers = [
  rest.post(`${dummyDataplaneHost}/success/transform`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(samplePayloadSuccess));
  }),
  rest.post(`${dummyDataplaneHost}/partialSuccess/transform`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(samplePayloadPartialSuccess));
  }),
  rest.post(`${dummyDataplaneHost}/invalidResponse/transform`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.text(samplePayloadSuccess),
      ctx.set('Content-Type', 'application/json; charset=utf-8'),
    );
  }),
  rest.post(`${dummyDataplaneHost}/badRequest/transform`, (req, res, ctx) => {
    return res(ctx.status(400), ctx.text(errorMessage));
  }),
  rest.post(`${dummyDataplaneHost}/accessDenied/transform`, (req, res, ctx) => {
    return res(ctx.status(404));
  }),
  rest.post(`${dummyDataplaneHost}/serverDown/transform`, (req, res, ctx) => {
    return res(ctx.status(500));
  }),
];

export { handlers };
