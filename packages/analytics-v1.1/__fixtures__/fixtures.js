const dummyWriteKey = 'dummyWriteKey';

const dummyDataplaneHost = 'https://dummy.dataplane.host.com';
const sdkName = 'RudderLabs JavaScript SDK';
const errorMessage = 'order number must be an integer';
const actualErrorMessage = '[Transformation]:: order number must be an integer';

const samplePageEvent = {
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

export {
  dummyWriteKey,
  dummyDataplaneHost,
  retryCount,
  samplePageEvent,
  samplePayloadSuccess,
  samplePayloadPartialSuccess,
  errorMessage,
  actualErrorMessage,
};
