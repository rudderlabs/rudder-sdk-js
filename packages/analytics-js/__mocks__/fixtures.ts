const identifyRequestPayload = {
  userId: '123456',
  traits: {
    name: 'Name Username',
    email: 'name@website.com',
    plan: 'Free',
    friends: 21,
  },
};

const trackRequestPayload = {
  userId: '123456',
  event: 'Item Viewed',
  properties: {
    revenue: 19.95,
    shippingMethod: 'Premium',
  },
};

const pageRequestPayload = {
  userId: '12345',
  category: 'Food',
  name: 'Pizza',
  properties: {
    url: 'https://dominos.com',
    title: 'Pizza',
    referrer: 'https://google.com',
  },
};

const screenRequestPayload = {
  userId: '12345',
  category: 'Food',
  name: 'Pizza',
  properties: {
    screenSize: 10,
    title: 'Pizza',
    referrer: 'https://google.com',
  },
};

const groupRequestPayload = {
  userId: '12345',
  groupId: '1',
  traits: {
    name: 'Company',
    description: 'Google',
  },
};

const aliasRequestPayload = {
  previousId: 'old_id',
  userId: 'new_id',
};

const dummyWriteKey = 'dummyWriteKey';

const dummyDataplaneHost = 'https://dummy.dataplane.host.com';

const dummyInitOptions = {
  timeout: false,
  flushAt: 1,
  flushInterval: 200000,
  maxInternalQueueSize: 1,
  logLevel: 'off',
  enable: true,
};

const dummySourceConfigResponse = {
  source: {
    config: {
      statsCollection: {
        errorReports: {
          enabled: false,
        },
        metrics: {
          enabled: false,
        },
      },
    },
    id: '2L8FlAECp1sEUP7NVilWLTeA2wp',
    name: 'JS SDK Prod',
    writeKey: '2L8Fl7ryPss3Zku133Pj5ox7NeP',
    enabled: true,
    workspaceId: '2L8FgwnU8Q4I4nQbdqmin8uP5n8',
    updatedAt: '2023-02-03T13:53:35.731Z',
    dataplanes: {},
    destinations: [
      {
        config: {
          measurementId: 'G-SC6JGSYH6H',
          capturePageView: 'rs',
          whitelistedEvents: [
            {
              eventName: '',
            },
          ],
          blacklistedEvents: [
            {
              eventName: '',
            },
          ],
          useNativeSDKToSend: false,
          eventFilteringOption: 'disable',
          extendPageViewParams: false,
          oneTrustCookieCategories: [],
        },
        id: '2LoR1TbVG2bcISXvy7DamldfkgO',
        name: 'GA4 for JS SDK',
        updatedAt: '2023-03-14T11:34:29.216Z',
        enabled: true,
        deleted: false,
        destinationDefinition: {
          name: 'GA4',
          displayName: 'Google Analytics 4 (GA4)',
          updatedAt: '2023-03-14T11:21:29.656Z',
        },
        areTransformationsConnected: true,
      },
    ],
  },
};

export {
  identifyRequestPayload,
  trackRequestPayload,
  pageRequestPayload,
  screenRequestPayload,
  groupRequestPayload,
  aliasRequestPayload,
  dummyWriteKey,
  dummyInitOptions,
  dummyDataplaneHost,
  dummySourceConfigResponse,
};
