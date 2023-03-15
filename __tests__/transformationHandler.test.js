/* eslint-disable no-plusplus */
import { DeviceModeTransformations } from '../src/features/core/deviceModeTransformation/transformationHandler';
import { createPayload } from '../src/features/core/deviceModeTransformation/util';

const sdkName = 'RudderLabs JavaScript SDK';

describe('Test suite for device mode transformation feature', () => {
  DeviceModeTransformations.init('write-key', 'data-plane-url');

  const event = {
    message: {
      channel: 'web',
      context: {
        library: {
          name: sdkName,
          version: '2.5.2',
        },
      },
      type: 'page',
      messageId: 'a65e19c7-a937-4c7a-8349-8d1c7e9bbf9f',
      originalTimestamp: '2022-07-23T15:18:36.998Z',
      anonymousId: '1f7618d8-6ada-4d1c-b2c8-923fbfdd142d',
      userId: '',
      event: null,
      properties: {
        name: 'page view',
        path: '/',
        referrer: '$direct',
        referring_domain: '',
        search: '',
        title: 'Document',
        url: 'http://localhost:4000/',
        tab_url: 'http://localhost:4000/',
        initial_referrer: '$direct',
        initial_referring_domain: '',
      },
      integrations: {
        All: true,
      },
      user_properties: null,
      name: 'page view',
    },
  };
  let payload;

  const retryCount = 3;
  const samplePayloadSuccess = {
    transformedBatch: [
      {
        id: '2CO2YmLozA3SZe6JtmdmMKTrCOl',
        payload: [
          {
            orderNo: 1659505271417,
            status: '200',
            event: {
              message: {
                anonymousId: '7105960b-0174-4d31-a7a1-561925dedde3',
                channel: 'web',
                context: {
                  library: {
                    name: sdkName,
                    version: '2.9.2',
                  },
                },
                integrations: {
                  All: true,
                },
                messageId: '1659505271412300-2d882451-7f50-4f23-b5ac-919fa8a1957d',
                name: 'page view 123',
                originalTimestamp: '2022-08-03T05:41:11.412Z',
                properties: {},
                type: 'page',
              },
            },
          },
        ],
      },
    ],
  };

  const samplePayloadPartialSuccess = {
    transformedBatch: [
      {
        id: '2CO2YmLozA3SZe6JtmdmMKTrCOl',
        payload: [
          {
            orderNo: 1659505271417,
            status: '200',
            event: {
              message: {
                anonymousId: '7105960b-0174-4d31-a7a1-561925dedde3',
                channel: 'web',
                context: {
                  library: {
                    name: sdkName,
                    version: '2.9.2',
                  },
                },
                integrations: {
                  All: true,
                },
                messageId: '1659505271412300-2d882451-7f50-4f23-b5ac-919fa8a1957d',
                name: 'page view 123',
                originalTimestamp: '2022-08-03T05:41:11.412Z',
                properties: {},
                type: 'page',
              },
            },
          },
        ],
      },
      {
        id: '2CO2YmLozA3SZe6JtmdmMKTrCKr',
        payload: [
          {
            orderNo: 1659505271418,
            status: '400',
          },
        ],
      },
    ],
  };

  const xhrMock = {
    open: jest.fn(),
    setRequestHeader: jest.fn(),
    onreadystatechange: jest.fn(),
    readyState: 4,
  };

  const xhrMockSuccess = {
    ...xhrMock,
    response: JSON.stringify(samplePayloadSuccess),
    status: 200,
  };
  xhrMockSuccess.send = () => {
    xhrMockSuccess.onreadystatechange();
  };

  const xhrMockSuccessWithInvalidResponse = {
    ...xhrMock,
    response: samplePayloadSuccess,
    status: 200,
  };
  xhrMockSuccessWithInvalidResponse.send = () => {
    xhrMockSuccessWithInvalidResponse.onreadystatechange();
  };

  const xhrMockPartialSuccess = {
    ...xhrMock,
    response: JSON.stringify(samplePayloadPartialSuccess),
    status: 200,
  };

  xhrMockPartialSuccess.send = () => {
    xhrMockPartialSuccess.onreadystatechange();
  };

  const xhrMockAccessDenied = {
    ...xhrMock,
    response: JSON.stringify({}),
    status: 404,
  };
  xhrMockAccessDenied.send = () => {
    xhrMockAccessDenied.onreadystatechange();
  };

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

  const xhrMockBadReq = {
    ...xhrMock,
    response: 'order number must be an integar',
    status: 400,
  };
  xhrMockBadReq.send = () => {
    xhrMockBadReq.onreadystatechange();
  };

  beforeEach(() => {
    payload = createPayload(event, 'sample-auth-token');
  });

  it('Validate payload format', () => {
    expect(payload).toEqual({
      metadata: {
        'Custom-Authorization': 'sample-auth-token',
      },
      batch: [
        {
          orderNo: expect.any(Number),
          event: event.message,
        },
      ],
    });
  });

  it('Transformation server returning response in right format in case of successful transformation', async () => {
    window.XMLHttpRequest = jest.fn(() => xhrMockSuccess);

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
    window.XMLHttpRequest = jest.fn(() => xhrMockSuccessWithInvalidResponse);

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
    window.XMLHttpRequest = jest.fn(() => xhrMockAccessDenied);

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
    window.XMLHttpRequest = jest.fn(() => xhrMockServerDown);

    await DeviceModeTransformations.sendEventForTransformation(payload, retryCount)
      .then((response) => {
        console.log(response);
        expect('to').toBe('fail');
      })
      .catch((e) => {
        expect(typeof e).toBe('string');
        expect(xhrMockServerDown.attempt).toEqual(retryCount + 1); // retryCount+ first attempt
      });
  });

  it('Transformation server returning response for partial success,SDK silently drops the unsuccessful events and procced', async () => {
    window.XMLHttpRequest = jest.fn(() => xhrMockPartialSuccess);

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

  it('Transformation server returns bad request error', async () => {
    window.XMLHttpRequest = jest.fn(() => xhrMockBadReq);

    await DeviceModeTransformations.sendEventForTransformation(payload, retryCount)
      .then((response) => {
        console.log(response);
        expect('to').toBe('fail');
      })
      .catch((e) => {
        expect(typeof e).toBe('string');
      });
  });
});
