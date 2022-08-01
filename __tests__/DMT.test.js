import {
  createPayload,
  sendEventForTransformation,
  processTransformation,
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
  sendEventForTransformation(payload, '2CHyKEa3T9kF1Fa2nCqjptA1QIH', 'data-plane-url', retryCount)
    .then()
    .catch();

  it('Validate payload format', () => {
    expect(typeof payload).toBe('object');
    expect(payload.hasOwnProperty('batch')).toBe(true);
    expect(typeof payload.batch[0]).toBe('object');
    expect(typeof payload.batch[0].orderNo).toBe('number');
    expect(payload.batch[0].event).toBe(event);
  });

  it('Transformation server returning response in right format', () => {});
});
