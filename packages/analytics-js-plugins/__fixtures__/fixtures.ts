import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';

const sdkName = 'RudderLabs JavaScript SDK';
const rudderEventPage = {
  properties: {
    path: '',
    referrer: '',
    search: '',
    title: '',
    url: '',
    name: 'Cart Viewed',
    category: 'Home',
    referring_domain: '',
    tab_url: 'http://localhost:3001/index.html',
    initial_referrer: '$direct',
    initial_referring_domain: '',
    token: 'sample token',
  },
  name: 'Cart Viewed',
  category: 'Home',
  type: 'page',
  channel: 'web',
  context: {
    traits: {
      name: 'John Doe',
      title: 'CEO',
      email: 'name.surname@domain.com',
      company: 'Company123',
      phone: '123-456-7890',
      city: 'Austin',
      postalCode: '12345',
      country: 'US',
      street: 'Sample Address',
      state: 'TX',
    },
    sessionId: 1695960096754,
    consentManagement: {},
    app: {
      name: sdkName,
      namespace: 'com.rudderlabs.javascript',
      version: 'dev-snapshot',
    },
    library: {
      name: sdkName,
      version: 'dev-snapshot',
    },
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    os: {
      name: '',
      version: '',
    },
    locale: 'en-GB',
    screen: {
      width: 1728,
      height: 1117,
      density: 2,
      innerWidth: 1659,
      innerHeight: 379,
    },
    campaign: {},
    page: {
      path: '/index.html',
      referrer: '$direct',
      referring_domain: '',
      search: '',
      title: '',
      url: 'http://localhost:3001/index.html',
      tab_url: 'http://localhost:3001/index.html',
      initial_referrer: '$direct',
      initial_referring_domain: '',
    },
  },
  originalTimestamp: '2023-09-29T04:01:42.622Z',
  integrations: {
    All: true,
  },
  messageId: 'ff73a416-c3a4-4759-9982-73cd3pob4576',
  userId: 'customUserID',
  anonymousId: '1901c08d-d505-41cd-81a6-060457fad648',
  event: null,
} as unknown as RudderEvent;

const errorMessage = 'Invalid request payload';

const dummyDataplaneHost = 'https://dummy.dataplane.host.com';

const dmtSuccessResponse = {
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
                  version: 'dev-snapshot',
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

const dmtPartialSuccessResponse = {
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
                  version: 'dev-snapshot',
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
          status: '410',
        },
      ],
    },
  ],
};

const dummyWriteKey = 'dummy-write-key';
const authToken = 'sample-auth-token';

export {
  rudderEventPage,
  dummyDataplaneHost,
  errorMessage,
  dmtSuccessResponse,
  dmtPartialSuccessResponse,
  dummyWriteKey,
  authToken,
};
