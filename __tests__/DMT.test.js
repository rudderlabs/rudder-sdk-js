import {
  createPayload,
  sendEventForTransformation,
} from '../utils/DMTHandler';

describe('Test suite for device mode transformation feature', () => {
  const event = {
    message: {
      channel: 'web',
      context: {
        library: {
          name: 'RudderLabs JavaScript SDK',
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
  const payload = createPayload(event);
  const retryCount = 3;
  const samplePayloadSuccess = {
	"transformedBatch": [{
		"id": "2CO2YmLozA3SZe6JtmdmMKTrCOl",
		"payload": [{
			"orderNo": 1659505271417,
			"status": "200",
			"event": {
				"message": {
					"anonymousId": "7105960b-0174-4d31-a7a1-561925dedde3",
					"channel": "web",
					"context": {
						"library": {
							"name": "RudderLabs JavaScript SDK",
							"version": "2.9.2"
						},
					},
					"integrations": {
						"All": true
					},
					"messageId": "1659505271412300-2d882451-7f50-4f23-b5ac-919fa8a1957d",
					"name": "page view 123",
					"originalTimestamp": "2022-08-03T05:41:11.412Z",
					"properties": {
					},
					"type": "page",
				}
			}
		}]
	}]
};

const samplePayloadPartialSuccess = {
	"transformedBatch": [{
		"id": "2CO2YmLozA3SZe6JtmdmMKTrCOl",
		"payload": [{
			"orderNo": 1659505271417,
			"status": "200",
			"event": {
				"message": {
					"anonymousId": "7105960b-0174-4d31-a7a1-561925dedde3",
					"channel": "web",
					"context": {
						"library": {
							"name": "RudderLabs JavaScript SDK",
							"version": "2.9.2"
						},
					},
					"integrations": {
						"All": true
					},
					"messageId": "1659505271412300-2d882451-7f50-4f23-b5ac-919fa8a1957d",
					"name": "page view 123",
					"originalTimestamp": "2022-08-03T05:41:11.412Z",
					"properties": {
					},
					"type": "page",
				}
			}
		}]
	},{
		"id": "2CO2YmLozA3SZe6JtmdmMKTrCKr",
		"payload": [{
			"orderNo": 1659505271418,
			"status": "400"
		}]
	}]
};

  const xhrMock = {
    open: jest.fn(),
    setRequestHeader: jest.fn(),
    onreadystatechange: jest.fn(),
    send: jest.fn(),
    readyState: 4
  };
  const xhrMockSuccess = {
    ...xhrMock,
    response: JSON.stringify(samplePayloadSuccess),
    status: 200,
  };

  let xhrMockPartialSuccess = {
    ...xhrMock,
    attempt: 0,
    response: JSON.stringify(samplePayloadPartialSuccess),
    status: 200,
  };

  xhrMockPartialSuccess['send'] = ()=>{
    xhrMockPartialSuccess.onreadystatechange();
    xhrMockPartialSuccess.attempt++;
  };

  const xhrMockAccessDenied = {
    ...xhrMock,
    response: JSON.stringify({}),
    status: 404,
  };

  let xhrMockServerDown = {
    attempt: 0,
    open: jest.fn(),
    setRequestHeader: jest.fn(),
    onreadystatechange: jest.fn(),
    readyState: 4,
    response: null,
    status: 500
  };
  xhrMockServerDown['send'] = ()=>{
    xhrMockServerDown.onreadystatechange();
    xhrMockServerDown.attempt++;
  };

  it('Validate payload format', () => {
    expect(typeof payload).toBe('object');
    expect(payload.hasOwnProperty('batch')).toBe(true);
    expect(typeof payload.batch[0]).toBe('object');
    expect(typeof payload.batch[0].orderNo).toBe('number');
    expect(payload.batch[0].event).toBe(event);
  });

  it('Transformation server returning response in right format in case of successful transformation', () => {
    
    window.XMLHttpRequest = jest.fn(() => xhrMockSuccess);
    setTimeout(() => {
      xhrMockSuccess.onreadystatechange();
    }, 0);
    return sendEventForTransformation(payload, 'write-key', 'data-plane-url', retryCount)
    .then((response)=>{
      expect(xhrMockSuccess.send).toHaveBeenCalledTimes(1);
      expect(Array.isArray(response.transformedBatch)).toEqual(true);
      expect(typeof response.transformationServerAccess).toEqual('boolean');

      const destObj = response.transformedBatch[0];

      expect(typeof destObj).toEqual('object');
      expect(destObj.hasOwnProperty('id')).toEqual(true);
      expect(destObj.hasOwnProperty('payload')).toEqual(true);
    });
  });

  it('Validate whether the SDK is sending the orginal event in case server returns 404', () => {
    window.XMLHttpRequest = jest.fn(() => xhrMockAccessDenied);
    setTimeout(() => {
      xhrMockAccessDenied.onreadystatechange();
    }, 0);
    return sendEventForTransformation(payload, 'write-key', 'data-plane-url', retryCount)
    .then((response)=>{
      expect(xhrMockSuccess.send).toHaveBeenCalledTimes(1);
      expect(response.transformedBatch).toEqual(payload.batch);

      const destObj = response.transformedBatch[0];

      expect(destObj.hasOwnProperty('event')).toBe(true);
      expect(destObj.hasOwnProperty('orderNo')).toBe(true);
      expect(destObj.hasOwnProperty('id')).toBe(false);
      expect(destObj.hasOwnProperty('payload')).toEqual(false);

    });
  });

  it('Validate whether the SDK is retrying the request in case failures', async() => {
    window.XMLHttpRequest = jest.fn(() => xhrMockServerDown);

    await sendEventForTransformation(payload, 'write-key', 'data-plane-url', retryCount)
    .then((response)=>{
    })
    .catch((e)=>{
      console.log(e);
      expect(typeof e).toBe('string');
      expect(xhrMockServerDown.attempt).toEqual(retryCount+1); //retryCount+ first attempt
    });
  });
});
