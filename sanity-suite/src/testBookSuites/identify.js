import identify1ExpectedData from '../../__mocks__/identify1.json';

const identifyMethodSuite = {
  id: 'identifyMethod',
  name: 'Identify',
  description:
    'Identify Method: rudderanalytics.identify(userId, [traits], [apiOptions], [callback]);',
  testCases: [
    {
      id: 'identify1',
      description: 'Call with all arguments and all primitives in traits and apiOptions',
      inputData: [
        'customUserID',
        {
          name: 'John Doe',
          title: 'CEO',
          email: 'name.surname@domain.com',
          company: 'Company123',
          phone: '123-456-7890',
          rating: 'Hot',
          city: 'Austin',
          postalCode: '12345',
          country: 'US',
          street: 'Sample Address',
          state: 'TX',
        },
        {},
      ],
      expectedResult: identify1ExpectedData,
      triggerHandler: 'identify',
    },
  ],
};

export { identifyMethodSuite };
