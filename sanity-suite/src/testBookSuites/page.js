import page1ExpectedData from '../../__mocks__/page1.json';

const pageMethodSuite = {
  id: 'pageMethod',
  name: 'Page',
  description:
    'Page Method: rudderanalytics.page(category, name, [properties], [apiOptions], [callback]);',
  testCases: [
    {
      id: 'page1',
      description: 'Call with all arguments and all primitives in traits and apiOptions',
      inputData: [
        'Cart',
        'Cart Item',
        {
          initial_referrer: '$direct',
          initial_referring_domain: '',
          name: 'Cart Item',
          referring_domain: '',
          tab_url: 'http://localhost:4000/',
          path: '/best-seller/1',
          referrer: 'https://www.google.com/search?q=estore+bestseller',
          search: 'estore bestseller',
          title: 'The best sellers offered by EStore',
          url: 'https://www.estore.com/best-seller/1',
          temp: 12345,
          temp1: null,
          temp2: undefined,
          temp3: [1, 2, 3],
          temp4: {
            selectedType: 'hard copy',
            typesAvailable: ['kindle edition', 'audio book', 'hard copy', null],
          },
        },
        {
          key1: [1, 2, 3, 4],
          key2: 'sample text',
          key3: false,
          key4: 9087654,
          key5: {
            key6: 'sample text 2',
            key7: [
              {
                color: '#3456789',
                name: null,
              },
              {
                color: '#3456767',
                name: 'Red',
              },
            ],
          },
          key8: null,
          key9: undefined,
          device: {
            id: 'sdfghj567-cghj5678-fghjvbn888',
          },
          library: {
            name: 'Random JavaScript SDK',
            version: '2.22.0',
          },
          context: {
            metaData: {
              appVersion: '2.8.0',
              appId: '1hKOmRA4GRlm',
              release_stage: 'Production',
            },
          },
          integrations: {
            All: false,
            'Google Analytics': true,
            Amplitude: true,
          },
          anonymousId: 'sample anonymousId',
          originalTimestamp: '2023-01-13T08:13:58.548Z',
          channel: 'random',
          traits: {
            subscribed: true,
            plan: 'Gold',
            endDate: '2023-04-13T08:13:58.548Z',
            startDate: '2023-01-13T08:13:58.548Z',
          },
        },
      ],
      expectedResult: page1ExpectedData,
      triggerHandler: 'page',
    },
  ],
};

export { pageMethodSuite };
