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
        },
        {},
      ],
      expectedResult: track1ExpectedData,
      triggerHandler: 'track',
    },
  ],
};

export { trackMethodSuite };
