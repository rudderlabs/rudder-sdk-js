/* eslint-disable no-plusplus */
import { http, HttpResponse } from 'msw';
import { DeviceModeTransformations } from '../src/features/core/deviceModeTransformation/transformationHandler';
import { createPayload } from '../src/features/core/deviceModeTransformation/util';
import { server } from '../__fixtures__/msw.server';
import {
  dummyDataplaneHost,
  dummyWriteKey,
  samplePageEvent,
  retryCount,
  samplePayloadPartialSuccess,
  actualErrorMessage,
  samplePayloadSuccess,
} from '../__fixtures__/fixtures';

describe('Test suite for device mode transformation feature', () => {
  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  let payload;
  const destinationIds = ['id1', 'id2', 'id3'];
  beforeEach(() => {
    payload = createPayload(samplePageEvent, destinationIds, 'sample-auth-token');
  });

  it('Validate payload format', () => {
    expect(payload).toEqual({
      metadata: {
        'Custom-Authorization': 'sample-auth-token',
      },
      batch: [
        {
          orderNo: expect.any(Number),
          destinationIds,
          event: samplePageEvent.message,
        },
      ],
    });
  });

  it('Transformation server returning response in right format in case of successful transformation', async () => {
    DeviceModeTransformations.init(dummyWriteKey, `${dummyDataplaneHost}/success`);

    await DeviceModeTransformations.sendEventForTransformation(payload, retryCount)
      .then(response => {
        expect(Array.isArray(response.transformedPayload)).toEqual(true);

        const destObj = response.transformedPayload[0];

        expect(typeof destObj).toEqual('object');
        expect(Object.prototype.hasOwnProperty.call(destObj, 'id')).toEqual(true);
        expect(Object.prototype.hasOwnProperty.call(destObj, 'payload')).toEqual(true);
      })
      .catch(e => {
        console.log(e);
        expect('to').toBe('fail');
      });
  });

  it('Validate whether the SDK is sending the original event in case server returns 404', async () => {
    DeviceModeTransformations.init(dummyWriteKey, `${dummyDataplaneHost}/accessDenied`);

    await DeviceModeTransformations.sendEventForTransformation(payload, retryCount)
      .then(response => {
        expect(response.status).toEqual(404);
      })
      .catch(e => {
        console.log(e);
        expect('to').toBe('fail');
      });
  });

  it('Validate whether the SDK is retrying the request in case failures', async () => {
    let counter = 0;
    server.use(
      http.post(`${dummyDataplaneHost}/serverDown/transform`, () => {
        counter += 1;
        return new HttpResponse(null, {
          status: 500,
        });
      }),
    );

    DeviceModeTransformations.init(dummyWriteKey, `${dummyDataplaneHost}/serverDown`);

    await DeviceModeTransformations.sendEventForTransformation(payload, retryCount)
      .then(response => {
        console.log(response);
        expect(counter).toEqual(retryCount + 1); // retryCount+ first attempt
        expect(response.errorMessage).toBe('Retries exhausted');
        expect(response.status).toBe(500);
      })
      .catch(e => {
        expect(typeof e).toBe('string');
        expect(counter).toEqual(retryCount + 1); // retryCount+ first attempt
      });
  });

  it('should not filter transformed events that are not 200', async () => {
    DeviceModeTransformations.init(dummyWriteKey, `${dummyDataplaneHost}/partialSuccess`);

    await DeviceModeTransformations.sendEventForTransformation(payload, retryCount)
      .then(response => {
        let totalTransformedEvents = 0;
        let totalTransformedEventsInResponse = 0;
        samplePayloadPartialSuccess.transformedBatch.forEach(dest => {
          totalTransformedEvents += dest.payload.length;
        });
        response.transformedPayload.forEach(dest => {
          totalTransformedEventsInResponse += dest.payload.length;
        });
        expect(totalTransformedEventsInResponse).toEqual(totalTransformedEvents);
      })
      .catch(e => {
        console.log(e);
        expect('to').toBe('fail');
      });
  });

  it('Transformation server returns bad request error', async () => {
    DeviceModeTransformations.init(dummyWriteKey, `${dummyDataplaneHost}/badRequest`);

    await DeviceModeTransformations.sendEventForTransformation(payload, retryCount)
      .then(response => {
        console.log(response);
        expect(typeof response.errorMessage).toBe('string');
        expect(response.status).toBe(400);
      })
      .catch(e => {
        expect(typeof e).toBe('string');
        expect(e).toEqual(actualErrorMessage);
      });
  });

  it('Transformation server returns success after intermediate retry', async () => {
    let counter = 0;
    server.use(
      http.post(`${dummyDataplaneHost}/success/transform`, () => {
        if (counter === 0) {
          counter += 1;
          return new HttpResponse(null, {
            status: 500,
          });
        }
        counter += 1;
        return new HttpResponse(JSON.stringify(samplePayloadSuccess), {
          status: 200,
        });
      }),
    );

    DeviceModeTransformations.init(dummyWriteKey, `${dummyDataplaneHost}/success`);

    await DeviceModeTransformations.sendEventForTransformation(payload, retryCount)
      .then(response => {
        expect(counter).toBeGreaterThan(1);
        expect(Array.isArray(response.transformedPayload)).toEqual(true);

        const destObj = response.transformedPayload[0];

        expect(typeof destObj).toEqual('object');
        expect(Object.prototype.hasOwnProperty.call(destObj, 'id')).toEqual(true);
        expect(Object.prototype.hasOwnProperty.call(destObj, 'payload')).toEqual(true);
      })
      .catch(e => {
        console.log(e);
        expect('to').toBe('fail');
      });
  });
});
