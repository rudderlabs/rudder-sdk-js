/* eslint-disable no-plusplus */
import { rest } from 'msw';
import { DeviceModeTransformations } from '../src/features/core/deviceModeTransformation/transformationHandler';
import { createPayload } from '../src/features/core/deviceModeTransformation/util';
import { server } from '../__mocks__/msw.server';
import {
  dummyDataplaneHost,
  dummyWriteKey,
  samplePageEvent,
  retryCount,
  samplePayloadPartialSuccess,
  actualErrorMessage,
  samplePayloadSuccess,
} from '../__mocks__/fixtures';

describe('Test suite for device mode transformation feature', () => {
  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  let payload;

  beforeEach(() => {
    payload = createPayload(samplePageEvent, 'sample-auth-token');
  });

  it('Validate payload format', () => {
    expect(payload).toEqual({
      metadata: {
        'Custom-Authorization': 'sample-auth-token',
      },
      batch: [
        {
          orderNo: expect.any(Number),
          event: samplePageEvent.message,
        },
      ],
    });
  });

  it('Transformation server returning response in right format in case of successful transformation', async () => {
    DeviceModeTransformations.init(dummyWriteKey, `${dummyDataplaneHost}/success`);

    await DeviceModeTransformations.sendEventForTransformation(payload, retryCount)
      .then((response) => {
        expect(response.transformationServerAccess).toEqual(true);
        expect(Array.isArray(response.transformedPayload)).toEqual(true);

        const destObj = response.transformedPayload[0];

        expect(typeof destObj).toEqual('object');
        expect(Object.prototype.hasOwnProperty.call(destObj, 'id')).toEqual(true);
        expect(Object.prototype.hasOwnProperty.call(destObj, 'payload')).toEqual(true);
      })
      .catch((e) => {
        console.log(e);
        expect('to').toBe('fail');
      });
  });

  it('Validate whether the SDK is sending the orginal event in case server returns 404', async () => {
    DeviceModeTransformations.init(dummyWriteKey, `${dummyDataplaneHost}/accessDenied`);

    await DeviceModeTransformations.sendEventForTransformation(payload, retryCount)
      .then((response) => {
        expect(response.transformationServerAccess).toEqual(false);
        expect(response.status).toEqual(404);
      })
      .catch((e) => {
        console.log(e);
        expect('to').toBe('fail');
      });
  });

  it('Validate whether the SDK is retrying the request in case failures and send retryExhausted flag as true', async () => {
    let counter = 0;
    server.use(
      rest.post(`${dummyDataplaneHost}/serverDown/transform`, (req, res, ctx) => {
        counter += 1;
        return res(ctx.status(500));
      }),
    );

    DeviceModeTransformations.init(dummyWriteKey, `${dummyDataplaneHost}/serverDown`);

    await DeviceModeTransformations.sendEventForTransformation(payload, retryCount)
      .then((response) => {
        console.log(response);
        expect(counter).toEqual(retryCount + 1); // retryCount+ first attempt
        expect(response.transformationServerAccess).toBe(true);
        expect(response.retryExhausted).toBe(true);
        expect(response.status).toBe(500);
      })
      .catch((e) => {
        expect(typeof e).toBe('string');
        expect(counter).toEqual(retryCount + 1); // retryCount+ first attempt
      });
  });

  it('Should not filter transformed events that are not 200', async () => {
    DeviceModeTransformations.init(dummyWriteKey, `${dummyDataplaneHost}/partialSuccess`);

    await DeviceModeTransformations.sendEventForTransformation(payload, retryCount)
      .then((response) => {
        let totalTransformedEvents = 0;
        let totalTransformedEventsInResponse = 0;
        samplePayloadPartialSuccess.transformedBatch.forEach((dest) => {
          totalTransformedEvents += dest.payload.length;
        });
        response.transformedPayload.forEach((dest) => {
          totalTransformedEventsInResponse += dest.payload.length;
        });
        expect(totalTransformedEventsInResponse).toEqual(totalTransformedEvents);
      })
      .catch((e) => {
        console.log(e);
        expect('to').toBe('fail');
      });
  });

  it('Transformation server returns bad request error', async () => {
    DeviceModeTransformations.init(dummyWriteKey, `${dummyDataplaneHost}/badRequest`);

    await DeviceModeTransformations.sendEventForTransformation(payload, retryCount)
      .then((response) => {
        console.log(response);
        expect(response.transformationServerAccess).toBe(true);
        expect(typeof response.errorMessage).toBe('string');
        expect(response.status).toBe(400);
      })
      .catch((e) => {
        expect(typeof e).toBe('string');
        expect(e).toEqual(actualErrorMessage);
      });
  });

  it('Transformation server returns success after intermediate retry', async () => {
    let counter = 0;
    server.use(
      rest.post(`${dummyDataplaneHost}/success/transform`, (req, res, ctx) => {
        if (counter === 0) {
          counter += 1;
          return res(ctx.status(500));
        }
        counter += 1;
        return res(ctx.status(200), ctx.json(samplePayloadSuccess));
      }),
    );

    DeviceModeTransformations.init(dummyWriteKey, `${dummyDataplaneHost}/success`);

    await DeviceModeTransformations.sendEventForTransformation(payload, retryCount)
      .then((response) => {
        expect(counter).toBeGreaterThan(1);
        expect(response.transformationServerAccess).toEqual(true);
        expect(Array.isArray(response.transformedPayload)).toEqual(true);

        const destObj = response.transformedPayload[0];

        expect(typeof destObj).toEqual('object');
        expect(Object.prototype.hasOwnProperty.call(destObj, 'id')).toEqual(true);
        expect(Object.prototype.hasOwnProperty.call(destObj, 'payload')).toEqual(true);
      })
      .catch((e) => {
        console.log(e);
        expect('to').toBe('fail');
      });
  });
});
