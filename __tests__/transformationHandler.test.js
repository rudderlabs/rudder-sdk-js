/* eslint-disable no-plusplus */
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
  const xhrMockServerDown = {
    attempt: 0,
    open: jest.fn(),
    setRequestHeader: jest.fn(),
    onreadystatechange: jest.fn(),
    readyState: 4,
    response: null,
    status: 500,
  };
  xhrMockServerDown.send = () => {
    xhrMockServerDown.onreadystatechange();
    xhrMockServerDown.attempt++;
  };

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

  it('Transformation server response is in wrong format in case of successful transformation', async () => {
    DeviceModeTransformations.init(dummyWriteKey, `${dummyDataplaneHost}/invalidResponse`);

    await DeviceModeTransformations.sendEventForTransformation(payload, retryCount)
      .then((response) => {
        console.log(response);
        expect('to').toBe('fail');
      })
      .catch((e) => {
        expect(typeof e).toBe('string');
      });
  });

  it('Validate whether the SDK is sending the orginal event in case server returns 404', async () => {
    DeviceModeTransformations.init(dummyWriteKey, `${dummyDataplaneHost}/accessDenied`);

    await DeviceModeTransformations.sendEventForTransformation(payload, retryCount)
      .then((response) => {
        expect(response.transformationServerAccess).toEqual(false);
        expect(response.transformedPayload).toEqual(payload.batch);

        const destObj = response.transformedPayload[0];

        expect(Object.prototype.hasOwnProperty.call(destObj, 'event')).toBe(true);
        expect(Object.prototype.hasOwnProperty.call(destObj, 'orderNo')).toBe(true);
        expect(Object.prototype.hasOwnProperty.call(destObj, 'id')).toBe(false);
        expect(Object.prototype.hasOwnProperty.call(destObj, 'payload')).toEqual(false);
      })
      .catch((e) => {
        console.log(e);
        expect('to').toBe('fail');
      });
  });

  it('Validate whether the SDK is retrying the request in case failures', async () => {
    DeviceModeTransformations.init(dummyWriteKey, `${dummyDataplaneHost}/serverDown`);

    await DeviceModeTransformations.sendEventForTransformation(payload, retryCount)
      .then((response) => {
        console.log(response);
        expect('to').toBe('fail');
      })
      .catch((e) => {
        expect(typeof e).toBe('string');
        // expect(xhrMockServerDown.attempt).toEqual(retryCount + 1); // retryCount+ first attempt
      });
  });

  it('Transformation server returning response for partial success,SDK silently drops the unsuccessful events and procced', async () => {
    DeviceModeTransformations.init(dummyWriteKey, `${dummyDataplaneHost}/partialSuccess`);

    await DeviceModeTransformations.sendEventForTransformation(payload, retryCount)
      .then((response) => {
        let totalTransformedEvents = 0;
        let successfulTransformedEvents = 0;
        samplePayloadPartialSuccess.transformedBatch.forEach((dest) => {
          totalTransformedEvents += dest.payload.length;
        });
        response.transformedPayload.forEach((dest) => {
          dest.payload.forEach((tEvent) => {
            if (tEvent.status === '200') successfulTransformedEvents++;
          });
        });
        expect(successfulTransformedEvents).toBeLessThan(totalTransformedEvents);
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
        expect('to').toBe('fail');
      })
      .catch((e) => {
        expect(typeof e).toBe('string');
        expect(e).toEqual(actualErrorMessage);
      });
  });

  it('Transformation server returns success after intermediate retry', async () => {
    xhrMockServerDown.attempt = 0;
    window.XMLHttpRequest = jest.fn(() => xhrMockServerDown);

    // After first attempt fails SDK retries after 500 milliseconds.
    // So, used a delay of 1 sec to get success after first attempt and atleast one retry.
    setTimeout(() => {
      xhrMockServerDown.status = 200;
      xhrMockServerDown.response = JSON.stringify(samplePayloadSuccess);
    }, 1000);

    await DeviceModeTransformations.sendEventForTransformation(payload, retryCount)
      .then((response) => {
        expect(xhrMockServerDown.attempt).toBeGreaterThan(1);
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
