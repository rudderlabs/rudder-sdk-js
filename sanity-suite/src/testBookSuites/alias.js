import alias1ExpectedData from '../../__mocks__/alias1.json';

const aliasMethodSuite = {
  id: 'aliasMethod',
  name: 'Alias',
  description: 'Alias Method: rudderanalytics.alias(to, from, [apiOptions], [callback]);',
  testCases: [
    {
      id: 'alias1',
      description: 'Call with all arguments and all primitives in traits and apiOptions',
      inputData: [
        'newCustomUserID',
        'customUserID',
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
      expectedResult: alias1ExpectedData,
      triggerHandler: 'alias',
    },
  ],
};

export { aliasMethodSuite };
