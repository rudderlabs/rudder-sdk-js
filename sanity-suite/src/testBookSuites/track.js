import track1ExpectedData from '../../__mocks__/track1.json';

const trackMethodSuite = {
  id: 'trackMethod',
  name: 'Track',
  description:
    'Track Method: rudderanalytics.track(event, [properties], [apiOptions], [callback]);',
  testCases: [
    {
      id: 'track1',
      description: 'Call with all arguments and all primitives in traits and apiOptions',
      inputData: [
        'Order Completed',
        {
          revenue: 30,
          currency: 'USD',
          user_actual_id: 12345,
          productId: '234567-sdfghj-345tygh-567890dfghj',
          productCategory: 'clothing',
          paid: true,
          paymentMode: 4,
          paymentModeName: 'online',
          productSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
          sampleObj: {
            sampleObj1: {
              newKey: 'sample text',
            },
            newKey1: 3456789009876543,
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
      expectedResult: track1ExpectedData,
      triggerHandler: 'track',
    },
  ],
};

export { trackMethodSuite };
