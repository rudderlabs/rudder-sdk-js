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
          dob: new Date(),
          address: [
            {
              city: 'Austin',
              postalCode: 12345,
              country: 'US',
              street: 'Sample Address',
              state: 'TX',
              label: 'Home',
              defaultAddress: true,
            },
            {
              city: 'Houston',
              postalCode: 345678,
              country: 'US',
              street: 'Sample Address 2',
              state: 'TX',
              label: 'Office',
              defaultAddress: false,
            },
            {
              city: 'Dallas',
              postalCode: 987654,
              country: 'US',
              street: 'Sample Address 3',
              state: 'TX',
              label: 'Toms place',
              defaultAddress: false,
            },
          ],
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
          externalIds: [
            {
              id: 'some_external_id_1',
              type: 'brazeExternalId',
            },
          ],
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
          timestamp: new Date(),
        },
      ],
      expectedResult: identify1ExpectedData,
      triggerHandler: 'identify',
    },
  ],
};

export { identifyMethodSuite };
